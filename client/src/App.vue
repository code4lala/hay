<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: 'App',
        data: function () {
            return {
                connection: null,

                // 常量
                SERVER_URL: 'ws://127.0.0.1:10086'
            }
        },
        methods: {
            fn_send_by_connection: function (msg_content) {
                this.connection.send(msg_content)
                // TODO 发送消息
                console.log('消息: `' + msg_content + '`已发送')
            },
            fn_recv_from_connection: function () {
            },
            fn_init: function () {
                console.log('init...')
                // 如果用户运行在 mozilla 就用内置的 WebSocket
                window.WebSocket = window.WebSocket || window.MozWebSocket
                // 如果浏览器不支持WebSocket则退出
                if (!window.WebSocket) {
                    alert('您的浏览器不支持 WebSocket 因此无法运行该应用')
                    return
                }

                // 开启连接
                this.connection = new WebSocket(this.SERVER_URL)
                // 处理三个函数 onopen onerror onmessage

                this.connection.onopen = function (event) {
                    // 连接已就绪 TODO
                    console.log('成功连接到服务器 ' + event.target.url + ', 报告的事件如下:')
                    console.log(event)
                }

                this.connection.onerror = function (event) {
                    // 发送/接收数据时失败 TODO
                    console.log('发送或接收数据时发生错误如下:')
                    console.log(event)
                }

                // 处理服务器发来的消息
                this.connection.onmessage = function (messageEvent) {
                    let json = null
                    try {
                        json = JSON.parse(messageEvent.data)
                    } catch (e) {
                        console.error(e)
                        console.log('返回数据不是JSON: '
                            + messageEvent.data)
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
        }
    }
</script>

<style scoped>

</style>