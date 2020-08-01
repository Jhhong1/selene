<template>
    <div>
        <template v-if="permissions.indexOf('apitest.create_apicases') > -1">
            <router-link tag="el-button" :to="{ name: 'AddCase', query: $route.query }" class="el-button--primary el-button--mini p-button">
                添加测试用例
            </router-link>
        </template>
        <template v-else>
            <el-button class="el-button--primary el-button--mini p-button" disabled>添加测试用例</el-button>
        </template>
        <el-table class="table-class td" :data="cases">
            <el-table-column label="用例名称" min-width="200">
                <template slot-scope="scope">
                    <ul class="ul-style">
                        <li>
                            <router-link
                                :to="{ name: 'UICaseDetail', params: { id: scope.row.id }, query: $route.query }"
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
            <el-table-column label="状态" min-width="100">
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
            <el-table-column label="结果" min-width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.hasOwnProperty('executionrecord_set') && scope.row.executionrecord_set.length > 0">
                        <template v-if="scope.row.executionrecord_set[0].result === 'Failed'">
                            <tag-failed></tag-failed>
                            <!-- <el-popover trigger="hover" placement="top-start">
                                <p>{{ scope.row.caserelationship.errorMessage }}</p>
                                <div slot="reference">
                                    <tag-failed></tag-failed>
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
            <el-table-column label="操作" min-width="80">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                        <span>
                            <i class="el-icon-more-outline rotating"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="{ type: 'view', row: scope.row.id }">查看</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'update', row: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.update_apicases') === -1"
                            >
                                更新
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'exec', row: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.execute_apicases') === -1"
                            >
                                执行
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'del', index: scope.$index, row: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.delete_apicases') === -1"
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
    name: 'UICaseList',
    data() {
        return {
            count: null,
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1,
            projectName: this.$route.query.project_name,
            permissions: [],
            cases: []
        }
    },
    methods: {
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        },
        uiCaseList() {
            this.$api.api
                .testCaseList(this.currentPage, this.pageSize, this.projectName, 'ui')
                .then(response => {
                    this.cases = response.data.results
                    this.count = response.data.count
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        removeCase(caseId) {
            this.$api.api.deleteCase(caseId).then(() => {
                this.notify.success('删除用例成功')
            })
        },
        deleteRow(index, rows, caseId) {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定删除该条用例吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.removeCase(caseId)
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
            const _this = this
            if (command.type === 'del') {
                this.deleteRow(command.index, _this.cases, command.row)
            } else if (command.type === 'view') {
                this.$router.push({ name: 'UICaseDetail', params: { id: command.row }, query: _this.$route.query })
            } else if (command.type === 'update') {
                this.$router.push({ name: 'UpdateCase', params: { id: command.row }, query: _this.$route.query })
            } else if (command.type === 'exec') {
                this.execute(command.row)
            }
        },
        currentChange(val) {
            this.currentPage = val
            this.uiCaseList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.uiCaseList()
        }
    },
    created() {
        this.getPermissions()
        this.uiCaseList()
    }
}
</script>

<style scoped>
.td >>> .name-wrapper {
    white-space: nowrap !important;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
<style>
.el-popover {
    max-width: 500px;
    max-height: 100px;
    word-break: break-word;
    background-color: #303133;
    color: white;
    padding: 0 10px 0 10px;
    font-size: 12px;
    overflow: auto;
}
.el-popper .popper__arrow {
    display: none;
}
</style>
