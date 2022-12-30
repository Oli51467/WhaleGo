<template>
    <ContentBase>
        <table class="table table-striped table-hover" style="text-align:center">
            <thead>
                <tr>
                    <th>A</th>
                    <th>B</th>
                    <th>对战结果</th>
                    <th>对战时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in records" :key="record.record.id">
                    <td>
                        <img :src="record.a_avatar" alt="" class="record-user-avatar">
                        &nbsp;
                        <span class="record-user-username"> {{ record.a_username }}</span>
                    </td>
                    <td>
                        <img :src="record.b_avatar" alt="" class="record-user-avatar">
                        &nbsp;
                        <span class="record-user-username"> {{ record.b_username }}</span>
                    </td>
                    <td> {{ record.result }}</td>
                    <td> {{ record.record.createTime }}</td>
                    <td>
                        <button type="button" class="btn btn-secondary"
                            @click="open_record_video(record.record.id)">查看录像</button>
                    </td>
                </tr>
            </tbody>
        </table>

    </ContentBase>
</template>

<script>
import ContentBase from "@/components/ContentBase";
import { useStore } from "vuex";
import { ref } from "vue";
import router from "@/router";
import $ from "jquery";
import { API_URL } from "@/assets/apis/api";

export default {
    name: "RecordIndex",
    // 存放templates中用到的其他组件
    components: {
        ContentBase,
    },

    setup() {
        const store = useStore();
        let records = ref([]);
        let current_page = 1;
        let total_records = 0;

        const pull_page = page => {
            current_page = page;
            $.ajax({
                url: `${API_URL}/record/get/`,
                data: {
                    page,
                },
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    records.value = resp.records;
                    total_records = resp.records_count;
                    console.log(total_records);
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        pull_page(current_page);


        const stringTo2D = map => {
            let g = [];
            for (let i = 0, k = 0; i < 13; i++) {
                let line = [];
                for (let j = 0; j < 14; j++, k++) {
                    if (map[k] === '0') line.push(0);
                    else line.push(1);
                }
                g.push(line);
            }
            return g;
        }

        const open_record_video = recordId => {
            for (const record of records.value) {
                if (record.record.id === recordId) {
                    store.commit("updateIsRecord", true);
                    store.commit("updateGame", {
                        map: stringTo2D(record.record.map),
                        a_id: record.record.aid,
                        a_sx: record.record.asx,
                        a_sy: record.record.asy,
                        b_id: record.record.bid,
                        b_sx: record.record.bsx,
                        b_sy: record.record.bsy,
                    });
                    store.commit("updateSteps", {
                        a_steps: record.record.asteps,
                        b_steps: record.record.bsteps,
                    });
                    store.commit("updateRecordLoser", record.record.loser);
                    router.push({
                        name: "record_video",
                        params: {
                            recordId
                        }
                    })
                    break;
                }
            }
        }

        return {
            open_record_video,
            records
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