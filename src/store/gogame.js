const GoGameModule = {
    state: {
        board: null,
        status: 'waiting',
        opponent_avatar: "",
        opponent_username: "",
        socket: null,
        loser: "none",

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
        updateGoSocket(state, socket) {
            state.socket = socket;
        },
        updateGoOpponent(state, opponent) {
            state.opponent_username = opponent.username;
            state.opponent_avatar = opponent.avatar;
        },
        updateGoLoser(state, loser) {
            state.loser = loser;
        },
    },

    actions: {

    },
    modules: {

    }
}

export default GoGameModule;