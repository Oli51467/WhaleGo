<template>
    <ContentBase>
        <div class="container">
            <div class="card-body">
                <el-tabs type="border-card" :stretch=true tab-position="top" class="play-board">

                    <el-tab-pane label="我的好友" class="settings">
                        <table class="table table-striped table-hover" style="text-align:center">
                            <tbody>
                                <tr v-for="friend in friends.users" :key="friend.id">
                                    <td>
                                        <router-link :to="{ name: 'user_index', params:{userId:friend.id }}">
                                            <img :src="friend.avatar" alt="" class="user-avatar"/>
                                        </router-link>
                                        &nbsp;
                                        <span class="user-info"> {{ friend.username }}</span>
                                    </td>
                                    <td v-if="friend.state == 1">
                                        <span class="on">在线</span>
                                    </td>
                                    <td v-else>
                                        <span class="off">不在线</span>
                                    </td>
                                    <td>
                                        <span class="user-info">
                                            {{ "棋力：" + friend.level }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="user-info">
                                            {{ friend.win + "胜" }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="user-info">
                                            {{ friend.lose + "负" }}
                                        </span>
                                    </td>
                                    <td>
                                        <button type="button" style="margin-top:-4px" v-if="friend.status === 'stand'"
                                            v-bind:class="friend.state == 1 ? 'btn btn-primary' : 'btn btn-secondary'"
                                            v-bind:disabled="friend.state == 1 && $store.state.user.request_player_id == '' ? false : true"
                                            @click="invite_play($store.state.user.id, friend.id)">邀请对局</button>
                                        <button type="button" style="margin-top:-4px" v-else-if="friend.status === 'playing'"
                                            class="btn btn-secondary" disabled="true">对局中</button>
                                        <button type="button" style="margin-top:-4px" v-else-if="friend.status === 'matching'"
                                            class="btn btn-secondary" disabled="true">匹配中</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </el-tab-pane>

                    <el-tab-pane label="我的关注" class="settings">
                        <table class="table table-striped table-hover" style="text-align:center">
                            <tbody>
                                <tr v-for="user in followed_users.users" :key="user.id">
                                    <td>
                                        <img :src="user.avatar" alt="" class="user-avatar">
                                        &nbsp;
                                        <span class="user-info"> {{ user.username }}</span>
                                    </td>
                                    <td>
                                        <span class="user-info">
                                            {{ "棋力：" + user.level }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="user-info">
                                            {{ user.win + "胜" }}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="user-info">
                                            {{ user.lose + "负" }}
                                        </span>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-secondary" style="margin-top:-4px"
                                            @click="unfollow(user)" v-if="user.follow === true">取消关注</button>

                                        <button type="button" class="btn btn-success" style="margin-top:-4px"
                                            @click="follow(user)" v-else>关注</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </el-tab-pane>

                    <!-- <el-tab-pane label="我的粉丝" class="settings">
                        <table class="table table-striped table-hover" style="text-align:center">
                            <tbody>
                                <tr v-for="follower in followers.users" :key="follower.id">
                                    <td>
                                        <img :src="follower.avatar" alt="" class="user-avatar">
                                        &nbsp;
                                        <span class="user-username"> {{ follower.username }}</span>
                                    </td>
                                    <td> {{ "棋力：" + follower.level }}</td>
                                    <td> {{ follower.win + "胜" }}</td>
                                    <td> {{ follower.lose + "负" }}</td>
                                    <td>
                                        <button type="button" class="btn btn-success"
                                            style="margin-top:-4px">关注</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </el-tab-pane> -->
                </el-tabs>
            </div>
        </div>
        <InteractiveComponents />
    </ContentBase>
</template>

<script>
import ContentBase from '@/components/base/ContentBase.vue';
import InteractiveComponents from '@/components/popups/InteractiveComponents.vue';
import $ from 'jquery';
import { API_URL } from "@/assets/apis/api";
import { useStore } from "vuex";
import { ref } from 'vue';

export default {
    // 存放templates中用到的其他组件
    components: {
        ContentBase,
        InteractiveComponents,
    },

    setup() {
        const store = useStore();
        let followed_users = ref([]);
        let followers = ref([]);
        let friends = ref([]);
        store.commit("updateRequestPlayerId", '');
        store.commit("updateInvitePlayerId", '');
        store.commit("updateRefused", '');

        $.ajax({
            url: `${API_URL}/user/getFollowed/`,
            type: "get",
            headers: {
                Authorization: "Bearer " + store.state.user.token,
            },
            success(resp) {
                followed_users.value = resp;
                for (let user of followed_users.value.users) {
                    user.follow = true
                }
                console.log(followed_users.value.users);
            },
            error(resp) {
                console.log(resp);
            }
        })

        $.ajax({
            url: `${API_URL}/user/getFriends/`,
            type: "get",
            headers: {
                Authorization: "Bearer " + store.state.user.token,
            },
            success(resp) {
                friends.value = resp;
                console.log(friends.value.users);
            },
            error(resp) {
                console.log(resp);
            }
        })

        const unfollow = (user) => {
            $.ajax({
                url: `${API_URL}/user/unfollow/`,
                type: "post",
                data: {
                    username: user.username,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success() {
                    user.follow = false;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const follow = (user) => {
            $.ajax({
                url: `${API_URL}/user/follow/`,
                type: "post",
                data: {
                    username: user.username,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success() {
                    user.follow = true;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const invite_play = (userId, friendId) => {
            store.commit("updateRequestPlayerId", friendId);        // 请求的对手的id
            store.state.gogame.socket.send(JSON.stringify({
                event: "request_play",
                request_id: userId,
                friend_id: friendId,
            }));
        }

        return {
            followed_users,
            followers,
            friends,
            unfollow,
            follow,
            invite_play,
        }
    }
}
</script>

<style scoped>
img.user-avatar {
    width: 4vh;
    border-radius: 50%;
}

.user-info {
    font-weight: 500;
    margin-top: -14px;
}

.on {
    color: green;
    font-weight: 600;
}
</style>