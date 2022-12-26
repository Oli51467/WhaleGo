import { createStore } from 'vuex'
import UserModule from './user'
import GameModule from './game'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user: UserModule,
    game: GameModule,
  }
})
