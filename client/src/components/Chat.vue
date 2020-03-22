<template>
  <div style='margin: 10px'>

    <header>
      <div class="row">
        <div class="col-sm-3 col-md-6 col-lg-4 col-xl-2 bg-info">
          Hay!
        </div>
        <div class="col-sm-9 col-md-6 col-lg-8 col-xl-10 bg-warning">
          How are you!
        </div>
      </div>
    </header>

    <main role="main">
      <div class="row">
        <div class="col-sm-3 col-md-6 col-lg-4 col-xl-2 bg-success">
          好友列表
        </div>
        <div class="col-sm-9 col-md-6 col-lg-8 col-xl-10">
          <HistoryMsgList>
          </HistoryMsgList>
          <BaseInputText
              v-model='strMsgToBeSend'
              input-id="input_name_msg_to_be_sent"
              input-placeholder='在此输入要发送的消息...'
              v-on:keydown.enter='fnSendMsg'></BaseInputText>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="row">
        <div class="col-sm-3 col-md-6 col-lg-4 col-xl-2 bg-info">
          底部左侧
        </div>
        <div class="col-sm-9 col-md-6 col-lg-8 col-xl-10 bg-warning">
          底部右侧
        </div>
      </div>
    </footer>

  </div>

</template>

<script lang='ts'>
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import BaseInputText from "@/components/base/BaseInputText.vue"
  import HistoryMsgList from '@/components/chat_ui/HistoryMsgList.vue'

  @Component({
    components: {
      HistoryMsgList,
      BaseInputText
    }
  })
  export default class Chat extends Vue {
    private strMsgToBeSend = ''

    fnSendMsg() {
      console.log('此处发送消息: ' + this.strMsgToBeSend)
    }
  }
</script>

<style scoped>

</style>