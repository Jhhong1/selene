<template>
    <div>
        <el-container>
            <el-header>注册</el-header>
            <el-main>
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item class="login-label" label="用户名" prop="username">
                        <el-input type="text" v-model="ruleForm.username"></el-input>
                    </el-form-item>
                    <el-form-item class="login-label" label="邮箱" prop="email">
                        <el-input type="text" v-model="ruleForm.email"></el-input>
                    </el-form-item>
                    <el-form-item class="login-label" label="密码" prop="password">
                        <el-input type="password" v-model="ruleForm.password"></el-input>
                    </el-form-item>
                    <el-form-item class="login-label" label="确认密码" prop="repassword">
                        <el-input type="password" v-model="ruleForm.repassword"></el-input>
                    </el-form-item>
                </el-form>
            </el-main>
            <el-footer style="text-align: center">
                <el-button type="primary" size="mini" @click="submitForm('ruleForm')">提交</el-button>
            </el-footer>
        </el-container>
    </div>
</template>
<script>
export default {
    name: 'Register',
    data() {
        var checkUsername = (rule, value, callback) => {
            const nameregex = /^[a-z]+[a-z0-9_-]{4,9}$/
            if (!value) {
                callback(new Error('请输入用户名'))
            } else {
                if (value.length < 5 || value.length > 10) {
                    callback(new Error('用户名的字符串长度不得少于5位，大于10位'))
                } else if (!nameregex.test(value)) {
                    callback(new Error('用户名必须已小写字母开头，包含小写字母、数字、下划线、中横线'))
                } else {
                    callback()
                }
            }
        }
        var checkEmail = (rule, value, callback) => {
            const emailregex = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
            if (!value) {
                callback(new Error('请输入邮箱'))
            } else {
                if (value.length > 30) {
                    callback(new Error('邮箱的长度不能超过30'))
                } else if (!emailregex.test(value)) {
                    callback(new Error('邮箱格式错误'))
                } else {
                    callback()
                }
            }
        }
        var checkPass = (rule, value, callback) => {
            const passregex = /^[a-z]+[a-z0-9_-]{7,15}$/
            if (!value) {
                callback(new Error('请输入密码'))
            } else {
                if (value.length < 8 || value.length > 16) {
                    callback(new Error('密码的长度不得少于8位，大于16位'))
                } else if (!passregex.test(value)) {
                    callback(new Error('密码必须已小写字母开头，包含小写字母、数字、下划线、中横线'))
                } else {
                    if (this.ruleForm.repassword !== '') {
                        this.$refs.ruleForm.validateField('repassword')
                    }
                    callback()
                }
            }
        }
        var checkRePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入的密码不一致'))
            } else {
                callback()
            }
        }
        return {
            ruleForm: {
                username: '',
                email: '',
                password: ''
            },
            rules: {
                username: [{ validator: checkUsername, trigger: 'blur' }],
                email: [{ validator: checkEmail, trigger: 'blur' }],
                password: [{ validator: checkPass, trigger: 'blur' }],
                repassword: [{ validator: checkRePass, trigger: 'blur' }]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.register()
                } else {
                    return false
                }
            })
        },
        register() {
            this.$api.api
                .register(this.ruleForm)
                .then(() => {
                    this.notify.success('注册用户成功')
                    this.$router.push({ name: 'Login' })
                })
                .catch(error => {
                    if ('username' in error.response.data) {
                        this.notify.error(error.response.data['username'][0])
                    }
                    if ('email' in error.response.data) {
                        this.notify.error(error.response.data['email'][0])
                    }
                })
        }
    }
}
</script>
<style scoped>
.el-container {
    position: absolute;
    width: 500px;
    height: 390px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #e6e6e6;
    border-radius: 10px;
}
.el-header {
    line-height: 60px;
    text-align: center;
}
</style>
