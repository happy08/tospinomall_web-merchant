import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const url = config.DOMAIN_BASE + config.DOMAIN_API;

export const storeStylesAdd = (params) => postJson(`${url}/basics/base/storeStyles/seller/add`, params); // 添加页面
export const storeStylesGetListPage = (params) => get(`${url}/basics/base/storeStyles/seller/findListPage`, params); // 查询页面
export const storeStylesRemoveId = (params) => postJson(`${url}/basics/base/storeStyles/seller/removeIds`, params); // 删除页面
export const storeStylesUpdateById = (params) => put(`${url}/basics/base/storeStyles/seller/updateById`, params); // 修改页面

// export const storeStylesFindHeaderTemplate = (params) =>
//     get(`${url}/basics/base/storeStyles/mall/findHeaderTemplate`, params); // 查询所有的头部模板
export const storeStylesGetById = (id) => get(`${url}/basics/base/storeStyles/seller/getById/${id}`); // 查询详情
export const storeStylesPublishNow = (params) => post(`${url}/basics/base/storeStyles/seller/publishNow`, params); // 立即发布
export const storeStylesUpdateComponentInfo = (params) => postJson(`${url}/basics/base/storeStyles/seller/updateComponentInfo`, params); // 装修

export const goodsSellerList = (params) => get(`${url}/product/goods/seller/query`, params); //分页查询已上架商品列表

export const productBatchStockDetail = (params) => get(`${url}/product/ware/seller/batchno/stockDetail/group`, params); // 卖家后台接口》库存明细->批次维度
export const productSkuStockDetail = (params) => get(`${url}/product/ware/seller/sku/stockDetail`, params); // 卖家后台接口》库存明细->sku维度
export const productStockGoodExport = (params) => get(`${url}/product/ware/seller/stock/good/export`, params, { responseType: "blob" }); // 卖家后台接口》库存明细->sku维度导出
export const productBatchExport = (params) => get(`${url}/product/ware/seller/batchno/export`, params, { responseType: "blob" }); // 卖家后台接口》卖家后台接口》批次库存导出
