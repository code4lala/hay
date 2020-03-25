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

// 以下是客户端服务端公共部分 {{{

enum MSG_BACK_TYPE {
  LOGIN_SUCC,
  LOGIN_FAIL,
}

enum MSG_TYPE {
  LOGIN,
  CHAT,
}

// 以上是客户端服务端公共部分 }}}

let MSG_HANDLER: any = []
MSG_HANDLER[MSG_TYPE.LOGIN] = function (conn: any, data: string) {
  clt('登录消息处理器')
  // TODO 判断用户名密码啥的对不对
  conn.sendUTF(JSON.stringify({
    type: MSG_BACK_TYPE.LOGIN_SUCC,
    data: '登录成功'
  }))
}
MSG_HANDLER[MSG_TYPE.CHAT] = function (conn: any, data: string) {
  clt('聊天内容消息处理器')
  cl(data)
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
    if (userName === '') {
      // 记住用户名
      let msgObj
      try {
        msgObj = JSON.parse(message.utf8Data)
      } catch (e) {
        cer(e)
        cet('解析客户端发来的消息时候出错啦')
      }
      cl(msgObj)
      MSG_HANDLER[msgObj.type](connection, msgObj.data)
      connection.sendUTF(JSON.stringify({
        type: 'name_set',
        data: userName
      }))

      clt('User is known as: ' + userName)
    } else {
      // 登录并广播
      clt('Received message from '
        + userName + ': ' + message.utf8Data)

      // 保存所有已发送消息
      const msgObj = {
        time: (new Date()).getTime(),
        text: message.utf8Data,
        author: userName,
      }
      chatHistory.push(msgObj)

      // 向所有已登录客户端广播消息
      const json = JSON.stringify({type: 'message', data: msgObj})
      for (let i = 0; i < clients.length; i++) {
        clients[i].sendUTF(json)
      }
    }
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