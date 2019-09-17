import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login/Login'
import Register from '@/views/register/Register'
import ForgetPassword from '@/views/forgetpassword/ForgetPassword'
import ResetPassword from '@/views/resetpassword/ResetPassword'

import Home from './views/Home.vue'
import ProjectList from '@/views/project/components/ProjectList'
import AddProject from '@/views/project/components/AddProject'
import ProjectDetail from '@/views/project/components/ProjectDetail'

import ApiTest from '@/views/apitest/ApiTest'

import GlobalConfig from '@/views/apitest/globalconfig/GlobalConfig'

import ApiTestCase from '@/views/apitest/testcase/TestCase'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login,
            meta: {
                title: '登录'
            }
        },
        {
            path: '/register/',
            name: 'Register',
            component: Register,
            meta: {
                title: '注册'
            }
        },
        {
            path: '/forgotPassword/',
            name: 'ForgetPassword',
            component: ForgetPassword,
            meta: {
                title: '忘记密码'
            }
        },
        {
            path: '/resetPassword/',
            props: route => ({ query: route.query.reset_code }),
            name: 'ResetPassword',
            component: ResetPassword,
            meta: {
                title: '重置密码'
            }
        },
        {
            path: '/home/',
            component: Home,
            meta: {
                title: '自动化测试平台',
                requireAuth: true
            },
            children: [
                {
                    path: '',
                    name: 'ProjectList',
                    component: ProjectList,
                    meta: {
                        title: '项目',
                        requireAuth: true
                    }
                },
                {
                    path: 'addproject',
                    name: 'AddProject',
                    component: AddProject,
                    meta: {
                        title: '创建项目',
                        requireAuth: true
                    }
                },
                {
                    path: 'project',
                    name: 'ProjectDetail',
                    component: ProjectDetail,
                    navBar: true,
                    meta: {
                        requireAuth: true
                    },
                    children: [
                        {
                            path: 'apitest',
                            // name: 'ApiTest',
                            component: ApiTest,
                            icon: 'el-icon-menu',
                            meta: {
                                title: '接口测试',
                                requireAuth: true
                            },
                            children: [
                                {
                                    path: 'config',
                                    name: 'GlobalConfig',
                                    component: GlobalConfig,
                                    meta: {
                                        title: '配置',
                                        requireAuth: true
                                    }
                                },
                                {
                                    path: 'cases',
                                    name: 'ApiTestCase',
                                    component: ApiTestCase,
                                    meta: {
                                        title: '测试用例',
                                        requireAuth: true
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
})
