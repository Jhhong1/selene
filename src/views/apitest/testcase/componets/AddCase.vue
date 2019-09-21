<template>
    <div>
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'ApiCaseList', query: $route.query }" class="is-link">接口测试用例</el-breadcrumb-item>
            <el-breadcrumb-item>添加测试用例</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="addCase" ref="addCase" :rules="rules" class="case-form">
            <el-form-item label="用例名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="addCase.name" size="mini"></el-input>
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
                <j-input v-model="addCase.variables" size="mini"></j-input>
            </el-form-item>
            <el-form-item label="认证方式" :label-width="formLabelWidth" prop="authMethod">
                <el-row>
                    <el-col class="bg-purple-light" :span="3">类型</el-col>
                    <el-col class="bg-purple-light" :span="10">用户名</el-col>
                    <el-col class="bg-purple-light" :span="11">密码</el-col>
                </el-row>
                <el-row style="padding-left: 10px" :gutter="3">
                    <el-col :span="3" style="text-align: left">
                        {{ addCase.authMethod }}
                    </el-col>
                    <el-col :span="10">
                        <el-input size="mini" v-model="addCase.auth.username"></el-input>
                    </el-col>
                    <el-col :span="11">
                        <el-input size="mini" v-model="addCase.auth.password"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="头部信息" :label-width="formLabelWidth" prop="headers">
                <j-input v-model="addCase.headers" size="mini"></j-input>
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
                <el-input v-model="addCase.waitingTime" maxlength="5" type="number" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="重试次数" :label-width="formLabelWidth" prop="cycle">
                <el-input v-model="addCase.cycle" type="number" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="失败后是否继续" :label-width="formLabelWidth" prop="continues">
                <el-tooltip :content="addCase.continues" placement="right-start" class="el--swith">
                    <el-switch
                        v-model="addCase.continues"
                        active-color="#13ce66"
                        inactive-color="#dedfe0"
                        active-value="true"
                        inactive-value="false"
                    ></el-switch>
                </el-tooltip>
            </el-form-item>
            <el-form-item size="mini">
                <el-button type="info" plain @click="countermand('addCase')" size="mini">取消</el-button>
                <el-button type="primary" plain @click="submit('addCase')" size="mini">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'AddCase',
    data() {
        const validateCaseName = (rule, value, callback) => {
            try {
                const passregex = /^[a-z]+[a-z0-9_-]*$/
                if (!value) {
                    callback(new Error('请输入用例名称'))
                } else {
                    if (!passregex.test(value)) {
                        callback(new Error('用例名称必须以小写字母开头，包含小写字母、数字、下划线、中横线'))
                    } else {
                        if (value.length < 6 || value.length > 20) {
                            callback(new Error('用例名称长度不得少于6位，大于20位'))
                        } else {
                            callback()
                        }
                    }
                }
            } catch (e) {}
        }
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
                    callback()
                }
                // } else {
                //   if (!urlRegex.test(value)) {
                //     callback(new Error('请输入正确的请求地址'))
                //   } else {
                //     callback()
                //   }
                // }
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
            projectName: this.$route.query.project_name,
            casesDate: [],
            addCase: {
                name: '',
                url: '',
                method: '',
                variables: {},
                authMethod: 'BasicAuth',
                auth: {},
                headers: {},
                body: {},
                asserts: [],
                extracts: [],
                continues: ''
            },
            rules: {
                name: [{ validator: validateCaseName, required: true, trigger: 'blur' }],
                url: [{ validator: validateUrl, required: true, trigger: 'blur' }],
                method: [{ validator: validateMethod, required: true, trigger: 'blur' }]
            }
        }
    },
    methods: {
        countermand(formName) {
            this.$refs[formName].resetFields()
            // this.$router.push({name: 'TestCase'})
            this.$router.go(-1)
        },
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = this.addCase
                    if (data.asserts.length) {
                        for (let i = 0, len = data.asserts.length; i < len; i++) {
                            let assert = data.asserts[i]
                            if (!assert.select) {
                                data.asserts.splice(i, 1)
                            }
                        }
                    }
                    data.project = this.projectName
                    let payload = JSON.stringify(data)
                    console.log('create test case: ', payload)
                    this.create(payload)
                } else {
                    return false
                }
            })
        },
        create(params) {
            this.$api.api
                .createTestCase(params)
                .then(() => {
                    this.notify.success('添加用例成功')
                    this.$refs['addCase'].resetFields()
                    this.$router.go(-1)
                })
                .catch(error => {
                    this.notify.error(error.response.request.responseText)
                })
        }
    },
    mounted() {}
}
</script>

<style scoped>
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
