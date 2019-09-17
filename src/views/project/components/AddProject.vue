<template>
    <div>
        <el-breadcrumb class="project-bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="is-link">
                <router-link :to="{ name: 'ProjectList' }">项目</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>创建项目</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
            <el-form :model="projectFrom" ref="projectFrom" :rules="rules" class="case-form">
                <el-form-item label="项目名称" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="projectFrom.name"></el-input>
                </el-form-item>
                <el-form-item label="描述信息" prop="description" :label-width="formLabelWidth">
                    <el-input v-model="projectFrom.description" type="textarea" :autosize="{ minRows: 10, maxRows: 30 }"></el-input>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <el-button type="primary" size="small" @click="submit('projectFrom')">创建</el-button>
                    <el-button size="small" @click="cancel('projectFrom')">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddProject',
    data() {
        const checkName = (rule, value, callback) => {
            let passregex = /^[a-z]+[a-z0-9_-]*$/
            if (!value) {
                callback(new Error('项目名称不能为空'))
            } else {
                if (!passregex.test(value)) {
                    callback(new Error('项目名称必须以小写字母开头，包含小写字母、数字、下划线、中横线'))
                } else {
                    if (value.length < 6 || value.length > 20) {
                        callback(new Error('项目名称长度不得少于6位，大于20位'))
                    } else {
                        callback()
                    }
                }
            }
        }
        return {
            formLabelWidth: '120px',
            projectFrom: {},
            rules: {
                name: [{ validator: checkName, trigger: 'blur' }]
            }
        }
    },
    methods: {
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.$router.push({ name: 'ProjectList' })
        },
        createProject(obj, formName) {
            this.$api.api
                .createApiProject(obj)
                .then(() => {
                    this.$notify({
                        title: '成功',
                        message: '创建项目成功',
                        type: 'success'
                    })
                    this.$refs[formName].resetFields()
                    this.$router.push({ name: 'ProjectList' })
                })
                .catch(error => {
                    this.$notify.error({
                        title: '失败',
                        message: error.response.request.responseText
                    })
                })
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let payload = JSON.stringify(this.projectFrom)
                    this.createProject(payload, formName)
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style scoped>
.project-bread {
    background-color: #f9fafd;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
}
.is-link >>> .router-link-active {
    color: #409eff !important;
}
</style>
