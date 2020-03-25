import Vue from "vue";
import Vuex from "vuex";

import Global from "@/store/global";

Vue.use(Vuex);

enum MSG_TYPE {
  LOGIN,
  CHAT,
}

function fnBuildMsg(type: MSG_TYPE, content: string): string {
  return JSON.stringify({
    type: type,
    data: content
  })
}

export default new Vuex.Store<any>({
  state: function () {
    return {
      userName: ''
    }
  },
  mutations: {
    fnInitConnection() {
      console.log('init websocket...')

      // 开启连接
      Global.connection = new WebSocket('ws://127.0.0.1:10086')

      // 处理三个函数 onopen onerror onmessage

      Global.connection.onopen = function (event: any) {
        // 连接已就绪 TODO
        console.log('成功连接到服务器')
        console.log(event.target.url)
      }

      Global.connection.onerror = function (event: Event) {
        // 发送/接收数据时失败 TODO
        console.log('发送或接收数据时发生错误如下:')
        console.log(event)
      }

      // 处理服务器发来的消息
      Global.connection.onmessage = function (messageEvent: MessageEvent) {
        // 处理消息 TODO
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
        function addMessage(author: string, message: string, dt: string) {
          // TODO 填充消息
          console.log(author + message + dt)
        }

        // 处理接收到的消息
        if (json.type === 'history') {

          for (let i = 0; i < json.data.length; i++) {
            addMessage(json.data[i].author, json.data[i].text,
              new Date(json.data[i].time).toLocaleString())
          }
        } else if (json.type === 'message') {
          // TODO 设置不可以输入
          addMessage(json.data.author, json.data.text,
            new Date(json.data.time).toLocaleString())
        } else if (json.type === 'name_set') {
          // TODO 设置可以输入
          addMessage(json.data.author, '用户名为' + json.data.text,
            new Date(json.data.time).toLocaleString())
        } else {
          console.log('接收到的消息格式不正确')
        }
      }
    },

    fnSendByConnection: function (msgContent: string) {
      Global.connection.send(msgContent)
      // TODO 发送消息
      console.log('消息: `' + msgContent + '`已发送')

    },

    fnLoginByConnection: function (state: any, userName: string) {
      // TODO 登录设置用户名
      console.log('登录用户名为' + userName)
      Global.connection.send(fnBuildMsg(MSG_TYPE.LOGIN, userName))
      console.log('正在登录')
    }
  },
  actions: {},
  modules: {}
});
