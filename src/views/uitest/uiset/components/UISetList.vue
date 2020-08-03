<template>
    <div>
        <template v-if="permissions.indexOf('apitest.create_apiset') > -1">
            <router-link tag="el-button" :to="{ name: 'AddUISet', query: $route.query }" class="el-button--primary el-button--mini p-button">
                添加测试集
            </router-link>
        </template>
        <template v-else>
            <el-button class="el-button--primary el-button--mini p-button" disabled>添加测试集</el-button>
        </template>
        <el-table class="table-class td" :data="setList">
            <el-table-column label="名称" min-width="200">
                <template slot-scope="scope">
                    <ul class="ul-style">
                        <li>
                            <router-link
                                :to="{ name: 'UISetDetail', params: { name: scope.row.name, id: scope.row.id }, query: $route.query }"
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
            <el-table-column label="描述信息" min-width="200">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top-start">
                        <p>{{ scope.row.description }}</p>
                        <div slot="reference" class="name-wrapper">{{ scope.row.description }}</div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="150">
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
            <el-table-column label="结果" min-width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.hasOwnProperty('executionrecord_set') && scope.row.executionrecord_set.length > 0">
                        <template v-if="scope.row.executionrecord_set[0].result === 'Failed'">
                            <tag-failed></tag-failed>
                            <!-- <el-popover trigger="hover" placement="top-start">
                                <p>{{ scope.row.testsetrelationship.errorMessage }}</p>
                                <div slot="reference"></div>
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
            <el-table-column label="操作" min-width="50">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                        <span>
                            <i class="el-icon-more-outline rotating"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="{ type: 'view', name: scope.row.name, id: scope.row.id }">查看</el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'update', name: scope.row.name, id: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.update_apiset') === -1"
                            >
                                更新
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'exec', id: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.execute_apiset') === -1"
                            >
                                执行
                            </el-dropdown-item>
                            <el-dropdown-item
                                :command="{ type: 'del', index: scope.$index, id: scope.row.id }"
                                :disabled="permissions.indexOf('apitest.delete_apiset') === -1"
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
    name: 'UISetList',
    data() {
        return {
            count: null,
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1,
            setList: [],
            projectName: this.$route.query.project_name,
            permissions: []
        }
    },
    methods: {
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        },
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
                .apiTestSetList(this.currentPage, this.pageSize, this.projectName, 'ui')
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
                tasks: testSetId,
                category: 'ui'
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
                this.deleteRow(command.index, this.setList, command.id)
            } else if (command.type === 'view') {
                this.$router.push({ name: 'UISetDetail', params: { name: command.name, id: command.id }, query: this.$route.query })
            } else if (command.type === 'update') {
                this.$router.push({ name: 'UpdateUISet', params: { name: command.name, id: command.id }, query: this.$route.query })
            } else if (command.type === 'exec') {
                this.execute(command.id)
            }
        },
        timedTask() {
            let timer = setInterval(() => {
                this.getSets()
            }, 3000)
            this.$once('hook:beforeDestroy', () => {
                clearInterval(timer)
            })
        }
    },
    created() {
        this.getPermissions()
        this.getSets()
    },
    mounted() {
        this.timedTask()
    }
}
</script>

<style scoped></style>
