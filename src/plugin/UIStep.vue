<template>
    <div class="bg-color">
        <el-row>
            <el-col :span="3">
                <div class="bg-purple-light">操作</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">浏览器名称</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">定位方式</div>
            </el-col>
            <el-col :span="5">
                <div class="bg-purple-light">元素值</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">等待方式</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">等待时长</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">对比方式</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">期望值</div>
            </el-col>
        </el-row>
        <template v-if="steps && steps.length">
            <el-row v-for="(items, index) in steps" :key="index" class="asserts-row">
                <el-col :span="3">{{ items.action }}</el-col>
                <el-col :span="2">{{ items.browser }}</el-col>
                <template v-if="items.search_type">
                    <el-col :span="4">{{ items.search_type }}</el-col>
                </template>
                <template v-else>
                    <el-col :span="4">-</el-col>
                </template>
                <template v-if="items.search_value">
                    <el-col :span="5">
                        <el-popover trigger="hover" placement="top-start">
                            <p>{{ items.search_value }}</p>
                            <div slot="reference" class="name-wrapper">
                                {{ items.search_value }}
                            </div>
                        </el-popover>
                    </el-col>
                </template>
                <template v-else>
                    <el-col :span="5">-</el-col>
                </template>
                <template v-if="items.wait">
                    <el-col :span="2" class="p_left">
                        <el-popover trigger="hover" placement="top-start">
                            <p>{{ items.wait }}</p>
                            <div slot="reference" class="name-wrapper">
                                {{ items.wait }}
                            </div>
                        </el-popover>
                    </el-col>
                </template>
                <template v-else>
                    <el-col :span="2" class="p_left">-</el-col>
                </template>
                <template v-if="items.num">
                    <el-col :span="2" class="p_left">{{ items.num }}</el-col>
                </template>
                <template v-else>
                    <el-col :span="2" class="p_left">-</el-col>
                </template>
                <template v-if="items.comparator">
                    <el-col :span="2" class="p_left">{{ items.comparator }}</el-col>
                </template>
                <template v-else>
                    <el-col :span="2" class="p_left">-</el-col>
                </template>
                <template v-if="show">
                    <template v-if="items.expected_value">
                        <el-col :span="2">
                            <el-popover trigger="hover" placement="top-start">
                                <p>{{ items.expected_value }}</p>
                                <div slot="reference" class="name-wrapper">
                                    {{ items.expected_value }}
                                </div>
                            </el-popover>
                        </el-col>
                    </template>
                    <template v-else>
                        <el-col :span="2" class="p_left">-</el-col>
                    </template>
                    <el-col :span="1" style="text-align: right" class="icon-size">
                        <el-button icon="el-icon-minus" circle @click="remove(items)"></el-button>
                    </el-col>
                    <el-col :span="1" style="padding-left: 10px" class="icon-size">
                        <el-button icon="el-icon-edit-outline" circle @click="update(items, index)"></el-button>
                    </el-col>
                </template>
                <template v-else>
                    <el-col :span="4">
                        <el-popover trigger="hover" placement="top-start">
                            <p>{{ items.expected_value }}</p>
                            <div slot="reference" class="name-wrapper">
                                {{ items.expected_value }}
                            </div>
                        </el-popover>
                    </el-col>
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
        <el-dialog title="操作步骤" :visible.sync="dialogFormVisible" :close-on-click-modal="false" class="dialog-header" :before-close="handleClose">
            <el-form :model="form" ref="form" :hide-required-asterisk="true" class="select_class el-form__item">
                <el-form-item prop="action" label="操作" :label-width="labelWidth" :rules="[{ required: true, message: '必填', trigger: 'blur' }]">
                    <el-select v-model="form.action" placeholder="请选择">
                        <el-option label="打开浏览器" value="open_browser"></el-option>
                        <el-option label="点击" value="click"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="form.action === 'open_browser'">
                    <el-form-item
                        prop="browser"
                        label="浏览器名称"
                        :label-width="labelWidth"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                        <el-select v-model="form.browser" placeholder="请选择">
                            <el-option label="谷歌浏览器" value="chrome"></el-option>
                            <el-option label="火狐浏览器" value="firefox"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item prop="search_type" label="定位方式" :label-width="labelWidth">
                    <el-select v-model="form.search_type" placeholder="请选择">
                        <el-option label="by_id" value="by_id"></el-option>
                        <el-option label="by_name" value="by_name"></el-option>
                        <el-option label="by_class_name" value="by_class_name"></el-option>
                        <el-option label="by_tag_name" value="by_tag_name"></el-option>
                        <el-option label="by_link_text" value="by_link_text"></el-option>
                        <el-option label="by_partial_link_text" value="by_partial_link_text"></el-option>
                        <el-option label="by_xpath" value="by_xpath"></el-option>
                        <el-option label="by_css_selector" value="by_css_selector"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="search_value" label="元素值" :label-width="labelWidth">
                    <el-input v-model="form.search_value" placeholder="请输入元素值"></el-input>
                </el-form-item>
                <el-form-item prop="wait" label="等待方式" :label-width="labelWidth">
                    <el-select v-model="form.wait" placeholder="请选择">
                        <el-option label="强制等待" value="sleep"></el-option>
                        <el-option label="显示等待" value="webdriverwait"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="num" label="等待时长" :label-width="labelWidth">
                    <el-input v-model="form.num" placeholder="请输入等待时长"></el-input>
                </el-form-item>
                <el-form-item prop="comparator" label="对比方式" :label-width="labelWidth">
                    <el-select v-model="form.comparator" placeholder="请选择">
                        <el-option label="等于" value="equal"></el-option>
                        <el-option label="包含" value="contain"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="expected_value" label="期望值" :label-width="labelWidth">
                    <el-input v-model="form.expected_value" placeholder="请输入期望值"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancle('form')">取 消</el-button>
                <el-button type="primary" size="mini" @click="addStep('form', updateForm)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'UIStep',
    props: {
        value: Array,
        showBtn: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            steps: this.value,
            labelWidth: '100px',
            show: this.showBtn,
            dialogFormVisible: false,
            updateDialogFormVisible: false,
            form: {},
            updateForm: false,
            arrayIndex: null
        }
    },
    methods: {
        add() {
            this.dialogFormVisible = true
        },
        handleClose() {
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
        },
        cancle(formName) {
            this.$refs[formName].resetFields()
            this.dialogFormVisible = false
        },
        addStep(formName, edit) {
            if (!edit) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.steps.push(Object.assign({}, this.form))
                        this.dialogFormVisible = false
                        this.$refs[formName].resetFields()
                    } else {
                        return false
                    }
                })
            } else {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.steps[this.arrayIndex] = Object.assign({}, this.form)
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
        remove(item) {
            let index = this.steps.indexOf(item)
            if (index !== -1) {
                this.steps.splice(index, 1)
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
            this.steps = newValue
        }
    }
}
</script>

<style scoped>
.p_left {
    padding-left: 10px;
}
.ch-button >>> .el-button {
    padding: 0 !important;
}
.icon-size >>> .is-circle {
    padding: 0 !important;
    margin-left: -3%;
}
.dialog-header >>> .el-dialog__header {
    padding: 20px 20px 0 !important;
    height: 20px;
    text-align: left;
    line-height: 20px;
}
.select_class >>> .el-select {
    display: block !important;
}
.el-form__item >>> .el-form-item {
    margin-bottom: 18px !important;
}
</style>
