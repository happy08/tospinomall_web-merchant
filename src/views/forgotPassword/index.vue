<template>
    <HeaderLogin />
    <div class="content-wrap">
        <div class="container">
            <div class="flex center">
                <div class="step">
                    <el-steps :active="step.active" class="custom-step plr-50" finish-status="success">
                        <el-step v-for="(item, i) in step.list" :key="i" :title="item"></el-step>
                    </el-steps>
                </div>
            </div>
            <div v-if="step.active == 0" class="flex hcenter vcenter">
                <el-form class="big-input" :model="phoneLoginForm" :rules="phoneLoginRules" ref="phoneLoginFormRef">
                    <el-form-item class="el-form-bottom" prop="accountType">
                        <div class="flex flex-start vcenter">
                            <!-- 账户类型 -->
                            <div class="account-name">{{ $t("resetPass.accountType") }}</div>
                            <div class="flex flex-start vcenter radios">
                                <!-- 主账号 子账号-->
                                <el-radio v-model="phoneLoginForm.accountType" label="0">{{ $t("resetPass.mainAccount") }}</el-radio>
                                <el-radio v-model="phoneLoginForm.accountType" label="1">{{ $t("resetPass.sonAccount") }}</el-radio>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="phoneLoginForm.accountType == '1'" class="el-form-bottom" prop="account">
                        <template #label>
                            <span class="fs-16">{{ $t("resetPass.accountName") }}</span>
                        </template>
                        <div>
                            <!-- 子账号名称 -->
                            <el-input :placeholder="$t('resetPass.sonAccountName')" v-model="phoneLoginForm.account" class="input-with-select"> </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item prop="phone">
                        <template #label>
                            <!-- 手机号码 -->
                            <span class="fs-16">{{ $t("resetPass.phone") }}</span>
                        </template>
                        <el-input :placeholder="$t('resetPass.enterPhone')" v-model="phoneLoginForm.phone" class="input-with-select">
                            <template #prepend>
                                <el-select v-model="phoneLoginForm.phonePrefix" filterable style="width:100px">
                                    <el-option v-for="item in prefixPhone" :label="item.phonePrefix" :value="item.phonePrefix" :key="item.phonePrefix"></el-option>
                                </el-select>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <template #label>
                            <span class="fs-16">{{ $t("resetPass.code") }}</span>
                        </template>
                        <div>
                            <el-input :placeholder="$t('resetPass.pleaseCode')" v-model="phoneLoginForm.code" style="width: 480px;height: 48px;">
                                <template #append>
                                    <el-button type="info" class="btn-color" @click="getMessage">{{ isCountdown ? count.count + "s" : $t("resetPass.getCode") }}</el-button>
                                </template>
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="nextStep" :disabled="loginDisabled" :loading="loginDisabled" class="subBtn" type="primary" style="width: 480px;height: 48px;">{{
                            $t("resetPass.nextStep")
                        }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="step.active == 1" class="flex hcenter vcenter">
                <el-form class="big-input" :model="amend" :rules="amendRules" ref="amendFormRef">
                    <el-form-item prop="password">
                        <!-- 设置新密码 -->
                        <template #label>
                            <span class="fs-16">{{ $t("resetPass.setNewPass") }}</span>
                        </template>
                        <div style="margin-top: 8px">
                            <el-input style="width: 480px;height: 48px;" :placeholder="$t('resetPass.passFormat')" v-model="amend.password" class="input-with-select" type="password" show-password>
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 52px;" prop="repeatPassword">
                        <!-- 确认新密码 -->
                        <template #label>
                            <span class="fs-16">{{ $t("resetPass.confirmNewPass") }}</span>
                        </template>
                        <div style="margin-top: 8px">
                            <!-- 请再次输入密码 -->
                            <el-input :placeholder="$t('resetPass.pleasePass')" type="repeatPassword" show-password v-model="amend.repeatPassword"> </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <!-- 确认提交 -->
                        <el-button @click="subForm" :disabled="loginDisabled" :loading="loginDisabled" class="subBtn" type="primary" style="width: 480px;height: 48px;">{{
                            $t("resetPass.confirmSubmission")
                        }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="step.active == 2" class="flex hcenter vcenter">
                <div>
                    <div class="success-title flex hcenter vcenter"><img class="img" src="../../assets/img/success@2x.png" /></div>
                    <div class="success-center flex hcenter vcenter">success</div>
                    <div class="success-bottom">
                        <!-- 立即登录 -->
                        <el-button @click="nextLogin" class="subBtn" type="primary" style="width: 480px;height: 48px;">{{ $t("resetPass.nextLogin") }}</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, unref, getCurrentInstance, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import step from "../../components/componentStep";
import { basePhonePrefix, getPhoneCode, forgetPassword, adminUmsCheckPhone } from "@/api/user";
import { encrypt } from "@/utils/cryptoAES";
import HeaderLogin from "@/components/headerLogin";

export default {
    name: "forgotPassword",
    components: { step, HeaderLogin },
    setup() {
        const { proxy } = getCurrentInstance();
        const router = useRouter();

        const step = reactive({
            list: [proxy.$t("resetPass.Authentication"), proxy.$t("resetPass.repeatPass"), proxy.$t("resetPass.success")],
            active: 0
        });

        let phoneLoginFormRef = ref(null);
        let amendFormRef = ref(null);

        const phoneLoginForm = reactive({
            phone: "",
            code: "",
            phonePrefix: proxy.$store.state.app.phonePrefix,
            accountType: "0",
            account: ""
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

        const amend = reactive({
            password: "",
            repeatPassword: ""
        });

        const validataPhone = (rule, value, callback) => {
            var reg = /^1[3456789][0-9]{9}$/;
            if (!reg.test(value)) {
                callback(new Error(proxy.$t("resetPass.phoneFormatNo")));
            } else {
                callback();
            }
        };

        const validatepPhoneCode = (rule, value, callback) => {
            if (value !== amend.password) {
                callback(new Error(proxy.$t("resetPass.inconformityPassword")));
            } else {
                callback();
            }
        };

        const validatepPassword = (rule, value, callback) => {
            if (value.length >= 6 && value.length <= 20 && /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test(value)) {
                callback();
            } else {
                callback(new Error(proxy.$t("resetPass.passwordLength")));
            }
        };

        // 短信校验
        const phoneLoginRules = {
            accountType: [{ required: true, message: proxy.$t("resetPass.pleaseSelectAccountType"), trigger: "blur" }],
            code: [
                { required: true, message: proxy.$t("resetPass.pleaseCode"), trigger: "blur" },
                { min: 6, message: proxy.$t("resetPass.verificationCodeLength6"), trigger: "change" }
            ],
            phone: [
                { required: true, message: proxy.$t("resetPass.enterPhone"), trigger: "blur" },
                { min: 6, message: proxy.$t("resetPass.phoneNoMin6"), trigger: "blur" }
            ],
            account: [{ required: true, message: proxy.$t("resetPass.pleaseSonAccount"), trigger: "blur" }]
        };

        const amendRules = {
            password: [
                { validator: validatepPassword, trigger: "blur" },
                { required: true, message: proxy.$t("resetPass.PleaseEnterPassword"), trigger: "blur" },
                { min: 6, message: proxy.$t("resetPass.passLength6"), trigger: "blur" }
            ],
            repeatPassword: [{ validator: validatepPhoneCode, trigger: "blur" }]
        };

        let timer = null;
        let count = reactive({ count: 60 });
        const isCountdown = ref(false);

        // 获得短信验证码
        const getMessage = () => {
            if (isCountdown.value) {
                return;
            }

            // let reg = /^1[3456789][0-9]{9}$/;
            // if (!reg.test(phoneLoginForm.phoneNumber)) {
            //     proxy.$message.error('您的手机格式不对');
            //     return
            // };

            if (phoneLoginForm.phone.length < 6) {
                proxy.$message.error(proxy.$t("resetPass.phoneNoMin6"));
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
                    count.count = 60;
                    isCountdown.value = false;
                }
            }, 1000);

            let data = {
                phone: phoneLoginForm.phone,
                phonePrefix: phoneLoginForm.phonePrefix,
                userType: "seller",
                type: 2
            };

            // 发送请求
            getPhoneCode(data)
                .then((res) => {
                    proxy.$message.success(proxy.$t("resetPass.codeSuccess"));
                    phoneLoginForm.code = res.data;
                })
                .catch((err) => {});
        };

        // 进入填写密码
        let loginDisabled = ref(false);
        const nextStep = () => {
            let form = {
                code: phoneLoginForm.code,
                phone: phoneLoginForm.phone,
                phonePrefix: phoneLoginForm.phonePrefix,
                userType: "seller",
                type: 2,
                isDelCode: 0
            };
            phoneLoginFormRef.value.validate((valid) => {
                if (valid) {
                    adminUmsCheckPhone(form)
                        .then((res) => {
                            step.active = 1;
                            proxy.$message.success(res.msg);
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        };

        // 提交新密码
        const subForm = () => {
            let data = {
                account: phoneLoginForm.account,
                accountType: phoneLoginForm.accountType,
                code: phoneLoginForm.code,
                password: encrypt(amend.password),
                repeatPassword: encrypt(amend.repeatPassword),
                phone: phoneLoginForm.phone,
                phonePrefix: phoneLoginForm.phonePrefix,
                type: 2
            };

            amendFormRef.value.validate((valid) => {
                if (valid) {
                    const loading = proxy.$loading();
                    forgetPassword(data)
                        .then((res) => {
                            step.active = 2;
                            loading.close();
                        })
                        .catch((err) => {
                            //err.code
                            console.log(err.code);
                            step.active = 0;
                            phoneLoginForm.code = "";
                            loading.close();
                        });
                } else {
                    console.log("error submit");
                    return false;
                }
            });
        };

        const nextLogin = () => {
            router.push("/login");
        };

        return {
            step,
            prefixPhone,
            phoneLoginForm,
            count,
            isCountdown,
            getMessage,
            nextStep,
            loginDisabled,
            subForm,
            amend,
            phoneLoginRules,
            phoneLoginFormRef,
            amendRules,
            amendFormRef,
            nextLogin
        };
    }
};
</script>
<style>
html,
body {
    overflow-y: auto;
}
</style>
<style lang="scss" scoped>
.content-wrap {
    position: relative;
    width: 100%;
    // padding: 0px 24px 0px 24px;
    background-color: #f2f2f2;
    .container {
        background: #ffffff;
        width: 100%;
        padding: 60px 0 100px 0;
        .layout-header {
            height: 64px;
            line-height: 64px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            background: #ffffff;
        }

        .step {
            width: 700px;
            max-width: 100%;
            margin-bottom: 90px;
        }

        .el-select .el-input {
            width: 130px;
        }

        .form-name {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
        }

        .el-form-bottom {
            margin-bottom: 24px;
        }

        .btn-color {
            color: #42b7ae;
        }

        .img {
            width: 64px;
            height: 64px;
        }

        .success-title {
            margin-bottom: 24px;
        }
        .success-center {
            margin-bottom: 54px;
            font-size: 18px;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 500;
            color: #383838;
        }

        .flex-start {
            justify-content: flex-start;
        }

        .radios {
            margin-left: 48px;
        }

        .account-name {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
        }

        .service {
            cursor: pointer;
        }
    }
}
</style>
