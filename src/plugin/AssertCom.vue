<template>
    <div class="bg-color">
        <el-row>
            <el-col :span="2">
                <div class="bg-purple-light">断言对象</div>
            </el-col>
            <el-col :span="3">
                <div class="bg-purple-light">类型</div>
            </el-col>
            <el-col :span="3">
                <div class="bg-purple-light">对比方式</div>
            </el-col>
            <el-col :span="7">
                <div class="bg-purple-light">json路径</div>
            </el-col>
            <el-col :span="9">
                <div class="bg-purple-light">期望值</div>
            </el-col>
        </el-row>
        <template v-if="asserts !== undefined && asserts.length">
            <el-row v-for="(items, index) in asserts" :key="index" class="asserts-row">
                <el-col :span="2">{{ items.select }}</el-col>
                <template v-if="items.type">
                    <el-col :span="3">{{ items.type }}</el-col>
                </template>
                <template v-else>
                    <el-col :span="3">-</el-col>
                </template>
                <template v-if="items.comparator">
                    <el-col :span="3">{{ items.comparator }}</el-col>
                </template>
                <template v-else>
                    <el-col :span="3">-</el-col>
                </template>
                <template v-if="items.expression">
                    <el-col :span="7">{{ items.expression }}</el-col>
                </template>
                <template v-else>
                    <el-col :span="7">-</el-col>
                </template>
                <el-col :span="7">{{ items.expected_value }}</el-col>
                <el-col :span="1" style="text-align: right">
                    <template v-if="show">
                        <el-button icon="el-icon-minus" circle class="icon-size" @click="remove(items)"></el-button>
                    </template>
                </el-col>
                <el-col :span="1" style="padding-left: 10px">
                    <template v-if="show">
                        <el-button icon="el-icon-edit-outline" circle class="icon-size" @click="update(items, index)"></el-button>
                    </template>
                </el-col>
            </el-row>
        </template>
        <template v-else>
            <el-row class="no-data-show">
                <el-col>无数据</el-col>
            </el-row>
        </template>
        <template v-if="show">
            <el-row>
                <el-col :span="24" class="col-class">
                    <el-button type="text" class="add-class el-col-24" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
                </el-col>
            </el-row>
        </template>
        <el-dialog title="新增断言" :visible.sync="dialogFormVisible" :close-on-click-modal="false" class="dialog-header" :before-close="handleClose">
            <el-form :model="form" ref="form" :hide-required-asterisk="true">
                <el-form-item
                    prop="select"
                    label="断言对象"
                    :label-width="labelWidth"
                    class="el-form__item"
                    :rules="[{ required: true, message: '必填' }]"
                >
                    <el-select v-model="form.select" placeholder="请选择" class="select_class">
                        <el-option label="响应码" value="code"></el-option>
                        <el-option label="响应文本" value="text"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="form.select === 'code'">
                    <el-form-item
                        label="对比方式"
                        prop="comparator"
                        :label-width="labelWidth"
                        class="el-form__item"
                        :rules="[{ required: true, message: '必填' }]"
                    >
                        <el-select v-model="form.comparator" placeholder="请选择" class="select_class">
                            <el-option label="等于" value="equal"></el-option>
                            <el-option label="大于" value="gt"></el-option>
                            <el-option label="小于" value="lt"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else-if="form.select === 'text'">
                    <el-form-item
                        label="类型"
                        prop="type"
                        :label-width="labelWidth"
                        class="el-form__item"
                        :rules="[{ required: true, message: '必填' }]"
                    >
                        <el-select v-model="form.type" placeholder="请选择" class="select_class">
                            <el-option label="包含" value="contains"></el-option>
                            <el-option label="内容" value="content"></el-option>
                            <el-option label="长度" value="length"></el-option>
                        </el-select>
                    </el-form-item>
                    <template v-if="form.type === 'content'">
                        <el-form-item
                            label="json路径"
                            prop="expression"
                            :label-width="labelWidth"
                            class="el-form__item"
                            :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                        >
                            <el-input v-model="form.expression" placeholder="请输入json路径,格式为: $.data\[[\w.-]\]+"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="对比方式"
                            prop="comparator"
                            :label-width="labelWidth"
                            class="el-form__item"
                            :rules="[{ required: true, message: '必填' }]"
                        >
                            <el-select v-model="form.comparator" placeholder="请选择" class="select_class">
                                <el-option label="等于" value="equal"></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <template v-else-if="form.type === 'length'">
                        <el-form-item
                            label="json路径"
                            prop="expression"
                            :label-width="labelWidth"
                            class="el-form__item"
                            :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                        >
                            <el-input v-model="form.expression" placeholder="请输入json路径,格式为: $.data\[[\w.-]\]+"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="对比方式"
                            prop="comparator"
                            :label-width="labelWidth"
                            class="el-form__item"
                            :rules="[{ required: true, message: '必填' }]"
                        >
                            <el-select v-model="form.comparator" placeholder="请选择" class="select_class">
                                <el-option label="等于" value="equal"></el-option>
                                <el-option label="大于" value="gt"></el-option>
                                <el-option label="小于" value="lt"></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <template v-else-if="form.type === 'contains'"></template>
                </template>
                <el-form-item
                    label="预期值"
                    prop="expected_value"
                    :label-width="labelWidth"
                    class="el-form__item"
                    :rules="[{ required: true, message: '必填' }]"
                >
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
.icon-size {
    padding: 0;
    margin-left: -3%;
}
</style>
