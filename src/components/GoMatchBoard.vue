<template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-3 rules">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" aria-expanded="false">
                            19路棋盘
                        </button>
                    </div>
                </div>
                <div class="col-3 rules">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2"
                            data-bs-toggle="dropdown">
                            分先
                        </button>
                    </div>
                </div>
                <div class="col-3 rules">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            黑贴7.5目
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-fluid">
            <div class="row">
                <div class="col-2 rules1">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" aria-expanded="false">
                            猜先
                        </button>
                    </div>
                </div>
                <div class="col-3 rules1">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" aria-expanded="false">
                            不计时
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="$store.state.gogame.status === 'waiting' ">
            <el-button type="success" round class="match" @click="click_match">开始匹配</el-button>
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
                store.commit("updateGoGameStatus", "waiting");
            } else if (store.state.gogame.status === 'waiting') {
                store.commit("updateGoGameStatus", "matching");
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
    margin-left: 15px; 
    margin-top: 25px; 
}
.rules1 {
    margin-left: 15px; 
    margin-top: 60px; 
}
.match {
    width: 50%;
    height: 40px;
    display: block;
    margin: 60px auto;
}
</style>