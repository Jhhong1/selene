<template>
    <div>
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'GlobalConfigList', query: $route.query }" class="is-link">配置</el-breadcrumb-item>
            <el-breadcrumb-item>添加配置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="configForm" ref="configForm" :rules="rules" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="configForm.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="configForm.display" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="请求地址" :label-width="formLabelWidth" prop="baseurl">
                <el-input v-model="configForm.baseurl" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="请求代理" :label-width="formLabelWidth" prop="proxy">
                <j-input v-model="configForm.proxy" :select="true"></j-input>
            </el-form-item>
            <el-form-item label="认证方式" :label-width="formLabelWidth" prop="authMethod">
                <el-row>
                    <el-col class="bg-purple-light" :span="3">类型</el-col>
                    <el-col class="bg-purple-light" :span="10">用户名</el-col>
                    <el-col class="bg-purple-light" :span="11">密码</el-col>
                </el-row>
                <el-row style="padding-left: 10px" :gutter="3">
                    <el-col :span="3" style="text-align: left">
                        {{ configForm.authMethod }}
                    </el-col>
                    <el-col :span="10">
                        <el-input size="mini" v-model="configForm.auth.username"></el-input>
                    </el-col>
                    <el-col :span="11">
                        <el-input size="mini" v-model="configForm.auth.password"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="头部信息" :label-width="formLabelWidth" prop="headers">
                <j-input v-model="configForm.headers" size="mini"></j-input>
            </el-form-item>
            <el-form-item label="变量" :label-width="formLabelWidth" prop="variables">
                <j-input v-model="configForm.variables" size="mini"></j-input>
            </el-form-item>
            <el-form-item label="设为全局变量" :label-width="formLabelWidth" prop="globalConfig">
                <el-tooltip :content="configForm.globalConfig" placement="right-start" class="el--swith">
                    <el-switch
                        v-model="configForm.globalConfig"
                        active-color="#13ce66"
                        inactive-color="#dedfe0"
                        active-value="true"
                        inactive-value="false"
                    ></el-switch>
                </el-tooltip>
            </el-form-item>
            <el-form-item size="mini" style="margin-bottom: 30px">
                <el-button type="info" plain @click="countermand('configForm')" size="mini">取消</el-button>
                <el-button type="primary" plain @click="submit('configForm')" size="mini">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'AddGlobalConfig',
    data() {
        const validateCaseName = (rule, value, callback) => {
            try {
                const passregex = /^[a-z]+[a-z0-9_-]*$/
                if (!value) {
                    callback(new Error('请输入用例名称'))
                } else {
                    if (!passregex.test(value)) {
                        callback(new Error('用例名称必须以小写字母开头，包含小写字母、数字、下划线、中横线'))
                    } else {
                        if (value.length < 1 || value.length > 20) {
                            callback(new Error('用例名称长度不得少于1位，大于20位'))
                        } else {
                            callback()
                        }
                    }
                }
            } catch (e) {}
        }
        const validateUrl = (rule, value, callback) => {
            try {
                let strRegex = '^((https|http)?://)'
                let urlRegex = new RegExp(strRegex)
                if (value) {
                    if (!urlRegex.test(value)) {
                        callback(new Error('请求地址以http://或https://开头'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            } catch (e) {}
        }
        return {
            projectName: this.$route.query.project_name,
            configForm: {
                proxy: {},
                authMethod: 'BasicAuth',
                auth: {},
                headers: {},
                variables: {}
            },
            formLabelWidth: '120px',
            rules: {
                name: [{ validator: validateCaseName, required: true, trigger: 'blur' }],
                baseurl: [{ validator: validateUrl, required: false, trigger: 'blur' }]
            }
        }
    },
    methods: {
        countermand(formName) {
            this.$refs[formName].resetFields()
            this.$router.go(-1)
        },
        create(params, project, formName) {
            const _this = this
            this.$api.api
                .createConfig(params, project)
                .then(() => {
                    _this.notify.success('添加配置成功')
                    _this.$refs[formName].resetFields()
                    _this.$router.go(-1)
                })
                .catch(error => {
                    _this.notify.error(error.response.data)
                })
        },
        submit(formName) {
            let _this = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    _this.configForm.project = _this.projectName
                    let payload = _this.configForm
                    _this.create(JSON.stringify(payload), _this.projectName, formName)
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style scoped>
.is-link >>> .is-link {
    color: #409eff !important;
}
</style>
