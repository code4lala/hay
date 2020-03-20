<template>
    <div>
        <img src='./assets/logo.png' alt='How are you!'>
        <BaseInputText
                input_id='login_name'
                input_placeholder='在此输入用户名'
                v-model='login_name'
                v-on:keydown.enter='fn_login'
        ></BaseInputText>
    </div>
</template>

<script>
    import BaseInputText from './components/base/BaseInputText'

    export default {
        name: 'client-login',
        components: {BaseInputText},
        data: function () {
            return {
                login_name: ''
            }
        },
        methods: {
            fn_login: function () {
                console.log('在此登录 用户名为: ' + this.login_name)

                // TODO 怎么传递消息给App.vue组件
            }
        }
    }
</script>

<style scoped>

</style>