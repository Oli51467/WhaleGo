<template>
    <InteractiveComponents/>
    <GoPlayGround />
    <GoResultBoard v-if="$store.state.gogame.loser === 'myself' || $store.state.gogame.loser === 'oppo'" />
</template>
  
<script>
import GoPlayGround from '@/components/go/GoPlayGround.vue'
import GoResultBoard from '@/components/go/GoResultBoard.vue'
import InteractiveComponents from '@/components/go/InteractiveComponents.vue';
import { onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'RecordIndex',
    // 存放templates中用到的其他组件
    components: {
        GoPlayGround,
        GoResultBoard,
        InteractiveComponents,
    },

    setup() {
        const store = useStore();

        onUnmounted(() => {
            store.commit("updateGoGameStatus", "waiting");
            store.commit("updateWhich", 0);
            store.commit("updateCurrent", 0);
        })
    }
}
</script>
  
<style scoped>

</style>