<template>
    <div id="login">
        <el-container>
            <el-header>自动化测试平台</el-header>
            <el-main>
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
                    <el-form-item class="login-label" label="用户名" prop="username">
                        <el-input type="text" v-model="ruleForm.username" auto-complete="on"></el-input>
                    </el-form-item>
                    <el-form-item class="login-label" label="密码" prop="password">
                        <el-input type="password" v-model="ruleForm.password" auto-complete="on"></el-input>
                    </el-form-item>
                    <el-button type="primary" size="mini" @click="submitForm('ruleForm')">登录</el-button>
                </el-form>
            </el-main>
        </el-container>
        <el-row>
            <el-col :span="14">
                <router-link :to="{ name: 'ForgetPassword' }" tag="div">忘记密码?</router-link>
            </el-col>
            <el-col :span="10">
                <router-link :to="{ name: 'Register' }" tag="div">注册</router-link>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'Login',
    data() {
        const checkUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入用户名'))
            } else {
                if (value.length < 5 || value.length > 10) {
                    callback(new Error('用户名的字符串长度不得少于5位，大于10位'))
                } else {
                    if (this.ruleForm.password !== '') {
                        this.$refs.ruleForm.validateField('password')
                    }
                    callback()
                }
            }
        }
        const checkPass = (rule, value, callback) => {
            const passregex = /^[a-z]+[a-z0-9_-]{7,15}$/
            if (!value) {
                callback(new Error('请输入密码'))
            } else {
                if (value.length < 8 || value.length > 16) {
                    callback(new Error('密码的长度不得少于8位，大于16位'))
                } else if (!passregex.test(value)) {
                    callback(new Error('密码必须已小写字母开头，包含小写字母、数字、下划线、中横线'))
                } else {
                    callback()
                }
            }
        }
        return {
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ validator: checkUsername, trigger: 'blur' }],
                password: [{ validator: checkPass, trigger: 'blur' }]
            }
        }
    },
    methods: {
        submitForm(formName) {
            const _that = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    _that.checkIn()
                } else {
                    return false
                }
            })
        },
        checkIn() {
            const that = this
            this.$api.api
                .login({
                    username: that.ruleForm.username,
                    password: that.ruleForm.password
                })
                .then(response => {
                    let info = response.data
                    info.username = that.ruleForm.username
                    that.$store.commit('STORE_USER_INFO', info)
                    that.$router.push({ name: 'ProjectList' })
                })
                .catch(error => {
                    const errmsg = error.response.data
                    that.notify.error(errmsg)
                })
        }
    }
}
</script>
<style scoped>
#login {
    position: absolute;
    width: 400px;
    height: 300px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #e6e6e6;
    background-color: #ffffff;
    border-radius: 10px;
}
.el-header {
    line-height: 60px;
    font-size: 18px;
    text-align: center;
}
.login-label >>> .el-form-item__label {
    text-align: left;
}
.el-button {
    width: 290px;
    margin-left: 70px;
    height: 40px;
    margin-top: 10px;
}
.el-row {
    font-size: 12px;
    color: #409eff;
}
.el-col {
    padding-left: 92px;
}
.el-col div {
    cursor: pointer;
}
</style>
