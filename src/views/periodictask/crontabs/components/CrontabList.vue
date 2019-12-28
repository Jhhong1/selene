<template>
    <div>
        <!-- <template v-if="permissions.indexOf('apitest.add_apitasks') > -1"> -->
        <router-link tag="el-button" class="el-button--primary el-button--mini p-button" :to="{ name: 'AddCrontab', query: $route.query }">
            添加定时任务
        </router-link>
        <!-- </template> -->
    </div>
</template>
<script>
export default {
    name: 'CrontabList'
}
</script>
<style scoped></style>
