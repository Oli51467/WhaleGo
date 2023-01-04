<template>
    <NavBar />
    <router-view />
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import NavBar from './components/NavBar.vue';
import router from './router';

export default {
    components: {
        NavBar
    },

    // 解决f5刷新后数据不丢失的问题
    created() {
        // 在页面加载时读取localStorage里的状态信息
        if (localStorage.getItem('store')) {
            // 存储状态
            this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(localStorage.getItem('store'))))
        }
        // 在页面刷新时将vue里的信息保存到localStorage里
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('store', JSON.stringify(this.$store.state))
        })
        let socket = null;
        const goSocketUrl = `ws://127.0.0.1:3000/go/websocket/${this.$store.state.user.token}`;
        const store = this.$store;
        socket = new WebSocket(goSocketUrl);
        socket.onopen = () => {
            console.log("GoGame Socket Connnected!");
            store.commit("updateGoSocket", socket);
        }
        socket.onmessage = msg => {
            const data = JSON.parse(msg.data);
            if (data.event === "start") {
                store.commit("updateGoOpponent", {
                    username: data.opponent_username,
                    avatar: data.opponent_avatar,
                });
                store.commit("updateGoGameStatus", "playing");
                store.commit("updateBoard", data.game.board);
                store.commit("updateCurrent", 1);
                if (data.game.black_id == store.state.user.id) { // 执黑
                    store.commit("updateWhich", 1);
                } else {  // 执白
                    store.commit("updateWhich", 2);
                }
            } else if (data.event === "result") {
                store.commit("updateWhich", 0);
                store.commit("updateCurrent", 0);
                store.commit("updateBoard", null);
                if (store.state.user.id == data.loser) {
                    store.commit("updateGoLoser", "myself");
                } else {
                    store.commit("updateGoLoser", "oppo");
                }
            } else if (data.event === 'play') {
                if (data.valid === 'yes') {
                    store.commit("updateBoard", data.board);
                }
                store.commit("updateCurrent", data.current);
            } else if (data.event === 'request_play') {
                store.commit("updateRequestUser", data.request_user);
                store.commit("updateInvitePlayerId", data.request_user.id);
            } else if (data.event === 'request_cancel') {
                store.commit("updateInvitePlayerId", '');
            } else if (data.event === 'friend_refuse') {
                store.commit("updateRequestPlayerId", '');
                store.commit("updateRefused", "yes");
            } else if (data.event === 'ready') {
                store.commit("updateRequestPlayerId", '');
                router.push({
                    name: 'goplay'
                })
            }
        }
        socket.onclose = () => {
            console.log("Disconnected");
            store.commit("updateGoGameStatus", "waiting");
            store.commit("updateWhich", 0);
            store.commit("updateCurrent", 0);
            store.commit("updateGoSocket", socket);
        };

    },
} 
</script>

<style>
body {
    background-image: url('@/assets/images/background.png');
    background-size: cover;
}
</style>
