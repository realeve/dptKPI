import { axios, API } from "../../libs/axios";
import _ from 'lodash';

// 普通用户需传入部门id，公司领导传入姓名查询分管部门列表
let getUserScore = async setting => {

}

let getLeaderScore = async setting => {
    let params = API.STATISTIC.leaderScore;
    params.taskid = setting.id;
    return await axios({ params }).then(res => res.data);
}

const paper = {
    state: {
        taskList: [],
        scoreList: [],
        curTask: {}
    },
    mutations: {
        setStatistic(state, data) {
            state[data.key] = data.value;
        }
    },
    getters: {


    },
    actions: {
        getStaScoreList: async function(contex, setting) {

            let user = setting.user;
            let value = [];
            if (user.type_id == API.USERTYPE.USER) {
                value = await getLeaderScore(setting)

                // value = await getUserScore(setting);
            } else {
                value = await getLeaderScore(setting)
            }
            contex.commit('setStatistic', {
                key: 'scoreList',
                value
            })
        }
    }
};

export default paper;