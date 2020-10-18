<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'CrontabList', query: $route.query }" class="is-link">定时任务</el-breadcrumb-item>
            <el-breadcrumb-item>添加定时任务</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="crontab" ref="crontabForm" :rules="rules" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="crontab.name" size="mini" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="crontab.display" size="mini" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="类型" :label-width="formLabelWidth" prop="display">
                <div style="text-align: left;">
                    <el-radio-group v-model="crontab.category" size="mini" @change="reset">
                        <el-radio-button label="api"></el-radio-button>
                        <el-radio-button label="ui"></el-radio-button>
                    </el-radio-group>
                </div>
            </el-form-item>
            <el-form-item label="定时开关" :label-width="formLabelWidth" prop="display">
                <div style="text-align: left;">
                    <el-radio-group v-model="crontab.enabled" size="mini" @change="reset">
                        <el-radio-button label="true"></el-radio-button>
                        <el-radio-button label="false"></el-radio-button>
                    </el-radio-group>
                </div>
            </el-form-item>
            <el-form-item label="任务" :label-width="formLabelWidth" prop="testtask">
                <el-select v-model="crontab.tasks" placeholder="请选择" style="display: block;" size="mini">
                    <el-option v-for="(task, ind) in tasks" :key="ind" :label="task.name + '(' + task.display + ')'" :value="task.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标签" :label-width="formLabelWidth" prop="tags">
                <el-select v-model="crontab.tags" placeholder="请选择" size="mini" style="display: block;">
                    <el-option label="bat" value="bat"></el-option>
                    <el-option label="smoke" value="smoke"></el-option>
                    <el-option label="regression" value="regression"></el-option>
                    <el-option label="container" value="container"></el-option>
                    <el-option label="maintenance" value="maintenance"></el-option>
                    <el-option label="alarm" value="alarm"></el-option>
                    <el-option label="scene" value="scene"></el-option>
                    <el-option label="devops" value="devops"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规则" :label-width="formLabelWidth" prop="crontab">
                <el-select v-model="crontab.crontab" size="mini" filterable style="display: block;">
                    <el-option
                        v-for="(content, ind) in rulesList"
                        :key="ind"
                        :label="content.name + '(' + content.display + ')'"
                        :value="content.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item size="mini">
                <el-button type="info" plain size="mini" @click="cancel('crontabForm')">取消</el-button>
                <el-button type="primary" plain size="mini" @click="submit('crontabForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'AddCrontab',
    data() {
        const validateName = (rule, value, callback) => {
            try {
                const passregex = /^[a-z]+[a-z0-9_-]*$/
                if (!value) {
                    callback(new Error('请输入名称'))
                } else {
                    if (!passregex.test(value)) {
                        callback(new Error('名称必须以小写字母开头，包含小写字母、数字、下划线、中横线'))
                    } else {
                        if (value.length < 1 || value.length > 20) {
                            callback(new Error('名称长度不得小于1位，大于20位'))
                        } else {
                            callback()
                        }
                    }
                }
            } catch (e) {}
        }
        return {
            rules: {
                name: [{ validator: validateName, required: true, trigger: 'blur' }]
            },
            crontab: {
                category: 'api',
                enabled: 'false'
            },
            formLabelWidth: '120px',
            projectName: this.$route.query.project_name,
            tasks: [],
            rulesList: []
        }
    },
    methods: {
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.$router.go(-1)
        },
        reset(val) {
            this.crontab.category = val
            this.crontab.tasks = null
            this.getTask()
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let project = this.projectName
                    this.crontab.project = project
                    let payload = JSON.stringify(this.crontab)
                    this.addPeriodictask(payload, project)
                } else {
                    return false
                }
            })
        },
        addPeriodictask(payload, projectName) {
            this.$api.api
                .createPeriodictask(payload, projectName)
                .then(() => {
                    this.notify.success('创建定时任务成功')
                    this.$router.push({ name: 'CrontabList', query: this.$route.query })
                })
                .catch(error => {
                    let rep = error.response.data
                    if (rep.hasOwnProperty('non_field_errors')) {
                        this.notify.error(rep.non_field_errors[0])
                    } else {
                        this.notify.error(rep)
                    }
                })
        },
        getTask() {
            this.$api.api
                .getTaskList(1, 1000, this.projectName, this.crontab.category)
                .then(response => {
                    this.tasks = response.data.results
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        ruleList() {
            this.$api.api
                .getCrontabRuleList(1, 1000, this.projectName)
                .then(response => {
                    this.rulesList = response.data.results
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        }
    },
    created() {
        this.getTask()
        this.ruleList()
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
</style>
