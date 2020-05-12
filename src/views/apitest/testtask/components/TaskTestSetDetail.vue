<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'TestTaskList', query: $route.query }" class="is-link">测试任务</el-breadcrumb-item>
            <el-breadcrumb-item>
                <el-button class="el-button--text" @click="retreat">{{ $route.params.taskName }}</el-button>
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.params.setName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <template>
            <el-tabs v-model="activeName" style="background-color: white">
                <el-tab-pane disabled></el-tab-pane>
                <el-tab-pane label="基本信息" name="info">
                    <div class="el-table" style="padding: 0 40px">
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
                        <template v-if="setDetail.relationship">
                            <el-row :gutter="10" class="row-class test-left">
                                <el-col :span="2">开始时间</el-col>
                                <template v-if="setDetail.relationship.startRunTime">
                                    <el-col :span="22">{{ $moment(setDetail.relationship.startRunTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="22">-</el-col>
                                </template>
                            </el-row>
                            <el-row :gutter="10" class="row-class test-left">
                                <el-col :span="2">结束时间</el-col>
                                <template v-if="setDetail.relationship.endRunTime">
                                    <el-col :span="22">{{ $moment(setDetail.relationship.endRunTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="22">-</el-col>
                                </template>
                            </el-row>
                            <el-row :gutter="10" class="row-class test-left">
                                <el-col :span="2">状态</el-col>
                                <template v-if="setDetail.relationship.status === 'Starting'">
                                    <el-col :span="22">
                                        <tag-running></tag-running>
                                    </el-col>
                                </template>
                                <template v-else-if="setDetail.relationship.status === 'Done'">
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
                                <template v-if="setDetail.relationship.result === 'Failed'">
                                    <el-col :span="22">
                                        <tag-failed></tag-failed>
                                    </el-col>
                                </template>
                                <template v-else-if="setDetail.relationship.result === 'Succeed'">
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
                                <template v-if="setDetail.relationship.errorMessage">
                                    <el-col :span="22">
                                        <el-tooltip placement="top-start">
                                            <div slot="content">{{ setDetail.relationship.errorMessage }}</div>
                                            <el-button type="text" size="mini" plain class="el-button__text is-plain">
                                                {{ setDetail.relationship.errorMessage }}
                                            </el-button>
                                        </el-tooltip>
                                    </el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="22">-</el-col>
                                </template>
                            </el-row>
                        </template>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="测试用例" name="cases">
                    <el-table :data="setCases" style="padding-left: 20px; padding-right: 20px">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <template v-if="scope.row.relationship__response">
                                    <div>
                                        <el-row :gutter="10" class="row-class">
                                            <el-col :span="2" class="test-left">请求结果</el-col>
                                            <el-col :span="22" class="test-right">
                                                <j-editor v-model="scope.row.relationship__response" :edit="false"></j-editor>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="用例名称" min-width="50">
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
                        <el-table-column label="状态" min-width="50">
                            <template slot-scope="scope">
                                <template v-if="scope.row.relationship__status === 'Done'">
                                    <tag-done></tag-done>
                                </template>
                                <template v-else-if="scope.row.relationship__status === 'Starting'">
                                    <tag-running></tag-running>
                                </template>
                                <template v-else>
                                    <tag-not-run></tag-not-run>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="结果" min-width="100">
                            <template slot-scope="scope">
                                <template v-if="scope.row.relationship__result === 'Failed'">
                                    <el-popover trigger="hover" placement="top-start">
                                        <p>{{ scope.row.relationship__errorMessage }}</p>
                                        <div slot="reference">
                                            <tag-failed></tag-failed>
                                        </div>
                                    </el-popover>
                                </template>
                                <template v-else-if="scope.row.relationship__result === 'Succeed'">
                                    <tag-success></tag-success>
                                </template>
                                <template v-else
                                    >-</template
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="前置处理器" name="setup">
                    <el-table :data="setupCases" style="padding-left: 20px; padding-right: 20px">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <template v-if="scope.row.relationship__response">
                                    <div>
                                        <el-row :gutter="10" class="row-class">
                                            <el-col :span="2" class="test-left">请求结果</el-col>
                                            <el-col :span="22" class="test-right">
                                                <j-editor v-model="scope.row.relationship__response" :edit="false"></j-editor>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="用例名称" min-width="50">
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
                        <el-table-column label="状态" min-width="50">
                            <template slot-scope="scope">
                                <template v-if="scope.row.relationship__status === 'Done'">
                                    <tag-done></tag-done>
                                </template>
                                <template v-else-if="scope.row.relationship__status === 'Starting'">
                                    <tag-running></tag-running>
                                </template>
                                <template v-else>
                                    <tag-not-run></tag-not-run>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="结果" min-width="100">
                            <template slot-scope="scope">
                                <template v-if="scope.row.relationship__result === 'Failed'">
                                    <el-popover trigger="hover" placement="top-start">
                                        <p>{{ scope.row.relationship__errorMessage }}</p>
                                        <div slot="reference">
                                            <tag-failed></tag-failed>
                                        </div>
                                    </el-popover>
                                </template>
                                <template v-else-if="scope.row.relationship__result === 'Succeed'">
                                    <tag-success></tag-success>
                                </template>
                                <template v-else
                                    >-</template
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="后置处理器" name="teardown">
                    <el-table :data="teardownCases" style="padding-left: 20px; padding-right: 20px">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <template v-if="scope.row.relationship__response">
                                    <div>
                                        <el-row :gutter="10" class="row-class">
                                            <el-col :span="2" class="test-left">请求结果</el-col>
                                            <el-col :span="22" class="test-right">
                                                <j-editor v-model="scope.row.relationship__response" :edit="false"></j-editor>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="用例名称" min-width="50">
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
                        <el-table-column label="状态" min-width="50">
                            <template slot-scope="scope">
                                <template v-if="scope.row.relationship__status === 'Done'">
                                    <tag-done></tag-done>
                                </template>
                                <template v-else-if="scope.row.relationship__status === 'Starting'">
                                    <tag-running></tag-running>
                                </template>
                                <template v-else>
                                    <tag-not-run></tag-not-run>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="结果" min-width="100">
                            <template slot-scope="scope">
                                <template v-if="scope.row.relationship__result === 'Failed'">
                                    <el-popover trigger="hover" placement="top-start">
                                        <p>{{ scope.row.relationship__errorMessage }}</p>
                                        <div slot="reference">
                                            <tag-failed></tag-failed>
                                        </div>
                                    </el-popover>
                                </template>
                                <template v-else-if="scope.row.relationship__result === 'Succeed'">
                                    <tag-success></tag-success>
                                </template>
                                <template v-else>
                                    -
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>
<script>
export default {
    name: 'TaskTestDetail',
    data() {
        return {
            activeName: 'info',
            taskName: this.$route.params.taskId,
            projectName: this.$route.query.project_name,
            setId: this.$route.params.id,
            setDetail: {},
            setCases: [],
            setupCases: [],
            teardownCases: []
        }
    },
    methods: {
        retreat() {
            this.$router.go(-1)
        },
        taskSetDetail() {
            let _this = this
            this.$api.api
                .taskTestSetDetail(_this.setId, _this.taskName, _this.projectName)
                .then(response => {
                    _this.setDetail = response.data
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        parseJson(content) {
            if (typeof content == 'string') {
                try {
                    let obj = JSON.parse(content)
                    if (typeof obj == 'object' && obj) {
                        return obj
                    } else {
                        return content
                    }
                } catch (e) {
                    return content
                }
            }
        },
        parseResponse(contents) {
            for (let index in contents) {
                let content = contents[index]
                let response = content.relationship__response
                if (response) {
                    response = JSON.parse(response)
                    response.text = this.parseJson(response.text)
                    contents[index].relationship__response = response
                }
            }
            return contents
        },
        taskSetCases() {
            let _this = this
            this.$api.api
                .taskSetCases(_this.taskName, _this.setId, _this.projectName)
                .then(response => {
                    _this.setCases = _this.parseResponse(response.data)
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        taskSetSetUpCases() {
            let _this = this
            this.$api.api
                .taskSetCases(_this.taskName, _this.setId, _this.projectName, 'setup')
                .then(response => {
                    _this.setupCases = _this.parseResponse(response.data)
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        taskSetTearDownCases() {
            let _this = this
            this.$api.api
                .taskSetCases(_this.taskName, _this.setId, _this.projectName, 'teardown')
                .then(response => {
                    _this.teardownCases = _this.parseResponse(response.data)
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        }
    },
    created() {
        this.taskSetDetail()
        this.taskSetCases()
        this.taskSetSetUpCases()
        this.taskSetTearDownCases()
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
.is-plain:focus,
.is-plain:hover {
    color: #606266;
    border-color: white;
}
</style>
