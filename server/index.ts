process.title = 'how_are_you_server'
const webSocketServerPort = 10086
const webSocketServer = require('websocket').server
const http = require('http')

enum MSG_TYPE {
  LOGIN,
  CHAT,
}

let chatHistory = []
let clients = []
const clog = function (arg) {
  console.log((new Date()) + ' ' + arg)
}

function htmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// HTTP server
const server = http.createServer(function (request, response) {
  clog('创建http server' + request + response)
})
server.listen(webSocketServerPort, function () {
  clog('正在监听端口' + webSocketServerPort)
})
// WebSocket server
const wsServer = new webSocketServer({
  httpServer: server
})

// 连接回调函数
wsServer.on('request', function (request) {
  clog('源 ' + request.origin + ' 已连接')

  // 接受连接
  const connection = request.accept(null, request.origin)
  const index = clients.push(connection) - 1
  let userName = ''

  clog('Connection accepted')

  // 返回历史消息
  if (chatHistory.length > 0) {
    connection.sendUTF(
      JSON.stringify({type: 'history', data: chatHistory})
    )
  }

  // 用户发送消息
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      if (userName === '') {
        // 记住用户名
        userName = htmlEntities(message.utf8Data)
        connection.sendUTF(JSON.stringify({
          type: 'name_set',
          data: userName
        }))

        clog('User is known as: ' + userName)
      } else {
        // 登录并广播
        clog('Received message from '
          + userName + ': ' + message.utf8Data)

        // 保存所有已发送消息
        const msgObj = {
          time: (new Date()).getTime(),
          text: htmlEntities(message.utf8Data),
          author: userName,
        }
        chatHistory.push(msgObj)

        // 向所有已登录客户端广播消息
        const json = JSON.stringify({type: 'message', data: msgObj})
        for (let i = 0; i < clients.length; i++) {
          clients[i].sendUTF(json)
        }
      }
    }
  })

  // 用户断开连接
  connection.on('close', function (connection) {
    if (userName !== '') {
      clog('Peer '
        + connection.remoteAddress + ' disconnected')

      // 从已连接列表中移除该客户端
      clients.splice(index, 1)
    }
  })

  connection.on('error', function (error) {
    if (error.code === 'ECONNRESET') {
      clog('用户离线')
      // TODO
    } else {
      clog('连接出错: ')
      clog(error)
    }
  })
})


clog('last line')