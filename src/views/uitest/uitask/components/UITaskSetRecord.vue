<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'UITaskList', query: $route.query }" class="is-link">测试任务</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'UITaskDetail', params: { name: name, id: id }, query: this.$route.query }" class="is-link">
                {{ name }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table class="table-class td" :data="results" style="padding-left: 20px; padding-right: 20px">
            <el-table-column label="用例名称" min-width="100">
                <template slot-scope="scope">
                    <ul class="ul-style">
                        <li>
                            {{ scope.row.testset.name }}
                        </li>
                        <li class="text-style">
                            <template v-if="scope.row.testset.display.length > 30">
                                <el-popover trigger="hover" placement="top-start">
                                    <p>{{ scope.row.testset.display }}</p>
                                    <div slot="reference" class="name-wrapper">
                                        {{ scope.row.testset.display }}
                                    </div>
                                </el-popover>
                            </template>
                            <template v-else>
                                {{ scope.row.testset.display }}
                            </template>
                        </li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column label="开始时间" min-width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.executionrecord_set.start_time">
                        {{ $moment(scope.row.executionrecord_set.start_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" min-width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.executionrecord_set.end_time">
                        {{ $moment(scope.row.executionrecord_set.end_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="60">
                <template slot-scope="scope">
                    <template v-if="scope.row.executionrecord_set.status === 'Done'">
                        <tag-done></tag-done>
                    </template>
                    <template v-else-if="scope.row.executionrecord_set.status === 'Starting'">
                        <tag-running></tag-running>
                    </template>
                    <template v-else>
                        <tag-not-run></tag-not-run>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结果" min-width="60">
                <template slot-scope="scope">
                    <template v-if="scope.row.executionrecord_set.result === 'Succeed'">
                        <tag-success></tag-success>
                    </template>
                    <template v-else-if="scope.row.executionrecord_set.result === 'Failed'">
                        <tag-failed></tag-failed>
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="50">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                        <span>
                            <i class="el-icon-more-outline rotating"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="{ type: 'view', set_name: scope.row.testset.name, set_id: scope.row.testset.id }">
                                详情
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'UITaskSetRecord',
    data() {
        return {
            name: this.$route.params.name,
            id: this.$route.params.id,
            batch: this.$route.params.batch,
            results: []
        }
    },
    methods: {
        getRecordDetail() {
            this.$api.api
                .history('task_set', this.id, '', this.batch)
                .then(response => {
                    this.results = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        handleCommand(command) {
            if (command.type == 'view') {
                this.$router.push({
                    name: 'UITaskCaseRecord',
                    params: { name: this.name, set_name: command.set_name, task_id: this.id, set_id: command.set_id, batch: this.batch },
                    query: this.$route.query
                })
            }
        }
    },
    created() {
        this.getRecordDetail()
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
