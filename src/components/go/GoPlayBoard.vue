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
            <div class="col-3 func">
                <button type="button" class="btn btn-info btn-lg" disabled="true">申请数目</button>
            </div>
            <div class="col-3 func">
                <button type="button" class="btn btn-success btn-lg" disabled="true">形势判断</button>
            </div>
            <div class="col-3 func">
                <button type="button" class="btn btn-secondary btn-lg" disabled="true">申请和棋</button>
            </div>
            <div class="col-2 func">
                <button type="button" class="btn btn-danger btn-lg" @click="click_resign">认输</button>
            </div>
        </div>

    </div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted } from 'vue';
import { ref } from 'vue';

export default {
    setup() {
        const store = useStore();
        let canvas = ref(null);
        let canvas1 = ref(null);

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

        const click_resign = () => {
            store.state.gogame.socket.send(JSON.stringify({
                event: "play",
                x: -1,
                y: -1,
            }));
        }

        return {
            click_resign,
            canvas,
            canvas1
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