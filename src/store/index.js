import { createStore } from 'vuex'
import UserModule from './user'
import GoGameModule from './gogame'
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
    //game: GameModule,
    gogame: GoGameModule,
    record: GameRecord,
  }
})
