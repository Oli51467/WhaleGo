<template>
  <NavBar />
  <router-view />
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import NavBar from './components/NavBar.vue';

export default {
  components: {
    NavBar
  },

  // 解决f5刷新后数据不丢失的问题
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      // 存储状态
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }
    // 在页面刷新时将vue里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }

  // $.ajax({
  //   url: "http://127.0.0.1:3000/api/account/register/",
  //   type: "post",
  //   data: {
  //     username: "abc",
  //     password: "123",
  //     confirmedPassword: "123",
  //   },
  //   success(resp) {
  //     console.log(resp);
  //   },
  //   error(resp) {
  //     console.log(resp);
  //   }
  // })
}
</script>

<style>
body {
  background-image: url('@/assets/images/background.png');
  background-size: cover;
}
</style>
