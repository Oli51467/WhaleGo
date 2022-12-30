<template>
    <div>
        <div class="row">
            <div class="col-9">
                <div ref="parent" class="gamemap">
                    <canvas ref="canvas" tabindex="0"></canvas>
                </div>
            </div>
            <div class="col-3" v-if="$store.state.snake_record.is_record == false">
                <span v-if="$store.state.game.a_id == $store.state.user.id">您在左下角</span>
                <span v-else>您在右上角</span>
            </div>
        </div>
    </div>
</template>

<script>
import { GameMap } from '@/assets/scripts/GameMap';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        let parent = ref(null);
        let canvas = ref(null);

        onMounted(() => {   // 组件挂载完之后执行 匿名函数没有this，会向上层指
            store.commit("updateGameObject", new GameMap(canvas.value.getContext('2d'), parent.value, store));
        });

        return {
            parent,
            canvas
        }
    }
}
</script>

<style scoped>
.gamemap {
    width: 85vw;
    height: 85vh;
    display: flex;
    justify-content: left;
    margin-left: 30px;
    align-items: center;
}
</style>