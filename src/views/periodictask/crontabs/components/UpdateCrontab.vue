<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'CrontabList', query: $route.query }" class="is-link">定时任务</el-breadcrumb-item>
            <el-breadcrumb-item>更新定时任务</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="periodictask" ref="periodictask" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="periodictask.name" size="mini" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="periodictask.display" size="mini" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="任务" :label-width="formLabelWidth" prop="testtask">
                <el-select v-model="periodictask.testtask" placeholder="请选择" style="display: block;" size="mini">
                    <el-option v-for="(task, ind) in tasks" :key="ind" :label="task.name + '(' + task.display + ')'" :value="task.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标签" :label-width="formLabelWidth" prop="tags">
                <el-select v-model="periodictask.tags" placeholder="请选择" size="mini" style="display: block;">
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
            <el-form-item label="规则" :label-width="formLabelWidth" prop="crontab">
                <el-select v-model="periodictask.crontab" style="display: block;" size="mini" filterable>
                    <el-option
                        v-for="(content, ind) in rulesList"
                        :key="ind"
                        :label="content.name + '(' + content.display + ')'"
                        :value="content.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item size="mini">
                <el-button type="info" plain size="mini" @click="cancel('periodictask')">取消</el-button>
                <el-button type="primary" plain size="mini" @click="submit('periodictask')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'UpdateCrontab',
    data() {
        return {
            projectName: this.$route.query.project_name,
            taskId: this.$route.params.id,
            formLabelWidth: '120px',
            periodictask: {},
            tasks: [],
            rulesList: []
        }
    },
    methods: {
        getPeriodictaskDetail() {
            this.$api.api
                .PeriodictaskDetail(this.taskId, this.projectName)
                .then(response => {
                    this.periodictask = response.data
                })
                .catch(error => {
                    this.notify.error(error.response)
                })
        },
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.$router.go(-1)
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let project = this.projectName
                    this.periodictask.project = project
                    let payload = JSON.stringify(this.periodictask)
                    this.updatetask(this.taskId, payload, project)
                } else {
                    return false
                }
            })
        },
        updatetask(taskId, payload, projectName) {
            this.$api.api
                .updatePeriodictask(taskId, payload, projectName)
                .then(() => {
                    this.notify.success('更新定时任务成功')
                    this.$router.push({ name: 'CrontabList', query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getTask() {
            this.$api.api
                .getTaskList(1, 1000, this.projectName)
                .then(response => {
                    this.tasks = response.data.results
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        ruleList() {
            this.$api.api
                .getCrontabRuleList(1, 1000, this.projectName)
                .then(response => {
                    this.rulesList = response.data.results
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        }
    },
    created() {
        this.getPeriodictaskDetail()
        this.getTask()
        this.ruleList()
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
