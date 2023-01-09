const GoGameModule = {
    state: {
        board: null,
        status: 'waiting',
        opponent_avatar: "",
        opponent_username: "",
        opponent_userid: "",
        socket: null,
        loser: "none",
        room_id: "",
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
            state.opponent_userid = opponent.userid;
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
        updateRoomId(state, room_id) {
            state.room_id = room_id;
        }
    },

    actions: {

    },
    modules: {

    }
}

export default GoGameModule;