<template>
    <div>
        <template v-if="permissions.indexOf('apitest.add_crontabscheduleextend') > -1">
            <router-link tag="el-button" class="el-button--primary el-button--mini p-button" :to="{ name: 'AddRule', query: $route.query }">
                添加定时规则
            </router-link>
        </template>
        <template v-else>
            <el-button class="el-button--primary el-button--mini p-button" disabled>添加定时规则</el-button>
        </template>
        <el-table :data="rules" class="table-class td">
            <el-table-column label="名称" min-width="150">
                <template slot-scope="scope">
                    <ul class="ul-style">
                        <li>
                            <!-- <router-link
                                :to="{ name: 'TestTaskDetail', params: { name: scope.row.name, id: scope.row.id }, query: $route.query }"
                                class="el-link el-link--primary"
                            > -->
                            {{ scope.row.name }}
                            <!-- </router-link> -->
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
            <el-table-column label="规则" min-width="150">
                <template slot-scope="scope">
                    {{ scope.row.minute }}&nbsp;{{ scope.row.hour }}&nbsp;{{ scope.row.day_of_month }}&nbsp;{{ scope.row.month_of_year }}&nbsp;{{
                        scope.row.day_of_week
                    }}
                </template>
            </el-table-column>
            <el-table-column label="时区" min-width="150" prop="timezone"></el-table-column>
            <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                        <span>
                            <i class="el-icon-more-outline rotating"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{ type: 'update', row: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.change_crontabscheduleextend') === -1"
                                >更新</el-dropdown-item
                            >
                            <el-dropdown-item
                                :command="{ type: 'del', index: scope.$index, row: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.delete_crontabscheduleextend') === -1"
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
    </div>
</template>
<script>
export default {
    name: 'RuleList',
    data() {
        return {
            rules: [],
            projectName: this.$route.query.project_name,
            count: null,
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1,
            permissions: []
        }
    },
    methods: {
        ruleList() {
            this.$api.api
                .getCrontabRuleList(this.currentPage, this.pageSize, this.projectName)
                .then(response => {
                    this.rules = response.data.results
                    this.count = response.data.count
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        removeRule(ruleId) {
            this.$api.api
                .deleteCrontabRule(ruleId, this.projectName)
                .then(() => {
                    this.notify.success('删除定时规则成功')
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        deleteRow(index, rows, ruleId) {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定删除该条定时规则吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.removeRule(ruleId)
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
            if (command.type === 'update') {
                this.$router.push({ name: 'UpdateRule', params: { id: command.row }, query: this.$route.query })
            } else if (command.type === 'del') {
                this.deleteRow(command.index, this.rules, command.row)
            }
        },
        currentChange(val) {
            this.currentPage = val
            this.ruleList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.ruleList()
        },
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        }
    },
    created() {
        this.getPermissions()
        this.ruleList()
    }
}
</script>
<style scoped></style>
