<template>
    <div class="content-wrap  mb-25 p-25 bg-white round-4 mb-25">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="custom-tabs-green">
            <!-- 基本信息 -->
            <el-tab-pane :label="$t('account.baseInfo')" name="1">
                <div>
                    <BmBaseTitle :title="$t('account.baseInfo')"> </BmBaseTitle>
                </div>
                <el-form :model="baseInfoForm" label-width="150px" class=" mb-30" label-position="left">
                    <!-- 账户名称: -->
                    <el-form-item :label="$t('account.accountName')" prop="">
                        <div>{{ baseInfoForm.account }}</div>
                    </el-form-item>
                    <!-- 登录密码: -->
                    <el-form-item :label="$t('account.loginPassword')" prop="">
                        <div>
                            <span v-if="baseInfoForm.password" class="mr-20">{{ baseInfoForm.password }}</span>
                            <span v-else>********</span>
                            <span class="green cp ml-15" @click="editPane(2)">{{ $t("account.edit") }}</span>
                        </div>
                    </el-form-item>
                    <!-- 绑定手机号码: -->
                    <el-form-item :label="$t('account.BindPhoneNumber')" prop="">
                        <div>
                            <span class="mr-20">{{ baseInfoForm.phonePrefix }} {{ baseInfoForm.phone }}</span>
                            <span class="green cp" @click="editPane(3)">{{ $t("account.edit") }}</span>
                        </div>
                    </el-form-item>
                    <!-- 登录手机号码验证: -->
                    <el-form-item :label="$t('account.LoginPhoneNumVerification')" prop="">{{ $t("account.open") }}</el-form-item>
                </el-form>
            </el-tab-pane>
            <!-- 登录密码 -->
            <el-tab-pane :label="$t('account.loginpass')" name="2">
                <div>
                    <BmBaseTitle :title="$t('account.loginpass')"> </BmBaseTitle>
                </div>

                <el-form :model="passwdForm" ref="passwdFormRef" :rules="passwdFormRules" label-width="100px" class=" mb-30" label-position="left">
                    <!-- 当前密码 -->
                    <el-form-item :label="$t('account.currentPassword')" prop="password">
                        <el-input style="width: 480px;" v-model="passwdForm.password" placeholder="" maxlength="20" type="password" show-word-limit show-password></el-input>
                    </el-form-item>

                    <!-- 设置密码 -->
                    <el-form-item :label="$t('account.setPassword')" prop="newPassword">
                        <el-input
                            style="width: 480px;"
                            v-model="passwdForm.newPassword"
                            oninput="value=value.replace(/[^\w\.\/]/ig,'')"
                            maxlength="20"
                            type="password"
                            show-word-limit
                            show-password
                        ></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('account.ConfirmPassword')" prop="repeatPassword">
                        <el-input
                            style="width: 480px;"
                            v-model="passwdForm.repeatPassword"
                            oninput="value=value.replace(/[^\w\.\/]/ig,'')"
                            maxlength="20"
                            type="password"
                            show-word-limit
                            show-password
                        ></el-input>
                    </el-form-item>

                    <!-- 手机号码 -->
                    <el-form-item :label="$t('account.phone')" prop="">
                        <el-input placeholder="" v-model="baseInfoForm.phone" class="input-with-select" disabled style="width: 480px;">
                            <template #prepend>
                                {{ baseInfoForm.phonePrefix }}
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item :label="$t('account.code')" prop="code">
                        <el-input :placeholder="$t('account.EnterVerificationCode')" v-model="passwdForm.code" style="width: 480px;">
                            <template #append>
                                <el-button type="info" @click="getPassWdPhoneCode">{{ isCountdown_2 ? count_2.count + "s" : $t("account.getCode") }}</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <!-- 确认修改 -->
                <div class="flex vcenter">
                    <el-button @click="subPasswd" type="primary" style="200px;">{{ $t("account.confirmEdit") }}</el-button>
                </div>
            </el-tab-pane>

            <el-tab-pane :label="$t('account.phone')" name="3">
                <div class="step">
                    <el-steps :active="active" class="custom-step" finish-status="success" style="width: 600px;">
                        <el-step :title="$t('account.OriginalPhoneNumber')"></el-step>
                        <el-step :title="$t('account.ModifyPhoneNumber')"></el-step>
                        <el-step :title="$t('account.SuccessfullyModified')"></el-step>
                    </el-steps>
                </div>

                <div>
                    <BmBaseTitle :title="$t('account.phone')"> </BmBaseTitle>
                </div>

                <div v-if="active != 1">
                    <el-form label-width="100px" class="mb-30" label-position="left">
                        <!-- 当前绑定手机号 -->
                        <el-form-item :label="$t('account.PhoneNumCurrentlyBound')">
                            <div>
                                <el-input style="width: 480px;" :placeholder="$t('account.PleaseEnterPhone')" v-model="baseInfoForm.phone" class="input-with-select" disabled>
                                    <template #prepend>
                                        {{ baseInfoForm.phonePrefix }}
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item :label="$t('account.code')">
                            <div>
                                <el-input :placeholder="$t('account.EnterVerificationCode')" v-model="oldPhoneForm.code" style="width: 480px;">
                                    <template #append>
                                        <el-button type="info" class="btn-color" @click="getCurrentCode">{{ isCountdown_3 ? count_3.count + "s" : $t("account.getCode") }}</el-button>
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <!-- 下一步 -->
                            <el-button @click="nextStep" class="subBtn" type="primary" style="width: 480px;">{{ $t("account.nextStep") }}</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div v-if="active == 1">
                    <el-form label-width="100px" class="mb-30" label-position="left">
                        <!-- 新手机号 -->
                        <el-form-item :label="$t('account.NewPhoneNumber')">
                            <div>
                                <el-input style="width: 480px;" :placeholder="$t('account.PleaseEnterPhone')" v-model="newPhoneForm.phone" class="input-with-select">
                                    <template #prepend>
                                        <el-select v-model="newPhoneForm.phonePrefix" filterable style="width:80px">
                                            <el-option v-for="item in prefixPhone" :label="item.phonePrefix" :value="item.phonePrefix" :key="item.phonePrefix"></el-option>
                                        </el-select>
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item :label="$t('account.code')">
                            <div>
                                <el-input :placeholder="$t('account.EnterVerificationCode')" v-model="newPhoneForm.code" style="width: 480px;">
                                    <template #append>
                                        <el-button type="info" class="btn-color" @click="getNewPhoneCode">{{ isCountdown_4 ? count_4.count + "s" : $t("account.getCode") }}</el-button>
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="subEditPhone" class="subBtn" type="primary" style="width: 480px;">{{ $t("account.confirmSubmission") }}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>

            <el-tab-pane :label="$t('email')" name="4">
                <div>
                    <BmBaseTitle :title="$t('email')"> </BmBaseTitle>
                </div>
                <el-form :model="editEmailForm" label-width="auto" class="mb-30" label-position="left">
                    <div v-if="emailActive != 1">
                        <!-- 账户绑定邮件 -->
                        <el-form-item :label="$t('account.AccountBindingEmail')" prop="">
                            <el-input v-model="editEmailForm.oldEmail" :disabled="!!editEmailForm.oldEmail" style="width: 480px;" :placeholder="$t('account.mustFillEmailCode')"></el-input>
                        </el-form-item>
                        <!-- 验证码 -->
                        <el-form-item :label="$t('account.code')" prop="">
                            <el-input :placeholder="$t('account.EnterVerificationCode')" style="width: 480px;" v-model="editEmailForm.oldcode">
                                <template #append>
                                    <el-button type="info" @click="getEmailMessage('old')">{{ isCountdown ? count.count + "s" : $t("account.getCode") }}</el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <!-- 下一步 -->
                            <el-button @click="emailNextStep" class="subBtn" type="primary" style="width: 480px;">{{ $t("account.nextStep") }}</el-button>
                        </el-form-item>
                    </div>
                    <!-- v-if="emailActive == 1" -->
                    <div v-if="emailActive == 1">
                        <!-- 新邮箱 -->
                        <el-form-item :label="$t('account.newAccountBindingEmail')" prop="">
                            <el-input v-model="editEmailForm.newEmail" style="width: 480px;" :placeholder="$t('account.mustFillEmailCode')"></el-input>
                        </el-form-item>
                        <!-- 验证码 -->
                        <el-form-item :label="$t('account.code')" prop="">
                            <el-input :placeholder="$t('account.EnterVerificationCode')" style="width: 480px;" v-model="editEmailForm.newCode">
                                <template #append>
                                    <el-button type="info" @click="getEmailMessage('new')">{{ isCountdown ? count.count + "s" : $t("account.getCode") }}</el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <!-- 确认修改 -->
                        <div class="flex vcenter">
                            <el-button @click="subEditEmail" type="primary" style="200px;">{{ $t("account.confirmEdit") }}</el-button>
                        </div>
                    </div>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { ref, reactive, computed, getCurrentInstance, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
//       获取手机验证码, 获取当前登录人手机号验证码      校验当前登录人手机号             卖家web->修改卖家手机号码  查询当前登录卖家信息        获取邮箱验证码            修改邮箱            修改密码
import {
    basePhonePrefix,
    getPhoneCode,
    adminGetCurrentPhoneCode,
    adminCheckCurrentPhoneOrEmail,
    adminSellerUpdatePhone,
    adminSellerFindCurrentInfo,
    adminCheckGetEmailCode,
    adminSellerUpdateEmail,
    adminSellerUpdatePassword,
    adminCheckEmailCode
} from "@/api/user";
import { encrypt } from "@/utils/cryptoAES";
import storage from "@/utils/storage";

export default {
    name: "modificationUPI",
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const router = useRouter();

        let user_info = storage.get("userInfo");

        let active = ref(0);

        let emailActive = ref(0);

        let activeName = ref("1");

        let timer = null;
        let count = reactive({ count: 60 });
        const isCountdown = ref(false);

        let editEmailForm = reactive({
            oldEmail: "",
            newEmail: "",
            oldcode: "",
            newCode: ""
        });

        // 获得邮箱验证码
        const getEmailMessage = (val) => {
            if (isCountdown.value) {
                return;
            }

            if (val == "old" && editEmailForm.oldEmail.length < 6) {
                proxy.$message.error(proxy.$t("account.YourEmailFormatIncorrect"));
                return;
            }

            if (val == "new" && editEmailForm.newEmail.length < 6) {
                proxy.$message.error(proxy.$t("account.YourEmailFormatIncorrect"));
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
                email: val == "old" ? editEmailForm.oldEmail : editEmailForm.newEmail,
                userType: "seller",
                type: "0"
            };

            // 发送请求
            adminCheckGetEmailCode(data).then((res) => {
                console.log(res);
                if (val == "old") {
                    editEmailForm.oldcode = res.data;
                } else {
                    editEmailForm.newCode = res.data;
                }
            });
        };

        const emailNextStep = () => {
            let data = {
                email: editEmailForm.oldEmail,
                code: editEmailForm.oldcode,
                userType: "seller",
                type: "0"
            };
            const loading = proxy.$loading();
            adminCheckEmailCode(data)
                .then((res) => {
                    emailActive.value = 1;
                    clearInterval(timer);
                    count.count = 60;
                    isCountdown.value = false;
                })
                .catch(() => {
                    loading.close();
                });
        };

        // 修改邮箱
        const subEditEmail = () => {
            if (editEmailForm.newCode == "") {
                // 验证码
                proxy.$message.error(proxy.$t("cashier.VerificationCode"));
                return;
            }
            const loading = proxy.$loading();
            adminSellerUpdateEmail({ code: editEmailForm.newCode, email: editEmailForm.newEmail })
                .then(async (res) => {
                    proxy.$message.success(res.msg);
                    emailActive.value = 0;
                    try {
                        await store.dispatch("user/LogOut");
                    } catch (error) {}
                    router.push(`/login`);
                })
                .catch(() => {
                    loading.close();
                });
        };

        // tab切换
        const handleClick = (tab, event) => {
            console.log(tab.props.name);
            // pane = tab.props.name;
            // getListPage();
            // searchCount();
        };

        // 收到切换pane
        const editPane = (val) => {
            if (val == 2) {
                activeName.value = "2";
            } else {
                activeName.value = "3";
            }
        };

        let baseInfoForm = ref({});

        // 获取用户信息
        const getCurrentInfo = () => {
            adminSellerFindCurrentInfo().then((res) => {
                baseInfoForm.value = res.data;
                editEmailForm.oldEmail = res.data.email;
                baseInfoForm.value.phone = res.data.phone.substr(0, 3) + "*****" + res.data.phone.substr(8);
            });
        };
        getCurrentInfo();

        // -------------------------登录密码---------------------------
        let passwdForm = reactive({
            password: "",
            newPassword: "",
            repeatPassword: "",
            code: "",
            phone: "",
            phonePrefix: ""
        });

        // 手机号前缀：
        const prefixPhone = ref([]);
        //获取手机前缀
        const getBasePhonePrefix = () => {
            basePhonePrefix(0)
                .then((res) => {
                    prefixPhone.value = res.data;
                })
                .catch((err) => {});
        };
        getBasePhonePrefix();

        let passwdFormRef = ref(null);

        const validatepPhoneCode = (rule, value, callback) => {
            if (value !== passwdForm.newPassword) {
                callback(new Error(proxy.$t("account.TwoPasswordEnteredInconsistent")));
            } else {
                callback();
            }
        };

        const validatepPassword = (rule, value, callback) => {
            if (value.length >= 6 && value.length <= 20 && /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test(value)) {
                callback();
            } else {
                callback(new Error(proxy.$t("register.passwordLength")));
            }
        };

        let passwdFormRules = {
            password: [
                { required: true, message: proxy.$t("account.PleaseEnterPassword"), trigger: "blur" },
                { min: 6, message: proxy.$t("account.PasswordLength6"), trigger: "blur" }
            ],
            newPassword: [{ required: true, validator: validatepPassword, trigger: "blur" }],
            repeatPassword: [{ validator: validatepPhoneCode, trigger: "blur" }],
            code: [
                { required: true, message: proxy.$t("account.EnterVerificationCode"), trigger: "blur" },
                { min: 6, message: proxy.$t("account.verificationCodeLength6"), trigger: "change" }
            ]
        };

        let timer_2 = null;
        let count_2 = reactive({ count: 60 });
        const isCountdown_2 = ref(false);

        const getPassWdPhoneCode = () => {
            if (isCountdown_2.value) {
                return;
            }

            // if( passwdForm.emaillAddress.length < 6 ) {
            //     proxy.$message.error('您的邮箱格式不对');
            //     return
            // }

            isCountdown_2.value = true;

            timer_2 = setInterval(() => {
                console.log(count_2.count);
                count_2.count--;
                if (count_2.count > 0) {
                    count_2.count = count_2.count--;
                } else {
                    clearInterval(timer_2);
                    (count_2.count = 60), (isCountdown_2.value = false);
                }
            }, 1000);

            let data = { type: "1", userType: "seller" };
            // 发送请求
            adminGetCurrentPhoneCode(data).then((res) => {
                console.log(res);
                passwdForm.code = res.data;
            });
        };

        // 修改密码
        const subPasswd = () => {
            let form = {
                password: encrypt(passwdForm.password),
                newPassword: encrypt(passwdForm.newPassword),
                repeatPassword: encrypt(passwdForm.repeatPassword),
                code: passwdForm.code
            };
            passwdFormRef.value.validate((valid) => {
                if (valid) {
                    const loading = proxy.$loading();
                    adminSellerUpdatePassword(form)
                        .then(async (res) => {
                            proxy.$message.success(res.msg);
                            await store.dispatch("user/LogOut");
                            router.push(`/login`);
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                } else {
                    console.log("error submit");
                    return false;
                }
            });
        };

        // ----------------------手机号码-----------------------
        const oldPhoneForm = reactive({
            userType: "seller", // 用户类型，seller卖家，buyer买家，operator运营
            type: "1", // 校验类型，1：手机号码，2：邮箱
            code: "",
            phone: user_info.phone,
            phonePrefix: user_info.phonePrefix
        });

        // 获取当前已经登录用户的验证码
        let timer_3 = null;
        let count_3 = reactive({ count: 60 });
        const isCountdown_3 = ref(false);

        const getCurrentCode = () => {
            if (isCountdown_3.value) {
                return;
            }

            isCountdown_3.value = true;

            timer_3 = setInterval(() => {
                console.log(count_3.count);
                count_3.count--;
                if (count_3.count > 0) {
                    count_3.count = count_3.count--;
                } else {
                    clearInterval(timer_3);
                    (count_3.count = 60), (isCountdown_3.value = false);
                }
            }, 1000);

            // 发送请求
            let data = { type: "1", userType: "seller" };
            // 发送请求
            adminGetCurrentPhoneCode(data).then((res) => {
                console.log(res);
                oldPhoneForm.code = res.data;
            });
        };

        // 下一步 校验验证码
        const nextStep = () => {
            // 校验当前登录用户手机号码或者邮箱
            adminCheckCurrentPhoneOrEmail(oldPhoneForm).then((res) => {
                active.value = 1;
                clearInterval(timer_3);
                count_3.count = 60;
                isCountdown_3.value = false;
            });
        };

        // 获取验证码
        let timer_4 = null;
        let count_4 = reactive({ count: 60 });
        const isCountdown_4 = ref(false);

        let newPhoneForm = reactive({
            phone: "",
            phonePrefix: "+86",
            type: "0",
            code: "",
            userType: "seller"
        });

        const getNewPhoneCode = () => {
            if (isCountdown_4.value) {
                return;
            }

            if (newPhoneForm.phone.length < 6) {
                proxy.$message.error(proxy.$t("account.formatPhoneNumberWrong"));
                return;
            }

            isCountdown_4.value = true;

            timer_4 = setInterval(() => {
                console.log(count_4.count);
                count_4.count--;
                if (count_4.count > 0) {
                    count_4.count = count_4.count--;
                } else {
                    clearInterval(timer_4);
                    (count_4.count = 60), (isCountdown_4.value = false);
                }
            }, 1000);

            // 发送请求
            getPhoneCode(newPhoneForm).then((res) => {
                console.log(res);
                newPhoneForm.code = res.data;
            });
        };

        // 提交
        const subEditPhone = () => {
            const loading = proxy.$loading();
            adminSellerUpdatePhone(newPhoneForm).then(async (res) => {
                loading.close();
                proxy.$message.success(res.msg);
                try {
                    await store.dispatch("user/LogOut");
                } catch (error) {
                    loading.close();
                }
                router.push(`/login`);
            });
        };

        onUnmounted(() => {
            clearInterval(timer);
            clearInterval(timer_2);
            clearInterval(timer_3);
            clearInterval(timer_4);
        });

        return {
            active,
            activeName,
            handleClick,
            count,
            isCountdown,
            getEmailMessage,
            editEmailForm,
            subEditEmail,
            baseInfoForm,
            prefixPhone,
            passwdForm,
            getPassWdPhoneCode,
            count_2,
            isCountdown_2,
            count_3,
            isCountdown_3,
            count_4,
            isCountdown_4,
            subPasswd,
            oldPhoneForm,
            nextStep,
            subEditPhone,
            getCurrentCode,
            getNewPhoneCode,
            newPhoneForm,
            editPane,
            passwdFormRules,
            passwdFormRef,
            emailActive,
            emailNextStep
        };
    }
};
</script>

<style lang="scss" scoped>
.content-wrap {
    .step {
        width: 100%;
        margin-bottom: 50px;
        padding-top: 20px;
    }
}
/deep/ .el-input-group__prepend {
    width: 110px;
}
/deep/.el-select .el-input {
    width: 100px;
}
/deep/.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>
