<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'UISetList', query: $route.query }" class="is-link">测试集</el-breadcrumb-item>
            <el-breadcrumb-item>更新测试集</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="setForm" ref="setForm" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="setForm.name" maxlength="20" readonly></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="setForm.display" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="标签" :label-width="formLabelWidth" prop="labels">
                <el-select v-model="setForm.tags" multiple placeholder="请选择" style="display: block;">
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
            <el-form-item label="描述信息" :label-width="formLabelWidth" prop="description">
                <el-input v-model="setForm.description" type="textarea" :autosize="{ minRows: 10 }"></el-input>
            </el-form-item>
            <el-form-item size="mini">
                <el-button type="info" plain size="mini" @click="cancel('setForm')">取消</el-button>
                <el-button type="primary" plain size="mini" @click="submit('setForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'UpdateSet',
    data() {
        return {
            setForm: {},
            setId: this.$route.params.id,
            name: this.$route.params.name,
            projectName: this.$route.query.project_name,
            formLabelWidth: '120px'
        }
    },
    methods: {
        setDetail() {
            this.$api.api
                .setDetail(this.setId, this.projectName)
                .then(response => {
                    this.setForm = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.$router.push({ name: 'UISetDetail', params: { name: this.name, id: this.setId }, query: this.$route.query })
        },
        updateSet(id, payload, project) {
            this.$api.api
                .updateSet(id, payload, project)
                .then(() => {
                    this.notify.success('更新测试集成功')
                    this.$router.push({ name: 'UISetDetail', params: { name: this.name, id: this.setId }, query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        submit(formName) {
            let _this = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let payload = JSON.stringify(this.setForm)
                    _this.updateSet(_this.setId, payload, _this.projectName)
                } else {
                    return false
                }
            })
        }
    },
    created() {
        this.setDetail()
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
