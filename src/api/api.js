import axios from 'axios'

axios.defaults.headers['Content-type'] = 'application/json'

if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = process.env.cronus
} else {
    axios.defaults.baseURL = 'http://127.0.0.1:8081'
}

// 获取secret id
export const secret = () => {
    return axios.get('/v1/users/secret/')
}

// 登录
export const login = params => {
    return axios.post('/v1/users/login/', params)
}

// 注册
export const register = params => {
    return axios.post('/v1/users/register/', params)
}

// 发送重置密码的邮件
export const sendEmail = params => {
    return axios.post('/v1/users/email/', params)
}

// 重置密码
export const resetPassword = (code, params) => {
    return axios.post('/v1/users/reset/password/', params, {
        params: {
            code: code
        }
    })
}

// 更改密码
export const changePassword = (username, params) => {
    return axios.put(`/v1/users/change/${username}/`, params)
}

// 添加测试用例
export const createTestCase = params => {
    return axios.post('/v1/services/cases/', params)
}

// 测试用例列表
export const testCaseList = (page = 1, pagesize = 10, projectName = '', category = 'api') => {
    return axios.get('/v1/services/cases/', {
        params: {
            page: page,
            page_size: pagesize,
            project: projectName,
            category: category
        }
    })
}

// 删除测试用例
export const deleteCase = caseId => {
    return axios.delete(`/v1/services/cases/${caseId}/`)
}

// 查看用例详情
export const getCaseDetail = caseId => {
    return axios.get(`/v1/services/cases/${caseId}/`)
}

// 更新用例
export const updateCase = (caseId, params) => {
    return axios.put(`/v1/services/cases/${caseId}/`, params)
}

// 执行测试用例
export const executeCase = (data, projectName = '') => {
    return axios.post('/v1/services/execute/', data, {
        params: {
            project: projectName
        }
    })
}

// 添加测试项目
export const createProject = params => {
    return axios.post('/v1/services/project/', params)
}

// 测试项目列表
export const ProjectList = (by_name = null) => {
    return axios.get('/v1/services/project/', {
        params: {
            by_name: by_name
        }
    })
}

// 删除测试项目
export const deleteProject = projectId => {
    return axios.delete(`/v1/services/project/${projectId}/`)
}

// 测试项目详情
export const ProjectDetail = projectId => {
    return axios.get(`/v1/services/project/${projectId}/`)
}

// 测试集列表
export const setList = (page = 1, pagesize = 10, projectName = '', category = 'api') => {
    return axios.get('/v1/services/sets/', {
        params: {
            page: page,
            page_size: pagesize,
            project: projectName,
            category: category
        }
    })
}

// 添加测试集
export const createSet = (data, projectName = '') => {
    return axios.post('/v1/services/sets/', data, {
        params: {
            project: projectName
        }
    })
}
// 删除测试集
export const deleteSet = id => {
    return axios.delete(`/v1/services/sets/${id}/`)
}
// 测试集详情
export const setDetail = (id, project) => {
    return axios.get(`/v1/services/sets/${id}/`, {
        params: {
            project: project
        }
    })
}
// 更新测试集
export const updateSet = (id, data, projectName = '') => {
    return axios.put(`/v1/services/sets/${id}/`, data, {
        params: {
            project: projectName
        }
    })
}
// 关联测试用例到测试集
export const bindingCases = data => {
    return axios.post('/v1/services/binding/cases/', data)
}
// 调准测试用例的顺序
export const ordering = (data, projectName = '') => {
    return axios.post('/v1/services/ordering/', data, {
        params: {
            project: projectName
        }
    })
}
// 移除测试集中的用例
export const unboundCases = (data, projectName = '') => {
    return axios.post('/v1/services/unbound/cases/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取与测试集关联的测试用例列表
export const TestSetCases = (testSetId, projectName = '', handler = null) => {
    return axios.get(`/v1/services/binding/cases/${testSetId}/`, {
        params: {
            project: projectName,
            handler: handler
        }
    })
}
// 添加测试任务
export const addTestTask = (data, projectName = '') => {
    return axios.post('/v1/services/tasks/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取测试任务列表
export const getTaskList = (page = 1, pageSize = 10, projectName = '', category = 'api') => {
    return axios.get('/v1/services/tasks/', {
        params: {
            page: page,
            page_size: pageSize,
            project: projectName,
            category: category
        }
    })
}
// 获取测试任务详情
export const getTaskDetail = (taskId, projectName = '') => {
    return axios.get(`/v1/services/tasks/${taskId}/`, {
        params: {
            project: projectName
        }
    })
}
// 更新测试任务
export const updateTask = (taskId, data, projectName = '') => {
    return axios.put(`/v1/services/tasks/${taskId}/`, data, {
        params: {
            project: projectName
        }
    })
}

// 删除测试任务
export const deleteTestTask = taskId => {
    return axios.delete(`/v1/services/tasks/${taskId}/`)
}
// 关联测试集到测试任务
export const bindingSets = (data, projectName = '') => {
    return axios.post('/v1/services/binding/sets/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取与测试任务关联的测试集列表
export const taskTestSet = (taskId, projectName = '') => {
    return axios.get(`/v1/services/binding/sets/${taskId}/`, {
        params: {
            project: projectName
        }
    })
}
// 从测试任务中移除测试集
export const unboundSets = (data, projectName = '') => {
    return axios.post('/v1/services/unbound/sets/', data, {
        params: {
            project: projectName
        }
    })
}
// 测试任务测试集中的测试用例
export const taskSetCases = (task = '', testsetId = '', project = '', handler = '') => {
    return axios.get('/v1/services/task_set_cases/', {
        params: {
            task: task,
            testset_id: testsetId,
            project: project,
            handler: handler
        }
    })
}
// 获取配置列表
export const getConfigList = (page = 1, pageSize = 10, projectName = '', category = '') => {
    return axios.get('/v1/services/config/', {
        params: {
            project: projectName,
            page: page,
            page_size: pageSize,
            category: category
        }
    })
}
// 创建配置
export const createConfig = (data, projectName = '') => {
    return axios.post('/v1/services/config/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取配置详情
export const getConfigDetail = (configId, projectName = '') => {
    return axios.get(`/v1/services/config/${configId}/`, {
        params: {
            project: projectName
        }
    })
}
// 更新配置
export const updateConfig = (configId, data, projectName = '') => {
    return axios.put(`/v1/services/config/${configId}/`, data, {
        params: {
            project: projectName
        }
    })
}
// 删除配置
export const deleteConfig = (configId, projectName = '') => {
    return axios.delete(`/v1/services/config/${configId}/`, {
        params: {
            project: projectName
        }
    })
}
// 关联配置到测试集
export const bindingConfig = (data, projectName = '') => {
    return axios.post('/v1/services/binding/config/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取测试集引用的配置
export const getSetConfig = (setId, projectName = '') => {
    return axios.get(`/v1/services/binding/config/${setId}/`, {
        params: {
            project: projectName
        }
    })
}
// 获取计数器列表
export const getCounters = (page = 1, page_size = 10, projectName = '') => {
    return axios.get('/v1/services/counter/', {
        params: {
            page: page,
            page_size: page_size,
            project: projectName
        }
    })
}
// 添加计数器
export const addCounter = (data, projectName = '') => {
    return axios.post('/v1/services/counter/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取计数器的详情
export const getCounterDetail = (counterId, projectName = '') => {
    return axios.get(`/v1/services/counter/${counterId}/`, {
        params: {
            project: projectName
        }
    })
}
// 更新计数器
export const updateCounter = (counterId, data, projectName = '') => {
    return axios.put(`/v1/services/counter/${counterId}/`, data, {
        params: {
            project: projectName
        }
    })
}
// 删除计数器
export const deleteCounter = (counterId, projectName = '') => {
    return axios.delete(`/v1/services/counter/${counterId}/`, {
        params: {
            project: projectName
        }
    })
}
// 关联计数器到测试任务
export const bindingCounter = (data, projectName = '') => {
    return axios.post('/v1/services/binding/counter/', data, {
        params: {
            project: projectName
        }
    })
}
// 获取测试任务下的计数器
export const getTaskCounter = (taskId, projectName = '') => {
    return axios.get(`/v1/services/binding/counter/${taskId}/`, {
        params: {
            project: projectName
        }
    })
}
// 测试报告
export const resultStatics = (taskId, type = '', projectName = '') => {
    return axios.get(`/v1/services/report/${taskId}/`, {
        params: {
            project: projectName,
            type: type
        }
    })
}
// 获取权限列表
export const getPermissionList = () => {
    return axios.get('/v1/users/permissions/')
}

// 创建权限组
export const createGroup = data => {
    return axios.post('/v1/users/groups/', data)
}

// 获取权限组列表
export const getGroupList = () => {
    return axios.get('/v1/users/groups/')
}

// 删除权限组
export const deleteGroup = id => {
    return axios.delete(`/v1/users/groups/${id}/`)
}

// 获取权限组详情
export const getGroupDetail = id => {
    return axios.get(`/v1/users/groups/${id}/`)
}

// 更新权限组
export const updateGroup = (id, payload) => {
    return axios.put(`/v1/users/groups/${id}/`, payload)
}

// 获取用户列表
export const getUserList = () => {
    return axios.get('/v1/users/user/')
}

// 获取用户详情
export const getUserDetail = id => {
    return axios.get(`/v1/users/user/${id}/`)
}

// 删除用户
export const deleteUser = id => {
    return axios.delete(`/v1/users/user/${id}/`)
}

// 用户权限管理
export const boundPermission = payload => {
    return axios.post('/v1/users/binding/permission/', payload)
}

// 获取定时规则列表
export const getCrontabRuleList = (page = 1, pageSize = 10, projectName = '') => {
    return axios.get('/v1/services/cron/', {
        params: {
            project: projectName,
            page: page,
            page_size: pageSize
        }
    })
}

// 创建定时规则
export const createCrontabRule = (payload, projectName = '') => {
    return axios.post('/v1/services/cron/', payload, {
        params: {
            project: projectName
        }
    })
}

// 获取定时规则详情
export const getCrontabRuleDetail = (ruleId, projectName = '') => {
    return axios.get(`/v1/services/cron/${ruleId}/`, {
        params: {
            project: projectName
        }
    })
}

// 更新定时规则
export const updateCrontabRule = (ruleId, payload, projectName = '') => {
    return axios.put(`/v1/services/cron/${ruleId}/`, payload, {
        params: {
            project: projectName
        }
    })
}

// 删除定时规则
export const deleteCrontabRule = (ruleId, projectName = '') => {
    return axios.delete(`/v1/services/cron/${ruleId}/`, {
        params: {
            project: projectName
        }
    })
}

// 定时任务列表
export const periodictaskList = (page = 1, pageSize = 10, projectName = '') => {
    return axios.get('/v1/services/periodic/', {
        params: {
            project: projectName,
            page: page,
            page_size: pageSize
        }
    })
}

// 创建定时任务
export const createPeriodictask = (payload, projectName = '') => {
    return axios.post('/v1/services/periodic/', payload, {
        params: {
            project: projectName
        }
    })
}

// 更新定时任务
export const updatePeriodictask = (id, payload, projectName = '') => {
    return axios.put(`/v1/services/periodic/${id}/`, payload, {
        params: {
            project: projectName
        }
    })
}

// 获取定时任务详情
export const PeriodictaskDetail = (id, projectName = '') => {
    return axios.get(`/v1/services/periodic/${id}/`, {
        params: {
            project: projectName
        }
    })
}

// 删除定时任务
export const deletePeriodictask = (id, projectName = '') => {
    return axios.delete(`/v1/services/periodic/${id}/`, {
        params: {
            project: projectName
        }
    })
}

// 获取历史记录
export const history = (types = '', id = '', task_id = '', batch = '', handler = '') => {
    return axios.get('/v1/services/history/', {
        params: {
            types: types,
            id: id,
            task_id: task_id,
            batch: batch,
            handler: handler
        }
    })
}
