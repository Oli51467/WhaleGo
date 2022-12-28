<template>
    <div>
        <div class="row">
            <div class="col-8">
                <div ref="parent" class="goboard">
                    <canvas ref="canvas" tabindex="0"></canvas>
                </div>
            </div>
            <div class="col-4">
                <div class="container">
                    <div class="card-body">
                        <el-tabs v-model="matchplay" type="border-card" @tab-click="handleClick" stretch="true"
                            tab-position="top">
                            <el-tab-pane label="matchplay" class="settings">
                                <div v-if="$store.state.gogame.status === 'waiting'">
                                    <GoMatchBoard/>
                                </div>
                                <div v-else>
                                    <GoPlayBoard/>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="AIplay" class="settings">AI</el-tab-pane>
                            <el-tab-pane label="freeplay" class="settings">自由</el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { GoBoard } from '@/assets/scripts/GoBoard';
import GoMatchBoard from '@/components/go/GoMatchBoard.vue'
import GoPlayBoard from '@/components/go/GoPlayBoard.vue'
import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
    components: {
        GoMatchBoard,
        GoPlayBoard,
    },

    setup() {
        const store = useStore();
        const goSocketUrl = `ws://127.0.0.1:3000/go/websocket/${store.state.user.token}`;
        let parent = ref(null);
        let canvas = ref(null);
        let socket = null;

        onMounted(() => {
            store.commit("updateGoOpponent", {
                username: "旗鼓相当的对手",
                avatar: '/robot.jpeg',
            });
            store.commit("updateBoard", new GoBoard(canvas.value.getContext('2d'), parent.value, 19, 19, store));
            socket = new WebSocket(goSocketUrl);
            socket.onopen = () => {
                console.log("GoGame Socket Connnected!");
                store.commit("updateGoSocket", socket);
            }

            socket.onmessage = msg => {
                const data = JSON.parse(msg.data);
                if (data.event === "start") {
                    console.log(data.opponent_username + data.opponent_avatar);
                    store.commit("updateGoOpponent", {
                        username: data.opponent_username,
                        avatar: data.opponent_avatar,
                    });
                    store.commit("updateGoStatus", "playing");
                    store.commit("updateBoard", data.game);
                }
            }

            socket.onclose = () => {
                console.log("Disconnected");
            }
        });

        onUnmounted(() => {
            socket.close();
            store.commit("updateGoStatus", "waiting");
        })


        return {
            parent,
            canvas
        }
    },

    data() {
        return {
            activeName: 'first'
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}

</script>

<style scoped>
.goboard {
    width: 85vw;
    height: 85vh;
    display: flex;
    justify-content: left;
    margin-left: 30px;
    align-items: center;
}

canvas {
    background-color: #6a4d3f;
    border: 1px solid #522;
    margin-top: 10px;
    margin-left: 50px;
    display: inline-block;
    border: 1px solid #522;
    background-image: radial-gradient(rgba(255, 255, 255, 0.4), rgba(26, 25, 25, 0));
    cursor: pointer;
    box-shadow: -2px -2px 2px #EFEFEF, 5Px 5px 5px #b9b9b9;
}

.container {
    width: auto;
    margin-left: -100px;
}
</style>