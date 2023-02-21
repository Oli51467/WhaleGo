<template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-4 rules">
                    <div class="form-floating">
                        <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
                            <option selected>19</option>
                        </select>
                        <label for="floatingSelect">棋盘大小</label>
                    </div>
                </div>
                <div class="col-4 rules">
                    <div class="form-floating">
                        <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
                            <option selected>黑贴3又3/4子</option>
                        </select>
                        <label for="floatingSelect">贴目</label>
                    </div>
                </div>
                <div class="col-3 rules">
                    <div class="form-floating">
                        <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
                            <option selected>分先</option>
                            <option >让2子</option>
                            <option >让3子</option>
                            <option >让4子</option>
                            <option >让5子</option>
                            <option >让6子</option>
                            <option >让7子</option>
                            <option >让8子</option>
                            <option >让9子</option>
                        </select>
                        <label for="floatingSelect">棋份</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-fluid">
            <div class="row">
                <div class="col-4 rules">
                    <div class="form-floating">
                        <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
                            <option selected>猜先</option>
                        </select>
                        <label for="floatingSelect">棋手</label>
                    </div>
                </div>
                <div class="col-4 rules">
                    <div class="form-floating">
                        <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
                            <option selected>不计时</option>
                        </select>
                        <label for="floatingSelect">时间</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top:8vh">
            <MyFriendPage :friends="friends"/>
        </div>
    </div>
</template>

<script>
import MyFriendPage from '../friend/MyFriendPage.vue';
import { useStore } from 'vuex';
import { ref } from 'vue';
import $ from 'jquery';
import { API_URL } from '@/assets/apis/api';

export default {
    components: {
        MyFriendPage,
    },

    setup() {
        const store = useStore();
        let friends = ref([]);

        const pull_friends = () => {
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
        }

        pull_friends();

        const click_match = () => {
            if (store.state.gogame.status === 'matching') {
                store.state.gogame.socket.send(JSON.stringify({
                    event: "cancel",
                }));
                store.commit("updateGoGameStatus", "waiting");
            } else if (store.state.gogame.status === 'waiting') {
                store.commit("updateGoGameStatus", "matching");
                store.state.gogame.socket.send(JSON.stringify({
                    event: "start",
                }));
            }
        }

        return {
            click_match,
            pull_friends,
            friends,
        }
    }
}
</script>

<style scoped>
.rules {
    text-align: center;
    margin-left: 15px;
    margin-top: 25px;
}

.match {
    width: 50%;
    height: 40px;
    display: block;
    margin: 30px auto 5px auto;
}
</style>