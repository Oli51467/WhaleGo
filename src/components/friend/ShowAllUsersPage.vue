<template>
    <div>
        <table class="table table-striped table-hover" style="text-align:center">
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>
                        <img :src="user.avatar" alt="" class="user-avatar" @click="nav_to_user_space(user.id)">
                        &nbsp;
                        <span class="user-info"> {{ user.username }}</span>
                    </td>
                    <td v-if="user.state == 1">
                        <el-tag type="success">在线</el-tag>
                    </td>
                    <td v-else>
                        <el-tag type="info">不在线</el-tag>
                    </td>
                    <td>
                        <el-tag type="danger" color="#eeccff">{{ "棋力：" + user.level }}</el-tag>
                    </td>
                    <td>
                        <el-tag>{{ user.win + "胜" }}</el-tag>
                    </td>
                    <td>
                        <el-tag>{{ user.lose + "负" }}</el-tag>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import router from '@/router';

export default {
    props: {
        users: {
            type: Object,
            required: true,
        },
    },
    setup() {
        const nav_to_user_space = (user_id) => {
            router.push({
                name: "user_index",
                params: {
                    userId: user_id
                }
            })
        }
        return {
            nav_to_user_space,
        }
    }
}
</script>

<style scoped>
.user-info {
    font-weight: 500;
    margin-top: -14px;
}

img.user-avatar {
    width: 4vh;
    height: 4vh;
    border-radius: 50%;
    cursor: pointer;
}
</style>