import { Notification } from 'element-ui'

export function success(msg) {
    Notification({
        title: '成功',
        message: msg,
        type: 'success'
    })
}

export function error(msg) {
    Notification({
        title: '失败',
        message: msg,
        type: 'error'
    })
}

export function debounce(t, func, delay = 3000) {
    let that = this
    clearTimeout(that.t)
    that.t = setTimeout(() => {
        func()
    }, delay)
}
