import {IncomingMessage, ServerResponse} from "http";
import MSG_BACK_TYPE from "../public/MSG_BACK_TYPE"
import MSG_TYPE from "../public/MSG_TYPE"
import PUB_CONST from "../public/PUB_CONST";
import {clt, cl, cet, ce} from "./Util";
import {dbo} from "./MongoDBObject";
import {
  clients,
  fnNotifyAddFriend,
  fnNotifyAddFriendSucceed,
  fnNotifyNewMsg,
  fnNotifyResponseAddFriend
} from "./ServerVar";
import FileUploadServer from "./FileUploadServer";

FileUploadServer()

const assert = require('assert')
const AsyncLock = require('async-lock')
// 注册用户同步锁
const lock = new AsyncLock()
const LOCK_SIGN_UP = 'sign_up'

process.title = 'how_are_you_server'
const WebSocketServer = require('websocket').server
const http = require('http')

let MSG_HANDLER: any = []
MSG_HANDLER[MSG_TYPE.LOGIN] = function (conn: any, data: any, index: any) {
  clt('登录处理器')
  dbo.collection('user').find({
    name: data.name,
    password: data.password
  }).toArray(function (err: any, result: Array<any>) {
    if (err) throw err
    cl(result)
    if (result.length >= 1) {
      clt('查询有该用户，且密码正确，登录成功')
      conn.sendUTF(JSON.stringify({
        type: MSG_BACK_TYPE.LOGIN_SUCC,
        data: data.name
      }))
      // 服务端设置该登录成功用户的ID
      clients[index].id = data.name
      clt('当前有' + clients.length + '个已连接用户')
    } else {
      clt('用户不存在或密码错误，登录失败')
      conn.sendUTF(JSON.stringify({
        type: MSG_BACK_TYPE.LOGIN_FAIL,
        data: data.name
      }))
    }
  })
}
MSG_HANDLER[MSG_TYPE.SEND_CHAT_CONTENT] = function (conn: any, data: any) {
  clt('发送聊天消息处理器')
  cl(data)
  dbo.collection('chat_history').insertOne(data, function (err: any) {
    if (err) throw err
    clt('聊天记录保存到数据库成功')
    // 返回发送消息成功的信息
    conn.sendUTF(JSON.stringify({
      type: MSG_BACK_TYPE.GOT_MSG,
      data: data
    }))
    fnNotifyNewMsg(data)
  })
}
MSG_HANDLER[MSG_TYPE.GET_CHAT_HISTORY] = function (conn: any, data: any) {
  clt('获取聊天记录处理器')
  cl(data)
  dbo.collection('chat_history').find({
    $or: [
      {
        sender: data.partner,
        receiver: data.requester
      },
      {
        sender: data.requester,
        receiver: data.partner
      }
    ]
  }).sort({
    // 按时间顺序排列
    timestamp: 1
  }).toArray(function (err: any, res: any) {
    if (err) throw err
    clt('查询到' + data.requester + '和' + data.partner + '有'
      + res.length + '条聊天记录')
    cl(res)
    // 返回查询到的聊天记录
    conn.sendUTF(JSON.stringify({
      type: MSG_BACK_TYPE.GOT_CHAT_HISTORY,
      data: res
    }))
  })
}
MSG_HANDLER[MSG_TYPE.GET_FRIENDS] = function (conn: any, data: string) {
  clt('获取好友处理器')
  cl(data)
  dbo.collection('friend_list').find({
    a: data
  }).toArray(function (err: any, result: Array<any>) {
    if (err) throw err
    cl(result)
    conn.sendUTF(JSON.stringify({
      type: MSG_BACK_TYPE.GOT_FRIENDS,
      data: JSON.stringify(result)
    }))
  })
}
MSG_HANDLER[MSG_TYPE.REGISTER] = function (conn: any, data: any) {
  clt('注册处理器')
  cl(data)
  lock.acquire(LOCK_SIGN_UP, function () {
    // Concurrency safe 并发安全
    dbo.collection('invite_code').find({
      id: data.inviteCode,
      count: {$gt: 0}
    }).toArray(function (err: any, result: Array<any>) {
      assert.ifError(err)
      cl(result)
      if (result.length === 0) {
        clt('邀请码无效')
        return conn.sendUTF(JSON.stringify({
          type: MSG_BACK_TYPE.REGISTER_FAIL,
          data: {
            errorCode: MSG_BACK_TYPE.REGISTER_FAIL_INVITE_INVALID
          }
        }))
      } else {
        clt('查询到邀请码 ' + result[0].id + ' 剩余有效个数 ' + result[0].count)
        const reservedCount = result[0].count
        dbo.collection('user').find({
          name: data.userName
        }).toArray(function (err: any, result: Array<any>) {
          assert.ifError(err)
          cl(result)
          if (result.length !== 0) {
            cl('已经存在用户名是 ' + data.userName + ' 的用户了')
            return conn.sendUTF(JSON.stringify({
              type: MSG_BACK_TYPE.REGISTER_FAIL,
              data: {
                errorCode: MSG_BACK_TYPE.REGISTER_FAIL_USERNAME_INVALID
              }
            }))
          } else {
            cl(data)
            clt('邀请码和用户名都有效')
            dbo.collection('user').insertOne({
              name: data.userName,
              password: data.password,
              inviteCode: data.inviteCode
            }, function (err: any) {
              assert.ifError(err)
              dbo.collection('invite_code').updateOne({
                id: data.inviteCode
              }, {
                $set: {
                  count: reservedCount - 1
                }
              }, function (err: any, result: any) {
                assert.ifError(err)
                clt('注册成功，邀请码扣除成功')
                // 后台数据库插入自己和自己是好友关系，前台直接返回注册成功结果
                dbo.collection('friend_list').insertOne({
                  a: data.userName,
                  b: data.userName
                }, function (err: any) {
                  assert.ifError(err)
                })
                return conn.sendUTF(JSON.stringify({
                  type: MSG_BACK_TYPE.REGISTER_SUCC,
                  data: {
                    errorCode: MSG_BACK_TYPE.REGISTER_SUCC
                  }
                }))
              })
            })
          }
        })
      }
    })
  }, function (err: any, ret: any) {
    // lock released 事后
    assert.ifError(err)
  });
}
MSG_HANDLER[MSG_TYPE.ADD_FRIEND] = function (conn: any, data: any) {
  clt('加好友处理器')
  cl(data)
  fnNotifyAddFriend(data)
}
MSG_HANDLER[MSG_TYPE.RESPONSE_TO_ADD_FRIEND] = function (conn: any, data: any) {
  clt('回复加好友处理器')
  cl(data)
  if (data.response) {
    // 同意加好友 将好友关系写入数据库
    const insertData = [{
      a: data.sender,
      b: data.receiver
    }, {
      a: data.receiver,
      b: data.sender
    }]
    cl(insertData)
    dbo.collection('friend_list').insertMany(insertData, function (err: any) {
      assert.ifError(err)
      clt(data.sender + ' 和 ' + data.receiver + ' 添加好友成功')
      // 通知被加好友一方
      fnNotifyResponseAddFriend(data)
      // 通知加好友一方
      fnNotifyAddFriendSucceed({
        sender: data.receiver,
        receiver: data.sender,
        msg: data.msg
      })
    })
  } else {
    // 拒绝好友申请
    fnNotifyResponseAddFriend(data)
  }
}


// HTTP server
const server = http.createServer(function (request: IncomingMessage, response: ServerResponse) {
  clt('创建http server' + request + response)
})
server.listen(PUB_CONST.SERVER_PORT, function () {
  clt('正在监听端口' + PUB_CONST.SERVER_PORT)
})
// WebSocket server
const wsServer = new WebSocketServer({
  httpServer: server
})

function wsServerOnRequest(request: any) {
  clt('源 ' + request.origin + ' 已连接')

  // 接受连接
  const connection = request.accept(null, request.origin)
  connection.binaryType = "arraybuffer"
  const index = clients.push({
    conn: connection,
    id: ''
  }) - 1
  clt('当前有' + clients.length + '个已连接用户')

  clt('已接受和' + connection.remoteAddress + '的连接')

  // 用户发送消息
  connection.on('message', function (message: any) {
    if (message.type === 'utf8') {
      let msgObj
      try {
        msgObj = JSON.parse(message.utf8Data)
        clt('客户端发来的msgObj如下')
        cl(msgObj)
      } catch (e) {
        ce(e)
        cet('解析客户端发来的消息时候出错啦')
        return
      }
      MSG_HANDLER[msgObj.type](connection, msgObj.data, index)
    } else if (message.type === 'binary') {
      // TODO 接收到二进制数据
    }
  })

  // 用户断开连接
  connection.on('close', function () {
    clt('用户断开连接')

    // TODO 从已连接列表中移除该客户端 当前做法是直接置空，但是留了个空位
    // clients.splice(index, 1)
    clients[index] = null
    clt('当前有' + clients.length + '个已连接用户')
  })

  connection.on('error', function (error: any) {
    if (error.code === 'ECONNRESET') {
      clt('用户离线')
      // TODO 用户离线之后服务端做什么？
      // 这个被调用之后会调用到 on close
    } else {
      clt('连接出错: ')
      clt(error)
    }
  })
}

// 连接回调函数
wsServer.on('request', wsServerOnRequest)
