<template>
    <div class="chat" ref="chat_body" v-show="show_chat">
        <el-container>
            <el-header style="height: 2vh;">
                <div class="float-end close" @click="close_chat">
                    <i class="el-icon-close" style="margin:10px auto auto 10px; width: 100%; height: 100%;"></i>
                </div>
            </el-header>
            <el-divider></el-divider>
            <el-container>
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    
                </el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { ChatBody } from '@/assets/scripts/ChatBody.js';

export default {
    emits: ['open_chat_body'],
    props: {
        show_chat: {
            type: Boolean,
            required: true,
        }
    },

    setup(props, context) {
        let chat_body = ref(null);
        onMounted(() => {
            new ChatBody(chat_body.value);
        });

        const close_chat = () => {
            context.emit("open_chat_body");
        }

        return {
            chat_body,
            close_chat,
        }
    }
}
</script>

<style scoped>
.chat {
    width: 55vw;
    height: 60vh;
    background-color: whitesmoke;
    position: absolute;
    top: 20%;
    left: 20%;
    box-shadow: 2px 2px 2px rgba(215, 207, 207, 0.7);
    z-index: 999;
}

.close {
    margin: 0 auto;
    height: 4vh;
    width: 4vh;
}

.close:hover {
    background-color: rgba(98, 53, 53, 0.7);    
}
</style>