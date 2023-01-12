<template>
    <div class="container">
        <div class="row">
            <div class="col-3" style="margin-top:2vh">
                <ContentBase>
                    <UserInfo :user="user" />
                </ContentBase>
            </div>
            <div class="col-9" style="margin-top:3vh">
                <div class="card">
                    <div class="card-body">
                        <ul class="nav nav-tabs justify-content-end" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="post-tab" data-bs-toggle="tab"
                                    data-bs-target="#post-tab-pane" type="button" role="tab"
                                    aria-controls="post-tab-pane" aria-selected="true">帖子</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="record-tab" data-bs-toggle="tab"
                                    data-bs-target="#record-tab-pane" type="button" role="tab"
                                    aria-controls="record-tab-pane" aria-selected="false">棋谱</button>
                            </li>
                            <li class="flex-sm-fill nav-item" style="margin-left:45vw">
                                <div>
                                    <button type="button" class="btn btn-success"
                                        v-if="userId === $store.state.user.id">发帖</button>
                                </div>
                            </li>
                        </ul>
                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade show active" id="post-tab-pane" role="tabpanel"
                                aria-labelledby="post-tab" tabindex="0">
                                <UserPosts :userId="userId" :user="user"/>
                            </div>
                            <div class="tab-pane fade" id="record-tab-pane" role="tabpanel" aria-labelledby="record-tab"
                                tabindex="0">
                                ...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ContentBase from '@/components/base/ContentBase.vue';
import UserInfo from '@/components/user/UserInfo.vue';
import UserPosts from '@/components/user/UserPosts.vue'
import $ from 'jquery';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { API_URL } from '@/assets/apis/api';
import { useRouter } from 'vue-router';

export default {
    name: 'UserBots',
    // 存放templates中用到的其他组件
    components: {
        ContentBase,
        UserInfo,
        UserPosts,
    },

    setup() {
        const store = useStore();
        const route = useRouter();
        const userId = route.currentRoute.value.params.userId;
        let user = ref([]);
        $.ajax({
            url: `${API_URL}/user/getFollowedAndFollowersCount/`,
            type: "post",
            data: {
                user_id: userId,
            },
            headers: {
                Authorization: "Bearer " + store.state.user.token,
            },
            success(resp) {
                user.value = resp;
            },
            error(resp) {
                console.log(resp);
            }
        })

        return {
            user,
            userId,
        }
    }
}
</script>

<style scoped>

</style>