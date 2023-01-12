<template>
    <div class="row">
        <div class="card-body" style="width: 100%;">
            <!--存储用户头像 字符串里是表达式要加:-->
            <img :src="user.user_avatar" alt="" style="width: 75%; text-align: center;">
        </div>
    </div>
    <hr />
    <div class="row">
        <span id="username"> {{ user.username }}</span>
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
            {{ user.followed_count }}
        </div>
        <div class="col-4">
            {{ user.followers_count }}
        </div>
        <div class="col-4">
            {{ user.guests_count }}
        </div>
    </div>
    <div class="row" style="margin-top:20px;font-weight: 700;">
        <span style="text-align:left">最近来访</span>
    </div>
    <div class="row">
        <div class="col-2" v-for="guest in user.guests_front" :key="guest.guests_id">
            <img :src="guest.guests_avatar" alt="" class="guests_avatar" @click="click_profile(guest.guests_id)"
                style="cursor:pointer" />
        </div>
    </div>
    <div class="row">
        <div class="col-2" v-for="guest in user.guests_front" :key="guest.guests_id">
            <span class="guests">{{ guest.guests_username }}</span>
        </div>
    </div>

    <div class="row">
        <div class="col-2" v-for="guest in user.guests_back" :key="guest.guests_id">
            <img :src="guest.guests_avatar" alt="" class="guests_avatar" @click="click_profile(guest.guests_id)"
                style="cursor:pointer" />
        </div>
    </div>
    <div class="row">
        <div class="col-2" v-for="guest in user.guests_back" :key="guest.guests_id">
            <span class="guests">{{ guest.guests_username }}</span>
        </div>
    </div>

</template>

<script>
import { useRouter } from 'vue-router';
export default {
    props: {
        user: {
            type: Object,
            required: true,
        }
    },

    setup() {
        const route = useRouter();
        const click_profile = (user_id) => {
            let routeData = route.resolve({
                name: 'user_index',
                params: {
                    userId: user_id,
                }
            })
            window.open(routeData.href, '_blank');
        }

        return {
            click_profile,
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
</style>