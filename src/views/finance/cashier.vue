<template>
    <div class="p-25 mb-25 bg-white round-4">
        <BmBreadcrumb />
    </div>

    <div class="p-25 bg-white round-4">
        <div class="mb-25">
            <div class="count">
                <div class="category mb-8">{{ $t("cashier.PaymentCurrencyAmount") }}</div>
                <div class="num mb-20">{{ data.shortName }} {{ data.withdrawableAmount }}</div>
                <div class="flex">
                    <div>{{ $t("cashier.TransactionTypeDeposit") }}</div>
                    <div class="ml-78">
                        <span>{{ $t("cashier.storeNum") + ":" }}</span
                        ><span class="green ml-5">{{ storeInfo.storeCode }}</span>
                    </div>
                    <div class="ml-78">{{ $t("cashier.storeName") }}: {{ storeInfo.storeName }}</div>
                </div>
            </div>
        </div>
        <div>
            <el-form label-width="80px">
                <el-form-item :label="$t('cashier.modePayment') + ':'">
                    <!-- <el-input v-model="data.amount" style="width: 371px;" disabled>
                        <template #prepend>
                            <div>
                                <span>贷款可用余额{{ data.shortName }}</span>
                                <span class="ml-30">无服务费,即时到账</span>
                            </div>
                        </template>
                    </el-input> -->
                    <div class="payType flex vcenter between">
                        <span>{{ $t("cashier.LoanAvailableBalance") }}{{ data.shortName }}</span>
                        <span class="ml-30">{{ $t("cashier.NoServiceAccount") }}</span>
                    </div>
                </el-form-item>
                <el-form-item :label="$t('cashier.phone')" prop="">
                    <el-input :placeholder="$t('cashier.pleaseEnter')" v-model="sellerUser.phone" class="input-with-select" style="width: 371px;" disabled>
                        <template #prepend>
                            <el-select v-model="sellerUser.phonePrefix" :placeholder="$t('cashier.pleaseSelect')" disabled>
                                <el-option label="+86" value="86"></el-option>
                                <el-option label="+233" value="233"></el-option>
                            </el-select>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码:">
                    <div class="flex">
                        <el-input v-model="code" :placeholder="$t('cashier.pleaseSelect')" style="width: 167px;" />
                        <el-button class="ml-20" type="primary" @click="getMessage">{{ isCountdown ? count + "s" : $t("cashier.getCode") }}</el-button>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">{{ $t("cashier.confirmPayment") }}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { adminStoreFindCurrent, adminUmsCheckCodeGetCurrentPhoneCode, financeRecharge } from "@/api/goods";
import { useRouter, useRoute } from "vue-router";
export default {
    name: "cashier",
    setup(props) {
        const { proxy } = getCurrentInstance();
        const router = useRouter();
        const route = useRoute();

        let storeInfo = ref({});
        let sellerUser = ref({});

        let data = reactive({
            amount: route.query.amount,
            withdrawableAmount: route.query.withdrawableAmount,
            shortName: route.query.shortName
        });

        let code = ref("");

        const getStoreInfo = () => {
            adminStoreFindCurrent()
                .then((res) => {
                    storeInfo.value = res.data;
                    sellerUser.value = res.data.sellerUser;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getStoreInfo();

        let timer = null;
        let count = ref(60);
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

            // if(phoneForm.phoneNumber.length < 6 ) {
            //     proxy.$message.error('您的手机号格式不对');
            //     return
            // }

            isCountdown.value = true;

            timer = setInterval(() => {
                console.log(count.value);
                count.value--;
                if (count.value > 0) {
                    count.value = count.value--;
                } else {
                    clearInterval(timer);
                    (count = 60), (isCountdown.value = false);
                }
            }, 1000);

            // 发送请求
            adminUmsCheckCodeGetCurrentPhoneCode({ type: 1, userType: "seller" })
                .then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        // 获取验证码成功
                        proxy.$message.success($t("cashier.VerificationCodeSuccess"));
                        code.value = res.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const submit = () => {
            if (code.value == "") {
                // 验证码
                proxy.$message.error(proxy.$t("cashier.VerificationCode"));
                return;
            }
            const loading = proxy.$loading();
            financeRecharge({ code: code.value, amount: route.query.amount })
                .then((res) => {
                    if (res.code == 0) {
                        clearInterval(timer);
                        count.value = 60;
                        isCountdown.value = false;
                        proxy.$message.success(res.msg);
                        loading.close();
                        router.go(-1);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                });
        };

        return {
            code,
            data,
            storeInfo,
            sellerUser,
            count,
            isCountdown,
            getMessage,
            submit
        };
    }
};
</script>

<style lang="scss" scoped>
.count {
    padding: 18px 14px 27px 14px;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    .category {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 17px;
    }
    .num {
        font-size: 22px;
        font-family: DIN-Bold, DIN;
        font-weight: bold;
        color: #42b7ae;
        line-height: 27px;
    }
}
/deep/.el-select .el-input {
    width: 100px;
}
/deep/.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
.payType {
    border-radius: 5px;
    border: 1px solid #dcdfe6;
    width: 371px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #f5f7fa;
    color: #909399;
    height: 32px;
}
</style>
