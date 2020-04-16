<template>
  <ul>
    <HistoryMsgItem
        v-for='msgItem in arrayHistoryMsgItems'
        v-bind:key='msgItem._id'
        v-bind:msgItem='msgItem'>
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
    }
  }
</script>

<style scoped>

</style>