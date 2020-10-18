<template>
    <div class="el-form__item">
        <el-table class="table-class td" :data="results">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <template v-if="cate === 'api' && scope.row.hasOwnProperty('history') && scope.row.history.constructor == Object">
                        <j-editor v-model="scope.row.history.response" :edit="false"></j-editor>
                    </template>
                    <template v-else-if="cate === 'ui' && scope.row.hasOwnProperty('history') && scope.row.history.constructor == Object">
                        <template v-if="scope.row.history.error_message">
                            <el-row :gutter="10" class="asserts-row">
                                <el-col :span="4">失败原因</el-col>
                                <el-col :span="20">
                                    <template v-if="scope.row.history.error_message.length > 30">
                                        <el-popover trigger="hover" placement="top-start">
                                            <p>{{ scope.row.history.error_message }}</p>
                                            <div slot="reference" class="name-wrapper">
                                                {{ scope.row.history.error_message }}
                                            </div>
                                        </el-popover>
                                    </template>
                                    <template v-else>
                                        {{ scope.row.history.error_message }}
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10" class="ui-image">
                                <el-col :span="4">截图</el-col>
                                <el-col :span="20">
                                    <el-image :src="scope.row.history.image" style="width: 800px; height: 800px"></el-image>
                                </el-col>
                            </el-row>
                        </template>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="用例名称" min-width="100">
                <template slot-scope="scope">
                    <ul class="ul-style">
                        <li>
                            {{ scope.row.cases.name }}
                        </li>
                        <li class="text-style">
                            <template v-if="scope.row.cases.display">
                                <template v-if="scope.row.cases.display && scope.row.cases.display.length > 30">
                                    <el-popover trigger="hover" placement="top-start">
                                        <p>{{ scope.row.cases.display }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            {{ scope.row.cases.display }}
                                        </div>
                                    </el-popover>
                                </template>
                                <template v-else>
                                    {{ scope.row.cases.display }}
                                </template>
                            </template>
                        </li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column label="开始时间" min-width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.hasOwnProperty('history') && scope.row.history.start_time">
                        {{ $moment(scope.row.history.start_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" min-width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.hasOwnProperty('history') && scope.row.history.end_time">
                        {{ $moment(scope.row.history.end_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="50">
                <template slot-scope="scope">
                    <template v-if="scope.row.history.status === 'Done'">
                        <tag-done></tag-done>
                    </template>
                    <template v-else-if="scope.row.history.status === 'Starting'">
                        <tag-running></tag-running>
                    </template>
                    <template v-else>
                        <tag-not-run></tag-not-run>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结果" min-width="50">
                <template slot-scope="scope">
                    <template v-if="scope.row.history.result === 'Succeed'">
                        <tag-success></tag-success>
                    </template>
                    <template v-else-if="scope.row.history.result === 'Failed'">
                        <tag-failed></tag-failed>
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'CaseRecord',
    props: {
        value: Array,
        category: {
            type: String,
            default: 'api'
        }
    },
    data() {
        return {
            results: this.value,
            cate: this.category,
            fit: 'contain'
        }
    },
    watch: {
        value: function(newValue) {
            this.results = newValue
        }
    }
}
</script>

<style scoped></style>
