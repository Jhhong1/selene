<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'RuleList', query: $route.query }" class="is-link">定时规则</el-breadcrumb-item>
            <el-breadcrumb-item>更新定时规则</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="rule" ref="rule" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="rule.name" readonly size="mini" maxlength="50"></el-input>
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
                <el-select v-model="rule.timezone" style="display: block;" size="mini">
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
    name: 'UpdateRule',
    data() {
        return {
            rule: {},
            projectName: this.$route.query.project_name,
            ruleId: this.$route.params.id,
            formLabelWidth: '120px'
        }
    },
    methods: {
        ruleDetail() {
            this.$api.api
                .getCrontabRuleDetail(this.ruleId, this.projectName)
                .then(response => {
                    this.rule = response.data
                })
                .catch(error => {
                    this.notify.error(error.response)
                })
        },
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.$router.push({ name: 'RuleList', query: this.$route.query })
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.rule.project = this.projectName
                    let payload = JSON.stringify(this.rule)
                    this.updateRule(this.ruleId, payload, this.projectName)
                } else {
                    return false
                }
            })
        },
        updateRule(ruleId, payload, project) {
            this.$api.api
                .updateCrontabRule(ruleId, payload, project)
                .then(() => {
                    this.notify.success('更新定时规则成功')
                    this.$router.push({ name: 'RuleList', query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error.response)
                })
        }
    },
    created() {
        this.ruleDetail()
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
