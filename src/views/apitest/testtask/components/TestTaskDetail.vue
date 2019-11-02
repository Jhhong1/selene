<template>
    <div>
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'TestTaskList', query: $route.query }" class="is-link">测试任务</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.params.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <template>
            <el-tabs v-model="activeName" style="background-color: white">
                <el-tab-pane disabled></el-tab-pane>
                <el-tab-pane label="基本信息" name="info">
                    <div class="el-table" style="padding: 0 40px">
                        <el-row class="row-class">
                            <router-link
                                tag="el-button"
                                :to="{ name: 'UpdateTask', params: { id: taskId }, query: $route.query }"
                                class="el-button--primary el-button--mini"
                                style="float: right; margin-right: 50px"
                            >
                                更新
                            </router-link>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">名称</el-col>
                            <el-col :span="22">{{ taskDetail.name }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">显示名称</el-col>
                            <el-col :span="22">
                                <template v-if="taskDetail.display">
                                    {{ taskDetail.display }}
                                </template>
                                <template v-else>
                                    -
                                </template>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">创建日期</el-col>
                            <el-col :span="22">{{ $moment(taskDetail.createTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">更新日期</el-col>
                            <el-col :span="22">{{ $moment(taskDetail.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">描述信息</el-col>
                            <template v-if="taskDetail.description">
                                <el-col :span="22">
                                    <el-tooltip placement="top-start">
                                        <div slot="content">{{ taskDetail.description }}</div>
                                        <el-button type="text" size="mini" plain class="el-button__text is-plain">
                                            {{ taskDetail.description }}
                                        </el-button>
                                    </el-tooltip>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">开始时间</el-col>
                            <template v-if="taskDetail.startRunTime">
                                <el-col :span="22">{{ $moment(taskDetail.startRunTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">结束时间</el-col>
                            <template v-if="taskDetail.endRunTime">
                                <el-col :span="22">{{ $moment(taskDetail.endRunTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">状态</el-col>
                            <template v-if="taskDetail.status === 'Starting'">
                                <el-col :span="22">
                                    <tag-running></tag-running>
                                </el-col>
                            </template>
                            <template v-else-if="taskDetail.status === 'Done'">
                                <el-col :span="22">
                                    <tag-done></tag-done>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">
                                    <tag-not-run></tag-not-run>
                                </el-col>
                            </template>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">结果</el-col>
                            <template v-if="taskDetail.result === 'Failed'">
                                <el-col :span="22">
                                    <tag-failed></tag-failed>
                                </el-col>
                            </template>
                            <template v-else-if="taskDetail.result === 'Succeed'">
                                <el-col :span="22">
                                    <tag-success></tag-success>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">失败原因</el-col>
                            <template v-if="taskDetail.errorMessage">
                                <el-col :span="22">
                                    <el-tooltip placement="top-start">
                                        <div slot="content">{{ taskDetail.errorMessage }}</div>
                                        <el-button type="text" size="mini" plain class="el-button__text is-plain">
                                            {{ taskDetail.errorMessage }}
                                        </el-button>
                                    </el-tooltip>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </el-row>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="测试集" name="cases">
                    <el-dropdown size="mini" split-button type="primary" @command="handleCommand" style="float: right; margin-right: 50px">
                        操作
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="linked" :disabled="permissions.indexOf('apitest.associate_apitasks') === -1">
                                关联测试集
                            </el-dropdown-item>
                            <!--<el-dropdown-item command="createCase">创建测试集</el-dropdown-item>-->
                            <el-dropdown-item command="exec" :disabled="permissions.indexOf('apitest.execute_apitasks') === -1">
                                执行
                            </el-dropdown-item>
                            <el-dropdown-item command="delete" :disabled="permissions.indexOf('apitest.delete_apitasks') === -1">
                                删除
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-table row-key="id" :data="taskSets" style="padding-left: 20px; padding-right: 20px">
                        <el-table-column label="测试集名称" min-width="50">
                            <template slot-scope="scope">
                                <template v-if="scope.row.testset">
                                    <router-link
                                        tag="el-button"
                                        :to="{
                                            name: 'TaskTestSetDetail',
                                            params: {
                                                taskName: $route.params.name,
                                                taskId: taskId,
                                                setName: scope.row.testset.name,
                                                id: scope.row.testset.id
                                            },
                                            query: $route.query
                                        }"
                                        class="el-button--text"
                                    >
                                        {{ scope.row.testset.name }}
                                    </router-link>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" min-width="50">
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
                        <el-table-column label="结果" min-width="100">
                            <template slot-scope="scope">
                                <template v-if="scope.row.result === 'Failed'">
                                    <el-popover trigger="hover" placement="top-start">
                                        <p>{{ scope.row.errorMessage }}</p>
                                        <div slot="reference">
                                            <tag-failed></tag-failed>
                                        </div>
                                    </el-popover>
                                </template>
                                <template v-else-if="scope.row.result === 'Succeed'">
                                    <tag-success></tag-success>
                                </template>
                                <template v-else>
                                    -
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="100">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    size="mini"
                                    @click="removeAction(scope.$index, taskSets, scope.row.testset.id)"
                                    :disabled="permissions.indexOf('apitest.remove_apitasks') === -1"
                                >
                                    移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--关联测试集-->
                    <el-dialog
                        title="关联测试集"
                        :visible.sync="dialogFormVisible"
                        :close-on-click-modal="false"
                        :before-close="choiceCancel"
                        class="dialog-header table-class dialog-class el-table_empty-block"
                        style="position: fixed"
                        @open="getTestSets"
                        @opened="showChoices"
                    >
                        <template>
                            <el-table
                                ref="multiple"
                                :data="testSets"
                                tooltip-effect="dark"
                                width="55%"
                                @selection-change="handleSelectionChange"
                                style="width: 100%"
                            >
                                <el-table-column type="selection" width="55"></el-table-column>
                                <el-table-column label="测试集名称" width="120">
                                    <template slot-scope="scope">
                                        <ul class="ul-style">
                                            <li>
                                                {{ scope.row.name }}
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
                                <el-table-column label="描述信息" prop="url" show-overflow-tooltip></el-table-column>
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
                            <div class="footer">
                                <el-button size="mini" plain @click="choiceCancel">取消</el-button>
                                <el-button type="primary" size="mini" plain @click="choice">确定</el-button>
                            </div>
                        </template>
                    </el-dialog>
                    <!--执行测试任务,选择label-->
                    <el-dialog
                        title="执行"
                        :close-on-click-modal="false"
                        :visible.sync="labelDialog"
                        :before-close="clearSelect"
                        class="dialog-header"
                    >
                        <el-form :model="labels" ref="labels">
                            <el-form-item label="标签" :label-width="formLabelWidth" prop="tags">
                                <el-select v-model="labels.tags" placeholder="请选择标签" class="select_class">
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
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
export default {
    name: 'TestTaskDetail',
    data() {
        return {
            activeName: 'info',
            taskId: this.$route.params.id,
            projectName: this.$route.query.project_name,
            dialogFormVisible: false,
            labelDialog: false,
            multipleSelection: [],
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1,
            count: null,
            taskDetail: {},
            taskSets: [],
            testSets: [],
            labels: {
                tags: ''
            },
            formLabelWidth: '45px',
            load: null,
            permissions: []
        }
    },
    methods: {
        choiceCancel() {
            this.dialogFormVisible = false
            this.$refs.multiple.clearSelection()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        currentChange(val) {
            this.currentPage = val
            this.getTestSets()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getTestSets()
        },
        getTestSets() {
            this.$api.api
                .apiTestSetList(this.currentPage, this.pageSize, this.projectName)
                .then(response => {
                    this.testSets = response.data.results
                    this.count = response.data.count
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getTaskDetail() {
            this.$api.api
                .getTaskDetail(this.taskId, this.projectName)
                .then(response => {
                    this.taskDetail = response.data
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getTaskTestSets() {
            this.$api.api
                .taskTestSet(this.taskId, this.projectName)
                .then(response => {
                    this.taskSets = response.data
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        showChoices() {
            for (let i = 0, len = this.testSets.length; i < len; i++) {
                let choice = this.testSets[i]
                for (let k = 0, l = this.taskSets.length; k < l; k++) {
                    let c = this.taskSets[k]
                    try {
                        if (c.testset.id === choice.id) {
                            this.$refs.multiple.toggleRowSelection(choice, true)
                        }
                    } catch (e) {
                        this.notify.error(e)
                    }
                }
            }
        },
        handleCommand(command) {
            if (command === 'linked') {
                this.linked()
            } else if (command === 'delete') {
                const h = this.$createElement
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [h('span', null, '确定删除该测试任务吗？')]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            this.remove(this.taskId)
                            done()
                        } else {
                            done()
                        }
                    }
                })
                    .then(() => {})
                    .catch(() => {})
            } else if (command === 'createCase') {
            } else if (command === 'exec') {
                this.execute()
            }
        },
        linked() {
            this.dialogFormVisible = true
        },
        remove(id) {
            this.$api.api
                .deleteTestTask(id)
                .then(() => {
                    this.notify.success('删除测试任务成功')
                    this.$router.push({ name: 'TestTaskList', query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        execute() {
            this.labelDialog = true
        },
        choice() {
            let payload = {
                task_id: this.taskId,
                testSets: JSON.stringify(this.multipleSelection)
            }
            this.$api.api
                .testSetToTask(JSON.stringify(payload), this.projectName)
                .then(() => {
                    this.dialogFormVisible = false
                    this.notify.success('添加测试集成功')
                    this.getTaskTestSets()
                    this.activeName = 'cases'
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        removeTestSetFromTask(testSetId) {
            let payload = {
                task_id: this.taskId,
                testSet_id: testSetId
            }
            this.$api.api
                .removeTestSetFromTask(JSON.stringify(payload), this.projectName)
                .then(() => {
                    this.notify.success('移除测试集成功')
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        removeAction(index, obj, id) {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定移除该测试集吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.removeTestSetFromTask(id)
                        done()
                    } else {
                        done()
                    }
                }
            })
                .then(() => {
                    obj.splice(index, 1)
                })
                .catch(() => {})
        },
        clearSelect() {
            this.taskId = null
            this.$refs['labels'].resetFields()
            this.labelDialog = false
        },
        cancel(formName) {
            this.taskId = null
            this.$refs[formName].resetFields()
            this.labelDialog = false
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
                    this.labelDialog = false
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        autoLoad() {
            if (this.activeName === 'info') {
                this.getTaskDetail()
            } else if (this.activeName === 'cases') {
                this.getTaskTestSets()
            }
        },
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        }
    },
    created() {
        this.getTaskDetail()
        this.getTaskTestSets()
        this.getPermissions()
    },
    mounted() {
        if (this.load) {
            clearInterval(this.load)
        } else {
            const _this = this
            this.load = setInterval(() => {
                _this.taskId = _this.$route.params.id
                _this.autoLoad()
            }, 3000)
        }
    },
    destroyed() {
        clearInterval(this.load)
    }
}
</script>

<style scoped>
.is-link >>> .is-link {
    color: #409eff !important;
}
.test-left {
    text-align: left;
}
.dialog-header >>> .el-dialog__header {
    padding: 20px 20px 0 !important;
    height: 20px;
    text-align: left;
    line-height: 20px;
}
.table-class >>> table {
    height: 40px;
    line-height: 40px;
}
.dialog-class >>> .el-dialog {
    /*height: 600px;*/
    overflow: scroll;
}
.footer {
    height: 40px;
    line-height: 40px;
    margin-top: 40px;
    position: relative;
    float: right;
    bottom: 20px;
}
.pagination-class {
    margin-top: 50px;
    float: left;
    margin-bottom: 20px;
}
.is-plain:focus,
.is-plain:hover {
    color: #606266;
    border-color: white;
}
</style>
