<template>
    <NavBar />
    <router-view />
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import NavBar from './components/base/NavBar.vue';
import router from './router';
import { request_play } from '@/components/friend/MyFriendPage.vue'
import { request_draw_eb, request_regret_eb } from './components/go/GoPlayBoard.vue';
import { go_resign } from './components/go/GoPlayBoard.vue';
import { ElMessageBox } from 'element-plus';

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
        const goSocketUrl = `ws://127.0.0.1:3000/go/websocket/${this.$store.state.user.token}/`;
        const store = this.$store;
        const play_request = ElMessageBox;
        socket = new WebSocket(goSocketUrl);
        socket.onopen = () => {
            console.log("GoGame Socket Connnected!");
            store.commit("updateSocket", socket);
        }
        socket.onmessage = msg => {
            const data = JSON.parse(msg.data);
            if (data.event === "start") {
                const roomId = data.game.room_id;
                router.push({
                    name: 'playroom',
                    params: {
                        roomId
                    }
                })
                store.commit("updateLastStep", {
                    last_x: -1,
                    last_y: -1,
                })
                store.commit("updateOpponentId", data.opponent_userid);
                store.commit("updateGoGameStatus", "playing");
                store.commit("updateBoard", data.game.board);
                store.commit("updateRoomId", roomId);
                store.commit("updateCurrent", 1);
                if (data.game.black_id == store.state.user.id) { // 执黑
                    store.commit("updateWhich", 1);
                } else {  // 执白
                    store.commit("updateWhich", 2);
                }
            }
            else if (data.event === "result") {
                store.commit("updateWhich", 0);
                store.commit("updateCurrent", 0);
                store.commit("updateRoomId", null);
                store.commit("updateGoGameStatus", "waiting");
                store.commit("updateLastStep", {
                    last_x: -1,
                    last_y: -1,
                })
                go_resign.close();
                request_draw_eb.close();
                ElMessageBox.alert(data.loser, {
                    confirmButtonText: '确定',
                    type: 'info',
                    center: true,
                })
            }
            else if (data.event === 'play') {
                if (data.last_x != -1 && data.last_y != -1) {
                    store.commit("updateLastStep", {
                        last_x: data.last_x,
                        last_y: data.last_y,
                    })
                }
                if (data.valid === 'yes') {
                    store.commit("updateBoard", data.board);
                }
                if (data.room_id == store.state.gogame.room_id) {
                    store.commit("updateCurrent", data.current);
                }
            }
            else if (data.event === 'regret_success') {
                request_regret_eb.close();
                store.commit("updateBoard", data.board);
                store.commit("updateLastStep", {
                    last_x: data.last_x,
                    last_y: data.last_y,
                })
                if (data.room_id == store.state.gogame.room_id) {
                    store.commit("updateCurrent", data.current);
                }
            }
            else if (data.event === 'request_play') {     // 接受到一名玩家发出的邀请
                const request = data.request_user;
                play_request.confirm("用户 " + request.username + "   " + request.level + "  " + request.win + "胜" +
                    "  " + request.lose + "负    向您发来对局邀请", {
                    cancelButtonText: '同意',
                    confirmButtonText: '拒绝',
                    title: "对局邀请",
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    type: 'info',
                    customClass: 'winClass',//弹窗样式
                    center: true
                }).then(() => {
                    socket.send(JSON.stringify({
                        event: "refuse_invitation",
                        friend_id: data.request_user.id,
                    }));
                }).catch(() => {
                    socket.send(JSON.stringify({
                        event: "accept_invitation",
                        user_id: store.state.user.id,
                        friend_id: data.request_user.id,
                    }));
                })
            }
            else if (data.event === 'request_cancel') {   // 另一名玩家取消了邀请(对局邀请、和棋邀请、悔棋申请)
                play_request.close();
                request_regret_eb.close();
            }
            else if (data.event === 'request_draw') {    // 另一名玩家请求和棋
                play_request.confirm("对方向您发来和棋请求", {
                    cancelButtonText: '同意',
                    confirmButtonText: '拒绝',
                    title: "和棋请求",
                    type: 'info',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    showClose: false,
                    center: true
                }).then(() => {
                    socket.send(JSON.stringify({
                        event: "refuse_invitation",
                        friend_id: store.state.gogame.opponent_userid,
                    }));
                }).catch(() => {
                    socket.send(JSON.stringify({
                        event: "accept_draw",
                        user_id: store.state.user.id,
                        friend_id: store.state.gogame.opponent_userid,
                    }));
                })
            }
            else if (data.event === 'request_regret') {
                play_request.confirm("对方请求悔棋", {
                    cancelButtonText: '同意',
                    confirmButtonText: '拒绝',
                    title: "悔棋请求",
                    type: 'info',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    showClose: false,
                    center: true
                }).then(() => {
                    socket.send(JSON.stringify({
                        event: "refuse_invitation",
                        friend_id: store.state.gogame.opponent_userid,
                    }));
                }).catch(() => {
                    socket.send(JSON.stringify({
                        event: "accept_regret",
                        user_id: store.state.user.id,
                        which: store.state.gogame.which == 1 ? 2 : 1,
                    }));
                })
            }
            else if (data.event === 'friend_refuse') {    // 另一名玩家拒绝了对局邀请
                request_play.close();
                request_draw_eb.close();
                request_regret_eb.close();
                request_play.alert('对局拒绝了请求', {
                    confirmButtonText: '确定',
                    type: 'error',
                    center: true,
                })
            }
            else if (data.event === 'ready') {            // 另一名玩家接受了邀请 准备开始
                request_play.close();
                store.commit("updateLastStep", {
                    last_x: -1,
                    last_y: -1,
                })
            } else if (data.event === 'invalid_regret') {
                request_play.close();
                request_draw_eb.close();
                request_regret_eb.close();
                request_play.alert('不能悔棋！', {
                    confirmButtonText: '确定',
                    type: 'error',
                    center: true,
                })
            }
        }
        socket.onclose = () => {
            console.log("Disconnected");
            store.commit("updateGoGameStatus", "waiting");
            store.commit("updateWhich", 0);
            store.commit("updateCurrent", 0);
            store.commit("updateSocket", null);
        };
    },
} 
</script>

<style>
body {
    background-image: url('@/assets/images/bgi.png');
    background-size: cover;
    z-index: -999;
}
</style>
