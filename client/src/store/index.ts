import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connection: new WebSocket('ws://127.0.0.1:10086')
  },
  mutations: {

    /*
    Property 'onmessage' does not exist on type 'Mutation<{ connection: WebSocket; }>'. TODO
    https://www.google.com/search?q=typescript+websocket
    https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1
    websocket typescript 的示例
     */

    /*

    fnInit() {
      console.log('init...')

      // 开启连接
      // 处理三个函数 onopen onerror onmessage

      this.connection.onopen = function (event: Event) {
        // 连接已就绪 TODO
        console.log('成功连接到服务器')
        console.log(event)
      }

      this.connection.onerror = function (event: Event) {
        // 发送/接收数据时失败 TODO
        console.log('发送或接收数据时发生错误如下:')
        console.log(event)
      }

      // 处理服务器发来的消息
      this.connection.onmessage = function (messageEvent: MessageEvent) {
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
    fn_send_by_connection: function (msg_content: string) {
      this.connection.send(msg_content)
      // TODO 发送消息
      console.log('消息: `' + msg_content + '`已发送')
    },

     */
  },
  actions: {},
  modules: {}
});
