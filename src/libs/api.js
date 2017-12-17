import util from "./util";

let staticPath = util.domain + "/static/data/";

let CACHE_MAX = 60 * 24 * 60;
let ONE_DAY = 60 * 24;

let MANAGE = {
    // 评分标准
    standard: staticPath + "standard.json",
    // 用户管理
    userTypeList: {
        id: 4,
        nonce: "dc2861d656",
        cache: ONE_DAY
    },
    deptList: {
        id: 5,
        nonce: "145ce9a426",
        cache: 0
    },
    userList: {
        id: 6,
        nonce: "f150045a94",
        cache: 0
    },
    // 公司领导分管部门
    leaderDepts: {
        id: 9,
        nonce: "596c278e0b",
        cache: 0
    },
    // 部门管理
    depts: {
        id: 7,
        nonce: "6f77963c65",
        cache: 0
    },
    leaderList: {
        id: 8,
        nonce: "719f24df9c",
        cache: ONE_DAY
    },

    // 任务管理
    taskList: {
        id: 10,
        nonce: "302ea10d9f",
        cache: 0
    }
};

let PAPER = {
    userInfo: {
        id: 14,
        nonce: "78473cfd9b",
        cache: 0
    },
    depts: {
        id: 11,
        nonce: "e6d832ad83",
        cache: ONE_DAY
    },
    userList: {
        id: 12,
        nonce: "d91dabea8f",
        cache: ONE_DAY
    },
    scoreList: {
        id: 13,
        nonce: "e7bfeab257",
        cache: 0
    },
    historyScoreList: {
        id: 17,
        nonce: "d49f6ab566",
        cache: ONE_DAY
    }
};

let STATISTIC = {
    // 本人所在部门的得分统计
    leaderScore: {
        id: 15,
        nonce: "09a7b28c5d",
        cache: 0
    },
    scoreDetail: {
        id: 16,
        nonce: "481b099e41",
        cache: 0
    }
};

let USERTYPE = {
    USER: 2, //普通用户
    LEADER: 1, // 公司领导
    CHAIRMAN: 0 // 董事长、总经理、书记
};
export default {
    MANAGE,
    PAPER,
    STATISTIC,
    USERTYPE
};