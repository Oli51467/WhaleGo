<template>
    <div>
        <div class="row">
            <div class="col-7">
                <div ref="parent" class="goboard">
                    <canvas ref="canvas" tabindex="0"></canvas>
                </div>
            </div>
            <div class="col-5">
                <div class="container">
                    <div class="card-body">
                        <el-tabs v-model="matchplay" type="border-card" @tab-click="handleClick" stretch=true
                            tab-position="top" class="play-board">
                            <el-tab-pane label="匹配对手" class="settings">
                                <div
                                    v-if="$store.state.gogame.status === 'waiting' || $store.state.gogame.status === 'matching'">
                                    <GoMatchBoard />
                                </div>
                                <div v-else>
                                    <GoPlayBoard />
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="挑战AI" class="settings">AI</el-tab-pane>
                            <el-tab-pane label="自由对弈" class="settings">自由</el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { GoBoard } from '@/assets/scripts/GoBoard';
import GoMatchBoard from '@/components/go/GoMatchBoard.vue'
import GoPlayBoard from '@/components/go/GoPlayBoard.vue'
import { ref } from 'vue';
import { useStore } from 'vuex';
import { onMounted } from 'vue';

export default {
    components: {
        GoMatchBoard,
        GoPlayBoard,
    },

    setup() {
        const store = useStore();
        let parent = ref(null);
        let canvas = ref(null);
        onMounted(() => {
            new GoBoard(canvas.value.getContext('2d'), parent.value, 19, 19, store)
        })

        return {
            parent,
            canvas
        }
    },

    data() {
        return {
            activeName: 'first'
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
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
    background-color: #c28b69;
    border: 1px solid #522;
    margin-top: 20px;
    margin-left: 50px;
    display: inline-block;
    background-image: radial-gradient(rgba(226, 255, 157, 0.25), rgba(26, 25, 25, 0));
    cursor: pointer;
    box-shadow: 3px 3px 3px #b9b9b9;
}

.container {
    width: auto;
    margin-left: -100px;
    margin-top: 15px;
    margin-right: 100px;
}

.play-board {
    background-color: antiquewhite;
}
</style>