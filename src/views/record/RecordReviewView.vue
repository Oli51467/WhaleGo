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
                        <el-tabs type="border-card" :stretch=true
                            tab-position="top" class="play-board">
                            <el-tab-pane label="开始复盘" class="settings">
                                <button ref="proceed" type="button" class="btn btn-light">Light</button>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { BoardRecord } from '@/assets/scripts/BoardRecord.js';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { onMounted } from 'vue';

export default {
    components: {
    },

    setup() {
        const store = useStore();
        let parent = ref(null);
        let canvas = ref(null);
        let proceed = ref(null);
        const steps = store.state.record.steps;
        onMounted(() => {
            new BoardRecord(canvas.value.getContext('2d'), parent.value, 19, 19, steps, proceed.value);
        })

        return {
            parent,
            canvas,
            proceed,
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
    background-color: #c28b69;
    border: 2px solid #9d6746;
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
    margin-top: 10vh;
    margin-right: 100px;
}

.play-board {
    background-color: rgb(238, 237, 237);
}
</style>