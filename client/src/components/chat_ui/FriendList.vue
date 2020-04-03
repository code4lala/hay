<template>
  <ul>
    <FriendItem
        v-for='friendItem in store.state.arrayFriendItems'
        v-bind:key='friendItem.name'
        v-bind:strFriendName='friendItem.name'>
    </FriendItem>
  </ul>
</template>

<script>
  import FriendItem from '@/components/chat_ui/FriendItem';
  import store from '@/store';

  export default {
    name: 'FriendList',
    components: {FriendItem},
    data: function () {
      return {
        store
      }
    }
  }
</script>

<style scoped>

</style>