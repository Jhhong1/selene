<template>
    <div>
        <el-collapse v-model="activeNames">
            <el-collapse-item name="1" class="clearfix icon-hidden">
                <template slot="title">
                    <div style="display: inline-block">
                        基本信息
                    </div>
                </template>
                <el-card>
                    <div>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">名称</el-col>
                            <el-col :span="10" class="test-right">{{ cases.name }}</el-col>
                            <el-col :span="2" class="test-left">显示名称</el-col>
                            <el-col :span="10" class="test-right">{{ cases.display }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">状态</el-col>
                            <template v-if="cases.status === 'Starting'">
                                <el-col :span="10" class="test-right">
                                    <tag-running></tag-running>
                                </el-col>
                            </template>
                            <template v-else-if="cases.status === 'Done'">
                                <el-col :span="10" class="test-right">
                                    <tag-done></tag-done>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="10" class="test-right">
                                    <tag-not-run></tag-not-run>
                                </el-col>
                            </template>
                            <el-col :span="2" class="test-left">更新时间</el-col>
                            <el-col :span="10" class="test-right">{{ cases.updateTime }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">执行结果</el-col>
                            <template v-if="cases.result === 'Succeed'">
                                <el-col :span="10" class="test-right">
                                    <tag-success></tag-success>
                                </el-col>
                            </template>
                            <template v-else-if="cases.result === 'Failed'">
                                <el-col :span="10" class="test-right">
                                    <tag-failed></tag-failed>
                                </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="10" class="test-right">-</el-col>
                            </template>
                            <el-col :span="2" class="test-left">创建时间</el-col>
                            <el-col :span="10" class="test-right">{{ cases.createTime }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">开始时间</el-col>
                            <el-col :span="10" class="test-right">
                                <template v-if="cases.startRunTime">
                                    {{ cases.startRunTime }}
                                </template>
                                <template v-else>
                                    -
                                </template>
                            </el-col>
                            <el-col :span="2" class="test-left">结束时间</el-col>
                            <el-col :span="10" class="test-right">
                                <template v-if="cases.endRunTime">
                                    {{ cases.endRunTime }}
                                </template>
                                <template v-else>
                                    -
                                </template>
                            </el-col>
                        </el-row>
                        <!-- <el-row :gutter="10" class="row-class">
                                    <el-col :span="2" class="test-left">失败原因</el-col>
                                    <template v-if="cases.caserelationship.errorMessage">
                                        <el-col :span="10" class="test-right">
                                            <el-tooltip placement="top-start">
                                                <div slot="content">{{ cases.caserelationship.errorMessage }}</div>
                                                <el-button type="text" size="mini" plain class="el-button__text is-plain">{{
                                                    cases.caserelationship.errorMessage
                                                }}</el-button>
                                            </el-tooltip>
                                        </el-col>
                                    </template>
                                    <template v-else>
                                        <el-col :span="10" class="test-right">-</el-col>
                                    </template>
                                </el-row> -->
                    </div>
                </el-card>
            </el-collapse-item>
            <el-collapse-item title="详情" name="2" class="clearfix">
                <el-card>
                    <div>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">请求地址</el-col>
                            <el-col :span="22" class="test-right">{{ cases.url }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">请求方法</el-col>
                            <el-col :span="22" class="test-right">{{ cases.method }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">变量</el-col>
                            <el-col :span="22" class="test-right">
                                <j-input v-model="cases.variables" :edit="false"></j-input>
                            </el-col>
                        </el-row>
                        <!-- <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">认证方式</el-col>
                                <el-col :span="22" class="test-right">
                                    <el-row>
                                        <el-col class="bg-purple-light" :span="4">类型</el-col>
                                        <el-col class="bg-purple-light" :span="10">用户名</el-col>
                                        <el-col class="bg-purple-light" :span="10">密码</el-col>
                                    </el-row>
                                    <el-row style="padding-left: 10px">
                                        <el-col :span="4">{{ cases.authMethod }}</el-col>
                                        <template v-if="cases.auth">
                                            <el-col :span="10">{{ cases.auth.username }}</el-col>
                                        </template>
                                        <template v-else>
                                            <el-col :span="10">-</el-col>
                                        </template>
                                        <template v-if="cases.auth">
                                            <el-col :span="10">{{ cases.auth.password }}</el-col>
                                        </template>
                                        <template v-else>
                                            <el-col :span="10">-</el-col>
                                        </template>
                                    </el-row>
                                </el-col>
                            </el-row> -->
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">头部信息</el-col>
                            <el-col :span="22" class="test-right">
                                <j-input v-model="cases.headers" :edit="false"></j-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">请求内容</el-col>
                            <el-col :span="22" class="test-right">
                                <j-editor v-model="cases.body" :edit="false"></j-editor>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">结果断言</el-col>
                            <el-col :span="22" class="test-right">
                                <j-assert v-model="cases.asserts" :show-btn="false" class="bg-change"></j-assert>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">提取参数</el-col>
                            <el-col :span="22" class="test-right">
                                <j-extract v-model="cases.extracts" :edit="false" class="bg-change"></j-extract>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">超时时间</el-col>
                            <template v-if="cases.waitingTime">
                                <el-col :span="22"> {{ cases.waitingTime }} s </el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">-</el-col>
                            </template>
                        </el-row>
                        <el-row :gutter="10" class="row-class">
                            <el-col :span="2" class="test-left">重试次数</el-col>
                            <template v-if="cases.cycle">
                                <el-col :span="22"> {{ cases.cycle }} 次</el-col>
                            </template>
                            <template v-else>
                                <el-col :span="22">0 次</el-col>
                            </template>
                        </el-row>
                        <!-- <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left" style="height: 40px;line-height: 40px">
                                    失败后是否继续
                                </el-col>
                                <el-col :span="22" class="test-right">
                                    <el-tooltip :content="'' + cases.continues" placement="right-start" class="el--swith">
                                        <el-switch v-model="cases.continues" disabled></el-switch>
                                    </el-tooltip>
                                </el-col>
                            </el-row> -->
                    </div>
                </el-card>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
export default {
    name: 'Detail',
    props: {
        value: {}
    },
    data() {
        return {
            cases: this.value,
            activeNames: ['1', '2', '3']
        }
    },
    watch: {
        value: function(newValue) {
            this.cases = newValue
        }
    }
}
</script>

<style scoped></style>
