<template>
    <div>
        <el-table :data="testSetCases" row-key="orderNum" style="padding-left: 20px; padding-right: 20px">
            <el-table-column label="用例名称" min-width="50" prop="testcase.name"> </el-table-column>
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
            <el-table-column label="结果" min-width="100">
                <template slot-scope="scope">
                    <template v-if="scope.row.result === 'Failed'">
                        <el-popover trigger="hover" placement="top-start">
                            <p>{{ scope.row.errorMessage }}</p>
                            <div slot="reference">
                                <tag-failed></tag-failed>
                            </div>
                        </el-popover>
                    </template>
                    <template v-else-if="scope.row.result === 'Succeed'">
                        <tag-success></tag-success>
                    </template>
                    <template v-else
                        >-</template
                    >
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="removeAction(scope.$index, testSetCases, scope.row)">移除</el-button>
                    <el-button type="text" size="mini" @click="copyRow(scope.$index, scope.row)">复制</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
    name: 'TestSetCases',
    props: {
        value: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
            testSetCases: this.value
        }
    },
    methods: {
        makeSortTable() {
            const table = document.querySelector('.el-table__body-wrapper table tbody ')
            const self = this
            Sortable.create(table, {
                onEnd({ newIndex, oldIndex }) {
                    if (newIndex === oldIndex) {
                        return false
                    } else {
                        const targetRow = self.testSetCases.splice(oldIndex, 1)[0]
                        self.testSetCases.splice(newIndex, 0, targetRow)
                        self.$emit('changeOrder', self.testSetCases)
                    }
                }
            })
        },
        copyRow(index, testcase) {
            let newIndex = index + 1
            this.testSetCases.splice(newIndex, 0, testcase)
            let data = {
                testSetCases: this.testSetCases,
                case: testcase
            }
            this.$emit('copy', data)
        },
        removeAction(index, obj, row) {
            const h = this.$createElement
            this.$msgbox({
                title: '提示',
                message: h('p', null, [h('span', null, '确定移除该测试用例吗？')]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        obj.splice(index, 1)
                        done()
                    } else {
                        done()
                    }
                }
            })
                .then(() => {
                    this.$emit('removeRow', row)
                })
                .catch(() => {})
        }
    },
    mounted() {
        this.makeSortTable()
    },
    watch: {
        value: function(newValue) {
            this.testSetCases = newValue
        }
    }
}
</script>

<style scoped></style>
