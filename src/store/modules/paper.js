const paper = {
    state: {

    },
    mutations: {
        setPaper(state, data) {
            state[data.key] = data.value;
        }
    }
};

export default paper;