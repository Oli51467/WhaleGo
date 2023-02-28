<template>
    <div class="chat" ref="chat_body" v-show="show_chat">
        <div class="header">
            <div class="pull-left">
                <img src="@/assets/images/chat_logo.png" />
                &nbsp;
                <span>聊天</span>
            </div>
            <span class="close" v-on:click="close_chat">✕</span>
        </div>
        <div class="container">
            <div class="friend-list">
                <h3>好友列表</h3>
                <ul>
                    <li v-for="friend in friends" :key="friend.id" v-on:click="selectFriend(friend)">
                        {{ friend.name }}
                    </li>
                </ul>
            </div>
            <div class="chat-window">
                <div class="title_header">
                    <h3>{{ selectedFriend.name }}</h3>
                </div>
                <div class="messages">
                    <div class="message" v-for="message in selectedFriend.messages" :key="message.id" :class="message.type">
                        {{ message.content }}
                    </div>
                </div>
                <div class="input">
                    <el-input type="textarea" :rows="4" v-model="chat_msg" class="in" placeholder="Type a message...">
                    </el-input>
                    <el-button type="info" id="send" class="" plain>发送</el-button>
                </div>

            </div>
        </div>
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
            chat_msg,
            close_chat,
        }
    },

    data() {
        return {
            friends: [
                {
                    id: 1, name: 'Alice', messages: [
                        { id: 1, content: 'Hello!', type: 'sent' },
                        { id: 2, content: 'Hi there!', type: 'received' },
                        { id: 3, content: 'How are you?', type: 'sent' },
                        { id: 4, content: 'I\'m doing well, thanks. How about you?', type: 'received' },
                        { id: 5, content: 'I\'m good too.', type: 'sent' },
                    ],
                },
                { id: 2, name: 'Bob', messages: ["hello"] },
                { id: 3, name: 'Charlie', messages: ["2312"] },
                { id: 4, name: 'David', messages: [] },
            ],
            selectedFriend: { id: null, name: null, messages: [] },
            messageInput: '',
        }
    },
    methods: {
        selectFriend(friend) {
            this.selectedFriend = friend;
        },
        sendMessage() {
            if (this.messageInput.trim() !== '') {
                this.selectedFriend.messages.push({ id: this.selectedFriend.messages.length + 1, content: this.messageInput, type: 'sent' });
                this.messageInput = '';
                // scroll to bottom of messages
                this.$nextTick(() => {
                    this.$refs.window.querySelector('.messages').scrollTop = this.$refs.window.querySelector('.messages').scrollHeight;
                });
            }
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
    background-color: white;
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

img {
    width: 30px;
    height: 30px;
}

/* .messages {
    overflow-y: scroll;
    height: 205px;
    padding: 10px;
    margin-top: -25px;
    background-color: rgba(206, 201, 201, 0.2);
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f7f7f7;
}

.message.sent {
    text-align: right;
}

.message.received {
    text-align: left;
} */

.header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
    padding: 0 10px;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    background-color: #f7f7f7;
    user-select: none;
}

.close {
    font-size: 20px;
    font-weight: bold;
    color: #999;
    cursor: pointer;
}

.close:hover {
    background-color: rgba(98, 34, 34, 0.7);
}

.container {
    display: flex;
    height: 92%;
}

.friend-list {
    width: 30%;
    border-right: 1px solid #ccc;
    background-color: rgba(166, 159, 159, 0.2);
    text-align: center;
}

.friend-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.friend-list li {
    padding: 10px 20px;
    border-bottom: 1px solid #eee;
    background-color: white;
}

.friend-list li:last-child {
    border-bottom: none;
}

.friend-list li:hover {
    background-color: #f7f7f7;
}

.chat-window {
    width: 70%;
    display: flex;
    flex-direction: column;
}

.title_header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid #ccc;
    background-color: #f7f7f7;
}

.messages {
    flex: 1;
    overflow-y: scroll;
    padding: 10px;
}

.message {
    padding: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
}

.message.sent {
    background-color: #f7f7f7;
    text-align: right;
}

.message.received {
    background-color: #fff;
    text-align: left;
}

.input {
    display: flex;
    height: 97px;
    border-top: 1px solid #ccc;
}

.input.el-input {
    flex: 1;
    border: none;
    border-radius: 5px;
}

.input button {
    padding: 10px;
    border: none;
    border-radius: 5px;
}
</style>