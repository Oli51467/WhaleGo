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

        return {
            pull_all_posts,
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

.op {
    margin-left: 1vw;
    box-shadow: 2px 2px 2px #b9b9b9;
}

.post-card {
    box-shadow: 1px 1px 1px #b9b9b9;
}
</style>