import util from './util';

let staticPath = util.domain + '/static/data/';

let CACHE_MAX = 60 * 24 * 60;

let MANAGE = {
    standard: staticPath + 'standard.json',
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
    }
};

export default {
    MANAGE
};