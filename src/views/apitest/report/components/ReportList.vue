<template>
    <div>
        <el-row class="cl-line-high" style="margin-top: 8px">
            <el-col :span="2">测试任务:</el-col>
            <el-col :span="22" class="test-left">
                <el-select v-model="select" placeholder="请选择测试任务" filterable @change="change">
                    <el-option v-for="(task, index) in tasks" :label="task.name" :value="task.id" :key="index"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <template v-if="select">
            <v-chart :options="polar" class="chart-pie"></v-chart>
        </template>
    </div>
</template>
<script>
export default {
    name: 'ReportList',
    data() {
        return {
            select: '',
            tasks: [],
            projectName: this.$route.query.project_name,
            polar: {
                // title: {
                //   text: '天气情况统计',
                //   left: 'center'
                // },
                legend: {
                    bottom: 10,
                    left: 'center',
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
                            position: 'inside',
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
                        this.select = this.tasks[0].id
                        this.change(this.tasks[0].id)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        change(val) {
            this.$api.api
                .resultStatics(val, this.projectName)
                .then(response => {
                    const ret = response.data
                    const subdata = this.polar.series[0].data
                    if (ret.success > 0) {
                        subdata.push({
                            value: ret.success,
                            name: '成功',
                            itemStyle: {
                                color: '#1bb393'
                            }
                        })
                    }
                    if (ret.failed > 0) {
                        subdata.push({
                            value: ret.failed,
                            name: '失败',
                            itemStyle: {
                                color: 'red'
                            }
                        })
                    }
                    if (ret.not_run > 0) {
                        subdata.push({ value: ret.not_run, name: '未执行', itemStyle: { color: '#909399' } })
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    },
    mounted() {
        this.taskList()
    }
}
</script>
<style scoped>
.chart-pie {
    position: absolute;
    width: 400px;
    height: 400px;
    left: 50%;
    margin-left: -100px;
}
</style>
