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
                            <option disabled>让先</option>
                            <option disabled>让2子</option>
                            <option disabled>让3子</option>
                            <option disabled>让4子</option>
                            <option disabled>让5子</option>
                            <option disabled>让6子</option>
                            <option disabled>让7子</option>
                            <option disabled>让8子</option>
                            <option disabled>让9子</option>
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
                            <option disabled>执黑</option>
                            <option disabled>执白</option>
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
                <div class="col-3 rules">
                    <div class="form-floating">
                        <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
                            <option>1段</option>
                            <option>2段</option>
                            <option>3段</option>
                            <option>4段</option>
                            <option selected>5段</option>
                            <option>6段</option>
                            <option>7段</option>
                            <option>8段</option>
                            <option>9段</option>
                        </select>
                        <label for="floatingSelect">难度</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <el-button type="success" round class="match" @click="click_match">开始挑战</el-button>
        </div>
    </div>
</template>

<script>

export default {
    setup() {
        
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