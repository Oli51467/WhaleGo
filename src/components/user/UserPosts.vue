<template>
    <div class="card-body">
        <div style="height:fit-content" class="d-flex flex-row-reverse">
            <button type="button" class="btn btn-sm btn-outline-success op" data-bs-toggle="modal" data-bs-target="#postapost"
                v-if="userId === $store.state.user.id">发帖</button>
        </div>

        <div class="modal fade" id="postapost" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="post_title">发布帖子</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="post_title" class="form-label">请填写标题</label>
                            <input v-model="post.title" type="text" class="form-control" id="post_title"
                                placeholder="请填写标题">
                        </div>
                        <div class="mb-3">
                            <label for="post_content" class="form-label">这次要分享什么呢？</label>
                            <textarea v-model="post.content" class="form-control" id="post_content" rows="15"
                                placeholder="请填写内容"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="error_message">{{ post.error_message }}</div>
                        <button type="button" class="btn btn-primary" @click="post_a_post">发布</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-for="post in posts" :key="post.id" style="margin-top:3vh">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-4 d-flex">
                            <img :src="user.user_avatar" id="user_avatar" /> &nbsp;&nbsp;&nbsp;
                            <span id="tag">{{ user.username }}</span> &nbsp;
                            <span id="post_time"> 发布于&nbsp;{{ post.modifyTime }}</span>
                        </div>
                        <div class="col-8 d-flex flex-row-reverse">
                            <button type="button" class="btn btn-outline-danger op"
                                v-if="userId === $store.state.user.id">删除</button>
                            <button type="button" class="btn btn-outline-primary op"
                                v-if="userId === $store.state.user.id">修改</button>
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
</template>

<script>
import { ref } from 'vue';
import $ from 'jquery';
import { useStore } from 'vuex';
import { API_URL } from '@/assets/apis/api';
import { Modal } from 'bootstrap/dist/js/bootstrap';
import { reactive } from 'vue';

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
        const post = reactive({
            title: "",
            content: "",
            error_message: "",
        })

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

        const post_a_post = () => {
            post.error_message = "";
            $.ajax({
                url: `${API_URL}/post/add/`,
                type: "post",
                data: {
                    title: post.title,
                    content: post.content,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.msg === 'success') {
                        post.title = "";
                        post.content = "";
                        Modal.getInstance("#postapost").hide();
                        pull_all_posts();
                    } else {
                        post.error_message = resp.msg;
                    }
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        return {
            posts,
            post,
            pull_all_posts,
            post_a_post,
        }
    },

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

div.error_message {
    font-weight: 700;
    color: red;
}
</style>