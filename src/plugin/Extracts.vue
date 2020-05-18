<template>
    <div class="bg-color">
        <el-row>
            <el-col :span="4">
                <div class="bg-purple-light">变量名</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">取值对象</div>
            </el-col>
            <el-col :span="2">
                <div class="bg-purple-light">索引值</div>
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
            <el-col :span="1" class="bg-purple-light"></el-col>
            <el-col :span="1" class="bg-purple-light"></el-col>
        </el-row>
        <template v-if="extracts !== undefined && extracts.length">
            <el-row v-for="(items, index) in extracts" :key="index" class="asserts-row">
                <el-col :span="4">
                    {{ items.name }}
                </el-col>
                <el-col :span="4">
                    <template v-if="items.select == 'text'">
                        响应文本
                    </template>
                    <template v-if="items.select == 'response_header'">
                        响应头
                    </template>
                    <template v-if="items.select == 'request_history'">
                        请求历史
                    </template>
                    <template v-if="items.select == 'request_url'">
                        请求地址
                    </template>
                </el-col>
                <template v-if="items.index">
                    <el-col :span="2" class="c-text">
                        {{ items.index }}
                    </el-col>
                </template>
                <template v-else>
                    <el-col :span="2" class="c-text">-</el-col>
                </template>
                <el-col :span="2" class="c-text">
                    {{ items.match_type }}
                </el-col>
                <el-col :span="6" class="c-text">
                    <template v-if="items.expression">
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
                    </template>
                    <template v-else>
                        -
                    </template>
                </el-col>
                <template v-if="items.group">
                    <el-col :span="2" class="c-text">
                        {{ items.group }}
                    </el-col>
                </template>
                <template v-else>
                    <el-col :span="2" class="c-text">-</el-col>
                </template>
                <template v-if="items.match_no">
                    <el-col :span="2" class="c-text">
                        {{ items.match_no }}
                    </el-col>
                </template>
                <template v-else>
                    <el-col :span="2" class="c-text">-</el-col>
                </template>
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
            </el-row>
        </template>
        <template v-else>
            <el-row class="no-data-show">
                <el-col>无数据</el-col>
            </el-row>
        </template>
        <el-row v-if="show">
            <el-col :span="24" class="col-class ch-button"
                ><el-button type="text" @click="add" class="add-class el-col-24" icon="el-icon-circle-plus-outline">添加</el-button></el-col
            >
        </el-row>
        <!--添加提取参数弹窗-->
        <el-dialog
            title="新增提取参数"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            :before-close="handleClose"
            class="dialog-header"
        >
            <el-form :model="extractForm" ref="extractForm" :hide-required-asterisk="true" class="select_class el-form__item">
                <el-form-item label="变量名" prop="name" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                    <el-input v-model="extractForm.name"></el-input>
                </el-form-item>
                <el-form-item label="取值对象" prop="select" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                    <el-select v-model="extractForm.select" placeholder="请选择">
                        <el-option label="响应文本" value="text"></el-option>
                        <el-option label="响应头" value="response_header"></el-option>
                        <el-option label="请求历史" value="request_history"></el-option>
                        <el-option label="请求地址" value="request_url"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="extractForm.select == 'request_history'">
                    <el-form-item label="索引值" prop="index" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                        <el-input v-model="extractForm.index" type="number" min="0"></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="提取方式" prop="match_type" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                    <el-select v-model="extractForm.match_type" placeholder="请选择">
                        <el-option label="json路径" value="json"></el-option>
                        <el-option label="正则表达式" value="regular"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="extractForm.match_type === 'json'">
                    <el-form-item label="表达式" prop="expression" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                        <el-input v-model="extractForm.expression" placeholder="请输入json路径,格式为: $.data\[[\w.-]\]+"></el-input>
                    </el-form-item>
                </template>
                <template v-if="extractForm.match_type === 'regular'">
                    <el-form-item label="表达式" prop="expression" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                        <el-input v-model="extractForm.expression"></el-input>
                    </el-form-item>
                    <el-form-item label="匹配组" prop="group" :label-width="labelWidth">
                        <el-input v-model="extractForm.group" type="number" min="0"></el-input>
                    </el-form-item>
                    <el-form-item label="匹配数字" prop="match_no" :label-width="labelWidth">
                        <el-input v-model="extractForm.match_no" type="number" min="0"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancel('extractForm')">
                    取 消
                </el-button>
                <el-button type="primary" size="mini" @click="addExtract('extractForm', updateForm)">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Extracts',
    props: {
        value: {
            type: Array,
            default: function() {
                return []
            }
        },
        edit: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            extracts: this.value,
            show: this.edit,
            dialogFormVisible: false,
            labelWidth: '100px',
            updateForm: false,
            extractIndex: null,
            extractForm: {}
        }
    },
    methods: {
        add() {
            this.dialogFormVisible = true
        },
        remove(item) {
            let index = this.extracts.indexOf(item)
            if (index !== -1) {
                this.extracts.splice(index, 1)
            }
        },
        cancel(formName) {
            this.dialogFormVisible = false
            this.$refs[formName].resetFields()
        },
        handleClose() {
            this.dialogFormVisible = false
            this.$refs['extractForm'].resetFields()
        },
        addExtract(formName, updateForm) {
            if (!updateForm) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.extracts.push(Object.assign({}, this.extractForm))
                        this.$refs[formName].resetFields()
                        this.dialogFormVisible = false
                    } else {
                        return false
                    }
                })
            } else {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.extracts[this.extractIndex] = Object.assign({}, this.extractForm)
                        this.$refs[formName].resetFields()
                        this.dialogFormVisible = false
                        this.updateForm = false
                        this.extractIndex = null
                    } else {
                        return false
                    }
                })
            }
        },
        update(items, index) {
            this.dialogFormVisible = true
            this.updateForm = true
            this.extractForm = Object.assign({}, items)
            this.extractIndex = index
        }
    },
    watch: {
        value: function(newValue) {
            // console.log('asserts: ', newValue)
            this.extracts = newValue
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
