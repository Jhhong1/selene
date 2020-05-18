<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'ApiTestSetList', query: $route.query }" class="is-link">测试集</el-breadcrumb-item>
            <el-breadcrumb-item>添加测试集</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="setForm" ref="setForm" :rules="rules" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="setForm.name" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="setForm.display" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="标签" :label-width="formLabelWidth" prop="labels">
                <el-select v-model="setForm.tags" multiple placeholder="请选择" style="display: block;">
                    <el-option label="bat" value="bat"></el-option>
                    <el-option label="smoke" value="smoke"></el-option>
                    <el-option label="regression" value="regression"></el-option>
                    <el-option label="container" value="container"></el-option>
                    <el-option label="maintenance" value="maintenance"></el-option>
                    <el-option label="alarm" value="alarm"></el-option>
                    <el-option label="scene" value="scene"></el-option>
                    <el-option label="devops" value="devops"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述信息" :label-width="formLabelWidth" prop="description">
                <el-input v-model="setForm.description" type="textarea" :autosize="{ minRows: 10 }"></el-input>
            </el-form-item>
            <el-form-item size="mini">
                <el-button type="info" plain size="mini" @click="cancel('setForm')">取消</el-button>
                <el-button type="primary" plain size="mini" @click="submit('setForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'AddTestSet',
    data() {
        const validateName = (rule, value, callback) => {
            try {
                const passregex = /^[a-z]+[a-z0-9_-]*$/
                if (!value) {
                    callback(new Error('请输入名称'))
                } else {
                    if (!passregex.test(value)) {
                        callback(new Error('名称必须以小写字母开头，包含小写字母、数字、下划线、中横线'))
                    } else {
                        if (value.length < 6 || value.length > 20) {
                            callback(new Error('名称长度不得少于6位，大于20位'))
                        } else {
                            callback()
                        }
                    }
                }
            } catch (e) {
                this.notify.error(e)
            }
        }
        return {
            formLabelWidth: '120px',
            setForm: {},
            rules: {
                name: [{ validator: validateName, required: true, trigger: 'blur' }]
            }
        }
    },
    methods: {
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.$router.go(-1)
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let project = this.$route.query.project_name
                    this.setForm.project = project
                    let payload = JSON.stringify(this.setForm)
                    this.createTestSet(formName, payload, project)
                } else {
                    return false
                }
            })
        },
        createTestSet(formName, payload, project) {
            this.$api.api
                .createApiTestSet(payload, project)
                .then(response => {
                    let setId = response.data.id
                    this.notify.success('添加测试集成功')
                    this.$refs[formName].resetFields()
                    this.$router.push({ name: 'ApiTestSetDetail', params: { id: setId }, query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
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
