<template>
    <ContentBase>
        <div class="row justify-content-md-center">
            <div class="col-3">
                <!--为表单设置点击事件 并使用.prevent屏蔽其他事件-->
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label for="userame" class="form-label">用户名</label>
                        <input v-model="username" class="form-control" id="username" aria-describedby="emailHelp">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">密码</label>
                        <input v-model="password" type="password" class="form-control" id="password">
                    </div>
                    <div class="error_message">{{ error_message }}</div>
                    <button type="submit" class="btn btn-primary">登录</button>
                </form>
            </div>
        </div>
    </ContentBase>
</template>
  
<script>
import ContentBase from '@/components/base/ContentBase'
import { useStore } from 'vuex';
import { ref } from 'vue'
import router from '@/router';

export default {
    name: "LoginView",
    components: {
        ContentBase,
    },

    setup() {
        const store = useStore();
        let username = ref('');
        let password = ref('');
        let error_message = ref('');

        const login = () => {
            error_message.value = "";
            store.dispatch("login", {
                username: username.value,
                password: password.value,
                success() {
                    store.dispatch("getInfo", {
                        success() {
                            localStorage.setItem('store', JSON.stringify(store.state));
                            router.replace({ name: 'goplay' });
                        }
                    })
                },
                error(resp) {
                    console.log("dispatch login ->", resp);
                    error_message.value = "用户名或密码错误";
                }
            })
        }
        return {
            username,
            password,
            error_message,
            login,
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