import { createStore } from 'vuex'
import UserModule from './user'
import GameModule from './game'
import GoGameModule from './gogame'
import SnakeRecord from './snake_record'

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
    snake_record: SnakeRecord,
  }
})
