import { STORE_USER_INFO, STORE_API_CASES, STORE_PROJECT, LOG_OUT } from '@/store/mutation-types'
import { setStore, removeStore } from '@/store/mUtils'

export default {
    // 获取用户信息存入vuex
    [STORE_USER_INFO](state, info) {
        setStore('token', info.access_token)
        setStore('username', info.username)
    },
    // 获取api cases
    [STORE_API_CASES](state, info) {
        state.apiCaseLists = info
        setStore('apiCaseLists', info)
    },
    // 项目
    [STORE_PROJECT](state, info) {
        state.project = info
        setStore('project', info)
    },
    [LOG_OUT]() {
        removeStore('username')
        removeStore('token')
        removeStore('project')
    }
}
