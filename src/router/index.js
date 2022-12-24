import { createRouter, createWebHistory } from 'vue-router'
import BattleIndexView from '../views/battle/BattleIndexView'
import RecordIndexView from '../views/record/RecordIndexView'
import RankIndexView from '../views/ranklist/RankIndexView'
import UserBotIndexView from '../views/user/bots/UserBotIndexView'
import NotFoundView from '../views/error/NotFoundView'
import LoginView from '../views/user/account/LoginView'
import RegisterView from '../views/user/account/RegisterView'

const routes = [
  {
    path: '/',
    name: "home",
    redirect: "/battle"
  },
  { 
    path: '/battle/',
    name: 'battle',
    component: BattleIndexView
  },
  { 
    path: '/record/',
    name: 'record',
    component: RecordIndexView
  },
  { 
    path: '/rank/',
    name: 'rank',
    component: RankIndexView
  },
  { 
    path: '/user/bots/',
    name: 'user_bots',
    component: UserBotIndexView
  },
  {
    path: '/user/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/user/register',
    name: 'register',
    component: RegisterView,
  },
  { 
    path: '/404/',
    name: '404',
    component: NotFoundView
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

export default router
