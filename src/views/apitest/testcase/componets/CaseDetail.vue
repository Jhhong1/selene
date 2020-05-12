<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'ApiCaseList', query: $route.query }" class="is-link">接口测试用例</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box-card" v-loading="loading">
            <el-collapse v-model="activeNames">
                <el-collapse-item name="1" class="clearfix icon-hidden">
                    <template slot="title">
                        <div style="display: inline-block">
                            基本信息
                        </div>
                        <!--阻止事件冒泡-->
                        <div class="button-position" @click.stop.prevent>
                            <el-dropdown size="mini" split-button type="primary" @command="handleCommand">
                                操作
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="update" :disabled="permissions.indexOf('apitest.update_apicases') === -1">
                                        更新
                                    </el-dropdown-item>
                                    <el-dropdown-item command="execute" :disabled="permissions.indexOf('apitest.execute_apicases') === -1">
                                        执行
                                    </el-dropdown-item>
                                    <el-dropdown-item command="del" :disabled="permissions.indexOf('apitest.delete_apicases') === -1">
                                        删除
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </template>
                    <el-card>
                        <div>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">名称</el-col>
                                <template v-if="cases.name">
                                    <el-col :span="10" class="test-right">{{ cases.name }}</el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="11" class="test-right">-</el-col>
                                </template>
                                <el-col :span="2" class="test-left">显示名称</el-col>
                                <template v-if="cases.display">
                                    <el-col :span="10" class="test-right">{{ cases.display }}</el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="10" class="test-right">-</el-col>
                                </template>
                            </el-row>
                            <template v-if="cases.caserelationship">
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">状态</el-col>
                                    <template v-if="cases.caserelationship.status === 'Starting'">
                                        <el-col :span="10" class="test-right">
                                            <tag-running></tag-running>
                                        </el-col>
                                    </template>
                                    <template v-else-if="cases.caserelationship.status === 'Done'">
                                        <el-col :span="10" class="test-right">
                                            <tag-done></tag-done>
                                        </el-col>
                                    </template>
                                    <template v-else>
                                        <el-col :span="10" class="test-right">
                                            <tag-not-run></tag-not-run>
                                        </el-col>
                                    </template>
                                    <el-col :span="2" class="test-left">更新时间</el-col>
                                    <template v-if="cases.updateTime">
                                        <el-col :span="10" class="test-right">{{ cases.updateTime }}</el-col>
                                    </template>
                                    <template v-else>
                                        <el-col :span="10" class="test-right">-</el-col>
                                    </template>
                                </el-row>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">执行结果</el-col>
                                    <template v-if="cases.caserelationship.result === 'Succeed'">
                                        <el-col :span="10" class="test-right">
                                            <tag-success></tag-success>
                                        </el-col>
                                    </template>
                                    <template v-else-if="cases.caserelationship.result === 'Failed'">
                                        <el-col :span="10" class="test-right">
                                            <tag-failed></tag-failed>
                                        </el-col>
                                    </template>
                                    <template v-else>
                                        <el-col :span="10" class="test-right">-</el-col>
                                    </template>
                                    <el-col :span="2" class="test-left">创建时间</el-col>
                                    <template v-if="cases.createTime">
                                        <el-col :span="10" class="test-right">{{ cases.createTime }}</el-col>
                                    </template>
                                    <template v-else>
                                        <el-col :span="10" class="test-right">-</el-col>
                                    </template>
                                </el-row>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">结束时间</el-col>
                                    <template v-if="cases.caserelationship.endRunTime">
                                        <el-col :span="10" class="test-right">
                                            {{ cases.endRunTime }}
                                        </el-col>
                                    </template>
                                    <template v-else>
                                        <el-col :span="10" class="test-right">-</el-col>
                                    </template>
                                    <el-col :span="2" class="test-left">开始时间</el-col>
                                    <template v-if="cases.caserelationship.startRunTime">
                                        <el-col :span="10" class="test-right">
                                            {{ cases.startRunTime }}
                                        </el-col>
                                    </template>
                                    <template v-else>
                                        <el-col :span="10" class="test-right">-</el-col>
                                    </template>
                                </el-row>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">失败原因</el-col>
                                    <template v-if="cases.caserelationship.errorMessage">
                                        <el-col :span="10" class="test-right">
                                            <el-tooltip placement="top-start">
                                                <div slot="content">{{ cases.caserelationship.errorMessage }}</div>
                                                <el-button type="text" size="mini" plain class="el-button__text is-plain">{{
                                                    cases.caserelationship.errorMessage
                                                }}</el-button>
                                            </el-tooltip>
                                        </el-col>
                                    </template>
                                    <template v-else>
                                        <el-col :span="10" class="test-right">-</el-col>
                                    </template>
                                </el-row>
                            </template>
                            <template v-else>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">状态</el-col>
                                    <el-col :span="10" class="test-right">
                                        <tag-not-run></tag-not-run>
                                    </el-col>
                                    <el-col :span="2" class="test-left">更新时间</el-col>
                                    <template v-if="cases.updateTime">
                                        <el-col :span="10" class="test-right">{{ cases.updateTime }}</el-col>
                                    </template>
                                    <template v-else>
                                        <el-col :span="10" class="test-right">-</el-col>
                                    </template>
                                </el-row>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">执行结果</el-col>
                                    <el-col :span="10" class="test-right">-</el-col>
                                    <el-col :span="2" class="test-left">创建时间</el-col>
                                    <template v-if="cases.createTime">
                                        <el-col :span="10" class="test-right">{{ cases.createTime }}</el-col>
                                    </template>
                                    <template v-else>
                                        <el-col :span="10" class="test-right">-</el-col>
                                    </template>
                                </el-row>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">结束时间</el-col>
                                    <el-col :span="10" class="test-right">-</el-col>
                                    <el-col :span="2" class="test-left">开始时间</el-col>
                                    <el-col :span="10" class="test-right">-</el-col>
                                </el-row>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">失败原因</el-col>
                                    <el-col :span="10" class="test-right">-</el-col>
                                </el-row>
                            </template>
                        </div>
                    </el-card>
                </el-collapse-item>
                <el-collapse-item title="详情" name="2" class="clearfix">
                    <el-card>
                        <div>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">请求地址</el-col>
                                <el-col :span="22" class="test-right">{{ cases.url }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">请求方法</el-col>
                                <el-col :span="22" class="test-right">{{ cases.method }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">变量</el-col>
                                <el-col :span="22" class="test-right">
                                    <j-input v-model="cases.variables" :edit="false"></j-input>
                                </el-col>
                            </el-row>
                            <!-- <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">认证方式</el-col>
                                <el-col :span="22" class="test-right">
                                    <el-row>
                                        <el-col class="bg-purple-light" :span="4">类型</el-col>
                                        <el-col class="bg-purple-light" :span="10">用户名</el-col>
                                        <el-col class="bg-purple-light" :span="10">密码</el-col>
                                    </el-row>
                                    <el-row style="padding-left: 10px">
                                        <el-col :span="4">{{ cases.authMethod }}</el-col>
                                        <template v-if="cases.auth">
                                            <el-col :span="10">{{ cases.auth.username }}</el-col>
                                        </template>
                                        <template v-else>
                                            <el-col :span="10">-</el-col>
                                        </template>
                                        <template v-if="cases.auth">
                                            <el-col :span="10">{{ cases.auth.password }}</el-col>
                                        </template>
                                        <template v-else>
                                            <el-col :span="10">-</el-col>
                                        </template>
                                    </el-row>
                                </el-col>
                            </el-row> -->
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">头部信息</el-col>
                                <el-col :span="22" class="test-right">
                                    <j-input v-model="cases.headers" :edit="false"></j-input>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">请求内容</el-col>
                                <el-col :span="22" class="test-right">
                                    <j-editor v-model="cases.body" :edit="false"></j-editor>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">结果断言</el-col>
                                <el-col :span="22" class="test-right">
                                    <j-assert v-model="cases.asserts" :show-btn="false" class="bg-change"></j-assert>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">提取参数</el-col>
                                <el-col :span="22" class="test-right">
                                    <j-extract v-model="cases.extracts" :edit="false" class="bg-change"></j-extract>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">超时时间</el-col>
                                <template v-if="cases.waitingTime">
                                    <el-col :span="22"> {{ cases.waitingTime }} s </el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="22">-</el-col>
                                </template>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">重试次数</el-col>
                                <template v-if="cases.cycle">
                                    <el-col :span="22"> {{ cases.cycle }} 次</el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="22">0 次</el-col>
                                </template>
                            </el-row>
                            <!-- <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left" style="height: 40px;line-height: 40px">
                                    失败后是否继续
                                </el-col>
                                <el-col :span="22" class="test-right">
                                    <el-tooltip :content="'' + cases.continues" placement="right-start" class="el--swith">
                                        <el-switch v-model="cases.continues" disabled></el-switch>
                                    </el-tooltip>
                                </el-col>
                            </el-row> -->
                        </div>
                    </el-card>
                </el-collapse-item>
                <template v-if="cases.caserelationship">
                    <el-collapse-item title="请求结果" name="3" class="clearfix">
                        <el-card>
                            <div>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">响应码</el-col>
                                    <el-col :span="22">{{ response.status_code }}</el-col>
                                </el-row>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">头部信息</el-col>
                                    <el-col :span="22" class="test-right">
                                        <j-editor v-model="response.headers" :edit="false"></j-editor>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">响应文本</el-col>
                                    <el-col :span="22" class="test-right">
                                        <j-editor v-model="response.text" :edit="false"></j-editor>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-card>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CaseDetail',
    data() {
        return {
            activeNames: ['1', '2', '3'],
            cases: {},
            loading: false,
            caseId: this.$route.params.id,
            projectName: this.$route.query.project_name,
            permissions: [],
            response: {}
        }
    },
    methods: {
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
        CaseDetail() {
            let self = this
            this.loading = true
            this.$api.api
                .getCaseDetail(self.caseId)
                .then(response => {
                    let results = response.data
                    self.cases = Object.assign(self.cases, results)
                    self.cases.createTime = self.$moment(self.cases.createTime).format('YYYY-MM-DD HH:mm:ss')
                    self.cases.updateTime = self.$moment(self.cases.updateTime).format('YYYY-MM-DD HH:mm:ss')
                    self.cases.startRunTime = self.cases.caserelationship
                        ? self.$moment(self.cases.caserelationship.startRunTime).format('YYYY-MM-DD HH:mm:ss')
                        : null
                    self.cases.endRunTime = self.cases.caserelationship
                        ? self.$moment(self.cases.caserelationship.endRunTime).format('YYYY-MM-DD HH:mm:ss')
                        : null
                    self.response = self.cases.caserelationship ? JSON.parse(self.cases.caserelationship.response) : null
                    if (self.response) {
                        self.response.text = self.parseJson(self.response.text)
                    }
                    this.loading = false
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        update() {
            this.$router.push({ name: 'UpdateApiCase', params: { id: this.caseId }, query: this.$route.query })
        },
        execute(data, project) {
            this.$api.api
                .executeCase(data, project)
                .then(() => {})
                .catch(error => {
                    this.notify.error(error)
                })
        },
        remove(item) {
            this.$api.api
                .deleteCase(item)
                .then(() => {
                    this.notify.success('删除用例成功')
                    this.$router.push({ name: 'ApiCaseList', query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        handleCommand(command) {
            if (command === 'execute') {
                let data = {
                    level: 'case',
                    tasks: this.caseId
                }
                this.execute(JSON.stringify(data), this.projectName)
            } else if (command === 'del') {
                const h = this.$createElement
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [h('span', null, '确定删除该条用例吗？')]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            this.remove(this.caseId)
                            done()
                        } else {
                            done()
                        }
                    }
                })
                    .then(() => {})
                    .catch(() => {})
            } else if (command === 'update') {
                this.update()
            }
        },
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        }
    },
    created() {
        this.CaseDetail()
        this.getPermissions()
    },
    mounted() {}
}
</script>

<style scoped>
.el-bread >>> .el-breadcrumb {
    line-height: 40px !important;
}
.is-link >>> .is-link {
    color: #409eff !important;
}
.bg-change >>> .el-input__inner {
    background-color: white !important;
}
.box-card {
    position: relative;
    /*margin-top: 20px;*/
    line-height: 20px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 15px;
    background-color: white;
}
.clearfix {
    text-align: left;
}
.icon-hidden >>> .el-icon-arrow-right:before {
    display: none !important;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
}
.clearfix:after {
    clear: both;
}
.select-class {
    display: block;
}
.col-class {
    margin-top: 20px;
}
.is-plain:focus,
.is-plain:hover {
    color: #606266;
    border-color: white;
}
</style>
<style>
.el-tooltip__popper {
    position: absolute;
    max-width: 30%;
    word-break: break-word;
    background-color: #303133;
    color: #fff;
    padding: 5px 10px 5px 10px;
    font-size: 12px;
    overflow: auto;
    max-height: 100px;
}
</style>
