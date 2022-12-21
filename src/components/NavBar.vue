<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'battle' }">King Of Bots</router-link>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <!--如果想在属性中使用表达式，则用冒号引一下-->
            <router-link v-bind:class="route_name == 'battle' ? 'nav-link active': 'nav-link'" :to="{ name: 'battle' }">Battle</router-link>
          </li>
          <li class="nav-item">
            <router-link v-bind:class="route_name == 'record' ? 'nav-link active' : 'nav-link'" :to="{ name: 'record' }">Record</router-link>
          </li>
          <li class="nav-item">
            <router-link v-bind:class="route_name == 'rank' ? 'nav-link active' : 'nav-link'" :to="{ name: 'rank' }">Ranking</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Dingjianan
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'user_bots' }">My Bots</router-link>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="#">Exit</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
    
<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  setup() {
    const route = useRoute();
    let route_name = computed(() => route.name)
    return {
      route_name
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