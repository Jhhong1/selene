<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'UICaseList', query: $route.query }" class="is-link">UI测试用例</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
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
                    <el-collapse v-model="activeNames">
                        <el-collapse-item name="1" class="clearfix icon-hidden">
                            <template slot="title">
                                <div style="display: inline-block; padding-left: 10px;">
                                    基本信息
                                </div>
                            </template>
                            <el-card>
                                <div>
                                    <el-row :gutter="10" class="row-class">
                                        <el-col :span="2">用例名称</el-col>
                                        <el-col :span="10">{{ cases.name }}</el-col>
                                        <el-col :span="2">显示名称</el-col>
                                        <el-col :span="10">{{ cases.display }}</el-col>
                                    </el-row>
                                    <el-row :gutter="10" class="row-class">
                                        <el-col :span="2">创建时间</el-col>
                                        <el-col :span="10">{{ $moment(cases.createTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                                        <el-col :span="2">创建时间</el-col>
                                        <el-col :span="10">{{ $moment(cases.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                                    </el-row>
                                </div>
                            </el-card>
                        </el-collapse-item>
                        <el-collapse-item name="2" class="clearfix">
                            <template slot="title">
                                <div style="display: inline-block; padding-left: 10px;">
                                    操作步骤
                                </div>
                            </template>
                            <el-card>
                                <ui-step v-model="cases.procedures" :showBtn="false"></ui-step>
                            </el-card>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-tab-pane>
            <el-tab-pane label="历史记录" name="record">
                <case-history v-model="records" :category="category"></case-history>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'UICaseDetail',
    data() {
        return {
            activeName: 'baseinfo',
            activeNames: ['1', '2'],
            loading: false,
            cases: {},
            permissions: [],
            caseId: this.$route.params.id,
            projectName: this.$route.query.project_name,
            records: [],
            category: 'ui'
        }
    },
    methods: {
        detail() {
            this.loading = true
            this.$api.api
                .getCaseDetail(this.caseId, this.projectName)
                .then(response => {
                    this.cases = response.data
                    this.loading = false
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        update() {
            this.$router.push({ name: 'UpdateCase', params: { id: this.caseId }, query: this.$route.query })
        },
        remove(item) {
            this.$api.api
                .deleteCase(item)
                .then(() => {
                    this.notify.success('删除用例成功')
                    this.$router.push({ name: 'UICaseList', query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        execute(caseId) {
            let data = {
                level: 'case',
                tasks: caseId,
                category: 'ui'
            }
            this.$api.api
                .executeCase(JSON.stringify(data), this.projectName)
                .then(() => {})
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        handleCommand(command) {
            if (command === 'execute') {
                this.execute(this.caseId)
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
    mounted() {
        this.getPermissions()
        this.detail()
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
</style>
