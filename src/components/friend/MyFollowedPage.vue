<template>
    <div>
        <table class="table table-striped table-hover" style="text-align:center">
            <tbody>
                <tr v-for="user in followed_users.users" :key="user.id">
                    <td>
                        <img :src="user.avatar" alt="" class="user-avatar">
                        &nbsp;
                        <span class="user-info"> {{ user.username }}</span>
                    </td>
                    <td v-if="user.state == 1">
                        <span class="on">在线</span>
                    </td>
                    <td v-else>
                        <span class="off">不在线</span>
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
                        <el-button type="info" plain @click="unfollow(user)" v-if="user.follow === true">取消关注</el-button>
                        <el-button type="success" plaing @click="follow(user)" v-else>关注</el-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import $ from 'jquery';
import { API_URL } from '@/assets/apis/api';
import { useStore } from 'vuex';

export default {
    props: {
        followed_users: {
            type: Object,
            required: true,
        },
    },
    setup() {
        const store = useStore();
        const unfollow = (user) => {
            $.ajax({
                url: `${API_URL}/friend/unfollow/`,
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
                url: `${API_URL}/friend/follow/`,
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

        return {
            follow,
            unfollow,
        }
    }
}
</script>

<style scoped>
.chatbody {
    text-align: center;
    /*让div内部文字居中*/
    background-color: lightgrey;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 999;
}

.user-info {
    font-weight: 500;
    margin-top: -14px;
}

img.user-avatar {
    width: 4vh;
    border-radius: 50%;
}

.on {
    color: green;
    font-weight: 600;
}
</style>