import { createStore } from 'vuex'
import UserModule from './user'
import GoGameModule from './game'
import GameRecord from './record'

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
    gogame: GoGameModule,
    record: GameRecord,
  }
})
