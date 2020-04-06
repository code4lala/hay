import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

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

