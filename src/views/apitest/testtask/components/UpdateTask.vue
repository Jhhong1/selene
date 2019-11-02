<template>
    <div>
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'TestTaskList', query: $route.query }" class="is-link">测试任务</el-breadcrumb-item>
            <el-breadcrumb-item>更新测试任务</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="task" ref="setForm" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="task.name" readonly maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="task.display" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="描述信息" :label-width="formLabelWidth" prop="description">
                <el-input v-model="task.description" type="textarea" :autosize="{ minRows: 10 }"></el-input>
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
    name: 'UpdateTask',
    data() {
        return {
            task: {},
            id: this.$route.params.id,
            projectName: this.$route.query.project_name,
            formLabelWidth: '120px'
        }
    },
    methods: {
        getTaskDetail() {
            this.$api.api
                .getTaskDetail(this.id, this.projectName)
                .then(response => {
                    this.task = response.data
                })
                .catch(error => {
                    this.notify.error(error.response)
                })
        },
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.$router.push({ name: 'TestTaskList', query: this.$route.query })
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.task.project = this.projectName
                    let payload = JSON.stringify(this.task)
                    this.updateTask(this.id, payload, this.projectName)
                } else {
                    return false
                }
            })
        },
        updateTask(taskId, payload, project) {
            this.$api.api
                .updateTask(taskId, payload, project)
                .then(() => {
                    this.notify.success('更新测试任务成功')
                    this.$router.push({ name: 'TestTaskDetail', params: { name: this.task.name, id: this.id }, query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error.response)
                })
        }
    },
    created() {
        this.getTaskDetail()
    }
}
</script>
<style scoped>
.is-link >>> .is-link {
    color: #409eff !important;
}
</style>
