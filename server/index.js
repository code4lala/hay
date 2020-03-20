'use strict'

process.title = 'how_are_you'
const webSocketServerPort = 10086
const webSocketServer = require('websocket').server
const http = require('http')

let history = []
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
})
server.listen(webSocketServerPort, function () {
    clog('Server is listening on port '
        + webSocketServerPort)
})
// WebSocket server
const wsServer = new webSocketServer({
    httpServer: server
})

// 连接回调函数
wsServer.on('request', function (request) {
    clog('Connection from origin '
        + request.origin)

    // 接受连接
    const connection = request.accept(null, request.origin)
    const index = clients.push(connection) - 1
    let userName = false;

    clog('Connection accepted')

    // 返回历史消息
    if (history.length > 0) {
        connection.sendUTF(
            JSON.stringify({type: 'history', data: history})
        )
    }

    // 用户发送消息
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            if (userName === false) {
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
                history.push(msgObj)

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
        if (userName !== false) {
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