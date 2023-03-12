<template>
    <el-skeleton :loading="friends_loading" :rows="6" animated></el-skeleton>
    <div>
        <table class="table table-striped table-hover" style="text-align:center">
            <tbody>
                <tr v-for="friend in friends.users" :key="friend.id">
                    <td>
                        <router-link :to="{ name: 'user_index', params: { userId: friend.id } }">
                            <img :src="friend.avatar" alt="" class="user-avatar" />
                        </router-link>
                        &nbsp;
                        <span class="user-info"> {{ friend.username }}</span>
                    </td>
                    <td v-if="friend.state == 1">
                        <el-tag type="success">在线</el-tag>
                    </td>
                    <td v-else>
                        <el-tag type="info">不在线</el-tag>
                    </td>
                    <td>
                        <el-tag type="danger" color="#ffd9b3">{{ "棋力：" + friend.level }}</el-tag>
                    </td>
                    <td>
                        <el-tag>{{ friend.win + "胜" }}</el-tag>
                    </td>
                    <td>
                        <el-tag>{{ friend.lose + "负" }}</el-tag>
                    </td>
                    <td>
                        <el-button plain v-if="friend.status === 'stand'"
                            v-bind:type="friend.state == 1 ? 'primary' : 'info'"
                            v-bind:disabled="friend.state == 1 ? false : true"  
                            @click="invite_play($store.state.user.id, friend.id)">邀请对局</el-button>
                        <el-button type="info" v-else-if="friend.status === 'playing'" disabled :loading="true">对局中</el-button>
                        <el-button type="info" v-else-if="friend.status === 'matching'" disabled :loading="true">匹配中</el-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { ElMessageBox } from 'element-plus';
export let request_play = ElMessageBox;
import { useStore } from 'vuex';

export default {
    props: {
        friends: {
            type: Object,
            required: true,
        },
        friends_loading: {
            type: Boolean,
            required: false,
        }
    },
    setup() {
        const store = useStore();

        const invite_play = (userId, friendId) => {
            store.state.gogame.socket.send(JSON.stringify({
                event: "request_play",
                request_id: userId,
                friend_id: friendId,
            }));
            request_play.alert('等待对方回应', {
                confirmButtonText: '取消',
                type: 'info',
                center: true,
                callback: () => {
                    store.state.gogame.socket.send(JSON.stringify({
                        event: "request_cancel",
                        friend_id: friendId,
                    }));
                }
            })
        }

        return {
            invite_play,
        }
    }
}
</script>

<style scoped>
.user-info {
    font-weight: 500;
    margin-top: -14px;
}

img.user-avatar {
    width: 4vh;
    height: 4vh;
    border-radius: 50%;
}
</style>