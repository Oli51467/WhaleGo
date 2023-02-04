<template>
    <div>
        <ContentBase>
            <div class="card-body">
                <div v-for="post in posts" :key="post.id" style="margin-top:3vh" :id="'post_id_' + post.id">
                    <div class="card post-card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6 d-flex">
                                    <img :src="post.userAvatar" id="user_avatar" /> &nbsp;&nbsp;&nbsp;
                                    <span id="tag">{{ post.username }}</span> &nbsp;&nbsp;&nbsp;
                                    <span id="post_time"> 发布于&nbsp;{{ post.modifyTime }}</span>
                                </div>
                                <div class="col-6 d-flex flex-row-reverse">
                                    <span class="title">{{ post.title }}</span>
                                </div>
                            </div>
                            <hr />
                            <div class="card">
                                <div class="card-body content">
                                    <span id="content">{{ post.content }}</span>
                                </div>
                            </div>
                            <hr class="hr" />
                            <div class="d-flex justify-content-evenly">
                                <div class="stars">
                                    <img src="@/assets/images/gray_star.png" v-if="post.liked == 'false'"
                                        @click="star_a_post(post)">&nbsp;
                                    <img src="@/assets/images/red_star.png" v-else @click="unstar_a_post(post)">&nbsp;
                                    <span v-if="post.stars != 0">{{ post.stars }}</span>
                                    <span v-else>赞</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ContentBase>
    </div>
</template>

<script>
import ContentBase from '@/components/base/ContentBase.vue';
import { ref } from 'vue';
import { API_URL } from '@/assets/apis/api';
import $ from 'jquery';
import { useStore } from 'vuex';

export default {
    components: {
        ContentBase,
    },

    setup() {
        let posts = ref([]);
        const store = useStore();

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
                    console.log(posts.value);
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }
        pull_all_posts();

        const star_a_post = (post) => {
            $.ajax({
                url: `${API_URL}/post/star/`,
                type: "post",
                data: {
                    post_id: post.id,
                    user_id: store.state.user.id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success() {
                    post.stars ++;
                    post.liked = 'true';
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const unstar_a_post = (post) => {
            $.ajax({
                url: `${API_URL}/post/unstar/`,
                type: "post",
                data: {
                    post_id: post.id,
                    user_id: store.state.user.id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success() {
                    post.stars --;
                    post.liked = 'false';
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        return {
            pull_all_posts,
            star_a_post,
            unstar_a_post,
            posts,
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