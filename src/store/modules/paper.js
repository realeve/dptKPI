import { axios, API } from "../../libs/axios";
import _ from "lodash";
const paper = {
    state: {
        taskList: [],
        curTask: {},
        deptList: [],
        userList: [],
        scoreList: [],
        curDeptIdx: 0,
        curScore: {},
        curScoreDetail: [],
        editModel: "NEW",
        historyScoreList: [],
        completeStatus: []
    },
    mutations: {
        setPaper(state, data) {
            state[data.key] = data.value;
        }
    },
    getters: {
        curDept: (state, getters) => {
            let data = state.deptList[state.curDeptIdx];
            if (typeof data == "undefined") {
                return {
                    leader: "",
                    name: "",
                    value: -1
                };
            }
            return data;
        },
        curLeaders: (state, getters) =>
            state.userList.filter(item => item.dept == getters.curDept.value),
        isNotComplete: (state, getters) =>
            state.curDeptIdx < state.deptList.length ||
            state.scoreList.length < state.deptList.length,
        newScoreList: (state, getters) => {
            let scoreList = _.cloneDeep(state.scoreList);
            if (state.curScore.value == 0) {
                return scoreList;
            }

            let idx = scoreList.findIndex(item => item.name == state.curScore.name);

            if (idx > -1) {
                scoreList.splice(idx, 1);
            }

            return [...scoreList, state.curScore];
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
            contex.commit("setPaper", {
                key: "taskList",
                value
            });
        },
        getDeptList: async function(contex) {
            let value = await axios({ params: API.PAPER.depts }).then(
                res => res.data
            );
            contex.commit("setPaper", {
                key: "deptList",
                value
            });
        },
        getUserList: async function(contex) {
            let value = await axios({ params: API.PAPER.userList }).then(
                res => res.data
            );
            contex.commit("setPaper", {
                key: "userList",
                value
            });
        },
        getCompleteStatus: async function(contex, task_id) {
            let params = API.MANAGE.completeStatus;
            params.task_id = task_id;
            let value = await axios({ params }).then(res => {
                return {
                    body: res.data,
                    header: res.header,
                    filename: "活动" + task_id + "完成情况"
                };
            });
            contex.commit("setPaper", {
                key: "completeStatus",
                value
            });
        },
        getScoreList: async function(contex, setting) {
            let params = API.PAPER.scoreList;
            params = Object.assign(params, setting);
            let data = await axios({ params }).then(res => res.data);
            let value = data.map(item => {
                return {
                    id: item.id,
                    dept_id: item.dept_id,
                    name: item.name,
                    value: item.value,
                    score: [
                        item.score_enhance,
                        item.score_service,
                        item.score_team,
                        item.score_work
                    ]
                };
            });
            contex.commit("setPaper", {
                key: "scoreList",
                value
            });
        },
        getHistoryScoreList: async function(contex, task_id) {
            let params = API.PAPER.historyScoreList;
            params.task_id = task_id;
            let value = await axios({ params }).then(res =>
                res.data.map((item, i) => {
                    item.level = i + 1;
                    return item;
                })
            );
            contex.commit("setPaper", {
                key: "historyScoreList",
                value
            });
        }
    }
};

export default paper;