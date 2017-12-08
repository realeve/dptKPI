import { axios, API } from "../../libs/axios";
let MANAGE = API.MANAGE;

const paper = {
    state: {
        taskList: []
    },
    mutations: {
        setPaper(state, data) {
            state[data.key] = data.value;
        }
    },
    actions: {
        getTaskList: async function(contex) {
            let value = await axios({ params: MANAGE.taskList }).then(res =>
                res.data.map(item => {
                    item.is_start = item.is_start == 1 ? true : false;
                    item.is_end = item.is_end == 1 ? true : false;
                    item.status_desc = item.is_start ? "已开始" : "尚未开始";
                    item.status_desc = item.is_end ? "已结束" : item.status_desc;
                    return item;
                })
            );
            contex.commit('setPaper', {
                key: 'taskList',
                value
            })
        }
    }
};

export default paper;