<template>
    <div>
        <LargeContentBase>
            <h1>创作中心</h1>
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-primary btn-lg btn-upload">
                    上传
                    <img src="@/assets/images/upload.png" class="icon-upload">
                </button>
                <button type="button" class="btn btn-primary btn-lg btn-createroom">
                    创建教室
                    <img src="@/assets/images/room.png" class="icon-upload">
                </button>
            </div>
            <el-tabs type="border-card" :stretch=true tab-position="top">
                <el-tab-pane label="自战解说">
                    
                </el-tab-pane>
                <el-tab-pane label="教室">
                    
                </el-tab-pane>
            </el-tabs>
        </LargeContentBase>
    </div>
</template>

<script>
import LargeContentBase from '@/components/base/LargeContentBase.vue';
export default {
    components: {
        LargeContentBase,
    }
}
</script>

<style scoped>
.icon-upload {
    width: 4vh;
    height: 4vh;
}

.btn-upload {
    background-color: rgb(140, 181, 235);
    border-color: aliceblue;
    margin-bottom: 20px;
    margin-right: 20px;
}

.btn-createroom {
    background-color: rgb(140, 181, 235);
    border-color: aliceblue;
    margin-bottom: 20px;
}

.btn-upload:active {
    background-color: rgb(100, 160, 198);
}
</style>