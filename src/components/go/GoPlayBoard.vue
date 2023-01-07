<template>
    <div class="playboard">
        <div class="row">
            <div class="col-11">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-1 user-avatar">
                                <img :src="$store.state.user.avatar" alt="">
                            </div>
                            <div class="col-3 username">
                                <span>{{ $store.state.user.username }} &nbsp;3段</span>
                            </div>
                            <div class="col-1 parent">
                                <canvas ref="canvas" tabindex="0"></canvas>
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
                                <img :src="$store.state.gogame.opponent_avatar" alt="">
                            </div>
                            <div class="col-3 username">
                                <span> {{ $store.state.gogame.opponent_username }} &nbsp;3段</span>
                            </div>
                            <div class="col-1 parent">
                                <canvas ref="canvas1" tabindex="0"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-11">
                <!--所有在房间的人-->
                <table class="table table-striped table-hover" style="text-align:center">
                    <thead>
                        <tr>
                            <th>用户</th>
                            <th>段位</th>
                            <th>胜</th>
                            <th>负</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.user_id">
                            <td>
                                <div>
                                    <img :src="user.user_avatar" alt="" class="user-avatar-guest">
                                    &nbsp;
                                    <span> {{ user.user_name }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="user-info">
                                    <button class="btn btn-outline-info"> {{ user.user_level }} </button>
                                </div>
                            </td>
                            <td>
                                <div class="user-username">
                                    <span> {{ user.user_lose }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="user-username">
                                    <span> {{ user.user_win }}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--end-->
            </div>
        </div>

        <div class="row">
            <div class="col-3 func">
                <button type="button" class="btn btn-info btn-lg" disabled="true">申请数目</button>
            </div>
            <div class="col-3 func">
                <button type="button" class="btn btn-success btn-lg" disabled="true">形势判断</button>
            </div>
            <div class="col-3 func">
                <button type="button" class="btn btn-secondary btn-lg" @click="request_draw">申请和棋</button>
            </div>
            <div class="col-2 func">
                <button type="button" class="btn btn-danger btn-lg" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">认输</button>

                <!-- Modal -->
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-body">
                                <span>你确定认输吗？</span>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger btn-lg" style="margin-right: 200px"
                                    data-bs-dismiss="modal" @click="click_resign">认输</button>
                                <button type="button" class="btn btn-secondary btn-lg" data-bs-dismiss="modal"
                                    style="margin-right: 60px">取消</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
</template>

<script>
import { useStore } from 'vuex';
import { onMounted } from 'vue';
import { ref } from 'vue';
import $ from 'jquery';
import { API_URL } from '@/assets/apis/api';

export default {
    props: {
        roomId: {
            type: Object,
            required: true,
        }
    },

    setup() {
        const store = useStore();
        let canvas = ref(null);
        let canvas1 = ref(null);
        let users = ref([]);

        onMounted(() => {
            let ctx = canvas.value.getContext('2d');
            let ctx1 = canvas1.value.getContext('2d');
            if (store.state.gogame.which == 1) {
                ctx.fillStyle = "black";
                ctx1.fillStyle = "white";
            } else {
                ctx.fillStyle = "white";
                ctx1.fillStyle = "black";
            }
            ctx.beginPath();
            ctx.arc(95, 50, 40, 0, 2 * Math.PI);
            ctx1.beginPath();
            ctx1.arc(95, 50, 40, 0, 2 * Math.PI);
            ctx.fill();
            ctx1.fill();
        })

        const pull_users_in_room = () => {
            $.ajax({
                url: `${API_URL}/room/getUsers/`,
                type: "get",
                data: {
                  user_id: store.state.user.id,
                  room_id: "84aacc",
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    users.value = resp;
                    console.log(users.value);
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        pull_users_in_room();

        const click_resign = () => {
            store.state.gogame.socket.send(JSON.stringify({
                event: "play",
                x: -1,
                y: -1,
            }));
        }

        const request_draw = () => {
            const oppo_id = store.state.gogame.opponent_userid;
            store.commit("updateRequestPlayerId", oppo_id);        // 请求的对手的id
            store.state.gogame.socket.send(JSON.stringify({
                event: "request_draw",
                friend_id: oppo_id,
            }));
        }

        return {
            pull_users_in_room,
            click_resign,
            request_draw,
            canvas,
            canvas1,
            users,
        }
    }
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

.user-avatar-guest {
    border-radius: 50%;
    width: 4vh;
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

.parent {
    width: 20%;
    margin: 0 auto auto -100;
}

canvas {
    width: 150%;
    margin: -5px auto;
}
</style>