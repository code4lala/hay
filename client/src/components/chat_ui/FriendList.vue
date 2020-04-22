<template>
  <b-button-group vertical>
    <FriendItem
        v-for='friendItem in arrayFriendItems'
        v-bind:key='friendItem.name'
        v-bind:strFriendName='friendItem.name'
        v-bind:selectedFriend='selectedFriend'
        v-bind:intNewMsgCount='friendItem.intNewMsgCount'>
    </FriendItem>
  </b-button-group>
</template>

<script>
  import FriendItem from '@/components/chat_ui/FriendItem';

  export default {
    name: 'FriendList',
    components: {FriendItem},
    props: {
      arrayFriendItems: {
        type: Array,
        required: true
      },
      selectedFriend: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>