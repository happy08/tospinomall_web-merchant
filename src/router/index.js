import { createRouter, createWebHashHistory } from "vue-router";

import Layout from "@/views/layout/layout";

export const commontRouterMap = [
    {
        path: "/",
        name: "default",
        redirect: "/home/index",
        component: Layout
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/login/index")
    },
    {
        path: "/forgotPassword",
        name: "forgotPassword",
        component: () => import("@/views/forgotPassword/index")
    },
    {
        path: "/register",
        name: "register",
        component: () => import("@/views/register/index")
    },
    {
        path: "/register/detail",
        name: "registerDetail",
        component: () => import("@/views/register/detail")
    },
    //店铺装修
    {
        path: "/storeManage/storeDesign/storeFitment",
        name: "storeFitment",
        component: () => import("@/views/storeManage/storeDesign/storeFitment/index")
    },
    //店铺装修预览
    {
        path: "/storeManage/storeDesign/storeFitment/preview",
        name: "storePreview",
        component: () => import("@/views/storeManage/storeDesign/storeFitment/preview")
    },
    {
        path: "/message/message",
        name: "message",
        component: () => import("@/views/message/message")
    },
    {
        path: "/message/feedback",
        name: "feedback",
        component: () => import("@/views/message/feedback")
    },
    {
        path: "/commodity/orderDetail",
        component: () => import("@/views/commodity/orderDetail"),
        name: "订单详情"
    },
    {
        path: "/goodsManage/goodsInfoDetailEdit",
        component: () => import("@/views/goodsManage/goodsInfoDetailEdit"),
        name: "发布新商品"
    },
    {
        path: "/services/platformDetail",
        component: () => import("@/views/services/platformDetail"),
        name: "售后详情"
    },
    {
        path: "/finance/depositDetail",
        component: () => import("@/views/finance/depositDetail"),
        name: "提现"
    },
    {
        path: "/finance/accountGather",
        component: () => import("@/views/finance/account"),
        name: "收款账户"
    },
    {
        path: "/finance/cashier",
        component: () => import("@/views/finance/cashier"),
        name: "收银台"
    },
    {
        path: "/finance/guaranteeDeposit",
        component: () => import("@/views/finance/guaranteeDeposit"),
        name: "保证金提现"
    },
    {
        path: "/message/agreement",
        component: () => import("@/views/message/agreement"),
        name: "协议"
    },
    {
        path: "/storeManage/merchant_Info",
        component: () => import("@/views/storeManage/merchant_Info"),
        name: "店铺信息新"
    }
];

export const localRouterMap = [
    // 本地后台菜单路由
    // {
    //     path: "/adminMenu",
    //     name: "adminMenu",
    //     hidden: false,
    //     component: Layout,
    //     meta: {
    //         title: "本地菜单测试",
    //         icon: "el-icon-menu",
    //     },
    //     children: [
    //         {
    //             path: "menu1",
    //             name: "menu1",
    //             hidden: false,
    //             meta: {
    //                 title: "本地菜单测试1",
    //                 icon: "el-icon-menu",
    //                 role: ["0", "1"], //可访问的角色名称
    //             },
    //             component: () => import("@/views/userpower1/1-1"),
    //         },
    //         {
    //             path: "menu2",
    //             name: "menu2",
    //             hidden: false,
    //             meta: {
    //                 title: "本地菜单测试2",
    //                 icon: "el-icon-menu",
    //                 role: ["0"], //可访问的角色名称
    //             },
    //             component: () => import("@/views/userpower1/1-2"),
    //         },
    //     ],
    // },
    // //本地后台页面路由
    // {
    //     path: "/adminPage",
    //     name: "adminPage",
    //     component: Layout,
    //     children: [
    //         {
    //             path: "page1",
    //             name: "page1",
    //             component: () => import("@/views/userpower1/1-1"),
    //         },
    //         {
    //             path: "page2",
    //             name: "page2",
    //             component: () => import("@/views/userpower1/1-2"),
    //         },
    //     ],
    // },
];

export const asyncRouterMap = [];

//错误页路由
export const errorRouterMap = [
    {
        path: "/:w+",
        name: "error-404",
        hidden: true,
        meta: {
            title: "404-页面不存在"
        },
        component: () => import("@/views/error-page/404")
    },
    {
        path: "/403",
        name: "error-403",
        hidden: true,
        meta: {
            title: "403-权限不足"
        },
        component: () => import("@/views/error-page/403")
    },
    {
        path: "/500",
        name: "error-500",
        hidden: true,
        meta: {
            title: "500-服务端错误"
        },
        component: () => import("@/views/error-page/500")
    }
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes: [...commontRouterMap]
});

export default router;
