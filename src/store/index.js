import { createStore } from 'vuex'
import UserModule from './user'
import GameModule from './game'
import GoGameModule from './gogame'

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
    gogame: GoGameModule,
  }
})
