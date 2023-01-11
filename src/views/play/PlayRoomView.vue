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
                        <ContentBase>
                            <GoPlayBoard :roomId="roomId"/>
                        </ContentBase>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ResultBoard v-if="$store.state.gogame.loser != 'none' " />
</template>

<script>
import ResultBoard from "@/components/popups/ResultBoard.vue";
import { GoBoard } from '@/assets/scripts/GoBoard';
import ContentBase from '@/components/base/ContentBase.vue';
import GoPlayBoard from '@/components/go/GoPlayBoard.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    components: {
        GoPlayBoard,
        ContentBase,
        ResultBoard,
    },

    setup() {
        const store = useStore();
        const route = useRouter();
        const roomId = route.currentRoute.value.params.roomId;
        let parent = ref(null);
        let canvas = ref(null);
        onMounted(() => {
            new GoBoard(canvas.value.getContext('2d'), parent.value, 19, 19, store, roomId);
        })

        return {
            parent,
            canvas,
            roomId,
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
    width: 40vw;
    margin-left: -50px;
    margin-top: 15px;
    margin-right: 100px;
}
</style>