import Vue from "vue";
import Vuex from "vuex";

import Global from "@/store/global";
import router from "@/router";

Vue.use(Vuex);

const cl = console.log
const ce = console.error

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

const MSG_HANDLER: any = []
MSG_HANDLER[MSG_BACK_TYPE.LOGIN_SUCC] = function (data: string) {
  cl('登录成功啦')
  cl('服务端返回的消息为: ' + data)
  router.push('/')
}
MSG_HANDLER[MSG_BACK_TYPE.LOGIN_FAIL] = function () {
  // TODO
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
      cl('init websocket...')

      // 开启连接
      Global.connection = new WebSocket('ws://127.0.0.1:10086')

      // 处理三个函数 onopen onerror onmessage

      Global.connection.onopen = function (event: any) {
        // 连接已就绪 TODO
        cl('成功连接到服务器')
        cl(event.target.url)
      }

      Global.connection.onerror = function (event: Event) {
        // 发送/接收数据时失败 TODO
        ce('发送或接收数据时发生错误如下:')
        ce(event)
      }

      // 处理服务器发来的消息
      Global.connection.onmessage = function (messageEvent: MessageEvent) {
        // 处理消息 TODO
        let msgObj = null
        try {
          msgObj = JSON.parse(messageEvent.data)
        } catch (e) {
          ce(e)
          ce('服务端返回数据不是JSON: ' + messageEvent.data)
          return
        }

        MSG_HANDLER[msgObj.type](msgObj.data)

        // TODO 写到这里啦....!!!!!!

        // 填充消息
        function addMessage(author: string, message: string, dt: string) {
          // TODO 填充消息
          cl(author + message + dt)
        }


        // 处理接收到的消息
        if (msgObj.type === 'history') {

          for (let i = 0; i < msgObj.data.length; i++) {
            addMessage(msgObj.data[i].author, msgObj.data[i].text,
              new Date(msgObj.data[i].time).toLocaleString())
          }
        } else if (msgObj.type === 'message') {
          // TODO 设置不可以输入
          addMessage(msgObj.data.author, msgObj.data.text,
            new Date(msgObj.data.time).toLocaleString())
        } else if (msgObj.type === 'name_set') {
          // TODO 设置可以输入
          addMessage(msgObj.data.author, '用户名为' + msgObj.data.text,
            new Date(msgObj.data.time).toLocaleString())
        } else {
          cl('接收到的消息格式不正确')
        }
      }
    },

    fnSendByConnection: function (msgContent: string) {
      Global.connection.send(msgContent)
      // TODO 发送消息
      cl('消息: `' + msgContent + '`已发送')

    },

    fnLoginByConnection: function (state: any, userName: string) {
      // TODO 登录设置用户名
      cl('登录用户名为' + userName)
      Global.connection.send(fnBuildMsg(MSG_TYPE.LOGIN, userName))
      cl('正在登录')
    }
  },
  actions: {},
  modules: {}
});
