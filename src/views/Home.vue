<template>
    <div class="home">
        <el-container>
            <template v-if="$route.path.indexOf('apitest') > 0 || $route.path.indexOf('periodictask') > 0 || $route.path.indexOf('uitest') > 0">
                <el-aside style="width: 200px;" class="left-aside">
                    <el-menu :default-active="activeNav" router class="sidebar">
                        <el-submenu v-for="(menu, mindex) in navigate" :index="menu.path" :key="mindex">
                            <template slot="title">
                                <i :class="menu.icon"></i>
                                {{ menu.meta.title }}
                            </template>
                            <el-menu-item
                                v-for="(item, ind) in menu.children"
                                :key="ind"
                                :index="$route.matched[1].path + '/' + menu.path + '/' + item.path + '?project_name=' + value"
                                @click="highLightNav"
                            >
                                <!-- {{ $route.matched[1].path + '/' + menu.path + '/' + item.path + '?project_name=' + value }} -->
                                {{ item.meta.title }}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
            </template>
            <template v-else-if="$route.path.indexOf('permission') > 0">
                <el-aside style="width: 200px;" class="left-aside">
                    <el-menu :default-active="activeNav" router class="sidebar">
                        <el-menu-item v-for="(menu, mindex) in navigate" :index="$route.matched[1].path + '/' + menu.path" :key="mindex">
                            <template slot="title">
                                <i :class="menu.icon"></i>
                                {{ menu.meta.title }}
                            </template>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
            </template>
            <el-container>
                <el-header>
                    <div class="image-container">
                        <el-image :src="url" fit="fill" style="height: 60px; width: 160px"></el-image>
                    </div>
                    <template v-if="$route.path.indexOf('project') > 0 && $route.path.indexOf('addproject') < 0">
                        <el-select v-model="value" filterable size="mini" style="float: left;margin-left: 20px;width: 120px" @change="handleChange">
                            <el-option v-for="item in projectList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </template>
                    <el-dropdown>
                        <i class="el-icon-setting"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <el-button type="text" @click="dialogFormVisible = true">更改密码</el-button>
                            </el-dropdown-item>
                            <template v-if="userInfo.is_superuser">
                                <el-dropdown-item>
                                    <router-link tag="el-button" :to="{ name: 'GroupList' }" class="el-button--text">权限管理</router-link>
                                </el-dropdown-item>
                            </template>
                            <template v-if="$route.fullPath !== '/home/'">
                                <el-dropdown-item>
                                    <router-link tag="el-button" :to="{ name: 'ProjectList' }" class="el-button--text">项目</router-link>
                                </el-dropdown-item>
                            </template>
                            <el-dropdown-item>
                                <Logout></Logout>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span style="margin-left: 5px">{{ username }}</span>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
            <el-dialog
                :visible.sync="dialogFormVisible"
                :before-close="handleClose"
                :close-on-click-modal="false"
                title="更改密码"
                class="el-dialog_body el-dialog_footer dialog-header"
            >
                <el-form :model="form" status-icon :rules="rules" ref="form">
                    <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
                        <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" :label-width="formLabelWidth" prop="repassword">
                        <el-input type="password" v-model="form.repassword" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>
<script>
import Logout from '@/views/logout/Logout'
import bird from '@/static/images/bird.jpeg'
export default {
    name: 'Home',
    components: { Logout },
    component: {
        Logout
    },
    inject: ['reload'],
    data() {
        const validatePass = (rule, value, callback) => {
            const passregex = /^[a-z]+[a-z0-9_-]{7,15}$/
            if (!value) {
                callback(new Error('请输入密码'))
            } else {
                if (value.length < 8 || value.length > 16) {
                    callback(new Error('密码的长度不得少于8位，大于16位'))
                } else if (!passregex.test(value)) {
                    callback(new Error('密码必须已小写字母开头，包含小写字母、数字、下划线、中横线'))
                } else {
                    if (this.form.repassword !== '') {
                        this.$refs.form.validateField('repassword')
                    }
                    callback()
                }
            }
        }
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            activeNav: this.active(),
            dialogFormVisible: false,
            value: this.$route.query.project_name,
            url: bird,
            projectList: [],
            form: {
                password: '',
                repassword: ''
            },
            formLabelWidth: '120px',
            rules: {
                password: [{ validator: validatePass, trigger: 'blur' }],
                repassword: [{ validator: validatePass2, trigger: 'blur' }]
            }
        }
    },
    methods: {
        active() {
            if (this.$route.path.indexOf('apitest') > 0) {
                return '/home/project/apitest/config/?project_name=' + this.value
            } else {
                return '/home/permission/group'
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.changePass()
                } else {
                    return false
                }
            })
        },
        changePass() {
            this.$api.api
                .changePassword(this.$store.state.username, { password: this.form.password })
                .then(() => {
                    this.notify.success('更改密码成功')
                    this.dialogFormVisible = false
                    this.$refs['form'].resetFields()
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        handleClose(done) {
            // console.log(this.$refs['form'])
            this.$refs['form'].resetFields()
            done()
        },
        cancel() {
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
        },
        projects() {
            this.projectList = JSON.parse(localStorage.getItem('project'))
        },
        handleChange() {
            let path = this.$route.path + '?project_name=' + this.value
            this.$router.push(path)
            this.reload()
        },
        highLightNav() {
            if (
                this.$route.matched.length > 3 &&
                (this.$route.path.indexOf('apitest') > 0 || this.$route.path.indexOf('periodictask') > 0 || this.$route.path.indexOf('uitest') > 0)
            ) {
                this.activeNav = this.$route.matched[3].path + '?project_name=' + this.value
            } else if (this.$route.matched.length > 2 && this.$route.path.indexOf('permission') > 0) {
                this.activeNav = this.$route.matched[2].path
            }
        }
    },
    computed: {
        navigate() {
            let navList = []
            let navs1 = null
            let routeList = this.$router.options.routes
            if (this.$route.path.indexOf('project') > 0) {
                for (let i = 0, len = routeList.length; i < len; i++) {
                    if (routeList[i].hasOwnProperty('children')) {
                        navs1 = routeList[i].children
                    }
                }
                for (let j = 0, len = navs1.length; j < len; j++) {
                    if (navs1[j].hasOwnProperty('navBar') && navs1[j].navBar === 'home' && navs1[j].hasOwnProperty('children')) {
                        navList = navs1[j].children
                    }
                }
            } else {
                for (let i = 0, len = routeList.length; i < len; i++) {
                    if (routeList[i].hasOwnProperty('children')) {
                        navs1 = routeList[i].children
                    }
                }
                for (let j = 0, len = navs1.length; j < len; j++) {
                    if (navs1[j].hasOwnProperty('navBar') && navs1[j].navBar === 'permission' && navs1[j].hasOwnProperty('children')) {
                        navList = navs1[j].children
                    }
                }
            }
            return navList
        },
        username() {
            let name1 = localStorage.getItem('username')
            let name2 = this.$store.state.username
            if (name1 !== name2) {
                this.$store.commit('STORE_USER_NAME', { username: name1 })
            }
            return name1
        },
        userInfo() {
            return JSON.parse(localStorage.getItem('userinfo'))
        }
    },
    mounted() {
        this.highLightNav()
        this.projects()
    },
    updated() {
        this.highLightNav()
    },
    watch: {
        $route() {
            this.value = this.$route.query.project_name
        }
    },
    beforeRouteUpdate(to, from, next) {
        if (to.query.project_name) {
            this.projects()
            next()
        } else {
            next()
        }
    }
}
</script>
<style scoped>
.el-container {
    position: absolute;
    min-height: 800px;
    min-width: 1200px;
    overflow: auto;
    border: 1px solid #eee;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: #f2f6fc;
}

.el-header {
    background-color: #51ace6;
    color: #ffffff;
    text-align: right;
    line-height: 60px;
    z-index: 1001;
}

.el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    padding: 0;
}

.el-menu {
    margin-top: 60px;
    background-color: #d3dce6;
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

.image-container {
    float: left;
    height: 60px;
    width: 160px;
}
.left-aside {
    overflow: hidden;
    /* min-height: 800px; */
    /* height: 100%; */
    position: relative;
}
.sidebar {
    width: 200px;
    min-height: 800px;
    height: 100%;
    z-index: 1000;
    padding-bottom: 10px;
    margin-bottom: -10px;
    overflow-x: hidden;
    overflow-y: scroll;
    position: absolute;
}
</style>
