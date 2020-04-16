<template>
  <li v-if='selectedFriend===strFriendName'
      v-on:click='fnChangeChatPartner(strFriendName)'
  >
    ::: {{ strFriendName }} :::
  </li>
  <li v-else
      v-on:click='fnChangeChatPartner(strFriendName)'
  >
    {{ strFriendName }}
  </li>
</template>

<script>
  import store from '@/store';

  export default {
    name: 'FriendItem',
    props: {
      strFriendName: {
        type: String,
        required: true
      },
      selectedFriend: {
        type: String,
        required: true
      }
    },
    methods: {
      fnChangeChatPartner: function (strChatPartner) {
        store.state.strCurrentChatPartner = strChatPartner
        store.commit('fnGetHistoryMsgByConnection')
      }
    }
  }
</script>

<style scoped>

</style>