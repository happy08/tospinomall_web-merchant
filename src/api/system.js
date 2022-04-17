import { get, post, postJson, put, deletefn, config } from "@/utils/axios.js";
import { encrypt } from "@/utils/cryptoAES"; // 加密
const url = config.DOMAIN_BASE + config.DOMAIN_API;
const urlsLogin = config.DOMAIN_LOGIN;

//系统用户
export const userFindById = (params) => get(`${url}/admin/ums/seller/findById`, params); //通过ID查询子账号信息
export const userFindByConditions = (params) => get(`${url}/admin/ums/seller/findByConditions`, params); //通过状态分页查询用户
export const userFindCurrentOrByIdSub = (params) => post(`${url}/admin/ums/seller/findCurrentOrByIdSub`, params); //查询当前登录用户/指定卖家用户下的子账号

export const userSave = (params) =>
    postJson(`${url}/admin/ums/seller/save`, {
        ...params,
        password: encrypt(params.password),
        repeatPassword: encrypt(params.repeatPassword)
    }); //新增子账号
export const userUpdate = (params) =>
    postJson(`${url}/admin/ums/seller/update`, {
        ...params,
        password: params.password !== "" ? encrypt(params.password) : "",
        repeatPassword: params.password !== "" ? encrypt(params.repeatPassword) : ""
    }); //修改子账号

//角色
export const roleFind = (params) => get(`${url}/admin/ums/seller/role/findByStatus`, params); //查询所有角色
export const roleSave = (params) => postJson(`${url}/admin/ums/seller/role/save`, params); //新增角色
export const roleUpdate = (params) => postJson(`${url}/admin/ums/seller/role/update`, params); //修改角色
export const roleDelete = (params) => post(`${url}/admin/ums/seller/role/delete`, params); //删除角色

//菜单
export const menuFindByStatus = (params) => get(`${url}/admin/ums/seller/menu/findByStatus`, params); //通过状态查询菜单
export const menuSave = (params) => post(`${url}/admin/ums/seller/menu/save`, params); //新增菜单
export const menuUpdate = (params) => post(`${url}/admin/ums/seller/menu/update`, params); //修改菜单
export const menuDelete = (params) => post(`${url}/admin/ums/seller/menu/delete`, params); //删除菜单

export const adminSellerBatchClose = (params) => postJson(`${url}/admin/ums/seller/batch/close`, params); //禁用
export const adminSellerBatchOpen = (params) => postJson(`${url}/admin/ums/seller/batch/open`, params); //启用

export const getAllSiteInfo = (params) => get(`${urlsLogin}/admin/website/findWebsite`, params); // 通用=>查询全部站点信息

export const adminWesiteSellerSon = (params) => get(`${urlsLogin}/admin/website/relation/seller/son/page`, params); // 卖家子账号用户池分页查询
export const adminWesiteSellerSave = (params) => post(`${urlsLogin}/admin/website/relation/seller/save`, params); // 提交卖家与站点关联信息
export const adminWesiteAuth = (params) => get(`${url}/admin/ums/seller/son/account/auth`, params); // 卖家web->子账号站点授权
