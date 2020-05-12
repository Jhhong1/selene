<template>
    <div>
        <el-table :data="testSetCases" :class="custom" row-key="orderNum" style="padding-left: 20px; padding-right: 20px">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <template v-if="scope.row.response">
                        <div>
                            <el-row :gutter="10" class="row-class">
                                <el-col :span="2" class="test-left">请求结果</el-col>
                                <el-col :span="22" class="test-right">
                                    <j-editor v-model="scope.row.response" :edit="false"></j-editor>
                                </el-col>
                            </el-row>
                        </div>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="用例名称" min-width="50">
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
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        size="mini"
                        @click="removeAction(scope.$index, testSetCases, scope.row)"
                        :disabled="permissions.indexOf('apitest.remove_case') === -1"
                    >
                        移除
                    </el-button>
                    <template v-if="showCopy">
                        <el-button
                            type="text"
                            size="mini"
                            @click="copyRow(scope.$index, scope.row)"
                            :disabled="permissions.indexOf('apitest.copy_case') === -1"
                        >
                            复制
                        </el-button>
                    </template>
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
        },
        copy: {
            type: Boolean,
            default: true
        },
        attr: {
            type: String,
            default: 'cases'
        }
    },
    data() {
        return {
            testSetCases: this.value,
            permissions: [],
            showCopy: this.copy,
            custom: this.attr
        }
    },
    methods: {
        makeSortTable() {
            if (this.permissions.indexOf('apitest.associate_cases') > -1) {
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
        },
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        },
        parseJson(content) {
            if (typeof content == 'string') {
                try {
                    let obj = JSON.parse(content)
                    if (typeof obj == 'object' && obj) {
                        return obj
                    } else {
                        return content
                    }
                } catch (e) {
                    return content
                }
            }
        },
        parseResponse(contents) {
            for (let index in contents) {
                let content = contents[index]
                let response = content.response
                if (response) {
                    response = JSON.parse(response)
                    response.text = this.parseJson(response.text)
                    contents[index].response = response
                }
            }
            return contents
        }
    },
    mounted() {
        this.getPermissions()
        this.makeSortTable()
    },
    watch: {
        value: function(newValue) {
            this.testSetCases = this.parseResponse(newValue)
        },
        attr: function(newValue) {
            this.custom = newValue
        }
    }
}
</script>

<style scoped></style>
