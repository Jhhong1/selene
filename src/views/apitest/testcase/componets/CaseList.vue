<template>
 <div>
   <router-link tag="el-button" :to="{name: 'AddApiCase', query: $route.query}" class="el-button--primary el-button--mini p-button">添加测试用例</router-link>
   <el-table class="table-class td" :data="dataTable">
     <el-table-column label="用例名称" min-width="200">
       <template slot-scope="scope">
         <router-link tag="el-button" :to="{name: 'ApiCaseDetail', params: {id: scope.row.id}, query: $route.query}" class="el-button--text">{{scope.row.name}}</router-link>
       </template>
     </el-table-column>
     <el-table-column label="请求地址" min-width="300">
       <template slot-scope="scope">
         <el-popover trigger="hover" placement="top-start">
           <p>{{ scope.row.url }}</p>
           <div slot="reference" class="name-wrapper">
             {{ scope.row.url }}
           </div>
         </el-popover>
       </template>
     </el-table-column>
     <el-table-column label="请求方法" min-width="150" prop="method"></el-table-column>
     <el-table-column label="状态" min-width="150">
       <template slot-scope="scope">
         <template v-if="scope.row.caserelationship">
           <template v-if="scope.row.caserelationship.status === 'Done'">
             <tag-done></tag-done>
           </template>
           <template v-else-if="scope.row.caserelationship.status === 'Starting'">
             <tag-running></tag-running>
           </template>
         </template>
         <template v-else>
           <tag-not-run></tag-not-run>
         </template>
       </template>
     </el-table-column>
     <el-table-column label="结果" min-width="50">
       <template slot-scope="scope">
         <template v-if="scope.row.caserelationship">
           <template v-if="scope.row.caserelationship.result === 'Failed'">
             <el-popover trigger="hover" placement="top-start">
               <p>{{scope.row.caserelationship.errorMessage}}</p>
               <div slot="reference">
                 <tag-failed></tag-failed>
               </div>
             </el-popover>
           </template>
           <template v-else-if="scope.row.caserelationship.result === 'Succeed'">
             <tag-success></tag-success>
           </template>
         </template>
         <template v-else>-</template>
       </template>
     </el-table-column>
     <el-table-column label="操作" min-width="150">
       <template slot-scope="scope">
         <el-button type="text" size="small" @click="deleteRow(scope.$index, dataTable, scope.row.id)">删除</el-button>
         <router-link tag="el-button" :to="{name: 'ApiCaseDetail', params: {id: scope.row.id}, query: $route.query}" class="el-button--text el-button--small">查看</router-link>
         <router-link tag="el-button" :to="{name: 'UpdateApiCase', params: {id: scope.row.id}, query: $route.query}" class="el-button--text el-button--small">更新</router-link>
         <el-button type="text" size="small" @click="execute(scope.row.id)">执行</el-button>
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
  name: 'CaseList',
  // inject: ['reload'],
  data () {
    return {
      dataTable: [],
      count: null,
      pageSizes: [10, 20, 50],
      pageSize: 10,
      currentPage: 1,
      projectName: this.$route.query.project_name
    }
  },
  methods: {
    getCases () {
      this.$api.api.testCaseList(this.currentPage, this.pageSize).then(
        (response) => {
          this.dataTable = response.data.results
          this.count = response.data.count
          // this.$store.commit('STORE_API_CASES', this.dataTable)
        }
      ).catch(
        (error) => {
          console.log(error)
        }
      )
    },
    removeCase (caseId) {
      this.$api.api.deleteCase(caseId).then(
        (response) => {
          this.$message({
            showClose: true,
            message: '删除用例成功',
            type: 'success'
          })
        }
      )
    },
    execute (caseId) {
      let data = {
        'level': 'case',
        'tasks': caseId
      }
      this.$api.api.executeCase(JSON.stringify(data), this.projectName).then((response) => {
      }).catch((error) => {
        console.log(error)
      })
    },
    deleteRow (index, rows, caseId) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '确定删除该条用例吗？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.removeCase(caseId)
            done()
          } else {
            done()
          }
        }
      }).then(() => {
        rows.splice(index, 1)
      }).catch(() => {})
    },
    currentChange (val) {
      this.currentPage = val
      this.getCases()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getCases()
    },
    timer () {
      return setTimeout(
        () => {
          this.getCases()
        }, 2000
      )
    }
  },
  created () {
    this.getCases()
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
.td >>> .name-wrapper {
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style>
.el-popover {
  max-width: 500px;
  max-height: 100px;
  word-break: break-word;
  background-color: #303133;
  color: white;
  padding: 0 10px 0 10px;
  font-size: 12px;
  overflow: auto;
}
.el-popper .popper__arrow{
  display: none;
}
</style>
