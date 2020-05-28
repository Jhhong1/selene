<template>
    <div class="tag-success-class" style="display: inline-block">
        {{ text }}
    </div>
</template>

<script>
export default {
    name: 'Label',
    props: {
        text: String
    }
}
</script>

<style scoped></style>
