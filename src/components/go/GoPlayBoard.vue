<template>
    <div class="playboard">
        <div class="row">
            <div class="col-11">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-1 user-avatar">
                                <img :src="users.black_avatar" alt="">
                            </div>
                            <div class="col-3 username">
                                <span>{{ users.black_username }} &nbsp;{{ users.black_level }}</span>
                            </div>
                            <div class="col-1 parent">
                                <div class='black'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="row">
            <div class="col-11">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-1 user-avatar">
                                <img :src="users.white_avatar" alt="">
                            </div>
                            <div class="col-3 username">
                                <span> {{ users.white_username }} &nbsp;{{ users.white_level }}</span>
                            </div>
                            <div class="col-1 parent">
                                <div class='white'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <RoomUserList :roomId="roomId" />

        <div class="row" v-if="$store.state.gogame.which == 0" style="margin: 0 auto">
            <el-button plain type="danger" class="leave" @click="leave_room">离开房间</el-button>
        </div>

        <div class="row" v-else>
            <div class="col-3 func">
                <el-button plain type="info" @click="show_territory">形势判断</el-button>
            </div>
            <div class="col-3 func">
                <el-button type="info" plain @click="request_draw">申请和棋</el-button>
            </div>
            <div class="col-3 func">
                <el-button type="success" plain :disabled="regret" @click="request_regret">申请悔棋</el-button>
            </div>
            <div class="col-2 func">
                <el-button type="danger" plain @click="click_resign">认输</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import RoomUserList from '../room/RoomUserList.vue'
import { useStore } from 'vuex';
import { onMounted } from 'vue';
import { ref, computed } from 'vue';
import router from '@/router';
import $ from 'jquery';
import { API_URL } from '@/assets/apis/api';
import { onBeforeRouteLeave } from "vue-router";
import { ElMessageBox } from 'element-plus';

export let request_draw_eb = ElMessageBox;
export let go_resign = ElMessageBox;
export let request_regret_eb = ElMessageBox;
export default {
    components: {
        RoomUserList,
    },
    props: {
        roomId: {
            type: String,
            required: true,
        }
    },

    setup(props) {
        const store = useStore();
        let users = ref([]);
        let flag = ref(null);
        let regret = computed(() => store.state.gogame.which === store.state.gogame.current || store.state.gogame.which == 0)

        onMounted(() => {
            
        })

        const get_board_in_room = () => {
            $.ajax({
                url: `${API_URL}/room/getBoard/`,
                type: "get",
                data: {
                    user_id: store.state.user.id,
                    room_id: props.roomId,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.event === 'empty_room') {
                        router.push({
                            name: '404',
                        })
                    }
                    users.value = resp;
                    store.commit("updateBoard", resp.board_state);
                },
                error(resp) {
                    console.log(resp);
                }
            })
        };
        get_board_in_room();

        const click_resign = () => {
            go_resign.confirm('是否确定认输？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.state.gogame.socket.send(JSON.stringify({
                    event: "play",
                    x: -1,
                    y: -1,
                }));
            }).catch(() => {

            });
        }

        const request_draw = () => {
            store.state.gogame.socket.send(JSON.stringify({
                event: "request_draw",
                friend_id: store.state.gogame.opponent_userid,
                which: store.state.gogame.which,
            }));
            request_draw_eb.alert('等待对方回应', {
                confirmButtonText: '取消',
                type: 'info',
                center: true,
                callback: () => {
                    store.state.gogame.socket.send(JSON.stringify({
                        event: "request_cancel",
                        friend_id: store.state.gogame.opponent_userid,
                    }));
                }
            })
        }

        const request_regret = () => {
            store.state.gogame.socket.send(JSON.stringify({
                event: "request_regret",
                friend_id: store.state.gogame.opponent_userid,
            }));
            request_draw_eb.alert('等待对方回应', {
                confirmButtonText: '取消',
                type: 'info',
                center: true,
                callback: () => {
                    store.state.gogame.socket.send(JSON.stringify({
                        event: "request_cancel",
                        friend_id: store.state.gogame.opponent_userid,
                    }));
                }
            })
        }

        const leave_room = () => {
            flag.value = false;
            $.ajax({
                url: `${API_URL}/room/leave/`,
                type: "get",
                data: {
                    room_id: props.roomId,
                    user_id: store.state.user.id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success() {
                    router.push({
                        name: 'playhall',
                    })
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const show_territory = () => {
            let show = store.state.gogame.show_territory;
            if (show) {
                store.commit("updateShowTerritory", false);
                return;
            }
            $.ajax({
                url: `${API_URL}/board/territory/`,
                type: "get",
                data: {
                    room_id: "1",
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    console.log(resp.territory);
                    store.commit("updateTerritory", resp.territory);
                    store.commit("updateShowTerritory", true);
                },
                error(err) {
                    console.log(err);
                }
            })
        }

        onBeforeRouteLeave((to, from, next) => {
            if (store.state.gogame.which != 0) {
                ElMessageBox.confirm("您的棋局还未下完，是否认输？", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        store.state.gogame.socket.send(JSON.stringify({
                            event: "play",
                            x: -1,
                            y: -1,
                        }));
                    })
                    .catch(() => {
                        console.log("111");
                    });
            } else {
                next();
            }
        })

        return {
            get_board_in_room,
            request_draw,
            click_resign,
            leave_room,
            request_regret,
            show_territory,
            users,
            regret,
        }
    },
}
</script>

<style scoped>
.row {
    margin-top: 15px;
}

.card {
    background-color: rgb(238, 237, 237);
}

div.playboard {
    width: 40vw;
    margin: 0 auto;
}

div.user-avatar {
    text-align: center;
}

div.user-avatar>img {
    width: 4vh;
    border-radius: 10%;
}

div.username {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: black;
}

.func {
    text-align: center;
}

.leave {
    width: 12vh;
    text-align: center;
    margin: 0 auto auto 30vh;
}

.white {
  left: 0;
  box-sizing: border-box;
  background-color: white;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 1px 1px 1px #404040 , inset -3px -3px 5px gray;
  width: 30px;
  height: 30px;
  content: '';
  display: inline-block;
}

.black {
  box-sizing: border-box;
  left: 0;
  background-color: black;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 1px 1px 1px #404040;
  background-image: -webkit-radial-gradient(40% 40%, circle closest-corner, #404040 0%, transparent 90%);
  background-image: -moz-radial-gradient(40% 40%, circle closest-side, #404040 0%, transparent 90%);
  width: 30px;
  height: 30px;
  content: '';
  display: inline-block;
}
</style>