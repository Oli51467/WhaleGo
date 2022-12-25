import { createRouter, createWebHistory } from 'vue-router'
import BattleIndexView from '../views/battle/BattleIndexView'
import RecordIndexView from '../views/record/RecordIndexView'
import RankIndexView from '../views/ranklist/RankIndexView'
import UserBotIndexView from '../views/user/bots/UserBotIndexView'
import NotFoundView from '../views/error/NotFoundView'
import LoginView from '../views/user/account/LoginView'
import RegisterView from '../views/user/account/RegisterView'
import store from '../store/index'

const routes = [
  {
    path: '/index',
    name: "home",
    component: BattleIndexView,
    meta: {
      requestAuth: false,
    }
  },
  { 
    path: '/battle/',
    name: 'battle',
    component: BattleIndexView,
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
    path: '/rank/',
    name: 'rank',
    component: RankIndexView,
    meta: {
      requestAuth: true,
    }
  },
  { 
    path: '/user/bots/',
    name: 'user_bots',
    component: UserBotIndexView,
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
    next({ name: "login"});
  } else {
    next();
  }
})

export default router
