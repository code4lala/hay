<template>
  <b-button
      variant='light'
      class='d-flex align-items-center'
      v-on:click='fnChangeChatPartner(strFriendName)'
      v-bind:class="{'friend-selected':strFriendName===selectedFriend}"
  >
    <b-avatar
        v-bind:text='strFriendName.substring(strFriendName.length-2)'
        class='mr-3'
        v-bind:badge='intNewMsgCount>0?intNewMsgCount+"":false'
        badge-variant='light'
    ></b-avatar>
    <span class='mr-auto'> {{strFriendName}} </span>
  </b-button>
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
  .friend-selected {
    background-color: #E2E6EA;
  }
</style>