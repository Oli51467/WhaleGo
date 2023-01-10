const GoGameModule = {
    state: {
        board: null,
        status: 'waiting',
        socket: null,
        loser: "none",
        room_id: "",
        opponent_userid: "",
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
        },
        updateOpponentId(state, opponent_userid) {
            state.opponent_userid = opponent_userid;
        }
    },

    actions: {

    },
    modules: {

    }
}

export default GoGameModule;