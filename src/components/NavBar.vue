<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'home' }">AI Space</router-link>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <!--如果想在属性中使用表达式，则用冒号引一下-->
            <router-link v-bind:class="route_name == 'battle' ? 'nav-link active' : 'nav-link'"
              :to="{ name: 'battle' }">Battle</router-link>
          </li>
          <li class="nav-item">
            <router-link v-bind:class="route_name == 'goplay' ? 'nav-link active' : 'nav-link'"
              :to="{ name: 'goplay' }">Go</router-link>
          </li>
          <li class="nav-item">
            <router-link v-bind:class="route_name == 'record' ? 'nav-link active' : 'nav-link'"
              :to="{ name: 'record' }">Record</router-link>
          </li>
          <li class="nav-item">
            <router-link v-bind:class="route_name == 'rank' ? 'nav-link active' : 'nav-link'"
              :to="{ name: 'rank' }">Ranking</router-link>
          </li>
        </ul>

        <!--若用户已登录则展示用户信息菜单-->
        <ul class="navbar-nav" v-if="$store.state.user.is_login">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ $store.state.user.username }}
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'user_bots' }">My Bots</router-link>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="#" @click="logout">Exit</a></li>
            </ul>
          </li>
        </ul>

        <!--若用户未登录则展示登录-注册界面-->
        <ul class="navbar-nav" v-else>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'login' }">登录</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'register' }">注册</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
    
<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    let route_name = computed(() => route.name)

    const logout = () => {
      // 取消匹配
      store.state.game.socket.send(JSON.stringify({
        event: "cancel",
      }));
      store.dispatch("logout");
    }
    return {
      route_name,
      logout
    }
  },
  name: "NavBar"
}
</script>
    
    
<style scoped>
img {
  border-radius: 50%;
  width: 30px;
  height: 30px
}

.text {
  position: relative;
  top: 2px;
}
</style>