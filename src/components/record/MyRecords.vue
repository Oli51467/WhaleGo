<template>
    <el-skeleton :loading="loading" :rows="6" animated></el-skeleton>
    <el-empty description="这里没有棋谱" v-if="show_blank == true">
        <el-button type="success" v-if="is_me"  @click="nav_to_play">去下棋！</el-button>
    </el-empty>
    <div v-else>
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
                        <img :src="record.black_avatar" alt="" class="record-user-avatar"
                            @click="nav_to_user_space(record.black_userid)">
                        &nbsp;
                        <span class="record-user-username"> {{ record.black_username }}</span>
                    </td>
                    <td>
                        <span> {{ record.black_level }}</span>
                    </td>
                    <td>
                        <img :src="record.white_avatar" alt="" class="record-user-avatar"
                            @click="nav_to_user_space(record.white_userid)">
                        &nbsp;
                        <span class="record-user-username"> {{ record.white_username }}</span>
                    </td>
                    <td>
                        <span> {{ record.white_level }}</span>
                    </td>
                    <td> {{ record.result }}</td>
                    <td> {{ record.create_time }}</td>
                    <td>
                        <el-button class="op" plain @click="open_record(record.id)">复盘</el-button>
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
    </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import $ from 'jquery'
import { API_URL } from "@/assets/apis/api";
import { useRouter } from 'vue-router';
import router from '@/router';

export default {
    props: {
        userId: {
            type: Number,
            required: true,
        }
    },

    setup(props) {
        const store = useStore();
        const route = useRouter();
        const loading = ref(true);
        const is_me = computed(() => props.userId === store.state.user.id);

        let records = ref([]);
        let pages = ref([]);
        let show_blank = ref(false);
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
                url: `${API_URL}/record/getMy/`,
                data: {
                    page: page,
                    user_id: props.userId,
                },
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    records.value = resp.records;
                    total_records = resp.records_count;
                    console.log(total_records);
                    if (total_records == 0) show_blank.value = true;
                    update_pages();
                    loading.value = false;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        pull_page(current_page);

        const open_record = recordId => {
            for (const record of records.value) {
                if (record.id === recordId) {
                    route.push({
                        name: 'record_review',
                        params: {
                            recordId
                        },
                    })
                    // let routeData = route.resolve({
                    //     name: 'record_review',
                    //     params: {
                    //         recordId
                    //     }
                    // })
                    //window.open(routeData.href, '_blank');
                    break;
                }
            }
        }

        const nav_to_user_space = (user_id) => {
            router.push({
                name: "user_index",
                params: {
                    userId: user_id
                }
            })
        }

        const nav_to_play = () => {
            router.replace({ name: 'goplay' });
        }

        return {
            pages,
            records,
            loading,
            show_blank,
            is_me,
            click_page,
            pull_page,
            update_pages,
            open_record,
            nav_to_user_space,
            nav_to_play,
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
</style>