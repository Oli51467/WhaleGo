<template>
    <ContentBase>
        <el-tabs v-model="matchplay" type="border-card" :stretch=true tab-position="top">
            <el-tab-pane label="我的棋谱">
                <MyRecords/>
            </el-tab-pane>
            <el-tab-pane label="棋谱欣赏">
                <RecordsLibrary/>
            </el-tab-pane>
        </el-tabs>
        <InteractiveComponents />

    </ContentBase>
</template>

<script>
import ContentBase from "@/components/ContentBase.vue";
import MyRecords from "@/components/MyRecords.vue";
import RecordsLibrary from "@/components/RecordsLibrary.vue";
import InteractiveComponents from '@/components/go/InteractiveComponents.vue';

export default {
    name: "RecordIndex",
    // 存放templates中用到的其他组件
    components: {
        ContentBase,
        MyRecords,
        RecordsLibrary,
        InteractiveComponents,
    },

    setup() {

    }
};
</script>

<style scoped>
img.record-user-avatar {
    width: 4vh;
    border-radius: 50%;
}
</style>