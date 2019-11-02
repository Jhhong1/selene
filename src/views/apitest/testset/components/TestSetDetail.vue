<template>
    <div>
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'ApiTestSetList', query: $route.query }" class="is-link">测试集</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <template>
            <el-tabs v-model="activeName" style="background-color: white">
                <el-tab-pane disabled></el-tab-pane>
                <el-tab-pane label="基本信息" name="info">
                    <div class="el-table" style="padding: 0 40px">
                        <el-row class="row-class">
                            <el-dropdown
                                size="mini"
                                split-button
                                type="primary"
                                @command="handleCommandConfig"
                                style="float: right; margin-right: 50px"
                            >
                                操作
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="refer" :disabled="permissions.indexOf('apitest.config_apiset') === -1">
                                        配置引用
                                    </el-dropdown-item>
                                    <el-dropdown-item command="update" :disabled="permissions.indexOf('apitest.change_apiset') === -1">
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
                                <el-col :span="22">
                                    <el-tooltip placement="top-start">
                                        <div slot="content">{{ setDetail.description }}</div>
                                        <el-button type="text" size="mini" plain class="el-button__text is-plain">{{
                                            setDetail.description
                                        }}</el-button>
                                    </el-tooltip>
                                </el-col>
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
                        <template v-if="setDetail.testsetrelationship">
                            <el-row :gutter="10" class="row-class test-left">
                                <el-col :span="2">开始时间</el-col>
                                <template v-if="setDetail.testsetrelationship.startRunTime">
                                    <el-col :span="22">{{
                                        $moment(setDetail.testsetrelationship.startRunTime).format('YYYY-MM-DD HH:mm:ss')
                                    }}</el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="22">-</el-col>
                                </template>
                            </el-row>
                            <el-row :gutter="10" class="row-class test-left">
                                <el-col :span="2">结束时间</el-col>
                                <template v-if="setDetail.testsetrelationship.endRunTime">
                                    <el-col :span="22">{{ $moment(setDetail.testsetrelationship.endRunTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="22">-</el-col>
                                </template>
                            </el-row>
                            <el-row :gutter="10" class="row-class test-left">
                                <el-col :span="2">状态</el-col>
                                <template v-if="setDetail.testsetrelationship.status === 'Starting'">
                                    <el-col :span="22">
                                        <tag-running></tag-running>
                                    </el-col>
                                </template>
                                <template v-else-if="setDetail.testsetrelationship.status === 'Done'">
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
                                <template v-if="setDetail.testsetrelationship.result === 'Failed'">
                                    <el-col :span="22">
                                        <tag-failed></tag-failed>
                                    </el-col>
                                </template>
                                <template v-else-if="setDetail.testsetrelationship.result === 'Succeed'">
                                    <el-col :span="2">
                                        <tag-success></tag-success>
                                    </el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="22">-</el-col>
                                </template>
                            </el-row>
                            <el-row :gutter="10" class="row-class test-left">
                                <el-col :span="2">失败原因</el-col>
                                <template v-if="setDetail.testsetrelationship.errorMessage">
                                    <el-col :span="22">
                                        <el-tooltip placement="top-start">
                                            <div slot="content">{{ setDetail.testsetrelationship.errorMessage }}</div>
                                            <el-button type="text" size="mini" plain class="el-button__text is-plain">{{
                                                setDetail.testsetrelationship.errorMessage
                                            }}</el-button>
                                        </el-tooltip>
                                    </el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="22">-</el-col>
                                </template>
                            </el-row>
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
                            <el-row :gutter="10" class="row-class test-left">
                                <el-col :span="2">失败原因</el-col>
                                <el-col :span="22">-</el-col>
                            </el-row>
                        </template>
                        <el-row :gutter="10" class="row-class test-left">
                            <el-col :span="2">配置引用</el-col>
                            <template v-if="Object.keys(configReference).length">
                                <el-col :span="22">{{ configReference.name }}</el-col>
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
                                            <el-option v-for="item in configList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
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
                                <el-dropdown-item command="linked" :disabled="permissions.indexOf('apitest.cases_apiset') === -1">
                                    关联测试用例
                                </el-dropdown-item>
                                <!-- <el-dropdown-item command="createCase">创建测试用例</el-dropdown-item> -->
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-row>
                    <set-case :value="testSetCases" @copy="copyRow" @changeOrder="changeRow" @removeRow="removeRow"></set-case>
                    <!--关联测试用例-->
                    <j-link
                        :value="testcases"
                        :show="dialogFormVisible"
                        :selected="testSetCases"
                        :no="count"
                        @visible="listenVisible"
                        @pageSize="listenPageSize"
                        @currentPage="listenCurrentPage"
                        @getCases="listenGetCases"
                        @choice="listenChoice"
                    ></j-link>
                </el-tab-pane>
                <el-tab-pane label="前置处理器" name="setup">
                    <el-row>
                        <el-dropdown size="mini" split-button type="primary" @command="handleSetUp" style="float: right; margin-right: 50px">
                            操作
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="setup" :disabled="permissions.indexOf('apitest.cases_apiset') === -1">
                                    关联测试用例
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-row>
                    <set-case :value="setupCases" :attr="setup" :copy="false" @changeOrder="changeSetUpRow" @removeRow="removeSetUpRow"></set-case>
                    <!--关联测试用例-->
                    <j-link
                        :value="testcases"
                        :show="setupFormVisible"
                        :selected="setupCases"
                        :no="count"
                        @visible="listenSetUpVisible"
                        @pageSize="listenSetUpPageSize"
                        @currentPage="listenSetUpCurrentPage"
                        @getCases="listenSetUpGetCases"
                        @choice="listenSetUpChoice"
                    ></j-link>
                </el-tab-pane>
                <el-tab-pane label="后置处理器" name="teardown">
                    <el-row>
                        <el-dropdown size="mini" split-button type="primary" @command="handleTearDown" style="float: right; margin-right: 50px">
                            操作
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="teardown" :disabled="permissions.indexOf('apitest.cases_apiset') === -1">
                                    关联测试用例
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-row>
                    <set-case
                        :value="teardownCases"
                        :attr="teardown"
                        :copy="false"
                        @changeOrder="changeTearDownRow"
                        @removeRow="removeTearDownRow"
                    ></set-case>
                    <j-link
                        :value="testcases"
                        :show="teardownFormVisible"
                        :selected="teardownCases"
                        :no="count"
                        @visible="listenTearDownVisible"
                        @pageSize="listenTearDownPageSize"
                        @currentPage="listenTearDownCurrentPage"
                        @getCases="listenTearDownGetCases"
                        @choice="listenTearDownChoice"
                    ></j-link>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
export default {
    name: 'TestSetDetail',
    data() {
        return {
            activeName: 'info',
            setId: this.$route.params.id,
            projectName: this.$route.query.project_name,
            setDetail: {},
            testcases: [],
            testSetCases: [],
            setupCases: [],
            teardownCases: [],
            dialogFormVisible: false,
            setupFormVisible: false,
            teardownFormVisible: false,
            dialogConfigVisible: false,
            count: null,
            configList: [],
            selectValue: '',
            configReference: {},
            permissions: [],
            setup: 'setup',
            teardown: 'teardown'
        }
    },
    methods: {
        configCancel() {
            this.dialogConfigVisible = false
        },
        configChoice() {
            this.dialogConfigVisible = true
        },
        selectChoice() {
            let payload = {
                testset_id: this.setId,
                config_id: this.selectValue
            }
            this.configToSet(JSON.stringify(payload), this.projectName)
            this.dialogConfigVisible = false
        },
        getConfigList() {
            this.$api.api
                .getConfigList(this.currentPage, this.pageSize, this.projectName)
                .then(response => {
                    this.configList = response.data.results
                    this.selectValue = this.configReference.id
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
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
        configBeforeClose() {
            this.dialogConfigVisible = false
        },
        changeRow(event) {
            let payload = {
                apiset_id: this.setId,
                cases: JSON.stringify(event)
            }
            this.changeOrder(JSON.stringify(payload), this.projectName)
        },
        copyRow(event) {
            let payload = {
                testset_id: this.setId,
                testcase_id: event.case.testcase.id,
                orderNum: event.case.orderNum
            }
            this.copyCase(JSON.stringify(payload), this.projectName)
        },
        removeRow(event) {
            let payload = {
                case_id: event.testcase.id,
                testset_id: this.setId,
                orderNum: event.orderNum
            }
            this.removeCase(payload)
        },
        changeOrder(payload, project) {
            let _this = this
            this.$api.api
                .changeCasesOrder(payload, project)
                .then(() => {
                    _this.getTestSetCases(_this.setId, _this.projectName)
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getTestSetDetail() {
            let id = this.$route.params.id
            let project = this.$route.query.project_name
            this.$api.api.ApiTestSetDetail(id, project).then(response => {
                this.setDetail = response.data
            })
        },
        execute() {
            let payload = {
                level: 'testSet',
                tasks: this.setId
            }
            this.$api.api
                .executeCase(JSON.stringify(payload), this.projectName)
                .then(() => {})
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
                this.$router.push({ name: 'ApiTestSetUpdate', params: { id: this.setId }, query: this.$route.query })
            } else if (command === 'refer') {
                this.configChoice()
            }
        },
        handleCommand(command) {
            if (command === 'linked') {
                this.linked()
            } else if (command === 'exec') {
                this.execute()
            }
        },
        linked() {
            this.dialogFormVisible = true
        },
        remove(id) {
            this.$api.api
                .deleteApiTestSet(id)
                .then(() => {
                    this.notify.success('删除测试集成功')
                    this.$router.push({ name: 'ApiTestSetList', query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getCases(pageSize, page) {
            this.$api.api
                .testCaseList(page, pageSize, this.projectName)
                .then(response => {
                    this.testcases = response.data.results
                    this.count = response.data.count
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
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
        copyCase(data, project) {
            let _this = this
            this.$api.api
                .copyTestSetCase(data, project)
                .then(() => {
                    _this.getTestSetCases()
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        },
        handleSetUp(command) {
            if (command === 'setup') {
                this.setupFormVisible = true
            }
        },
        handleTearDown(command) {
            if (command === 'teardown') {
                this.teardownFormVisible = true
            }
        },
        linkCases(payload) {
            return this.$api.api.caseToTestset(JSON.stringify(payload))
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
        changeSetUpRow(event) {
            let payload = {
                apiset_id: this.setId,
                cases: JSON.stringify(event),
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
        changeTearDownRow(event) {
            let payload = {
                apiset_id: this.setId,
                cases: JSON.stringify(event),
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
        }
    },
    created() {
        this.getPermissions()
        this.getTestSetDetail()
        this.getSetConfig()
        this.getTestSetCases()
        this.getSetUpCases()
        this.getTeardownCases()
    },
    mounted() {}
}
</script>

<style scoped>
.is-link >>> .is-link {
    color: #409eff !important;
}
.test-left {
    text-align: left;
    font-size: 14px;
}
.is-plain:focus,
.is-plain:hover {
    color: #606266;
    border-color: white;
}
</style>
<style></style>
