import { getToken, signOut, smsLogin, adminUmsSellerStoreFindCurrent } from "@/api/user";
import storage from "@/utils/storage";

const user = {
    namespaced: true,
    state: {
        token: "", //token
        userInfo: "", //用户
        storeInfo: "", //店铺信息
        roles: []
    },
    mutations: {
        SET_TOKEN(state, { token, refresh_token }) {
            state.token = token;
            state.refreshToken = refresh_token;
            if (token) {
                storage.set("token", token);
                storage.set("refreshToken", refresh_token);
            } else {
                storage.remove("token");
                storage.remove("refreshToken");
            }
        },
        //用户信息
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo;
            if (userInfo) {
                storage.set("userInfo", userInfo);
            } else {
                storage.remove("userInfo");
            }
        },
        //店铺用户信息
        SET_STOREINFO: (state, storeInfo) => {
            state.storeInfo = storeInfo;
        }
    },
    getters: {},
    actions: {
        // token登录
        getToken({ commit, dispatch }, params) {
            return new Promise((resolve, reject) => {
                const headers = {
                    Authorization: "Basic dGVzdDp0ZXN0"
                };
                getToken(params, { headers })
                    .then(async (res) => {
                        try {
                            const refresh_token = res.data.refresh_token;
                            const token = res.data.token_type + " " + res.data.access_token;
                            commit("SET_TOKEN", { token, refresh_token });
                            const user_info = res.data.user_info;
                            commit("SET_USERINFO", user_info);
                            await Promise.all([
                                dispatch("getStoreInfo"), // 获取店铺用户信息
                                dispatch("router/GenerateRoutes", null, { root: true }) //根据角色 生成响应的路由
                            ]);

                            resolve(res);
                        } catch (err) {
                            reject(err);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        smsLogin({ commit, dispatch }, params) {
            return new Promise((resolve, reject) => {
                const headers = {
                    Authorization: "Basic dGVzdDp0ZXN0"
                };
                smsLogin(params, { headers })
                    .then(async (res) => {
                        try {
                            const refresh_token = res.data.refresh_token;
                            const token = res.data.token_type + " " + res.data.access_token;
                            commit("SET_TOKEN", { token, refresh_token });
                            const user_info = res.data.user_info;
                            commit("SET_USERINFO", user_info);

                            await Promise.all([
                                dispatch("getStoreInfo"), // 获取店铺用户信息
                                dispatch("router/GenerateRoutes", null, { root: true }) //根据角色 生成响应的路由
                            ]);

                            resolve(res);
                        } catch (err) {
                            reject(err);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        // 获取店铺用户信息
        getStoreInfo({ commit, dispatch, state }) {
            return new Promise((resolve, reject) => {
                adminUmsSellerStoreFindCurrent()
                    .then((res) => {
                        commit("SET_STOREINFO", res.data);
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        //退出登录
        LogOut({ commit, state }) {
            return new Promise(async (resolve, reject) => {
                try {
                    await signOut();
                } catch (error) {}
                commit("SET_TOKEN", { token: "", refresh_token: "" });
                commit("SET_USERINFO", "");
                commit("router/CLEAR_ADDROUTERS", [], { root: true }); //清除动态注入的路由

                resolve();
            });
        }
    }
};
export default user;
