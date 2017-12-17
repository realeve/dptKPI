import Cookies from "js-cookie";
import { axios, API } from "../../libs/axios";

const user = {
    state: {
        uid: 0,
        name: "",
        fullname: "",
        userType: -1,
        id: 0,
        dept_id: 0
    },
    mutations: {
        logout(state, vm) {
            // Cookies.remove('user');
            Cookies.remove("access");
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute("href", "");
            // 清空打开的页面等数据，但是保存主题数据
            let theme = "";
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        },
        setUserInfo(state, data) {
            state[data.key] = data.value;
        }
    },
    actions: {
        loadUserInfo: async function(contex) {
            let uid = contex.state.uid;
            if (uid == 0) {
                return;
            }
            let params = API.PAPER.userInfo;
            params.uid = uid;
            let data = await axios({ params }).then(res => res.data);
            if (data.length) {
                Cookies.set("access", data[0].type_id == 3 ? 0 : 1);

                contex.commit("setUserInfo", {
                    key: "userType",
                    value: data[0].type_id
                });
                contex.commit("setUserInfo", {
                    key: "id",
                    value: data[0].id
                });
                contex.commit("setUserInfo", {
                    key: "dept_id",
                    value: data[0].dept
                });
            }
        }
    }
};

export default user;