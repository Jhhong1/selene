<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'UICaseList', query: $route.query }" class="is-link">UI测试用例</el-breadcrumb-item>
            <el-breadcrumb-item>更新</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="cases" ref="cases" class="case-form">
            <el-form-item label="用例名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="cases.name" size="mini" readonly></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="cases.display" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="步骤" :label-width="formLabelWidth">
                <ui-step v-model="cases.procedures"></ui-step>
            </el-form-item>
            <el-form-item size="mini">
                <el-button type="info" plain @click="cancle" size="mini">取消</el-button>
                <el-button type="primary" plain @click="updateCase" size="mini">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'UpdateCase',
    data() {
        return {
            cases: {},
            formLabelWidth: '120px',
            caseId: this.$route.params.id,
            projectName: this.$route.query.project_name
        }
    },
    methods: {
        detail() {
            this.$api.api
                .getCaseDetail(this.caseId, this.projectName)
                .then(response => {
                    this.cases = response.data
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        cancle() {
            this.$router.push({ name: 'UICaseDetail', params: { id: this.caseId }, query: this.$route.query })
        },
        updateCase() {
            this.$api.api
                .updateCase(this.caseId, JSON.stringify(this.cases), this.projectName)
                .then(() => {
                    this.notify.success('更新用例成功')
                    this.$router.push({ name: 'UICaseDetail', params: { id: this.caseId }, query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        }
    },
    mounted() {
        this.detail()
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
