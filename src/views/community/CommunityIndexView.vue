<template>
    <div>
        <ContentBase>
            <CommunityPosts :posts="posts" :show_blank="show_blank" :loading="loading" @pull_all_posts="pull_all_posts"/>
        </ContentBase>
    </div>
</template>

<script>
import ContentBase from '@/components/base/ContentBase.vue';
import CommunityPosts from '@/components/community/CommunityPosts.vue';
import { ref } from 'vue';
import { API_URL } from '@/assets/apis/api';
import $ from 'jquery';
import { useStore } from 'vuex';

export default {
    components: {
        ContentBase,
        CommunityPosts,
    },

    setup() {
        let posts = ref([]);
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
        pull_all_posts();

        return {
            posts,
            show_blank,
            loading,
            pull_all_posts,
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
</style>