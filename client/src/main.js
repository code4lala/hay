import Vue from 'vue'
import VueRouter from 'vue-router'

import ClientUi from './client-ui'
import ClientLogin from './client-login'
import App from './App'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/hay',
            component: ClientUi
        },
        {
            path: '/',
            component: ClientLogin
        }
    ]
})

new Vue({
    router: router,
    render: function (createElement) {
        return createElement(App)
    },
})
    .$mount('#hay-client')
