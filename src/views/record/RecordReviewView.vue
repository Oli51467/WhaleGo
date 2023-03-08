<template>
    <div>
        <div class="row">
            <div class="col-7">
                <div ref="parent" class="goboard">
                    <canvas ref="canvas" tabindex="0" class="review_board"></canvas>
                </div>
            </div>
            <div class="col-5 reviewboard">
                <div class="container">
                    <div class="card-body">
                        <el-tabs type="border-card" :stretch=true tab-position="top" class="play-board">
                            <div class="row">
                                <div class="d-flex justify-content-evenly">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-1 user-avatar">
                                                    <img :src="record.black_avatar" alt="">
                                                </div>
                                                <div class="col-4 username">
                                                    <span>{{ record.black_username }} &nbsp;
                                                        {{ record.black_level }}</span>
                                                </div>
                                                <div class="col-1 parent">
                                                    <canvas ref="canvas_black" tabindex="0" class="stone"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="d-flex justify-content-evenly">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-1 user-avatar">
                                                    <img :src="record.white_avatar" alt="">
                                                </div>
                                                <div class="col-4 username">
                                                    <span> {{ record.white_username }}
                                                        &nbsp; {{ record.white_level }}</span>
                                                </div>
                                                <div class="col-1 parent">
                                                    <canvas ref="canvas_white" tabindex="0" class="stone"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="d-flex justify-content-evenly">

                                    <div ref="fast_undo">
                                        <el-button type="primary" class="op">
                                            <img src="@/assets/images/icon_fast_undo.png" style="width:2vw" />
                                            &nbsp;
                                            快退
                                        </el-button>
                                    </div>
                                    <div ref="undo">
                                        <el-button type="primary" class="op">
                                            <img src="@/assets/images/icon_undo.png" style="width:2vw" />
                                            &nbsp;
                                            后退
                                        </el-button>
                                    </div>
                                    <div ref="proceed">
                                        <el-button type="primary" class="op">
                                            <img src="@/assets/images/icon_proceed.png" style="width:2vw" />
                                            &nbsp;
                                            前进
                                        </el-button>
                                    </div>
                                    <div ref="fast_proceed">
                                        <el-button type="primary" class="op">
                                            <img src="@/assets/images/icon_fast_proceed.png" style="width:2vw" />
                                            &nbsp;
                                            快进
                                        </el-button>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="d-flex justify-content-around">
                                    <el-button type="success" round style="width:10vw; height:5vh">开始试下</el-button>
                                    <el-button type="danger" round style="width:10vw; height:5vh">结束试下</el-button>
                                </div>
                            </div>

                            <div class="row">
                                <div class="d-flex justify-content-around">
                                    <div ref="win_rate_chart" style="width:900px; height: 300px"></div>
                                </div>
                            </div>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { BoardRecord } from '@/assets/scripts/BoardRecord.js';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import * as echarts from "echarts";
import $ from 'jquery'
import { API_URL } from "@/assets/apis/api";

export default {

    setup() {
        const route = useRoute();
        const recordId = route.params.recordId;
        const store = useStore();
        
        let parent = ref(null);
        let canvas = ref(null);
        let canvas_black = ref(null);
        let canvas_white = ref(null);
        let proceed = ref(null);
        let fast_proceed = ref(null);
        let undo = ref(null);
        let fast_undo = ref(null);
        // 基于准备好的dom，初始化echarts实例
        let win_rate_chart = ref(null);
        let record = ref([]);
        let steps = null;
        let win_rate = [];

        onMounted(() => {
            $.ajax({
                url: `${API_URL}/record/detail/`,
                data: {
                    record_id: recordId,
                },
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    steps = resp.steps;
                    win_rate = resp.win_rate;
                    record.value = resp.record;
                    new BoardRecord(canvas.value.getContext('2d'), parent.value, 19, 19, steps,
                        proceed.value, fast_proceed.value, undo.value, fast_undo.value);
                    let ctx = canvas_black.value.getContext('2d');
                    let ctx1 = canvas_white.value.getContext('2d');
                    ctx.fillStyle = "black";
                    ctx1.fillStyle = "white";
                    ctx.beginPath();
                    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
                    ctx1.beginPath();
                    ctx1.arc(95, 50, 40, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx1.fill();
                    // 绘制图表
                    let myChart = echarts.init(win_rate_chart.value);
                    myChart.setOption({
                        title: {
                            text: '胜率曲线'
                        },
                        xAxis: {
                            type: 'category',
                            data: []
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                data: win_rate,
                                type: 'line',
                                smooth: true
                            }
                        ]
                    });
                },
                error(resp) {
                    console.log(resp);
                }
            });
        })

        return {
            parent,
            canvas,
            proceed,
            record,
            fast_proceed,
            undo,
            fast_undo,
            canvas_black,
            canvas_white,
            win_rate_chart,
        }
    },
}

</script>

<style scoped>
div.reviewboard {
    width: 40vw;
    margin: 0 auto;
}

.goboard {
    width: 85vw;
    height: 85vh;
    display: flex;
    justify-content: left;
    margin-left: 30px;
    align-items: center;
}

.review_board {
    background-color: #c28b69;
    border: 2px solid #9d6746;
    margin-top: 20px;
    margin-left: 50px;
    display: inline-block;
    background-image: radial-gradient(rgba(226, 255, 157, 0.25), rgba(26, 25, 25, 0));
    cursor: pointer;
    box-shadow: 3px 3px 3px #b9b9b9;
}

.container {
    width: auto;
    margin-left: -100px;
    margin-top: 10px;
    margin-right: 100px;
}

.play-board {
    background-color: rgb(238, 237, 237);
}

div.user-avatar {
    text-align: center;
}

div.user-avatar>img {
    width: 4vh;
    height: 4vh;
    border-radius: 10%;
}

div.username {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: black;
}

.stone {
    width: 150%;
    margin: -5px auto;
}

.row {
    margin-top: 15px;
}

.card {
    background-color: rgb(238, 237, 237);
}

.parent {
    width: 20%;
    margin: 0 auto auto -100;
}

.op {
    height: 5vh;
}
</style>