<template>
  <PlayGround v-if="$store.state.game.status === 'playing'" />
  <MatchGround v-if="$store.state.user.is_login && $store.state.game.status != 'playing'" />
  <ResultBoard
    v-if="$store.state.game.loser === 'A' || $store.state.game.loser === 'B' || $store.state.game.loser === 'all'" />
</template>

<script>
import PlayGround from '@/components/PlayGround.vue';
import MatchGround from '@/components/MatchGround.vue';
import ResultBoard from '@/components/ResultBoard.vue';
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'BattleIndex',
  // 存放templates中用到的其他组件
  components: {
    PlayGround,
    MatchGround,
    ResultBoard,
  },

  setup() {
    const store = useStore();
    const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}`;
    let socket = null;
    // 当组件被挂载时建立socket连接
    onMounted(() => {
      store.commit("updateOpponent", {
        username: "旗鼓相当的对手",
        avatar: '/robot.jpeg',
      })
      socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        console.log("WebSocket Connected!");
        store.commit("updateSocket", socket);
      }

      socket.onmessage = msg => {
        const data = JSON.parse(msg.data);
        if (data.event === "start") { // 匹配成功
          console.log(data.opponent_username + data.opponent_avatar);
          store.commit("updateOpponent", {
            username: data.opponent_username,
            avatar: data.opponent_avatar,
          });
          store.commit("updateStatus", "pending");
          if (data.opponent_username === 'bot') {
            setTimeout(() => {
              store.commit("updateStatus", "playing");
            }, 200);
          } else {
            setTimeout(() => {
              store.commit("updateStatus", "playing");
            }, 2000);
          }
          store.commit("updateGame", data.game);
        } else {
          const game = store.state.game.gameObject;
          const [snake0, snake1] = game.snakes;
          snake0.set_direction(data.a_direction);
          snake1.set_direction(data.b_direction);
          if (data.event === "result") {
            console.log(data.a_direction, data.b_direction);
            if (data.loser === "all" || data.loser === "A") {
              snake0.status = "die";
              store.commit("updateLoser", data.loser);
            }
            if (data.loser === "all" || data.loser === "B") {
              snake1.status = "die";
              store.commit("updateLoser", data.loser);
            }
          }
        }
      }

      socket.onclose = () => {
        console.log("Disconnected!");
      }
    });

    onUnmounted(() => {
      socket.close();
      store.commit("updateStatus", "waiting");
      store.commit("updateLoser", "none");
    })
  }
}
</script>

<style scoped>

</style>