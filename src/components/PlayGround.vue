<template>
    <div class="playground">
        <GameMap/>
    </div>
</template>

<script>
import GameMap from '@/components/GameMap.vue';

export default {
    components: {
        GameMap,
    }
}
</script>

<style scoped>
div.playground {
    width: 75vw;
    height: 85vh;
    background-color: rgba(50, 50, 50, 0.4);
    margin: 40px auto;
}
</style>
