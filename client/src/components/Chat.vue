<template>
  <div style='margin: 10px'>
    <el-container>
      <el-container>
        <el-aside width="250px">
          <FriendList
              v-bind:array-friend-items='$store.state.arrayFriendItems'
              v-bind:selectedFriend='$store.state.strCurrentChatPartner'>
          </FriendList>
        </el-aside>
        <el-container>
          <el-main style='height: 500px'>
            <HistoryMsgList
                v-bind:arrayHistoryMsgItems='$store.state.arrayHistoryMsgItems'>
            </HistoryMsgList>
          </el-main>
          <el-footer style='height: 250px'>
            <el-input
                type='textarea'
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model='strMsgToBeSend'
                v-on:keydown.enter.exact.prevent.native='fnSendMsg'
                v-on:keydown.enter.ctrl.prevent.native='fnAppendNewLine'
                id='el_input_textarea'
            >
            </el-input>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang='js'>
  import HistoryMsgList from '@/components/chat_ui/HistoryMsgList.vue'
  import FriendList from '@/components/chat_ui/FriendList.vue';
  import store from '@/store';

  export default {
    name: 'Chat',
    data: function () {
      return {
        strMsgToBeSend: ''
      }
    },
    methods: {
      fnAppendNewLine(event) {
        console.log(event)

        // TODO ctrl + enter 换行 定位光标 选取的开始到结束换成换行符 然后定位光标到换行符后边

        this.strMsgToBeSend += '\n'
      },
      fnSendMsg() {
        if (this.strMsgToBeSend === '') return

        console.log('此处发送消息: ' + this.strMsgToBeSend)
        store.commit('fnSendMsgContentByConnection', this.strMsgToBeSend)
        this.strMsgToBeSend = ''
      }
    },
    components: {
      FriendList,
      HistoryMsgList,
    }
  }
</script>

<style scoped>

</style>