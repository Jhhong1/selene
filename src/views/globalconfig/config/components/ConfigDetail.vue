<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'ConfigList', query: $route.query }" class="is-link">配置</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box-card">
            <el-collapse v-model="activeNames">
                <el-collapse-item name="1" class="clearfix icon-hidden">
                    <template slot="title">
                        <div style="display: inline-block">基本信息</div>
                        <!--阻止事件冒泡-->
                        <div class="button-position" @click.stop.prevent>
                            <el-dropdown size="mini" split-button type="primary" @command="handleCommand">
                                操作
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="update" :disabled="permissions.indexOf('apitest.update_config') === -1">
                                        更新
                                    </el-dropdown-item>
                                    <el-dropdown-item command="del" :disabled="permissions.indexOf('apitest.delete_config') === -1">
                                        删除
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </template>
                    <el-card>
                        <div>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">名称</el-col>
                                <el-col :span="10" class="test-right">{{ configDetail.name }}</el-col>
                                <el-col :span="2" class="test-left">创建时间</el-col>
                                <el-col :span="10" class="test-right">
                                    {{ $moment(configDetail.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">显示名称</el-col>
                                <el-col :span="10" class="test-right">
                                    <template v-if="configDetail.display">
                                        {{ configDetail.display }}
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </el-col>
                                <el-col :span="2" class="test-left">更新时间</el-col>
                                <el-col :span="10" class="test-right">
                                    {{ $moment(configDetail.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-collapse-item>
                <el-collapse-item title="详情" name="2" class="clearfix">
                    <el-card>
                        <div>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">类型</el-col>
                                <el-col :span="22" class="test-right">{{ configDetail.category }}</el-col>
                            </el-row>
                            <template v-if="configDetail.category === 'api'">
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">请求地址</el-col>
                                    <el-col :span="22" class="test-right">{{ configDetail.baseurl }}</el-col>
                                </el-row>
                                <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">头部信息</el-col>
                                    <el-col :span="22" class="test-right">
                                        <j-input v-model="configDetail.headers" :edit="false"></j-input>
                                    </el-col>
                                </el-row>
                            </template>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">请求代理</el-col>
                                <el-col :span="22" class="test-right">
                                    <j-proxy v-model="configDetail.proxy" :showBtn="false" :category="configDetail.category"></j-proxy>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">变量</el-col>
                                <el-col :span="22" class="test-right">
                                    <j-input v-model="configDetail.variables" :edit="false"></j-input>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left" style="height: 40px;line-height: 40px">
                                    设为全局变量
                                </el-col>
                                <el-col :span="22" class="test-right">
                                    <el-tooltip
                                        :content="'' + configDetail.globalConfig"
                                        placement="right-start"
                                        class="el--swith"
                                        style="display: block;line-height: 40px;"
                                    >
                                        <el-switch
                                            v-model="configDetail.globalConfig"
                                            disabled
                                            active-color="#13ce66"
                                            inactive-color="#dedfe0"
                                        ></el-switch>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConfigDetail',
    data() {
        return {
            configDetail: {},
            activeNames: ['1', '2'],
            configId: this.$route.params.id,
            projectName: this.$route.query.project_name,
            permissions: []
        }
    },
    methods: {
        getConfigDetail() {
            let _this = this
            this.$api.api
                .getConfigDetail(_this.configId, _this.projectName)
                .then(response => {
                    _this.configDetail = response.data
                })
                .catch(error => {
                    _this.notify.error(error.response.data)
                })
        },
        update() {
            this.$router.push({ name: 'UpdateConfig', params: { id: this.configId }, query: this.$route.query })
        },
        removeConfig(configId, project) {
            let _this = this
            this.$api.api
                .deleteConfig(configId, project)
                .then(() => {
                    _this.notify.success('删除用例成功')
                    _this.$router.push({ name: 'ConfigList', query: _this.$route.query })
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
                    message: h('p', null, [h('span', null, '确定删除该条配置吗？')]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            _this.removeConfig(_this.configId, _this.projectName)
                            done()
                        } else {
                            done()
                        }
                    }
                })
                    .then(() => {})
                    .catch(() => {})
            } else if (command === 'update') {
                this.update()
            }
        },
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        }
    },
    created() {
        this.getConfigDetail()
        this.getPermissions()
    },
    mounted() {}
}
</script>

<style scoped>
.el-bread >>> .el-breadcrumb {
    line-height: 40px !important;
}
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
</style>
