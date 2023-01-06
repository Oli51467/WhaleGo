<template>
    <div class="result-board">
        <div class="result-board-text">
            <span>
                等待对方回应...
            </span>
        </div>
        <div class="result-board-btn">
            <button type="button" class="btn btn-success btn-lg" @click="cancel_invite">取消</button>
        </div>
    </div>

</template>

<script>
import { useStore } from 'vuex'
export default {
    setup() {
        const store = useStore();
        const cancel_invite = () => {
            store.state.gogame.socket.send(JSON.stringify({
                event: "request_cancel",
                friend_id: store.state.user.request_player_id,
            }));
            store.commit("updateRequestPlayerId", '');
        }

        return {
            cancel_invite,
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