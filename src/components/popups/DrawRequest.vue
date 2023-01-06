<template>
    <div class="result-board">
        <div class="result-board-text">
                <span>
                    对方申请和棋
                </span>
        </div>
        <div class="container text-center">
            <div class="row">
                <div class="col">
                    <div class="accept">
                        <button type="button" class="btn btn-success btn-lg" @click="accept_draw">接受</button>
                    </div>
                </div>
                <div class="col">
                    <div class="deny">
                        <button type="button" class="btn btn-danger btn-lg" @click="refuse_draw">拒绝</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        
        const refuse_draw = () => {
            store.state.gogame.socket.send(JSON.stringify({
                event: "refuse_invitation",
                friend_id: store.state.gogame.opponent_userid,
            }));
            store.commit("updateInvitePlayerId", '');
        }

        const accept_draw = () => {
            store.state.gogame.socket.send(JSON.stringify({
                event: "accept_draw",
                user_id: store.state.user.id,
                friend_id: store.state.gogame.opponent_userid,
            }));
            store.commit("updateInvitePlayerId", '');
        }

        return {
            refuse_draw,
            accept_draw,
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
    border: 2px solid black;
    z-index: auto;
}

div.result-board-text {
    text-align: center;
    color: white;
    font-size: 50px;
    font-weight: 600;
    font-style: italic;
    padding-top: 5vh;
}

.container {
    padding-top: 5vh;
}

img {
    border-radius: 50%;
    width: 5vh;
    margin-top: -0.5vh;
}
</style>