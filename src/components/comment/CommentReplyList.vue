<template>
  <div> {{ comment_id }} </div>
  
</template>

<script>

export default {
    props: {
        comment_id: {
            type: Number,
            required: true,
        }
    }
}
</script>

<style scoped>

</style>