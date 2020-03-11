'use strict'

$(function () {
    const content = $('#content')
    const input = $('#input')
    const status = $('#status')
    let myName = false

    // 如果用户运行在 mozilla 就用内置的 WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket
    // 如果浏览器不支持WebSocket则退出
    if (!window.WebSocket) {
        content.html($('<p>', {
            text: '您的浏览器不支持WebSocket'
        }))
        input.hide()
        $('span').hide()
        return
    }

    // 开启连接
    const connection = new WebSocket('ws://127.0.0.1:10086')
    connection.onopen = function () {
        // 连接已就绪
        input.removeAttr('disabled')
        status.text('选择姓名: ')
    }

    connection.onerror = function () {
        // 发送/接收数据时失败
        content.html($('<p>', {
            text: '连接故障'
        }))
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
            content.prepend('<p><span>' + author + '</span> @ ' +
                dt + ': ' + message + '</p>')
        }

        // 处理接收到的消息
        if (json.type === 'history') {

            for (let i = 0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text,
                    new Date(json.data[i].time))
            }
        } else if (json.type === 'message') {
            input.removeAttr('disabled')
            addMessage(json.data.author, json.data.text,
                new Date(json.data.time))
        } else if (json.type === 'name_set') {
            input.removeAttr('disabled')
            addMessage(json.data.author, '用户名为' + json.data.text,
                new Date(json.data.time))
        } else {
            console.log('接收到的消息格式不正确')
        }
    }

    input.keydown(function (e) {
        if (e.keyCode === 13) {
            console.log('回车')
            const msg = $(this).val()
            if (!msg) return
            // 明文发送消息
            connection.send(msg)
            // 输入框置空
            $(this).val('')
            // 禁用输入框
            input.attr('disabled', 'disabled')

            if (myName === false) {
                myName = msg
            }
        }
    })
})
