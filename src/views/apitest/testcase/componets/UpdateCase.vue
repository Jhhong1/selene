<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'ApiCaseList', query: $route.query }" class="is-link">接口测试用例</el-breadcrumb-item>
            <el-breadcrumb-item>更新</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="addCase" ref="addCase" :rules="rules" class="case-form">
            <el-form-item label="用例名称" :label-width="formLabelWidth" prop="name">
                <el-input readonly v-model="addCase.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="显示名称" :label-width="formLabelWidth" prop="display">
                <el-input v-model="addCase.display" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="请求地址" :label-width="formLabelWidth" prop="url">
                <el-input v-model="addCase.url" maxlength="255" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="请求方法" :label-width="formLabelWidth" prop="method">
                <el-select v-model="addCase.method" placeholder="请选择" class="method-class" size="mini">
                    <el-option label="POST" value="POST"></el-option>
                    <el-option label="GET" value="GET"></el-option>
                    <el-option label="PUT" value="PUT"></el-option>
                    <el-option label="DELETE" value="DELETE"></el-option>
                    <el-option label="PATCH" value="PATCH"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="变量" :label-width="formLabelWidth" prop="variables">
                <j-input v-model="addCase.variables"></j-input>
            </el-form-item>
            <!-- <el-form-item label="认证方式" :label-width="formLabelWidth" prop="authMethod">
                <el-row>
                    <el-col class="bg-purple-light" :span="3">类型</el-col>
                    <el-col class="bg-purple-light" :span="10">用户名</el-col>
                    <el-col class="bg-purple-light" :span="11">密码</el-col>
                </el-row>
                <el-row style="padding-left: 10px" :gutter="3">
                    <el-col :span="3" style="text-align: left">
                        {{ addCase.authMethod }}
                    </el-col>
                    <template v-if="addCase.auth">
                        <el-col :span="10">
                            <el-input size="mini" v-model="addCase.auth.username"></el-input>
                        </el-col>
                        <el-col :span="11">
                            <el-input size="mini" v-model="addCase.auth.password"></el-input>
                        </el-col>
                    </template>
                </el-row>
            </el-form-item> -->
            <el-form-item label="头部信息" :label-width="formLabelWidth" prop="headers">
                <j-input v-model="addCase.headers"></j-input>
            </el-form-item>
            <el-form-item label="请求内容" :label-width="formLabelWidth" prop="body">
                <j-editor v-model="addCase.body" mode="code"></j-editor>
            </el-form-item>
            <el-form-item label="结果断言" :label-width="formLabelWidth" prop="asserts">
                <j-assert v-model="addCase.asserts"></j-assert>
            </el-form-item>
            <el-form-item label="提取参数" :label-width="formLabelWidth" prop="extracts">
                <j-extract v-model="addCase.extracts"></j-extract>
            </el-form-item>
            <el-form-item label="超时时间" :label-width="formLabelWidth" prop="waitingTime">
                <el-input v-model.number="addCase.waitingTime" type="number" min="0" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="重试次数" :label-width="formLabelWidth" prop="cycle">
                <el-input v-model.number="addCase.cycle" type="number" min="0" size="mini"></el-input>
            </el-form-item>
            <!-- <el-form-item label="失败后是否继续" :label-width="formLabelWidth" prop="continues">
                <el-tooltip :content="'' + addCase.continues" placement="right-start" class="el--swith">
                    <el-switch v-model="addCase.continues" active-color="#13ce66" inactive-color="#dedfe0" @change="changeValue"></el-switch>
                </el-tooltip>
            </el-form-item> -->
            <el-form-item size="mini">
                <el-button type="info" plain @click="countermand('addCase')">取消</el-button>
                <el-button type="primary" plain @click="submit('addCase')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'updateCase',
    data() {
        const validateUrl = (rule, value, callback) => {
            try {
                // let strRegex = '^((https|http|ftp|rtsp|mms)?://)' +
                //   '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' + // ftp的user@
                //   '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
                //   '|' + // 允许IP和DOMAIN（域名）
                //   '([0-9a-z_!~*\'()-]+.)*' + // 域名- www.
                //   '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
                //   '[a-z]{2,6})' + // first level domain- .com or .museum
                //   '(:[0-9]{1,4})?' + // 端口- :80
                //   '((/?)|' + // a slash isn't required if there is no file name
                //   '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'
                // let strRegex = '^((https|http)?://)'
                // let urlRegex = new RegExp(strRegex)
                if (!value) {
                    callback(new Error('请输入请求地址'))
                } else {
                    // if (!urlRegex.test(value)) {
                    //   callback(new Error('请输入正确的请求地址'))
                    // } else {
                    //   callback()
                    // }
                    callback()
                }
            } catch (e) {}
        }
        const validateMethod = (rule, value, callback) => {
            try {
                if (!value) {
                    callback(new Error('请选择请求方法'))
                } else {
                    callback()
                }
            } catch (e) {}
        }
        return {
            formLabelWidth: '120px',
            responseData: [],
            addCase: {},
            rules: {
                url: [{ validator: validateUrl, required: true, trigger: 'blur' }],
                method: [{ validator: validateMethod, required: true, trigger: 'blur' }],
                cycle: [{ type: 'number', min: 0, message: '请输入大于等于0的整数', trigger: 'change' }],
                waitingTime: [{ type: 'number', min: 0, message: '请输入大于等于0的整数', trigger: 'change' }]
            }
        }
    },
    methods: {
        changeValue(val) {
            this.addCase.continues = val
        },
        caseDetail() {
            let caseId = this.$route.params.id
            this.$api.api
                .getCaseDetail(caseId)
                .then(response => {
                    this.addCase = response.data
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        countermand(formName) {
            this.$refs[formName].resetFields()
            this.$router.push({ name: 'ApiCaseList', query: this.$route.query })
            // this.$router.go(-1)
        },
        updateCase(params) {
            let caseId = this.$route.params.id
            this.$api.api
                .updateCase(caseId, params)
                .then(() => {
                    this.notify.success('更新用例成功')
                    this.$router.push({ name: 'ApiCaseDetail', params: { id: caseId }, query: this.$route.query })
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = this.addCase
                    if (!data.startRunTime) {
                        delete data['startRunTime']
                        delete data['endRunTime']
                    }
                    let payload = JSON.stringify(data)
                    this.updateCase(payload)
                } else {
                    return false
                }
            })
        }
    },
    created() {
        this.caseDetail()
    }
}
</script>

<style scoped>
.el-bread >>> .el-breadcrumb {
    line-height: 40px !important;
}
.is-link >>> .is-link {
    color: #409eff !important;
}
.case-form {
    border: 1px solid azure;
    margin: 20px 20px 0 20px;
    padding: 30px 40px 0 0;
    background-color: white;
}
.method-class {
    display: block;
}
.col-class {
    margin-top: 20px;
}
.el--swith {
    display: flex;
    height: 40px;
    line-height: 40px;
    width: 40px;
}
.condition >>> .el-input--mini {
    height: 28px !important;
}
.item__content >>> .el-form-item__content {
    line-height: 28px !important;
}
</style>
