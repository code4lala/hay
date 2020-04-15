import {IncomingMessage, ServerResponse} from "http";

process.title = 'how_are_you_server'
const webSocketServerPort = 10086
const webSocketServer = require('websocket').server
const http = require('http')

let chatHistory: any = []
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
const cer = console.error

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


// 以下是客户端服务端公共部分 {{{

enum MSG_BACK_TYPE {
  LOGIN_SUCC,
  LOGIN_FAIL,
  GOT_FRIENDS,
  GOT_CHAT_HISTORY,
}

enum MSG_TYPE {
  LOGIN,
  GET_FRIENDS,
  SEND_CHAT_CONTENT,
  GET_CHAT_HISTORY,
}

// 以上是客户端服务端公共部分 }}}

let MSG_HANDLER: any = []
MSG_HANDLER[MSG_TYPE.LOGIN] = function (conn: any, data: string) {
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
}
MSG_HANDLER[MSG_TYPE.GET_CHAT_HISTORY] = function (conn: any, data: string) {
  clt('获取聊天记录处理器')
  cl(data)
  /*

        [
          {user: '李四', msg: '哈哈哈', time: new Date(), id: 1},
          {user: '王五', msg: '嘻嘻嘻', time: new Date(), id: 2}
        ]
   */
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

// HTTP server
const server = http.createServer(function (request: IncomingMessage, response: ServerResponse) {
  clt('创建http server' + request + response)
})
server.listen(webSocketServerPort, function () {
  clt('正在监听端口' + webSocketServerPort)
})
// WebSocket server
const wsServer = new webSocketServer({
  httpServer: server
})

function wsServerOnRequest(request: any) {
  clt('源 ' + request.origin + ' 已连接')

  // 接受连接
  const connection = request.accept(null, request.origin)
  const index = clients.push(connection) - 1
  let userName = ''

  clt('Connection accepted')

  // 返回历史消息
  if (chatHistory.length > 0) {
    connection.sendUTF(
      JSON.stringify({type: 'history', data: chatHistory})
    )
  }

  // 用户发送消息
  connection.on('message', function (message: any) {
    if (message.type !== 'utf8') return
    let msgObj
    try {
      msgObj = JSON.parse(message.utf8Data)
      clt('客户端发来的msgObj如下')
      cl(msgObj)
    } catch (e) {
      cer(e)
      cet('解析客户端发来的消息时候出错啦')
      return
    }
    MSG_HANDLER[msgObj.type](connection, msgObj.data)
  })

  // 用户断开连接
  connection.on('close', function (connection: any) {
    if (userName !== '') {
      clt('Peer '
        + connection.remoteAddress + ' disconnected')

      // 从已连接列表中移除该客户端
      clients.splice(index, 1)
    }
  })

  connection.on('error', function (error: any) {
    if (error.code === 'ECONNRESET') {
      clt('用户离线')
      // TODO
    } else {
      clt('连接出错: ')
      clt(error)
    }
  })
}

// 连接回调函数
wsServer.on('request', wsServerOnRequest)

clt('last line')