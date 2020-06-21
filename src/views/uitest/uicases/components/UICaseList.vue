<template>
    <div>
        <template v-if="permissions.indexOf('uitest.create_uicases') > -1">
            <router-link tag="el-button" :to="{ name: 'AddCase', query: $route.query }" class="el-button--primary el-button--mini p-button">
                添加测试用例
            </router-link>
        </template>
        <template v-else>
            <el-button class="el-button--primary el-button--mini p-button" disabled>添加测试用例</el-button>
        </template>
    </div>
</template>

<script>
export default {
    name: 'UICaseList',
    data() {
        return {
            permissions: []
        }
    },
    methods: {
        getPermissions() {
            this.permissions = JSON.parse(localStorage.getItem('userinfo')).permissions
        }
    },
    created() {
        this.getPermissions()
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
.el-popper .popper__arrow {
    display: none;
}
</style>
