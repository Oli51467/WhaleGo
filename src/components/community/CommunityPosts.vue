<template>
    <el-skeleton :loading="loading" :rows="6" animated></el-skeleton>
    <div class="card-body" v-if="!show_blank">
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
    <el-empty description="还没有人发新鲜事" v-else>
        <el-button type="success" data-bs-toggle="modal" data-bs-target="#postapost">去分享</el-button>
    </el-empty>

    <!--发帖模态框-->
    <div class="modal fade" id="postapost" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="post_title">发布新鲜事</h1>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="post_title" class="form-label" style="float: left;">请填写标题</label>
                        <input v-model="add_post.title" type="text" class="form-control" id="post_title"
                            placeholder="请填写标题">
                    </div>
                    <div class="mb-3">
                        <label for="post_content" class="form-label" style="float: left;">写点什么</label>
                        <textarea v-model="add_post.content" class="form-control" id="post_content" rows="15"
                            placeholder="请填写内容"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="error_message">{{ add_post.error_message }}</div>
                    <button type="button" class="btn btn-primary" @click="post_a_post">发布</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { API_URL } from '@/assets/apis/api';
import $ from 'jquery';
import { useStore } from 'vuex';
import { reactive } from 'vue';
import { Modal } from 'bootstrap/dist/js/bootstrap';
export default {
    emits: ['pull_all_posts'],
    props: {
        posts: {
            type: Object,
            required: true,
        },
        show_blank: {
            type: Boolean,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
    },

    setup(props, context) {
        const store = useStore();
        const add_post = reactive({
            title: "",
            content: "",
            error_message: "",
        })
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
                    post.stars++;
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
                    post.stars--;
                    post.liked = 'false';
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const post_a_post = () => {
            add_post.error_message = "";
            $.ajax({
                url: `${API_URL}/post/add/`,
                type: "post",
                data: {
                    title: add_post.title,
                    content: add_post.content,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.msg === 'success') {
                        add_post.title = "";
                        add_post.content = "";
                        Modal.getInstance("#postapost").hide();
                        context.emit("pull_all_posts");
                    } else {
                        add_post.error_message = resp.msg;
                    }
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        return {
            star_a_post,
            unstar_a_post,
            post_a_post,
            add_post,
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

div.error_message {
    font-weight: 700;
    color: red;
}
</style>