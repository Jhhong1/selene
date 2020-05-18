<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'CounterList', query: $route.query }" class="is-link">计数器</el-breadcrumb-item>
            <el-breadcrumb-item>添加计数器</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="counter" ref="counter" :rules="rules" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="counter.name"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="counter.display"></el-input>
            </el-form-item>
            <el-form-item label="初始值" :label-width="formLabelWidth" prop="initial">
                <el-input v-model="counter.initial"></el-input>
            </el-form-item>
            <el-form-item label="增量" :label-width="formLabelWidth" prop="step">
                <el-input v-model="counter.step"></el-input>
            </el-form-item>
            <el-form-item label="最大值" :label-width="formLabelWidth" prop="final">
                <el-input v-model="counter.final"></el-input>
            </el-form-item>
            <el-form-item size="mini" style="margin-bottom: 30px">
                <el-button type="info" plain @click="cancel('counter')" size="mini">取消</el-button>
                <el-button type="primary" plain @click="submit('counter')" size="mini">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'AddCounter',
    data() {
        const validateName = (rule, value, callback) => {
            try {
                const passregex = /^[a-z]+[a-z_]*$/
                if (!value) {
                    callback(new Error('必填项不能为空'))
                } else {
                    if (!passregex.test(value)) {
                        callback(new Error('名称必须以小写字母开头，包含小写字母、下划线'))
                    } else {
                        if (value.length < 1 || value.length > 20) {
                            callback(new Error('名称长度不得少于1位，大于20位'))
                        } else {
                            callback()
                        }
                    }
                }
            } catch (e) {}
        }
        const validateOnlyNum = (rule, value, callback) => {
            try {
                const passregex = /^[1-9]+[0-9]*$/
                if (!value) {
                    callback(new Error('必填项不能为空'))
                } else {
                    console.log('number: ', value)
                    if (!passregex.test(value)) {
                        callback(new Error('请输入正整数'))
                    } else {
                        callback()
                    }
                }
            } catch (e) {}
        }
        return {
            counter: {},
            formLabelWidth: '120px',
            projectName: this.$route.query.project_name,
            rules: {
                name: [{ validator: validateName, required: true, trigger: 'blur' }],
                initial: [{ validator: validateOnlyNum, required: true, trigger: 'blur' }],
                step: [{ validator: validateOnlyNum, required: true, trigger: 'blur' }],
                final: [{ validator: validateOnlyNum, required: true, trigger: 'blur' }]
            }
        }
    },
    methods: {
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.$router.go(-1)
        },
        create(params, project, formName) {
            const _this = this
            this.$api.api
                .addCounter(params, project)
                .then(() => {
                    _this.notify.success('添加计数器成功')
                    _this.$refs[formName].resetFields()
                    _this.$router.push({ name: 'CounterList', query: this.$route.query })
                })
                .catch(error => {
                    _this.notify.error(error.response.data.non_field_errors)
                })
        },
        submit(formName) {
            let _this = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    _this.counter.project = _this.projectName
                    let payload = _this.counter
                    _this.create(JSON.stringify(payload), _this.projectName, formName)
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
