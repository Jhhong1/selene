<template>
    <div>
        <router-link tag="el-button" :to="{ name: 'AddGroup' }" class="el-button--primary el-button--mini p-button">
            添加权限组
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'GroupList'
}
</script>

<style scoped></style>
