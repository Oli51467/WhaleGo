import { createStore } from 'vuex'
import UserModule from './user'
import GoGameModule from './game'

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
    }
})
