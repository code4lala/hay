import Vue from "vue";
import axios from 'axios'
import Vuex from "vuex";
import router from "@/router";
import MSG_BACK_TYPE from "../../../public/MSG_BACK_TYPE"
import MSG_TYPE from "../../../public/MSG_TYPE"
import PUB_CONST from "../../../public/PUB_CONST";

Vue.use(Vuex);

const cl = console.log
const ce = console.error

const MSG_HANDLER: any = []

function fnBuildMsg(type: MSG_TYPE, content: any): string {
  return JSON.stringify({
    type: type,
    data: content
  })
}

const store = new Vuex.Store({
  state: {
    connection: null,
    userName: '',
    arrayFriendItems: [],
    arrayHistoryMsgItems: [],
    strCurrentChatPartner: '',
    intUploadProgress: 0,
    intDownloadProgress: 0,
  },
  mutations: {
    fnInitConnection() {
      cl('init websocket...')

      // 开启连接
      store.state.connection = new WebSocket(PUB_CONST.WEBSOCKET_SERVER_URL)

      store.state.connection.binaryType = 'arraybuffer'

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

    fnGetHistoryMsgByConnection: function () {
      const userName = store.state.strCurrentChatPartner
      cl('获取' + store.state.userName + '和' + userName + '的聊天记录')
      store.state.connection.send(fnBuildMsg(MSG_TYPE.GET_CHAT_HISTORY, {
        requester: store.state.userName,
        partner: userName
      }))
    },

    fnGetFriendsByConnection: function () {
      cl('获取' + store.state.userName + '的好友列表')
      store.state.connection.send(fnBuildMsg(MSG_TYPE.GET_FRIENDS, store.state.userName))
    },

    fnSendFileByConnection: function (state: any, fileAndCallback: any) {
      cl('要发送的文件如下')
      cl(fileAndCallback)
      cl('发送文件到服务器')
      const param = new FormData()
      // TODO 上传文件时验证用户身份
      param.append(PUB_CONST.UPLOAD_FILE_NAME, fileAndCallback.file)
      param.append('sender', store.state.userName)
      param.append('password', store.state.userName)
      param.append('receiver', store.state.strCurrentChatPartner)
      param.append('timestamp', (Date.now()).toString())
      param.append('type', fileAndCallback.sendMsgType.toString())
      axios.post(PUB_CONST.UPLOAD_FILE_URL, param, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'multipart/form-data;charset=UTF-8'
        },
        onUploadProgress: function (e) {
          store.state.intUploadProgress = Math.floor(e.loaded / e.total * 100)
          cl('上传了' + store.state.intUploadProgress + '%')
        }
      }).then(function (response) {
        cl('上传完成')
        // TODO 上传完成
        cl(response)
        fileAndCallback.callback(true)
      }, function (err) {
        ce('上传失败')
        ce(err)
        fileAndCallback.callback(false)
      })
    },

    fnGetFileByConnection: function (state: any, itemAndCallback: any) {
      // TODO 从服务器下载文件
      cl('下载文件')
      cl(itemAndCallback)
      // TODO 下载文件时验证用户身份
      axios({
        url: PUB_CONST.DOWNLOAD_FILE_URL,
        method: "POST",
        data: {
          sender: itemAndCallback.msgItem.sender,
          password: itemAndCallback.msgItem.sender,
          receiver: itemAndCallback.msgItem.receiver,
          timestamp: itemAndCallback.msgItem.timestamp,
          type: itemAndCallback.msgItem.type,
          msg: itemAndCallback.msgItem.msg
        },
        responseType: 'blob'
      }).then(function (response) {
        cl('下载完成')
        // TODO 下载完成
        cl(response)
        itemAndCallback.callback(response.data)
      }, function (err) {
        ce('下载失败')
        ce(err)
      })
    },
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
  store.commit('fnGetHistoryMsgByConnection')
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
      name: data[i].b,
      intNewMsgCount: 0
    })
  }
  cl('组合的好友列表如下')
  cl(friendsItem)
  store.state.arrayFriendItems = friendsItem
}
MSG_HANDLER[MSG_BACK_TYPE.GOT_CHAT_HISTORY] = function (data: any) {
  cl('获取到聊天记录啦')
  cl(data)
  store.state.arrayHistoryMsgItems = data
}
MSG_HANDLER[MSG_BACK_TYPE.GOT_MSG] = function (data: any) {
  cl('消息发送成功，刷新聊天记录窗口')
  cl(data)
  store.commit('fnGetHistoryMsgByConnection')
}
MSG_HANDLER[MSG_BACK_TYPE.GOT_NEW_MSG] = function (data: any) {
  // TODO 新消息到达
  cl('新消息到达啦')
  cl(data)
  // 如果正在和该对象聊天 直接刷新聊天记录
  if (store.state.strCurrentChatPartner === data.sender) {
    store.commit('fnGetHistoryMsgByConnection')
  } else {
    cl('别的聊天对象发来新消息啦')
    store.state.arrayFriendItems.find(function (el: any) {
      return el.name === data.sender
    }).intNewMsgCount++
    // TODO 新消息提醒
  }
}


export default store
