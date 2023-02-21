<template>
    <el-skeleton :loading="loading" :rows="6" animated></el-skeleton>
    <div class="card-body">
        <div style="height:fit-content" class="d-flex flex-row-reverse">
            <button type="button" class="btn btn-sm btn-outline-success op" data-bs-toggle="modal"
                data-bs-target="#postapost" v-if="is_me && !loading" style="margin-top:-6.5vh; height: max-content;">发新鲜事</button>
        </div>

        <div v-for="post in posts" :key="post.id" style="margin-top:3vh" :id="'post_id_' + post.id">
            <div class="card post-card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-6 d-flex">
                            <img :src="guests.user_avatar" id="user_avatar" /> &nbsp;&nbsp;&nbsp;
                            <span id="tag">{{ guests.username }}</span> &nbsp;&nbsp;&nbsp;
                            <span id="post_time"> 发布于&nbsp;{{ post.modifyTime }}</span>
                        </div>
                        <div class="col-6 d-flex flex-row-reverse">
                            <button type="button" class="btn btn-outline-danger op" v-if="is_me" data-bs-toggle="modal"
                                :data-bs-target="'#remove_post_modal_' + post.id">删除</button>
                            <button type="button" class="btn btn-outline-primary op" v-if="is_me" data-bs-toggle="modal"
                                :data-bs-target="'#update_post_modal_' + post.id">修改</button>
                            <span class="title">{{ post.title }}</span>
                        </div>
                        <!--删除帖子的提示模态框-->
                        <div class="modal fade" :id="'remove_post_modal_' + post.id" tabindex="-1">
                            <div class="modal-dialog modal-dialog-centered modal-sm">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <img src="@/assets/images/fire.png"
                                            style="width:4vh; height: 4vh; margin: 0 auto;" />
                                    </div>
                                    <div class="modal-body" style="margin: 0 auto">
                                        <span style="text-align:center; color:red">你确定删除吗</span>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-danger"
                                            @click="click_remove_a_post(post.id)">删除</button>
                                        <button type="button" class="btn btn-secondary"
                                            data-bs-dismiss="modal">取消</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--修改帖子模态框-->
                        <div class="modal fade" :id="'update_post_modal_' + post.id" tabindex="-1">
                            <div class="modal-dialog modal-xl">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="post_title">编辑新鲜事</h1>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="post_title" class="form-label">请填写标题</label>
                                            <input v-model="post.title" type="text" class="form-control" id="post_title"
                                                placeholder="请填写标题">
                                        </div>
                                        <div class="mb-3">
                                            <label for="post_content" class="form-label">写点什么</label>
                                            <textarea v-model="post.content" class="form-control" id="post_content"
                                                rows="15" placeholder="请填写内容"></textarea>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div class="error_message">{{ post.error_message }}</div>
                                        <button type="button" class="btn btn-primary"
                                            @click="update_a_post(post)">保存修改</button>
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                            @click="pull_all_posts">取消</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <hr class="hr"/>
                    <div class="card">
                        <div class="card-body content">
                            <span id="content">{{ post.content }}</span>
                        </div>
                    </div>
                    <hr class="hr"/>
                    <div class="d-flex justify-content-evenly">
                        <div class="stars">
                            <img src="@/assets/images/gray_star.png" v-if="post.liked == 'false'"
                            @click="star_a_post(post)">&nbsp;
                            <img src="@/assets/images/red_star.png" v-else
                            @click="unstar_a_post(post)">&nbsp;
                            <span v-if="post.stars != 0">{{ post.stars }}</span>
                            <span v-else>赞</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--发帖模态框-->
    <div class="modal fade" id="postapost" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="post_title">发布新鲜事</h1>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="post_title" class="form-label">请填写标题</label>
                        <input v-model="add_post.title" type="text" class="form-control" id="post_title"
                            placeholder="请填写标题">
                    </div>
                    <div class="mb-3">
                        <label for="post_content" class="form-label">写点什么</label>
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
import { ref } from 'vue';
import $ from 'jquery';
import { useStore } from 'vuex';
import { API_URL } from '@/assets/apis/api';
import { Modal } from 'bootstrap/dist/js/bootstrap';
import { reactive, computed } from 'vue';

export default {
    props: {
        userId: {
            type: String,
            required: true,
        },
        guests: {
            type: Object,
            required: true,
        }
    },

    setup(props) {
        const store = useStore();
        const loading = ref(true);
        const is_me = computed(() => props.userId === store.state.user.id);
        let posts = ref([]);
        const add_post = reactive({
            title: "",
            content: "",
            error_message: "",
        });

        const pull_all_posts = () => {
            loading.value = true;
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
                    posts.value.reverse();
                    loading.value = false;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        pull_all_posts();

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
                        pull_all_posts();
                    } else {
                        add_post.error_message = resp.msg;
                    }
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const click_remove_a_post = (post_id) => {
            $.ajax({
                url: `${API_URL}/post/remove/`,
                type: "post",
                data: {
                    post_id: post_id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.msg === 'success') {
                        Modal.getInstance("#remove_post_modal_" + post_id).hide();
                        pull_all_posts();
                    } else {
                        console.log(resp);
                    }
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const update_a_post = (post) => {
            add_post.error_message = "";
            $.ajax({
                url: `${API_URL}/post/update/`,
                type: "post",
                data: {
                    post_id: post.id,
                    title: post.title,
                    content: post.content,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.msg === 'success') {
                        Modal.getInstance("#update_post_modal_" + post.id).hide();
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
            posts,
            add_post,
            is_me,
            loading,
            pull_all_posts,
            post_a_post,
            click_remove_a_post,
            update_a_post,
            star_a_post,
            unstar_a_post,
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

.post-card {
    box-shadow: 1px 1px 1px #b9b9b9;
}

div.error_message {
    font-weight: 700;
    color: red;
}

.hr {
    color: rgb(166, 163, 163, 0.5);
}

img {
    width: 1.5vw;
    cursor: pointer;
}
</style>