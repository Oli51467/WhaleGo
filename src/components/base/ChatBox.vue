<template>
    <div class="chat" ref="chat_body" v-show="show_chat">
        <el-container style="height: 477px; width: 833px;">
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

            <el-container style="margin-top:-25px; width: 833px">
                <el-aside width="225px" class="chat_aside">

                </el-aside>
                <el-main class="chat_main">
                    <el-divider style="width: 680px; margin-left: -75px; margin-top: 50px;"></el-divider>
                    <div class="chat_record">

                    </div>

                    <div class="d-flex align-items-end flex-column mb-3">
                        <el-input type="textarea" :rows="4" v-model="chat_msg" :autofocus=true class="p-2">
                        </el-input>
                        <el-button type="info" id="send" class="p-2">发送</el-button>
                    </div>


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
    width: 833px;
    height: 477px;
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
    height: 50px;
}

.pull-right {
    float: right !important;
    margin: 5px -15px auto;
    height: 40px;
    width: 40px;
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
    height: 100%;
}

.chat_record {
    height: 230px;
    padding: 0px 0px 0px 0px;
    margin-top: -25px;
    background-color: rgba(206, 201, 201, 0.2);
}

img {
    width: 30px;
    height: 30px;
}

#send {
    margin: 0 10px auto;
}
</style>