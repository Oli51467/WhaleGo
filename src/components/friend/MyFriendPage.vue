<template>
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
                        <el-button plain v-if="friend.status === 'stand'"
                            v-bind:type="friend.state == 1 ? 'primary' : 'info'"
                            v-bind:disabled="friend.state == 1 ? false : true"  
                            @click="invite_play($store.state.user.id, friend.id)">邀请对局</el-button>
                        <el-button type="info" v-else-if="friend.status === 'playing'" disabled>对局中</el-button>
                        <el-button type="info" v-else-if="friend.status === 'matching'" disabled="true">匹配中</el-button>
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

.on {
    color: green;
    font-weight: 600;
}

img.user-avatar {
    width: 4vh;
    border-radius: 50%;
}
</style>