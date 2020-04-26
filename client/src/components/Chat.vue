<template>
  <el-container>
    <el-container>
      <el-aside width='15em' style='overflow-x: hidden'>
        <FriendList
            v-bind:array-friend-items='$store.state.arrayFriendItems'
            v-bind:selectedFriend='$store.state.strCurrentChatPartner'>
        </FriendList>
      </el-aside>
      <el-container>
        <el-main>
          <HistoryMsgList
              v-bind:arrayHistoryMsgItems='$store.state.arrayHistoryMsgItems'>
          </HistoryMsgList>
        </el-main>
        <el-footer>
          <b-button-group>
            <!-- see https://bootstrap-vue.js.org/docs/icons choose icons -->
            <b-button variant='light' v-bind:pressed.sync='isChoosingImage'>
              <b-avatar icon='image' variant="light"></b-avatar>
              图片
            </b-button>
            <b-button variant='light' v-bind:pressed.sync='isChoosingFile'>
              <b-avatar icon='file-earmark' variant="light"></b-avatar>
              文件
            </b-button>
            <b-button variant='light'>
              <b-avatar icon='soundwave' variant="light"></b-avatar>
              语音
            </b-button>
            <b-button variant='light'>
              <b-avatar icon='camera-video' variant="light"></b-avatar>
              视频
            </b-button>
          </b-button-group>
          <div
              style='text-align: center;'>
            <el-input
                v-show='!isChoosingImage'
                type='textarea'
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model='strMsgToBeSend'
                v-on:keydown.enter.exact.prevent.native='fnSendMsg'
                v-on:keydown.enter.ctrl.prevent.native='fnAppendNewLine'
                id='el_input_textarea'
                style='margin-top: 0.2em; margin-bottom: 0.2em;'
            >
            </el-input>
          </div>
          <div
              v-if='strInputState==="text"'
              style='text-align: center; margin: 0.2em'
          >
            <picture-input
                ref="pictureInput"
                @change="fnUploadImageOnChange"
                width="600"
                height="200"
                margin="16"
                accept="image/jpeg,image/png"
                size="10"
                :removable="true"
                :customStrings="{
                  upload: '上传',
                  drag: '拖拽图片或点击选取'
                }">
            </picture-input>
            <el-button style='margin-top: 0.2em' @click='fnSendImage'>
              发送
            </el-button>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  import HistoryMsgList from '@/components/chat_ui/HistoryMsgList.vue'
  import FriendList from '@/components/chat_ui/FriendList.vue'
  import store from '@/store'
  import PictureInput from 'vue-picture-input'

  export default {
    name: 'Chat',
    data: function () {
      return {
        strMsgToBeSend: '',
        // text | image | file
        strInputState: 'text',
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
      },
      fnUploadImageOnChange() {
        console.log('选取了新图片')
        if (this.$refs.pictureInput.image) {
          console.log('图片加载成功')
          console.log(this.$refs.pictureInput)
        } else {
          console.error('FileReader API not supported: use the <form>, Luke!')
        }
      },
      fnSendImage() {
        if (!this.$refs.pictureInput.image) return
        console.log('此处发送图片')
        store.commit('fnSendImageByConnection',
          this.$refs.pictureInput.file)
        this.isChoosingImage = false
      }
    },
    components: {
      FriendList,
      HistoryMsgList,
      PictureInput
    }
  }
</script>

<style scoped>

</style>