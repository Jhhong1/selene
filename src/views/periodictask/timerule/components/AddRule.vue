<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'RuleList', query: $route.query }" class="is-link">定时规则</el-breadcrumb-item>
            <el-breadcrumb-item>添加定时规则</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="rule" ref="rule" :rules="rules" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="rule.name" size="mini" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="rule.display" size="mini" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="分钟" :label-width="formLabelWidth" prop="minute">
                <el-input v-model="rule.minute" size="mini" placeholder="*代表任何时间, 例如: 0,30"></el-input>
            </el-form-item>
            <el-form-item label="小时" :label-width="formLabelWidth" prop="hour">
                <el-input v-model="rule.hour" size="mini" placeholder="*代表任何时间, 例如: 8,20"></el-input>
            </el-form-item>
            <el-form-item label="星期" :label-width="formLabelWidth" prop="day_of_week">
                <el-input v-model="rule.day_of_week" size="mini" placeholder="*代表任何时间, 例如: 0,6"></el-input>
            </el-form-item>
            <el-form-item label="日期" :label-width="formLabelWidth" prop="day_of_month">
                <el-input v-model="rule.day_of_month" size="mini" placeholder="*代表任何时间, 例如: 1,15"></el-input>
            </el-form-item>
            <el-form-item label="月份" :label-width="formLabelWidth" prop="month_of_year">
                <el-input v-model="rule.month_of_year" size="mini" placeholder="*代表任何时间, 例如: 1,6"></el-input>
            </el-form-item>
            <el-form-item label="时区" :label-width="formLabelWidth" prop="timezone">
                <el-select v-model="rule.timezone" style="display: block" size="mini">
                    <el-option label="Asia/Shanghai" value="Asia/Shanghai"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item size="mini">
                <el-button type="info" plain size="mini" @click="cancel('rule')">取消</el-button>
                <el-button type="primary" plain size="mini" @click="submit('rule')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'AddRule',
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
                        if (value.length < 1 || value.length > 50) {
                            callback(new Error('名称长度不得小于1位，大于50位'))
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
            projectName: this.$route.query.project_name,
            formLabelWidth: '120px',
            rule: {
                timezone: 'Asia/Shanghai'
            }
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
                    this.rule.project = this.projectName
                    let payload = JSON.stringify(this.rule)
                    this.addCrontabRule(payload, this.projectName)
                } else {
                    return false
                }
            })
        },
        addCrontabRule(payload, project) {
            this.$api.api
                .createCrontabRule(payload, project)
                .then(() => {
                    this.notify.success('添加定时规则成功')
                    this.$router.push({ name: 'RuleList', query: this.$route.query })
                })
                .catch(error => {
                    let rep = error.response.data
                    if (rep.hasOwnProperty('non_field_errors')) {
                        this.notify.error(rep.non_field_errors[0])
                    } else {
                        this.notify.error(rep)
                    }
                })
        }
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
