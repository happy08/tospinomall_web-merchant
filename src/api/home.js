import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const url = config.DOMAIN_BASE + config.DOMAIN_API;

export const getOrderCount = (params) => get(`${url}/order/omsorder/seller/index/count`, params); // 首页获取订单统计
export const getOrderLineChart = (params) => get(`${url}/order/omsorder/seller/index/lineChart`, params); // 首页订单折线图
export const getGoodsCheckCount = (params) => get(`${url}/product/goods/seller/index/check/count`, params); // 首页商品审核统计
export const getGoodsSellingCount = (params) => get(`${url}/product/goods/seller/index/selling/count`, params); // 首页商品上下架统计
export const getBackProductCount = (params) => post(`${url}/product/back/product/seller/index/count`, params); // 首页获取发补货统计信息
export const getWareStockCount = (params) => get(`${url}/product/ware/stock/index/count`, params); // 首页库存规划
