<template>
    <div class="el-bread">
        <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'UISetList', query: $route.query }" class="is-link">测试集</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'UISetDetail', params: { name: name, id: id }, query: $route.query }" class="is-link">
                {{ name }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs v-model="activeName" style="background-color: white">
            <el-tab-pane disabled></el-tab-pane>
            <el-tab-pane label="测试用例" name="cases">
                <case-record v-model="cases" :category="category"></case-record>
            </el-tab-pane>
            <el-tab-pane label="前置条件" name="setup">
                <case-record v-model="setUpCases" :category="category"></case-record>
            </el-tab-pane>
            <el-tab-pane label="后置条件" name="teardown">
                <case-record v-model="teardownCases" :category="category"></case-record>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'UISetRecord',
    data() {
        return {
            name: this.$route.params.name,
            id: this.$route.params.id,
            batch: this.$route.params.batch,
            cases: [],
            setUpCases: [],
            teardownCases: [],
            activeName: 'cases',
            category: 'ui'
        }
    },
    methods: {
        getCases() {
            this.$api.api
                .history('testSet', this.id, '', this.batch)
                .then(response => {
                    this.cases = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        getSetupCases() {
            this.$api.api
                .history('testSet', this.id, '', this.batch, 'setup')
                .then(response => {
                    this.setUpCases = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        },
        getTeardownCases() {
            this.$api.api
                .history('testSet', this.id, '', this.batch, 'teardown')
                .then(response => {
                    this.teardownCases = response.data
                })
                .catch(error => {
                    this.notify.error(error)
                })
        }
    },
    created() {
        this.getCases()
        this.getSetupCases()
        this.getTeardownCases()
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
</style>
