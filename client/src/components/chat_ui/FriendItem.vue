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
    <span v-if='intNewMsgCount>0'>
      ::: {{ intNewMsgCount }}
    </span>
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
      },
      intNewMsgCount: {
        type: Number,
        default: 0,
        required: true
      }
    },
    methods: {
      fnChangeChatPartner: function (strChatPartner) {
        store.state.strCurrentChatPartner = strChatPartner
        store.state.arrayFriendItems.find(function (el) {
          return el.name === strChatPartner
        }).intNewMsgCount = 0
        store.commit('fnGetHistoryMsgByConnection')
      }
    }
  }
</script>

<style scoped>

</style>