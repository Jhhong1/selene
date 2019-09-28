<template>
    <div>
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'GroupList' }" class="is-link">权限组</el-breadcrumb-item>
            <el-breadcrumb-item>添加权限组</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form class="case-form" :model="group" :rules="rules">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="group.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                <el-input v-model="group.description" :rows="6" type="textarea"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'AddGroup',
    data() {
        const validateName = (rule, value, callback) => {
            try {
                if (!value) {
                    callback(new Error('请输入名称'))
                } else if (value.length < 0 || value.length > 80) {
                    callback(new Error('请输入1~80位长度的名称'))
                } else {
                    callback()
                }
            } catch (e) {}
        }
        return {
            formLabelWidth: '120px',
            group: {},
            rules: {
                name: [{ validator: validateName, required: true, trigger: 'blur' }]
            }
        }
    }
}
</script>

<style scoped>
.is-link >>> .is-link {
    color: #409eff !important;
}
</style>
