<template>
    <div class="result-board">
        <div class="container text-center">
            <div class="row">
                <div class="col">
                    <img :src="user.avatar" alt="">
                </div>
                <div class="col">
                    <span class="user_info">
                        {{ user.username }}
                    </span>
                </div>
                <div class="col">
                    <span class="user_info">
                        {{ user.level }}
                    </span>
                </div>
                <div class="col">
                    <span class="user_info">
                        {{ user.win + "胜 " + user.lose + "负 "}}
                    </span>
                </div>
            </div>
        </div>
        <div class="container text-center">
            <div class="row">
                <div class="col">
                    <div class="accept">
                        <button type="button" class="btn btn-success btn-lg" @click="accept_invitation">接受</button>
                    </div>
                </div>
                <div class="col">
                    <div class="deny">
                        <button type="button" class="btn btn-danger btn-lg" @click="refuse_invitation">拒绝</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
    props: {
        request_user: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const store = useStore();
        const user = computed(() => {
            return props.request_user;
        })
        
        const refuse_invitation = () => {
            store.state.gogame.socket.send(JSON.stringify({
                event: "refuse_invitation",
                friend_id: store.state.user.invite_player_id,
            }));
            store.commit("updateInvitePlayerId", '');
        }

        const accept_invitation = () => {
            store.state.gogame.socket.send(JSON.stringify({
                event: "accept_invitation",
                user_id: store.state.user.id,
                friend_id: store.state.user.invite_player_id,
            }));
            store.commit("updateInvitePlayerId", '');
        }

        return {
            user,
            refuse_invitation,
            accept_invitation,
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
    top: 20vh;
    left: 28vw;
    border: 2px solid black;
}

.container {
    padding-top: 5vh;
}

img {
    border-radius: 50%;
    width: 5vh;
    margin-top: -0.5vh;
}

.user_info {
    color: white;
    font-size: larger;
}
</style>