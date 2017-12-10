import util from './util';

let staticPath = util.domain + '/static/data/';

let CACHE_MAX = 60 * 24 * 60;

let MANAGE = {
    // 评分标准
    standard: staticPath + 'standard.json',
    // 用户管理
    userTypeList: {
        id: 4,
        nonce: 'dc2861d656',
        cache: CACHE_MAX
    },
    deptList: {
        id: 5,
        nonce: '145ce9a426',
        cache: 0
    },
    userList: {
        id: 6,
        nonce: 'f150045a94',
        cache: 0
    },
    // 公司领导分管部门
    leaderDepts: {
        id: 9,
        nonce: '596c278e0b',
        cache: 0
    },
    // 部门管理
    depts: {
        id: 7,
        nonce: '6f77963c65',
        cache: 0
    },
    leaderList: {
        id: 8,
        nonce: '719f24df9c',
        cache: CACHE_MAX
    },

    // 任务管理
    taskList: {
        id: 10,
        nonce: '302ea10d9f',
        cache: 0
    }
};

let PAPER = {
    depts: {
        id: 11,
        nonce: 'e6d832ad83',
        cache: CACHE_MAX
    },
    userList: {
        id: 12,
        nonce: 'd91dabea8f',
        cache: CACHE_MAX
    },
    scoreList: {
        id: 13,
        nonce: 'e7bfeab257',
        cache: 0
    }
};

export default {
    MANAGE,
    PAPER
};