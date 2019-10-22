<template>
    <div class="bg-color">
        <el-row>
            <el-col :span="14">
                <div class="bg-purple-light">关联项目</div>
            </el-col>
            <el-col :span="10">
                <div class="bg-purple-light">权限</div>
            </el-col>
        </el-row>
        <template v-if="Object.keys(project).length > 0">
            <el-row>
                <el-col :span="14">
                    <div class="project-class">
                        <template v-if="project.projects === 'all'">
                            <span>全部</span>
                        </template>
                        <template v-else>
                            <span v-for="p in project.projects" :key="p">{{ p }} </span>
                        </template>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="project-class">
                        <template v-if="project.permissions.length > 0">
                            <span v-for="permission in project.permissions" :key="permission">
                                <template v-if="permission === 'add_apiprojects'">
                                    添加
                                </template>
                                <template v-else-if="permission === 'change_apiprojects'">
                                    更新
                                </template>
                                <template v-else-if="permission === 'delete_apiprojects'">
                                    删除
                                </template>
                                <template v-else>
                                    查看
                                </template>
                            </span>
                        </template>
                        <template v-else>
                            <span>-</span>
                        </template>
                    </div>
                </el-col>
            </el-row>
        </template>
        <template v-else>
            <el-row class="no-data-show">
                <el-col>无数据</el-col>
            </el-row>
        </template>
        <template v-if="show">
            <el-row>
                <el-col :span="24" class="col-class">
                    <el-button type="text" class="add-class el-col-24" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
                </el-col>
            </el-row>
        </template>
        <el-dialog title="项目" :visible.sync="dialogTableVisible" :close-on-click-modal="false" :before-close="handleClose" class="text-class">
            <el-form :model="temp" ref="project">
                <el-form-item
                    label="关联项目"
                    :label-width="formLabelWidth"
                    prop="projects"
                    class="el-form__item"
                    :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                >
                    <el-select v-model="temp.projects" :multiple="multi" filterable class="method-class" @change="multipleOrNot">
                        <el-option label="全部" value="all"></el-option>
                        <el-option v-for="p in projectList" :key="p.id" :label="p.name" :value="p.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="权限"
                    :label-width="formLabelWidth"
                    prop="permissions"
                    class="el-form__item"
                    :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                >
                    <el-select v-model="temp.permissions" multiple class="method-class">
                        <el-option label="添加" value="add_apiprojects"></el-option>
                        <el-option label="更新" value="change_apiprojects"></el-option>
                        <el-option label="删除" value="delete_apiprojects"></el-option>
                        <el-option label="查看" value="view_apiprojects"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item size="mini" class="el-form-item-content">
                    <el-button type="info" plain size="mini" @click="handleClose">取消</el-button>
                    <el-button type="primary" plain size="mini" @click="confirm">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'ProjectPermissions',
    props: {
        value: Object,
        showBtn: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            show: this.showBtn,
            project: this.value,
            dialogTableVisible: false,
            formLabelWidth: '100px',
            projectList: this.projectlist(),
            multi: true,
            temp: {}
        }
    },
    methods: {
        add() {
            this.dialogTableVisible = true
        },
        projectlist() {
            return JSON.parse(localStorage.getItem('project'))
        },
        multipleOrNot(val) {
            if (val.indexOf('all') > -1) {
                this.multi = false
                this.temp.projects = 'all'
            } else {
                this.multi = true
                if (Array.isArray(val) && val.length > 0) {
                    this.temp.projects = val
                } else if (Array.isArray(val) && val.length == 0) {
                    this.temp.projects = null
                } else {
                    this.temp.projects = []
                    this.temp.projects.push(val)
                }
            }
        },
        handleClose() {
            this.$refs['project'].resetFields()
            this.temp.projects = null
            this.dialogTableVisible = false
        },
        confirm() {
            this.$refs['project'].validate(valid => {
                if (valid) {
                    this.project = Object.assign(this.project, this.temp)
                    this.dialogTableVisible = false
                    this.$refs['project'].resetFields()
                    this.temp.projects = null
                } else {
                    return false
                }
            })
        }
    },
    watch: {
        value: function(newValue) {
            this.project = newValue
        }
    }
}
</script>
<style scoped>
.el-form__item {
    margin-bottom: 30px;
}
.icon-size {
    padding: 0;
    margin-left: -3%;
}
.el-form-item-content >>> .el-form-item__content {
    text-align: right;
}
</style>
