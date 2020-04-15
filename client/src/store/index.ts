import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";

Vue.use(Vuex);

const cl = console.log
const ce = console.error

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


const MSG_HANDLER: any = []

function fnBuildMsg(type: MSG_TYPE, content: any): string {
  return JSON.stringify({
    type: type,
    data: content
  })
}

const store = new Vuex.Store({
  state() {
    return {
      connection: null,
      userName: '',
      arrayFriendItems: [],
      arrayHistoryMsgItems: [],
      strCurrentChatPartner: ''
    }
  },
  mutations: {
    fnInitConnection() {
      cl('init websocket...')

      // 开启连接
      store.state.connection = new WebSocket('ws://127.0.0.1:10086')

      // 处理三个函数 onopen onerror onmessage

      store.state.connection.onopen = function (event: any) {
        // 连接已就绪 TODO
        cl('成功连接到服务器')
        cl(event.target.url)
      }

      store.state.connection.onerror = function (event: Event) {
        // 发送/接收数据时失败 TODO
        ce('发送或接收数据时发生错误如下:')
        ce(event)
      }

      // 处理服务器发来的消息
      store.state.connection.onmessage = function (messageEvent: MessageEvent) {
        // 处理消息 TODO
        let msgObj = null
        try {
          msgObj = JSON.parse(messageEvent.data)
          cl('解析出的msgObj如下')
          cl(msgObj)
        } catch (e) {
          ce(e)
          ce('服务端返回数据不是JSON: ' + messageEvent.data)
          return
        }

        MSG_HANDLER[msgObj.type](msgObj.data)

      }
    },

    fnSendMsgContentByConnection: function (state: any, content: any) {
      store.state.connection.send(fnBuildMsg(MSG_TYPE.SEND_CHAT_CONTENT,
        {
          sender: store.state.userName,
          receiver: store.state.strCurrentChatPartner,
          timestamp: Date.now(),
          msg: content
        }
      ))
      cl('发送消息完成')
    },

    fnLoginByConnection: function (state: any, userName: string) {
      cl('登录用户名为' + userName)
      store.state.connection.send(fnBuildMsg(MSG_TYPE.LOGIN, userName))
      cl('正在登录')
    },

    fnGetHistoryMsgByConnection: function (state: any, userName: string) {
      cl('获取和' + userName + '的聊天记录')
      store.state.connection.send(fnBuildMsg(MSG_TYPE.GET_CHAT_HISTORY, userName))
    },

    fnGetFriendsByConnection: function (state: any, userName: string) {
      cl('获取' + userName + '的好友列表')
      store.state.connection.send(fnBuildMsg(MSG_TYPE.GET_FRIENDS, userName))
    }
  },
  actions: {},
  modules: {}
});

MSG_HANDLER[MSG_BACK_TYPE.LOGIN_SUCC] = function (data: string) {
  cl('登录成功啦')
  cl('服务端返回的消息为: ' + data)
  router.push('/')
  store.state.userName = data
  store.state.strCurrentChatPartner = data
  store.commit('fnGetFriendsByConnection', data)
  store.commit('fnGetHistoryMsgByConnection', data)
  cl('已重定向到聊天界面')
}
MSG_HANDLER[MSG_BACK_TYPE.LOGIN_FAIL] = function (data: string) {
  cl('登录失败')
  cl('服务端返回的消息为: ' + data)
  alert(data + '登录失败')
}
MSG_HANDLER[MSG_BACK_TYPE.GOT_FRIENDS] = function (data: any) {
  cl('获取到好友列表啦')
  data = JSON.parse(data)
  cl(data)
  const friendsItem: any = []
  for (let i = 0; i < data.length; i++) {
    friendsItem.push({
      name: data[i].b
    })
  }
  cl('组合的好友列表如下')
  cl(friendsItem)
  store.state.arrayFriendItems = friendsItem
}


export default store
