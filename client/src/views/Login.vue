<template>
  <b-container fluid="true" style='text-align: center'>
    <b-tabs content-class='mt-3'>
      <div class='logo_img'>
        <img src='../assets/logo.png' alt='How are you!'>
      </div>
      <keep-alive>
        <b-tab title='登录' active>
          <el-input
              v-model='strLoginName'
              v-on:keydown.enter.native='fnLogin'
              clearable
              style='margin-bottom: 5px; margin-top: 5px'
          >
            <template slot='prepend'>账号</template>
          </el-input>
          <el-input
              type='password'
              v-model='strLoginPassword'
              v-on:keydown.enter.native='fnLogin'
              show-password
              clearable
          >
            <template slot='prepend'>密码</template>
          </el-input>
          <el-button v-on:click.native='fnLogin'
                     style='margin-top: 5px'>
            登录
          </el-button>
        </b-tab>
      </keep-alive>
      <keep-alive>
        <b-tab title='注册'>
          <el-input
              v-model='strRegName'
              v-on:keydown.enter.native='fnRegister'
              clearable
              style='margin-bottom: 5px'>
            <template slot='prepend'>账号</template>
          </el-input>
          <el-input
              type='password'
              v-model='strRegPassword'
              v-on:keydown.enter.native='fnRegister'
              show-password
              clearable
              style='margin-bottom: 5px'>
            <template slot='prepend'>密码</template>
          </el-input>
          <el-input
              v-model='strRegInviteCode'
              v-on:keydown.enter.native='fnRegister'
              clearable
              style='margin-bottom: 5px'>
            <template slot='prepend'>邀请码</template>
          </el-input>
          <el-button
              v-on:click.native='fnRegister'>
            注册
          </el-button>
        </b-tab>
      </keep-alive>
    </b-tabs>
  </b-container>

</template>

<script lang='js'>
  import store from '@/store/index'

  export default {
    name: 'Login',
    components: {},
    data: function () {
      return {
        strLoginName: '',
        strLoginPassword: '',

        strRegName: '',
        strRegPassword: '',
        strRegInviteCode: '',
      }
    },
    methods: {
      fnLogin: function () {
        if (this.strLoginName === '' || this.strLoginPassword === '') {
          return
        }
        console.log('即将发送网络请求进行登录...')
        console.log('用户名为: ' + this.strLoginName)

        // 不管登录成功不成功，先把密码存起来，后续访问文件存取直接用这个密码
        store.state.password = this.strLoginPassword
        // 调用发送消息的函数
        store.commit('fnLoginByConnection', {
          name: this.strLoginName,
          password: this.strLoginPassword
        })
      },

      fnRegister: function () {
        if (this.strRegName === '' || this.strRegPassword === '' || this.strRegInviteCode === '') {
          return
        }
        console.log('此处注册用户')
        store.commit('fnRegisterByConnection', {
          userName: this.strRegName,
          password: this.strRegPassword,
          inviteCode: this.strRegInviteCode
        })
      }
    }
  }
</script>

<style scoped>

</style>