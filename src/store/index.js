import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'

Vue.use(Vuex)

const state = {
    username: '',
    token: '',
    userinfo: [],
    timeout: '',
    apiCaseLists: [],
    project: []
}

export default new Vuex.Store({
    state,
    mutations
})
