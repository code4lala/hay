<template>
  <div>
    <div class='logo_img' style='text-align: center'>
      <img src='../assets/logo.png' alt='How are you!'>
    </div>
    <el-input
        v-model='strLoginName'
        v-on:keydown.enter.native='fnLogin'
        clearable
        style='margin-bottom: 5px; margin-top: 5px'
    >
      <template slot='prepend'>账号</template>
    </el-input>
    <el-input
        v-model='strLoginPassword'
        v-on:keydown.enter.native='fnLogin'
        show-password
        clearable
    >
      <template slot='prepend'>密码</template>
    </el-input>
  </div>
</template>

<script lang='js'>
  import store from '@/store/index'

  export default {
    name: 'client-login',
    components: {},
    data: function () {
      return {
        strLoginName: '',
        strLoginPassword: ''
      }
    },
    methods: {
      fnLogin: function () {
        console.log('即将发送网络请求进行登录...')
        console.log('用户名为: ' + this.strLoginName)

        // TODO websocket secure
        // TODO 密码登录

        // 调用发送消息的函数
        store.commit('fnLoginByConnection', this.strLoginName)
      }
    }
  }
</script>

<style scoped>

</style>