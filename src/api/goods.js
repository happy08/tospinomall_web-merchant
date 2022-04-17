import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const urls = config.DOMAIN_BASE + config.DOMAIN_API + "/basics"; // 基础信息url
const urlAdmin = config.DOMAIN_BASE + config.DOMAIN_API + "/admin"; // 基础信息url
const urlGoods = config.DOMAIN_BASE + config.DOMAIN_API + "/product"; // 商品 product-biz
const url = config.DOMAIN_BASE + config.DOMAIN_API;

export const upLoad = (params) =>
    postJson(`${url}/admin/ums/seller/create/object/product-pic-bucket/product_pic`, params, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

export const adminDictType = (params) => get(`${urls}/dict/type/${params}`); // getDictByType 获取数据字典

export const getDictsByTypes = (params) => get(`${urls}/dict/getDictsByTypes?types=${params}`); // 数据字典

export const find = (params) => get(`${urls}/base/businessCategory/find`, params); // 查找所有主营类目

export const tree = (params) => postJson(`${urlGoods}/category/list/tree`, params); // 展示商品分类树
export const categoryListListAll = (params) => postJson(`${urlGoods}/category/listAll`, params); // 获取所有后端分类

export const percentage = (params) => get(`${urlGoods}/category/get/commission/percentage/${params}`); // 抽佣比例

export const listGoodsSpecModelByCategoryId = (params) => get(`${urlGoods}/mmsGoodsSpecModel/seller/listGoodsSpecModelByCategoryId`, params); // 根据分类id查询全部有效的规格模板 带规格值

export const categoryGetPath = (id) => get(`${urlGoods}/category/get/path/${id}`); //通过id查询分类path

export const goodsSellerAdd = (params) => postJson(`${urlGoods}/goods/seller/add`, params); // 新增商品信息

export const mmsGoodsAttributeListGoodsAttributeByCategoryId = (params) => get(`${urlGoods}/mmsGoodsAttribute/seller/listGoodsAttributeByCategoryId`, params); // 查询所有商品参数模板

export const brandListCanUse = (params) => get(`${urlGoods}/brand/seller/list/can/use`, params); // 查询所有有效品牌接口

export const categoryListTree = (params) => postJson(`${urlGoods}/category/list/tree`, params); // 查询全部分类
export const categoryGetServiceConfig = (val) => get(`${urlGoods}/category/seller/get/serviceConfig/${val.categoryId}?deliveryType=${val.deliveryType}`); // 根据分类查询对应的抽比例，服务承诺
export const categoryGetCommissionPercentage = (id) => get(`${urlGoods}/api/category/get/commission/percentage/${id}`); // 根据分类ID获取对应的抽佣比例
export const baseAreaFindByParentId = () => get(`${urls}/base/area/findByParentId?parentId=0`); // 原产国/地区查询
export const findFreightTemplateList = (params) => get(`${urls}/base/logistics/seller/findByFreightType?freightType=${params}`); // 运费模板
export const findFreightTemplateListByIds = (params) => get(`${urls}/base/logistics/seller/findByIds?ids=${params.ids}&freightType=${params.deliveryType}`); // 运费模板
// 商品列表
export const getGoodsSellerList = (params) => get(`${url}/product/goods/seller/query`, params); // 商家后台接口》卖家分页查询商品列表
export const getsCategoryListTree = (params) => postJson(`${urlGoods}/category/list/tree`, params); // 查询全部分类

export const brandMallList = (params) => get(`${url}/product/brand/seller/list/can/use`, params); // 商家后台接口? 获取所有有效的品牌

export const goodsMallGetStatistical = (params) => get(`${url}/product/goods/seller/get/statistical/${params}`); //商家后台接口》卖家中心搜索统计数据type=list表示商品列表统计 type=check审核商品列表
export const goodsSellerStatistical = (params) => get(`${url}/product/goods/seller/statistical`, params); //商家后台接口》卖家获取商品统计数据
export const batchTransformDeliveryType = (params, others) => put(`${url}/product/goods/seller/batch/transform/deliveryType/${others}`, params); // 商家后台接口》卖家批量转换配送模式
export const goodsSellerBatchShelf = (params, status, goodType) => put(`${url}/product/goods/seller/batch/shelfOut/${status}/${goodType}`, params); // 商家后台接口》卖家批量下架
export const goodsSellerBatchDelete = (params) => deletefn(`${url}/product/goods/seller/batch/delete?ids=${params}`); // 商家后台接口》卖家批量删除
export const goodsSellerBatchChangePrice = (params, others) => put(`${url}/product/goods/seller/batch/changePrice/${others}`, params); // 商家后台接口》卖家批量改价
export const goodsSellerBatchAuditSub = (params, others) => put(`${url}/product/goods/seller/batch/batchSubmitCheck`, params); // 商家后台接口》卖家批量提交审核
export const getGoodsSellerCheckList = (params) => get(`${url}/product/goods/seller/check/query`, params); // 商家后台接口》卖家查询审核商品列表
export const goodsSellerCopyGoodsInfo = (params) => post(`${url}/product/goods/seller/copyGoodsInfo`, params); // 商家后台接口》复制商品信息
export const goodsSellerGetExamine = (params) => get(`${url}/product/goods/seller/get/examine/${params}`); // 商家后台接口》通过id查询商品审核详情
export const goodSellerUpdateById = (params) => put(`${url}/product/goods/seller/updateById`, params); // 商家后台接口》修改商品信息
export const draftsUpdateGoodsInfoById = (params) => put(`${url}/product/goods/seller/draftsUpdateGoodsInfoById`, params); // 商家后台接口》草稿箱-修改商品信息
export const productGoodsUndoSubCheck = (params) => postJson(`${url}/product/goods/seller/undo/submitCheck`, params); // 卖家接口》撤销审核商品
export const productGoodsFindLastGoodsExamine = (params) => get(`${url}/product/goods/findLastGoodsExamine/${params}`, { status: 3 }); // 商品-审核列表 》获取商品审核最新情况


// 基础信息地区管理接口
export const findByParentId = (params) => get(`${url}/basics/base/area/findByParentId`, params); // 通用->通过父级ID查询下一级地区，parentId：0为国家
// 基础信息过滤相关接口
export const isRightful = (params) => get(`${url}/basics/base/operator/filterWords/isRightful`, params); // 判断内容是否合法

export const specModelMallExport = (params) => get(`${url}/product/goods/seller/list/export`, params, { responseType: "blob" }); //卖家接口》导出商品列表
export const specModelMallListGoodsCategoryByAttrId = (params) => get(`${url}/product/mmsGoodsSpecModel/mall/listGoodsCategoryByAttrId`, params); //查询该属性所关联的分类
export const specModelMallRelationCategory = (params) => postJson(`${url}/product/mmsGoodsSpecModel/mall/relationCategory`, params); //修改规格关联分类

// 商品回收站接口
export const deleteGoodsSellerBatchRestore = (params) => deletefn(`${url}/product/goods/seller/batch/restore?ids=${params}`); // 商家后台接口》卖家恢复删除
export const goodsSellerRecycleList = (params) => get(`${url}/product/goods/seller/recycle/query`, params); // 商家后台接口》卖家查询回收站
export const goodsSellerDraftList = (params) => get(`${url}/product/goods/seller/draft/query`, params); // 商家后台接口》卖家查询草稿箱
export const goodsSellerRecycleExport = (params) => get(`${url}/product/goods/seller/recycle/export`, params); // 商家后台接口》卖家查询草稿箱
export const goodsSellerDraftExport = (params) => get(`${url}/product/goods/seller/draft/export`, params, { responseType: "blob" }); // 卖家接口》导出草稿箱列表

// 评价
export const evaluatesSellerList = (params) => get(`${url}/product/evaluate/merchants/list`, params); // 卖家-评价分页查询
export const evaluateUpdate = (params) => postJson(`${url}/product/evaluate/update`, params); // 修改商品评价表
export const evaluateSave = (params) => postJson(`${url}/product/evaluate/save`, params); // 新增商品评价

// 发货管理-> 订单查询
export const orderOmsorderSellerList = (params) => get(`${url}/order/omsorder/seller/list`, params); // 商家接口》搜索订单列表
export const orderOmsorderSellerListExport = (params) => get(`${url}/order/omsorder/seller/list/export`, params, { responseType: "blob" }); // 商家中心》搜索订单列表导出
export const omsorderSellerBatchRemark = (params) => postJson(`${url}/order/omsorder/seller/batch/remark`, params); // 商家接口》批量备注
export const omsorderSellerBatchDelivery = (params) => postJson(`${url}/order/omsorder/seller/batch/delivery`, params); // 卖家接口》批量发货
export const omsorderSellerBatchListCount = (params) => get(`${url}/order/omsorder/seller/list/count`, params); // 商家接口》获取订单统计
export const umsQueryRefundAddress = (params) => get(`${url}/admin/ums/seller/deliveryAddress/queryRefundAddress`, params); // 查询所有的退货地址
export const umsQuerySendAddress = (params) => get(`${url}/admin/ums/seller/deliveryAddress/querySendAddress`, params); // 查询所有的发货地址
export const adminUmsAddressSave = (params) => postJson(`${url}/admin/ums/seller/deliveryAddress/save`, params); // 新增店铺收货地址表
export const adminUmsSetDefaultAddress = (params) => post(`${url}/admin/ums/seller/deliveryAddress/setDefaultAddress/${params}`); // 设置默认地址
export const adminUmsAddressDelete = (params) => deletefn(`${url}/admin/ums/seller/deliveryAddress/delete/${params}`); // 卖家web->通过id删除店铺收货地址表
export const adminUmsDeliveryAddressUpdate = (params) => put(`${url}/admin/ums/seller/deliveryAddress/update`, params); // 修改店铺收货地址表
export const basicsAreaFindAreasTree = (params) => get(`${url}/basics/base/area/findAreasTree`, { status: 0, ...params }); // web->查询地区树
export const basicsAreaFindByParentId = (params) => get(`${url}/basics/base/area/findByParentId`, params); // 通过父级ID查询下一级地区，parentId：0为国家

// 订单详情页
export const omsorderDetail = (params) => get(`${url}/order/omsorder/detail/${params}`); // WEB端公共接口》获取订单详情

// 售后管理
export const orderReturnListPage = (params) => get(`${url}/order/orderReturn/seller/listPage`, params); // 商家中心接口》搜索售后订单
export const OrderFindByConditions = (params) => get(`${url}/basics/base/trade/orderReason/findByConditions`, params); // 退款原因
export const orderOrderReturnReturn = (params) => postJson(`${url}/order/orderReturn/seller/batchAgreeRefund`, params); // 商家中心接口》批量同意退款
export const orderOrderReturnListCount = (params) => get(`${url}/order/orderReturn/seller/listCount`, params); // 卖家中心接口》搜索售后订单统计
export const orderBatchAgreeReturnGoods = (params) => postJson(`${url}/order/orderReturn/seller/batchAgreeReturnGoods`, params); // 商家中心接口》批量同意退货
export const orderReturnListExport = (params) => get(`${url}/order/orderReturn/seller/export`, params, { responseType: "blob" }); // 商家接口》售后单导出

// 卖家-运营> 获取售后单详情
export const orderReturnDetail = (params) => get(`${url}/order/orderReturn/mall/returnDetail/${params}`);
export const orderReturnAddWork = (params) => get(`${url}/order/order/return/work/seller/addto/proof`, params); // 卖家中心》举证-追加举证
export const findReturnWorkAllegeList = (params) => get(`${url}/order/order/return/work/info/findReturnWorkAllegeList`, params); // 获取举证详情列表
export const orderReturnGetLogisticsInfo = (params) => get(`${url}/order/orderReturn/buyer/getLogisticsInfo?waybillNumber=${params}`); // 查看物流信息
export const orderReturnAgreeRefund = (params) => postJson(`${url}/order/orderReturn/seller/batchAgreeRefund`, params); // 卖家中心》 仅退款 -> 同意退款
export const orderReturnagreeRefundInReturnGoodsAndRefund = (params) => post(`${url}/order/orderReturn/seller/agreeRefundInReturnGoodsAndRefund`, params); // 商家中心接口》同意退款（退货退款）
export const orderReturnSellerReject = (params) => postJson(`${url}/order/orderReturn/seller/rejected`, params); // 商家中心接口》批量驳回售后
export const orderReturnRejectDelivery = (params) => post(`${url}/order/orderReturn/seller/rejectDelivery`, params); // 商家中心接口》拒收
export const orderReturnConfirmReceipt = (params) => post(`${url}/order/orderReturn/seller/confirmReceipt`, params); // 商家中心接口》确认收货
export const orderReturnAddToProof = (params) => post(`${url}/order/order/return/work/seller/addto/proof`, params); // 卖家中心》举证-追加举证
export const orderReturnWorkSellerList = (params) => get(`${url}/order/order/return/work/seller/list`, params); // 卖家中心》分页查询 工单列表
export const orderReturnWorkSellerCount = (params) => get(`${url}/order/order/return/work/seller/count`, params); // 卖家中心》获取工单数据统计
export const orderReturnWorkMallExport = (params) => get(`${url}/order/order/return/work/mall/export`, params, { responseType: "blob" }); // 卖家中心》导出
export const orderReturnWorkSellerListExport = (params) => get(`${url}/order/order/return/work/seller/export`, params, { responseType: "blob" }); // 卖家中心》导出

// 店铺管理-品牌资质
export const productBrandSellerList = (params) => get(`${url}/product/brand/seller/list`, params); // 商家后台接口》分页查询
export const productBrandSellerSave = (params) => postJson(`${url}/product/brand/seller/save`, params); // 新增商品品牌表
export const productBrandSellerUpdate = (params) => put(`${url}/product/brand/seller/update`, params); // 修改商品品牌表
export const productBrandDelete = (params) => deletefn(`${url}/product/brand/delete/${params}`); // 通过id删除商品品牌表
export const productSellerListStatistical = (params) => get(`${url}/product/brand/seller/list/statistical`, params); // 商家后台接口》品牌各种审核统计
export const productBrandInfo = (params) => get(`${url}/product/brand/info/${params}`); // 通过id查询

// 账户资金
export const financeBillDetailsFindPageSeller = (params) => get(`${url}/finance/seller/billDetails/findPageSeller`, params); // 卖家web->账单明细
export const financeBillDetailsFindCurrentSellerPageSettle = (params) => get(`${url}/finance/seller/billDetails/findCurrentSellerPageSettle`, params); // 卖家web->对账中心
export const financefindCurrentShopSecurityAmountRecords = (params) => get(`${url}/finance/seller/shopSecurityAmountRecode/findCurrentShopSecurityAmountRecords`, params); // 卖家web->保证金记录列表查询
export const financefindfindCurrentSellerAccountWithdraws = (params) => get(`${url}/finance/seller/withdrawLog/findCurrentSellerAccountWithdraws`, params); // 卖家web->资金管理
export const financeWithdrawLogCancel = (params) => get(`${url}/finance/seller/withdrawLog/cancel`, params); // 卖家web->取消提现
export const financeFindWithdrawDeatil = (params) => get(`${url}/finance/seller/withdrawLog/findWithdrawDeatil`, params); // 卖家web->查询提现详细信息
export const financeApplyWithdraw = (params) => post(`${url}/finance/seller/withdrawLog/applyWithdraw`, params); // 卖家web->申请提现
export const adminUmsCheckCodeGetCurrentPhoneCode = (params) => get(`${url}/admin/ums/checkcode/getCurrentPhoneCode`, params); // 通用->获取当前登录人的手机或者邮箱验证码
export const financeSellerExport = (params) => get(`${url}/finance/seller/withdrawLog/mall/export`, params, { responseType: "blob" }); // 运营web->提现管理列表-导出
export const financeBillDetailsExport = (params) => get(`${url}/finance/seller/billDetails/exportSellerBillingDetails`, params, { responseType: "blob" }); // 卖家web->导出账单明细
export const financeSellerBillDetailsExport = (params) => get(`${url}/finance/seller/billDetails/exportSellerBillCheckCenter`, params, { responseType: "blob" }); // 卖家web->导出对账中心

export const financeFindCurrentsOrBySellerId = (params) => get(`${url}/finance/seller/gatheringAccount/findCurrentsOrBySellerId`, params); // web->查询当前-指定卖家所有账户
export const financeGetAuthorizationPage = (params) => get(`${url}/finance/payoneer/getAuthorizationPage`, params); // 获取授权页面
export const financeGetAuthorizationLoginPage = (params) => get(`${url}/finance/payoneer/getAuthorizationLoginPage`, params); // 获取授权登录页面
export const financePayoneerQuery = (params) => postJson(`${url}/finance/payoneer/query`, params); // 获取验证用户信息
export const financeSetDefaultWithdrawAccount = (params) => get(`${url}/finance/seller/gatheringAccount/setDefaultWithdrawAccount`, params); // 卖家web->设置为默认的提现账户
export const financeGatheringAccount = (params) => postJson(`${url}/finance/seller/gatheringAccount`, params); // 卖家web->新增卖家收款账户
export const financeGatheringAccountEdit = (params) => put(`${url}/finance/seller/gatheringAccount`, params); // 卖家web->修改卖家收款账户

// 保证金
export const adminStoreFindCurrent = (params) => get(`${url}/admin/ums/seller/store/findCurrent`, params); // 卖家web->查询当前卖家店铺基本信息
export const basicsRateFindSiteCurrent = (params) => get(`${url}/basics/base/rate/findSiteCurrency`, params); // 通用->查询当前站点货币信息
export const financeRecharge = (params) => post(`${url}/finance/seller/shopSecurityAmountRecode/recharge`, params); // 卖家web->充值
export const financeWithdrawDetail = (params) => post(`${url}/finance/seller/shopSecurityAmountRecode/withdrawDetail`, params); // 卖家web->提现申请详情
export const financeShopSecurityAmountRecode = (params) => post(`${url}/finance/seller/shopSecurityAmountRecode/applyWithdraw`, params); // 卖家web->提现申请

// 商品评论
export const productEvaluateReports = (params) => postJson(`${url}/product/evaluate/reports`, params); // 提交商品评论投诉
export const productEvaluateInfo = (params) => get(`${url}/product/evaluate/info/`, params); // 通过评价id查询评价详情
export const productEvaluateReply = (params) => postJson(`${url}/product/evaluate/reply`, params); // 新增商品评价

// // 消息盒子
// export const sockFindMessageBoxCategoryList = (params) =>
//     get(`${url}/sock/message/seller/findMessageBoxCategoryList`, params); // 卖家-消息盒子消息分类查询
export const orderReturnFindByOrderIdInner = (params) => post(`${url}/order/orderReturn/findByOrderId`, params); // 运营web->查询订单下的所有售后单
export const orderReturnFindNegotiationHistory = (params) => get(`${url}/order/orderReturn/back/findNegotiationHistory/${params}`); // WEB端接口》通过订单ID获取所有售后的历史
export const basicsFbtGetLimitMapInner = (params) => get(`${url}/basics/base/fbt/sendGoods/getLimitMap`); // 内部调用->获取fbt发补货限制
export const orderReturnWorkInfoDetail = (params) => get(`${url}/order/order/return/work/info/workDetail`, params); // 运营-卖家->售后工单详情
export const adminSellerCheckAccount = (params) => post(`${url}/admin/ums/seller/checkAccount`, params); // 卖家web->校验登陆(主)账号
export const basicsRateFindAll = (params) => get(`${url}/basics/base/rate/findAll`); // 通用->查询所有启用的货币汇率
export const basicsRateCurrentExchange = (params) => get(`${url}/basics/base/rate/currencyExchange`, params); // 通用->运营web->货币兑换

// 修复商品
export const goodsRepairFindTsin = (params) => get(`${url}/product/goods/repair/find/tsin`, params); // 通过tsin查psu商品信息
export const goodsRepairSubmit = (params) => postJson(`${url}/product/goods/repair/submit`, params); // 提交修复商品
export const goodsRepairFindPage = (params) => get(`${url}/product/goods/repair/find/page`, params); // 修改记录列表查询
export const goodsRepairFindBy = (params) => get(`${url}/product/goods/repair/find/by`, params); // 查看修复商品详情
