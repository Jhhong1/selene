<template>
  <div>
    <router-link tag="el-button" :to="{name: 'AddGlobalConfig', query: $route.query}" class="el-button--primary el-button--mini p-button">添加配置</router-link>
    <el-table class="table-class td" :data="dataTable">
      <el-table-column label="名称" min-width="150">
        <template slot-scope="scope">
          <router-link tag="el-button" :to="{name: 'GlobalConfigDetail', params: {id: scope.row.id}, query: $route.query}" class="el-button--text">{{scope.row.name}}</router-link>
          <template v-if="scope.row.globalConfig">
            &nbsp;<el-tag size="mini">全局变量</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="BaseURL" min-width="300" prop="baseurl"></el-table-column>
      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
         <el-button type="text" size="small" @click="deleteRow(scope.$index, dataTable, scope.row.id)">删除</el-button>
         <el-button type="text" size="small" @click="setGlobalConfig(scope.row.id)">设为全局变量</el-button>
         <router-link tag="el-button" :to="{name: 'GlobalConfigDetail', params: {id: scope.row.id}, query: $route.query}" class="el-button--text el-button--small">查看</router-link>
         <router-link tag="el-button" :to="{name: 'UpdateGlobalConfig', params: {id: scope.row.id}, query: $route.query}" class="el-button--text el-button--small">更新</router-link>
       </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination-class"
     background
     layout="total, sizes, prev, pager, next"
     :total="count"
     :page-sizes="pageSizes"
     :page-size="pageSize"
     :current-page="currentPage"
     @size-change="handleSizeChange"
     @current-change="currentChange">
   </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'GlobalConfigList',
  data () {
    return {
      dataTable: [],
      projectName: this.$route.query.project_name,
      count: null,
      pageSizes: [10, 20, 50],
      pageSize: 10,
      currentPage: 1,
      loading: true
    }
  },
  methods: {
    getConfigList () {
      let _this = this
      this.$api.api.getConfigList(_this.currentPage, _this.pageSize, _this.projectName).then(
        (response) => {
          _this.dataTable = response.data.results
          _this.count = response.data.count
        }
      ).catch(
        (error) => {
          console.log(error)
        }
      )
    },
    setGlobalConfig (configId) {
      let payload = {
        'config_id': configId
      }
      this.$api.api.setGlobalConfig(JSON.stringify(payload), this.projectName).then(
        (response) => {
        }
      ).catch(
        (error) => {
          console.log(error)
        }
      )
    },
    currentChange (val) {
      this.currentPage = val
      this.getConfigList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getConfigList()
    },
    removeConfig (configId) {
      this.$api.api.deleteConfig(configId, this.projectName).then(
        (response) => {
          this.$message({
            showClose: true,
            message: '删除配置成功',
            type: 'success'
          })
        }
      )
    },
    deleteRow (index, rows, configId) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '确定删除该条配置吗？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.removeConfig(configId)
            done()
          } else {
            done()
          }
        }
      }).then(() => {
        rows.splice(index, 1)
      }).catch(() => {})
    },
    timer () {
      return setTimeout(
        () => {
          this.getConfigList()
        }, 2000
      )
    }
  },
  created () {
    this.getConfigList()
  },
  watch: {
    dataTable () {
      this.timer()
    }
  },
  mounted () {
  },
  destroyed () {
    clearTimeout(this.timer())
  }
}
</script>

<style scoped>

</style>
