<template>
    <div class="el-form__item">
        <el-table class="table-class td" :data="results">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <template v-if="cate === 'api' && scope.row.response">
                        <j-editor v-model="scope.row.response" :edit="false"></j-editor>
                    </template>
                    <template v-else-if="cate === 'ui' && scope.row.error_message">
                        <el-row :gutter="10" class="asserts-row">
                            <el-col :span="4">失败原因</el-col>
                            <el-col :span="20">{{ scope.row.error_message }}</el-col>
                        </el-row>
                        <el-row :gutter="10" class="ui-image">
                            <el-col :span="4">截图</el-col>
                            <el-col :span="20">
                                <el-image :src="scope.row.image" :fit="fit"></el-image>
                            </el-col>
                        </el-row>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="开始时间" min-width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.start_time">
                        {{ $moment(scope.row.start_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" min-width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.end_time">
                        {{ $moment(scope.row.end_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="50">
                <template slot-scope="scope">
                    <template v-if="scope.row.status === 'Done'">
                        <tag-done></tag-done>
                    </template>
                    <template v-else-if="scope.row.status === 'Starting'">
                        <tag-running></tag-running>
                    </template>
                    <template v-else>
                        <tag-not-run></tag-not-run>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结果" min-width="50">
                <template slot-scope="scope">
                    <template v-if="scope.row.result === 'Succeed'">
                        <tag-success></tag-success>
                    </template>
                    <template v-else-if="scope.row.result === 'Failed'">
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
    name: 'CaseHistory',
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
        },
        category: function(newValue) {
            this.cate = newValue
        }
    }
}
</script>

<style scoped></style>
