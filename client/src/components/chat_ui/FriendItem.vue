<template>
  <b-list-group-item
      class='d-flex align-items-center'
      v-on:click='fnChangeChatPartner(strFriendName)'
      v-bind:class="{'friend-selected':strFriendName===selectedFriend,'friend-not-selected':strFriendName!==selectedFriend}"
  >
    <b-avatar
        v-bind:text='strFriendName.substring(strFriendName.length-2)'
        class='mr-3'
    ></b-avatar>
    <span class='mr-auto'> {{strFriendName}} </span>
    <b-badge v-if='intNewMsgCount>0'>{{intNewMsgCount}}</b-badge>
  </b-list-group-item>
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
    background-color: #BCBCBD;
  }
  .friend-not-selected {
    background-color: #E7E6E5;
  }
</style>