<template>
  <div>{{recentRecords}}</div>
</template>

<script>
export default {
    props: {
        recentRecords: {
            type: String,
            required: true,
        }
    },

    setup() {

    }
}
</script>

<style scoped>

</style>