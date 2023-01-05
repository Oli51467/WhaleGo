<template>
    <InteractiveComponents/>
    <GoPlayGround />
    <GoResultBoard v-if="$store.state.gogame.loser === 'myself' || $store.state.gogame.loser === 'oppo'
    || $store.state.gogame.loser === 'draw'" />
    <DrawRequest v-if="$store.state.user.invite_player_id === 'peace'"/>
</template>
  
<script>
import GoPlayGround from '@/components/go/GoPlayGround.vue'
import GoResultBoard from '@/components/go/GoResultBoard.vue'
import InteractiveComponents from '@/components/go/InteractiveComponents.vue';
import DrawRequest from '@/components/go/DrawRequest.vue';

export default {
    name: 'RecordIndex',
    // 存放templates中用到的其他组件
    components: {
        GoPlayGround,
        GoResultBoard,
        InteractiveComponents,
        DrawRequest,
    },

    setup() {

    }
}
</script>
  
<style scoped>

</style>