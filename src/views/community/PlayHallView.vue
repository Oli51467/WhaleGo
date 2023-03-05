<template>
    <ContentBase>
        <div class="title">
            <span>对局大厅</span>
            <hr />
        </div>
        <el-empty description="没有人在下棋" v-if="show_blank == true">
            <el-button type="success" @click="play">去下棋！</el-button>
        </el-empty>
        <div v-else>
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
                                <el-button type="success"> {{ game.black_level }} </el-button>
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
                                <el-button type="success"> {{ game.white_level }} </el-button>
                            </div>
                        </td>
                        <td>
                            <div class="user-info">
                                <el-button type="info" v-if="game.state === '布局'">
                                    {{ game.state }}
                                </el-button>
                                <el-button type="warning" plain v-else-if="game.state === '中盘'"> {{ game.state }}
                                </el-button>
                                <el-button type="danger" plain v-else-if="game.state === '官子'"> {{ game.state }}
                                </el-button>
                                <el-button type="info" plain v-else> {{ game.state }}
                                </el-button>

                            </div>
                        </td>
                        <td>
                            <div class="user-info">
                                <el-button type="primary" plain @click="watch_game(game.id)"> 观战</el-button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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
        let show_blank = ref(true);

        onMounted(() => {
            $.ajax({
                url: `${API_URL}/game/getInProcess/`,
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    games.value = resp;
                    if (games.value.games.length > 0) {
                        show_blank.value = false;
                    }
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

        const play = () => {
            router.replace({ name: 'goplay' });
        }

        return {
            games,
            show_blank,
            watch_game,
            play,
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
    height: 5vh;
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