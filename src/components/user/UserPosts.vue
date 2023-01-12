<template>
    <div class="card-body">
        <div v-for="post in posts" :key="post.id" style="margin-top:3vh">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-4 d-flex">
                            <img :src="user.user_avatar" id="user_avatar"/> &nbsp;&nbsp;&nbsp;
                            <span id="tag">{{ user.username }}</span> &nbsp;&nbsp;&nbsp;
                            <span id="post_time"> {{ post.modifyTime }}</span>
                        </div>
                        <div class="col-8 d-flex flex-row-reverse">
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
        },
        user: {
            type: Object,
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
    text-align: center;
    margin-top: 0.2vh;
}

#user_avatar {
    width: 2vw;
    border-radius: 50%;
}

#post_time {
    color:  gray;
    font-weight: 400;
    font-size: medium;
    text-align: center;
    margin-top: 0.2vh;
}
</style>