<template>
    <ContentBase>
        <div class="container">
            <div class="card-body">
                <el-tabs type="border-card" :stretch=true tab-position="top" class="play-board">

                    <el-tab-pane label="我的好友" class="settings">
                        <MyFriendPage :friends="friends"/>
                    </el-tab-pane>

                    <el-tab-pane label="我的关注" class="settings">
                        <MyFollowedPage :followed_users="followed_users"/>
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
import ContentBase from '@/components/base/ContentBase.vue';
import MyFriendPage from '@/components/friend/MyFriendPage.vue';
import MyFollowedPage from '@/components/friend/MyFollowedPage.vue';
import $ from 'jquery';
import { API_URL } from "@/assets/apis/api";
import { useStore } from "vuex";
import { ref } from 'vue';

export default {
    // 存放templates中用到的其他组件
    components: {
        ContentBase,
        MyFriendPage,
        MyFollowedPage,
    },

    setup() {
        const store = useStore();
        let followed_users = ref([]);
        let followers = ref([]);
        let friends = ref([]);

        $.ajax({
            url: `${API_URL}/friend/getFollowed/`,
            type: "get",
            headers: {
                Authorization: "Bearer " + store.state.user.token,
            },
            success(resp) {
                followed_users.value = resp;
                for (let user of followed_users.value.users) {
                    user.follow = true
                }
            },
            error(resp) {
                console.log(resp);
            }
        })

        $.ajax({
            url: `${API_URL}/friend/get/`,
            type: "get",
            headers: {
                Authorization: "Bearer " + store.state.user.token,
            },
            success(resp) {
                friends.value = resp;
            },
            error(resp) {
                console.log(resp);
            }
        })

        return {
            followed_users,
            followers,
            friends,
        }
    }
}
</script>

<style scoped>
</style>