<template>
    <div>
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'GroupList' }" class="is-link">权限组</el-breadcrumb-item>
            <el-breadcrumb-item>添加权限组</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form class="case-form permission-case" :model="group" ref="group" :rules="rules">
            <el-card shadow="never">
                <div slot="header" class="text-class">
                    <span>基本信息</span>
                </div>
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="group.name" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="group.description" :rows="6" type="textarea"></el-input>
                </el-form-item>
            </el-card>
            <el-card shadow="never">
                <div slot="header" class="text-class">
                    <span>权限</span>
                </div>
                <template v-for="(permission, ind) in pData">
                    <el-form-item :key="ind" :label="permission.name" :label-width="formLabelWidth">
                        <el-select v-model="permissions[permission.model]" multiple class="method-class" size="mini">
                            <el-option v-for="(op, index) in permission.permission_set" :key="index" :label="op.name" :value="op.id"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </el-card>
            <el-form-item size="mini" style="margin: 50px 0">
                <el-button type="info" plain size="mini" @click="cancle">取消</el-button>
                <el-button type="primary" plain size="mini" @click="confirm">确定</el-button>
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
            pData: [],
            permissions: {},
            formLabelWidth: '120px',
            group: {},
            rules: {
                name: [{ validator: validateName, required: true, trigger: 'blur' }]
            }
        }
    },
    methods: {
        getPermissions() {
            let _this = this
            this.$api.api
                .getPermissionList()
                .then(response => {
                    _this.pData = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        cancle() {
            this.$refs['group'].resetFields()
            this.$router.push({ name: 'GroupList' })
        },
        confirm() {
            this.$refs['group'].validate(valid => {
                if (valid) {
                    this.group.permissions = this.permissions
                    this.addGroup(JSON.stringify(this.group))
                } else {
                    return false
                }
            })
        },
        addGroup(payload) {
            this.$api.api
                .createGroup(payload)
                .then(() => {
                    this.notify.success('添加权限组成功')
                    this.$router.push({ name: 'GroupList' })
                })
                .catch(error => {
                    this.notify.error(error)
                })
        }
    },
    created() {
        this.getPermissions()
    }
}
</script>

<style scoped>
.is-link >>> .is-link {
    color: #409eff !important;
}
.permission-case {
    padding: 0;
    border-radius: 6px;
}
.text-class {
    text-align: left;
}
.el-form-item_content >>> .el-form-item__content {
    text-align: left;
}
</style>
