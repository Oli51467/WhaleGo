<template>
    <div class="result-board">
        <div class="result-board-text">
            <span>
                对方拒绝了您的请求
            </span>
        </div>
        <div class="result-board-btn">
            <button type="button" class="btn btn-warning btn-lg" @click="accept_refuse">确定</button>
        </div>
    </div>

</template>

<script>
import { useStore } from 'vuex'
export default {
    setup() {
        const store = useStore();
        const accept_refuse = () => {
            store.commit("updateRefused", '');
        }
        return {
            accept_refuse,
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
    top: 30%;
    left: 35%;
    z-index: 999;
}

div.result-board-text {
    text-align: center;
    color: white;
    font-size: 40px;
    font-weight: 600;
    font-style: italic;
    padding-top: 5vh;
}

div.result-board-btn {
    text-align: center;
    padding-top: 7vh;
}
</style>