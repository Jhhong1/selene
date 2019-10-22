<template>
    <div>
        <router-link tag="el-button" :to="{ name: 'AddGroup' }" class="el-button--primary el-button--mini p-button">
            添加权限组
        </router-link>
        <el-table class="table-class td" :data="groups">
            <el-table-column label="名称" prop="name" min-width="50"></el-table-column>
            <el-table-column label="描述" min-width="300">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top-start">
                        <p>{{ scope.row.description }}</p>
                        <div slot="reference" class="name-wrapper">{{ scope.row.description }}</div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="50">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                        <span>
                            <i class="el-icon-more-outline rotating"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="{ type: 'del', index: scope.$index, row: scope.row.id }">删除</el-dropdown-item>
                            <el-dropdown-item :command="{ type: 'view', row: scope.row.id }">查看</el-dropdown-item>
                            <el-dropdown-item :command="{ type: 'update', row: scope.row.id }">更新</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'GroupList',
    data() {
        return {
            groups: []
        }
    },
    methods: {
        getGroups() {
            this.$api.api
                .getGroupList()
                .then(response => {
                    this.groups = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        removeGroup(groupId) {
            this.$api.api
                .deleteGroup(groupId)
                .then(() => {
                    this.notify.success('删除权限组成功')
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        deleteRow(index, rows, groupId) {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定删除该权限组吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.removeGroup(groupId)
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
                this.deleteRow(command.index, _this.dataTable, command.row)
            } else if (command.type === 'view') {
                this.$router.push({ name: 'GroupDetail', params: { id: command.row } })
            } else if (command.type === 'update') {
                this.$router.push({ name: 'UpdateGroup', params: { id: command.row } })
            }
        }
    },
    created() {
        this.getGroups()
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
