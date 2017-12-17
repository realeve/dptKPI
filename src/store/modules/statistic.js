import { axios, API } from "../../libs/axios";
import _ from "lodash";

// 普通用户需传入部门id，公司领导传入姓名查询分管部门列表
// let getUserScore = async setting => {};

let getLevelByScore = (score, arr) => {
    let sum = 1;
    arr.forEach(item => {
        if (item > score) {
            sum++;
        }
    });
    return sum;
};

let getLeaderScore = async setting => {
    let params = API.STATISTIC.leaderScore;
    params.taskid = setting.id;
    let data = await axios({ params }).then(res =>
        res.data.map(item => {
            item.score_sub = parseFloat(item.score_sub);
            item["工作效果"] = parseFloat(item["工作效果"]);
            item["团队建设"] = parseFloat(item["团队建设"]);
            item["服务配合"] = parseFloat(item["服务配合"]);
            item["持续改进"] = parseFloat(item["持续改进"]);
            return item;
        })
    );
    let level_list_work = [],
        level_list_team = [],
        level_list_service = [],
        level_list_enhance = [];

    // 获取各子项得分排名
    let sum = 0;
    data = data.map((item, i) => {
        item.level = data.length - i; // 排名
        sum += parseFloat(item.score_sub);
        level_list_work.push(item["工作效果"]);
        level_list_team.push(item["团队建设"]);
        level_list_service.push(item["服务配合"]);
        level_list_enhance.push(item["持续改进"]);
        return item;
    });

    data = data.map(item => {
        item.score_avg = (sum / data.length).toFixed(2); // 平均得分
        item.score_percent = (item.score_sub - parseFloat(item.score_avg)).toFixed(
            2
        );

        item.level_work = getLevelByScore(item["工作效果"], level_list_work);
        item.level_team = getLevelByScore(item["团队建设"], level_list_team);
        item.level_service = getLevelByScore(item["服务配合"], level_list_service);
        item.level_enhance = getLevelByScore(item["持续改进"], level_list_enhance);
        return item;
    });
    return data;
};

const paper = {
    state: {
        taskList: [],
        scoreList: [],
        curTask: {},
        curDept: {},
        deptLeaders: [],
        scoreDetail: []
    },
    mutations: {
        setStatistic(state, data) {
            state[data.key] = data.value;
        }
    },
    getters: {},
    actions: {
        getStaScoreList: async function(contex, setting) {
            // let user = setting.user;
            // let value = [];
            // if (user.type_id == API.USERTYPE.USER) {
            //     value = await getLeaderScore(setting);

            //     // value = await getUserScore(setting);
            // } else {
            //     value = await getLeaderScore(setting);
            // }
            let value = await getLeaderScore(setting);
            contex.commit("setStatistic", {
                key: "scoreList",
                value
            });
        },
        getStatScoreDetail: async function(contex) {
            let params = API.STATISTIC.scoreDetail;
            params = Object.assign(params, {
                task_id: contex.state.curTask.id,
                dept_id: contex.state.curDept.dept_id
            });
            let value = await axios({ params }).then(res => res.data);
            contex.commit("setStatistic", {
                key: "scoreDetail",
                value
            });
        }
    }
};

export default paper;