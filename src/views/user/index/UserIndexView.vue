<template>
    <ContentBase>
        <InteractiveComponents />
        <div class="container">
            <div class="row">
                <div class="col-3">
                    <UserInfo :user="user"/>
                </div>
                <div class="col-9">
                    <div class="card">
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
import UserInfo from '@/components/user/UserInfo.vue';
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
        InteractiveComponents,
        UserInfo,
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
        }
    }
}
</script>

<style scoped>

</style>