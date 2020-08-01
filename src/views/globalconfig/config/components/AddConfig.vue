<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'ConfigList', query: $route.query }" class="is-link">配置</el-breadcrumb-item>
            <el-breadcrumb-item>添加配置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="configForm" ref="configForm" :rules="rules" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="configForm.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="configForm.display" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="类型" :label-width="formLabelWidth" prop="display">
                <div style="text-align: left;">
                    <el-radio-group v-model="configForm.category" size="mini" @change="reset">
                        <el-radio-button label="api"></el-radio-button>
                        <el-radio-button label="ui"></el-radio-button>
                    </el-radio-group>
                </div>
            </el-form-item>
            <el-form-item label="请求代理" :label-width="formLabelWidth" prop="proxies">
                <j-proxy v-model="configForm.proxy" :category="category"></j-proxy>
            </el-form-item>
            <template v-if="configForm.category === 'api'">
                <el-form-item label="请求地址" :label-width="formLabelWidth" prop="baseurl">
                    <el-input v-model="configForm.baseurl" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="头部信息" :label-width="formLabelWidth" prop="headers">
                    <j-input v-model="configForm.headers" size="mini"></j-input>
                </el-form-item>
            </template>
            <el-form-item label="变量" :label-width="formLabelWidth" prop="variables">
                <j-input v-model="configForm.variables" size="mini"></j-input>
            </el-form-item>
            <el-form-item label="设为全局变量" :label-width="formLabelWidth" prop="globalConfig">
                <el-tooltip :content="configForm.globalConfig" placement="right-start" class="el--swith" style="display: block;line-height: 40px;">
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
    name: 'AddConfig',
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
                proxy: [],
                headers: {},
                variables: {},
                category: 'api'
            },
            category: 'api',
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
        reset(val) {
            this.category = val
            this.configForm.proxy = []
        },
        create(params, project) {
            const _this = this
            this.$api.api
                .createConfig(params, project)
                .then(response => {
                    let id = response.data.id
                    _this.notify.success('添加配置成功')
                    _this.$router.push({ name: 'ConfigDetail', params: { id: id }, query: this.$route.query })
                })
                .catch(error => {
                    let rep = error.response.data
                    if (rep.hasOwnProperty('non_field_errors')) {
                        _this.notify.error(rep.non_field_errors[0])
                    } else {
                        _this.notify.error(rep)
                    }
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
.el-bread >>> .el-breadcrumb {
    line-height: 40px !important;
}
.is-link >>> .is-link {
    color: #409eff !important;
}
</style>
