<template>
    <div>
        <router-link
            tag="el-button"
            :to="{ name: 'AddConfig', query: $route.query }"
            class="el-button--primary el-button--mini p-button"
            :class="{ 'is-disabled': permissions.indexOf('apitest.create_config') === -1 }"
            :disabled="permissions.indexOf('apitest.create_config') === -1"
        >
            添加配置
        </router-link>
        <el-table class="table-class td" :data="dataTable">
            <el-table-column label="名称" min-width="150">
                <template slot-scope="scope">
                    <el-col class="config-name" :span="14">
                        <ul class="ul-style">
                            <li>
                                <router-link
                                    :to="{ name: 'ConfigDetail', params: { id: scope.row.id }, query: $route.query }"
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
                    </el-col>
                    <el-col :span="10">
                        <template v-if="scope.row.globalConfig">
                            &nbsp;
                            <el-tag size="mini">全局变量</el-tag>
                        </template>
                    </el-col>
                </template>
            </el-table-column>
            <el-table-column label="请求地址" min-width="300" prop="baseurl"></el-table-column>
            <el-table-column label="类型" min-width="100" prop="category"></el-table-column>
            <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                        <span>
                            <i class="el-icon-more-outline rotating"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="{ type: 'view', row: scope.row.id }">查看</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'update', row: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.update_config') === -1"
                            >
                                更新
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'del', index: scope.$index, row: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.delete_config') === -1"
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
    name: 'ConfigList',
    data() {
        return {
            dataTable: [],
            projectName: this.$route.query.project_name,
            count: null,
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1,
            loading: true,
            permissions: []
        }
    },
    methods: {
        getConfigList() {
            let _this = this
            this.$api.api
                .getConfigList(_this.currentPage, _this.pageSize, _this.projectName)
                .then(response => {
                    _this.dataTable = response.data.results
                    _this.count = response.data.count
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        currentChange(val) {
            this.currentPage = val
            this.getConfigList()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getConfigList()
        },
        removeConfig(configId) {
            const _this = this
            this.$api.api
                .deleteConfig(configId, _this.projectName)
                .then(() => {
                    _this.notify.success('删除配置成功')
                })
                .catch(error => {
                    _this.notify.error(error)
                })
        },
        deleteRow(index, rows, configId) {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定删除该条配置吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.removeConfig(configId)
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
        // timer() {
        //     return setTimeout(() => {
        //         this.getConfigList()
        //     }, 2000)
        // },
        handleCommand(command) {
            const _this = this
            if (command.type === 'del') {
                this.deleteRow(command.index, _this.dataTable, command.row)
            } else if (command.type === 'view') {
                this.$router.push({ name: 'ConfigDetail', params: { id: command.row }, query: _this.$route.query })
            } else if (command.type === 'update') {
                this.$router.push({ name: 'UpdateConfig', params: { id: command.row }, query: _this.$route.query })
            }
        },
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        },
        timedTask() {
            let timer = setInterval(() => {
                this.getConfigList()
            }, 3000)
            this.$once('hook:beforeDestroy', () => {
                clearInterval(timer)
            })
        }
    },
    created() {
        this.getConfigList()
        this.getPermissions()
    },
    mounted() {
        this.timedTask()
    }
}
</script>

<style scoped></style>
