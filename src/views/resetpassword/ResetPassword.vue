<template>
    <div>
        <el-container>
            <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm2.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="repassword">
                    <el-input type="password" v-model="ruleForm2.repassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'ResetPassword',
    data() {
        const validatePass = (rule, value, callback) => {
            const passregex = /^[a-z]+[a-z0-9_-]{7,15}$/
            if (!value) {
                callback(new Error('请输入密码'))
            } else {
                if (value.length < 8 || value.length > 16) {
                    callback(new Error('密码的长度不得少于8位，大于16位'))
                } else if (!passregex.test(value)) {
                    callback(new Error('密码必须已小写字母开头，包含小写字母、数字、下划线、中横线'))
                } else {
                    if (this.ruleForm2.repassword !== '') {
                        this.$refs.ruleForm2.validateField('repassword')
                    }
                    callback()
                }
            }
        }
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm2.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            ruleForm2: {
                password: ''
            },
            rules2: {
                password: [{ validator: validatePass, trigger: 'blur' }],
                repassword: [{ validator: validatePass2, trigger: 'blur' }]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.resetpass()
                } else {
                    return false
                }
            })
        },
        resetpass() {
            this.$api.api
                .resetPassword(this.$route.query.code, {
                    password: this.ruleForm2.password
                })
                .then(() => {
                    this.notify.success('更改密码成功')
                    this.$router.push({ name: 'Login' })
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        }
    }
}
</script>

<style scoped>
.el-form {
    width: 400px;
}
</style>
