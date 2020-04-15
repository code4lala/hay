<template>
  <ul>
    <HistoryMsgItem
        v-for='msgItem in arrayHistoryMsgItems'
        v-bind:key='msgItem.id'
        v-bind:strUserName='msgItem.user'
        v-bind:strMsg='msgItem.msg'
        v-bind:dateTime='msgItem.time'
    >
    </HistoryMsgItem>
  </ul>
</template>

<script lang='js'>
  import HistoryMsgItem from '@/components/chat_ui/HistoryMsgItem';

  export default {
    name: 'HistoryMsgList',
    components: {HistoryMsgItem},
    props: {
      arrayHistoryMsgItems: {
        type: Array,
        required: true
      },
    },
    methods: {
      appendOneMsg: function () {
        // TODO 新增消息
        console.log('TODO 这里新增消息')
      }
    }
  }
</script>

<style scoped>

</style>