import { toRaw, markRaw } from "vue";
import { localRouterMap, errorRouterMap } from "@/router/";
import Router from "@/router/";
import { getMenuList } from "@/api/user";

import Layout from "@/views/layout/layout";
const commontRouterMap = [
    //
    //     path: "/",
    //     name: "首页",
    //     redirect: "/home/index",
    //     component: Layout
    // },
    {
        path: "/login",
        name: "login",
        hidden: true,
        component: () => import("@/views/login/index")
    },
    {
        path: "/forgotPassword",
        name: "forgotPassword",
        hidden: true,
        component: () => import("@/views/forgotPassword/index")
    },
    {
        path: "/register",
        name: "register",
        hidden: true,
        component: () => import("@/views/register/index")
    },
    {
        path: "/register/detail",
        name: "registerDetail",
        hidden: true,
        component: () => import("@/views/register/detail")
    },
    //店铺装修
    {
        path: "/storeManage/storeDesign/storeFitment",
        name: "storeFitment",
        hidden: true,
        component: () => import("@/views/storeManage/storeDesign/storeFitment/index")
    },
    //店铺装修预览
    {
        path: "/storeManage/storeDesign/storeFitment/preview",
        name: "storePreview",
        hidden: true,
        component: () => import("@/views/storeManage/storeDesign/storeFitment/preview")
    },
    {
        path: "/message/message",
        name: "message",
        hidden: true,
        component: () => import("@/views/message/message")
    },
    {
        path: "/message/feedback",
        name: "feedback",
        hidden: true,
        component: () => import("@/views/message/feedback")
    }
];

const router = {
    namespaced: true,
    state: {
        //当前已存在的路由列表
        routers: [
            ...commontRouterMap //公共页面路由
        ],
        //动态添加的路由列表
        addRouters: null
    },
    getters: {
        //获取动态添加的路由列表
        getaddRouters: (state) => state.addRouters,
        //获取当前已存在的路由列表
        getRouters: (state) => state.routers,
        //获取第一个动态路由
        getFirstRouter: (state) => {
            return getTreeRouterPath(state.addRouters[0], [state.addRouters[0].path]);
        }
    },
    mutations: {
        //归并路由
        SET_ROUTERS: (state, data) => {
            let { accessedRouters: addRouters } = data;

            //保存属于该角色动态添加的权限路由（远程菜单路由+本地权限路由都是动态添加的+错误页路由）
            state.addRouters = markRaw([...addRouters]); //, ...localRouterMap, ...errorRouterMap(错误路由一定要放在最后添加，否则页面会被错误路由劫持)
            //将当前已存在的路由与动态添加的路由合并保存
            state.routers = markRaw([...commontRouterMap, ...state.addRouters]);
        },
        //清除动态添加的路由
        CLEAR_ADDROUTERS: (state) => {
            //删除已添加的路由
            const getRoutes = Router.getRoutes();
            if (state.addRouters) {
                const routersName = toRaw(state.addRouters).map((item) => item.name);
                for (let i = 0; i < getRoutes.length; i++) {
                    if (routersName.includes(getRoutes[i].name)) {
                        Router.removeRoute(getRoutes[i].name);
                    }
                }
            }
            state.addRouters = null;
        }
    },
    actions: {
        // 根据角色 生成响应的路由
        GenerateRoutes({ state, commit }) {
            return new Promise((resolve, reject) => {
                getMenuList()
                    .then((res) => {
                        //清除动态添加的路由
                        commit("CLEAR_ADDROUTERS");

                        const menuList = getTree(res.data);
                        let res2 = {
                            state: 200,
                            message: "操作成功!",
                            data: [
                                {
                                    path: "/home",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "home",
                                    roleMenuId: "1",
                                    meta: {
                                        icon: "el-icon-menu",
                                        title: "Home"
                                    },
                                    children: [
                                        {
                                            path: "index",
                                            component: "/home/index",
                                            hidden: false,
                                            alone: false,
                                            name: "homeIndex",
                                            roleMenuId: "5",
                                            meta: {
                                                icon: "el-icon-menu",
                                                title: "主页"
                                            },
                                            children: []
                                        }
                                    ],
                                    alone: "false"
                                },
                                {
                                    path: "/commodity",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "commodity",
                                    roleMenuId: "null",
                                    meta: {
                                        icon: "el-icon-tickets",
                                        title: "发货管理"
                                    },
                                    children: [
                                        {
                                            path: "order",
                                            component: "/commodity/orderInquiry",
                                            hidden: false,
                                            alone: false,
                                            name: "orderInquiry",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "订单查询"
                                            },
                                            children: []
                                        },
                                        {
                                            path: "conveyTools",
                                            component: "/commodity/conveyTools",
                                            hidden: false,
                                            alone: false,
                                            name: "conveyTools",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "物流工具"
                                            },
                                            children: []
                                        }
                                        // {
                                        //     path: "orderDetail",
                                        //     component: "/commodity/orderDetail",
                                        //     hidden: true,
                                        //     alone: true,
                                        //     name: "orderDetail",
                                        //     meta: {
                                        //         title: "订单详情"
                                        //     }
                                        // }
                                    ],
                                    alone: "false"
                                },
                                {
                                    path: "/goods-manage",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "goods-manage",
                                    roleMenuId: "2",
                                    meta: {
                                        icon: "el-icon-tickets",
                                        title: "商品管理"
                                    },
                                    children: [
                                        {
                                            path: "repairGoods",
                                            //component: () => import("@/views/goodsManage/repairGoods/index"),
                                            component: "/goodsManage/repairGoods/index",
                                            hidden: false,
                                            name: "repairGoods",
                                            roleMenuId: "2",
                                            meta: {
                                                icon: "",
                                                title: "商品修复"
                                            },
                                            children: []
                                        },
                                        {
                                            path: "publishGoods",
                                            component: "/goodsManage/publishGoods",
                                            hidden: false,
                                            name: "publishGoods",
                                            roleMenuId: "2",
                                            meta: {
                                                icon: "",
                                                title: "发布新商品"
                                            },
                                            children: []
                                        },
                                        {
                                            path: "goodsInfoDetail",
                                            component: "/goodsManage/goodsInfoDetail",
                                            hidden: true,
                                            name: "goodsInfoDetail",
                                            meta: {
                                                icon: "",
                                                title: "完善商品信息"
                                            }
                                        },
                                        {
                                            path: "goodsInfoDetailEdit",
                                            component: "/goodsManage/goodsInfoDetailEdit",
                                            hidden: true,
                                            name: "goodsInfoDetailEdit",
                                            meta: {
                                                icon: "",
                                                title: "商品详情编辑"
                                            }
                                        },
                                        {
                                            path: "goodsList",
                                            component: "/goodsManage/goodsList",
                                            hidden: false,
                                            name: "goodsList",
                                            meta: {
                                                icon: "",
                                                title: "商品列表"
                                            }
                                        },
                                        {
                                            path: "comments",
                                            component: "/goodsManage/comments",
                                            hidden: false,
                                            name: "comments",
                                            meta: {
                                                icon: "",
                                                title: "评价管理"
                                            }
                                        },
                                        {
                                            path: "recycleBin",
                                            component: "/goodsManage/recyclebin",
                                            hidden: false,
                                            name: "recycleBin",
                                            meta: {
                                                icon: "",
                                                title: "商品回收站"
                                            }
                                        },
                                        {
                                            path: "drafts",
                                            component: "/goodsManage/drafts",
                                            hidden: false,
                                            name: "drafts",
                                            meta: {
                                                icon: "",
                                                title: "草稿箱"
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: "/services",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "services",
                                    roleMenuId: "2",
                                    meta: {
                                        icon: "el-icon-tickets",
                                        title: "售后管理"
                                    },
                                    children: [
                                        {
                                            path: "platform",
                                            component: "/services/platform",
                                            hidden: false,
                                            name: "platform",
                                            meta: {
                                                icon: "",
                                                title: "售后工作台"
                                            }
                                        },
                                        {
                                            path: "workOrder",
                                            component: "/services/workorder",
                                            hidden: false,
                                            name: "wordOrder",
                                            meta: {
                                                icon: "",
                                                title: "工单管理"
                                            }
                                        },
                                        {
                                            path: "platformDetail",
                                            component: "/services/platformDetail",
                                            hidden: true,
                                            name: "platformDetail",
                                            meta: {
                                                icon: "",
                                                title: "售后详情"
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: "/finance",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "finance",
                                    roleMenuId: "2",
                                    meta: {
                                        icon: "el-icon-tickets",
                                        title: "财务中心"
                                    },
                                    children: [
                                        {
                                            path: "fund",
                                            component: "/finance/fund",
                                            hidden: false,
                                            name: "fund",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "资金管理"
                                            }
                                        },
                                        {
                                            path: "billDetails",
                                            component: "/finance/billDetails",
                                            hidden: false,
                                            name: "billDetails",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "账单明细"
                                            }
                                        },
                                        {
                                            path: "accountCheck",
                                            component: "/finance/accountCheck",
                                            hidden: false,
                                            name: "accountCheck",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "对账中心"
                                            }
                                        },
                                        {
                                            path: "deposit",
                                            component: "/finance/deposit",
                                            hidden: false,
                                            name: "deposit",
                                            meta: {
                                                icon: "el-icon-tickets",
                                                title: "保证金"
                                            }
                                        },
                                        {
                                            path: "depositDetail",
                                            component: "/finance/depositDetail",
                                            hidden: true,
                                            name: "depositDetail",
                                            meta: {
                                                icon: "",
                                                title: "提现"
                                            }
                                        },
                                        {
                                            path: "accountGather",
                                            component: "/finance/account",
                                            hidden: true,
                                            name: "accountGather",
                                            meta: {
                                                icon: "",
                                                title: "收款账户"
                                            }
                                        },
                                        {
                                            path: "cashier",
                                            component: "/finance/cashier",
                                            name: "cashier",
                                            hidden: true,
                                            meta: {
                                                icon: "",
                                                title: "收银台"
                                            }
                                        },
                                        {
                                            path: "guaranteeDeposit",
                                            component: "/finance/guaranteeDeposit",
                                            name: "guaranteeDeposit",
                                            hidden: true,
                                            meta: {
                                                icon: "",
                                                title: "保证金提现"
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: "/warehouse",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "warehouse",
                                    roleMenuId: "2",
                                    meta: {
                                        icon: "el-icon-tickets",
                                        title: "FBT仓库"
                                    },
                                    children: [
                                        {
                                            path: "shipmentsPlan",
                                            component: "/warehouse/shipmentsPlan/index",
                                            hidden: false,
                                            name: "shipmentsPlan",
                                            meta: {
                                                icon: "",
                                                title: "发/补货计划"
                                            }
                                        },
                                        {
                                            path: "returns",
                                            component: "/warehouse/returns/index",
                                            name: "returns",
                                            hidden: false,
                                            meta: {
                                                icon: "",
                                                title: "退货管理"
                                            }
                                        },
                                        {
                                            path: "inventory",
                                            component: "/warehouse/inventory",
                                            hidden: false,
                                            meta: {
                                                icon: "",
                                                title: "库存明细"
                                            }
                                        }
                                    ]
                                },
                                {
                                    path: "/storeManage",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "storeManage",
                                    roleMenuId: "2",
                                    meta: {
                                        icon: "el-icon-tickets",
                                        title: "店铺管理"
                                    },
                                    children: [
                                        {
                                            path: "storeDesign",
                                            component: "/storeManage/storeDesign/storeList/index",
                                            name: "storeDesign",
                                            hidden: false,
                                            meta: {
                                                icon: "",
                                                title: "店铺装修"
                                            }
                                        },
                                        {
                                            path: "BrandAuthentication",
                                            component: "/storeManage/BrandAuthentication/index",
                                            name: "BrandAuthentication",
                                            hidden: false,
                                            meta: {
                                                icon: "",
                                                title: "品牌资质"
                                            }
                                        },
                                        {
                                            path: "addBrand",
                                            component: "/storeManage/addBrand",
                                            name: "addBrand",
                                            hidden: true,
                                            meta: {
                                                icon: "",
                                                title: "添加商标"
                                            }
                                        },
                                        {
                                            path: "store_info",
                                            component: "/storeManage/merchant_Info",
                                            name: "store_info",
                                            hidden: false,
                                            meta: {
                                                icon: "",
                                                title: "店铺基本信息"
                                            }
                                        },
                                        {
                                            path: "merchant_Info",
                                            component: "/storeManage/merchant_Info",
                                            name: "merchant_Info",
                                            hidden: false,
                                            meta: {
                                                icon: "",
                                                title: "店铺信息新"
                                            }
                                        }
                                        // {
                                        //     path: "store-design/newStore",
                                        //     component: "/store-design/newStore",
                                        //     name: "newStore",
                                        //     hidden: false,
                                        //     meta: {
                                        //         icon: "",
                                        //         title: "店铺装修创建",
                                        //     },
                                        // },
                                    ]
                                },
                                {
                                    path: "/system",
                                    component: "/layout/layout",
                                    hidden: false,
                                    name: "",
                                    meta: {
                                        icon: "el-icon-tickets",
                                        title: "系统"
                                    },
                                    children: [
                                        {
                                            path: "user",
                                            component: "/system/user/index",
                                            hidden: false,
                                            name: "user",
                                            meta: {
                                                icon: "",
                                                title: "子账号管理"
                                            }
                                        },
                                        {
                                            path: "role",
                                            component: "/system/role/index",
                                            hidden: false,
                                            name: "role",
                                            meta: {
                                                icon: "",
                                                title: "角色管理"
                                            }
                                        },
                                        {
                                            path: "menu",
                                            component: "/system/menu/index",
                                            hidden: false,
                                            name: "menu",
                                            meta: {
                                                icon: "",
                                                title: "菜单管理"
                                            }
                                        },
                                        {
                                            path: "account",
                                            component: "/system/account/index",
                                            hidden: false,
                                            name: "account",
                                            meta: {
                                                icon: "",
                                                title: "账户管理"
                                            }
                                        },
                                        {
                                            path: "agreement",
                                            component: "/message/agreement",
                                            hidden: false,
                                            name: "agreement",
                                            meta: {
                                                icon: "",
                                                title: "协议"
                                            }
                                        }
                                    ]
                                }
                            ]
                        };
                        // 处理远程获取的路由
                        //const newRouters = importComponents(res2.data);
                        const newRouters = importComponents(menuList);
                        // 递归循环路由获取该角色的允许的路由并返回
                        const accessedRouters = newRouters;

                        // 保存允许访问的路由
                        commit("SET_ROUTERS", { accessedRouters });

                        //获取动态添加的路由
                        const addRoutes = toRaw(state.addRouters);

                        //注入到路由
                        for (let i = 0; i < addRoutes.length; i++) {
                            Router.addRoute(addRoutes[i]); // 动态添加可访问路由表
                        }

                        resolve(menuList);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }
    }
};
function getTree(data) {
    // 删除 所有 children,以防止多次调用
    // data.forEach(function(item) {
    //     delete item.children;
    // });
    let map = {};
    data.forEach(function (item) {
        item.meta = {};
        map[item.menuId] = item;
    });
    let menuList = [];
    data.forEach(function (item) {
        let parent = map[item.parentId];
        if (parent) {
            //=0菜单 1按钮
            if (item.type === "0") {
                (parent.children || (parent.children = [])).push(item);
            } else if (item.type === "1") {
                (parent.meta.btnGroup || (parent.meta.btnGroup = [])).push(item.permission);
            }
        } else if (item.parentId === -1) {
            if (item.path == "/home") {
                item.alone = true;
            }
            item.component = "/layout/layout";
            menuList.push(item);
        }
    });
    return menuList;
}

/**
 * 递归循环路由获取属于该角色的路由
 * @param routes asyncRoutes
 */
export function filterAsyncRoutes(routes) {
    return routes;
    // const res = [];
    // // 递归循环路由
    // routes.forEach((route) => {
    //     // 展开当前路由
    //     const tmp = route;
    //     // 判断角色是否有该路由的权限
    //     if (hasPermission(role, tmp)) {
    //         // 判断是否隐藏菜单，
    //         //如果是 true 代表该路由全部角色都不在菜单栏显示 或 false 代表该路由全部角色都在菜单栏显示,
    //         //如果是 数组 代表该路由数组里的角色都不在菜单栏显示

    //         // // 这里判断hidden(是否显示隐藏菜单)是否存在还有是数组的情况
    //         // if (tmp.hasOwnProperty("hidden")) {
    //         //     if (tmp.hidden && Array.isArray(tmp.hidden)) {
    //         //         // 如果hidden是数组，判断是否包含该角色，包含则不在菜单栏显示，重新定义hidden为 true，反之 false 展示
    //         //         tmp.hidden = tmp.hidden.includes(role) ? true : false;
    //         //     }
    //         // } else {
    //         //     tmp.hidden = true;
    //         // }

    //         // // 这里判断alone（只有一个菜单是否显示目录）的情况
    //         // if (!tmp.hasOwnProperty("alone")) {
    //         //     tmp.alone = false;
    //         // }

    //         // // 这里判断meta（iconc菜单图标 title菜单标题 role）的情况
    //         // if (!tmp.hasOwnProperty("meta")) {
    //         //     tmp.meta = {};
    //         // }

    //         // 将满足条件且处理后的路由数据保存起来
    //         res.push(tmp);

    //         // 有子路由继续递归
    //         if (tmp.hasOwnProperty("children") && tmp.children.length > 0) {
    //             tmp.children = filterAsyncRoutes(tmp.children, role);
    //         }
    //     }
    // });
    // return res;
}

/**
 * 转换字符换为成引入组件的函数
 * @param routes //要查找的路由对象
 */
function importComponents(routes) {
    routes.forEach((item, index) => {
        item.component = item.component && getViews(item.component);
        if (item.children && item.children.length > 0) {
            importComponents(item.children);
        } else {
            delete item.children;
        }
    });
    return routes;
}

/**
 * 转路径为函数
 * @param component //组件路径
 */
function getViews(component) {
    return () => import("@/views" + component + ".vue");
    // return resolve => {
    //   require.ensure([], require => {
    //     resolve(require("@/views/" + path + ".vue"));
    //   });
    // };
}

/**
 * 第一个有权限的路由
 * @param component //组件路径
 */
function getTreeRouterPath(data, path) {
    let arr = path;
    if (data.children && data.children.length > 0) {
        arr.push(data.children[0].path);
        getTreeRouterPath(data.children[0], arr);
    }
    return path.join("/");
}

export default router;
