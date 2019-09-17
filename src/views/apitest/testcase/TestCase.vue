<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'TestCase'
  // inject: ['reload'],
  // beforeRouteUpdate (to, from, next) {
  //   this.reload()
  //   next()
  // }
}
</script>

<style scoped>
</style>
