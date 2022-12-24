import { API_URL } from "@/assets/apis/api";
import $ from 'jquery';

const UserModule = {
    state: {
        id: "",
        username: "",
        avatar: "",
        token: "",
        is_login: false,
    },
    getters: {
    },
    // 在mutations里更新state的状态 在actions里调用, 在mutations里不能执行异步操作
    mutations: {
        updateUserInfo(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.avatar = user.avatar;
            state.is_login = user.is_login;
        },
        updateToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.id = "";
            state.username = "";
            state.avatar = "";
            state.is_login = false;
        }
    },
    actions: {
        // context为上下文 用户点击登陆时调用
        login(context, userInfo) {
            $.ajax({
                url: `${API_URL}/account/token/`,
                type: "post",
                data: {
                    userName: userInfo.username, 
                    password: userInfo.password,
                },
                success(resp) {
                    if (resp.msg === "success") {
                        context.commit("updateToken", resp.token);  // 登陆成功后更新token
                        userInfo.success(resp); // 成功的回调函数
                    } else {
                        userInfo.error(resp);   // 失败的回调函数
                    }
                },
                error(resp) {
                    userInfo.error(resp);
                }
            })
        },

        //  从后端获取当前登陆的用户的信息，包括用户名、头像
        getInfo(context, data) {
            $.ajax({
                url: `${API_URL}/account/info/`,
                type: "get",
                headers: {
                  Authorization: "Bearer " + context.state.token,
                },
                success(resp) {
                    if (resp.msg === "success") {
                        console.log("!!", resp);
                        context.commit("updateUserInfo", {          // 更新用户信息 存储到store中
                            ...resp,    // 解构resp 直接填充到函数的参数列表中
                            is_login: true,
                        });
                        data.success(resp);
                    } else {
                        data.error(resp);
                    }
                },
                error(resp) {
                  data.error(resp);
                }
              })
        }
    },
    modules: {
    }
}

export default UserModule;
