<template>
    <div>
        <div class="top-box">
            <el-col :span="10" class="filter-box">
                <el-form :model="queryform" ref="queryform" :rules="rules">
                    <el-form-item label="测试任务:" :label-width="formlabel" prop="task">
                        <el-select v-model="queryform.task" placeholder="请选择测试任务" class="method-class" filterable @change="change" size="mini">
                            <el-option v-for="(task, index) in tasks" :label="task.name" :value="task.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务类型:" :label-width="formlabel" prop="category">
                        <el-select v-model="queryform.category" placeholder="请选择" class="method-class" size="mini" @change="selectChange">
                            <el-option label="api" value="api"></el-option>
                            <el-option label="ui" value="ui"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="运行结果:" :label-width="formlabel" prop="result">
                        <el-select v-model="queryform.result" placeholder="请选择" class="method-class" size="mini">
                            <el-option label="全部" value="all"></el-option>
                            <el-option label="成功" value="succeed"></el-option>
                            <el-option label="失败" value="failed"></el-option>
                            <el-option label="运行中" value="running"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-row class="cl-line-high row-class">
                            <el-col :span="4"></el-col>
                            <el-col :span="20">
                                <el-button type="primary" size="mini" @click="change">确定</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="14" v-loading="loading">
                <v-chart :options="polar" class="chart-pie echarts-div"></v-chart>
            </el-col>
        </div>
        <el-table class="table-class td" :data="sets">
            <el-table-column label="开始时间" min-width="200">
                <template slot-scope="scope">
                    <template v-if="scope.row.start_time">
                        {{ $moment(scope.row.start_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" min-width="200">
                <template slot-scope="scope">
                    <template v-if="scope.row.end_time">
                        {{ $moment(scope.row.end_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="状态" min-width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.status === 'Done'">
                        <tag-done></tag-done>
                    </template>
                    <template v-else-if="scope.row.status === 'Starting'">
                        <tag-running></tag-running>
                    </template>
                    <template v-else>
                        <tag-not-run></tag-not-run>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结果" min-width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.result === 'Succeed'">
                        <tag-success></tag-success>
                    </template>
                    <template v-else-if="scope.row.result === 'Failed'">
                        <tag-failed></tag-failed>
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="50">
                <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                        <span>
                            <i class="el-icon-more-outline rotating"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="{ type: 'view', id: scope.row.tasks, batch: scope.row.batch }">详情</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    name: 'ReportList',
    data() {
        const validatetask = (rule, value, callback) => {
            try {
                if (!value) {
                    callback(new Error('请选择测试任务'))
                } else {
                    callback()
                }
            } catch (error) {}
        }
        return {
            tasks: [],
            sets: [],
            taskId: '',
            queryform: {
                task: '',
                category: 'api',
                result: 'all'
            },
            formlabel: '90px',
            loading: true,
            projectName: this.$route.query.project_name,
            rules: {
                task: [{ validator: validatetask, required: true, trigger: 'blur' }]
            },
            polar: {
                // title: {
                //   text: '天气情况统计',
                //   left: 'center'
                // },
                legend: {
                    bottom: 50,
                    right: 5,
                    orient: 'vertical',
                    data: ['成功', '失败', '运行中']
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '50%'],
                        selectedMode: 'single',
                        label: {
                            show: true,
                            position: 'outside',
                            formatter: '{b} : {c} ({d}%)'
                        },
                        data: [],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        }
    },
    methods: {
        taskList() {
            this.$api.api
                .getTaskList(1, 1000, this.projectName, this.queryform.category)
                .then(response => {
                    this.tasks = response.data.results
                    if (this.tasks.length > 0) {
                        this.queryform.task = this.tasks[0].id
                        this.taskId = this.tasks[0].id
                    }
                })
                .catch(error => {
                    this.notify.error(error.response)
                })
        },
        selectChange(val) {
            this.queryform.category = val
            this.taskList()
        },
        change(id) {
            this.$refs['queryform'].validate(valid => {
                if (valid) {
                    this.$api.api
                        .resultStatics(id, this.queryform.result, this.projectName)
                        .then(response => {
                            const ret = response.data
                            this.sets = response.data.sets
                            const subdata = this.polar.series[0].data
                            let success = {
                                value: ret.success,
                                name: '成功',
                                itemStyle: {
                                    color: '#1bb393'
                                }
                            }
                            let failed = {
                                value: ret.failed,
                                name: '失败',
                                itemStyle: {
                                    color: 'red'
                                }
                            }
                            let r_run = {
                                value: ret.running,
                                name: '运行中',
                                itemStyle: {
                                    color: '#909399'
                                }
                            }
                            if (this.queryform.result === 'all') {
                                this.updateSub(subdata, success, failed, r_run)
                            } else if (this.queryform.result === 'succeed') {
                                this.updateSub(subdata, success)
                            } else if (this.queryform.result === 'failed') {
                                this.updateSub(subdata, failed)
                            } else if (this.queryform.result === 'running') {
                                this.updateSub(subdata, r_run)
                            }
                            this.loading = false
                        })
                        .catch(error => {
                            this.notify.error(error.response)
                        })
                } else {
                    this.loading = false
                }
            })
        },
        updateSub() {
            if (arguments.length > 1) {
                let dest = arguments[0]
                if (Array.isArray(dest)) {
                    if (dest.length > 0) {
                        dest.length = 0
                    }
                    for (let index = 1; index < arguments.length; index++) {
                        const element = arguments[index]
                        dest.push(element)
                    }
                }
            }
        },
        getTaskName(taskId) {
            for (let obj of this.tasks) {
                if (obj.id == taskId) {
                    return { name: obj.name, category: obj.category }
                }
            }
        },
        handleCommand(command) {
            if (command.type == 'view') {
                let obj = this.getTaskName(command.id)
                if (obj.category === 'api') {
                    this.$router.push({
                        name: 'TaskSetRecordDetail',
                        params: { name: obj.name, id: command.id, batch: command.batch },
                        query: this.$route.query
                    })
                } else if (obj.category === 'ui') {
                    this.$router.push({
                        name: 'UITaskSetRecord',
                        params: { name: obj.name, id: command.id, batch: command.batch },
                        query: this.$route.query
                    })
                }
            }
        }
    },
    mounted() {
        this.taskList()
    },
    watch: {
        taskId: function(newValue) {
            this.change(newValue)
        }
    }
}
</script>
<style scoped>
.top-box {
    background-color: #fff;
    height: 250px;
}
.filter-box {
    width: 290px;
    height: 250px;
    font-size: 12px;
    margin-top: 10px;
}
.chart-pie {
    width: 600px;
    height: 200px;
    margin-top: 3px;
    margin-left: -90px;
}
.echarts-div >>> .echarts:first-child {
    width: 600px;
}
.td >>> .cell {
    white-space: nowrap !important;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
