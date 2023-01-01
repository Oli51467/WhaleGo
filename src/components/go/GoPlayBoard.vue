<template>
    <div class="playboard">
        <div class="row">
            <div class="col-3">
                <div class="user-avatar">
                    <img :src="$store.state.user.avatar" alt="">
                </div>
                <div class="username" style="margin-top: 20px;">
                    {{ $store.state.user.username }}
                </div>
                <div class="parent">
                    <canvas ref="canvas" tabindex="0"></canvas>
                </div>
            </div>
            <div class="col-3">
                <div class="user-avatar">
                    <img :src="$store.state.gogame.opponent_avatar" alt="">
                </div>
                <div class="username" style="margin-top: 20px;">
                    {{ $store.state.gogame.opponent_username }}
                </div>
                <div class="parent">
                    <canvas ref="canvas1" tabindex="0"></canvas>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-4 func">
                <button type="button" class="btn btn-warning btn-lg" @click="click_resign">认输</button>
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

        onMounted (() => {
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
div.playboard {
    width: 40vw;
    margin: 40px 10vw auto;
}

div.user-avatar {
    text-align: center;
}

div.user-avatar>img {
    width: 15vh;
    border-radius: 10%;
}

div.username {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: black;
    padding-left: -5px;
}

.func {
    text-align: center;
    width: 50%;
    padding-top: 10vh;
}

.parent {
    width: 20%;  
    margin: 0 auto; 
}

canvas {
    width: 400%;
    margin-left: -20px;
}
</style>