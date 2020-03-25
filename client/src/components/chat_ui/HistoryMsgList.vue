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
    data: function () {
      return {
        arrayHistoryMsgItems: [
          {user: '李四', msg: '哈哈哈', time: new Date(), id: 1},
          {user: '王五', msg: '嘻嘻嘻', time: new Date(), id: 2}
        ]
      }
    },
    methods: {
      appendOneMsg: function() {
        // TODO 新增消息
        console.log('TODO 这里新增消息')
      }
    }
  }
</script>

<style scoped>

</style>