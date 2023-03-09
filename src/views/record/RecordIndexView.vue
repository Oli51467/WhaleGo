<template>
    <ContentBase>
        <el-tabs type="border-card" :stretch=true tab-position="top">
            <el-tab-pane label="我的棋谱">
                <MyRecords :userId="$store.state.user.id"/>
            </el-tab-pane>
            <el-tab-pane label="棋谱欣赏">
                <RecordsLibrary/>
            </el-tab-pane>
        </el-tabs>

    </ContentBase>
</template>

<script>
import ContentBase from "@/components/base/ContentBase.vue";
import MyRecords from "@/components/record/MyRecords.vue";
import RecordsLibrary from "@/components/record/RecordsLibrary.vue";

export default {
    name: "RecordIndex",
    // 存放templates中用到的其他组件
    components: {
        ContentBase,
        MyRecords,
        RecordsLibrary,
    },

    setup() {

    }
};
</script>

<style scoped>
</style>