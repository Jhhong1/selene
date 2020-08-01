<template>
    <div class="bg-color">
        <el-row>
            <el-col :span="3">
                <div class="bg-purple-light">操作</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">浏览器名称</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">输入内容</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">策略</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">等待时长</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">判断条件</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">元素定位</div>
            </el-col>
            <el-col :span="5">
                <div class="bg-purple-light">元素值</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">期望值</div>
            </el-col>
        </el-row>
        <template v-if="steps && steps.length">
            <el-row v-for="(items, index) in steps" :key="index" class="asserts-row">
                <el-col :span="3">{{ items.action }}</el-col>
                <el-col :span="2">
                    <template v-if="items.browser">{{ items.browser }}</template>
                    <template v-else>
                        -
                    </template>
                </el-col>
                <el-col :span="2">
                    <template v-if="items.input">
                        <el-popover trigger="hover" placement="top-start">
                            <p>{{ items.input }}</p>
                            <div slot="reference" class="name-wrapper">
                                {{ items.input }}
                            </div>
                        </el-popover>
                    </template>
                    <template v-else>
                        -
                    </template>
                </el-col>
                <el-col :span="2" class="p_left">
                    <template v-if="items.strategy">
                        <el-popover trigger="hover" placement="top-start">
                            <p>{{ items.strategy }}</p>
                            <div slot="reference" class="name-wrapper">
                                {{ items.strategy }}
                            </div>
                        </el-popover>
                    </template>
                    <template v-else>
                        -
                    </template>
                </el-col>
                <el-col :span="2" class="p_left">
                    <template v-if="items.duration">
                        <el-popover trigger="hover" placement="top-start">
                            <p>{{ items.duration }}</p>
                            <div slot="reference" class="name-wrapper">
                                {{ items.duration }}
                            </div>
                        </el-popover>
                    </template>
                    <template v-else>
                        -
                    </template>
                </el-col>
                <el-col :span="2" class="p_left">
                    <template v-if="items.expected_condition">
                        <el-popover trigger="hover" placement="top-start">
                            <p>{{ items.expected_condition }}</p>
                            <div slot="reference" class="name-wrapper">
                                {{ items.expected_condition }}
                            </div>
                        </el-popover>
                    </template>
                    <template v-else>
                        -
                    </template>
                </el-col>
                <el-col :span="2" class="p_left">
                    <template v-if="items.locator_strategy || items.locator_strategy === 0">
                        <el-popover trigger="hover" placement="top-start">
                            <p>{{ items.locator_strategy }}</p>
                            <div slot="reference" class="name-wrapper">
                                {{ items.locator_strategy }}
                            </div>
                        </el-popover>
                    </template>
                    <template v-else>
                        -
                    </template>
                </el-col>
                <el-col :span="5" class="p_left">
                    <template v-if="items.locator_value">
                        <el-popover trigger="hover" placement="top-start">
                            <p>{{ items.locator_value }}</p>
                            <div slot="reference" class="name-wrapper">
                                {{ items.locator_value }}
                            </div>
                        </el-popover>
                    </template>
                    <template v-else>
                        -
                    </template>
                </el-col>
                <template v-if="show">
                    <el-col :span="2" class="p_left">
                        <template v-if="items.expected_value">
                            <el-popover trigger="hover" placement="top-start">
                                <p>{{ items.expected_value }}</p>
                                <div slot="reference" class="name-wrapper">
                                    {{ items.expected_value }}
                                </div>
                            </el-popover>
                        </template>
                        <template v-else>
                            -
                        </template>
                    </el-col>
                    <el-col :span="1" style="text-align: right" class="icon-size">
                        <el-button icon="el-icon-minus" circle @click="remove(items)"></el-button>
                    </el-col>
                    <el-col :span="1" style="padding-left: 10px" class="icon-size">
                        <el-button icon="el-icon-edit-outline" circle @click="update(items, index)"></el-button>
                    </el-col>
                </template>
                <template v-else>
                    <el-col :span="4" class="p_left">
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
                        <el-option label="点击" value="click"></el-option>
                        <el-option label="等待" value="wait"></el-option>
                        <el-option label="输入" value="input"></el-option>
                        <el-option label="滚动页面" value="scroll"></el-option>
                        <el-option label="打开浏览器" value="open_browser"></el-option>
                        <el-option label="关闭浏览器" value="close"></el-option>
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
                    <el-form-item
                        prop="input"
                        label="输入内容"
                        :label-width="labelWidth"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                        <el-input v-model="form.input" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </template>
                <template v-else-if="form.action === 'wait'">
                    <el-form-item
                        prop="strategy"
                        label="策略"
                        :label-width="labelWidth"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                        <el-select v-model="form.strategy" placeholder="请选择">
                            <el-option label="显示等待" value="explicit"></el-option>
                            <el-option label="强制等待" value="sleep"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        prop="duration"
                        label="等待时长"
                        :label-width="labelWidth"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                        <el-input v-model.number="form.duration" type="number" min="0" placeholder="请输入正整数"></el-input>
                    </el-form-item>
                    <template v-if="form.strategy === 'explicit'">
                        <el-form-item
                            prop="expected_condition"
                            label="判断条件"
                            :label-width="labelWidth"
                            :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                        >
                            <el-select v-model="form.expected_condition" filterable placeholder="请选择">
                                <el-option label="title_is" value="title_is"></el-option>
                                <el-option label="title_contains" value="title_contains"></el-option>
                                <el-option label="presence_of_element_located" value="presence_of_element_located"></el-option>
                                <el-option label="url_contains" value="url_contains"></el-option>
                                <el-option label="url_matches" value="url_matches"></el-option>
                                <el-option label="url_to_be" value="url_to_be"></el-option>
                                <el-option label="url_changes" value="url_changes"></el-option>
                                <el-option label="visibility_of_element_located" value="visibility_of_element_located"></el-option>
                                <el-option label="visibility_of" value="visibility_of"></el-option>
                                <el-option label="presence_of_all_elements_located" value="presence_of_all_elements_located"></el-option>
                                <el-option label="visibility_of_any_elements_located" value="visibility_of_any_elements_located"></el-option>
                                <el-option label="visibility_of_all_elements_located" value="visibility_of_all_elements_located"></el-option>
                                <el-option label="text_to_be_present_in_element" value="text_to_be_present_in_element"></el-option>
                                <el-option label="text_to_be_present_in_element_value" value="text_to_be_present_in_element_value"></el-option>
                                <el-option label="invisibility_of_element_located" value="invisibility_of_element_located"></el-option>
                                <el-option label="element_to_be_clickable" value="element_to_be_clickable"></el-option>
                                <el-option label="staleness_of" value="staleness_of"></el-option>
                                <el-option label="element_to_be_selected" value="element_to_be_selected"></el-option>
                                <el-option label="element_located_to_be_selected" value="element_located_to_be_selected"></el-option>
                                <el-option label="element_selection_state_to_be" value="element_selection_state_to_be"></el-option>
                                <el-option label="element_located_selection_state_to_be" value="element_located_selection_state_to_be"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="locator_strategy" label="元素定位" :label-width="labelWidth">
                            <strategy :value="form.locator_strategy" @change="handleChange"></strategy>
                        </el-form-item>
                        <el-form-item prop="locator_value" label="元素值" :label-width="labelWidth">
                            <el-input v-model="form.locator_value" placeholder="请输入元素值"></el-input>
                        </el-form-item>
                        <el-form-item prop="expected_value" label="期望值" :label-width="labelWidth">
                            <el-input v-model="form.expected_value" placeholder="请输入期望值"></el-input>
                        </el-form-item>
                    </template>
                </template>
                <template v-else-if="form.action === 'input'">
                    <el-form-item
                        prop="locator_strategy"
                        label="元素定位"
                        :label-width="labelWidth"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                        <strategy :value="form.locator_strategy" @change="handleChange"></strategy>
                    </el-form-item>
                    <el-form-item
                        prop="locator_value"
                        label="元素值"
                        :label-width="labelWidth"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                        <el-input v-model="form.locator_value" placeholder="请输入元素值"></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="input"
                        label="输入内容"
                        :label-width="labelWidth"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                        <el-input v-model="form.input" placeholder="请输入内容"></el-input>
                    </el-form-item>
                </template>
                <template v-else-if="form.action === 'click'">
                    <el-form-item
                        prop="locator_strategy"
                        label="元素定位"
                        :label-width="labelWidth"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                        <strategy :value="form.locator_strategy" @change="handleChange"></strategy>
                    </el-form-item>
                    <el-form-item
                        prop="locator_value"
                        label="元素值"
                        :label-width="labelWidth"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                        <el-input v-model="form.locator_value" placeholder="请输入元素值"></el-input>
                    </el-form-item>
                </template>
                <template v-else-if="form.action === 'scroll'">
                    <el-form-item
                        prop="strategy"
                        label="策略"
                        :label-width="labelWidth"
                        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                    >
                        <el-select v-model="form.strategy" placeholder="请选择">
                            <el-option label="按像素滚动" value="scroll_by"></el-option>
                            <el-option label="滚动至元素可见" value="scroll_into_view"></el-option>
                        </el-select>
                    </el-form-item>
                    <template v-if="form.strategy === 'scroll_into_view'">
                        <el-form-item
                            prop="locator_strategy"
                            label="元素定位"
                            :label-width="labelWidth"
                            :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                        >
                            <strategy :value="form.locator_strategy" @change="handleChange"></strategy>
                        </el-form-item>
                        <el-form-item
                            prop="locator_value"
                            label="元素值"
                            :label-width="labelWidth"
                            :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                        >
                            <el-input v-model="form.locator_value" placeholder="请输入元素值"></el-input>
                        </el-form-item>
                    </template>
                    <template v-else-if="form.strategy === 'scroll_by'">
                        <el-form-item
                            prop="locator_strategy"
                            label="横坐标"
                            :label-width="labelWidth"
                            :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                        >
                            <el-input v-model.number="form.locator_strategy" type="number" placeholder="请输入整数"></el-input>
                        </el-form-item>
                        <el-form-item
                            prop="locator_value"
                            label="纵坐标"
                            :label-width="labelWidth"
                            :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
                        >
                            <el-input v-model.number="form.locator_value" type="number" placeholder="请输入整数"></el-input>
                        </el-form-item>
                    </template>
                </template>
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
            form: {
                locator_strategy: ''
            },
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
        handleChange(event) {
            console.log(event)
            this.form.locator_strategy = event
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
                        if (this.form.action !== 'open_browser') {
                            if (this.form.hasOwnProperty('browser')) {
                                delete this.form.browser
                            }
                            if (this.form.hasOwnProperty('url')) {
                                delete this.form.url
                            }
                        }
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
