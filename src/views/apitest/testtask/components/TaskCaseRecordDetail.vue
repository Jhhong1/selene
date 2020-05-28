<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'TestTaskList', query: $route.query }" class="is-link">测试任务</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'TestTaskDetail', params: { name: name, id: id }, query: this.$route.query }" class="is-link">{{
                name
            }}</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'TaskSetRecordDetail', params: { name: name, id: id }, query: this.$route.query }" class="is-link">{{
                set_name
            }}</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs v-model="activeName" style="background-color: white">
            <el-tab-pane disabled></el-tab-pane>
            <el-tab-pane label="测试用例" name="cases">
                <case-record v-model="cases_record"></case-record>
            </el-tab-pane>
            <el-tab-pane label="前置条件" name="setup">
                <case-record v-model="setup_record"></case-record>
            </el-tab-pane>
            <el-tab-pane label="后置条件" name="teardown">
                <case-record v-model="teardown_record"></case-record>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'TaskCaseRecordDetail',
    data() {
        return {
            activeName: 'cases',
            name: this.$route.params.name,
            id: this.$route.params.task_id,
            set_name: this.$route.params.set_name,
            set_id: this.$route.params.set_id,
            batch: this.$route.params.batch,
            cases_record: [],
            setup_record: [],
            teardown_record: []
        }
    },
    methods: {
        getCaseRecord() {
            this.$api.api
                .history('task', this.set_id, this.id, this.batch)
                .then(response => {
                    this.cases_record = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        getSetupRecord() {
            this.$api.api
                .history('task', this.set_id, this.id, this.batch, 'setup')
                .then(response => {
                    this.setup_record = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        getTeadownRecord() {
            this.$api.api
                .history('task', this.set_id, this.id, this.batch, 'teardown')
                .then(response => {
                    this.teardown_record = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        }
    },
    created() {
        this.getCaseRecord()
        this.getSetupRecord()
        this.getTeadownRecord()
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
