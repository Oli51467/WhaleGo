import { createStore } from 'vuex'
import UserModule from './user'
import SocketModule from './socket'

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
    socket: SocketModule,
  }
})
