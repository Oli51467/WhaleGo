<template>
    <div class="matchground">
        <div class="row">
            <div class="col-6">
                <div class="user-avatar">
                    <img :src="$store.state.user.avatar" alt="">
                </div>
                <div class="username" style="margin-top: 20px;">
                    {{ $store.state.user.username }}
                </div>
            </div>
            <div class="col-6">
                <div class="user-avatar">
                    <img :src="$store.state.game.opponent_avatar" alt="">
                </div>
                <div class="username" style="margin-top: 20px;">
                    {{ $store.state.game.opponent_username }}
                </div>
            </div>
            <div class="col-12" style="text-align: center; padding-top: 15vh;" v-if="$store.state.game.status==='waiting' || $store.state.game.status==='matching' ">
                <button type="button" class="btn btn-warning btn-lg" @click="click_match">{{ btn_text }}</button>
            </div>
            <div class="col-12" style="text-align: center; padding-top: 10px;" v-if="btn_text == '取消匹配' ">
                <span class="process" v-if="$store.state.game.status === 'matching'">正在匹配中...</span>
                <span class="process" v-if="$store.state.game.status === 'pending'" >匹配成功</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();
        let btn_text = ref('对战');

        const click_match = () => {
            if (btn_text.value === "对战") {
                btn_text.value = "取消匹配";
                store.commit("updateStatus", "matching");
                store.state.game.socket.send(JSON.stringify({
                    event: "start",
                }));
            } else {
                btn_text.value = "对战";
                store.commit("updateStatus", "waiting");
                store.state.game.socket.send(JSON.stringify({
                    event: "cancel",
                }));
            }
        }
        return {
            btn_text,
            click_match,
        }
    }
}

</script>

<style scoped>
div.matchground {
    width: 60vw;
    height: 85vh;
    background-color: rgba(50, 50, 50, 0.2);
    margin: 40px auto;
}

div.user-avatar {
    text-align: center;
    padding-top: 8vh;
}

div.user-avatar>img {
    border-radius: 50%;
    width: 30vh;
}

div.username {
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    color: white;
    padding-top: 10px;
}

div.btn btn-warning {
    text-align: center;
}

.process {
    color: white;
}
</style>
