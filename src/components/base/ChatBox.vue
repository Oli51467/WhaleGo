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
        <div class="chat-container">
            <div class="friend-list">
                <h3>好友列表</h3>
                <ul>
                    <li v-for="friend in friends" :key="friend.id" :class="{ active: friend.id === selectedFriend.id }"
                        @click="selectFriend(friend)">
                        <!-- <img :src="friend.avatar" alt="friend-avatar" /> -->
                        <div class="friend-info">
                            <p class="friend-name">{{ friend.name }}</p>
                            <p class="friend-last-message">{{ friend.lastMessage }}</p>
                        </div>
                        <!-- <div class="friend-status">
                            <p v-if="friend.isOnline" class="online">在线</p>
                            <p v-else class="offline">离线</p>
                        </div> -->
                    </li>
                </ul>
            </div>
            <div class="chat-window">
                <div class="title_header">
                    <h3>{{ selectedFriend.name }}</h3>
                </div>
                <div class="messages">
                    <div class="message" v-for="message in selectedFriend.messages" :key="message.id"
                        v-bind:class="message.sendUserId == $store.state.user.id ? 'sent' : 'received'">
                        <span>{{ message.content }} </span>
                        <!-- <div class="d-flex mb-3">
                            <span class="me-auto p-2">{{ message.content }}</span>
                            <span class="p-2">{{ message.sendTime }}</span>
                        </div> -->
                    </div>
                </div>
                <div class="input">
                    <el-input type="textarea" :rows="4" v-model="messageInput" class="in" placeholder="Type a message...">
                    </el-input>
                    <el-button type="info" id="send" class="" plain @click="sendMessage">发送</el-button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { ChatBody } from '@/assets/scripts/ChatBody.js';
import $ from 'jquery';
import { API_URL } from '@/assets/apis/api';
import { useStore } from 'vuex';

export default {
    emits: ['open_chat_body'],
    props: {
        show_chat: {
            type: Boolean,
            required: true,
        }
    },

    setup(props, context) {
        const store = useStore();
        let chat_body = ref(null);
        let chat_msg = ref("");
        let friends = ref([]);
        onMounted(() => {
            new ChatBody(chat_body.value);
        });

        const getFriendsAndMessages = setInterval(() => {
            $.ajax({
                url: `${API_URL}/messages/get/`,
                type: "get",
                data: {
                    user_id: store.state.user.id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    friends.value = resp.data.friends;
                },
                error(err) {
                    console.log(err);
                    clearInterval(getFriendsAndMessages);
                }
            })
        }, 1000);

        const close_chat = () => {
            context.emit("open_chat_body");
        }

        return {
            chat_body,
            chat_msg,
            friends,
            close_chat,
            getFriendsAndMessages,
        }
    },

    data() {
        return {
            selectedFriend: { id: null, name: null, messages: [] },
            messageInput: '',
        }
    },
    methods: {
        selectFriend(friend) {
            this.selectedFriend = friend;
        },
        sendMessage () {
            if (this.messageInput.trim() !== '') {
                let to_id = this.selectedFriend.id;
                let my_id = this.$store.state.user.id;
                this.selectedFriend.messages.push({ id: this.selectedFriend.messages.length + 1, content: this.messageInput, sendUserId: my_id});
                this.$refs.chat_body.querySelector('.messages').scrollTop = this.$refs.chat_body.querySelector('.messages').scrollHeight;
                $.ajax({
                    url: `${API_URL}/messages/send/`,
                    type: "post",
                    data: {
                        user_id: this.$store.state.user.id,
                        to_id: to_id,
                        message: this.messageInput,
                    },
                    headers: {
                        Authorization: "Bearer " + this.$store.state.user.token,
                    },
                    success(resp) {
                        console.log(resp.code);
                    },
                    error(err) {
                        console.log(err);
                    }
                })
                this.messageInput = '';
            }
        }
    }
}
</script>

<style scoped>
* {
    padding: 0px 0px 0px 0px;
    box-sizing: border-box;
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

.chat-container {
    display: flex;
    height: 92%;
}

.friend-list {
    width: 30%;
    border-right: 1px solid #ccc;
    background-color: rgba(166, 159, 159, 0.2);
    text-align: center;
    overflow-y: scroll;
    height: 100%;
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
    display: inline-block;
}

.message {
    padding: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
    white-space: pre-wrap;
}

.message.sent {
    background-color: rgba(120, 178, 223, 0.4);
    text-align: right;
}

.message.received {
    background-color: #f7f7f7;
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