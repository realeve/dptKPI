import { axios, API } from "../../libs/axios";

const paper = {
    state: {
        taskList: [],
        curTask: {},
        deptList: [],
        userList: [],
        curDeptIdx: 0
    },
    mutations: {
        setPaper(state, data) {
            state[data.key] = data.value;
        }
    },
    actions: {
        getTaskList: async function(contex) {
            let value = await axios({ params: API.MANAGE.taskList }).then(res =>
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
        },
        getDeptList: async function(contex) {
            let value = await axios({ params: API.PAPER.depts }).then(res => res.data);
            contex.commit('setPaper', {
                key: 'deptList',
                value
            })
        },
        getUserList: async function(contex) {
            let value = await axios({ params: API.PAPER.userList }).then(res => res.data);
            contex.commit('setPaper', {
                key: 'userList',
                value
            })
        }
    }
};

export default paper;