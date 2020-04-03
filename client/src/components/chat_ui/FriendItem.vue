<template>
  <li>
    {{ strFriendName }}
  </li>
</template>

<script>
  export default {
    name: 'FriendItem',
    props: {
      strFriendName: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>