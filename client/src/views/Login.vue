<template>
  <div>
    <img src='../assets/logo.png' alt='How are you!'>
    <BaseInputText
        input-id='strLoginName'
        input-placeholder='在此输入用户名'
        v-model='strLoginName'
        v-on:keydown.enter='fnLogin'
    ></BaseInputText>
  </div>
</template>

<script lang='js'>
  import store from '@/store/index'

  import BaseInputText from '@/components/base/BaseInputText'

  export default {
    name: 'client-login',
    components: {BaseInputText},
    data: function () {
      return {
        strLoginName: ''
      }
    },
    methods: {
      fnLogin: function () {
        console.log('即将发送网络请求进行登录...')
        console.log('用户名为: ' + this.strLoginName)

        // 调用发送消息的函数
        store.commit('fnLoginByConnection', this.strLoginName)
      }
    }
  }
</script>

<style scoped>

</style>