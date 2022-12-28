<template>
  <ContentBase>
    <GoPlayGround></GoPlayGround>
  </ContentBase>
</template>
  
<script>
import ContentBase from '@/components/ContentBase';
import GoPlayGround from '@/components/go/GoPlayGround.vue'
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'RecordIndex',
  // 存放templates中用到的其他组件
  components: {
    ContentBase,
    GoPlayGround
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

  }
}
</script>
  
<style scoped>

</style>