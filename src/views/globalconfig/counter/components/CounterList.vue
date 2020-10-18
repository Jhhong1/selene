<template>
    <div>
        <router-link
            tag="el-button"
            :to="{ name: 'AddCounter', query: $route.query }"
            class="el-button--primary el-button--mini p-button"
            :class="{ 'is-disabled': permissions.indexOf('services.create_counter') === -1 }"
            :disabled="permissions.indexOf('services.create_counter') === -1"
        >
            添加计数器
        </router-link>

        <el-table class="table-class td" :data="counters">
            <el-table-column label="名称" min-width="100">
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
            <el-table-column label="初始值" min-width="50" prop="initial"></el-table-column>
            <el-table-column label="增量" min-width="50" prop="step"></el-table-column>
            <el-table-column label="最大值" min-width="50" prop="final"></el-table-column>
            <el-table-column label="操作" min-width="50">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                        <span>
                            <i class="el-icon-more-outline rotating"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                :command="{ type: 'update', row: scope.row.id }"
                                :disabled="permissions.indexOf('services.update_counter') === -1"
                            >
                                更新
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'del', index: scope.$index, row: scope.row.id }"
                                :disabled="permissions.indexOf('services.delete_counter') === -1"
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
    name: 'CounterList',
    data() {
        return {
            counters: [],
            projectName: this.$route.query.project_name,
            count: null,
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1,
            loading: true
        }
    },
    methods: {
        getCounter() {
            this.$api.api
                .getCounters(this.currentPage, this.pageSize, this.projectName)
                .then(response => {
                    this.counters = response.data.results
                    this.count = response.data.count
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        currentChange(val) {
            this.currentPage = val
            this.getCounter()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getCounter()
        },
        deleteCounter(counterId) {
            this.$api.api
                .deleteCounter(counterId, this.projectName)
                .then(() => {
                    this.notify.success('删除计数器成功')
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        deleteRow(index, rows, counterId) {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定删除该条计数器吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.deleteCounter(counterId)
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
            const _this = this
            if (command.type === 'del') {
                this.deleteRow(command.index, _this.counters, command.row)
            } else if (command.type === 'update') {
                this.$router.push({ name: 'UpdateCounter', params: { id: command.row }, query: _this.$route.query })
            }
        }
    },
    computed: {
        permissions() {
            return this.$store.state.userinfo.permissions
        }
    },
    created() {
        this.getCounter()
    }
}
</script>

<style scoped></style>
