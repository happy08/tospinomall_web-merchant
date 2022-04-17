import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const urls = config.DOMAIN_BASE + config.DOMAIN_API + "/basics"; // 基础信息url
const urlAdmin = config.DOMAIN_BASE + config.DOMAIN_API + "/admin"; // admin url
const urlGoods = config.DOMAIN_BASE + config.DOMAIN_API + "/product"; // 商品 product-biz
const url = config.DOMAIN_BASE + config.DOMAIN_API;

export const getDictsByTypes = (params) => get(`${urlAdmin}/dict/getDictsByTypes?types=${params}`); // 数据字典

//发补货计划
export const productDelete = (id) => deletefn(`${urlGoods}/back/product/delete/${id}`); // 通过id删除发补货列表
export const productGetOperateHistory = (backProductId) => deletefn(`${urlGoods}/back/product/get/operateHistory/${backProductId}`); // 获取发补货操作历史列表
export const productInfo = (id) => get(`${urlGoods}/back/product/info/${id}`); // 通过id查询
export const productSellerListPage = (params) => get(`${urlGoods}/back/product/seller/list/page`, params); // 分页查发补货
export const productSellerExport = (params) => get(`${urlGoods}/back/product/seller/export`, params, { responseType: "blob" }); // 卖家中心接口》发补货导出
export const productSellerSave = (params) => postJson(`${urlGoods}/back/product/seller/save`, params); // 新增发补货
export const productSellerUpdate = (params) => put(`${urlGoods}/back/product/seller/update/`, params); // 修改发补货列表/seller/delivery​`
export const productSellerDelivery = (params) => postJson(`${urlGoods}/back/product/seller/delivery`, params); // 立即发货
export const skuSellerList = (params) => get(`${urlGoods}/sku/seller/list`, params); // 分页搜索sku列表
export const productSellerUpdateStatus = (params) => put(`${urlGoods}/back/product/seller/updateStatus/${params.status}`, params.id); // 修改发补货状态
export const fbtSendGoodsLimit = (params) => get(`${urls}/base/fbt/sendGoods/getLimitMap`, params); // 查询发补货设置列表
export const productSellerGetSkuInfo = (params) => get(`${urlGoods}/back/product/seller/getSkuInfo`, params); // 通过skuid获取发补货原先的重量体积

export const sellerDeliveryAddressPage = (params) => get(`${urlAdmin}/ums/seller/deliveryAddress/querySendAddress`, params); // 商家发货地址查询列表

//退货管理
export const returnProductInfo = (id) => get(`${urlGoods}/back/return/product/info/${id}`); // 通过id查询
export const returnProductSellerListPage = (params) => get(`${urlGoods}/back/return/product/seller/list/page`, params); // 查看退货发补货
export const returnProductSellerExport = (params) => get(`${urlGoods}/back/return/product/mall/export`, params, { responseType: "blob" }); // 运营中心接口》退货发补货导出
export const returnProductSellerUpdate = (params) => put(`${urlGoods}/back/return/product/seller/update`, params); // 修改退货发补货列表
export const returnProductSellerSave = (params) => postJson(`${urlGoods}/back/return/product/seller/save`, params); // 新增退货发补货
export const returnProductSellerSubmitCheck = (params) => postJson(`${urlGoods}/back/return/product/seller/submit/check`, params); // 批量提交审核
export const returnProductSellerBatchDelete = (params) => postJson(`${urlGoods}/back/return/product/seller/batch/delete`, params); // 批量删除
