<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <router-link class="navbar-brand" :to="{ name: 'home' }">AI Space</router-link>
            <div class="collapse navbar-collapse" id="navbarText">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <!--如果想在属性中使用表达式，则用冒号引一下-->
                        <router-link v-bind:class="route_name == 'battle' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'battle' }">贪吃蛇</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link v-bind:class="route_name == 'goplay' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'goplay' }">围棋</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link v-bind:class="route_name == 'record' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'snakerecord' }">对战记录</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link v-bind:class="route_name == 'rank' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'rank' }">我的好友</router-link>
                    </li>
                    <li>
                        <div class="d-flex" style="margin: 0 18vw auto">
                            <input class="form-control me-2" type="search" placeholder="搜索用户" aria-label="Search"
                                style="width: 15vw" v-model="user_search">
                            <button class="btn btn-outline-success" type="submit" data-bs-toggle="modal"
                                data-bs-target="#search" @click="search_user">Search</button>
                        </div>
                    </li>
                </ul>

                <!--若用户已登录则展示用户信息菜单-->
                <ul class="navbar-nav" v-if="$store.state.user.is_login">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            {{ $store.state.user.username }}
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <router-link class="dropdown-item" :to="{ name: 'user_bots' }">个人中心</router-link>
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

    <!-- Modal -->
    <div class="modal fade" id="search" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">查找用户</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-striped table-hover" style="text-align:center">
                        <tbody>
                            <tr v-if="user.user === 'exist'">
                                <td>
                                    <img :src="user.info.avatar" alt="" class="record-user-avatar">
                                    &nbsp;
                                    <span class="record-user-username"> {{ user.info.username }}</span>
                                </td>
                                <td>
                                    <span class="record-user-username"> {{ user.info.level }}</span>
                                </td>
                                <td>
                                    <button type="button" style="margin-top:-4px" class="btn btn-success">关注</button>
                                </td>
                            </tr>
                            <tr v-else>
                                <span>该用户不存在</span>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { API_URL } from '@/assets/apis/api';
import $ from 'jquery'

export default {
    setup() {
        const route = useRoute();
        const store = useStore();
        let user_search = ref('');
        let user = ref([]);
        let route_name = computed(() => route.name)

        const logout = () => {
            // 取消匹配
            store.state.game.socket.send(JSON.stringify({
                event: "cancel",
            }));
            store.dispatch("logout");
        }

        const search_user = () => {
            console.log(user_search.value);
            $.ajax({
                url: `${API_URL}/user/get/`,
                type: "get",
                data: {
                    username: user_search.value,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    user.value = resp;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        return {
            route_name,
            user_search,
            user,
            search_user,
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