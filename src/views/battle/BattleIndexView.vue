<template>
  <PlayGround v-if="$store.state.socket.status === 'playing'" />
  <MatchGround v-else />
</template>

<script>
import PlayGround from '@/components/PlayGround.vue';
import MatchGround from '@/components/MatchGround.vue';
//import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'BattleIndex',
  // 存放templates中用到的其他组件
  components: {
    PlayGround,
    MatchGround,
  },

  setup() {
    const store = useStore();
    //const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}`;

    store.commit("updateOpponent", {
      username: "旗鼓相当的对手",
      avatar: "",
    })

    // let socket = null;

    // // 当组件被挂载时建立socket连接
    // onMounted(() => {
    //   socket = new WebSocket(socketUrl);

    //   socket.onopen = () => {
    //     console.log("WebSocket Connected!");
    //   }

    //   socket.onmessage = msg => {
    //     const data = JSON.parse(msg.data);
    //     console.log(data);
    //   }

    //   socket.onclose = () => {
    //     console.log("Disconnected!");
    //   }
    // });

    // onUnmounted(() => {
    //   socket.close();
    // })
  }
}
</script>

<style scoped>

</style>