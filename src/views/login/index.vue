<template>
    <div class="body-bg">
        <!-- 登录界面主体部分 -->

        <!-- 左侧背景图 -->
        <div class="login-left">
            <!-- 背景图上的文字 -->
            <div class="login-title w-100 tc white">
                <div class="fs-22 mb-10">{{ $t("login.tip1") }}</div>
                <div>{{ $t("login.tip2") }}</div>
            </div>
        </div>
        <!-- 右侧登录框 -->
        <div class="login-right">
            <HeaderLogin />

            <div class="wrap-content">
                <div class="p-20 fw tc" style="font-size:32px">
                    <!-- 登录 邮箱登录 短信登录-->
                    <span v-if="state.title == 'account'">{{ $t("login.userLogIn") }}</span>
                    <span v-if="state.title == 'email'">{{ $t("login.emailLogin") }}</span>
                    <span v-if="state.title == 'SMS'">{{ $t("login.msgLogin") }}</span>
                </div>

                <!-- 账号登录 -->
                <div v-if="state.title == 'account'">
                    <el-form class="big-input" :model="loginForm" :rules="loginRules" ref="loginFormRef">
                        <!-- <el-form-item prop="username">
                            <template #label>
                                <span class="fs-16">账户</span>
                            </template>
                            <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="手机号/邮箱/用户名(主账号&子账户)">
                                <template #prefix>
                                    <i class="el-input__icon el-icon-user"></i>
                                </template>
                            </el-input>
                        </el-form-item> -->

                        <!-- 账户 -->
                        <el-form-item prop="username">
                            <template #label>
                                <span class="fs-16">{{ $t("login.account") }}</span>
                            </template>
                            <el-input type="text" v-model="loginForm.username" @change="accountChange" oninput="value=value.replace(/\s+/g,'')" auto-complete="off" :placeholder="$t('login.tip3')">
                                <template #prepend v-if="accountPrefix">
                                    <el-select v-model="loginForm.phonePrefix" filterable style="width: 100px;">
                                        <el-option v-for="(item, i) in phonePrefixList" :key="i" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                                    </el-select>
                                </template>
                            </el-input>
                        </el-form-item>

                        <!-- 密码 -->
                        <el-form-item prop="password">
                            <template #label>
                                <span class="fs-16">{{ $t("login.loginPass") }}</span>
                            </template>
                            <el-input show-password v-model="loginForm.password" oninput="value=value.replace(/\s+/g,'')" :placeholder="$t('login.pleaseEnterPass')" @keyup.enter.native="submitForm">
                                <template #prefix>
                                    <i class="el-input__icon el-icon-lock"></i>
                                </template>
                            </el-input>
                        </el-form-item>
                        <!-- 选择站点 -->
                        <el-form-item>
                            <el-select v-model="site" class="w-100" @change="siteChange">
                                <el-option v-for="(item, i) in siteList" :key="i" :label="item.name" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                        <div class="flex hend pb-15 plr-15">
                            <!-- 忘记密码? -->
                            <div class="green cp" @click="resetPass">{{ $t("login.forgetPassword") }}</div>
                        </div>
                        <el-form-item>
                            <!-- 登录 -->
                            <el-button @click="submitForm" :disabled="loginDisabled" :loading="loginDisabled" type="primary" class="w-100 p-20">
                                <span class="fs-14">{{ $t("login.userLogIn") }}</span>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 短信登录 -->
                <div v-if="state.title == 'SMS'">
                    <el-form class="big-input" :model="phoneLoginForm" :rules="phoneLoginRules" ref="phoneLoginFormRef">
                        <el-form-item prop="phoneNumber">
                            <template #label>
                                <span class="fs-16">{{ $t("login.phone") }}</span>
                            </template>
                            <el-input :placeholder="$t('login.phone')" v-model="phoneLoginForm.phoneNumber" oninput="value=value.replace(/\s+/g,'')">
                                <template #prepend>
                                    <el-select v-model="phoneLoginForm.phonePrefix" filterable style="width: 100px;">
                                        <el-option v-for="(item, i) in phonePrefixList" :key="i" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                                    </el-select>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="phoneCode">
                            <template #label>
                                <span class="fs-16">{{ $t("login.code") }}</span>
                            </template>
                            <el-input :placeholder="$t('login.pleaseCode')" v-model="phoneLoginForm.phoneCode" @keyup.enter.native="submitPhoneForm">
                                <template #append>
                                    <el-button type="info" @click="getMessage">{{ isCountdown ? count.count + "s" : $t("login.getCode") }}</el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <!-- 站点选择 -->
                        <el-form-item>
                            <el-select v-model="site" class="w-100" @change="siteChange">
                                <el-option v-for="(item, i) in siteList" :key="i" :label="item.name" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                        <div class="flex hend pb-15 plr-15">
                            <div class="green cp" @click="resetPass">{{ $t("login.forgetPassword") }}</div>
                        </div>
                        <el-form-item>
                            <el-button @click="submitPhoneForm" :disabled="loginDisabled" :loading="loginDisabled" type="primary" class="w-100 p-20"
                                ><span class="fs-14">{{ $t("login.userLogIn") }}</span></el-button
                            >
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 邮箱登录 -->
                <div v-if="state.title == 'email'">
                    <el-form class="big-input" :model="emaillForm" :rules="emailRules" ref="emailFormRef">
                        <el-form-item prop="emaillAddress">
                            <template #label>
                                <span class="fs-16">{{ $t("login.email") }}</span>
                            </template>
                            <el-input :placeholder="$t('login.email')" v-model="emaillForm.emaillAddress" key="emaillAddress" oninput="value=value.replace(/\s+/g,'')"> </el-input>
                        </el-form-item>
                        <el-form-item prop="emaillCode">
                            <template #label>
                                <span class="fs-16">{{ $t("login.code") }}</span>
                            </template>
                            <el-input :placeholder="$t('login.pleaseCode')" v-model="emaillForm.emaillCode" @keyup.enter.native="submitEmailForm" key="emaillCode">
                                <template #append>
                                    <el-button type="info" @click="getEmailMessage">{{ isCountdown ? count.count + "s" : $t("login.getCode") }}</el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="site" class="w-100">
                                <el-option v-for="(item, i) in siteList" :key="i" :label="item.name" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                        <div class="flex hend pb-15 plr-15">
                            <div class="green cp" @click="resetPass">{{ $t("login.forgetPassword") }}</div>
                        </div>
                        <el-form-item>
                            <el-button @click="submitEmailForm" :disabled="loginDisabled" :loading="loginDisabled" type="primary" class="w-100 p-20"
                                ><span class="fs-14">{{ $t("login.userLogIn") }}</span></el-button
                            >
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 还没有账户? -->
                <div class="mb-30 tc">
                    <span class="fs-12">{{ $t("login.NoAccount") }}</span>
                    <span class="green cp ml-5" @click="register">{{ $t("login.MoveNow") }} </span>
                </div>

                <!-- 登录即代表您同意 -->
                <div class="mb-30 pb-10">
                    <span>{{ $t("login.LoginAgree") }}</span>
                    <a href="#/message/agreement?type=1" target="_blank" class="ml-5 blue">《{{ $t("login.PrivacyPolicy") }}》</a>
                    <span class="ml-5">{{ $t("login.with") }}</span>
                    <a href="#/message/agreement?type=29" target="_blank" class="ml-5 blue">《{{ $t("login.UserAgreement") }}》</a>
                </div>

                <div class="flex center">
                    <span @click="state.title = 'email'" class="cp"><img :src="require('@/assets/img/email.png')" style="width:40px;height:40px"/></span>
                    <span @click="state.title = 'SMS'" class="plr-25 cp"><img :src="require('@/assets/img/phone.png')" style="width:40px;height:40px"/></span>
                    <span @click="state.title = 'account'" class="cp"><img :src="require('@/assets/img/user.png')" style="width:40px;height:40px"/></span>
                </div>
            </div>
        </div>
    </div>
    <BmDialog v-model:visible="visible" :confirm="confirm" :cancel="cancel" :width="600">
        <div>
            <div class="mb-30 flex vcenter">
                <svg class="icon" aria-hidden="true" style="width: 40px;height: 40px;">
                    <use xlink:href="#iconicon-test"></use>
                </svg>
                <!-- xxxx账户尚未开通越南站,点击"申请开通"入驻越南站 ? -->
                <span class="ml-15 fs-18 fw">{{ siteMsg }}</span>
            </div>
            <div>
                <div class="mb-20 fs-14">{{ $t("login.siteTips") }}</div>
                <div>
                    <el-radio v-for="(item, i) in openSite" v-model="openwebsiteAddress" :key="i" :label="item.websiteAddress">{{ item.name }}</el-radio>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex center">
                <!-- 申请开通新站点 进入已开通站点-->
                <el-button @click="goApplySite">{{ $t("login.applyOpenSite") }}</el-button>
                <el-button type="primary" @click="goOpenSite">{{ $t("login.enteropensite") }}</el-button>
            </div>
        </template>
    </BmDialog>
</template>

<script>
import { ref, reactive, unref, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { encrypt } from "@/utils/cryptoAES";
import { getPhoneCode, getEmailCode, basePhonePrefix, adminWbsite, adminWbsiteopenSeller } from "@/api/user";
import HeaderLogin from "@/components/headerLogin";
import storage from "@/utils/storage";

export default {
    name: "Login",
    components: { HeaderLogin },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const router = useRouter();

        const state = reactive({
            title: "account"
        });

        // 已开通站点
        let openSite = ref([]);

        let visible = ref(false);

        let AppalywebsiteAddress = ref(); // 需要开通的站点
        let openwebsiteAddress = ref(""); // 已经开通的站点
        let siteMsg = ref();
        let userId = "";

        // 获得站点
        let siteList = ref();
        let site = ref("");
        const getSite = () => {
            adminWbsite()
                .then((res) => {
                    res.data.forEach((v) => {
                        v.websiteDetails.forEach((item) => {
                            if (item.type == 2) {
                                v.websiteAddress = item.websiteAddress;
                            }
                        });
                    });
                    siteList.value = res.data;
                    site.value = store.state.app.site || "";
                })
                .catch(() => {});
        };
        getSite();

        const validateUsername = (rule, value, callback) => {
            if (value.length < 5) {
                callback(new Error(proxy.$t("login.userNameMin5")));
            } else {
                callback();
            }
        };

        const validatePass = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error(proxy.$t("login.passLength6")));
            } else {
                callback();
            }
        };

        const validataPhone = (rule, value, callback) => {
            //var reg = /^1[3456789][0-9]{9}$/;
            if (value.length < 6) {
                callback(new Error(proxy.$t("login.phoneFormatNo")));
            } else {
                callback();
            }
        };

        const validatepPhoneCode = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error(proxy.$t("login.codeLength6")));
            } else {
                callback();
            }
        };

        const validataEmail = (rule, value, callback) => {
            var reg = /^1[3456789][0-9]{9}$/;
            if (value.length < 6) {
                callback(new Error(proxy.$t("login.emailFormatNo")));
            } else {
                callback();
            }
        };

        const validataEmailCode = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error(proxy.$t("login.codeLength6")));
            } else {
                callback();
            }
        };

        // 登录表单
        const loginForm = reactive({
            username: "",
            password: "",
            phonePrefix: "+233"
        });

        let accountPrefix = ref(false);
        // watch(
        //     () => loginForm.username,
        //     (nVal) => {
        //         var reg = /^[0-9]*$/;
        //         if (reg.test(nVal)) {
        //             accountPrefix.value = true;
        //         } else {
        //             accountPrefix.value = false;
        //         }
        //     },
        //     {
        //         immediate: true
        //     }
        // );

        // 短信表单
        const phoneLoginForm = reactive({
            phoneNumber: "",
            phoneCode: "",
            phonePrefix: proxy.$store.state.app.phonePrefix
        });

        // 邮箱表单
        const emaillForm = reactive({
            emaillAddress: "",
            emaillCode: ""
        });

        //校验规则
        const loginRules = {
            username: [
                {
                    required: true,
                    trigger: "blur",
                    validator: validateUsername
                }
            ],
            password: [{ required: true, trigger: "blur", validator: validatePass }]
        };

        // 短信校验
        const phoneLoginRules = {
            phoneNumber: [
                {
                    require: true,
                    trigger: "blur",
                    validator: validataPhone
                }
            ],
            phoneCode: [
                {
                    require: true,
                    trigger: "blur",
                    validator: validatepPhoneCode
                }
            ]
        };

        // 邮箱校验
        const emailRules = {
            emaillAddress: [
                {
                    require: true,
                    trigger: "blur",
                    validator: validataEmail
                }
            ],
            emaillCode: [
                {
                    require: true,
                    trigger: "blur",
                    validator: validataEmailCode
                }
            ]
        };

        let timer = null;
        let count = reactive({ count: 60 });
        const isCountdown = ref(false);

        // 获得短信验证码
        const getMessage = () => {
            if (isCountdown.value) {
                return;
            }

            // var reg = /^1[3456789][0-9]{9}$/;
            // if (!reg.test(phoneLoginForm.phoneNumber)) {
            //     proxy.$message.error('您的手机号格式不对');
            //     return
            // };

            if (phoneLoginForm.phoneNumber.length < 6) {
                proxy.$message.error(proxy.$t("login.yourPhoneFormatNo"));
                return;
            }

            let reg = /^1([0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{9}$/;
            let phone = phoneLoginForm.phoneNumber;
            if (reg.test(phone) && phoneLoginForm.phonePrefix != "+86" && phone.length == 11) {
                proxy.$message.error(proxy.$t("login.pleaseSelectArea")); //请先选择手机区号!!!
                return;
            }

            isCountdown.value = true;

            timer = setInterval(() => {
                console.log(count.count);
                count.count--;
                if (count.count > 0) {
                    count.count = count.count--;
                } else {
                    clearInterval(timer);
                    (count.count = 60), (isCountdown.value = false);
                }
            }, 1000);

            let data = {
                phone: phoneLoginForm.phoneNumber,
                phonePrefix: phoneLoginForm.phonePrefix,
                userType: "seller",
                type: "2"
            };

            // 发送请求
            getPhoneCode(data)
                .then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        proxy.$message.success(proxy.$t("login.codeSuccess"));
                        phoneLoginForm.phoneCode = res.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        // 获得邮箱验证码
        const getEmailMessage = () => {
            if (isCountdown.value) {
                return;
            }

            // let reg = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;
            // if (!reg.test(emaillForm.emaillAddress)) {
            //      proxy.$message.error('您的邮箱格式不对');
            //     return
            // };

            if (emaillForm.emaillAddress.length < 6) {
                proxy.$message.error(proxy.$t("login.emailFormatNo"));
                return;
            }

            isCountdown.value = true;

            timer = setInterval(() => {
                console.log(count.count);
                count.count--;
                if (count.count > 0) {
                    count.count = count.count--;
                } else {
                    clearInterval(timer);
                    (count.count = 60), (isCountdown.value = false);
                }
            }, 1000);

            // 发送请求
            let data = { email: emaillForm.emaillAddress, userType: "seller", type: "3" };
            // 发送请求
            getEmailCode(data)
                .then((res) => {
                    console.log(res);
                    emaillForm.emaillCode = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        // 查询卖家已开通站点
        const getOpenSite = (id) => {
            return new Promise((resolve, reject) => {
                adminWbsiteopenSeller({ sellerUserId: id })
                    .then((res) => {
                        res.data.forEach((v) => {
                            v.websiteDetails.forEach((item) => {
                                if (item.type == 2) {
                                    v.websiteAddress = item.websiteAddress;
                                }
                            });
                        });
                        resolve(res.data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };

        // 登录表单提交
        const loginFormRef = ref(null);
        const loginDisabled = ref(false);
        const submitForm = () => {
            const form = unref(loginFormRef);
            if (!form) return;
            let { username, password, phonePrefix } = loginForm;
            let data = {
                username: username.replace(/\s+/g, ""),
                password: encrypt(password.replace(/\s+/g, "")),
                grant_type: "password",
                site: site.value
            };

            if (accountPrefix.value) {
                data.username = phonePrefix + data.username;
            }

            let reg = /^1([0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{9}$/;
            if (reg.test(username) == true && phonePrefix != "+86" && username.length == 11) {
                proxy.$message.error(proxy.$t("login.pleaseSelectArea")); //请先选择手机区号!!!
                return;
            }

            form.validate((valid) => {
                if (valid) {
                    loginDisabled.value = true;
                    store
                        .dispatch("user/getToken", data)
                        .then((res) => {
                            loginDisabled.value = false;
                            siteList.value.forEach((item) => {
                                if (item.key == site.value) {
                                    AppalywebsiteAddress.value = item.websiteAddress;
                                    storage.set("siteAddress", item.websiteAddress);
                                    storage.set("siteName", item.name);
                                    storage.set("site", site.value);
                                }
                            });
                            //登录成功，跳转到第一个权限路由
                            router.push(store.getters["router/getFirstRouter"]);
                        })
                        .catch(async (err) => {
                            // 11002 未开通此站点,打开弹窗
                            if (err.data && err.data.code == 11002) {
                                siteMsg.value = err.data.msg;
                                userId = err.data.data;
                                // 查询卖家已开通站点
                                openSite.value = await getOpenSite(err.data.data);

                                visible.value = true;
                            }
                            loginDisabled.value = false;
                        });
                } else {
                    return false;
                }
            });
        };

        // 短信登录表单提交
        const phoneLoginFormRef = ref(null);
        const submitPhoneForm = () => {
            const form = unref(phoneLoginFormRef);
            if (!form) return;
            let { phoneNumber, phonePrefix, phoneCode } = phoneLoginForm;
            let data = {
                grant_type: "mobile",
                mobile: phonePrefix + phoneNumber,
                code: phoneCode,
                site: site.value
            };

            form.validate((valid) => {
                if (valid) {
                    loginDisabled.value = true;
                    store
                        .dispatch("user/smsLogin", data)
                        .then((res) => {
                            loginDisabled.value = false;
                            siteList.value.forEach((item) => {
                                if (item.key == site.value) {
                                    AppalywebsiteAddress.value = item.websiteAddress;
                                    storage.set("siteAddress", item.websiteAddress);
                                    storage.set("siteName", item.name);
                                    storage.set("site", site.value);
                                }
                            });
                            //登录成功，跳转到第一个权限路由
                            router.push(store.getters["router/getFirstRouter"]);
                        })
                        .catch(async (err) => {
                            // 11002 未开通此站点,打开弹窗
                            if (err.data && err.data.code == 11002) {
                                siteMsg.value = err.data.msg;
                                userId = err.data.data;
                                // 查询卖家已开通站点
                                openSite.value = await getOpenSite(err.data.data);

                                visible.value = true;
                            }
                            loginDisabled.value = false;
                            clearInterval(timer);
                            count.count = 60;
                            isCountdown.value = false;
                        });
                } else {
                    proxy.$message.error("error submit!!"); //登录失败提示错误
                    return false;
                }
            });
        };

        // 邮箱表单提交
        const emailFormRef = ref(null);
        const submitEmailForm = () => {
            const form = unref(emailFormRef);
            if (!form) return;
            let { emaillAddress, emaillCode } = emaillForm;
            let data = {
                grant_type: "mobile",
                mobile: emaillAddress,
                code: emaillCode,
                site: site.value
            };
            form.validate((valid) => {
                if (valid) {
                    loginDisabled.value = true;
                    store
                        .dispatch("user/smsLogin", data)
                        .then((data) => {
                            siteList.value.forEach((item) => {
                                if (item.key == site.value) {
                                    AppalywebsiteAddress.value = item.websiteAddress;
                                    storage.set("siteAddress", item.websiteAddress);
                                    storage.set("siteName", item.name);
                                    storage.set("site", site.value);
                                }
                            });
                            loginDisabled.value = false;
                            //登录成功，跳转到第一个权限路由
                            router.push(store.getters["router/getFirstRouter"]);
                        })
                        .catch(async (err) => {
                            // 11002 未开通此站点,打开弹窗
                            if (err.data && err.data.code == 11002) {
                                siteMsg.value = err.data.msg;
                                userId = err.data.data;
                                // 查询卖家已开通站点
                                openSite.value = await getOpenSite(err.data.data);

                                visible.value = true;
                            }
                            loginDisabled.value = false;
                            clearInterval(timer);
                            count.count = 60;
                            isCountdown.value = false;
                        });
                } else {
                    return false;
                }
            });
        };

        const resetPass = () => {
            router.push("/forgotPassword");
        };

        const register = () => {
            router.push("/register");
        };

        const accountChange = (v) => {
            console.log(v);
            var reg = /^[0-9]*$/;
            if (reg.test(v) && v !== "") {
                accountPrefix.value = true;
            } else {
                accountPrefix.value = false;
            }
        };

        let phonePrefixList = ref([]);
        const getPhonePrifix = () => {
            basePhonePrefix(0)
                .then((res) => {
                    phonePrefixList.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getPhonePrifix();

        const confirm = () => {
            visible.value = false;
        };

        const cancel = () => {
            visible.value = false;
        };

        const siteChange = (v) => {
            // 申请开通的站点链接 或者 当前 登录站点
            siteList.value.forEach((item) => {
                if (item.key == v) {
                    AppalywebsiteAddress.value = item.websiteAddress;
                    storage.set("siteAddress", item.websiteAddress);
                    storage.set("siteName", item.name);
                    storage.set("site", site.value);
                }
            });
        };

        // 申请开通新站点
        const goApplySite = () => {
            let res = AppalywebsiteAddress.value + "#/register/detail" + `?id=${userId}`;
            window.open(res);
            visible.value = false;
        };

        // 进入已开通站点
        const goOpenSite = () => {
            if (openwebsiteAddress.value.length <= 0) {
                proxy.$message.error(proxy.$t("login.selectedSite"));
                return;
            }
            window.open(openwebsiteAddress.value);
            visible.value = false;
        };

        return {
            loginForm,
            loginRules,
            loginFormRef,
            loginDisabled,
            submitForm,
            state,
            phoneLoginForm,
            emaillForm,
            emailFormRef,
            emailRules,
            submitEmailForm,
            phoneLoginForm,
            phoneLoginFormRef,
            phoneLoginRules,
            submitPhoneForm,
            getEmailMessage,
            getMessage,
            isCountdown,
            count,
            resetPass,
            register,
            accountChange,
            accountPrefix,
            phonePrefixList,
            siteList,
            site,
            confirm,
            cancel,
            visible,
            goOpenSite,
            goApplySite,
            siteChange,
            openSite,
            openwebsiteAddress,
            AppalywebsiteAddress,
            siteMsg
        };
    }
};
</script>
<style lang="scss" scoped>
.body-bg {
    width: 100vw;
    min-height: 100vh;
}
.login-left {
    position: relative;
    float: left;
    max-width: 668px;
    width: 30%;
    height: 100vh;
    background: url("../../assets/img/login-bg.jpg");
    background-size: cover;
    .login-title {
        position: absolute;
        z-index: 1;
        top: 32%;
        letter-spacing: 2px;
    }
}
.login-right {
    overflow: hidden;
    margin-left: 30%;
}

.wrap-content {
    width: 480px;
    margin: 10vh auto 20px auto;
}
@media screen and (max-width: 1080px) {
    .login-left {
        display: none;
    }
    .login-right {
        margin-left: 0;
    }
}
</style>
