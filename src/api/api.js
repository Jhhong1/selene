import axios from 'axios'

axios.defaults.headers['Content-type'] = 'application/json'

if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.cronus
} else {
    axios.defaults.baseURL = 'http://127.0.0.1:8081'
}

// 登录
export const login = params => {
    return axios.post('/v1/login/', params)
}

// 注册
export const register = params => {
    return axios.post('/v1/register/', params)
}

// 发送重置密码的邮件
export const sendEmail = params => {
    return axios.post('/v1/email/', params)
}

// 重置密码
export const resetPassword = (resetcode, params) => {
    return axios.post('/v1/resetpassword/', params, {
        params: {
            resetcode: resetcode
        }
    })
}

// 更改密码
export const changePassword = (username, params) => {
    return axios.put(`/v1/change/${username}/`, params)
}

// 添加测试用例
export const createTestCase = params => {
    return axios.post('/v1/apitest/apiCases/', params)
}

// 测试用例列表
export const testCaseList = (page = 1, pagesize = 10, projectName = '') => {
    return axios.get('/v1/apitest/apiCases/', {
        params: {
            page: page,
            page_size: pagesize,
            project: projectName
        }
    })
}

// 删除测试用例
export const deleteCase = caseId => {
    return axios.delete(`/v1/apitest/apiCases/${caseId}/`)
}

// 查看用例详情
export const getCaseDetail = caseId => {
    return axios.get(`/v1/apitest/apiCases/${caseId}/`)
}

// 更新用例
export const updateCase = (caseId, params) => {
    return axios.put(`/v1/apitest/apiCases/${caseId}/`, params)
}

// 执行测试用例
export const executeCase = (data, projectName = '') => {
    return axios.post('/v1/apitest/execute/', data, {
        params: {
            project: projectName
        }
    })
}

// 添加测试项目
export const createApiProject = params => {
    return axios.post('/v1/apitest/apiProjects/', params)
}

// 测试项目列表
export const apiProjectList = () => {
    return axios.get('/v1/apitest/apiProjects/')
}

// 删除测试项目
export const deleteApiProject = projectId => {
    return axios.delete(`/v1/apitest/apiProjects/${projectId}/`)
}

// 测试项目详情
export const apiProjectDetail = projectId => {
    return axios.get(`/v1/apitest/apiProjects/${projectId}/`)
}

// 测试集列表
export const apiTestSetList = (page = 1, pagesize = 10, projectName = '') => {
    return axios.get('/v1/apitest/apiSet/', {
        params: {
            page: page,
            page_size: pagesize,
            project: projectName
        }
    })
}

// 添加测试集
export const createApiTestSet = (data, projectName = '') => {
    return axios.post('/v1/apitest/apiSet/', data, {
        params: {
            project: projectName
        }
    })
}
// 删除测试集
export const deleteApiTestSet = id => {
    return axios.delete(`/v1/apitest/apiSet/${id}/`)
}
// 测试集详情
export const ApiTestSetDetail = (id, project) => {
    return axios.get(`/v1/apitest/apiSet/${id}/`, {
        params: {
            project: project
        }
    })
}
// 更新测试集
export const updateTestSet = (id, data, projectName = '') => {
    return axios.put(`/v1/apitest/apiSet/${id}/`, data, {
        params: {
            project: projectName
        }
    })
}
// 关联测试用例到测试集
export const caseToTestset = data => {
    return axios.post('/v1/apitest/caseToTestSet/', data)
}
// 调准测试用例的顺序
export const changeCasesOrder = (data, projectName = '') => {
    return axios.post('/v1/apitest/change_cases_order/', data, {
        params: {
            project: projectName
        }
    })
}
// 移除测试集中的用例
export const removeCaseFromSet = (data, projectName = '') => {
    return axios.post('/v1/apitest/remove_testset_case/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取与测试集关联的测试用例列表
export const TestSetCases = (testSetId, projectName = '', handler = '') => {
    return axios.get(`/v1/apitest/testset_case/${testSetId}/`, {
        params: {
            project: projectName,
            handler: handler
        }
    })
}
// 复制测试集中的测试用例
export const copyTestSetCase = (data, projectName = '') => {
    return axios.post('/v1/apitest/copy_testset_case/', data, {
        params: {
            project: projectName
        }
    })
}
// 添加测试任务
export const addTestTask = (data, projectName = '') => {
    return axios.post('/v1/apitest/apiTask/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取测试任务列表
export const getTaskList = (page = 1, pageSize = 10, projectName = '') => {
    return axios.get('/v1/apitest/apiTask/', {
        params: {
            page: page,
            page_size: pageSize,
            project: projectName
        }
    })
}
// 获取测试任务详情
export const getTaskDetail = (taskId, projectName = '') => {
    return axios.get(`/v1/apitest/apiTask/${taskId}/`, {
        params: {
            project: projectName
        }
    })
}
// 更新测试任务
export const updateTask = (taskId, data, projectName = '') => {
    return axios.put(`/v1/apitest/apiTask/${taskId}/`, data, {
        params: {
            project: projectName
        }
    })
}

// 删除测试任务
export const deleteTestTask = taskId => {
    return axios.delete(`/v1/apitest/apiTask/${taskId}/`)
}
// 关联测试集到测试任务
export const testSetToTask = (data, projectName = '') => {
    return axios.post('/v1/apitest/testSetToTask/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取与测试任务关联的测试集列表
export const taskTestSet = (taskId, projectName = '') => {
    return axios.get(`/v1/apitest/task_testSet/${taskId}/`, {
        params: {
            project: projectName
        }
    })
}
// 从测试任务中移除测试集
export const removeTestSetFromTask = (data, projectName = '') => {
    return axios.post('/v1/apitest/remove_task_testSet/', data, {
        params: {
            project: projectName
        }
    })
}
// 测试任务中测试集详情
export const taskTestSetDetail = (id, task = '', project = '') => {
    return axios.get(`/v1/apitest/task_set_detail/${id}/`, {
        params: {
            task: task,
            project: project
        }
    })
}
// 测试任务测试集中的测试用例
export const taskSetCases = (task = '', testsetId = '', project = '', handler = '') => {
    return axios.get('/v1/apitest/task_set_cases/', {
        params: {
            task: task,
            testset_id: testsetId,
            project: project,
            handler: handler
        }
    })
}
// 获取配置列表
export const getConfigList = (page = 1, pageSize = 10, projectName = '') => {
    return axios.get('/v1/apitest/config/', {
        params: {
            project: projectName,
            page: page,
            page_size: pageSize
        }
    })
}
// 创建配置
export const createConfig = (data, projectName = '') => {
    return axios.post('/v1/apitest/config/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取配置详情
export const getConfigDetail = (configId, projectName = '') => {
    return axios.get(`/v1/apitest/config/${configId}/`, {
        params: {
            project: projectName
        }
    })
}
// 更新配置
export const updateConfig = (configId, data, projectName = '') => {
    return axios.put(`/v1/apitest/config/${configId}/`, data, {
        params: {
            project: projectName
        }
    })
}
// 删除配置
export const deleteConfig = (configId, projectName = '') => {
    return axios.delete(`/v1/apitest/config/${configId}/`, {
        params: {
            project: projectName
        }
    })
}
// 设置全局配置
export const setGlobalConfig = (data, projectName = '') => {
    return axios.post('/v1/apitest/set_global_config/', data, {
        params: {
            project: projectName
        }
    })
}
// 关联配置到测试集
export const configToSet = (data, projectName = '') => {
    return axios.post('/v1/apitest/config_to_set/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取测试集引用的配置
export const getSetConfig = (setId, projectName = '') => {
    return axios.get(`/v1/apitest/config_to_set/${setId}/`, {
        params: {
            project: projectName
        }
    })
}
// 获取计数器列表
export const getCounters = (projectName = '') => {
    return axios.get('/v1/apitest/counter/', {
        params: {
            project: projectName
        }
    })
}
// 添加计数器
export const addCounter = (data, projectName = '') => {
    return axios.post('/v1/apitest/counter/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取计数器的详情
export const getCounterDetail = (counterId, projectName = '') => {
    return axios.get(`/v1/apitest/counter/${counterId}/`, {
        params: {
            project: projectName
        }
    })
}
// 更新计数器
export const updateCounter = (counterId, data, projectName = '') => {
    return axios.put(`/v1/apitest/counter/${counterId}/`, data, {
        params: {
            project: projectName
        }
    })
}
// 删除计数器
export const deleteCounter = (counterId, projectName = '') => {
    return axios.delete(`/v1/apitest/counter/${counterId}/`, {
        params: {
            project: projectName
        }
    })
}
// 关联计数器到测试任务
export const linkCounter = (data, projectName = '') => {
    return axios.post('/v1/apitest/task_counter/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取测试任务下的计数器
export const getTaskCounter = (taskId, projectName = '') => {
    return axios.get(`/v1/apitest/task_counter/${taskId}/`, {
        params: {
            project: projectName
        }
    })
}
// 测试报告
export const resultStatics = (taskId, projectName = '') => {
    return axios.get(`/v1/apitest/result_statistics/${taskId}/`, {
        params: {
            project: projectName
        }
    })
}
// 获取权限列表
export const getPermissionList = () => {
    return axios.get('/v1/permissions/')
}

// 创建权限组
export const createGroup = data => {
    return axios.post('/v1/groups/', data)
}

// 获取权限组列表
export const getGroupList = () => {
    return axios.get('/v1/groups/')
}

// 删除权限组
export const deleteGroup = id => {
    return axios.delete(`/v1/groups/${id}/`)
}

// 获取权限组详情
export const getGroupDetail = id => {
    return axios.get(`/v1/groups/${id}/`)
}

// 更新权限组
export const updateGroup = (id, payload) => {
    return axios.put(`/v1/groups/${id}/`, payload)
}

// 获取用户列表
export const getUserList = () => {
    return axios.get('/v1/user/')
}

// 删除用户
export const deleteUser = id => {
    return axios.delete(`/v1/user/${id}/`)
}

// 用户权限管理
export const boundPermission = payload => {
    return axios.post('/v1/boundPermission/', payload)
}
