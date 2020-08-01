<template>
    <div class="bg-color">
        <el-row>
            <template v-if="cate === 'api'">
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
            </template>
            <template v-else-if="cate === 'ui'">
                <el-col :span="4">
                    <div class="bg-purple-light">代理类型</div>
                </el-col>
                <el-col :span="4">
                    <div class="bg-purple-light">用户名</div>
                </el-col>
                <el-col :span="4">
                    <div class="bg-purple-light">密码</div>
                </el-col>
                <el-col :span="6">
                    <div class="bg-purple-light">IP地址</div>
                </el-col>
                <el-col :span="6">
                    <div class="bg-purple-light">端口</div>
                </el-col>
            </template>
        </el-row>
        <template v-if="proxies !== undefined && proxies.length">
            <el-row v-for="(items, index) in proxies" :key="index" class="asserts-row">
                <template v-if="cate === 'api'">
                    <el-col :span="4">{{ items.protocol }}</el-col>
                    <el-col :span="4">{{ items.scheme }}</el-col>
                    <el-col :span="4">{{ items.username }}</el-col>
                    <el-col :span="4">
                        <template v-if="items.password">
                            <template v-if="items.password.length > 20">
                                <el-popover trigger="hover" placement="top-start">
                                    <p>{{ items.password }}</p>
                                    <div slot="reference" class="name-wrapper">
                                        {{ items.password }}
                                    </div>
                                </el-popover>
                            </template>
                            <template v-else>
                                {{ items.password }}
                            </template>
                        </template>
                    </el-col>
                    <el-col :span="4">{{ items.ip }}</el-col>
                    <template v-if="show">
                        <el-col :span="2" class="c-text">{{ items.port }}</el-col>
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
                        <el-col :span="4" class="c-text">{{ items.port }}</el-col>
                    </template>
                </template>
                <template v-else-if="cate === 'ui'">
                    <el-col :span="4">{{ items.protocol }}</el-col>
                    <el-col :span="4">
                        <template v-if="items.username">
                            {{ items.username }}
                        </template>
                        <template v-else>
                            -
                        </template>
                    </el-col>
                    <el-col :span="4">
                        <template v-if="items.password">
                            <template v-if="items.password.length > 20">
                                <el-popover trigger="hover" placement="top-start">
                                    <p>{{ items.password }}</p>
                                    <div slot="reference" class="name-wrapper">
                                        {{ items.password }}
                                    </div>
                                </el-popover>
                            </template>
                            <template v-else>
                                {{ items.password }}
                            </template>
                        </template>
                        <template v-else>
                            -
                        </template>
                    </el-col>
                    <el-col :span="6">{{ items.ip }}</el-col>
                    <template v-if="show">
                        <el-col :span="4" class="c-text">{{ items.port }}</el-col>
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
                        <el-col :span="6" class="c-text">{{ items.port }}</el-col>
                    </template>
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
        <el-dialog title="添加代理" :visible.sync="dialogFormVisible" :close-on-click-modal="false" class="dialog-header" :before-close="handleClose">
            <el-form :model="form" ref="form" :hide-required-asterisk="true" class="select_class el-form__item">
                <el-form-item prop="protocol" label="代理类型" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                    <template v-if="cate === 'api'">
                        <el-select v-model="form.protocol" placeholder="请选择" size="mini">
                            <el-option label="http" value="http"></el-option>
                            <el-option label="https" value="https"></el-option>
                        </el-select>
                    </template>
                    <template v-else-if="cate === 'ui'">
                        <el-select v-model="form.protocol" placeholder="请选择" size="mini">
                            <el-option label="http_proxy" value="http_proxy"></el-option>
                            <el-option label="ssl_proxy" value="ssl_proxy"></el-option>
                            <el-option label="socks_proxy" value="socks_proxy"></el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <template v-if="cate === 'api'">
                    <el-form-item prop="scheme" label="scheme" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                        <el-select v-model="form.scheme" placeholder="请选择" size="mini">
                            <el-option label="http" value="http"></el-option>
                            <el-option label="https" value="https"></el-option>
                            <el-option label="socks5" value="socks5"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item label="用户名" prop="username" :label-width="labelWidth">
                    <el-input v-model="form.username" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" :label-width="labelWidth">
                    <el-input v-model="form.password" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="IP地址" prop="ip" :label-width="labelWidth" :rules="[{ required: true, message: '必填' }]">
                    <el-input v-model="form.ip" size="mini"></el-input>
                </el-form-item>
                <el-form-item
                    label="端口"
                    prop="port"
                    :label-width="labelWidth"
                    :rules="[
                        { required: true, message: '必填', trigger: 'blur' },
                        { type: 'number', min: 0, max: 65535, message: '端口范围: 0~65535', trigger: 'blur' }
                    ]"
                >
                    <el-input v-model.number="form.port" size="mini"></el-input>
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
        },
        category: String
    },
    data() {
        return {
            show: this.showBtn,
            cate: this.category,
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
        },
        category: function(newValue) {
            this.cate = newValue
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
