<template>
  <li>
    {{msgItem.sender}} @ {{new Date(msgItem.timestamp).toLocaleString()}} : {{msgItem.msg}}
  </li>
</template>

<script lang='js'>
  export default {
    name: 'HistoryMsgItem',
    props: {
      msgItem: {
        required: true
      }
    }
  }
</script>

<style scoped>

</style>