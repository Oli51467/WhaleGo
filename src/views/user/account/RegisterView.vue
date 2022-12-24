<template>
    <ContentBase>
      <div class="row justify-content-md-center">
        <div class="col-3">
          <!--为表单设置点击事件 并使用.prevent屏蔽其他事件-->
          <form @submit.prevent="register">
            <div class="mb-3">
              <label for="userName" class="form-label">用户名</label>
              <input v-model="userName" class="form-control" id="username">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">密码</label>
              <input v-model="passWord" type="password" class="form-control" id="pwd">
            </div>
            <div class="mb-3">
              <label for="password_confirm" class="form-label">确认密码</label>
              <input v-model="passwordConfirm" type="password" class="form-control" id="pwd_confirm">
            </div>
            <div class="error_message">{{ errorMessage }}</div>
            <button type="submit" class="btn btn-primary">注册</button>
          </form>
        </div>
      </div>
    </ContentBase>
  </template>
  
  
  <script>
  import ContentBase from '@/components/ContentBase'
  //import $ from 'jquery'
  import { ref } from 'vue'
  
  export default {
    name: "RegisterView",
    components: {
      ContentBase,
    },
  
    setup() {
      let userName = ref('');
      let passWord = ref('');
      let passwordConfirm = ref('');
      let errorMessage = ref('');
  
      const register = () => {
        if (passWord.value != passwordConfirm.value) {
          errorMessage.value = "两次输入的密码不一致";
          return;
        }
        // let data = { "userName": userName.value, "phoneNumber": phoneNumber.value, "userId": userName.value + phoneNumber.value };
        // let res = apis.checkUser(data);
        // res.then(resp => {
        //   console.log("resp->", resp);
        //   if (resp.data.code === 200) {
        //     errorMessage.value = "该用户名或手机号已被注册";
        //     return;
        //   } else if (resp.data.status === 'nullObject') {
        //     errorMessage.value = "";
        //     let data = { "userName": userName.value, "phoneNumber": phoneNumber.value, "password": passWord.value, "email": email.value };
        //     let res = apis.addUser(data);
        //     res.then(resp => {
        //       if (resp.data.status === 'success') {
        //         store.dispatch("login", {
        //           userName: userName.value,
        //           password: passWord.value,
        //           phoneNumber: phoneNumber.value,
        //           email: email.value,
        //           // 登录成功 跳转到主页
        //           success() {
        //             router.push({name: 'home'});
        //           },
        //           error() {
        //             errorMessage.value = "系统异常,请稍后重试";
        //           }
        //         })
        //       } else {
        //         errorMessage.value = "服务器异常";
        //       }
        //     });
        //   } else {
        //     errorMessage.value = "服务器异常";
        //   }
        // });
      }
  
      return {
        userName,
        passWord,
        passwordConfirm,
        errorMessage,
        register,
      }
    },
  
  }
  </script>
  
  <style scoped>
  button {
    width: 100%;
  }
  
  .error_message {
    color: red;
  }
  </style>