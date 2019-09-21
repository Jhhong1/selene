<template>
    <div>
        <router-link tag="el-button" class="el-button--primary el-button--mini p-button" :to="{ name: 'AddApiTestSet', query: $route.query }">
            添加测试集
        </router-link>
        <el-table class="table-class td" :data="setList">
            <el-table-column label="名称" min-width="100">
                <template slot-scope="scope">
                    <router-link
                        tag="el-button"
                        :to="{ name: 'ApiTestSetDetail', params: { id: scope.row.id }, query: $route.query }"
                        class="el-button--text"
                    >
                        {{ scope.row.name }}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="描述信息" min-width="150">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top-start">
                        <p>{{ scope.row.description }}</p>
                        <div slot="reference" class="name-wrapper">{{ scope.row.description }}</div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.testsetrelationship">
                        <template v-if="scope.row.testsetrelationship.status === 'Done'">
                            <tag-done></tag-done>
                        </template>
                        <template v-else-if="scope.row.testsetrelationship.status === 'Starting'">
                            <tag-running></tag-running>
                        </template>
                    </template>
                    <template v-else>
                        <tag-not-run></tag-not-run>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结果" min-width="50">
                <template slot-scope="scope">
                    <template v-if="scope.row.testsetrelationship">
                        <template v-if="scope.row.testsetrelationship.result === 'Failed'">
                            <el-popover trigger="hover" placement="top-start">
                                <p>{{ scope.row.testsetrelationship.errorMessage }}</p>
                                <div slot="reference">
                                    <tag-failed></tag-failed>
                                </div>
                            </el-popover>
                        </template>
                        <template v-else-if="scope.row.testsetrelationship.result === 'Succeed'">
                            <tag-success></tag-success>
                        </template>
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                        <span>
                            <i class="el-icon-more-outline rotating"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="{ type: 'del', index: scope.$index, row: scope.row.id }">删除</el-dropdown-item>
                            <el-dropdown-item :command="{ type: 'view', row: scope.row.id }">查看</el-dropdown-item>
                            <el-dropdown-item :command="{ type: 'update', row: scope.row.id }">更新</el-dropdown-item>
                            <el-dropdown-item :command="{ type: 'exec', row: scope.row.id }">执行</el-dropdown-item>
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
    name: 'TestSetList',
    data() {
        return {
            count: null,
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1,
            setList: [],
            projectName: this.$route.query.project_name
        }
    },
    methods: {
        currentChange(val) {
            this.currentPage = val
            this.getSets()
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getSets()
        },
        getSets() {
            this.$api.api
                .apiTestSetList(this.currentPage, this.pageSize, this.projectName)
                .then(response => {
                    this.setList = response.data.results
                    this.count = response.data.count
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        deleteSet(setId) {
            this.$api.api
                .deleteApiTestSet(setId)
                .then(() => {
                    this.notify.success('删除测试集成功')
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        deleteRow(index, rows, setId) {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定删除该测试集吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.deleteSet(setId)
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
        execute(setId) {
            let _this = this
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定执行该测试集吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        _this.executeSet(setId, _this.projectName)
                        done()
                    } else {
                        done()
                    }
                }
            })
                .then(() => {})
                .catch(() => {})
        },
        executeSet(testSetId, project) {
            let payload = {
                level: 'testSet',
                tasks: testSetId
            }
            this.$api.api
                .executeCase(JSON.stringify(payload), project)
                .then(() => {})
                .catch(error => {
                    this.notify.error(error)
                })
        },
        handleCommand(command) {
            if (command.type === 'del') {
                this.deleteRow(command.index, this.setList, command.row)
            } else if (command.type === 'view') {
                this.$router.push({ name: 'ApiTestSetDetail', params: { id: command.row }, query: this.$route.query })
            } else if (command.type === 'update') {
                this.$router.push({ name: 'ApiTestSetUpdate', params: { id: command.row }, query: this.$route.query })
            } else if (command.type === 'exec') {
                this.execute(command.row)
            }
        },
        timer() {
            return setTimeout(() => {
                this.getSets()
            }, 2000)
        }
    },
    created() {
        this.getSets()
    },
    watch: {
        setList() {
            this.timer()
        }
    },
    mounted() {},
    destroyed() {
        clearTimeout(this.timer())
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
