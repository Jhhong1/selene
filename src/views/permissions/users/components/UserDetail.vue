<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'UserList' }" class="is-link">用户</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box-card">
            <el-collapse v-model="activeNames">
                <el-collapse-item name="1" class="clearfix icon-hidden">
                    <template slot="title">
                        <div style="display: inline-block">基本信息</div>
                        <!--阻止事件冒泡-->
                        <div class="button-position" @click.stop.prevent>
                            <el-dropdown size="mini" split-button type="primary" @command="handleCommand">
                                操作
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="permission">权限管理</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </template>
                    <el-card>
                        <div>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">名称:</el-col>
                                <el-col :span="22" class="test-right">{{ detail.username }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">邮箱:</el-col>
                                <el-col :span="22" class="test-right">{{ detail.email }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">状态:</el-col>
                                <el-col :span="22" class="test-right">
                                    <template v-if="detail.is_active">
                                        已激活
                                    </template>
                                    <template v-else>
                                        未激活
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">类型:</el-col>
                                <el-col :span="22" class="test-right">
                                    <template v-if="detail.is_superuser">
                                        管理员
                                    </template>
                                    <template v-else>
                                        普通用户
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">权限组:</el-col>
                                <el-col :span="22" class="test-right">
                                    <template v-for="(group, index) in detail.groups">
                                        <router-link
                                            tag="el-link"
                                            :to="{ name: 'GroupDetail', params: { id: group.id } }"
                                            :key="index"
                                            class="el-link--primary"
                                            :underline="false"
                                        >
                                            {{ group.name }}
                                        </router-link>
                                    </template>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
        <el-dialog title="权限管理" :visible.sync="dialogFormVisible" @closed="closed" class="el-dialog_body el-dialog_footer dialog-header">
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
    name: 'UserDetail',
    data() {
        return {
            id: this.$route.params.id,
            detail: {},
            groups: [],
            activeNames: ['1'],
            dialogFormVisible: false,
            form: {},
            formLabelWidth: '100px',
            projectList: [],
            projects: [],
            projectsBackUp: [],
            group: '',
            groupBackUp: ''
        }
    },
    methods: {
        userDetail() {
            this.$api.api
                .getUserDetail(this.id)
                .then(response => {
                    this.detail = response.data
                    this.projects = response.data.projects
                    this.projectsBackUp = response.data.projects
                    if (response.data.groups.length > 0) {
                        this.group = response.data.groups[0].id
                        this.groupBackUp = response.data.groups[0].id
                    }
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
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
        getProject() {
            this.$api.api
                .ProjectList()
                .then(response => {
                    this.projectList = response.data.results
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        handleCommand(command) {
            if (command === 'permission') {
                this.dialogFormVisible = true
                this.getProject()
                this.getGroups()
                // this.user = command.row.id
            }
        },
        closed() {
            this.$refs['form'].resetFields()
            this.projects = this.projectsBackUp
            this.group = this.groupBackUp
        },
        cancel() {
            this.dialogFormVisible = false
        },
        boundpermission(payload) {
            this.$api.api
                .boundPermission(payload)
                .then(() => {
                    this.$refs['form'].resetFields()
                    this.dialogFormVisible = false
                    this.notify.success('用户授权成功')
                    this.userDetail()
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.form.user = this.id
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
    mounted() {
        this.userDetail()
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
.icon-hidden >>> .el-icon-arrow-right:before {
    display: none !important;
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
.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
}
.clearfix:after {
    clear: both;
}
.test-left {
    border: 1px solid white;
    text-align: right;
}
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
</style>
