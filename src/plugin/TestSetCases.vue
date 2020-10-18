<template>
    <div>
        <template v-if="cate === 'api'">
            <el-table :data="testSetCases" :class="custom" row-key="relations__order" style="padding-left: 20px; padding-right: 20px">
                <el-table-column label="用例名称" min-width="100">
                    <template slot-scope="scope">
                        <ul class="ul-style">
                            <li>
                                {{ scope.row.name }}
                            </li>
                            <li class="text-style">
                                <template v-if="scope.row.display && scope.row.display.length > 30">
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
                            </li>
                        </ul>
                    </template>
                </el-table-column>
                <el-table-column label="请求方法" min-width="50">
                    <template slot-scope="scope">
                        {{ scope.row.method }}
                    </template>
                </el-table-column>
                <el-table-column label="请求地址" min-width="200">
                    <template slot-scope="scope">
                        <template v-if="scope.row.url.length > 200">
                            <el-popover trigger="hover" placement="top-start">
                                <p>{{ scope.row.url }}</p>
                                <div slot="reference" class="name-wrapper">
                                    {{ scope.row.url }}
                                </div>
                            </el-popover>
                        </template>
                        <template v-else>
                            {{ scope.row.url }}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="50">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="mini"
                            @click="removeAction(scope.$index, testSetCases, scope.row)"
                            :disabled="permissions.indexOf('services.remove_case') === -1"
                        >
                            移除
                        </el-button>
                        <template v-if="showCopy">
                            <el-button
                                type="text"
                                size="mini"
                                @click="copyRow(scope.$index, scope.row)"
                                :disabled="permissions.indexOf('services.copy_case') === -1"
                            >
                                复制
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <template v-else-if="cate === 'ui'">
            <el-table :data="testSetCases" :class="custom" row-key="relations__order" style="padding-left: 20px; padding-right: 20px">
                <el-table-column label="用例名称" min-width="100">
                    <template slot-scope="scope">
                        <ul class="ul-style">
                            <li>
                                {{ scope.row.name }}
                            </li>
                            <li class="text-style">
                                <template v-if="scope.row.display && scope.row.display.length > 30">
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
                            </li>
                        </ul>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="50">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="mini"
                            @click="removeAction(scope.$index, testSetCases, scope.row)"
                            :disabled="permissions.indexOf('services.remove_case') === -1"
                        >
                            移除
                        </el-button>
                        <template v-if="showCopy">
                            <el-button
                                type="text"
                                size="mini"
                                @click="copyRow(scope.$index, scope.row)"
                                :disabled="permissions.indexOf('services.copy_case') === -1"
                            >
                                复制
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </template>
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
        },
        copy: {
            type: Boolean,
            default: true
        },
        attr: {
            type: String,
            default: 'cases'
        },
        category: {
            type: String,
            default: 'api'
        }
    },
    data() {
        return {
            testSetCases: this.value,
            showCopy: this.copy,
            custom: this.attr,
            cate: this.category
        }
    },
    methods: {
        makeSortTable() {
            if (this.permissions.indexOf('services.associate_cases') > -1) {
                let selector = '.' + this.custom + ' .el-table__body-wrapper table tbody'
                const table = document.querySelector(selector)
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
            } else {
                return false
            }
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
    computed: {
        permissions() {
            return this.$store.state.userinfo.permissions
        }
    },
    mounted() {
        this.makeSortTable()
    },
    watch: {
        value: function(newValue) {
            this.testSetCases = newValue
        },
        attr: function(newValue) {
            this.custom = newValue
        }
    }
}
</script>

<style scoped></style>
