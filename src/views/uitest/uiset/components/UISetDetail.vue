<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'UISetList', query: $route.query }" class="is-link">测试集</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs v-model="activeName" style="background-color: white">
            <el-tab-pane disabled></el-tab-pane>
            <el-tab-pane label="基本信息" name="info">
                <div class="el-table" style="padding: 0 40px">
                    <el-row class="row-class">
                        <el-dropdown size="mini" split-button type="primary" @command="handleCommandConfig" style="float: right; margin-right: 50px">
                            操作
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="refer" :disabled="permissions.indexOf('apitest.associate_config') === -1">
                                    配置引用
                                </el-dropdown-item>
                                <el-dropdown-item command="update" :disabled="permissions.indexOf('apitest.update_apiset') === -1">
                                    更新
                                </el-dropdown-item>
                                <el-dropdown-item command="delete" :disabled="permissions.indexOf('apitest.delete_apiset') === -1">
                                    删除
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-row>
                    <el-row :gutter="10" class="row-class test-left">
                        <el-col :span="2">名称</el-col>
                        <el-col :span="22">{{ setDetail.name }}</el-col>
                    </el-row>
                    <el-row :gutter="10" class="row-class test-left">
                        <el-col :span="2">显示名称</el-col>
                        <el-col :span="22">
                            <template v-if="setDetail.display">
                                {{ setDetail.display }}
                            </template>
                            <template v-else>
                                -
                            </template>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" class="row-class test-left">
                        <el-col :span="2">创建日期</el-col>
                        <el-col :span="22">{{ $moment(setDetail.createTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                    </el-row>
                    <el-row :gutter="10" class="row-class test-left">
                        <el-col :span="2">更新日期</el-col>
                        <el-col :span="22">{{ $moment(setDetail.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                    </el-row>
                    <el-row :gutter="10" class="row-class test-left">
                        <el-col :span="2">描述信息</el-col>
                        <template v-if="setDetail.description">
                            <template v-if="setDetail.description.length > 30">
                                <el-col :span="22">
                                    <el-popover trigger="hover" placement="top-start">
                                        <p>{{ setDetail.description }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            {{ setDetail.description }}
                                        </div>
                                    </el-popover>
                                </el-col>
                            </template>
                            <template v-else>
                                {{ setDetail.description }}
                            </template>
                        </template>
                        <template v-else>
                            <el-col :span="22">-</el-col>
                        </template>
                    </el-row>
                    <el-row :gutter="10" class="row-class test-left">
                        <el-col :span="2">标签</el-col>
                        <template v-if="setDetail.tags">
                            <template v-if="setDetail.tags.length">
                                <el-col :span="22">
                                    <template v-for="(tag, index) in setDetail.tags">
                                        <j-label :text="tag" :key="index"></j-label>
                                    </template>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </template>
                    </el-row>
                    <template v-if="setDetail.hasOwnProperty('executionrecord_set') && setDetail.executionrecord_set.length > 0">
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">开始时间</el-col>
                            <template v-if="setDetail.executionrecord_set[0].start_time">
                                <el-col :span="22">
                                    {{ $moment(setDetail.executionrecord_set[0].start_time).format('YYYY-MM-DD HH:mm:ss') }}
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">结束时间</el-col>
                            <template v-if="setDetail.executionrecord_set[0].end_time">
                                <el-col :span="22">
                                    {{ $moment(setDetail.executionrecord_set[0].end_time).format('YYYY-MM-DD HH:mm:ss') }}
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">状态</el-col>
                            <template v-if="setDetail.executionrecord_set[0].status === 'Starting'">
                                <el-col :span="22">
                                    <tag-running></tag-running>
                                </el-col>
                            </template>
                            <template v-else-if="setDetail.executionrecord_set[0].status === 'Done'">
                                <el-col :span="22">
                                    <tag-done></tag-done>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="2">
                                    <tag-not-run></tag-not-run>
                                </el-col>
                            </template>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">结果</el-col>
                            <template v-if="setDetail.executionrecord_set[0].result === 'Failed'">
                                <el-col :span="22">
                                    <tag-failed></tag-failed>
                                </el-col>
                            </template>
                            <template v-else-if="setDetail.executionrecord_set[0].result === 'Succeed'">
                                <el-col :span="2">
                                    <tag-success></tag-success>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </el-row>
                        <!-- <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">失败原因</el-col>
                            <template v-if="setDetail.testsetrelationship.errorMessage">
                                <el-col :span="22">
                                    <el-popover trigger="hover" placement="top-start">
                                        <p>{{ setDetail.testsetrelationship.errorMessage }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            {{ setDetail.testsetrelationship.errorMessage }}
                                        </div>
                                    </el-popover>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </el-row> -->
                    </template>
                    <template v-else>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">开始时间</el-col>
                            <el-col :span="22">-</el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">结束时间</el-col>
                            <el-col :span="22">-</el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">状态</el-col>
                            <el-col :span="2">
                                <tag-not-run></tag-not-run>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">结果</el-col>
                            <el-col :span="22">-</el-col>
                        </el-row>
                        <!-- <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">失败原因</el-col>
                            <el-col :span="22">-</el-col>
                        </el-row> -->
                    </template>
                    <el-row :gutter="10" class="row-class test-left">
                        <el-col :span="2">配置引用</el-col>
                        <template v-if="Object.keys(configReference).length">
                            <el-col :span="22">
                                <router-link
                                    :to="{ name: 'ConfigDetail', params: { id: configReference.id }, query: $route.query }"
                                    class="el-link el-link--primary"
                                >
                                    {{ configReference.name }}
                                </router-link>
                            </el-col>
                        </template>
                        <template v-else>
                            <el-col :span="22">-</el-col>
                        </template>
                    </el-row>
                    <!--配置列表-->
                    <el-dialog
                        title="配置引用"
                        :visible.sync="dialogConfigVisible"
                        :close-on-click-modal="false"
                        :before-close="configBeforeClose"
                        class="dialog-header table-class dialog-class el-table_empty-block"
                        style="position: fixed"
                        @open="getConfigList"
                    >
                        <template>
                            <el-row>
                                <el-col :span="2">
                                    <span style="height: 40px;line-height: 40px">配置</span>
                                </el-col>
                                <el-col :span="22">
                                    <el-select v-model="selectValue" filterable clearable placeholder="请选择" class="el-col-24">
                                        <el-option v-for="item in configList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                            <div class="footer">
                                <el-button size="mini" @click="configCancel">取消</el-button>
                                <el-button type="primary" size="mini" @click="selectChoice">确定</el-button>
                            </div>
                        </template>
                    </el-dialog>
                </div>
            </el-tab-pane>
            <el-tab-pane label="测试用例" name="cases">
                <el-row>
                    <el-dropdown size="mini" split-button type="primary" @command="handleCommand" style="float: right; margin-right: 50px">
                        操作
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="exec" :disabled="permissions.indexOf('apitest.execute_apiset') === -1">
                                执行
                            </el-dropdown-item>
                            <el-dropdown-item command="linked" :disabled="permissions.indexOf('apitest.associate_cases') === -1">
                                关联测试用例
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-row>
                <set-case :value="testSetCases" :copy="false" :category="category" @changeOrder="changeRow" @removeRow="removeRow"></set-case>
                <!--关联测试用例-->
                <j-link
                    :value="testcases"
                    :show="dialogFormVisible"
                    :selected="[]"
                    :no="count"
                    @visible="listenVisible"
                    @pageSize="listenPageSize"
                    @currentPage="listenCurrentPage"
                    @getCases="listenGetCases"
                    @choice="listenChoice"
                ></j-link>
            </el-tab-pane>
            <el-tab-pane label="前置条件" name="setup">
                <el-row>
                    <el-dropdown size="mini" split-button type="primary" @command="handleSetUp" style="float: right; margin-right: 50px">
                        操作
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="setup" :disabled="permissions.indexOf('apitest.associate_cases') === -1">
                                关联测试用例
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-row>
                <set-case
                    :value="setupCases"
                    :attr="setup"
                    :category="category"
                    :copy="false"
                    @changeOrder="changeSetUpRow"
                    @removeRow="removeSetUpRow"
                ></set-case>
                <!--关联测试用例-->
                <j-link
                    :value="testcases"
                    :show="setupFormVisible"
                    :selected="[]"
                    :no="count"
                    @visible="listenSetUpVisible"
                    @pageSize="listenSetUpPageSize"
                    @currentPage="listenSetUpCurrentPage"
                    @getCases="listenSetUpGetCases"
                    @choice="listenSetUpChoice"
                ></j-link>
            </el-tab-pane>
            <el-tab-pane label="后置条件" name="teardown">
                <el-row>
                    <el-dropdown size="mini" split-button type="primary" @command="handleTearDown" style="float: right; margin-right: 50px">
                        操作
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="teardown" :disabled="permissions.indexOf('apitest.associate_cases') === -1">
                                关联测试用例
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-row>
                <set-case
                    :value="teardownCases"
                    :attr="teardown"
                    :copy="false"
                    :category="category"
                    @changeOrder="changeTearDownRow"
                    @removeRow="removeTearDownRow"
                ></set-case>
                <j-link
                    :value="testcases"
                    :show="teardownFormVisible"
                    :selected="[]"
                    :no="count"
                    @visible="listenTearDownVisible"
                    @pageSize="listenTearDownPageSize"
                    @currentPage="listenTearDownCurrentPage"
                    @getCases="listenTearDownGetCases"
                    @choice="listenTearDownChoice"
                ></j-link>
            </el-tab-pane>
            <el-tab-pane label="历史记录" name="history">
                <record v-model="setHistory" :kind="category"></record>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'UISetDetail',
    data() {
        return {
            activeName: 'info',
            setId: this.$route.params.id,
            name: this.$route.params.name,
            projectName: this.$route.query.project_name,
            setDetail: {},
            configReference: {},
            configList: [],
            testSetCases: [],
            testcases: [],
            setupCases: [],
            teardownCases: [],
            count: null,
            selectValue: '',
            category: 'ui',
            setup: 'setup',
            teardown: 'teardown',
            setHistory: [],
            dialogConfigVisible: false,
            dialogFormVisible: false,
            setupFormVisible: false,
            teardownFormVisible: false
        }
    },
    methods: {
        getTestSetDetail() {
            let id = this.$route.params.id
            let project = this.$route.query.project_name
            this.$api.api.ApiTestSetDetail(id, project).then(response => {
                this.setDetail = response.data
            })
        },
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        },
        getSetConfig() {
            this.$api.api
                .getSetConfig(this.setId, this.projectName)
                .then(response => {
                    this.configReference = response.data
                    this.selectValue = response.data.id
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getConfigList() {
            this.$api.api
                .getConfigList(1, 1000, this.projectName, 'ui')
                .then(response => {
                    this.configList = response.data.results
                    this.selectValue = this.configReference.id
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        remove(id) {
            this.$api.api
                .deleteApiTestSet(id)
                .then(() => {
                    this.notify.success('删除测试集成功')
                    this.$router.push({ name: 'UISetList', query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        handleCommandConfig(command) {
            if (command === 'delete') {
                const h = this.$createElement
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [h('span', null, '确定删除该测试集吗？')]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            this.remove(this.setId)
                            done()
                        } else {
                            done()
                        }
                    }
                })
                    .then(() => {})
                    .catch(() => {})
            } else if (command === 'update') {
                this.$router.push({ name: 'UpdateUISet', params: { name: this.name, id: this.setId }, query: this.$route.query })
            } else if (command === 'refer') {
                this.configChoice()
            }
        },
        configChoice() {
            this.dialogConfigVisible = true
        },
        configBeforeClose() {
            this.dialogConfigVisible = false
        },
        configCancel() {
            this.dialogConfigVisible = false
        },
        selectChoice() {
            let payload = {
                testset_id: this.setId,
                config_id: this.selectValue
            }
            this.configToSet(JSON.stringify(payload), this.projectName)
            this.dialogConfigVisible = false
        },
        configToSet(payload, project) {
            let _this = this
            this.$api.api
                .configToSet(payload, project)
                .then(() => {
                    _this.getSetConfig()
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        linked() {
            this.dialogFormVisible = true
        },
        execute() {
            let payload = {
                level: 'testSet',
                tasks: this.setId,
                category: 'ui'
            }
            this.$api.api
                .executeCase(JSON.stringify(payload), this.projectName)
                .then(() => {})
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        handleCommand(command) {
            if (command === 'linked') {
                this.linked()
            } else if (command === 'exec') {
                this.execute()
            }
        },
        getTestSetCases() {
            let _this = this
            this.$api.api
                .TestSetCases(_this.setId, _this.projectName)
                .then(response => {
                    _this.testSetCases = response.data
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getSetUpCases() {
            let _this = this
            this.$api.api
                .TestSetCases(_this.setId, _this.projectName, 'setup')
                .then(response => {
                    _this.setupCases = response.data
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getTeardownCases() {
            let _this = this
            this.$api.api
                .TestSetCases(_this.setId, _this.projectName, 'teardown')
                .then(response => {
                    _this.teardownCases = response.data
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getCases(pageSize, page) {
            this.$api.api
                .testCaseList(page, pageSize, this.projectName, 'ui')
                .then(response => {
                    this.testcases = response.data.results
                    this.count = response.data.count
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getSetHistory() {
            this.$api.api
                .history('set', this.setId)
                .then(response => {
                    this.setHistory = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        changeRow(event) {
            let payload = {
                apiset_id: this.setId,
                cases: event
            }
            this.changeOrder(JSON.stringify(payload), this.projectName)
        },
        removeCase(payload) {
            this.$api.api
                .removeCaseFromSet(JSON.stringify(payload), this.projectName)
                .then(() => {
                    this.notify.success('移除测试用例成功')
                    this.getTestSetCases()
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        removeRow(event) {
            let payload = {
                case_id: event.testcase.id,
                testset_id: this.setId,
                orderNum: event.orderNum
            }
            this.removeCase(payload)
        },
        listenVisible(event) {
            this.dialogFormVisible = event
        },
        listenPageSize(event) {
            this.getCases(event.pageSize, event.currentPage)
        },
        listenCurrentPage(event) {
            this.getCases(event.pageSize, event.currentPage)
        },
        listenGetCases(event) {
            this.getCases(event.pageSize, event.currentPage)
        },
        linkCases(payload) {
            return this.$api.api.caseToTestset(JSON.stringify(payload))
        },
        listenChoice(event) {
            let payload = {
                apiset_id: this.$route.params.id,
                cases: event.cases
            }
            this.linkCases(payload)
                .then(() => {
                    this.notify.success('添加测试用例成功')
                    this.dialogFormVisible = false
                    this.getTestSetCases()
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        handleSetUp(command) {
            if (command === 'setup') {
                this.setupFormVisible = true
            }
        },
        listenSetUpVisible(event) {
            this.setupFormVisible = event
        },
        listenSetUpPageSize(event) {
            this.getCases(event.pageSize, event.currentPage)
        },
        listenSetUpCurrentPage(event) {
            this.getCases(event.pageSize, event.currentPage)
        },
        listenSetUpGetCases(event) {
            this.getCases(event.pageSize, event.currentPage)
        },
        listenSetUpChoice(event) {
            let payload = {
                apiset_id: this.$route.params.id,
                cases: event.cases,
                handler: 'setup'
            }
            this.linkCases(payload)
                .then(() => {
                    this.notify.success('添加测试用例成功')
                    this.setupFormVisible = false
                    this.getSetUpCases()
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        changeSetUpRow(event) {
            let payload = {
                apiset_id: this.setId,
                cases: event,
                handler: 'setup'
            }
            this.$api.api
                .changeCasesOrder(JSON.stringify(payload), this.projectName)
                .then(() => {
                    this.getSetUpCases()
                })
                .catch(error => {
                    this.notify.error(error.response)
                })
        },
        removeSetUpRow(event) {
            let payload = {
                case_id: event.testcase.id,
                testset_id: this.setId,
                orderNum: event.orderNum,
                handler: 'setup'
            }
            this.removeSetUpCases(payload)
        },
        removeSetUpCases(payload) {
            this.$api.api
                .removeCaseFromSet(JSON.stringify(payload), this.projectName)
                .then(() => {
                    this.notify.success('移除测试用例成功')
                    this.getSetUpCases()
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        handleTearDown(command) {
            if (command === 'teardown') {
                this.teardownFormVisible = true
            }
        },
        changeTearDownRow(event) {
            let payload = {
                apiset_id: this.setId,
                cases: event,
                handler: 'teardown'
            }
            this.$api.api
                .changeCasesOrder(JSON.stringify(payload), this.projectName)
                .then(() => {
                    this.getTeardownCases()
                })
                .catch(error => {
                    this.notify.error(error.response)
                })
        },
        removeTearDownRow(event) {
            let payload = {
                case_id: event.testcase.id,
                testset_id: this.setId,
                orderNum: event.orderNum,
                handler: 'teardown'
            }
            this.removeTearDownCases(payload)
        },
        removeTearDownCases(payload) {
            this.$api.api
                .removeCaseFromSet(JSON.stringify(payload), this.projectName)
                .then(() => {
                    this.notify.success('移除测试用例成功')
                    this.getTeardownCases()
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        listenTearDownVisible(event) {
            this.teardownFormVisible = event
        },
        listenTearDownPageSize(event) {
            this.getCases(event.pageSize, event.currentPage)
        },
        listenTearDownCurrentPage(event) {
            this.getCases(event.pageSize, event.currentPage)
        },
        listenTearDownGetCases(event) {
            this.getCases(event.pageSize, event.currentPage)
        },
        listenTearDownChoice(event) {
            let payload = {
                apiset_id: this.$route.params.id,
                cases: event.cases,
                handler: 'teardown'
            }
            this.linkCases(payload)
                .then(() => {
                    this.notify.success('添加测试用例成功')
                    this.teardownFormVisible = false
                    this.getTeardownCases()
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        }
    },
    created() {
        this.getTestSetDetail()
        this.getPermissions()
        this.getSetConfig()
        this.getTestSetCases()
        this.getSetUpCases()
        this.getTeardownCases()
        this.getSetHistory()
    }
}
</script>

<style scoped>
.el-bread >>> .el-breadcrumb {
    line-height: 40px !important;
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
.is-link >>> .is-link {
    color: #409eff !important;
}
</style>
