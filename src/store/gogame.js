const GoGameModule = {
    state: {
        board: null,
        status: 'waiting',
        opponent_avatar: "",
        opponent_username: "",
        socket: null,
        loser: "none",
        black_id: 0,
        white_id: 0,
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
        updateGoGame(state, game) {
            state.black_id = game.black_id;
            state.white_id = game.white_id;
            //state.board = game.board;
        }
    },

    actions: {

    },
    modules: {

    }
}

export default GoGameModule;