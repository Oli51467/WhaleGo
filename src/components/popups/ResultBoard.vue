<template>
    <div class="result-board">
        <div class="result-board-text" v-if="$store.state.gogame.loser == 1">
            白中盘胜
        </div>
        <div class="result-board-text" v-else-if="$store.state.gogame.loser == 2">
            黑中盘胜
        </div>
        <div class="result-board-text" v-else-if="$store.state.gogame.loser == -2">
            和棋！
        </div>
        <div class="result-board-btn">
            <button type="button" class="btn btn-success btn-lg" @click="return_to_match">确定</button>
        </div>
    </div>

</template>

<script>
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        const return_to_match = () => {
            store.commit("updateGoGameStatus", "waiting");
            store.commit("updateGoLoser", "none");
        }
        return {
            return_to_match,
        }
    }
}
</script>

<style scoped>
div.result-board {
    height: 30vh;
    width: 30vw;
    background-color: rgba(50, 50, 50, 0.5);
    position: absolute;
    top: 30vh;
    left: 35vw;
}

div.result-board-text {
    text-align: center;
    color: white;
    font-size: 50px;
    font-weight: 600;
    font-style: italic;
    padding-top: 5vh;
}

div.result-board-btn {
    text-align: center;
    padding-top: 7vh;
}
</style>