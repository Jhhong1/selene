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
                                <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="test-left">名称:</el-col>
                                <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11" class="test-right">{{ group.name }}</el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="test-left">描述:</el-col>
                                <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11" class="test-right">
                                    {{ group.description }}
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-collapse-item>
                <el-collapse-item title="权限" name="2" class="clearfix">
                    <el-card>
                        <div>
                            <template
                                v-if="
                                    !group.hasOwnProperty('config') &&
                                        !group.hasOwnProperty('apicases') &&
                                        !group.hasOwnProperty('apiset') &&
                                        !group.hasOwnProperty('apitasks') &&
                                        !group.hasOwnProperty('apiprojects') &&
                                        !group.hasOwnProperty('counter') &&
                                        !group.hasOwnProperty('crontabscheduleextend') &&
                                        !group.hasOwnProperty('periodictaskextend')
                                "
                            >
                                <div style="text-align: center;">暂无数据</div>
                            </template>
                            <template v-else>
                                <template v-if="group.hasOwnProperty('config')">
                                    <el-row :gutter="10" class="row-class">
                                        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="test-left">配置:</el-col>
                                        <el-col :xs="16" :sm="18" :md="20" :lg="19" :xl="23" class="test-right">
                                            <div>
                                                <span v-for="(permission, ind) in group.config" :key="ind">
                                                    <template v-if="permission === 'add_config'">
                                                        添加
                                                    </template>
                                                    <template v-else-if="permission === 'change_config'">
                                                        更新
                                                    </template>
                                                    <template v-else-if="permission === 'delete_config'">
                                                        删除
                                                    </template>
                                                    <template v-else>
                                                        查看
                                                    </template>
                                                </span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                                <template v-if="group.hasOwnProperty('counter')">
                                    <el-row :gutter="10" class="row-class">
                                        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="test-left">计数器:</el-col>
                                        <el-col :xs="16" :sm="18" :md="20" :lg="19" :xl="23" class="test-right">
                                            <div>
                                                <span v-for="(permission, ind) in group.counter" :key="ind">
                                                    <template v-if="permission === 'add_counter'">
                                                        添加
                                                    </template>
                                                    <template v-else-if="permission === 'change_counter'">
                                                        更新
                                                    </template>
                                                    <template v-else-if="permission === 'delete_counter'">
                                                        删除
                                                    </template>
                                                    <template v-else>
                                                        查看
                                                    </template>
                                                </span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                                <template v-if="group.hasOwnProperty('apicases')">
                                    <el-row :gutter="10" class="row-class">
                                        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="test-left">测试用例:</el-col>
                                        <el-col :xs="16" :sm="18" :md="20" :lg="19" :xl="23" class="test-right">
                                            <div>
                                                <span v-for="(permission, ind) in group.apicases" :key="ind">
                                                    <template v-if="permission === 'add_apicases'">
                                                        添加
                                                    </template>
                                                    <template v-else-if="permission === 'change_apicases'">
                                                        更新
                                                    </template>
                                                    <template v-else-if="permission === 'delete_apicases'">
                                                        删除
                                                    </template>
                                                    <template v-else-if="permission === 'view_apicases'">
                                                        查看
                                                    </template>
                                                    <template v-else-if="permission === 'execute_apicases'">
                                                        执行
                                                    </template>
                                                </span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                                <template v-if="group.hasOwnProperty('apiset')">
                                    <el-row :gutter="10" class="row-class">
                                        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="test-left">测试集:</el-col>
                                        <el-col :xs="16" :sm="18" :md="20" :lg="19" :xl="23" class="test-right">
                                            <div>
                                                <span v-for="(permission, ind) in group.apiset" :key="ind">
                                                    <template v-if="permission === 'add_apiset'">
                                                        添加
                                                    </template>
                                                    <template v-else-if="permission === 'change_apiset'">
                                                        更新
                                                    </template>
                                                    <template v-else-if="permission === 'delete_apiset'">
                                                        删除
                                                    </template>
                                                    <template v-else-if="permission === 'view_apiset'">
                                                        查看
                                                    </template>
                                                    <template v-else-if="permission === 'execute_apiset'">
                                                        执行
                                                    </template>
                                                    <template v-else-if="permission === 'remove_apiset'">
                                                        移除用例
                                                    </template>
                                                    <template v-else-if="permission === 'copy_apiset'">
                                                        复制用例
                                                    </template>
                                                    <template v-else-if="permission === 'config_apiset'">
                                                        配置引用
                                                    </template>
                                                    <template v-else-if="permission === 'cases_apiset'">
                                                        关联用例
                                                    </template>
                                                </span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                                <template v-if="group.hasOwnProperty('apitasks')">
                                    <el-row :gutter="10" class="row-class">
                                        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="test-left">测试任务:</el-col>
                                        <el-col :xs="16" :sm="18" :md="20" :lg="19" :xl="23" class="test-right">
                                            <div>
                                                <span v-for="(permission, ind) in group.apitasks" :key="ind">
                                                    <template v-if="permission === 'add_apitasks'">
                                                        添加
                                                    </template>
                                                    <template v-else-if="permission === 'change_apitasks'">
                                                        更新
                                                    </template>
                                                    <template v-else-if="permission === 'delete_apitasks'">
                                                        删除
                                                    </template>
                                                    <template v-else-if="permission === 'view_apitasks'">
                                                        查看
                                                    </template>
                                                    <template v-else-if="permission === 'execute_apitasks'">
                                                        执行
                                                    </template>
                                                    <template v-else-if="permission === 'associate_apitasks'">
                                                        关联测试集
                                                    </template>
                                                    <template v-else-if="permission === 'remove_apitasks'">
                                                        移除测试集
                                                    </template>
                                                </span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                                <template v-if="group.hasOwnProperty('apiprojects')">
                                    <el-row :gutter="10" class="row-class">
                                        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="test-left">
                                            项目:
                                        </el-col>
                                        <el-col :xs="16" :sm="18" :md="20" :lg="19" :xl="23" class="test-right">
                                            <div>
                                                <span v-for="(permission, ind) in group.apiprojects" :key="ind">
                                                    <template v-if="permission === 'add_apiprojects'">
                                                        添加
                                                    </template>
                                                    <template v-else-if="permission === 'change_apiprojects'">
                                                        更新
                                                    </template>
                                                    <template v-else-if="permission === 'delete_apiprojects'">
                                                        删除
                                                    </template>
                                                    <template v-else>
                                                        查看
                                                    </template>
                                                </span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                                <template v-if="group.hasOwnProperty('crontabscheduleextend')">
                                    <el-row :gutter="10" class="row-class">
                                        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="test-left">定时规则:</el-col>
                                        <el-col :xs="16" :sm="18" :md="20" :lg="19" :xl="23" class="test-right">
                                            <div>
                                                <span v-for="(permission, ind) in group.crontabscheduleextend" :key="ind">
                                                    <template v-if="permission === 'add_crontabscheduleextend'">
                                                        添加
                                                    </template>
                                                    <template v-else-if="permission === 'change_crontabscheduleextend'">
                                                        更新
                                                    </template>
                                                    <template v-else-if="permission === 'delete_crontabscheduleextend'">
                                                        删除
                                                    </template>
                                                    <template v-else>
                                                        查看
                                                    </template>
                                                </span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                                <template v-if="group.hasOwnProperty('periodictaskextend')">
                                    <el-row :gutter="10" class="row-class">
                                        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1" class="test-left">定时任务:</el-col>
                                        <el-col :xs="16" :sm="18" :md="20" :lg="19" :xl="23" class="test-right">
                                            <div>
                                                <span v-for="(permission, ind) in group.periodictaskextend" :key="ind">
                                                    <template v-if="permission === 'add_periodictaskextend'">
                                                        添加
                                                    </template>
                                                    <template v-else-if="permission === 'change_periodictaskextend'">
                                                        更新
                                                    </template>
                                                    <template v-else-if="permission === 'delete_periodictaskextend'">
                                                        删除
                                                    </template>
                                                    <template v-else>
                                                        查看
                                                    </template>
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
