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

import GlobalConfig from '@/views/globalconfig/GlobalConfig'
import Config from '@/views/globalconfig/config/Config'
import ConfigList from '@/views/globalconfig/config/components/ConfigList'
import AddConfig from '@/views/globalconfig/config/components/AddConfig'
import UpdateConfig from '@/views/globalconfig/config/components/UpdateConfig'
import ConfigDetail from '@/views/globalconfig/config/components/ConfigDetail'

import Counter from '@/views/globalconfig/counter/Counter'
import CounterList from '@/views/globalconfig/counter/components/CounterList'
import AddCounter from '@/views/globalconfig/counter/components/AddCounter'
import UpdateCounter from '@/views/globalconfig/counter/components/UpdateCounter'

import ApiTestCase from '@/views/apitest/testcase/TestCase'
import ApiCaseList from '@/views/apitest/testcase/componets/CaseList'
import AddApiCase from '@/views/apitest/testcase/componets/AddCase'
import ApiCaseDetail from '@/views/apitest/testcase/componets/CaseDetail'
import UpdateApiCase from '@/views/apitest/testcase/componets/UpdateCase'

import ApiTestSet from '@/views/apitest/testset/TestSet'
import ApiTestSetList from '@/views/apitest/testset/components/TestSetList'
import AddApiTestSet from '@/views/apitest/testset/components/AddTestSet'
import ApiTestSetDetail from '@/views/apitest/testset/components/TestSetDetail'
import ApiTestSetUpdate from '@/views/apitest/testset/components/UpdateTestSet'
import TestSetCaseRecord from '@/views/apitest/testset/components/TestSetCaseRecord'

import TestTask from '@/views/apitest/testtask/TestTask'
import TestTaskList from '@/views/apitest/testtask/components/TestTaskList'
import AddTestTask from '@/views/apitest/testtask/components/AddTestTask'
import UpdateTask from '@/views/apitest/testtask/components/UpdateTask'
import TestTaskDetail from '@/views/apitest/testtask/components/TestTaskDetail'
import TaskSetRecordDetail from '@/views/apitest/testtask/components/TaskSetRecordDetail'
import TaskCaseRecordDetail from '@/views/apitest/testtask/components/TaskCaseRecordDetail'

import Report from '@/views/report/Report'
import ReportList from '@/views/report/components/ReportList'

import Permission from '@/views/permissions/Permission'

import Group from '@/views/permissions/group/Group'
import GroupList from '@/views/permissions/group/components/GroupList'
import AddGroup from '@/views/permissions/group/components/AddGroup'
import GroupDetail from '@/views/permissions/group/components/GroupDetail'
import UpdateGroup from '@/views/permissions/group/components/UpdateGroup'

import User from '@/views/permissions/users/Users'
import UserList from '@/views/permissions/users/components/UserList'
import UserDetail from '@/views/permissions/users/components/UserDetail'

import PeriodicTask from '@/views/periodictask/PeriodicTask'

import TimeRule from '@/views/periodictask/timerule/Rule'
import RuleList from '@/views/periodictask/timerule/components/RuleList'
import AddRule from '@/views/periodictask/timerule/components/AddRule'
import UpdateRule from '@/views/periodictask/timerule/components/UpdateRule'

import Crontabs from '@/views/periodictask/crontabs/Crontabs'
import CrontabList from '@/views/periodictask/crontabs/components/CrontabList'
import AddCrontab from '@/views/periodictask/crontabs/components/AddCrontab'
import UpdateCrontab from '@/views/periodictask/crontabs/components/UpdateCrontab'

import UITest from '@/views/uitest/UITest'
import UICase from '@/views/uitest/uicases/UICase'
import UICaseList from '@/views/uitest/uicases/components/UICaseList'
import AddCase from '@/views/uitest/uicases/components/AddCase'
import UICaseDetail from '@/views/uitest/uicases/components/UICaseDetail'
import UpdateCase from '@/views/uitest/uicases/components/UpdateCase'

import UISet from '@/views/uitest/uiset/UISet'
import AddUISet from '@/views/uitest/uiset/components/AddSet'
import UISetDetail from '@/views/uitest/uiset/components/UISetDetail'
import UISetList from '@/views/uitest/uiset/components/UISetList'
import UpdateUISet from '@/views/uitest/uiset/components/UpdateSet'
import UISetRecord from '@/views/uitest/uiset/components/UISetRecord'

import UITask from '@/views/uitest/uitask/UITask'
import AddUITask from '@/views/uitest/uitask/components/AddUITask'
import UITaskList from '@/views/uitest/uitask/components/UITaskList'
import UpdateUITask from '@/views/uitest/uitask/components/UpdateUITask'
import UITaskDetail from '@/views/uitest/uitask/components/UITaskDetail'
import UITaskSetRecord from '@/views/uitest/uitask/components/UITaskSetRecord'
import UITaskCaseRecord from '@/views/uitest/uitask/components/UITaskCaseRecord'

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
            path: '/reset_password/',
            props: route => ({
                query: route.query.code
            }),
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
                    path: 'permission',
                    name: 'Permission',
                    component: Permission,
                    navBar: 'permission',
                    meta: {
                        title: '权限管理',
                        requireAuth: true
                    },
                    children: [
                        {
                            path: 'group',
                            icon: 'el-icon-s-cooperation',
                            component: Group,
                            meta: {
                                title: '权限组',
                                requireAuth: true
                            },
                            children: [
                                {
                                    path: '',
                                    name: 'GroupList',
                                    component: GroupList,
                                    meta: {
                                        title: '权限组',
                                        requireAuth: true
                                    }
                                },
                                {
                                    path: 'addGroup',
                                    name: 'AddGroup',
                                    component: AddGroup,
                                    meta: {
                                        title: '添加权限组',
                                        requireAuth: true
                                    }
                                },
                                {
                                    path: 'detail/:id',
                                    name: 'GroupDetail',
                                    component: GroupDetail,
                                    meta: {
                                        title: '权限组详情',
                                        requireAuth: true
                                    }
                                },
                                {
                                    path: 'update/:id',
                                    name: 'UpdateGroup',
                                    component: UpdateGroup,
                                    meta: {
                                        title: '更新权限组',
                                        requireAuth: true
                                    }
                                }
                            ]
                        },
                        {
                            path: 'users',
                            icon: 'el-icon-user',
                            component: User,
                            meta: {
                                title: '用户',
                                requireAuth: true
                            },
                            children: [
                                {
                                    path: '',
                                    name: 'UserList',
                                    component: UserList,
                                    meta: {
                                        title: '用户列表',
                                        requireAuth: true
                                    }
                                },
                                {
                                    path: 'detail/:id',
                                    name: 'UserDetail',
                                    component: UserDetail,
                                    meta: {
                                        title: '用户详情',
                                        requireAuth: true
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'project',
                    name: 'ProjectDetail',
                    component: ProjectDetail,
                    navBar: 'home',
                    meta: {
                        requireAuth: true
                    },
                    children: [
                        {
                            path: 'config',
                            component: GlobalConfig,
                            icon: 'el-icon-s-tools',
                            meta: {
                                title: '设置',
                                requireAuth: true
                            },
                            children: [
                                {
                                    path: 'config',
                                    component: Config,
                                    meta: {
                                        title: '配置',
                                        requireAuth: true
                                    },
                                    children: [
                                        {
                                            path: '',
                                            name: 'ConfigList',
                                            component: ConfigList,
                                            meta: {
                                                title: '配置列表',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'addconfig',
                                            name: 'AddConfig',
                                            component: AddConfig,
                                            meta: {
                                                title: '添加配置',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'updateconfig/:id',
                                            name: 'UpdateConfig',
                                            component: UpdateConfig,
                                            meta: {
                                                title: '更新配置',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'configdetail/:id',
                                            name: 'ConfigDetail',
                                            component: ConfigDetail,
                                            meta: {
                                                title: '配置详情',
                                                requireAuth: true
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: 'counter',
                                    component: Counter,
                                    meta: {
                                        title: '计数器',
                                        requireAuth: true
                                    },
                                    children: [
                                        {
                                            path: '',
                                            name: 'CounterList',
                                            component: CounterList,
                                            meta: {
                                                title: '计数器列表',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'addCounter',
                                            name: 'AddCounter',
                                            component: AddCounter,
                                            meta: {
                                                title: '添加计数器',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'updateCounter/:id',
                                            name: 'UpdateCounter',
                                            component: UpdateCounter,
                                            meta: {
                                                title: '更新计数器',
                                                requireAuth: true
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'apitest',
                            // name: 'ApiTest',
                            component: ApiTest,
                            icon: 'el-icon-s-operation',
                            meta: {
                                title: '接口测试',
                                requireAuth: true
                            },
                            children: [
                                {
                                    path: 'cases',
                                    component: ApiTestCase,
                                    meta: {
                                        title: '测试用例',
                                        requireAuth: true
                                    },
                                    children: [
                                        {
                                            path: '',
                                            name: 'ApiCaseList',
                                            component: ApiCaseList,
                                            meta: {
                                                title: '测试用例',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'addcase',
                                            name: 'AddApiCase',
                                            component: AddApiCase,
                                            meta: {
                                                title: '添加测试用例',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'detail/:id',
                                            name: 'ApiCaseDetail',
                                            component: ApiCaseDetail,
                                            meta: {
                                                title: '用例详情',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'update/:id',
                                            name: 'UpdateApiCase',
                                            component: UpdateApiCase,
                                            meta: {
                                                title: '更新用例',
                                                requireAuth: true
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: 'testset',
                                    component: ApiTestSet,
                                    meta: {
                                        title: '测试集',
                                        requireAuth: true
                                    },
                                    children: [
                                        {
                                            path: '',
                                            name: 'ApiTestSetList',
                                            component: ApiTestSetList,
                                            meta: {
                                                title: '测试集',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'addset',
                                            name: 'AddApiTestSet',
                                            component: AddApiTestSet,
                                            meta: {
                                                title: '添加测试集',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'detail/:name/:id/',
                                            name: 'ApiTestSetDetail',
                                            component: ApiTestSetDetail,
                                            meta: {
                                                title: '测试集详情',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'update/:name/:id',
                                            name: 'ApiTestSetUpdate',
                                            component: ApiTestSetUpdate,
                                            meta: {
                                                title: '更新测试集',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'history/:name/:id/:batch',
                                            name: 'TestSetCaseRecord',
                                            component: TestSetCaseRecord,
                                            meta: {
                                                title: '历史记录',
                                                requireAuth: true
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: 'task',
                                    component: TestTask,
                                    meta: {
                                        title: '测试任务',
                                        requireAuth: true
                                    },
                                    children: [
                                        {
                                            path: '',
                                            name: 'TestTaskList',
                                            component: TestTaskList,
                                            meta: {
                                                title: '测试任务列表',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'addTestTask',
                                            name: 'AddTestTask',
                                            component: AddTestTask,
                                            meta: {
                                                title: '添加测试任务',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'updateTask/:id',
                                            name: 'UpdateTask',
                                            component: UpdateTask,
                                            meta: {
                                                title: '更新测试任务',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'testTaskDetail/:name/:id',
                                            name: 'TestTaskDetail',
                                            component: TestTaskDetail,
                                            meta: {
                                                title: '测试任务详情',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'record/:name/:id/:batch',
                                            name: 'TaskSetRecordDetail',
                                            component: TaskSetRecordDetail,
                                            meta: {
                                                title: '历史记录',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'record/:name/:set_name/:task_id/:set_id/:batch',
                                            name: 'TaskCaseRecordDetail',
                                            component: TaskCaseRecordDetail,
                                            meta: {
                                                title: '历史记录',
                                                requireAuth: true
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'periodictask',
                            component: PeriodicTask,
                            icon: 'el-icon-message-solid',
                            meta: {
                                title: '定时任务',
                                requireAuth: true
                            },
                            children: [
                                {
                                    path: 'rule',
                                    component: TimeRule,
                                    meta: {
                                        title: '定时规则',
                                        requireAuth: true
                                    },
                                    children: [
                                        {
                                            path: '',
                                            name: 'RuleList',
                                            component: RuleList,
                                            meta: {
                                                title: '规则列表',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'addrule',
                                            name: 'AddRule',
                                            component: AddRule,
                                            meta: {
                                                title: '添加定时规则',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'update/:id',
                                            name: 'UpdateRule',
                                            component: UpdateRule,
                                            meta: {
                                                title: '更新定时规则',
                                                requireAuth: true
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: 'crontab',
                                    component: Crontabs,
                                    meta: {
                                        title: '定时任务',
                                        requireAuth: true
                                    },
                                    children: [
                                        {
                                            path: '',
                                            name: 'CrontabList',
                                            component: CrontabList,
                                            meta: {
                                                title: '定时任务列表',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'addcron',
                                            name: 'AddCrontab',
                                            component: AddCrontab,
                                            meta: {
                                                title: '添加定时任务',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'update/:id',
                                            name: 'UpdateCrontab',
                                            component: UpdateCrontab,
                                            meta: {
                                                title: '更新定时任务',
                                                requireAuth: true
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'uitest',
                            component: UITest,
                            icon: 'el-icon-s-platform',
                            meta: {
                                title: 'UI测试',
                                requireAuth: true
                            },
                            children: [
                                {
                                    path: 'uicase',
                                    component: UICase,
                                    meta: {
                                        title: '测试用例',
                                        requireAuth: true
                                    },
                                    children: [
                                        {
                                            path: '',
                                            name: 'UICaseList',
                                            component: UICaseList,
                                            meta: {
                                                title: '用例列表',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'add',
                                            name: 'AddCase',
                                            component: AddCase,
                                            meta: {
                                                title: '添加用例',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'detail/:id',
                                            name: 'UICaseDetail',
                                            component: UICaseDetail,
                                            meta: {
                                                title: '用例详情',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'update/:id',
                                            name: 'UpdateCase',
                                            component: UpdateCase,
                                            meta: {
                                                title: '更新用例',
                                                requireAuth: true
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: 'uiset',
                                    component: UISet,
                                    meta: {
                                        title: '测试集',
                                        requireAuth: true
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: UISetList,
                                            name: 'UISetList',
                                            meta: {
                                                title: '测试集列表',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'add',
                                            component: AddUISet,
                                            name: 'AddUISet',
                                            meta: {
                                                title: '添加测试集',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'update/:name/:id',
                                            component: UpdateUISet,
                                            name: 'UpdateUISet',
                                            meta: {
                                                title: '更新测试集',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'detail/:name/:id',
                                            component: UISetDetail,
                                            name: 'UISetDetail',
                                            meta: {
                                                title: '测试集详情',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'history/:name/:id/:batch',
                                            component: UISetRecord,
                                            name: 'UISetRecord',
                                            meta: {
                                                title: '历史记录',
                                                requireAuth: true
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: 'uitask',
                                    component: UITask,
                                    meta: {
                                        title: '测试任务',
                                        requireAuth: true
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: UITaskList,
                                            name: 'UITaskList',
                                            meta: {
                                                title: '测试任务列表',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'addUITask',
                                            name: 'AddUITask',
                                            component: AddUITask,
                                            meta: {
                                                title: '添加测试任务',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'updateTask/:id',
                                            name: 'UpdateUITask',
                                            component: UpdateUITask,
                                            meta: {
                                                title: '更新测试任务',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'uiTaskDetail/:name/:id',
                                            name: 'UITaskDetail',
                                            component: UITaskDetail,
                                            meta: {
                                                title: '测试任务详情',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'record/:name/:id/:batch',
                                            name: 'UITaskSetRecord',
                                            component: UITaskSetRecord,
                                            meta: {
                                                title: '历史记录',
                                                requireAuth: true
                                            }
                                        },
                                        {
                                            path: 'record/:name/:set_name/:task_id/:set_id/:batch',
                                            name: 'UITaskCaseRecord',
                                            component: UITaskCaseRecord,
                                            meta: {
                                                title: '历史记录',
                                                requireAuth: true
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'report',
                            component: Report,
                            icon: 'el-icon-s-data',
                            meta: {
                                title: '测试报告',
                                requireAuth: true
                            },
                            children: [
                                {
                                    path: '',
                                    name: 'ReportList',
                                    component: ReportList,
                                    meta: {
                                        title: '测试报告',
                                        requireAuth: true
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    /* eslint-disable */
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})
