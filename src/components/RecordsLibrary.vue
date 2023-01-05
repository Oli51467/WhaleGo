<template>
    <table class="table table-striped table-hover" style="text-align:center">
        <thead>
            <tr>
                <th>黑方</th>
                <th>段位</th>
                <th>白方</th>
                <th>段位</th>
                <th>对局结果</th>
                <th>对局时间</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="record in records" :key="record.record.id">
                <td>
                    <img :src="record.black_avatar" alt="" class="record-user-avatar">
                    &nbsp;
                    <span class="record-user-username"> {{ record.black_username }}</span>
                </td>
                <td>
                    <span> {{ record.black_level }}</span>
                </td>
                <td>
                    <img :src="record.white_avatar" alt="" class="record-user-avatar">
                    &nbsp;
                    <span class="record-user-username"> {{ record.white_username }}</span>
                </td>
                <td>
                    <span> {{ record.white_level }}</span>
                </td>
                <td> {{ record.result }}</td>
                <td> {{ record.record.createTime }}</td>
                <td>
                    <button type="button" class="btn btn-primary"
                        @click="open_record_video(record.record.id)">开始复盘</button>
                </td>
            </tr>
        </tbody>
    </table>

    <nav aria-label="...">
        <ul class="pagination" style="float: right">
            <li class="page-item" @click="click_page(-2)">
                <a class="page-link" href="#">前一页</a>
            </li>
            <li :class="'page-item ' + page.is_active" v-for="page in pages" :key="page.number"
                @click="click_page(page.number - 1)">
                <a class="page-link" href="#">{{ page.number }}</a>
            </li>
            <li class="page-item" @click="click_page(-1)">
                <a class="page-link" href="#">后一页</a>
            </li>
        </ul>
    </nav>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";
import $ from 'jquery'
import { API_URL } from "@/assets/apis/api";

export default {
    setup() {
        const store = useStore();
        let records = ref([]);
        let pages = ref([]);
        let current_page = 0;
        let total_records = 0;

        const click_page = page => {
            if (page === -2) page = current_page - 1;
            else if (page === -1) page = current_page + 1;
            let max_pages = parseInt(Math.ceil(total_records / 10));
            if (page >= 0 && page < max_pages) {
                pull_page(page);
            }
        }


        const update_pages = () => {
            let max_pages = parseInt(Math.ceil(total_records / 10));
            let new_pages = [];
            for (let i = current_page - 1; i <= current_page + 1; i++) {
                if (i >= 0 && i < max_pages) {
                    new_pages.push({
                        number: i + 1,
                        is_active: i === current_page ? "active" : ""
                    });
                }
            }
            pages.value = new_pages;
        }

        const pull_page = page => {
            current_page = page;
            $.ajax({
                url: `${API_URL}/record/getAll/`,
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
                    update_pages();
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        pull_page(current_page);

        return {
            click_page,
            pull_page,
            pages,
            records,
            update_pages,
        }
    }
}
</script>

<style scoped>
img.record-user-avatar {
    width: 4vh;
    border-radius: 50%;
}
</style>