const GoGameModule = {
    state: {
        board: null,
        status: 'waiting',
        opponent_avatar: "",
        opponent_username: "",
        socket: null,
        loser: "none",
        current: 0, // 当前轮到哪一方
        which: 0,   // 自己是哪一方
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
        updateCurrent(state, current) {
            state.current = current;
        },
        updateWhich(state, which) {
            state.which = which;
        },
    },

    actions: {

    },
    modules: {

    }
}

export default GoGameModule;