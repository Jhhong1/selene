<template>
    <div class="el-form__item">
        <el-table class="table-class td" :data="results">
            <el-table-column label="开始时间" min-width="200">
                <template slot-scope="scope">
                    <template v-if="scope.row.start_time">
                        {{ $moment(scope.row.start_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" min-width="200">
                <template slot-scope="scope">
                    <template v-if="scope.row.end_time">
                        {{ $moment(scope.row.end_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.status === 'Done'">
                        <tag-done></tag-done>
                    </template>
                    <template v-else-if="scope.row.status === 'Starting'">
                        <tag-running></tag-running>
                    </template>
                    <template v-else>
                        <tag-not-run></tag-not-run>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结果" min-width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.result === 'Succeed'">
                        <tag-success></tag-success>
                    </template>
                    <template v-else-if="scope.row.result === 'Failed'">
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
                            <template v-if="cate == 'sets'">
                                <el-dropdown-item :command="{ type: 'view', set_id: scope.row.sets_id, batch: scope.row.batch }">
                                    详情
                                </el-dropdown-item>
                            </template>
                            <template v-else-if="cate == 'tasks'">
                                <el-dropdown-item :command="{ type: 'view', tasks_id: scope.row.tasks_id, batch: scope.row.batch }">
                                    详情
                                </el-dropdown-item>
                            </template>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'Records',
    props: {
        value: Array,
        categories: {
            type: String,
            default: 'sets'
        }
    },
    data() {
        return {
            results: this.value,
            name: this.$route.params.name,
            cate: this.categories
        }
    },
    methods: {
        handleCommand(command) {
            if (command.type === 'view') {
                if (this.cate == 'sets') {
                    this.$router.push({
                        name: 'TestSetCaseRecord',
                        params: { name: this.name, id: command.set_id, batch: command.batch },
                        query: this.$route.query
                    })
                } else if (this.cate == 'tasks') {
                    this.$router.push({
                        name: 'TaskSetRecordDetail',
                        params: { name: this.name, id: command.tasks_id, batch: command.batch },
                        query: this.$route.query
                    })
                }
            }
        }
    },
    watch: {
        value: function(newValue) {
            this.results = newValue
        }
    }
}
</script>

<style scoped></style>
