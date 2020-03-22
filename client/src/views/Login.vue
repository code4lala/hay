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

<script>
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
        console.log('在此登录 用户名为: ' + this.strLoginName)

        // TODO 怎么调用发送消息的函数
      }
    }
  }
</script>

<style scoped>

</style>