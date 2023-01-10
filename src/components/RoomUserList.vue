<template>
    <div class="row">
        <div class="col-11">
            <!--所有在房间的人-->
            <table class="table table-striped table-hover" style="text-align:center">
                <thead>
                    <tr>
                        <th>用户</th>
                        <th>段位</th>
                        <th>胜</th>
                        <th>负</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users.items" :key="user.user_id">
                        <td>
                            <div>
                                <img :src="user.user_avatar" alt="" class="user-avatar-guest">
                                &nbsp;
                                <span> {{ user.user_name }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="user-info">
                                <button class="btn btn-outline-info"> {{ user.user_level }} </button>
                            </div>
                        </td>
                        <td>
                            <div class="user-username">
                                <span> {{ user.user_lose }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="user-username">
                                <span> {{ user.user_win }}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--end-->
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref } from 'vue';
import router from '@/router';
import $ from 'jquery';
import { API_URL } from '@/assets/apis/api';

export default {
    props: {
        roomId: {
            type: String,
            required: true,
        }
    },
    setup(props) {
        let users = ref([]);
        const store = useStore();
        const pull_users_in_room = setInterval(() => {
            $.ajax({
                url: `${API_URL}/room/getUsers/`,
                type: "get",
                data: {
                    room_id: props.roomId,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.event === 'empty_room') {
                        router.push({
                            name: '404',
                        })
                    }
                    users.value = resp;
                },
                error(resp) {
                    console.log(resp);
                    clearInterval(pull_users_in_room);
                }
            })
        }, 1000);
        

        return {
            pull_users_in_room,
            users,
        }
    }
}
</script>

<style scoped>
.row {
    margin-top: 15px;
}

.user-avatar-guest {
    border-radius: 50%;
    width: 4vh;
    text-align: center;
}
</style>