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
                    <el-form-item label="运行结果:" :label-width="formlabel" prop="result">
                        <el-select v-model="queryform.result" placeholder="请选择" class="method-class" size="mini">
                            <el-option label="全部" value="all"></el-option>
                            <el-option label="成功" value="succeed"></el-option>
                            <el-option label="失败" value="failed"></el-option>
                            <el-option label="未执行" value="not_run"></el-option>
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
            <el-table-column label="名称" min-width="100">
                <template slot-scope="scope">
                    <ul class="ul-style">
                        <li>
                            {{ scope.row.testset__name }}
                        </li>
                        <li class="text-style">
                            <template v-if="scope.row.testset__display">
                                <template v-if="scope.row.testset__display.length > 30">
                                    <el-popover trigger="hover" placement="top-start">
                                        <p>{{ scope.row.testset__display }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            {{ scope.row.testset__display }}
                                        </div>
                                    </el-popover>
                                </template>
                                <template v-else>
                                    {{ scope.row.testset__display }}
                                </template>
                            </template>
                        </li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column label="结果" min-width="50">
                <template slot-scope="scope">
                    <template v-if="scope.row.result === 'Succeed'">
                        <tag-success></tag-success>
                    </template>
                    <template v-else-if="scope.row.result === 'Failed'">
                        <tag-failed></tag-failed>
                    </template>
                    <template v-else>
                        <tag-not-run></tag-not-run>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="开始时间" min-width="60">
                <template slot-scope="scope">
                    <template v-if="scope.row.startRunTime">
                        {{ $moment(scope.row.startRunTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" min-width="60">
                <template slot-scope="scope">
                    <template v-if="scope.row.endRunTime">
                        {{ $moment(scope.row.endRunTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                    <template v-else>
                        -
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="失败原因" min-width="100" prop="errorMessage"></el-table-column>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    {{ scope.row.errorMessage }}
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
            queryform: {
                task: '',
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
                    data: ['成功', '失败', '未执行']
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
                .getTaskList(1, 1000, this.projectName)
                .then(response => {
                    this.tasks = response.data.results
                    if (this.tasks.length > 0) {
                        this.queryform.task = this.tasks[0].id
                    }
                })
                .catch(error => {
                    this.notify.error(error.response)
                })
        },
        change() {
            this.$refs['queryform'].validate(valid => {
                if (valid) {
                    this.$api.api
                        .resultStatics(this.queryform.task, this.queryform.result, this.projectName)
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
                            let n_run = {
                                value: ret.not_run,
                                name: '未执行',
                                itemStyle: {
                                    color: '#909399'
                                }
                            }
                            if (this.queryform.result === 'all') {
                                this.updateSub(subdata, success, failed, n_run)
                            } else if (this.queryform.result === 'succeed') {
                                this.updateSub(subdata, success)
                            } else if (this.queryform.result === 'failed') {
                                this.updateSub(subdata, failed)
                            } else if (this.queryform.result === 'not_run') {
                                this.updateSub(subdata, n_run)
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
        }
    },
    mounted() {
        this.taskList()
        setTimeout(() => {
            this.change()
        }, 1000)
    }
}
</script>
<style scoped>
.top-box {
    background-color: #fff;
    height: 200px;
}
.filter-box {
    width: 290px;
    height: 200px;
    font-size: 12px;
    margin-top: 20px;
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
