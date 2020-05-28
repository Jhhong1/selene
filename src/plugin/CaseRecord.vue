<template>
    <div class="el-form__item">
        <el-table class="table-class td" :data="results">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <template v-if="scope.row.hasOwnProperty('executionrecord_set') && scope.row.executionrecord_set.constructor == Object">
                        <j-editor v-model="scope.row.executionrecord_set.response" :edit="false"></j-editor>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="用例名称" min-width="100">
                <template slot-scope="scope">
                    <ul class="ul-style">
                        <li>
                            {{ scope.row.testcase.name }}
                        </li>
                        <li class="text-style">
                            <template v-if="scope.row.testcase.display">
                                <template v-if="scope.row.testcase.display.length > 30">
                                    <el-popover trigger="hover" placement="top-start">
                                        <p>{{ scope.row.testcase.display }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            {{ scope.row.testcase.display }}
                                        </div>
                                    </el-popover>
                                </template>
                                <template v-else>
                                    {{ scope.row.testcase.display }}
                                </template>
                            </template>
                        </li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column label="开始时间" min-width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.hasOwnProperty('executionrecord_set') && scope.row.executionrecord_set.start_time">
                        {{ $moment(scope.row.executionrecord_set.start_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" min-width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.hasOwnProperty('executionrecord_set') && scope.row.executionrecord_set.end_time">
                        {{ $moment(scope.row.executionrecord_set.end_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="50">
                <template slot-scope="scope">
                    <template v-if="scope.row.executionrecord_set.status === 'Done'">
                        <tag-done></tag-done>
                    </template>
                    <template v-else-if="scope.row.executionrecord_set.status === 'Starting'">
                        <tag-running></tag-running>
                    </template>
                    <template v-else>
                        <tag-not-run></tag-not-run>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结果" min-width="50">
                <template slot-scope="scope">
                    <template v-if="scope.row.executionrecord_set.result === 'Succeed'">
                        <tag-success></tag-success>
                    </template>
                    <template v-else-if="scope.row.executionrecord_set.result === 'Failed'">
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
        value: Array
    },
    data() {
        return {
            results: this.value
        }
    },
    methods: {
        updateData(contents) {
            for (let content of contents) {
                if (content.hasOwnProperty('executionrecord_set') && content.executionrecord_set.constructor == Object) {
                    content.executionrecord_set.response = JSON.parse(content.executionrecord_set.response)
                }
            }
            this.results = contents
        }
    },
    watch: {
        value: function(newValue) {
            this.updateData(newValue)
        }
    }
}
</script>

<style scoped></style>
