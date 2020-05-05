<template>
    <div>
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'GroupList' }" class="is-link">权限组</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form class="case-form permission-case" :model="group" ref="group">
            <el-card shadow="never">
                <div slot="header" class="text-class">
                    <span>基本信息</span>
                </div>
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="group.name" size="mini" readonly></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="group.description" :rows="6" type="textarea"></el-input>
                </el-form-item>
            </el-card>
            <el-card shadow="never">
                <div slot="header" class="text-class">
                    <span>权限</span>
                </div>
                <template v-for="permission in permissions">
                    <el-form-item :label="permission.name" :label-width="formLabelWidth" :key="permission.model">
                        <el-select v-model="group_permissions[permission.model]" multiple style="display: block;" size="mini" @change="dataChange">
                            <el-option v-for="(p, indx) in permission.permission_set" :key="indx" :label="p.name" :value="p.id"></el-option>
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
    name: 'UpdateGroup',
    data() {
        return {
            group: {},
            formLabelWidth: '120px',
            id: this.$route.params.id,
            permissions: [],
            group_permissions: {}
        }
    },
    methods: {
        dataChange() {
            this.$forceUpdate()
        },
        extractPermission(content) {
            const _this = this
            for (let index = 0; index < content.length; index++) {
                const element = content[index]
                if (element.hasOwnProperty('model') && element.hasOwnProperty('permissions')) {
                    const mod = element.model
                    const permission = element.permissions
                    const tmp_list = []
                    for (let ind = 0; ind < permission.length; ind++) {
                        const p = permission[ind]
                        tmp_list.push(p.id)
                    }
                    _this.group_permissions[mod] = tmp_list
                }
            }
        },
        getGroup() {
            this.$api.api
                .getGroupDetail(this.id)
                .then(response => {
                    this.group = response.data
                    const tmp_data = Object.assign({}, this.group)
                    this.extractPermission(tmp_data.permissions)
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
            this.group.permissions = this.group_permissions
            this.updateGroup(this.id, JSON.stringify(this.group))
        },
        updateGroup(groupId, payload) {
            this.$api.api
                .updateGroup(groupId, payload)
                .then(() => {
                    this.notify.success('更新权限组成功')
                    this.$router.push({ name: 'GroupDetail', params: { id: this.id } })
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        getPermissions() {
            let _this = this
            this.$api.api
                .getPermissionList()
                .then(response => {
                    _this.permissions = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        }
    },
    created() {
        this.getGroup()
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
