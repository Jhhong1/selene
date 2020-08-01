<template>
    <div>
        <el-select v-model="strategy" filterable placeholder="请选择" @change="valueChange">
            <el-option label="by_id" value="by_id"></el-option>
            <el-option label="by_name" value="by_name"></el-option>
            <el-option label="by_class_name" value="by_class_name"></el-option>
            <el-option label="by_tag_name" value="by_tag_name"></el-option>
            <el-option label="by_link_text" value="by_link_text"></el-option>
            <el-option label="by_partial_link_text" value="by_partial_link_text"></el-option>
            <el-option label="by_xpath" value="by_xpath"></el-option>
            <el-option label="by_css_selector" value="by_css_selector"></el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    name: 'Strategy',
    props: {
        value: String
    },
    data() {
        return {
            strategy: this.value
        }
    },
    methods: {
        valueChange(val) {
            this.$emit('change', val)
        }
    },
    watch: {
        value: function(newValue) {
            // console.log('asserts: ', newValue)
            this.strategy = newValue
        }
    }
}
</script>

<style scoped></style>
