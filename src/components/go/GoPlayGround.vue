<template>
    <div>
        <div class="row">
            <div class="col-7">
                <div ref="parent" class="goboard">
                    <canvas ref="canvas" tabindex="0"></canvas>
                </div>
            </div>
            <div class="col-5">
                <el-tabs type="border-card" :stretch=true tab-position="top" class="play-board">
                    <el-tab-pane label="匹配对手" class="settings">
                        <div>
                            <GoMatchBoard />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="挑战AI" class="settings"
                        :disabled="$store.state.gogame.status === 'playing' ? true : false">
                        <AISettings />
                    </el-tab-pane>
                    <el-tab-pane label="自由对弈" class="settings"
                        :disabled="$store.state.gogame.status === 'playing' ? true : false">
                        <FreePlay/>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import { BoardIndex } from '@/assets/scripts/BoardIndex';
import GoMatchBoard from '@/components/go/GoMatchBoard.vue'
import FreePlay from './FreePlay.vue';
import AISettings from './AISettings.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { onMounted } from 'vue';

export default {
    components: {
        GoMatchBoard,
        AISettings,
        FreePlay,
    },

    setup() {
        const store = useStore();
        let parent = ref(null);
        let canvas = ref(null);
        onMounted(() => {
            new BoardIndex(canvas.value.getContext('2d'), parent.value, 19, 19, store);
        })

        return {
            parent,
            canvas
        }
    },
}

</script>

<style scoped>
.goboard {
    width: 85vw;
    height: 85vh;
    display: flex;
    justify-content: left;
    margin-left: 30px;
    align-items: center;
}

canvas {
    background-color: rgba(186, 135, 27, 0.5);
    border: 2px solid #9d6746;
    margin-top: 20px;
    margin-left: 50px;
    display: inline-block;
    background-image: radial-gradient(rgba(226, 255, 157, 0.25), rgba(26, 25, 25, 0));
    cursor: pointer;
    box-shadow: 3px 3px 3px #b9b9b9;
}

.play-board {
    background-color: rgb(230, 231, 234);
    width: auto;
    margin: 1.5vh 5vw auto -5vw;
    box-shadow: 3px 3px 3px #b9b9b9;
}
</style>