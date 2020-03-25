<template>
  <li>
    {{strUserName}} @ {{dateTime}} : {{strMsg}}
  </li>
</template>

<script lang='js'>
  export default {
    name: 'HistoryMsgItem',
    props: {
      strUserName: {
        type: String,
        required: true
      },
      strMsg: {
        type: String,
        required: true
      },
      dateTime: {
        type: Date,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>