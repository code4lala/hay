<template>
  <b-container fluid="true">
    <b-tabs content-class='mt-3'>
      <keep-alive>
        <b-tab title='消息' active>
          <Chat></Chat>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab title='设置'>
          <Setting></Setting>
        </b-tab>
      </keep-alive>
    </b-tabs>
  </b-container>
</template>

<script>
  import Chat from '@/components/Chat.vue'
  import Setting from '@/components/Setting.vue'

  export default {
    name: 'Home',
    components: {
      Chat,
      Setting
    }
  }
</script>
