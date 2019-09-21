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
