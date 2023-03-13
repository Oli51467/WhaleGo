import { createRouter, createWebHistory } from 'vue-router'
import PlayHallView from '../views/community/PlayHallView'
import PlayRoomView from '../views/play/PlayRoomView'
import RecordIndexView from '../views/record/RecordIndexView'
import RecordReviewView from '../views/record/RecordReviewView'
import FriendIndexView from '../views/friend/FriendIndexView'
import CommunityIndexView from '../views/community/CommunityIndexView'
import UserIndexView from '../views/user/index/UserIndexView'
import NotFoundView from '../views/error/NotFoundView'
import LoginView from '../views/user/account/LoginView'
import RegisterView from '../views/user/account/RegisterView'
import UpdateUserInfoView from '../views/user/index/UpdateUserInfoView'
import GoPlayView from '../views/play/GoPlayView'
import VideoGroupView from '../views/community/VideoGroupIndex.vue'
import store from '../store/index'

const routes = [
    {
        path: '/',
        name: "home",
        redirect: "/playhall/",
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/playhall/',
        name: 'playhall',
        component: PlayHallView,
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/goplay/',
        name: 'goplay',
        component: GoPlayView,
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/playroom/:roomId/',
        name: 'playroom',
        component: PlayRoomView,
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/record/:recordId/',
        name: 'record_review',
        component: RecordReviewView,
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/record/',
        name: 'record',
        component: RecordIndexView,
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/friend/',
        name: 'friend',
        component: FriendIndexView,
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/community/',
        name: 'community',
        component: CommunityIndexView,
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/community/video/',
        name: 'video_index',
        component: VideoGroupView,
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/user/index/:userId',
        name: 'user_index',
        component: UserIndexView,
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/user/login',
        name: 'login',
        component: LoginView,
        meta: {
            requestAuth: false,
        }
    },
    {
        path: '/user/register',
        name: 'register',
        component: RegisterView,
        meta: {
            requestAuth: false,
        }
    },
    {
        path: '/user/update/:userId',
        name: 'update_info',
        component: UpdateUserInfoView,
        meta: {
            requestAuth: true,
        }
    },
    {
        path: '/404/',
        name: '404',
        component: NotFoundView,
        meta: {
            requestAuth: false,
        }
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/404/',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 一个跳转页面的api 在router加载之前起作用 from..to 来自哪个页面和目标页面 next 要不要进行下一步
router.beforeEach((to, from, next) => {
    if (to.meta.requestAuth && !store.state.user.is_login) {
        next({ name: "login" });
    } else {
        next();
    }
})

export default router
