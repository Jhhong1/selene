<template>
    <div>
        <div @click="logout">
            <el-button type="text">退出</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Logout',
    methods: {
        logout() {
            this.$store.commit('LOG_OUT')
            this.$router.push({ name: 'Login' })
        }
    }
}
</script>

<style scoped></style>
