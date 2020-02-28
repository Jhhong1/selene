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

import Input from '@/plugin/Input'
import TagSuccess from '@/plugin/TagSuccess'
import TagDone from '@/plugin/TagDone'
import TagFailed from '@/plugin/TagFailed'
import TagRunning from '@/plugin/TagRunning'
import TagNotRun from '@/plugin/TagNotRun'
import Label from '@/plugin/Label'
import VueJsonEditor from '@/plugin/JsonEditor'
import Asserts from '@/plugin/AssertCom'
import Extracts from '@/plugin/Extracts'
import SetCase from '@/plugin/TestSetCases'
import ProjectPermission from '@/plugin/ProjectPermissions'
import LinkCases from '@/plugin/LinkCases'
import ProxyCom from '@/plugin/ProxyCom'

Vue.config.productionTip = false
Vue.prototype.$moment = moment
// 将api挂载到Vue的原型上
Vue.prototype.$api = api

Vue.use(ElementUI)
Vue.use(VueRouter)

Vue.component('j-input', Input)
Vue.component('v-chart', ECharts)
Vue.component('tag-success', TagSuccess)
Vue.component('tag-done', TagDone)
Vue.component('tag-failed', TagFailed)
Vue.component('tag-running', TagRunning)
Vue.component('tag-not-run', TagNotRun)
Vue.component('j-label', Label)
Vue.component('j-editor', VueJsonEditor)
Vue.component('j-assert', Asserts)
Vue.component('j-extract', Extracts)
Vue.component('set-case', SetCase)
Vue.component('j-project', ProjectPermission)
Vue.component('j-link', LinkCases)
Vue.component('j-proxy', ProxyCom)

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
        let token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers['Authorization'] = 'Bearer ' + token
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
