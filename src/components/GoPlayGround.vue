<template>
    <div>
        <div class="row">
            <div class="col-9">
                <div ref="parent" class="goboard">
                    <canvas ref="canvas" tabindex="0"></canvas>
                </div>
            </div>
            <div class="col-3">
                info
            </div>
        </div>
    </div>
</template>

<script>
import { GoBoard } from '@/assets/scripts/GoBoard';
import { ref, onMounted } from 'vue';

export default {
    setup() {
        let parent = ref(null);
        let canvas = ref(null);

        onMounted(() => {
            new GoBoard(canvas.value.getContext('2d'), parent.value, 19, 19);
        });


        return {
            parent,
            canvas
        }
    }
}

</script>

<style scoped>

*,
*:before,
*:after {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.goboard {
    width: 85vw;
    height: 85vh;
    display: flex;
    justify-content: left;
    margin-left: 30px;
    align-items: center;
}

canvas {
    background-color: #6a4d3f;
    border: 1px solid #522;
    margin-top: 10px;
    margin-left: 50px;
    display: inline-block;
    border: 1px solid #522;
    background-image: radial-gradient(rgba(255, 255, 255, 0.4), rgba(26, 25, 25, 0));
    cursor: pointer;
    box-shadow: -2px -2px 2px #EFEFEF, 5Px 5px 5px #b9b9b9;
}
</style>