<template>
    <div class="card-body">
        <div v-for="post in posts" :key="post.id" style="margin-top:3vh">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3 d-flex">
                            <span id="tag">帖子</span>
                        </div>
                        <div class="col-9 d-flex flex-row-reverse">
                            <span class="title">{{ post.title }}</span>
                        </div>
                    </div>
                    <hr />
                    <div class="card">
                        <div class="card-body content">
                            <span id="content">{{ post.content }}</span>
                            <!-- <button v-if="is_me" type="button" class="btn btn-danger btn-sm" @click="deletePost(post.id)">删除</button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import $ from 'jquery';
import { useStore } from 'vuex';
import { API_URL } from '@/assets/apis/api';

export default {
    props: {
        userId: {
            type: String,
            required: true,
        }
    },

    setup(props) {
        const store = useStore();
        let posts = ref([]);

        const pull_all_posts = () => {
            $.ajax({
                url: `${API_URL}/post/getPosts/`,
                type: "get",
                data: {
                    user_id: props.userId,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    posts.value = resp;
                    console.log(posts.value);
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        pull_all_posts();

        return {
            posts,
        }
    }
}
</script>

<style scoped>
.title {
    font-weight: 900;
    font-size: medium;
}

.content {
    background-color: rgb(219, 243, 249, 0.2);
}

#tag {
    font-weight: 500;
    font-size: medium;
}
</style>