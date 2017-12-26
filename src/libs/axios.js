import http from "axios";
import qs from "qs";
import util from "./util";

// 将API配置导出
export { default as API }
from "./api";

export let login = async(user, psw) => {
    // let refUrl = location.href.split('?')[0].split('#')[0];
    // 此时可将引用url链接作为 url 参数请求登录，作为强校验；
    // 本部分涉及用户名和密码，用户需自行在服务端用curl申请得到token，勿放置在前端;
    let url = util.ajaxUrl + `authorize.json?user=${user}&psw=${psw}`;
    let token = await http.get(url).then(res => res.data);
    token.name = user;
    handleToken(token.token, token);
    return token;
};

export let getUser = () => {
    let user = window.localStorage.getItem("user");
    if (user == null) {
        user = {
            token: "",
            uid: "",
            name: "",
            fullname: ""
        };
    } else {
        user = JSON.parse(user);
    }
    return user;
};

let handleToken = (token, userInfo = false) => {
    let user = { token };
    let extraInfo = atob(user.token.split(".")[1]);
    user.uid = JSON.parse(extraInfo).extra.uid;
    window._secret = user;
    if (userInfo) {
        user.fullname = userInfo.fullname;
        user.name = userInfo.name;
    } else {
        let data = getUser();
        user.fullname = data.fullname;
        user.name = data.name;
    }
    window.localStorage.setItem("user", JSON.stringify(user));
    return user;
};

export let loadUserInfo = function() {
    if (window.location.hash.includes("login")) {
        return;
    }

    if (typeof window._secret == "undefined") {
        window._secret = {
            token: "",
            uid: ""
        };
    }

    let user = window._secret;

    if (user.token == "") {
        user = window.localStorage.getItem("user");
        if (user == null) {
            window.location.href = "#/login";
            return {
                token: ""
            };
        }
        let userInfo = JSON.parse(user);
        user = handleToken(userInfo.token, userInfo);
    }
    return user;
};

// 自动处理token更新，data 序列化等
export let axios = async option => {
    let user = loadUserInfo();
    // if (user.token == '') {
    //     user = await refreshNoncer();
    // }

    option = Object.assign(option, {
        headers: {
            Authorization: user.token
        }
    });

    if (typeof option.method == "undefined") {
        option.method = "get";
    }

    return await http
        .create({
            baseURL: util.ajaxUrl,
            timeout: 10000,
            transformRequest: [
                function(data) {
                    return qs.stringify(data);
                }
            ]
        })(option)
        .then(res => {
            // 刷新token
            if (typeof res.data.token != "undefined") {
                handleToken(res.data.token);
            }
            return res.data;
        })
        .catch(res => {
            let req = res.response.request;
            let errMsg = `${req.status} ${
        req.statusText
      }<br>数据读取失败<br>错误原因：${res.response.data.errmsg}`;
            let data = res.response.data;
            data.status = req.status;
            data.statusText = req.statusText;
            data.errMsg = errMsg;
            return Promise.reject(data);
        });
};