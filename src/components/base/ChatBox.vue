<template>
    <div class="chat" ref="chat_body" v-show="show_chat">
        <el-container style="height: 100%; width: 55vw;">
            <el-header height="15px">
                <div class="pull-left">
                    <img src="@/assets/images/chat_logo.png" />
                    &nbsp;
                    <span>聊天</span>
                </div>
                <div class="pull-right" @click="close_chat">
                    <img src="@/assets/images/close.png" />
                </div>
            </el-header>
            <el-divider></el-divider>
            <el-container style="margin-top:-25px; width: 55vw">
                <el-aside width="225px" class="chat_aside">

                </el-aside>
                <el-main class="chat_main">
                    <el-divider style="width: 100vw; margin-left: -75px; margin-top: 50px;"></el-divider>
                    <div class="chat_record">

                    </div>
                    <el-input type="textarea" :rows="6" v-model="chat_msg"></el-input>
                </el-main>
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
        let chat_msg = ref("");
        onMounted(() => {
            new ChatBody(chat_body.value);
        });

        const close_chat = () => {
            context.emit("open_chat_body");
        }

        return {
            chat_body,
            close_chat,
            chat_msg,
        }
    }
}
</script>

<style scoped>
* {
    padding: 0px 0px 0px 0px;
}

.chat {
    width: 55vw;
    height: 60vh;
    background-color: whitesmoke;
    position: absolute;
    border: 0.1px solid;
    border-radius: 5px;
    top: 20%;
    left: 20%;
    box-shadow: 2px 2px 2px rgba(215, 207, 207, 0.7);
    z-index: 999;
}

.pull-left {
    float: left !important;
    margin: 5px auto auto 15px;
    height: 5vh;
}

.pull-right {
    float: right !important;
    margin: 5px -15px auto;
    height: 4vh;
    width: 4vh;
}

.pull-right:hover {
    background-color: rgba(98, 34, 34, 0.7);
}

.chat_aside {
    height: 100%;
    box-sizing: border-box;
    background-color: rgba(166, 159, 159, 0.2);
}

.chat_main {
    background-color: white;
    padding: 0px 0px 0px 0px;
}

.chat_record {
    height: 57%;
    padding: 0px 0px 0px 0px;
    margin-top: -25px;
    background-color: rgb(151, 154, 153);
}

img {
    width: 30px;
    height: 30px;
}
</style>