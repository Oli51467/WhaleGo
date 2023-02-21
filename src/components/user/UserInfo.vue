<template>
    <el-skeleton :loading="loading" :rows="10"></el-skeleton>
    <div v-if="!loading">
        <div class="row">
            <div class="card-body" style="width: 100%;">
                <!--存储用户头像 字符串里是表达式要加:-->
                <img :src="guests.user_avatar" alt="" style="width: 80%; text-align: center;">
            </div>
        </div>
        <div class="row justify-content-center d-flex">
            <div class="level">
                <span class="level-text">棋力:{{ guests.user_level }}</span>
            </div>
            &nbsp;
            <div class="user-type">
                <span class="type-text">普通用户</span>
            </div>
        </div>
        <hr />
        <div class="row">
            <span id="username"> {{ guests.username }}</span>
        </div>
        <div class="row">
            <span id="profile"> {{ guests.profile }}</span>
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
                {{ guests.followed_count }}
            </div>
            <div class="col-4">
                {{ guests.followers_count }}
            </div>
            <div class="col-4">
                {{ guests.guests_count }}
            </div>
        </div>
        <div class="row follow-op" v-if="!is_me">
            <div class="col-6 d-flex flex-row-reverse">
                <el-button type="success" size="" style="display:inline-block;text-align: center;"
                    v-if="guests.id != $store.state.user.id && relation === 'stranger' || relation === 'follower'"
                    @click="follow">
                    关注
                </el-button>
                <el-button type="info" size="" style="display:inline-block;text-align: center;"
                    v-else-if="guests.id != $store.state.user.id && relation === 'followed'" @click="unfollow">
                    已关注
                </el-button>
                <el-button type="info" size="" style="display:inline-block;text-align: center;"
                    v-else-if="guests.id != $store.state.user.id && relation === 'friend'" @click="unfollow">
                    互相关注
                </el-button>
            </div>
            <div class="col-6 d-flex">
                <el-button type="info" size="" style="display:inline-block;text-align: center;">发消息</el-button>
            </div>
        </div>
        <div class="row" style="margin-top:20px;font-weight: 700;">
            <span class="info" style="text-align:left">最近来访</span>
        </div>
        <div class="row">
            <div class="col-2 info" v-for="guest in guests.guests_front" :key="guest.guests_id">
                <img :src="guest.guests_avatar" alt="" class="guests_avatar" @click="click_profile(guest.guests_id)"
                    style="cursor:pointer" />
            </div>
        </div>
        <div class="row">
            <div class="col-2 info" v-for="guest in guests.guests_front" :key="guest.guests_id">
                <span class="guests">{{ guest.guests_username }}</span>
            </div>
        </div>

        <div class="row">
            <div class="col-2 info" v-for="guest in guests.guests_back" :key="guest.guests_id">
                <img :src="guest.guests_avatar" alt="" class="guests_avatar" @click="click_profile(guest.guests_id)"
                    style="cursor:pointer" />
            </div>
        </div>
        <div class="row">
            <div class="col-2" v-for="guest in guests.guests_back" :key="guest.guests_id">
                <span class="guests">{{ guest.guests_username }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { ref } from 'vue';
import { API_URL } from '@/assets/apis/api';
import $ from 'jquery';

export default {
    props: {
        guests: {
            type: Object,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        }
    },

    setup(props) {
        const route = useRouter();
        const store = useStore();
        const is_me = computed(() => props.userId === store.state.user.id);
        const loading = ref(true);
        let relation = ref();

        const click_profile = (user_id) => {
            let routeData = route.resolve({
                name: 'user_index',
                params: {
                    userId: user_id,
                }
            })
            window.open(routeData.href, '_blank');
        }

        const get_relation = () => {
            loading.value = true;
            $.ajax({
                url: `${API_URL}/friend/getRelationship/`,
                type: "get",
                data: {
                    search_id: props.userId,
                    user_id: store.state.user.id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    relation.value = resp.relation;
                    loading.value = false;
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }
        get_relation();

        const follow = () => {
            $.ajax({
                url: `${API_URL}/friend/follow/`,
                type: "post",
                data: {
                    username: props.guests.username,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success() {
                    if (relation.value === 'stranger') {
                        relation.value = 'followed';
                    } else if (relation.value === 'follower') {
                        relation.value = 'friend';
                    }
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }

        const unfollow = () => {
            $.ajax({
                url: `${API_URL}/friend/unfollow/`,
                type: "post",
                data: {
                    username: props.guests.username,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success() {
                    if (relation.value === 'friend') {
                        relation.value = 'follower';
                    } else if (relation.value === 'followed') {
                        relation.value = 'stranger';
                    }
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }


        return {
            is_me,
            relation,
            loading,
            click_profile,
            follow,
            unfollow,
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

#profile {
    font-size: medium;
    font-weight: 400;
    color: gray;
    text-align: center;
}

.count-info {
    font-size: small;
    color: gray;
}

.guests_avatar {
    width: 3vw;
}

.guests {
    white-space: nowrap;
    /*强制单行显示*/
    text-overflow: ellipsis;
    /*超出部分省略号表示*/
    overflow: hidden;
    /*超出部分隐藏*/
    width: 3vw;
    /*设置显示的最大宽度*/
    display: inline-block;
    vertical-align: top
}

.info {
    margin-left: 0.4vw;
}

.follow-op {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 2vh;
}

.level {
    width: 6vw;
    height: 3.5vh;
    border-radius: 10px;
    background-color: rgb(244, 213, 39);
    border: 1px solid gold;
    box-shadow: 1px 1px 3px rgb(123, 112, 49);
    cursor: pointer;
}

.user-type {
    width: 6vw;
    height: 3.5vh;
    border-radius: 10px;
    background-color: silver;
    box-shadow: 1px 1px 3px rgb(123, 112, 49);
    cursor: pointer;
}

.level-text {
    text-align: center;
    color: rgb(131, 33, 33);
    font-weight: 700;
}

.type-text {
    text-align: center;
    color: rgb(115, 19, 110);
    font-weight: 700;
}
</style>