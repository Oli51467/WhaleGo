<template>
    <ContentBase>
        <div class="container">
            <div class="card-body">
                <el-tabs v-model="matchplay" type="border-card" @tab-click="handleClick" stretch=true tab-position="top"
                    class="play-board">

                    <el-tab-pane label="我的好友" class="settings">
                        <table class="table table-striped table-hover" style="text-align:center">
                            <tbody>
                                <tr v-for="friend in friends.users" :key="friend.id">
                                    <td>
                                        <img :src="friend.avatar" alt="" class="user-avatar">
                                        &nbsp;
                                        <span class="user-username"> {{ friend.username }}</span>
                                    </td>
                                    <td> {{ "棋力：" + friend.level }}</td>
                                    <td> {{ friend.win + "胜" }}</td>
                                    <td> {{ friend.lose + "负" }}</td>
                                    <td>
                                        <button type="button" class="btn btn-primary"
                                            style="margin-top:-4px">邀请对局</button>
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
                                        <span class="user-username"> {{ user.username }}</span>
                                    </td>
                                    <td> {{ "棋力：" + user.level }}</td>
                                    <td> {{ user.win + "胜" }}</td>
                                    <td> {{ user.lose + "负" }}</td>
                                    <td>
                                        <button type="button" class="btn btn-secondary" style="margin-top:-4px"
                                            @click="unfollow(user)" v-if="user.state === true">取消关注</button>

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
    </ContentBase>
</template>

<script>
import ContentBase from '@/components/ContentBase';
import $ from 'jquery';
import { API_URL } from "@/assets/apis/api";
import { useStore } from "vuex";
import { ref } from 'vue';

export default {
    // 存放templates中用到的其他组件
    components: {
        ContentBase
    },

    setup() {
        const store = useStore();
        let followed_users = ref([]);
        let followers = ref([]);
        let friends = ref([]);

        $.ajax({
            url: `${API_URL}/user/getFollowed/`,
            type: "get",
            headers: {
                Authorization: "Bearer " + store.state.user.token,
            },
            success(resp) {
                followed_users.value = resp;
                for(let user of followed_users.value.users) {
                    user.state = true
                }
                console.log(followed_users.value.users);
            },
            error(resp) {
                console.log(resp);
            }
        }),

            // $.ajax({
            //     url: `${API_URL}/user/getFollowers/`,
            //     type: "get",
            //     headers: {
            //         Authorization: "Bearer " + store.state.user.token,
            //     },
            //     success(resp) {
            //         followers.value = resp;
            //         console.log(followers.value.users);
            //     },
            //     error(resp) {
            //         console.log(resp);
            //     }
            // })

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
                    user.state = false;
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
                    user.state = true;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        return {
            followed_users,
            followers,
            friends,
            unfollow,
            follow,
        }
    }
}
</script>

<style scoped>
img.user-avatar {
    width: 4vh;
    border-radius: 50%;
}
</style>