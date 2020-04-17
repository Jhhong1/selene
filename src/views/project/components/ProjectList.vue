<template>
    <div class="box">
        <div>
            <el-row style="margin-right: 6px">
                <el-col :span="20" style="text-align: right">
                    <template v-if="permissions.indexOf('apitest.create_apiprojects') > -1">
                        <el-button type="primary" size="small" @click="addProject">创建项目</el-button>
                    </template>
                    <template v-else>
                        <el-tooltip content="无权限" placement="top">
                            <el-button type="primary" size="small" disabled>创建项目</el-button>
                        </el-tooltip>
                    </template>
                </el-col>
                <el-col :span="4">
                    <el-input size="small" placeholder="请输入项目名称" v-model="search">
                        <template slot="append">
                            <i class="el-icon-search el-input_suffix" @click="searchProject"></i>
                        </template>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <template v-if="projects.length > 0">
            <div class="parent-div">
                <div class="child-div" v-for="(project, index) in projects" :key="index">
                    <el-card shadow="hover">
                        <div slot="header">
                            <router-link
                                tag="el-button"
                                :to="{ name: 'GlobalConfigList', query: { project_name: project.name } }"
                                class="el-button--text"
                            >
                                {{ project.name }}
                            </router-link>
                            <div style="float: right;">
                                <el-dropdown @command="handleCommand">
                                    <span>
                                        <i class="el-icon-more-outline rotating"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            :command="{ type: 'delete', id: project.id, ind: index }"
                                            :disabled="permissions.indexOf('apitest.delete_apiprojects') == -1"
                                        >
                                            删除
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </div>
                        <div>
                            <el-row>
                                <el-col :span="8">创建时间</el-col>
                                <el-col :span="16" style="text-align: left">{{ $moment(project.createTime).format('YYYY-MM-DD HH:mm:ss') }}</el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8">描述信息</el-col>
                                <template v-if="project.description">
                                    <el-col :span="16" style="text-align: left">
                                        <el-tooltip placement="top-start">
                                            <div slot="content">{{ project.description }}</div>
                                            <el-button type="text" size="mini" plain class="el-button__text is-plain">
                                                {{ project.description }}
                                            </el-button>
                                        </el-tooltip>
                                    </el-col>
                                </template>
                                <template v-else>
                                    <el-col :span="16" style="text-align: left; padding: 3px 15px">&nbsp;</el-col>
                                </template>
                            </el-row>
                        </div>
                    </el-card>
                </div>
            </div>
        </template>
        <template v-else>
            <el-row :gutter="20" style="background-color: white;height: 200px;text-align: center;margin-top: 10px;">
                <el-col :span="24">
                    <div style="height: 200px;line-height: 200px;">暂无数据</div>
                </el-col>
            </el-row>
        </template>
    </div>
</template>

<script>
export default {
    name: 'ProjectList',
    data() {
        return {
            search: '',
            name: '',
            projects: [],
            permissions: [],
            t: null
        }
    },
    methods: {
        addProject() {
            this.$router.push({ name: 'AddProject' })
        },
        getProjectList() {
            this.$api.api
                .apiProjectList(this.name)
                .then(response => {
                    this.projects = response.data.results
                    this.$store.commit('STORE_PROJECT', this.projects)
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        },
        deleteProject(id) {
            this.$api.api
                .deleteApiProject(id)
                .then(() => {
                    this.notify.success('删除项目成功')
                })
                .catch(error => {
                    this.notify.error(error.response)
                })
        },
        handleCommand(command) {
            if (command.type === 'delete') {
                const h = this.$createElement
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [h('span', null, '确定删除该项目吗？')]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            this.deleteProject(command.id)
                            done()
                        } else {
                            done()
                        }
                    }
                })
                    .then(() => {
                        this.projects.splice(command.ind, 1)
                    })
                    .catch(() => {})
            }
        },
        searchProject() {
            this.name = this.search
            this.getProjectList()
        }
    },
    watch: {
        projects() {
            this.notify.debounce(this.t, this.getProjectList)
        }
    },
    created() {
        this.getProjectList()
        this.getPermissions()
    },
    mounted() {},
    destroyed() {
        clearTimeout(this.t)
    }
}
</script>
<style scoped>
.box {
    position: absolute;
    top: 80px;
    left: 10px;
    right: 10px;
}
.parent-div {
    display: flex;
    flex-wrap: wrap;
}
.child-div {
    background-color: #e8f3f7;
    width: calc((100% - 48px) / 4);
    margin: 6px;
}
.el-input_suffix:hover {
    cursor: pointer;
}
.is-plain:focus,
.is-plain:hover {
    color: #606266;
    border-color: white;
}
</style>
