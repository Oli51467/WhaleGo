<template>
    <ContentBase>
        <div class="row justify-content-md-center">
            <div class="col-3">
                <!--为表单设置点击事件 并使用.prevent屏蔽其他事件-->
                <form @submit.prevent="register">
                    <div class="mb-3">
                        <label for="username" class="form-label">用户名</label>
                        <input v-model="username" class="form-control" id="username">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">密码</label>
                        <input v-model="password" type="password" class="form-control" id="pwd">
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
import $ from 'jquery'
import { useStore } from 'vuex'
import { ref } from 'vue'
import { API_URL } from '@/assets/apis/api'
import router from '@/router'

export default {
    name: "RegisterView",
    components: {
        ContentBase,
    },

    setup() {
        const store = useStore();
        let username = ref('');
        let password = ref('');
        let passwordConfirm = ref('');
        let errorMessage = ref('');

        const check = () => {
            if (username.value.trim().length == 0) {
                errorMessage.value = "用户名不能为空";
                return false;
            }
            if (username.value.length > 15) {
                errorMessage.value = "用户名长度不能大于15";
                return false;
            }
            if (password.value === "" || passwordConfirm.value === "") {
                errorMessage.value = "密码不能为空";
                return false;
            }
            if (password.value.length > 30 || passwordConfirm.value.length > 30) {
                errorMessage.value = "密码长度不能大于30";
                return false;
            }
            if (password.value != passwordConfirm.value) {
                errorMessage.value = "两次输入的密码不一致";
                return false;
            }
            return true;
        }

        const register = () => {
            errorMessage.value = "";
            if (!check()) {
                return;
            }
            $.ajax({
                url: `${API_URL}/account/register/`,
                type: "post",
                data: {
                    username: username.value,
                    password: password.value,
                },
                success(resp) {
                    console.log(resp);
                    if (resp.msg === "用户名已存在") {
                        errorMessage.value = "该用户名已被注册";
                        return;
                    } else {
                        store.dispatch("login", {
                            username: username.value,
                            password: password.value,
                            success() {
                                store.dispatch("getInfo", {
                                    success() {
                                        router.push({ name: 'playhall' });
                                        console.log(store.state.user);
                                    },
                                    error() {
                                        errorMessage.value = "系统异常,请稍后重试";
                                        return;
                                    }
                                })
                            },
                            error() {
                                errorMessage.value = "系统异常,请稍后重试";
                                return;
                            }
                        })
                    }
                },
                error() {
                    errorMessage.value = "系统异常,请稍后重试";
                }
            })
        }

        return {
            username,
            password,
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