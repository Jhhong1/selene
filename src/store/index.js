import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import { getStore } from '@/store/mUtils'

Vue.use(Vuex)

const state = {
    username: getStore('username'),
    token: getStore('token'),
    userinfo: getStore('userinfo'),
    timeout: '',
    apiCaseLists: [],
    project: []
}

export default new Vuex.Store({
    state,
    mutations
})
