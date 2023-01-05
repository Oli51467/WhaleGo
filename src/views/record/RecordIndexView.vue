<template>
    <ContentBase>
        <InteractiveComponents />

        <el-tabs v-model="matchplay" type="border-card" stretch=true tab-position="top">
            <el-tab-pane label="我的棋谱">
                <MyRecords/>
            </el-tab-pane>
            <el-tab-pane label="棋谱欣赏">
                <RecordsLibrary/>
            </el-tab-pane>
        </el-tabs>

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
        

        // const open_record_video = recordId => {
        //     for (const record of records.value) {
        //         if (record.record.id === recordId) {
        //             store.commit("updateIsRecord", true);
        //             store.commit("updateGame", {
        //                 map: stringTo2D(record.record.map),
        //                 a_id: record.record.aid,
        //                 a_sx: record.record.asx,
        //                 a_sy: record.record.asy,
        //                 b_id: record.record.bid,
        //                 b_sx: record.record.bsx,
        //                 b_sy: record.record.bsy,
        //             });
        //             store.commit("updateSteps", {
        //                 a_steps: record.record.asteps,
        //                 b_steps: record.record.bsteps,
        //             });
        //             store.commit("updateRecordLoser", record.record.loser);
        //             router.push({
        //                 name: "record_video",
        //                 params: {
        //                     recordId
        //                 }
        //             })
        //             break;
        //         }
        //     }
        // }

        return {
            
        }
    }
};
</script>

<style scoped>
img.record-user-avatar {
    width: 4vh;
    border-radius: 50%;
}
</style>