<template>
    <div>
        <el-dialog
            title="关联测试用例"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            :before-close="choiceCancel"
            class="dialog-header table-class dialog-class el-table_empty-block"
            style="position: fixed"
            width="55%"
            @open="getCases"
            @opened="showChoices"
        >
            <template>
                <el-table ref="multiple" :data="testcases" tooltip-effect="dark" @selection-change="handleSelectionChange" style="width: 100%">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="用例名称" width="180">
                        <template slot-scope="scope">
                            <ul class="ul-style">
                                <li>
                                    {{ scope.row.name }}
                                </li>
                                <li class="text-style">
                                    <template v-if="scope.row.display">
                                        <template v-if="scope.row.display.length > 20">
                                            <el-popover trigger="hover" placement="top-start">
                                                <p>{{ scope.row.display }}</p>
                                                <div slot="reference" class="name-wrapper">
                                                    {{ scope.row.display }}
                                                </div>
                                            </el-popover>
                                        </template>
                                        <template v-else>
                                            {{ scope.row.display }}
                                        </template>
                                    </template>
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column label="请求方法" width="120" prop="method"></el-table-column>
                    <el-table-column label="请求地址" prop="url" show-overflow-tooltip></el-table-column>
                </el-table>
                <el-pagination
                    class="pagination-class"
                    background
                    layout="total, sizes, prev, pager, next"
                    :total="count"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    @size-change="handleSizeChange"
                    @current-change="currentChange"
                >
                </el-pagination>
                <div class="footer">
                    <el-button size="mini" plain @click="choiceCancel">取消</el-button>
                    <el-button type="primary" size="mini" plain @click="choice">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'LinkCases',
    props: {
        value: {
            type: Array,
            default: function() {
                return []
            }
        },
        show: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Array,
            default: function() {
                return []
            }
        },
        no: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            count: this.no,
            pageSizes: [10, 20, 50],
            pageSize: 10,
            currentPage: 1,
            dialogFormVisible: this.show,
            testcases: this.value,
            multipleSelection: [],
            testSetCases: this.selected
        }
    },
    methods: {
        getCases() {
            let e = { pageSize: this.pageSize, currentPage: this.currentPage }
            this.$emit('getCases', e)
        },
        showChoices() {
            const _this = this
            for (let i = 0, len = _this.testcases.length; i < len; i++) {
                let choice = _this.testcases[i]
                for (let k = 0, l = _this.testSetCases.length; k < l; k++) {
                    let c = _this.testSetCases[k]
                    try {
                        if (c.testcase.id === choice.id) {
                            _this.$refs.multiple.toggleRowSelection(choice, true)
                        }
                    } catch (e) {
                        // _this.notify.error(e)
                    }
                }
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleSizeChange(val) {
            this.pageSize = val
            let e = { pageSize: this.pageSize, currentPage: this.currentPage }
            this.$emit('pageSize', e)
        },
        currentChange(val) {
            this.currentPage = val
            let e = { pageSize: this.pageSize, currentPage: this.currentPage }
            this.$emit('currentPage', e)
        },
        choiceCancel() {
            this.dialogFormVisible = false
            this.$refs.multiple.clearSelection()
            this.pageSize = 10
            this.currentPage = 1
            this.$emit('visible', false)
        },
        choice() {
            let payload = {
                cases: this.multipleSelection
            }
            this.pageSize = 10
            this.currentPage = 1
            this.$emit('choice', payload)
        }
    },
    updated() {
        this.showChoices()
    },
    watch: {
        value: function(newValue) {
            this.testcases = newValue
        },
        show: function(newValue) {
            this.dialogFormVisible = newValue
        },
        selected: function(newValue) {
            this.testSetCases = newValue
        },
        no: function(newValue) {
            this.count = newValue
        }
    }
}
</script>
<style scoped>
.dialog-header >>> .el-dialog__header {
    padding: 20px 20px 0 !important;
    height: 20px;
    text-align: left;
    line-height: 20px;
}
.table-class >>> table {
    height: 40px;
    line-height: 40px;
}
.dialog-class >>> .el-dialog {
    /*height: 600px;*/
    overflow: scroll;
}
.footer {
    height: 40px;
    line-height: 40px;
    margin-top: 40px;
    position: relative;
    float: right;
    bottom: 20px;
}
.pagination-class {
    margin-top: 50px;
    float: left;
    margin-bottom: 20px;
}
</style>
<style>
.el-table__empty-block {
    height: 400px;
}
.el-tooltip__popper {
    max-width: 28%;
}
</style>
