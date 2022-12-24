import { API_URL } from "@/assets/apis/api";
import $ from 'jquery';

const UserModule = {
    state: {
        id: "",
        username: "",
        avatar: "",
        token: "",
        password: "",
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
            state.password = user.password;
            state.is_login = user.is_login;
        },
        updateToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.id = "";
            state.username = "";
            state.password = "";
            state.avatar = "";
            state.is_login = false;
        }
    },
    actions: {
        // context为上下文
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
                        context.commit("updateUserInfo", {          // 更新用户信息 存储到store中
                            id: userInfo.id,
                            username: userInfo.username,
                            password: userInfo.password,
                            avatar: userInfo.avatar,
                            is_login: true,
                        });
                        userInfo.success(resp); // 成功的回调函数
                    } else {
                        userInfo.error(resp);   // 失败的回调函数
                    }
                },
                error(resp) {
                    userInfo.error(resp);
                }
            })
        }
    },
    modules: {
    }
}

export default UserModule;
