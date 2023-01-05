const GameRecord = {
    state: {
        steps: "",
        record_result: "",
        record_time: "",
        black_username: "",
        black_level: "",
        black_avatar: "",
        white_username: "",
        while_level: "",
        white_avatar: "",
    },
    getters: {

    },
    mutations: {
        updateRecord(state, record) {
            state.steps = record.steps;
            state.record_result = record.record_result;
            state.record_time = record.record_time;
            state.black_username = record.black_username;
            state.black_avatar = record.black_avatar;
            state.black_level = record.black_level;
            state.white_username = record.white_username;
            state.white_avatar = record.white_avatar;
            state.while_level = record.while_level;
        }
    },

    actions: {

    },
    modules: {

    }
}

export default GameRecord;