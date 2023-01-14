const GoGameModule = {
    state: {
        board: null,
        status: 'waiting',
        socket: null,
        room_id: "",
        opponent_userid: "",
        current: 0, // 当前轮到哪一方
        which: 0,   // 自己是哪一方
        last_x: -1,
        last_y: -1,
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
        updateSocket(state, socket) {
            state.socket = socket;
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
        },
        updateLastStep(state, last_step) {
            state.last_x = last_step.last_x;
            state.last_y = last_step.last_y;
        },
    },

    actions: {

    },
    modules: {

    }
}

export default GoGameModule;