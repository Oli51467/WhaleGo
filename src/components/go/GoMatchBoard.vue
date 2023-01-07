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
        <div class="row" v-if="$store.state.gogame.status === 'waiting' || $store.state.gogame.status === 'playing'">
            <el-button type="success" round class="match" @click="click_match" :disabled="$store.state.gogame.status === 'playing' ? true : false">开始匹配</el-button>
        </div>
        <div class="row" v-if="$store.state.gogame.status === 'matching'">
            <el-button type="info" round class="match" @click="click_match">取消匹配</el-button>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
    setup() {
        const store = useStore();

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