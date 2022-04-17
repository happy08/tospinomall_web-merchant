import router from "./router/";
import store from "./store/";
import storage from "@/utils/storage";

const whiteList = ["/login", "/forgotPassword", "/register", "/register/detail", "/message/message", "/message/agreement"]; // 不重定向白名单

// 路由守卫
router.beforeEach(async (to, from, next) => {
    // 判断是否有token
    let token = store.state.user.token;
    token = token ? token : storage.get("token");

    //切换路由，取消上个页面所有请求
    window.__axiosPromiseArr.forEach((ele, index) => {
        ele.cancel();
        window.__axiosPromiseArr.shift();
    });

    if (token) {
        if (to.path === "/login") {
            next({
                path: "/"
            });
        } else {
            const storeInfo = store.state.user.storeInfo;

            //刷新丢失路由重新生成
            if (!storeInfo) {
                try {
                    await Promise.all([
                        store.dispatch("user/getStoreInfo"), // 获取店铺用户信息
                        store.dispatch("router/GenerateRoutes"), //生成响应的路由
                        store.dispatch("app/getCurrentRate"), // 货币
                        store.dispatch("app/getPlatformInfo"), // 平台信息
                        store.dispatch("app/getLocales"), // 默认语言列表
                        store.dispatch("app/getWebsite") // 所有站点
                    ]);
                } catch (error) {
                    await store.dispatch("user/LogOut");
                    return next({
                        path: "/login"
                    });
                }

                next({
                    ...to,
                    replace: true
                });
            } else {
                next(); //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的页面会自动进入404页面
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            try {
                await Promise.race([
                    store.dispatch("app/getCurrentRate"), // 货币
                    store.dispatch("app/getPlatformInfo"), // 平台信息
                    store.dispatch("app/getLocales"), // 默认语言列表
                    store.dispatch("app/getWebsite") // 所有站点
                ]);
            } catch (error) {}
            // 在免登录白名单，直接进入
            next();
        } else {
            // 不在免登录白名单，跳转登录页
            next("/login");
        }
    }

    // 面包屑导航
    if (to.matched.length) {
        const breadcrumbList = [];
        // const notShowBreadcrumbList = ["/home/index"]; // 不显示面包屑的导航
        // if (to.matched[0] && notShowBreadcrumbList.includes(to.matched[0].name)) return breadcrumbList;
        to.matched.forEach((v) => {
            const obj = {
                title: v.name,
                path: v.path
            };
            breadcrumbList.push(obj);
        });
        store.commit("app/CHANGE_BREADCRUMB", breadcrumbList);
    }
});
