<template>
    <div>
        <ContentBase>
            <el-tabs type="border-card" :stretch=true tab-position="top">
                <el-tab-pane label="新鲜事">
                    <CommunityPosts :posts="posts" :show_blank="show_blank" :loading="loading"
                        @pull_all_posts="pull_all_posts" />
                </el-tab-pane>
                <el-tab-pane label="棋友">
                    <ShowAllUsersPage :users="users_online">
                    </ShowAllUsersPage>
                </el-tab-pane>
            </el-tabs>
        </ContentBase>
    </div>
</template>

<script>
import ContentBase from '@/components/base/ContentBase.vue';
import CommunityPosts from '@/components/community/CommunityPosts.vue';
import ShowAllUsersPage from '@/components/friend/ShowAllUsersPage.vue';
import { ref } from 'vue';
import { API_URL } from '@/assets/apis/api';
import $ from 'jquery';
import { useStore } from 'vuex';

export default {
    components: {
        ContentBase,
        CommunityPosts,
        ShowAllUsersPage,
    },

    setup() {
        let posts = ref([]);
        let users_online = ref([]);
        const store = useStore();
        const show_blank = ref(false);
        const loading = ref(true);

        const pull_all_posts = () => {
            $.ajax({
                url: `${API_URL}/post/getAllPosts/`,
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    posts.value = resp;
                    posts.value.reverse();
                    if (posts.value.length == 0) {
                        show_blank.value = true;
                    }
                    loading.value = false;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const get_all_users_online = () => {
            $.ajax({
                url: `${API_URL}/user/get/online/`,
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    users_online.value = resp.data;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        pull_all_posts();
        get_all_users_online();
        

        return {
            posts,
            users_online,
            show_blank,
            loading,
            pull_all_posts,
            get_all_users_online,
        }
    }
}
</script>

<style scoped>
.title {
    font-weight: 800;
    font-size: medium;
    margin-top: 1vh;
}

.hr {
    color: rgb(166, 163, 163, 0.5);
}

.content {
    background-color: rgb(219, 243, 249, 0.2);
}

#tag {
    font-weight: 500;
    font-size: medium;
    text-align: center;
    margin-top: 0.2vh;
}

#user_avatar {
    width: 2vw;
    height: 2vw;
    border-radius: 50%;
}

#post_time {
    color: gray;
    font-weight: 400;
    font-size: medium;
    text-align: center;
    margin-top: 0.2vh;
}

.post-card {
    box-shadow: 1px 1px 1px #b9b9b9;
}

img {
    width: 1.5vw;
    cursor: pointer;
}

.tab-btn {
    color: rgb(109, 109, 238);
}
</style>