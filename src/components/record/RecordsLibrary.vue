<template>
    <el-skeleton :loading="loading" :rows="6" animated></el-skeleton>
    <div>
        <table class="table table-striped table-hover" style="text-align:center">
            <thead v-if="!loading">
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
                <tr v-for="record in records" :key="record.id">
                    <td>
                        <img :src="record.black_avatar" alt="" class="record-user-avatar" @click="nav_to_user_space(record.black_userid)">
                        &nbsp;
                        <span class="record-user-username"> {{ record.black_username }}</span>
                    </td>
                    <td>
                        <el-tag type="danger" color="#ffd9b3">{{ record.black_level }}</el-tag>
                    </td>
                    <td>
                        <img :src="record.white_avatar" alt="" class="record-user-avatar" @click="nav_to_user_space(record.white_userid)">
                        &nbsp;
                        <span class="record-user-username"> {{ record.white_username }}</span>
                    </td>
                    <td>
                        <el-tag type="danger" color="#ffd9b3">{{ record.white_level }}</el-tag>
                    </td>
                    <td> 
                        <el-tag v-bind:color="record.result === '黑中盘胜' ? '#1a1a1a' : '#ffffff'">{{ record.result }}</el-tag>
                    </td>
                    <td> 
                        <el-tag color="#cceeff">{{ record.create_time }}</el-tag>
                    </td>
                    <td>
                        <el-button class="op" plain @click="open_record(record.id)">复盘</el-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

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
import router from '@/router';

export default {
    setup() {
        const store = useStore();
        let records = ref([]);
        let pages = ref([]);
        let current_page = 0;
        let total_records = 0;
        const loading = ref(true);

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
                    loading.value = false;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const open_record = recordId => {
            for (const record of records.value) {
                if (record.id === recordId) {
                    router.push({
                        name: "record_review",
                        params: {
                            recordId
                        }
                    })
                    break;
                }
            }
        }

        pull_page(current_page);

        const nav_to_user_space = (user_id) => {
            router.push({
                name: "user_index",
                params: {
                    userId: user_id
                }
            })
        }

        return {
            pages,
            records,
            loading,
            click_page,
            pull_page,
            update_pages,
            open_record,
            nav_to_user_space,
        }
    }
}
</script>

<style scoped>
img.record-user-avatar {
    width: 4vh;
    height: 4vh;
    border-radius: 50%;
    margin: 0 auto;
    cursor: pointer;
}

.op {
    box-shadow: 2px 2px 2px #b9b9b9;
}

.record-user-username {
    font-weight: 500;
}
</style>