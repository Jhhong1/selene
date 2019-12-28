<template>
    <div>
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
            <el-form-item label="任务" :label-width="formLabelWidth" prop="task">
                <el-select v-model="crontab.task" placeholder="请选择" class="method-class" size="mini">
                    <el-option v-for="(task, ind) in tasks" :key="ind" :label="task.name + '(' + task.display + ')'" :value="task.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规则" :label-width="formLabelWidth" prop="rule">
                <el-input v-model="crontab.rule" size="mini" placeholder="请参考crontab规则,例如: 0 18 * * *"></el-input>
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
            crontab: {},
            formLabelWidth: '120px',
            projectName: this.$route.query.project_name,
            tasks: []
        }
    },
    methods: {
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.$router.go(-1)
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    return
                } else {
                    return false
                }
            })
        },
        getTask() {
            this.$api.api
                .getTaskList(1, 1000, this.projectName)
                .then(response => {
                    this.tasks = response.data.results
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        }
    },
    created() {
        this.getTask()
    }
}
</script>
<style scoped>
.is-link >>> .is-link {
    color: #409eff !important;
}
</style>
