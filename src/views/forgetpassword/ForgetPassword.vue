<template>
    <div>
        <div class="reset-title">请输入正确的邮箱地址, 我们将把重置密码链接发送到您的邮箱, 请注意查收</div>
        <el-container>
            <el-form :inline="true" :model="resetPassword" :rules="rules" ref="resetPassword" class="demo-form-inline">
                <el-form-item label="邮箱" prop="email">
                    <el-input placeholder="请输入注册邮箱" v-model="resetPassword.email"></el-input>
                    <div v-bind:class="{ 'el-form-item__error': isActive }">{{ errormsg }}</div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('resetPassword')" v-loading.fullscreen.lock="fullscreenLoading">发送</el-button>
                </el-form-item>
            </el-form>
        </el-container>
    </div>
</template>
<script>
export default {
    name: 'ForgotPassword',
    data() {
        const checkEmail = (rule, value, callback) => {
            this.isActive = ''
            this.errormsg = ''
            if (!value) {
                callback(new Error('请输入邮箱'))
            } else {
                const emailregex = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
                if (value.length > 30) {
                    callback(new Error('邮箱的长度不能超过30'))
                } else if (!emailregex.test(value)) {
                    callback(new Error('邮箱格式错误'))
                } else {
                    callback()
                }
            }
        }
        return {
            resetPassword: {
                email: ''
            },
            isActive: false,
            errormsg: '',
            fullscreenLoading: false,
            rules: {
                email: [{ validator: checkEmail, trigger: 'blur' }]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.sendmail()
                } else {
                    return false
                }
            })
        },
        sendmail() {
            const that = this
            this.$api.api
                .sendEmail({
                    email: this.resetPassword.email
                })
                .then(() => {
                    that.openFullScreen()
                })
                .catch(error => {
                    if (error.response) {
                        this.isActive = true
                        this.errormsg = error.response.data.email[0]
                    }
                })
        },
        openFullScreen() {
            const that = this
            const loading = this.$loading({
                lock: true,
                text: '邮件已发送到您的注册邮箱，请注意查收...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            setTimeout(() => {
                loading.close()
                that.$router.push({ name: 'Login' })
            }, 2000)
        }
    }
}
</script>
<style scoped>
.reset-title {
    text-align: left;
    margin-bottom: 20px;
}
</style>
