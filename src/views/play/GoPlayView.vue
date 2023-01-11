<template>
    <GoPlayGround />
    <ResultBoard v-if="$store.state.gogame.loser === 'myself' || $store.state.gogame.loser === 'oppo'
    || $store.state.gogame.loser === 'draw'" />
</template>
  
<script>
import GoPlayGround from '@/components/go/GoPlayGround.vue';
import ResultBoard from '@/components/popups/ResultBoard.vue';

export default {
    name: 'RecordIndex',
    // 存放templates中用到的其他组件
    components: {
        GoPlayGround,
        ResultBoard,
    },

    setup() {

    }
}
</script>
  
<style scoped>

</style>