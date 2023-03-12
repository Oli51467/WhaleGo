<template>
    <div class="chat" ref="chat_body" v-show="show_chat">
        <div class="header" ref="chat_header">
            <div class="pull-left">
                <img src="@/assets/images/chat_logo.png" class="chat_logo" />
                &nbsp;
                <span>聊天</span>
            </div>
            <span class="close" v-on:click="close_chat">✕</span>
        </div>
        <div class="chat-container">
            <div class="friend-list">
                <ul>
                    <li v-for="friend in friends" :key="friend.id" :class="{ active: friend.id === selectedFriend.id }"
                        @click="selectFriend(friend)">
                        <div class="row">
                            <div class="col-2">
                                <img :src="friend.avatar" alt="friend-avatar" class="friend-list-avatar" />
                            </div>
                            <div class="col-4">
                                <div class="friend-info">
                                    <p class="friend-name">{{ friend.name }}</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="friend-status">
                                    <p v-if="friend.isOnline" class="online">在线</p>
                                    <p v-else class="offline">离线</p>
                                </div>
                            </div>
                            <div class="col-2">
                                <el-badge v-if="friend.unread_cnt != 0" :value="friend.unread_cnt" class="msg_count">
                                    
                                </el-badge>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="chat-window">
                <div class="title_header">
                    <h3>{{ selectedFriend.name }}</h3>
                </div>
                <div class="messages" ref="messages">
                    <div class="message" v-for="message in selectedFriend.messages" :key="message.id"
                        v-bind:class="message.sendUserId == $store.state.user.id ? 'sent' : 'received'">
                        &nbsp;<img :src="selectedFriend.avatar" alt="friend-avatar"
                            v-if="message.sendUserId != $store.state.user.id" class="friend-chat-avatar" /> &nbsp;&nbsp;
                        <div class="message-content">{{ message.content }} </div>
                        <img :src="$store.state.user.avatar" alt="friend-avatar"
                            v-if="message.sendUserId == $store.state.user.id" class="friend-chat-avatar" />
                    </div>
                </div>
                <div class="input">
                    <el-input type="textarea" :rows="4" v-model="messageInput" placeholder="来聊天吧...">
                    </el-input>
                    <el-button type="info" id="send" plain @click="sendMessage"
                        :disabled="selectedFriend.id == null ? true : false">发送</el-button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { ChatBody } from '@/assets/scripts/ChatBody.js';
import $ from 'jquery';
import { API_URL, WS_URL } from '@/assets/apis/api';
import { useStore } from 'vuex';
import { total_message_unread } from '@/components/base/NavBar.vue';

export let selectedFriend = ref({ id: null, name: null, avatar: null, unread_cnt: 0, messages: [] });
export let friends = ref([]);

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
        const socketUrl = `${WS_URL}/${store.state.user.token}`;
        let messages = ref(null);
        let chat_body = ref(null);
        let chat_header = ref(null);
        let chat_msg = ref("");
        let messageInput = ref('');
        let socket = null;
        onMounted(() => {
            new ChatBody(chat_body.value, chat_header.value);
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
                }
            });
        });

        const close_chat = () => {
            context.emit("open_chat_body");
        }

        const sendMessage = () => {
            if (messageInput.value.trim() !== '') {
                let to_id = selectedFriend.value.id;
                let my_id = store.state.user.id;
                selectedFriend.value.messages.push({ id: selectedFriend.value.messages.length + 1, content: messageInput.value, sendUserId: my_id });
                scroll();
                socket = store.state.gogame.socket;
                if (null == socket) {
                    socket = new WebSocket(socketUrl);
                    store.commit("updateSocket", socket);
                }
                socket.send(JSON.stringify({
                    event: "chat",
                    send_id: my_id,
                    to_id: to_id,
                    msg: messageInput.value,
                }));
                messageInput.value = '';
            }
        }

        const selectFriend = (friend) => {
            selectedFriend.value = friend;
            total_message_unread.value -= friend.unread_cnt;
            friend.unread_cnt = 0;
            $.ajax({
                url: `${API_URL}/messages/clearUnread/`,
                type: "post",
                data: {
                    send_id: friend.id,
                    receive_id: store.state.user.id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success() {
                },
                error(err) {
                    console.log(err);
                }
            });
        }

        const scroll = () => {
            messages.value.scrollTop = messages.value.scrollHeight;
        }


        return {
            chat_body,
            socketUrl,
            messageInput,
            selectedFriend,
            chat_header,
            chat_msg,
            friends,
            messages,
            close_chat,
            sendMessage,
            scroll,
            selectFriend,
        }
    },
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
    box-shadow: 1px 1px 1px rgba(130, 121, 121, 0.8);
    z-index: 999;
}

.pull-left {
    float: left !important;
    margin: 5px auto auto 15px;
    height: 50px;
}

.chat_logo {
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
    background-color: rgba(146, 152, 152, 0.1);
}

.messages {
    flex: 1;
    overflow-y: scroll;
    padding: 20px;
}

.message {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    white-space: pre-wrap;
}

.message-content {
    max-width: 85%;
    word-wrap: break-word;
    white-space: pre-wrap;
}

.message.sent {
    justify-content: flex-end;
    margin-left: 50%;
    border-radius: 5px;
    background-color: rgba(110, 181, 235, 0.4);
}

.message.received {
    justify-content: flex-start;
    margin-right: 50%;
    border-radius: 5px;
    background-color: #f7f7f7;
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

.friend-chat-avatar {
    width: 4vh;
    height: 4vh;
    border-radius: 50%;
}

.friend-list-avatar {
    width: 4vh;
    height: 4vh;
    margin-top: 7px;
    border-radius: 50%;
}

.friend-status {
    display: flex;
    align-items: center;
    margin-right: 10px;
    margin-top: 10px;
}

.online::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: rgb(22, 207, 22);
    border-radius: 50%;
    margin-right: 5px;
}

.offline::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: gray;
    border-radius: 50%;
    margin-right: 5px;
}

.friend-name {
    margin-top: 10px;
    font-weight: bold;
}

.msg_count {
    display: inline-block;
    margin-top: 12px;
    margin-right: 10px;
}
</style>