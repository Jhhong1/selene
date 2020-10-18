<template>
    <div>
        <el-table class="table-class td" :data="users">
            <el-table-column label="用户名" prop="username" min-width="100"></el-table-column>
            <el-table-column label="邮箱" prop="email" min-width="100"></el-table-column>
            <el-table-column label="操作" min-width="50">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                        <span class="cursor-style">
                            <i class="el-icon-more-outline rotating"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="{ type: 'del', index: scope.$index, row: scope.row.id }" :disabled="scope.row.is_superuser">
                                删除
                            </el-dropdown-item>
                            <el-dropdown-item :command="{ type: 'view', row: scope.row.id }">
                                查看
                            </el-dropdown-item>
                            <el-dropdown-item :command="{ type: 'permission', row: scope.row }" :disabled="scope.row.is_superuser">
                                权限管理
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="权限管理" :visible.sync="dialogFormVisible" class="el-dialog_body el-dialog_footer dialog-header">
            <el-form :model="form" status-icon ref="form">
                <el-form-item label="项目" :label-width="formLabelWidth" prop="projects">
                    <el-select v-model="projects" multiple style="display: block;">
                        <el-option v-for="(p, ind) in projectList" :key="ind" :label="p.name" :value="p.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限组" :label-width="formLabelWidth" prop="group">
                    <el-select v-model="group" clearable style="display: block;">
                        <el-option v-for="(gp, ind) in groups" :key="ind" :label="gp.name" :value="gp.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'UserList',
    data() {
        return {
            users: [],
            user: '',
            projects: [],
            group: '',
            groups: [],
            dialogFormVisible: false,
            form: {},
            formLabelWidth: '100px'
        }
    },
    methods: {
        getUsers() {
            this.$api.api
                .getUserList()
                .then(response => {
                    this.users = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        removeUser(userId) {
            this.$api.api
                .deleteUser(userId)
                .then(() => {
                    this.notify.success('删除用户成功')
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        deleteRow(index, rows, userId) {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定删除该用户吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.removeUser(userId)
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
                this.deleteRow(command.index, _this.users, command.row)
            } else if (command.type === 'permission') {
                this.dialogFormVisible = true
                this.user = command.row.id
                this.projects = command.row.projects
                if (command.row.groups.length > 0) {
                    this.group = command.row.groups[0]
                }
            } else if (command.type === 'view') {
                this.$router.push({ name: 'UserDetail', params: { id: command.row } })
            }
        },
        getGroups() {
            this.$api.api
                .getGroupList()
                .then(response => {
                    this.groups = response.data
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        boundpermission(payload) {
            this.$api.api
                .boundPermission(payload)
                .then(() => {
                    this.$refs['form'].resetFields()
                    this.dialogFormVisible = false
                    this.notify.success('用户授权成功')
                    this.getUsers()
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        cancel() {
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.form.user = this.user
                    if (this.group) {
                        this.form.group = this.group
                    }
                    this.form.projects = this.projects
                    let payload = JSON.stringify(this.form)
                    this.boundpermission(payload)
                } else {
                    return false
                }
            })
        }
    },
    computed: {
        projectList() {
            return this.$store.state.project
        }
    },
    created() {
        this.getUsers()
        this.getGroups()
    }
}
</script>
<style scoped>
.el-dialog_body >>> .el-dialog__body {
    padding: 30px 20px 0 20px !important;
}

.el-dialog_footer >>> .el-dialog__footer {
    padding: 0 20px 20px 20px !important;
    line-height: 50px;
}

.dialog-header >>> .el-dialog__header {
    padding: 20px 20px 0 !important;
    height: 20px;
    text-align: left;
    line-height: 20px;
}
.cursor-style {
    cursor: pointer;
}
</style>
