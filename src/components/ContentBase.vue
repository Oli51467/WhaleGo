<template>
    <div class="container">
        <div class="card">
            <div class="card-body">
                <slot class="child"></slot>
                <!--slot存放父组件传来的所有children-->
            </div>
        </div>
    </div>

</template>
  
<script>
export default {
    name: 'ContentBase',
    components: {
    }
}
</script>
  
<style scoped>
.container {
    margin-top: 10px;
}

.card-body {
    text-align: center;
    height: auto;
}
</style>