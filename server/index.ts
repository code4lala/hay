import {IncomingMessage, ServerResponse} from "http";
import MSG_BACK_TYPE from "../public/MSG_BACK_TYPE"
import MSG_TYPE from "../public/MSG_TYPE"

process.title = 'how_are_you_server'
const WEB_SOCKET_SERVER_PORT = 10086
const WebSocketServer = require('websocket').server
const http = require('http')

let clients: any = []

// clt = console log time       cl = console log
// cet = console error time     ce = console error
const clt = function (arg: any) {
  console.log((new Date()) + ' ' + arg)
}
const cl = console.log
const cet = function (arg: any) {
  console.error((new Date()) + ' ' + arg)
}
const ce = console.error

// 连接 mongodb
const MongoClient = require('mongodb').MongoClient
const MONGODB_URL = 'mongodb://localhost'
let dbo: any = null
MongoClient.connect(MONGODB_URL,
  {useNewUrlParser: true, useUnifiedTopology: true},
  function (err: any, mongodb: any) {
    if (err) throw err
    dbo = mongodb.db('hay')
    clt('MongoDB数据库连接成功')
  })


let MSG_HANDLER: any = []
MSG_HANDLER[MSG_TYPE.LOGIN] = function (conn: any, data: string, index: any) {
  clt('登录处理器')
  dbo.collection('user').find({
    name: data
  }).toArray(function (err: any, result: Array<any>) {
    if (err) throw err
    cl(result)
    if (result.length >= 1) {
      clt('查询有该用户，登录成功')
      conn.sendUTF(JSON.stringify({
        type: MSG_BACK_TYPE.LOGIN_SUCC,
        data: data
      }))
      // 服务端设置该登录成功用户的ID
      clients[index].id = data
      clt('当前有' + clients.length + '个已连接用户')
    } else {
      clt('用户不存在，登录失败')
      conn.sendUTF(JSON.stringify({
        type: MSG_BACK_TYPE.LOGIN_FAIL,
        data: data
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
    // 提醒对方有新消息到达 TODO 如何给指定客户端发消息
    // 查找对方是否在线
    clt('当前有' + clients.length + '个已连接用户')
    for (let i = 0; i < clients.length; i++) {
      // TODO 把是否为null去掉
      if (clients[i] === null) continue
      if (clients[i].id === data.receiver) {
        clt('聊天对象' + data.receiver + '在线')
        clients[i].conn.sendUTF(JSON.stringify({
          type: MSG_BACK_TYPE.GOT_NEW_MSG,
          data: data
        }))
        clt('已通知对方有新消息')
        return // TODO 改成break
      }
    }
    // TODO 删掉debug
    clt('聊天对象' + data.receiver + '不在线')
    cl(clients)
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
MSG_HANDLER[MSG_TYPE.SEND_IMAGE] = function (conn: any, data: any) {
  clt('发送图片处理器')
  cl(data)
  cl(data.imageFile)
}

// HTTP server
const server = http.createServer(function (request: IncomingMessage, response: ServerResponse) {
  clt('创建http server' + request + response)
})
server.listen(WEB_SOCKET_SERVER_PORT, function () {
  clt('正在监听端口' + WEB_SOCKET_SERVER_PORT)
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
