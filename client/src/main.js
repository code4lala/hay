import Vue from 'vue'
import ClientUi from './client-ui'

Vue.config.productionTip = false

new Vue({
    render: createElement => createElement(ClientUi),
}).$mount('#hay-client')

const fn_init = function () {
    console.log('init...')
    // 如果用户运行在 mozilla 就用内置的 WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket
    // 如果浏览器不支持WebSocket则退出
    if (!window.WebSocket) {
        alert('您的浏览器不支持 WebSocket')
        return
    }

    const SERVER_URL = 'ws://127.0.0.1:10086'

    // 开启连接
    const connection = new WebSocket(SERVER_URL)
    // 处理三个函数 onopen onerror onmessage

    connection.onopen = function () {
        // 连接已就绪 TODO
        console.log('成功连接到服务器 ' + SERVER_URL)
    }

    connection.onerror = function () {
        // 发送/接收数据时失败 TODO
    }

    // 处理服务器发来的消息
    connection.onmessage = function (message) {
        let json = null
        try {
            json = JSON.parse(message.data)
        } catch (e) {
            console.error(e)
            console.log('返回数据不是JSON: '
                + message.data)
            return
        }

        // 填充消息
        function addMessage(author, message, dt) {
            // TODO 填充消息
            console.log(author + message + dt)
        }

        // 处理接收到的消息
        if (json.type === 'history') {

            for (let i = 0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text,
                    new Date(json.data[i].time))
            }
        } else if (json.type === 'message') {
            // TODO 设置不可以输入
            addMessage(json.data.author, json.data.text,
                new Date(json.data.time))
        } else if (json.type === 'name_set') {
            // TODO 设置可以输入
            addMessage(json.data.author, '用户名为' + json.data.text,
                new Date(json.data.time))
        } else {
            console.log('接收到的消息格式不正确')
        }
    }
}

fn_init()
