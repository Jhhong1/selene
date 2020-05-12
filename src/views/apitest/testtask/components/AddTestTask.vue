<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'TestTaskList', query: $route.query }" class="is-link">测试任务</el-breadcrumb-item>
            <el-breadcrumb-item>添加测试任务</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="taskForm" ref="setForm" :rules="rules" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="taskForm.name" size="mini" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="taskForm.display" size="mini" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="描述信息" :label-width="formLabelWidth" prop="description">
                <el-input v-model="taskForm.description" type="textarea" :autosize="{ minRows: 10 }"></el-input>
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
    name: 'AddTestTask',
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
                        if (value.length < 1 || value.length > 20) {
                            callback(new Error('名称长度不得小于1位，大于20位'))
                        } else {
                            callback()
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
        return {
            rules: {
                name: [{ validator: validateName, required: true, trigger: 'blur' }]
            },
            taskForm: {},
            formLabelWidth: '120px'
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
                    this.taskForm.project = project
                    let payload = JSON.stringify(this.taskForm)
                    this.createTestTask(formName, payload, project)
                } else {
                    return false
                }
            })
        },
        createTestTask(formName, payload, project) {
            this.$api.api
                .addTestTask(payload, project)
                .then(() => {
                    this.notify.success('添加测试任务成功')
                    this.$refs[formName].resetFields()
                    this.$router.push({ name: 'TestTaskList', query: this.$route.query })
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
