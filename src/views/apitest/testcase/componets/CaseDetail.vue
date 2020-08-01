<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'ApiCaseList', query: $route.query }" class="is-link">接口测试用例</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <template>
            <el-tabs v-model="activeName" style="background-color: white">
                <el-tab-pane disabled></el-tab-pane>
                <el-tab-pane label="基本信息" name="baseinfo">
                    <div class="box-card" v-loading="loading">
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
                        <detail v-model="cases"></detail>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="历史记录" name="record">
                    <case-history v-model="records"></case-history>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
export default {
    name: 'CaseDetail',
    data() {
        return {
            activeName: 'baseinfo',
            cases: {},
            loading: false,
            caseId: this.$route.params.id,
            projectName: this.$route.query.project_name,
            permissions: [],
            response: {},
            records: []
        }
    },
    methods: {
        CaseDetail() {
            let self = this
            this.loading = true
            this.$api.api
                .getCaseDetail(self.caseId)
                .then(response => {
                    let results = response.data
                    self.cases = Object.assign({}, results)
                    self.cases.createTime = self.$moment(self.cases.createTime).format('YYYY-MM-DD HH:mm:ss')
                    self.cases.updateTime = self.$moment(self.cases.updateTime).format('YYYY-MM-DD HH:mm:ss')
                    self.cases.startRunTime =
                        self.cases.executionrecord_set.length > 0
                            ? self.$moment(self.cases.executionrecord_set[0].start_time).format('YYYY-MM-DD HH:mm:ss')
                            : null
                    self.cases.endRunTime =
                        self.cases.executionrecord_set > 0
                            ? self.$moment(self.cases.executionrecord_set[0].end_time).format('YYYY-MM-DD HH:mm:ss')
                            : null
                    self.cases.status = self.cases.executionrecord_set > 0 ? self.cases.executionrecord_set[0].status : null
                    self.cases.result = self.cases.executionrecord_set > 0 ? self.cases.executionrecord_set[0].result : null

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
                    tasks: this.caseId,
                    category: 'api'
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
        },
        historyRecord() {
            this.$api.api
                .history('case', this.caseId)
                .then(response => {
                    this.records = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        }
    },
    created() {
        this.CaseDetail()
        this.getPermissions()
        this.historyRecord()
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
