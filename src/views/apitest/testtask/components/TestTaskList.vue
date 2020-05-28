<template>
    <div>
        <template v-if="permissions.indexOf('apitest.create_apitasks') > -1">
            <router-link tag="el-button" class="el-button--primary el-button--mini p-button" :to="{ name: 'AddTestTask', query: $route.query }">
                添加测试任务
            </router-link>
        </template>
        <template v-else>
            <el-button class="el-button--primary el-button--mini p-button" disabled>添加测试任务</el-button>
        </template>
        <el-table class="table-class td" :data="taskList">
            <el-table-column label="名称" min-width="200">
                <template slot-scope="scope">
                    <ul class="ul-style">
                        <li>
                            <router-link
                                :to="{ name: 'TestTaskDetail', params: { name: scope.row.name, id: scope.row.id }, query: $route.query }"
                                class="el-link el-link--primary"
                            >
                                {{ scope.row.name }}
                            </router-link>
                        </li>
                        <li class="text-style">
                            <template v-if="scope.row.display">
                                <template v-if="scope.row.display.length > 30">
                                    <el-popover trigger="hover" placement="top-start">
                                        <p>{{ scope.row.display }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            {{ scope.row.display }}
                                        </div>
                                    </el-popover>
                                </template>
                                <template v-else>
                                    {{ scope.row.display }}
                                </template>
                            </template>
                        </li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column label="描述信息" min-width="200">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top-start">
                        <p>{{ scope.row.description }}</p>
                        <div slot="reference" class="name-wrapper">{{ scope.row.description }}</div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.hasOwnProperty('executionrecord_set') && scope.row.executionrecord_set.length > 0">
                        <template v-if="scope.row.executionrecord_set[0].status === 'Done'">
                            <tag-done></tag-done>
                        </template>
                        <template v-else-if="scope.row.executionrecord_set[0].status === 'Starting'">
                            <tag-running></tag-running>
                        </template>
                    </template>
                    <template v-else>
                        <tag-not-run></tag-not-run>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结果" min-width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.hasOwnProperty('executionrecord_set') && scope.row.executionrecord_set.length > 0">
                        <template v-if="scope.row.executionrecord_set[0].result === 'Failed'">
                            <tag-failed></tag-failed>
                            <!-- <el-popover trigger="hover" placement="top-start">
                                <p>{{ scope.row.errorMessage }}</p>
                                <div slot="reference">
                                </div>
                            </el-popover> -->
                        </template>
                        <template v-else-if="scope.row.executionrecord_set[0].result === 'Succeed'">
                            <tag-success></tag-success>
                        </template>
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
                            <el-dropdown-item :command="{ type: 'view', name: scope.row.name, row: scope.row.id }">查看</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'update', row: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.update_apitasks') === -1"
                            >
                                更新
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'exec', row: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.execute_apitasks') === -1"
                            >
                                执行
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'del', index: scope.$index, row: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.delete_apitasks') === -1"
                            >
                                删除
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pagination-class"
            background
            layout="total, sizes, prev, pager, next"
            :total="count"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="currentChange"
        ></el-pagination>
        <el-dialog title="执行" :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="clearSelect" class="dialog-header">
            <el-form :model="labels" ref="labels">
                <el-form-item label="标签" :label-width="formLabelWidth" prop="tags">
                    <el-select v-model="labels.tags" placeholder="请选择标签" style="display: block;">
                        <el-option label="无" value></el-option>
                        <el-option label="all" value="all"></el-option>
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
                <el-form-item size="mini" style="text-align: right">
                    <el-button type="info" plain size="mini" @click="cancel('labels')">取消</el-button>
                    <el-button type="primary" plain size="mini" @click="submit('labels')">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'TestTaskList',
    data() {
        return {
            count: null,
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1,
            taskList: [],
            projectName: this.$route.query.project_name,
            dialogVisible: false,
            formLabelWidth: '45px',
            labels: {
                tags: ''
            },
            taskId: null,
            permissions: [],
            t: null
        }
    },
    methods: {
        currentChange(val) {
            this.currentPage = val
            this.getTaskList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getTaskList()
        },
        getTaskList() {
            this.$api.api
                .getTaskList(this.currentPage, this.pageSize, this.projectName)
                .then(response => {
                    this.taskList = Object.assign([], response.data.results)
                    this.count = response.data.count
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        getTaskCounter(id) {
            this.$api.api.getTaskCounter(id, this.projectName).then(response => {
                return response.data
            })
        },
        choices(id) {
            this.taskId = id
            let counter = this.getTaskCounter(id)
            // let arry = Object.keys(counter)
            if (JSON.stringify(counter) === '{}') {
            } else {
                this.dialogVisible = true
            }
        },
        deleteTask(taskId) {
            this.$api.api
                .deleteTestTask(taskId)
                .then(() => {
                    this.notify.success('删除测试任务成功')
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        deleteRow(index, rows, taskId) {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定删除该测试任务吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.deleteTask(taskId)
                        done()
                    } else {
                        done()
                    }
                }
            })
                .then(() => {
                    rows.splice(index, 1)
                })
                .catch(() => {})
        },
        handleCommand(command) {
            if (command.type === 'del') {
                this.deleteRow(command.index, this.taskList, command.row)
            } else if (command.type === 'view') {
                this.$router.push({ name: 'TestTaskDetail', params: { name: command.name, id: command.row }, query: this.$route.query })
            } else if (command.type === 'exec') {
                this.choices(command.row)
            } else if (command.type === 'update') {
                this.$router.push({ name: 'UpdateTask', params: { id: command.row }, query: this.$route.query })
            }
        },
        clearSelect() {
            this.taskId = null
            this.$refs['labels'].resetFields()
            this.dialogVisible = false
        },
        cancel(formName) {
            this.taskId = null
            this.$refs[formName].resetFields()
            this.dialogVisible = false
        },
        submit(formName) {
            let payload = {
                level: 'task',
                tasks: this.taskId,
                tags: this.labels.tags
            }
            this.$api.api
                .executeCase(JSON.stringify(payload), this.projectName)
                .then(() => {
                    this.taskId = null
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        }
    },
    created() {
        this.getTaskList()
        this.getPermissions()
    },
    watch: {
        taskList() {
            this.notify.debounce(this.t, this.getTaskList)
        }
    },
    mounted() {},
    destroyed() {
        clearTimeout(this.t)
    }
}
</script>

<style scoped>
.dialog-header >>> .el-dialog__header {
    text-align: left;
}
</style>
