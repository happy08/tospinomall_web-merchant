import qs from "qs";
import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
const url = config.DOMAIN_BASE + config.DOMAIN_API + "/admin";
const urls = config.DOMAIN_BASE + config.DOMAIN_API;
const urlsLogin = config.DOMAIN_LOGIN;

export const getCurrentRate = () => get(`${urls}/basics/base/rate/findSiteCurrency`); //获取当前站点货币信息

export const getPlatformInfo = () => get(`${urls}/basics/base/mall/mallPlatformSet/find`); // 获取当前平台信息

export const getLocales = () => get(`${urls}/basics/dict/locale`); // 获取语言

export const getMenuList = (params) => get(`${urls}/admin/ums/seller/menu/findCurrentUserMenus`, params); //查询有权限的菜单列表

export const basePhonePrefix = (status) => get(`${urls}/basics/base/phonePrefix/find/${status}`); //获取手机号前缀 0：可用，1：不可用

export const adminWbsite = () => get(`${urlsLogin}/admin/website/findWebsite`); //通用->查询全部站点信息

export const adminWebsiteKey = (key) => get(`${urlsLogin}/admin/website/key/${key}`); // 当前站点各端网站域名

export const adminWbsiteopenSeller = (params) => get(`${urlsLogin}/admin/website/relation/seller/open/website`, params); // 查询卖家已开通站点信息

export const adminWbsiteSellerManage = (params) => get(`${urlsLogin}/admin/website/relation/seller/manage`, params); // 查询所有站点信息和卖家已开通站点信息

export const adminFindByIdNotLogin = (params) => get(`${urlsLogin}/admin/ums/seller/findByIdNotLogin`, params); // 通用->通过ID查询用户信息

//Token登录
export const getToken = (params) =>
    // /admin/ums/seller/login
    post(`${urls}/admin/ums/seller/login`, params, {
        headers: {
            Authorization: "Basic c2VsbGVyOnNlbGxlcg=="
        }
    });

// 短信 邮箱登录
export const smsLogin = (param) => {
    const params = qs.stringify(param);
    return post(`${urlsLogin}/auth/mobile/token/sms?${params}`, params, {
        headers: {
            Authorization: "Basic c2VsbGVyOnNlbGxlcg=="
        }
    });
};

export const signOut = (params) => deletefn(`${urlsLogin}/auth/token/logout`); //退出
// deletefn(`${urlLogin}/auth/token/logout`, params, {
//     headers: {
//         "Content-Type": "application/json"
//     }
// }); //退出

export const getUserInfo = (params) => postJson(`${url}/user/getUserInfo`, params); //获取用户信息

export const getPhoneCode = (params) =>
    get(`${url}/ums/checkcode/getPhoneCode`, params, {
        headers: {
            Authorization: "Basic dGVzdDp0ZXN0"
        }
    }); // 校验获取手机验证码

export const getEmailCode = (params) =>
    get(`${url}/ums/checkcode/getEmailCode`, params, {
        headers: {
            Authorization: "Basic dGVzdDp0ZXN0"
        }
    });

export const checkPhone = (params) =>
    post(`${url}/ums/checkcode/checkPhone`, params, {
        headers: {
            Authorization: "Basic dGVzdDp0ZXN0"
        }
    }); // 检测手机号是否注册

export const register = (params) => postJson(`${url}/ums/seller/register`, params); // 卖家注册

export const forgetPassword = (params) => post(`${url}/ums/seller/forgetPassword`, params); // 找回密码

export const adminUmsCheckPhone = (params) => post(`${url}/ums/checkcode/checkPhone`, params); // 通用->校验用户手机号码

export const adminUmsSellerUpdateStore = (params) => postJson(`${urls}/admin/ums/seller/store/updateStore`, params); //卖家web->修改卖家店铺基本信息
export const adminUmsSellerupdateAuditSubmit = (params) => postJson(`${urls}/admin/ums/seller/store/updateAuditSubmit`, params); //卖家web->店铺变更审核提交保存
export const adminUmsSellerFindLastUpdateAudit = (params) => get(`${urls}/admin/ums/seller/store/findLastUpdateAudit?storeId=${params}`); //web->查看最新提交审核记录
export const adminUmsSellerFindStoreAndCompanyById = (params) => get(`${urls}/admin/ums/seller/store/findStoreAndCompanyById`, params); //运营web->通过ID查询店铺和企业信息

// 消息
export const sockFindMessageBoxCategoryList = (params) => get(`${urls}/sock/message/seller/findMessageBoxCategoryList`, params); // 卖家-消息盒子消息分类查询
export const sockFindMsgPage = (params) => get(`${urls}/sock/message/seller/findMsgPage`, params); // 卖家-消息列表查询
export const sockMarkedAsRead = (params) => post(`${urls}/sock/message/seller/markedAsRead`, params); // 卖家-单个-批量消息标为已读
export const basicsFindRuleList = (params) => get(`${urls}/basics/toolCategory/seller/findRuleList`, params); // 卖家-规则中心分类查询
export const basicsFindMmsSellerRulesHelpPage = (params) => get(`${urls}/basics/sellerRulesHelp/findMmsSellerRulesHelpPage`, params); // 卖家端-查看帮助中心/规则中心/视频教程列表分页查询
export const basicsFindVideoList = (params) => get(`${urls}/basics/toolCategory/seller/findVideoList`, params); // 卖家-视频分类查询
export const basicsFindHelpList = (params) => get(`${urls}/basics/toolCategory/seller/findHelpList`, params); // 卖家-帮助中心分类查询
export const sockMessageFindMsgCategoryList = (params) => get(`${urls}/sock/message/seller/findMsgCategoryList`, params); // 卖家-站内信消息分类查询
export const sockMessageFindMsgPage = (params) => get(`${urls}/sock/message/seller/findMsgPage`, params); // 卖家-消息列表查询
export const sockMessageFindById = (params) => get(`${urls}/sock/messagePush/seller/findById/${params}`); // 通过id查询
export const basicsOperateFeedbackMsgSellerSave = (params) => postJson(`${urls}/basics/operateFeedbackMsg/seller/save`, params); // 卖家反馈消息

// 修改密码相关
export const adminGetCurrentPhoneCode = (params) => get(`${urls}/admin/ums/checkcode/getCurrentPhoneCode`, params); // 通用->获取当前登录人的手机或者邮箱验证码
export const adminCheckCurrentPhoneOrEmail = (params) => post(`${urls}/admin/ums/checkcode/checkCurrentPhoneOrEmail`, params); // 通用->校验当前登录用户手机号码或者邮箱
export const adminCheckEmailCode = (params) => post(`${urls}/admin/ums/checkcode/checkEmailCode`, params); // 通用->校验邮箱验证码
export const adminSellerUpdatePhone = (params) => get(`${urls}/admin/ums/seller/updatePhone`, params); // 卖家web->修改卖家手机号码

export const adminSellerFindCurrentInfo = (params) => get(`${urls}/admin/ums/seller/findCurrentInfo`, params); // 卖家web->查询当前登录卖家信息
export const adminCheckGetEmailCode = (params) => get(`${urls}/admin/ums/checkcode/getEmailCode`, params); // 通用->获取邮箱验证码
export const adminSellerUpdateEmail = (params) => get(`${urls}/admin/ums/seller/updateEmail`, params); // 卖家web->修改卖家邮箱
export const adminSellerUpdatePassword = (params) => post(`${urls}/admin/ums/seller/updatePassword`, params); // web->修改密码
export const adminUmsSellerStoreFindCurrent = (params) => get(`${urls}/admin/ums/seller/store/findCurrent`, params); // 卖家web->查询当前卖家店铺基本信息

export const basicsOperateSinglePageFindByQuery = (params) => get(`${urls}/basics/operateSinglePage/findByQuery`, params); // 查询协议信息 type: 类型 1:隐私政策 2:服务协议 3:版权信息 4:入住协议 5:提现协议

export const ossUpLoadUrl = `${urls}/admin/ums/seller/create/object/product-pic-bucket/product_pic`;
