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
          <div style='text-align: center'>
            <b-button-group>
              <!-- see https://bootstrap-vue.js.org/docs/icons choose icons -->
              <b-button variant='light' v-on:click='strInputState = (strInputState === "image" ? "text" : "image")'>
                <b-avatar icon='image' variant="light"></b-avatar>
                图片
              </b-button>
              <b-button variant='light' v-on:click='strInputState = (strInputState === "file" ? "text" : "file")'>
                <b-avatar icon='file-earmark' variant="light"></b-avatar>
                文件
              </b-button>
              <b-button variant='light' v-on:click='strInputState = (strInputState === "audio" ? "text" : "audio")'>
                <b-avatar icon='play' variant="light"></b-avatar>
                语音
              </b-button>
              <b-button variant='light'>
                <b-avatar icon='soundwave' variant="light"></b-avatar>
                语音聊天
              </b-button>
              <b-button variant='light'>
                <b-avatar icon='camera-video' variant="light"></b-avatar>
                视频聊天
              </b-button>
            </b-button-group>
          </div>
          <div style='text-align: center; margin: 0.5em'>
            <el-input
                v-show='strInputState === "text"'
                type='textarea'
                :autosize="{ minRows: 4, maxRows: 4}"
                v-model='strMsgToBeSend'
                v-on:keydown.enter.exact.prevent.native='fnSendMsg'
                v-on:keydown.enter.ctrl.prevent.native='fnAppendNewLine'
                id='el_input_textarea'
            >
            </el-input>
            <div v-if='strInputState === "image"'
            >
              <picture-input
                  ref="pictureInput"
                  @change="fnUploadImageOnChange"
                  width="600"
                  height="200"
                  size="10"
                  :removable="true"
                  :customStrings="{
                  upload: '上传',
                  drag: '拖拽图片或点击选取'
                }">
              </picture-input>
              <el-button @click='fnSendImage' style='margin-top: 0.5em'>
                发送图片 已发送{{$store.state.intUploadProgress}}%
              </el-button>
            </div>
            <div v-show='strInputState === "file"'>
              <b-form-file
                  v-model='fileToBeUpload'
                  placeholder='选取文件'
                  drop-placeholder='拖拽文件到此处'>
              </b-form-file>
              <el-button @click='fnSendFile' style='margin-top: 0.5em'>
                发送文件 已发送{{$store.state.intUploadProgress}}%
              </el-button>
            </div>
            <div v-show='strInputState==="audio"'>
              <!--suppress HtmlUnknownTarget -->
              <audio controls v-bind:src='strRecordBlobUrl'></audio>
              <br>
              <el-button-group>
                <el-button v-on:click='fnRecordStart'>开始</el-button>
                <el-button v-on:click='fnRecordPause'>暂停</el-button>
                <el-button v-on:click='fnRecordClear'>清除</el-button>
                <el-button type='success' v-on:click='fnSendRecord'>发送</el-button>
              </el-button-group>
            </div>
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
  import Recorderx, {ENCODE_TYPE} from 'recorderx'
  import MSG_TYPE from '../../../public/MSG_TYPE'

  const rc = new Recorderx()

  export default {
    name: 'Chat',
    data: function () {
      return {
        strMsgToBeSend: '',
        // text | image | file | audio
        strInputState: 'text',
        fileToBeUpload: null,
        wavRecord: null,
        strRecordBlobUrl: '',
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
        store.commit('fnSendFileByConnection', {
          file: this.$refs.pictureInput.file,
          sendMsgType: MSG_TYPE.SEND_IMAGE,
          callback: function (uploadResult) {
            if (uploadResult) {
              console.log('图片发送成功')
              // 刷新聊天窗口
              store.state.intUploadProgress = 0
              store.commit('fnGetHistoryMsgByConnection')
            } else {
              console.error('图片发送失败')
              // TODO 图片发送失败
            }
          }
        })
      },
      fnSendFile() {
        if (this.fileToBeUpload === null) return
        console.log('此处发送文件')
        console.log(this.fileToBeUpload)
        store.commit('fnSendFileByConnection', {
          file: this.fileToBeUpload,
          sendMsgType: MSG_TYPE.SEND_FILE,
          callback: function (uploadResult) {
            if (uploadResult) {
              console.log('文件发送成功')
              store.state.intUploadProgress = 0
              store.commit('fnGetHistoryMsgByConnection')
            } else {
              console.error('文件发送失败')
              // TODO 文件发送失败
            }
          }
        })
      },

      fnRecordStart() {
        rc.start().then(function () {
          console.log('开始录制')
        }).catch(function (err) {
          console.error('录制失败')
          console.error(err)
        })
      },
      fnRecordPause() {
        rc.pause()
        console.log('暂停录制')
        this.wavRecord = rc.getRecord({
          encodeTo: ENCODE_TYPE.WAV,
          compressible: true
        })
        this.strRecordBlobUrl = URL.createObjectURL(this.wavRecord)
      },
      fnRecordClear() {
        rc.clear()
        console.log('清除录音')
        this.wavRecord = null
        this.strRecordBlobUrl = ''
      },
      fnSendRecord() {
        if (this.wavRecord === null) return
        console.log('发送语音消息')
        console.log(this.wavRecord)
        store.commit('fnSendFileByConnection', {
          file: this.wavRecord,
          sendMsgType: MSG_TYPE.SEND_AUDIO,
          callback: function (uploadResult) {
            if (uploadResult) {
              console.log('语音消息发送成功')
              store.state.intUploadProgress = 0
              store.commit('fnGetHistoryMsgByConnection')
            } else {
              console.error('语音消息发送失败')
              // TODO 文件发送失败
            }
          }
        })
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