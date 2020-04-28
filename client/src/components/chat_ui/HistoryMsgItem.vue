<template>
  <li v-if='msgItem.type==="image"'>
    {{msgItem.sender}} @ {{new Date(msgItem.timestamp).toLocaleString()}} :
    <br>
    <!--这里放两个img标签，一个不显示，用来请求服务器获取图片文件，另一个img标签显示获取到的图片文件-->
    <!--suppress HtmlUnknownTarget -->
    <b-img width='200' v-bind:src='strImageSrc' v-bind:alt='msgItem.msg'/>
    <!--suppress HtmlUnknownTarget -->
    <b-img v-bind:src='fnGetImage' v-bind:alt='msgItem.msg' v-show='false'/>
  </li>
  <li v-else-if='msgItem.type==="file"'>
    {{msgItem.sender}} @ {{new Date(msgItem.timestamp).toLocaleString()}} : {{msgItem.msg}}
    <b-button v-on:click='fnDownloadFile'>下载文件</b-button>
  </li>
  <li v-else>
    {{msgItem.sender}} @ {{new Date(msgItem.timestamp).toLocaleString()}} : {{msgItem.msg}}
  </li>
</template>

<script lang='js'>
  import store from '../../store'

  export default {
    name: 'HistoryMsgItem',
    props: {
      msgItem: {
        required: true
      }
    },
    data: function () {
      return {
        strImageSrc: '',
        succeed: false
      }
    },
    computed: {
      fnGetImage: function () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this
        if (this.succeed) return
        store.commit('fnGetImageByConnection', {
          msgItem: this.msgItem,
          callback: function (img) {
            console.log('回调设置图片地址')
            console.log(img)
            const imgUrl = URL.createObjectURL(img)
            console.log(imgUrl)
            that.strImageSrc = imgUrl
            that.succeed = true
          }
        })
        return this.strImageSrc
      },
    },
    methods: {
      fnDownloadFile() {
        // TODO 下载文件
        console.log('下载文件' + this.msgItem.msg)
      }
    },
  }
</script>

<style scoped>

</style>