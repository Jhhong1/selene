import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import ECharts from 'vue-echarts'
import axios from 'axios'

import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

import 'element-ui/lib/theme-chalk/index.css'
import '@/static/css/common.css'
import moment from 'moment'
import api from './api'
import App from './App.vue'
import router from './router'
import store from '@/store'
import * as notify from '@/common'

// import TagSuccess from "@/plugin/TagSuccess";
// import TagDone from "@/plugin/TagDone";
// import TagFailed from "@/plugin/TagFailed";
// import TagRunning from "@/plugin/TagRunning";
// import TagNotRun from "@/plugin/TagNotRun";
// import Label from "@/plugin/Label";

Vue.config.productionTip = false
Vue.prototype.$moment = moment
// 将api挂载到Vue的原型上
Vue.prototype.$api = api

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.component('v-chart', ECharts)
// Vue.component('tag-success', TagSuccess)
// Vue.component('tag-done', TagDone)
// Vue.component('tag-failed', TagFailed)
// Vue.component('tag-running', TagRunning)
// Vue.component('tag-not-run', TagNotRun)
// Vue.component('j-label', Label)

Vue.prototype.notify = notify

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
    /* eslint-disable */
    if (to.meta.title) {
        document.title = to.meta.title
        next()
    } else {
        next()
    }
    // 验证用户是否存储token
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.token) {
            axios.defaults.headers['Authorization'] = 'Bearer ' + store.state.token
            next()
        } else {
            next({
                name: 'Login'
            })
        }
    } else {
        next()
    }
    if (from.query.project_name) {
        if (!to.query.project_name) {
            let newquery = to.query
            newquery.project_name = from.query.project_name
            next({
                path: to.path,
                query: newquery
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

/* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
