<template>
    <div class="chat" ref="chat_body" v-show="show_chat">
        <button class="btn btn-primary" @click="test">关闭</button>
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

        const test = () => {
            context.emit("open_chat_body");
        }

        return {
            chat_body,
            test,
        }
    }
}
</script>

<style scoped>
.chat {
    width: 60vw;
    height: 55vh;
    background-color: whitesmoke;
    border-radius: 15px;
    position: absolute;
    top: 20%;
    left: 20%;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.7);
    z-index: 999;
}
</style>