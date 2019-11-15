<template>
    <div>
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'CounterList', query: $route.query }" class="is-link">计数器</el-breadcrumb-item>
            <el-breadcrumb-item>更新计数器</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="counter" ref="counter" :rules="rules" class="case-form">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="counter.name" readonly></el-input>
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
    name: 'UpdateCounter',
    data() {
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
            id: this.$route.params.id,
            projectName: this.$route.query.project_name,
            rules: {
                initial: [{ validator: validateOnlyNum, required: true, trigger: 'blur' }],
                step: [{ validator: validateOnlyNum, required: true, trigger: 'blur' }],
                final: [{ validator: validateOnlyNum, required: true, trigger: 'blur' }]
            }
        }
    },
    methods: {
        getCounter() {
            this.$api.api
                .getCounterDetail(this.id, this.projectName)
                .then(response => {
                    this.counter = response.data
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        cancel(formName) {
            this.$refs[formName].resetFields()
            this.$router.go(-1)
        },
        updateCounter(counterId, payload, project, formName) {
            const _this = this
            this.$api.api
                .updateCounter(counterId, payload, project)
                .then(() => {
                    _this.notify.success('更新计数器成功')
                    _this.$refs[formName].resetFields()
                    _this.$router.push({ name: 'CounterList', query: this.$route.query })
                })
                .catch(error => {
                    _this.notify.error(error.response.data)
                })
        },
        submit(formName) {
            let _this = this
            this.$refs[formName].validate(valid => {
                if (valid) {
                    _this.counter.project = _this.projectName
                    let payload = _this.counter
                    _this.updateCounter(this.id, JSON.stringify(payload), _this.projectName, formName)
                } else {
                    return false
                }
            })
        }
    },
    created() {
        this.getCounter()
    }
}
</script>

<style scoped>
.is-link >>> .is-link {
    color: #409eff !important;
}
</style>
