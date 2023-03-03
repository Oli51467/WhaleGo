<template>
    <div class="comment">
        <div class="row">
            <div class="col-2 comment-count">
                <span>0 评论</span>
            </div>
        </div>
        <div class="row comment-area">
            <div class="col-1">
                <img :src="$store.state.user.avatar" class="aside-user-avatar">
            </div>
            <div class="col-11">
                <el-input type="textarea" :rows="3" v-model="messageInput" placeholder="在这里写评论...">
                </el-input>
            </div>
            <div class="row">
                <div class="d-flex flex-row-reverse send-comment">
                    <el-button type="info" id="send" plain>发送</el-button>
                </div>
            </div>
        </div>
        <div v-for="comment in posts_comments" :key="comment.id">
            <el-divider class="comment-divider"></el-divider>
            <div class="comment-divider">
                <div class="row">
                    <div class="col-1">
                        <img :src="comment.userAvatar" class="comment-user-avatar">
                    </div>
                    <div class="col-11">
                        <div class="row">
                            <span class="d-flex comment-username"> {{ comment.username }}</span>
                        </div>
                        <div class="row">
                            <span class="d-flex comment-content">
                                {{ comment.content }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import { API_URL } from '@/assets/apis/api';
import { useStore } from 'vuex';
import { ref } from 'vue';

export default {
    props: {
        post_id: {
            type: Number,
            required: true,
        },
    },

    setup(props) {
        const store = useStore();
        const posts_comments = ref([]);
        const get_post_comments = () => {
            $.ajax({
                url: `${API_URL}/post/comment/get/`,
                type: "get",
                data: {
                    post_id: props.post_id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    console.log(resp.data.comments);
                    posts_comments.value = resp.data.comments;
                },
                error(err) {
                    console.log(err);
                }
            });
        }
        get_post_comments();

        return {
            posts_comments,
            get_post_comments,
        }
    }
}
</script>

<style scoped>
.comment {
    background-color: rgba(231, 224, 224, 0.2);
    border-radius: 10px;
    height: auto;
    width: auto;
}

.comment-count {
    font-weight: 400;
    font-size: 24px;
}

.send-comment {
    margin: 1vh 1vh 1vh auto;
}

.comment-area {
    margin: 1vh auto;
}

.aside-user-avatar {
    float: right;
    /* border: 0.5px solid rgba(170, 164, 164); */
    border-radius: 50%;
    padding: 0px 0px 0px 0px;
    margin: 0 -1vh auto;
    width: 5vh;
    height: 5vh;
}

.comment-divider {
    margin-top: 1vh;
}

.comment-user-avatar {
    width: 5vh;
    height: 5vh;
    border-radius: 50%;
    margin: 0 auto 1vh 1vh;
}

.comment-username {
    margin: -2vh auto;
}

.comment-content {
    margin: 2vh auto;
}
</style>