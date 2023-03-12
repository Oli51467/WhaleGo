<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <router-link class="navbar-brand title" :to="{ name: 'goplay' }">棋礧</router-link>
            <div class="collapse navbar-collapse" id="navbarText">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item nv">
                        <router-link v-bind:class="route_name == 'playhall' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'playhall' }">大厅</router-link>
                    </li>
                    <li class="nav-item nv">
                        <router-link v-bind:class="route_name == 'goplay' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'goplay' }">对弈</router-link>
                    </li>
                    <li class="nav-item nv">
                        <router-link v-bind:class="route_name == 'record' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'record' }">棋谱</router-link>
                    </li>
                    <li class="nav-item nv">
                        <router-link v-bind:class="route_name == 'friend' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'friend' }">好友</router-link>
                    </li>
                    <li class="nav-item nv">
                        <router-link v-bind:class="route_name == 'community' ? 'nav-link active' : 'nav-link'"
                            :to="{ name: 'community' }">社区</router-link>
                    </li>
                </ul>

                <div class="d-flex search">
                    <input class="form-control me-2" type="search" placeholder="搜索用户" aria-label="Search"
                        v-model="user_search">
                    <button class="btn btn-outline-success text-nowrap" data-bs-toggle="modal" data-bs-target="#search"
                        @click="search_user">
                        搜索
                    </button>
                </div>

                <!--若用户已登录则展示用户信息菜单-->
                <ul class="navbar-nav" v-if="$store.state.user.is_login">
                    <el-badge :value="total_message_unread" class="item">
                        <el-button size="small" @click="open_chat_body">
                            <span style="margin: 0 auto;">消息</span>
                        </el-button>
                    </el-badge>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            {{ $store.state.user.username }}
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <router-link class="dropdown-item"
                                    :to="{ name: 'user_index', params: { userId: $store.state.user.id } }">我的空间</router-link>
                            </li>
                            <li>
                                <router-link class="dropdown-item"
                                    :to="{ name: 'update_info', params: { userId: $store.state.user.id } }">个人信息</router-link>
                            </li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#" @click="logout">退出登陆</a></li>
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
                                <td
                                    v-if="user.info.username != $store.state.user.username && user.relation === 'stranger' || user.relation === 'follower'">
                                    <el-button type="success" @click="follow">关注</el-button>
                                </td>
                                <td
                                    v-else-if="user.info.username != $store.state.user.username && user.relation === 'followed'">
                                    <el-button type="info" @click="unfollow">已关注</el-button>
                                </td>
                                <td
                                    v-else-if="user.info.username != $store.state.user.username && user.relation === 'friend'">
                                    <el-button type="info" @click="unfollow">互相关注</el-button>
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

    <ChatBox @open_chat_body="open_chat_body" :show_chat="show_chat" v-if="$store.state.user.is_login"></ChatBox>
</template>
    
<script>
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { API_URL } from '@/assets/apis/api';
import { onMounted } from 'vue';
import $ from 'jquery';
import ChatBox from '@/components/base/ChatBox.vue';

export let total_message_unread = ref(0);

export default {
    components: {
        ChatBox,
    },
    setup() {
        const route = useRoute();
        const store = useStore();
        let user_search = ref('');
        let user = ref([]);
        let show_chat = ref(false);
        let route_name = computed(() => route.name);

        onMounted(() => {
            $.ajax({
                url: `${API_URL}/messages/getCount/`,
                type: "get",
                data: {
                    user_id: store.state.user.id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    total_message_unread.value = resp.data;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        })

        const logout = () => {
            store.commit("updateWhich", 0);
            store.commit("updateCurrent", 0);
            store.commit("updateBoard", null);
            store.dispatch("logout");
        }

        const search_user = () => {
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

        const follow = () => {
            $.ajax({
                url: `${API_URL}/friend/follow/`,
                type: "post",
                data: {
                    username: user_search.value,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success() {
                    if (user.value.relation === 'stranger') {
                        user.value.relation = 'followed';
                    } else if (user.value.relation === 'follower') {
                        user.value.relation = 'friend';
                    }
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const unfollow = () => {
            $.ajax({
                url: `${API_URL}/friend/unfollow/`,
                type: "post",
                data: {
                    username: user_search.value,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success() {
                    if (user.value.relation === 'friend') {
                        user.value.relation = 'follower';
                    } else if (user.value.relation === 'followed') {
                        user.value.relation = 'stranger';
                    }
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const open_chat_body = () => {
            show_chat.value = !show_chat.value;
        }

        return {
            route_name,
            user_search,
            user,
            show_chat,
            total_message_unread,
            search_user,
            logout,
            follow,
            unfollow,
            open_chat_body,
        }
    },
}
</script>
    
<style scoped>
img {
    width: 4vh;
    height: 4vh;
    margin-right: 10px;
    cursor: pointer;
}

.nv {
    margin-left: 1vw;
}

.title {
    margin-left: 5vw;
}

.search {
    margin: 0 auto;
}

.item {
    margin-top: 8px;
    margin-right: 50px;
}
</style>