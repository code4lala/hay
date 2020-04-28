<template>
  <li v-if='msgItem.type==="image"'>
    {{msgItem.sender}} @ {{new Date(msgItem.timestamp).toLocaleString()}} :
    <br>
    <!--suppress HtmlUnknownTarget -->
    <b-img-lazy v-bind:src='fnStrImageSrc' alt='测试图片'/>
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
    computed: {
      fnStrImageSrc: function () {
        // TODO 下载图片并显示
        store.commit('fnGetImageByConnection', this.msgItem)
        return 'http://mat1.gtimg.com/pingjs/ext2020/qqindex2018/dist/img/qq_logo_2x.png'
      }
    },
    methods: {
      fnDownloadFile() {
        // TODO 下载文件
        console.log('下载文件' + this.msgItem.msg)
      }
    }
  }
</script>

<style scoped>

</style>