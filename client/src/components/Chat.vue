<template>
  <div style='margin: 10px'>
    <el-container>
      <el-container>
        <el-aside width="200px">
          Hay! {{ $store.state.userName }}
          <FriendList>
          </FriendList>
        </el-aside>
        <el-container>
          <el-main>
            <HistoryMsgList>
            </HistoryMsgList>
          </el-main>
          <el-footer>
            <BaseInputText
                v-model='strMsgToBeSend'
                input-id="input_name_msg_to_be_sent"
                input-placeholder='在此输入要发送的消息...'
                v-on:keydown.enter='fnSendMsg'></BaseInputText>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang='js'>
  import BaseInputText from '@/components/base/BaseInputText.vue'
  import HistoryMsgList from '@/components/chat_ui/HistoryMsgList.vue'
  import FriendList from '@/components/chat_ui/FriendList.vue';

  export default {
    name: 'Chat',
    data: function () {
      return {
        strMsgToBeSend: ''
      }
    },
    methods: {
      fnSendMsg() {

        console.log('此处发送消息: ' + this.strMsgToBeSend)
      }
    },
    components: {
      FriendList,
      HistoryMsgList,
      BaseInputText
    }
  }
</script>

<style scoped>

</style>