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
                <el-form-item label="配置" :label-width="formLabelWidth" prop="config">
                    <el-select v-model="group.config" multiple class="method-class" size="mini">
                        <el-option label="添加" value="add_config"></el-option>
                        <el-option label="更新" value="change_config"></el-option>
                        <el-option label="删除" value="delete_config"></el-option>
                        <el-option label="查看" value="view_config"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="测试用例" :label-width="formLabelWidth" prop="cases">
                    <el-select v-model="group.apicases" multiple class="method-class" size="mini">
                        <el-option label="添加" value="add_apicases"></el-option>
                        <el-option label="更新" value="change_apicases"></el-option>
                        <el-option label="删除" value="delete_apicases"></el-option>
                        <el-option label="查看" value="view_apicases"></el-option>
                        <el-option label="执行" value="execute_apicases"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="测试集" :label-width="formLabelWidth" prop="testset">
                    <el-select v-model="group.apiset" multiple class="method-class" size="mini">
                        <el-option label="添加" value="add_apiset"></el-option>
                        <el-option label="更新" value="change_apiset"></el-option>
                        <el-option label="删除" value="delete_apiset"></el-option>
                        <el-option label="查看" value="view_apiset"></el-option>
                        <el-option label="执行" value="execute_apiset"></el-option>
                        <el-option label="移除用例" value="remove_apiset"></el-option>
                        <el-option label="复制用例" value="copy_apiset"></el-option>
                        <el-option label="配置引用" value="config_apiset"></el-option>
                        <el-option label="关联用例" value="cases_apiset"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="测试任务" :label-width="formLabelWidth" prop="apitasks">
                    <el-select v-model="group.apitasks" multiple class="method-class" size="mini">
                        <el-option label="添加" value="add_apitasks"></el-option>
                        <el-option label="更新" value="change_apitasks"></el-option>
                        <el-option label="删除" value="delete_apitasks"></el-option>
                        <el-option label="查看" value="view_apitasks"></el-option>
                        <el-option label="执行" value="execute_apitasks"></el-option>
                        <el-option label="关联测试集" value="associate_apitasks"></el-option>
                        <el-option label="移除测试集" value="remove_apitasks"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目" :label-width="formLabelWidth" prop="projects" class="el-form-item_content">
                    <!-- <j-project v-model="group.projects"></j-project> -->
                    <el-select v-model="group.apiprojects" multiple class="method-class" size="mini">
                        <el-option label="添加" value="add_apiprojects"></el-option>
                        <el-option label="更新" value="change_apiprojects"></el-option>
                        <el-option label="删除" value="delete_apiprojects"></el-option>
                        <el-option label="查看" value="view_apiprojects"></el-option>
                    </el-select>
                </el-form-item>
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
            id: this.$route.params.id
        }
    },
    methods: {
        getGroup() {
            this.$api.api
                .getGroupDetail(this.id)
                .then(response => {
                    this.group = response.data
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
        }
    },
    created() {
        this.getGroup()
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
