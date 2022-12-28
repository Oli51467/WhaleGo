<template>
    <GoPlayGround/>
    <GoResultBoard v-if="$store.state.gogame.loser ==='myself' ||  $store.state.gogame.loser ==='oppo'"/>
</template>
  
<script>
import GoPlayGround from '@/components/go/GoPlayGround.vue'
import GoResultBoard from '@/components/go/GoResultBoard.vue'
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'RecordIndex',
  // 存放templates中用到的其他组件
  components: {
    GoPlayGround,
    GoResultBoard,
  },

  setup() {
    const store = useStore();
    const goSocketUrl = `ws://127.0.0.1:3000/go/websocket/${store.state.user.token}`;
    let socket = null;
    onMounted(() => {
      store.commit("updateGoOpponent", {
        username: "旗鼓相当的对手",
        avatar: '/robot.jpeg',
      });
      store.commit("updateGoLoser", "none");
      store.commit("updateGoGameStatus", "waiting");
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
          store.commit("updateGoGameStatus", "playing");
          store.commit("updateGoGame", data.game);
        } else if (data.event === "result") {
          console.log(data.loser, store.state.gogame.black_id, store.state.gogame.white_id);
          if (store.state.user.id == data.loser) {
            store.commit("updateGoLoser", "myself");
          } else {
            store.commit("updateGoLoser", "oppo");
          }
        }
      }

      socket.onclose = () => {
        console.log("Disconnected");
      }
    });

    onUnmounted(() => {
      socket.close();
      store.commit("updateGoGameStatus", "waiting");
    })

  }
}
</script>
  
<style scoped>

</style>