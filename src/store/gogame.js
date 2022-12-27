const GoGameModule = {
    state: {
        board: null,
        status: 'waiting',
    },
    getters: {

    },
    mutations: {
        updateBoard(state, board) {
            state.board = board;
        },
        updateGoGameStatus(state, status) {
            state.status = status;
        },
    },

    actions: {

    },
    modules: {

    }
}

export default GoGameModule;