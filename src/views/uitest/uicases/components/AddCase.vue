<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'UICaseList', query: $route.query }" class="is-link">UI测试用例</el-breadcrumb-item>
            <el-breadcrumb-item>添加测试用例</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="cases" ref="cases" :rules="rules" class="case-form">
            <el-form-item label="用例名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="cases.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="cases.display" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="步骤" :label-width="formLabelWidth">
                <ui-step v-model="cases.procedures"></ui-step>
            </el-form-item>
            <el-form-item size="mini">
                <el-button type="info" plain @click="cancle('cases')" size="mini">取消</el-button>
                <el-button type="primary" plain @click="addCase('cases')" size="mini">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'AddCase',
    data() {
        const validateCaseName = (rule, value, callback) => {
            try {
                const passregex = /^[a-z]+[a-z0-9_-]*$/
                if (!value) {
                    callback(new Error('请输入用例名称'))
                } else {
                    if (!passregex.test(value)) {
                        callback(new Error('用例名称必须以小写字母开头，包含小写字母、数字、下划线、中横线'))
                    } else {
                        if (value.length < 1 || value.length > 20) {
                            callback(new Error('用例名称长度不得少于1位，大于20位'))
                        } else {
                            callback()
                        }
                    }
                }
            } catch (e) {}
        }
        return {
            projectName: this.$route.query.project_name,
            cases: {
                procedures: [],
                category: 'ui'
            },
            formLabelWidth: '120px',
            rules: {
                name: [{ validator: validateCaseName, required: true, trigger: 'blur' }]
            }
        }
    },
    methods: {
        cancle(formName) {
            this.$refs[formName].resetFields()
            this.$router.go('-1')
        },
        create(payload) {
            this.$api.api
                .createTestCase(payload)
                .then(response => {
                    let caseId = response.data.id
                    this.notify.success('添加用例成功')
                    this.$refs['cases'].resetFields()
                    this.$router.push({ name: 'UICaseDetail', params: { id: caseId }, query: this.$route.query })
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
        addCase(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = this.cases
                    data.project = this.projectName
                    // console.log('create test case: ', payload)
                    this.create(JSON.stringify(data))
                } else {
                    return false
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
