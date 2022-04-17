<template>
    <HeaderLogin />
    <div class="content-wrap">
        <div class="container pt-64">
            <div class="flex center">
                <div class="step">
                    <el-steps :active="step.active" class=" custom-step plr-50" finish-status="success">
                        <el-step v-for="(item, i) in step.list" :key="i" :title="item"></el-step>
                    </el-steps>
                </div>
            </div>
            <div class="flex hcenter vcenter">
                <el-form class="big-input" :model="phoneLoginForm" :rules="rules" ref="phoneLoginFormRef">
                    <el-form-item prop="phone">
                        <template #label>
                            <span class="fs-16">{{ $t("register.phone") }}</span>
                        </template>

                        <el-input style="width: 480px;" :placeholder="$t('register.enterPhone')" v-model.number="phoneLoginForm.phone" class="input-with-select">
                            <template #prepend>
                                <el-select v-model="phoneLoginForm.phonePrefix" filterable style="width: 100px;">
                                    <el-option v-for="(item, i) in phonePrefixList" :key="i" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                                </el-select>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <template #label>
                            <span class="fs-16">{{ $t("register.code") }}</span>
                        </template>
                        <el-input :placeholder="$t('register.enterCode')" v-model="phoneLoginForm.code" style="width: 480px;">
                            <template #append>
                                <el-button type="info" class="btn-color" @click="getMessage">{{ isCountdown ? count.count + "s" : $t("register.getCode") }}</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="nextStep" :disabled="loginDisabled" :loading="loginDisabled" class="subBtn" type="primary" style="width: 480px;height: 48px;">{{
                            $t("register.nextStep")
                        }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, unref, getCurrentInstance, onMounted, nextTick, watch, computed } from "vue";
import { useRouter } from "vue-router";
import step from "@/components/componentStep";
import HeaderLogin from "@/components/headerLogin";
import { getPhoneCode, checkPhone, basePhonePrefix } from "@/api/user";

export default {
    name: "register",
    components: { step, HeaderLogin },
    setup() {
        const { proxy } = getCurrentInstance();
        const router = useRouter();

        const step = computed(() => {
            return {
                list: [proxy.$t("register.storeInfo"), proxy.$t("register.qualificationInfo"), proxy.$t("register.auditPlatform"), proxy.$t("register.registerSuccess")],
                active: 0
            };
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

        let phoneLoginFormRef = ref(null);
        const phoneLoginForm = reactive({
            phone: "",
            phonePrefix: proxy.$store.state.app.phonePrefix,
            code: ""
        });

        // 校验
        const rules = {
            phone: { required: true, message: proxy.$t("required"), trigger: "blur" },
            code: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        let timer = null;
        let count = reactive({ count: 60 });
        const isCountdown = ref(false);

        // 获得短信验证码
        const getMessage = () => {
            if (isCountdown.value) {
                return;
            }

            let reg = /^1[3456789][0-9]{9}$/;
            // if (!reg.test(phoneLoginForm.phone)) {
            //     proxy.$message.error('您的手机格式不对');
            //     return
            // };
            if (phoneLoginForm.phone.length < 6) {
                proxy.$message.error(proxy.$t("register.phoneFormatNo"));
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
                phone: phoneLoginForm.phone,
                phonePrefix: phoneLoginForm.phonePrefix,
                userType: "seller",
                type: 1
            };

            // 发送请求
            getPhoneCode(data)
                .then((res) => {
                    proxy.$message.success(proxy.$t("register.getCodeSuccess"));
                    phoneLoginForm.code = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        let loginDisabled = ref(false);
        const nextStep = () => {
            let data = {
                code: phoneLoginForm.code,
                phone: phoneLoginForm.phone,
                phonePrefix: phoneLoginForm.phonePrefix,
                userType: "seller",
                type: 1
            };
            phoneLoginFormRef.value.validate((valid) => {
                if (valid) {
                    checkPhone(data)
                        .then((res) => {
                            step.active = step.active + 1;
                            router.push({
                                path: "/register/detail",
                                query: {
                                    phone: phoneLoginForm.phone,
                                    phonePrefix: phoneLoginForm.phonePrefix
                                }
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    return false;
                }
            });
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

        return {
            step,
            prefixPhone,
            phoneLoginFormRef,
            phoneLoginForm,
            rules,
            count,
            isCountdown,
            getMessage,
            nextStep,
            loginDisabled,
            phonePrefixList
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

    background-color: #f2f2f2;

    .container {
        width: 100%;
        background-color: #fff;
        padding: 60px 0 100px 0;

        .layout-header {
            height: 64px;
            line-height: 64px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            background: #ffffff;
        }

        .step {
            width: 1500px;
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

        .account-name {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
        }
    }
}

/deep/.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>
