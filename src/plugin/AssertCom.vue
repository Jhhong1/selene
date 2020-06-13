<template>
    <div class="bg-color">
        <el-row>
            <el-col :span="4">
                <div class="bg-purple-light">断言对象</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">对比操作</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">提取方式</div>
            </el-col>
            <el-col :span="6">
                <div class="bg-purple-light">表达式</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">匹配组</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">匹配数字</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">期望值</div>
            </el-col>
        </el-row>
        <template v-if="asserts !== undefined && asserts.length">
            <el-row v-for="(items, index) in asserts" :key="index" class="asserts-row">
                <template v-if="items.select == 'code'">
                    <el-col :span="4">响应码</el-col>
                </template>
                <template v-else-if="items.select == 'text'">
                    <el-col :span="4">响应文本</el-col>
                </template>
                <template v-else-if="items.select == 'response_header'">
                    <el-col :span="4">响应头</el-col>
                </template>
                <!-- <template v-else-if="items.select == 'request_history'">
                    <el-col :span="3">请求历史</el-col>
                </template> -->
                <template v-if="items.comparator">
                    <el-col :span="4" class="c-text">{{ items.comparator }}</el-col>
                </template>
                <template v-else>
                    <el-col :span="4" class="c-text">-</el-col>
                </template>
                <template v-if="items.match_type">
                    <el-col :span="2" class="c-text">{{ items.match_type }}</el-col>
                </template>
                <template v-else>
                    <el-col :span="2" class="c-text">-</el-col>
                </template>
                <template v-if="items.expression">
                    <el-col :span="6" class="c-text">
                        <template v-if="items.expression.length > 20">
                            <el-popover trigger="hover" placement="top-start">
                                <p>{{ items.expression }}</p>
                                <div slot="reference" class="name-wrapper">
                                    {{ items.expression }}
                                </div>
                            </el-popover>
                        </template>
                        <template v-else>
                            {{ items.expression }}
                        </template>
                    </el-col>
                </template>
                <template v-else>
                    <el-col :span="6" class="c-text">-</el-col>
                </template>
                <template v-if="items.group">
                    <el-col :span="2" class="c-text">{{ items.group }}</el-col>
                </template>
                <template v-else>
                    <el-col :span="2" class="c-text">-</el-col>
                </template>
                <template v-if="items.match_no">
                    <el-col :span="2" class="c-text">{{ items.match_no }}</el-col>
                </template>
                <template v-else>
                    <el-col :span="2" class="c-text">-</el-col>
                </template>
                <template v-if="show">
                    <el-col :span="2" class="c-text">{{ items.expected_value }}</el-col>
                    <el-col :span="1" style="text-align: right" class="icon-size">
                        <template v-if="show">
                            <el-button icon="el-icon-minus" circle @click="remove(items)"></el-button>
                        </template>
                    </el-col>
                    <el-col :span="1" style="padding-left: 10px" class="icon-size">
                        <template v-if="show">
                            <el-button icon="el-icon-edit-outline" circle @click="update(items, index)"></el-button>
                        </template>
                    </el-col>
                </template>
                <template v-else>
                    <el-col :span="4" class="c-text">{{ items.expected_value }}</el-col>
                </template>
            </el-row>
        </template>
        <template v-else>
            <el-row class="no-data-show">
                <el-col>无数据</el-col>
            </el-row>
        </template>
        <template v-if="show">
            <el-row>
                <el-col :span="24" class="col-class ch-button">
                    <el-button type="text" class="add-class el-col-24" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
                </el-col>
            </el-row>
        </template>
        <el-dialog title="新增断言" :visible.sync="dialogFormVisible" :close-on-click-modal="false" class="dialog-header" :before-close="handleClose">
            <el-form :model="form" ref="form" :hide-required-asterisk="true" class="select_class el-form__item">
                <el-form-item prop="select" label="断言对象" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                    <el-select v-model="form.select" placeholder="请选择">
                        <el-option label="响应码" value="code"></el-option>
                        <el-option label="响应文本" value="text"></el-option>
                        <el-option label="响应头" value="response_header"></el-option>
                        <!-- <el-option label="请求历史" value="request_history"></el-option> -->
                    </el-select>
                </el-form-item>
                <template v-if="form.select === 'code'">
                    <el-form-item label="对比操作" prop="comparator" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                        <el-select v-model="form.comparator" placeholder="请选择">
                            <el-option label="等于" value="equal"></el-option>
                            <el-option label="大于" value="gt"></el-option>
                            <el-option label="小于" value="lt"></el-option>
                            <!-- <el-option label="包含" value="in"></el-option> -->
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else-if="form.select === 'text' || form.select === 'response_header'">
                    <el-form-item label="对比操作" prop="comparator" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                        <el-select v-model="form.comparator" placeholder="请选择">
                            <el-option label="包含" value="contains"></el-option>
                            <el-option label="匹配" value="equal"></el-option>
                        </el-select>
                    </el-form-item>
                    <template v-if="form.comparator === 'equal'">
                        <el-form-item
                            label="匹配方式"
                            prop="match_type"
                            :label-width="labelWidth"
                            :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                        >
                            <el-select v-model="form.match_type" placeholder="请选择">
                                <el-option label="json path" value="json"></el-option>
                                <el-option label="正则表达式" value="regular"></el-option>
                            </el-select>
                        </el-form-item>
                        <template v-if="form.match_type === 'json'">
                            <el-form-item
                                label="json路径"
                                prop="expression"
                                :label-width="labelWidth"
                                :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                            >
                                <el-input v-model="form.expression" placeholder="请输入json路径,格式为: $.(\[[\w.\-/]+\])+"></el-input>
                            </el-form-item>
                        </template>
                        <template v-else-if="form.match_type === 'regular'">
                            <el-form-item
                                label="正则表达式"
                                prop="expression"
                                :label-width="labelWidth"
                                :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                            >
                                <el-input v-model="form.expression" placeholder="请输入正则表达式"></el-input>
                            </el-form-item>
                            <el-form-item label="匹配组" prop="group" :label-width="labelWidth">
                                <el-input v-model="form.group" placeholder="请输入匹配的组号, 最小数字为0" type="number" min="0"></el-input>
                            </el-form-item>
                            <el-form-item label="匹配数字" prop="match_no" :label-width="labelWidth">
                                <el-input v-model="form.match_no" placeholder="请输入匹配的数字, 最小数字为0" type="number" min="0"></el-input>
                            </el-form-item>
                        </template>
                    </template>
                </template>
                <el-form-item label="预期值" prop="expected_value" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                    <el-input v-model="form.expected_value"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancleAsserts('form')">取 消</el-button>
                <el-button type="primary" size="mini" @click="addAsserts('form', updateForm)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'AssertCom',
    props: {
        value: Array,
        showBtn: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            show: this.showBtn,
            asserts: this.value,
            dialogFormVisible: false,
            updateDialogFormVisible: false,
            labelWidth: '100px',
            form: {},
            updateForm: false,
            arrayIndex: null
        }
    },
    methods: {
        add() {
            this.dialogFormVisible = true
        },
        addAsserts(formName, edit) {
            if (!edit) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.asserts.push(Object.assign({}, this.form))
                        this.dialogFormVisible = false
                        this.$refs[formName].resetFields()
                    } else {
                        return false
                    }
                })
            } else {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.asserts[this.arrayIndex] = Object.assign({}, this.form)
                        this.dialogFormVisible = false
                        this.$refs[formName].resetFields()
                        this.arrayIndex = null
                        this.updateForm = false
                    } else {
                        return false
                    }
                })
            }
        },
        cancleAsserts(formName) {
            this.$refs[formName].resetFields()
            this.dialogFormVisible = false
        },
        handleClose() {
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
        },
        remove(item) {
            let index = this.asserts.indexOf(item)
            if (index !== -1) {
                this.asserts.splice(index, 1)
            }
        },
        update(item, index) {
            this.dialogFormVisible = true
            this.updateForm = true
            this.form = Object.assign({}, item)
            this.arrayIndex = index
        }
    },
    watch: {
        value: function(newValue) {
            // console.log('asserts: ', newValue)
            this.asserts = newValue
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
.el-form__item {
    margin-bottom: 18px;
}
.ch-button >>> .el-button {
    padding: 0 !important;
}
.select_class >>> .el-select {
    display: block !important;
}
.el-form__item >>> .el-form-item {
    margin-bottom: 18px !important;
}
.icon-size >>> .is-circle {
    padding: 0 !important;
    margin-left: -3%;
}
</style>
