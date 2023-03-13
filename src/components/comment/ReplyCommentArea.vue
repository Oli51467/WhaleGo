<template>
    <div>
        <div class="row comment-area">
            <div class="col-7">
                <el-input type="textarea" :rows="2" v-model="comment_input" placeholder="在这里回复评论...">
                </el-input>
            </div>
            <div class="col-2">
                <div class="d-flex justify-content-center send-comment">
                    <el-button type="info" id="send" plain @click="comment_a_post">回复</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import { API_URL } from '@/assets/apis/api';
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';

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
        let comments_count = ref(0);
        let comment_input = ref('');

        onMounted(() => {

        })

        const comment_a_post = () => {
            $.ajax({
                url: `${API_URL}/post/comment/`,
                type: "post",
                data: {
                    post_id: props.post_id,
                    user_id: store.state.user.id,
                    parent_comment_id: -1,
                    content: comment_input.value,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    console.log(resp);
                    comment_input.value = '';
                    get_post_comments();
                },
                error(err) {
                    console.log(err);
                }
            });
        }

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
                    comments_count.value = resp.data.comments_count;
                },
                error(err) {
                    console.log(err);
                }
            });
        }

        return {
            posts_comments,
            comments_count,
            comment_input,
            get_post_comments,
            comment_a_post,
        }
    }
}
</script>

<style scoped>
.send-comment {
    margin: 1vh 1vh 1vh auto;
}
</style>