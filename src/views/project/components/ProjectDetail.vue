<template>
    <div>
        <el-container>
            <el-aside width="200px" style="border-right: 1px solid #C0C4CC;">
                <el-menu :default-active="activeNav" router @select="test">
                    <el-submenu v-for="(menu, mindex) in navigate" :index="menu.path" :key="mindex">
                        <template slot="title">
                            <i :class="menu.icon"></i>
                            {{ menu.meta.title }}
                        </template>
                        <el-menu-item
                            v-for="(item, ind) in menu.children"
                            :key="ind"
                            :index="$route.matched[2].path + '/' + item.path + '?project_name=' + $route.query.project_name"
                            @click="highLightNav"
                        >
                            {{ item.meta.title }}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main style="padding: 0;min-width: 1276px;overflow: auto; min-height: 740px">
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'ProjectDetail',
    provide() {
        return {
            reload: this.reload
        }
    },
    data() {
        return {
            // activeNav: '/console/project/apitest/case/?project_name=' + this.$route.query.project_name,
            activeNav: '',
            isRouterAlive: true
        }
    },
    methods: {
        test(key, keyPath) {
            if (!key) {
                key = keyPath[0]
                console.log(key)
            }
        },
        highLightNav() {
            this.activeNav = this.$route.matched[3].path + '?project_name=' + this.$route.query.project_name
        },
        reload() {
            this.isRouterAlive = false
            this.$nextTick(function() {
                this.isRouterAlive = true
            })
        }
    },
    computed: {
        navigate() {
            let navList = []
            let navs1 = null
            let routeList = this.$router.options.routes
            for (let i = 0, len = routeList.length; i < len; i++) {
                if (routeList[i].hasOwnProperty('children')) {
                    navs1 = routeList[i].children
                }
            }

            for (let j = 0, len = navs1.length; j < len; j++) {
                if (navs1[j].hasOwnProperty('navBar') && navs1[j].hasOwnProperty('children')) {
                    navList = navs1[j].children
                }
            }
            return navList
        }
    },
    mounted() {
        this.highLightNav()
    }
}
</script>

<style scoped></style>
