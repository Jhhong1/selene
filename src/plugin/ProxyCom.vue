<template>
    <div class="bg-color">
        <el-row>
            <el-col :span="4">
                <div class="bg-purple-light">代理类型</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">scheme</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">用户名</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">密码</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">IP地址</div>
            </el-col>
            <el-col :span="4">
                <div class="bg-purple-light">端口</div>
            </el-col>
        </el-row>
        <template v-if="proxies !== undefined && proxies.length">
            <el-row v-for="(items, index) in proxies" :key="index" class="asserts-row">
                <el-col :span="4">{{ items.protocol }}</el-col>
                <el-col :span="4">{{ items.scheme }}</el-col>
                <el-col :span="4">{{ items.username }}</el-col>
                <el-col :span="4">
                    <el-tooltip placement="top-start">
                        <div slot="content">{{ items.password }}</div>
                        <el-button type="text" size="mini" plain class="el-button__text is-plain">
                            {{ items.password }}
                        </el-button>
                    </el-tooltip>
                </el-col>
                <el-col :span="4">{{ items.ip }}</el-col>
                <template v-if="show">
                    <el-col :span="2" class="c-text">{{ items.port }}</el-col>
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
                </template>
                <template v-else>
                    <el-col :span="4" class="c-text">{{ items.port }}</el-col>
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
                <el-col :span="24" class="col-class">
                    <el-button type="text" class="add-class el-col-24" icon="el-icon-circle-plus-outline" @click="add">添加</el-button>
                </el-col>
            </el-row>
        </template>
        <el-dialog title="添加代理" :visible.sync="dialogFormVisible" :close-on-click-modal="false" class="dialog-header" :before-close="handleClose">
            <el-form :model="form" ref="form" :hide-required-asterisk="true">
                <el-form-item
                    prop="protocol"
                    label="代理类型"
                    :label-width="labelWidth"
                    class="el-form__item"
                    :rules="[{ required: true, message: '必填' }]"
                >
                    <el-select v-model="form.protocol" placeholder="请选择" class="select_class">
                        <el-option label="http" value="http"></el-option>
                        <el-option label="https" value="https"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="scheme"
                    label="scheme"
                    :label-width="labelWidth"
                    class="el-form__item"
                    :rules="[{ required: true, message: '必填' }]"
                >
                    <el-select v-model="form.scheme" placeholder="请选择" class="select_class">
                        <el-option label="http" value="http"></el-option>
                        <el-option label="https" value="https"></el-option>
                        <el-option label="socks5" value="socks5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="用户名"
                    prop="username"
                    :label-width="labelWidth"
                    class="el-form__item"
                    :rules="[{ required: true, message: '必填' }]"
                >
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item
                    label="密码"
                    prop="password"
                    :label-width="labelWidth"
                    class="el-form__item"
                    :rules="[{ required: true, message: '必填' }]"
                >
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="IP地址" prop="ip" :label-width="labelWidth" class="el-form__item" :rules="[{ required: true, message: '必填' }]">
                    <el-input v-model="form.ip"></el-input>
                </el-form-item>
                <el-form-item
                    label="端口"
                    prop="port"
                    :label-width="labelWidth"
                    class="el-form__item"
                    :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { type: 'number', min: 0, max: 65535, message: '端口范围: 0~65535', trigger: 'blur' }
                    ]"
                >
                    <el-input v-model.number="form.port"></el-input>
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
    name: 'ProxyCom',
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
            proxies: this.value,
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
                        this.proxies.push(Object.assign({}, this.form))
                        this.dialogFormVisible = false
                        this.$refs[formName].resetFields()
                    } else {
                        return false
                    }
                })
            } else {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.proxies[this.arrayIndex] = Object.assign({}, this.form)
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
            let index = this.proxies.indexOf(item)
            if (index !== -1) {
                this.proxies.splice(index, 1)
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
            this.proxies = newValue
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
.is-plain:focus,
.is-plain:hover {
    color: #606266;
    border-color: white;
}
</style>
