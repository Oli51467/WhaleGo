<template>
  <NavBar/>
  <router-view/>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import NavBar from './components/NavBar.vue';
import $ from 'jquery'

export default {
    components: { 
      NavBar 
    },

    setup() {
      $.ajax({
        url: "http://127.0.0.1:3000/api/account/info/",
        type: "post",
        headers: {
          Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4MjA3NGYzOTVjYTg0ZDE5YTczZTMwOTAyYzEwODdhZCIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTY3MTgxNDgyMCwiZXhwIjoxNjczMDI0NDIwfQ.eY1Gkp7zhGoKIUrEdQppqqGiMiXKZO24SWqjiBszh7s"
        },
        success(resp) {
          console.log(resp);
        },
        error(resp) {
          console.log(resp);
        }
      })

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
}
</script>

<style>
body {
  background-image: url('@/assets/images/background.png');
  background-size: cover;
}
</style>
