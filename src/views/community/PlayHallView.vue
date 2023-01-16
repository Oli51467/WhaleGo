<template>
    <ContentBase>
        <div class="title">
            <span>对局大厅</span>
            <hr />
        </div>

        <table class="table table-striped table-hover" style="text-align:center">
            <thead>
                <tr>
                    <th>黑方</th>
                    <th>段位</th>
                    <th>白方</th>
                    <th>段位</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="game in games.games" :key="game.id">
                    <td>
                        <div class="user-username">
                            <img :src="game.black_avatar" alt="" class="user-avatar">
                            &nbsp;
                            <span> {{ game.black_username }}</span>
                        </div>
                    </td>
                    <td>
                        <div class="user-info">
                            <button class="btn btn-outline-info"> {{ game.black_level }} </button>
                        </div>
                    </td>
                    <td>
                        <div class="user-username">
                            <img :src="game.white_avatar" alt="" class="user-avatar">
                            &nbsp;
                            <span> {{ game.white_username }}</span>
                        </div>
                    </td>
                    <td>
                        <div class="user-info">
                            <button class="btn btn-outline-info"> {{ game.white_level }} </button>
                        </div>
                    </td>
                    <td>
                        <div class="user-info">
                            <button class="btn btn-outline-success" v-if="game.state === '布局'">
                                {{ game.state }}
                            </button>
                            <button class="btn btn-outline-warning" v-else-if="game.state === '中盘'"> {{ game.state }}
                            </button>
                            <button class="btn btn-outline-danger" v-else-if="game.state === '官子'"> {{ game.state }}
                            </button>
                            <button class="btn btn-outline-secondary" v-else> {{ game.state }}
                            </button>

                        </div>
                    </td>
                    <td>
                        <div class="user-info">
                            <button class="btn btn-outline-primary" @click="watch_game(game.id)"> 观战</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </ContentBase>
</template>

<script>
import { useStore } from 'vuex';
import ContentBase from '@/components/base/ContentBase.vue';
import { onMounted, ref } from "vue";
import $ from 'jquery'
import { API_URL } from "@/assets/apis/api";
import router from '@/router';

export default {
    components: {
        ContentBase,
    },

    setup() {
        const store = useStore();
        let games = ref([]);

        onMounted(() => {
            $.ajax({
                url: `${API_URL}/game/getInProcess/`,
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    games.value = resp;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        })

        const watch_game = (roomId) => {
            store.commit("updateGoBoard", null);
            router.push({
                name: 'playroom',
                params: {
                    roomId,
                }
            })
        }

        return {
            watch_game,
            games,
        }
    }
}
</script>

<style scoped>
.title {
    text-align: center;
    font-size: xx-large;
    font-weight: bold;
    margin: 0 auto;
}

.user-avatar {
    border-radius: 50%;
    width: 5vh;
}

.user-username {
    font-weight: 500;
    margin: 5px auto;
}

.user-info {
    text-align: center;
    margin: 5px auto;
    cursor: default;
}
</style>