<template>
    <ContentBase>
        <InteractiveComponents />
        <div class="container">
            <div class="row">
                <div class="col-3">
                    <div class="row">
                        <div class="card" style="margin-top: 20px">
                            <div class="card-body" style="width: 90%; margin: 0 auto;">
                                <!--存储用户头像 字符串里是表达式要加:-->
                                <img :src="$store.state.user.avatar" alt="" style="width: 100%; text-align: center;">
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class="row">
                        <span id="username"> {{ $store.state.user.username }}</span>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-4 count-info">
                            关注数
                        </div>
                        <div class="col-4 count-info">
                            粉丝数
                        </div>
                        <div class="col-4 count-info">
                            访客数
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            {{ followed_count }}
                        </div>
                        <div class="col-4">
                            {{ followers_count }}
                        </div>
                        <div class="col-4">
                            {{ guest_count }}
                        </div>
                    </div>
                </div>
                <div class="col-9">
                    <div class="card" style="margin-top: 20px">
                        <div class="card-header">
                            <span style="font-size: 150%">My Bot</span>
                            <button type="button" class="btn btn-success float-end">Create</button>
                        </div>
                        <div class="card-body">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ContentBase>
</template>

<script>
import ContentBase from '@/components/base/ContentBase.vue';
import InteractiveComponents from '@/components/popups/InteractiveComponents.vue';
import $ from 'jquery';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { API_URL } from '@/assets/apis/api';

export default {
    name: 'UserBots',
    // 存放templates中用到的其他组件
    components: {
        ContentBase,
        InteractiveComponents
    },

    setup() {
        const store = useStore();
        let followed_count = ref(null);
        let followers_count = ref(null);
        let guest_count = ref(null);
        $.ajax({
            url: `${API_URL}/user/getFollowedAndFollowersCount/`,
            type: "get",
            headers: {
                Authorization: "Bearer " + store.state.user.token,
            },
            success(resp) {
                followed_count.value = resp.followedCount;
                followers_count.value = resp.followersCount;
                guest_count.value = resp.guests;
            },
            error(resp) {
                console.log(resp);
            }
        })
        
        return {
            followed_count,
            followers_count,
            guest_count,
        }
    }
}
</script>

<style scoped>
#username {
    font-size: larger;
    font-weight: 700;
    text-align: center;
}

.count-info {
    font-size: small;
    color: gray;
}
</style>