import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

// element ui begin {{{
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
// element ui end }}}


// bootstrap begin {{{
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// bootstrap end }}}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// 初始化
store.commit('fnInitConnection')

if (store.state.userName === '') {
  if (router.currentRoute.fullPath === '/login') {
    console.log('未登录，已在登录界面，无需重定向')
  } else {
    console.log('未登录，正在重定向')
    router.push('/login')
  }
}

