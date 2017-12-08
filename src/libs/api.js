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
        cache: '0'
    },
    leaderList: {
        id: 8,
        nonce: '719f24df9c',
        cache: CACHE_MAX
    }
};

export default {
    MANAGE
};