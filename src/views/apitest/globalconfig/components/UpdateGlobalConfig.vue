<template>
  <div>
    <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{name: 'GlobalConfigList', query: $route.query}" class="is-link">配置</el-breadcrumb-item>
      <el-breadcrumb-item>更新</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="configForm" ref="configForm" :rules="rules" class="case-form">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
        <el-input readonly v-model="configForm.name" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="BaseURL" :label-width="formLabelWidth" prop="url">
        <el-input v-model="configForm.baseurl" maxlength="255" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="头部信息" :label-width="formLabelWidth" prop="variables">
        <input-counter v-model="configForm.headers"></input-counter>
      </el-form-item>
      <el-form-item label="认证方式" :label-width="formLabelWidth" prop="authMethod">
        <el-row>
          <el-col class="bg-purple-light" :span="3">类型</el-col>
          <el-col class="bg-purple-light" :span="10">用户名</el-col>
          <el-col class="bg-purple-light" :span="11">密码</el-col>
        </el-row>
        <el-row style="padding-left: 10px" :gutter="3">
          <el-col :span="3" style="text-align: left">
            {{configForm.authMethod}}
          </el-col>
          <template v-if="configForm.auth">
            <el-col :span="10">
              <el-input size="mini" v-model="configForm.auth.username"></el-input>
            </el-col>
            <el-col :span="11">
              <el-input size="mini" v-model="configForm.auth.password"></el-input>
            </el-col>
          </template>
        </el-row>
      </el-form-item>
      <el-form-item label="变量" :label-width="formLabelWidth" prop="headers">
        <input-counter v-model="configForm.variables"></input-counter>
      </el-form-item>
      <el-form-item label="设为全局变量" :label-width="formLabelWidth" prop="globalConfig">
        <el-tooltip :content=" '' + configForm.globalConfig" placement="right-start" class="el--swith">
          <el-switch v-model="configForm.globalConfig" active-color="#13ce66" inactive-color="#dedfe0" @change="changeValue"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="info" plain @click="countermand">取消</el-button>
        <el-button type="primary" plain @click="submit('configForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import InputCounter from '@/plugin/Input'
export default {
  name: 'UpdateGlobalConfig',
  components: {
    InputCounter
  },
  data () {
    const validateUrl = (rule, value, callback) => {
      try {
        let strRegex = '^((https|http)?://)'
        let urlRegex = new RegExp(strRegex)
        if (!value) {
          callback(new Error('请输入请求地址'))
        } else {
          if (!urlRegex.test(value)) {
            callback(new Error('请输入正确的请求地址'))
          } else {
            callback()
          }
        }
      } catch (e) {}
    }
    return {
      configId: this.$route.params.id,
      projectName: this.$route.query.project_name,
      formLabelWidth: '120px',
      configForm: {},
      rules: {
        baseurl: [
          { validator: validateUrl, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    changeValue (val) {
      this.configForm.globalConfig = val
    },
    countermand () {
      this.$router.go(-1)
    },
    getConfigDetail () {
      let _this = this
      this.$api.api.getConfigDetail(_this.configId, _this.projectName).then(
        (response) => {
          _this.configForm = response.data
        }
      ).catch(
        (error) => {
          console.log(error)
        }
      )
    },
    updateConfig (configId, params, project) {
      this.$api.api.updateConfig(configId, params, project).then(
        (response) => {
          this.$message({
            showClose: true,
            message: '更新配置成功',
            type: 'success'
          })
          this.$router.push({ name: 'GlobalConfigList', params: { id: configId }, query: this.$route.query })
        }
      ).catch(
        (error) => {
          this.$message.error(error.response.request.responseText)
        }
      )
    },
    submit (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let payload = JSON.stringify(_this.configForm)
          this.updateConfig(_this.configId, payload, _this.projectName)
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.getConfigDetail()
  },
  mounted () {}
}
</script>

<style scoped>
.is-link >>> .is-link {
  color: #409EFF !important;
}
</style>
