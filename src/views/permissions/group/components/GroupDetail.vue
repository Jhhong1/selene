<template>
    <div>
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'GroupList' }" class="is-link">权限组</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box-card">
            <el-collapse v-model="activeNames">
                <el-collapse-item name="1" class="clearfix icon-hidden">
                    <template slot="title">
                        <div style="display: inline-block">基本信息</div>
                        <!--阻止事件冒泡-->
                        <div class="button-position" @click.stop.prevent>
                            <el-dropdown size="mini" split-button type="primary" @click="update" @command="handleCommand">
                                更新
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="del">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </template>
                    <el-card>
                        <div>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">名称:</el-col>
                                <el-col :span="22" class="test-right">{{ group.name }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">描述:</el-col>
                                <el-col :span="22" class="test-right">
                                    {{ group.description }}
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-collapse-item>
                <el-collapse-item title="权限" name="2" class="clearfix">
                    <el-card>
                        <div>
                            <template v-if="group.hasOwnProperty('permissions') && group.permissions.length == 0">
                                <div style="text-align: center;">暂无数据</div>
                            </template>
                            <template v-else-if="group.hasOwnProperty('permissions') && group.permissions.length > 0">
                                <template v-for="(permissions, ind) in group.permissions">
                                    <el-row :gutter="10" class="row-class" :key="ind">
                                        <el-col :span="2" class="test-left">{{ permissions.name }}</el-col>
                                        <el-col :span="22" class="test-right">
                                            <div>
                                                <span v-for="(permission, indx) in permissions.permissions" :key="indx">
                                                    {{ permission.name }}&nbsp;
                                                </span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                            </template>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<script>
export default {
    name: 'GroupDetail',
    data() {
        return {
            group: {},
            activeNames: ['1', '2'],
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
        update() {
            this.$router.push({ name: 'UpdateGroup', params: { id: this.id } })
        },
        removeConfig(groupId) {
            let _this = this
            this.$api.api
                .deleteGroup(groupId)
                .then(() => {
                    _this.notify.success('删除用例成功')
                    _this.$router.push({ name: 'GroupList' })
                })
                .catch(error => {
                    this.notify.error(error.response.data)
                })
        },
        handleCommand(command) {
            if (command === 'del') {
                const h = this.$createElement
                let _this = this
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [h('span', null, '确定删除该权限组吗？')]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            _this.removeConfig(_this.id)
                            done()
                        } else {
                            done()
                        }
                    }
                })
                    .then(() => {})
                    .catch(() => {})
            }
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
.icon-hidden >>> .el-icon-arrow-right:before {
    display: none !important;
}
.box-card {
    position: relative;
    /*margin-top: 20px;*/
    line-height: 20px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 15px;
    background-color: white;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
}
.clearfix:after {
    clear: both;
}
.test-left {
    border: 1px solid white;
    text-align: right;
}
</style>
