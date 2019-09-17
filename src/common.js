export function success(msg) {
    this.$notify({
        title: '成功',
        message: msg,
        type: 'success'
    })
}

export function error(msg) {
    this.$notify({
        title: '失败',
        message: msg,
        type: 'error'
    })
}
