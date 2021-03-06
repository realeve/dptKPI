import Main from "@/views/Main.vue";

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: "/login",
    name: "login",
    meta: {
        title: "Login - 登录"
    },
    component: resolve => {
        require(["@/views/login.vue"], resolve);
    }
};

export const page404 = {
    path: "/*",
    name: "error-404",
    meta: {
        title: "404-页面不存在"
    },
    component: resolve => {
        require(["@/views/error-page/404.vue"], resolve);
    }
};

export const page403 = {
    path: "/403",
    meta: {
        title: "403-权限不足"
    },
    name: "error-403",
    component: resolve => {
        require(["@//views/error-page/403.vue"], resolve);
    }
};

export const page500 = {
    path: "/500",
    meta: {
        title: "500-服务端错误"
    },
    name: "error-500",
    component: resolve => {
        require(["@/views/error-page/500.vue"], resolve);
    }
};

export const locking = {
    path: "/locking",
    name: "locking",
    component: resolve => {
        require([
            "@/views/main-components/lockscreen/components/locking-page.vue"
        ], resolve);
    }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: "/",
    name: "otherRouter",
    redirect: "/home",
    component: Main,
    children: [{
            path: "home",
            title: {
                i18n: "home"
            },
            name: "home_index",
            component: resolve => {
                require(["@/views/home/home.vue"], resolve);
            }
        },
        {
            path: "setting/standard/:id",
            title: {
                i18n: "score_detail"
            },
            name: "setting_score",
            access: 0,
            component: resolve => {
                require(["@/views/base-setting/score.vue"], resolve);
            }
        },
        {
            path: "ownspace",
            title: "个人中心",
            name: "ownspace_index",
            component: resolve => {
                require(["@/views/own-space/own-space.vue"], resolve);
            }
        },
        {
            path: "paper/:id",
            title: "部门评分",
            name: "perform_paper",
            component: resolve => {
                require(["@/views/perform/paper"], resolve);
            }
        },
        {
            path: "statistic/:id",
            title: "评分统计",
            name: "perform_statistic",
            component: resolve => {
                require(["@/views/perform/statistic"], resolve);
            }
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
        //     path: '/access',
        //     icon: 'key',
        //     name: 'access',
        //     title: '权限管理',
        //     component: Main,
        //     children: [
        //         { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['@/views/access/access.vue'], resolve); } }
        //     ]
        // },
        // {
        path: "/setting",
        icon: "settings",
        title: "系统设置",
        name: "setting",
        access: 0,
        component: Main,
        children: [{
                path: "user",
                title: "用户管理",
                name: "setting_user",
                access: 0,
                component: resolve => {
                    require(["@/views/base-setting/user.vue"], resolve);
                }
            },
            {
                path: "dept",
                title: "部门管理",
                name: "setting_dept",
                access: 0,
                component: resolve => {
                    require(["@/views/base-setting/dept.vue"], resolve);
                }
            },
            {
                path: "standard",
                title: "评分标准",
                name: "setting_standard",
                access: 0,
                component: resolve => {
                    require(["@/views/base-setting/standard.vue"], resolve);
                }
            },
            {
                path: "task",
                title: "任务管理",
                name: "setting_task",
                access: 0,
                component: resolve => {
                    require(["@/views/base-setting/task"], resolve);
                }
            }
        ]
    },
    {
        path: "/perform",
        icon: "arrow-graph-up-right",
        title: "评分",
        name: "perform",
        component: Main,
        children: [{
                path: "paper",
                title: "执行力评价",
                name: "perform_paper_list",
                // 管理员只能查看分数，不允许打分
                access: 1,
                component: resolve => {
                    require(["@/views/perform/paper/paperlist.vue"], resolve);
                }
            },
            {
                path: "statistic",
                title: "评价结果",
                name: "perform_statistic_list",
                component: resolve => {
                    require(["@/views/perform/statistic/main.vue"], resolve);
                }
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];