<template>
    <div class="container">
        <div class="row">

            <div class="col-3">
                <div class="card">
                    <div class="card-body">
                        <img class="photo" :src="$store.state.user.avatar" alt="头像">
                        <hr>    
                        <div class="d-grid gap-2 col-4 mx-auto">
                            <el-upload class="upload-demo" :action="`${API_URL}/user/update/avatar/`" :headers="headers"
                                :show-file-list=false name="file" :before-upload="beforeAvatarUpload"
                                :on-success="uploadSuccess">
                                <el-button type="info" plain>点击上传</el-button>
                            </el-upload>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-9">
                <div class="card">
                    <div class="card-body">
                        <h3>个人信息</h3>
                        <hr>
                        <div class="mb-3 row ">
                            <label for="username" class="col-sm-2 col-form-label user-info"
                                style="float: right;">用户名</label>
                            <div class="col-sm-4">
                                <input v-model="username" type="text" class="form-control" id="username" maxlength="15">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label for="phone" class="col-sm-2 col-form-label user-info">手机号</label>
                            <div class="col-sm-4">
                                <input v-model="phone" type="tel" class="form-control" id="phone" rows="1" maxlength="11" />
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label for="profile" class="col-sm-2 col-form-label user-info">个人简介</label>
                            <div class="col-sm-6">
                                <input v-model="profile" type="text" class="form-control" id="profile" rows="1"
                                    maxlength="30" />
                            </div>
                        </div>

                        <div class="d-grid gap-2 col-2 mx-auto">
                            <el-button type="primary" data-bs-toggle="modal" data-bs-target="#updateInfo"
                                @click="update_user">更新信息</el-button>

                        </div>
                        <div class="modal fade" id="updateInfo" tabindex="-1">
                            <div class="modal-dialog modal-sm">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <div class="modal-title">提示</div>
                                    </div>
                                    <div v-if="isSuccess" class="modal-body mx-auto">
                                        已经成功更新你的资料
                                    </div>
                                    <div v-else class="modal-body mx-auto">
                                        <span class="error_message">{{ error_message }}</span>
                                    </div>
                                    <div class="modal-footer mx-auto">
                                        <button type="button"
                                            :class="isSuccess ? 'btn btn-success btn-sm' : 'btn btn-danger btn-sm'"
                                            style="width: 60px;" data-bs-dismiss="modal">确认</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="card">
                    <div class="card-body">
                        <h3>个人安全</h3>
                        <hr>
                        <div class="row user-security">
                            <div class="col-sm-4">
                                <img src="https://cdn.acwing.com/static/web/img/user/profile/security/password.jpg"
                                    style="width: 25px; margin-left:10px;" alt="">

                                <span>密码</span>
                            </div>
                            <div class="col-sm-4">
                                <span>已设置</span>
                            </div>
                            <div class="col-sm-4 mx-auto">
                                <!-- Button trigger modal -->
                                <button @click="update_message" type="button" class="btn btn-link"
                                    style="text-decoration:none" data-bs-toggle="modal"
                                    data-bs-target="#modifyPassword">修改密码</button>
                            </div>
                            <!-- Modal -->
                            <div class="modal fade" id="modifyPassword" tabindex="-1">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">修改密码</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>

                                        <div class="modal-body">
                                            <form>
                                                <div class="mb-3">
                                                    <label for="old_password" class="form-label">原密码</label>
                                                    <input v-model="updatePassword.old_password" type="password"
                                                        class="form-control" id="old_password">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="new_password" class="form-label">新密码</label>
                                                    <input v-model="updatePassword.new_password" type="password"
                                                        class="form-control" id="new_password">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="confirm_password" class="form-label">确认密码</label>
                                                    <input v-model="updatePassword.confirm_password" type="password"
                                                        class="form-control" id="confirm_password">
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                            <span class="error_message">{{ error_message }}</span>
                                            <button @click="update_password" type="button" data-bs-toggle="modal"
                                                data-bs-target="#updateInfo" class="btn btn-primary">确认</button>
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">取消</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import $ from 'jquery';
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { Modal } from 'bootstrap/dist/js/bootstrap'
import { API_URL } from '@/assets/apis/api';

export default {
    setup() {
        const store = useStore();
        let profile = ref("");
        let username = ref("");
        let phone = ref("");
        let error_message = ref("");
        let fileList = ref([]);
        let updatePassword = reactive({
            old_password: "",
            new_password: "",
            confirm_password: "",
        });
        let isSuccess = ref(true);

        const user_info = () => {
            $.ajax({
                type: "GET",
                url: `${API_URL}/account/info/`,
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    profile.value = resp.profile;
                    username.value = resp.username;
                    phone.value = resp.phone;
                }
            });
        };

        const update_user = () => {
            error_message.value = "";
            $.ajax({
                type: "POST",
                url: `${API_URL}/user/updateInfo/`,
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                data: {
                    username: username.value,
                    phone: phone.value,
                    profile: profile.value
                },
                success(resp) {
                    console.log(resp.msg);
                    if (resp.msg === "success") {
                        isSuccess.value = true;
                        store.commit("updateUser", {
                            username: username.value,
                            profile: profile.value,
                            phone: phone.value,
                        });
                    } else {
                        isSuccess.value = false;
                        username.value = store.state.user.username;
                        profile.value = store.state.user.profile;
                        phone.value = store.state.user.phone;
                        error_message.value = resp.msg;
                    }
                }
            });
        }

        const update_password = () => {
            error_message.value = "";
            store.dispatch("update_password", {
                ...updatePassword,
                success() {
                    isSuccess.value = true;
                    Modal.getInstance("#modifyPassword").hide();
                    updatePassword.old_password = "";
                    updatePassword.new_password = "";
                    updatePassword.confirm_password = "";
                },
                error(resp) {
                    error_message.value = resp.msg;
                    isSuccess.value = false;
                }
            })
        }

        const update_message = () => {
            error_message.value = "";
        }

        user_info();

        return {
            profile,
            username,
            phone,
            updatePassword,
            error_message,
            isSuccess,
            fileList,
            API_URL,
            update_user,
            user_info,
            update_password,
            update_message,
            headers: {
                Authorization: "Bearer " + store.state.user.token,
            },
        }
    },

    methods: {
        beforeAvatarUpload(file) {
            const isLt50M = file.size / 1024 / 1024 < 5;
            const fileType = file.type;
            const isJPG = fileType === 'image/jpg' || fileType === 'image/jpeg' || fileType === 'image/png'
            // if (['image/jpeg', 'image/png'].indexOf(file.type) == -1) {
            //     this.$message.error('上传图片限制为 png、jpeg格式!');
            //     return false;
            // }
            if (!isJPG) {
                this.$message.error('上传图片的格式只能是 JPG或PNG 格式!')
                return false
            }
            if (!isLt50M) {
                this.$message.error('上传视频大小不能超过 5MB!');
                return false;
            }
            return true;
        },

        // 上传成功的回调
        uploadSuccess(obj) {
            console.log(obj);
            if (obj.success) {
                this.$message.success({
                    dangerouslyUseHTMLString: true,
                    message: obj.msg    
                })
                this.$store.commit("updateAvatar", obj.url);
                //this.inputForm.url = obj.url // 后端返给我们的路径
            } else {
                this.$message.error('操作失败')
            }
        },
    }
}
</script>


<style scoped>
.error_message {
    color: brown;
}

.user-security {
    display: flex;
    align-items: center;
}

span {
    padding: 6px, 12px;
}

.photo {
    width: 100%;
    
}

.card {
    margin-top: 15px;
}

.user-info {
    text-align: right;
}
</style>