<template>
    <div class="p-25 mb-25 bg-white round-4">
        <BmBreadcrumb />
        <div class="warning">
            <div class="ml-15">
                <i class="el-icon-warning"></i><span class="ml-15">{{ $t("depositDetail.importantNote") }}:</span>
            </div>
            <div class="ml-40">1、{{ $t("depositDetail.WithdrawalBalance") }}</div>
            <div class="ml-40">2、{{ $t("depositDetail.minWithdrawalAmount") }}</div>
            <div class="ml-40">3、{{ $t("depositDetail.CashCycle") }}</div>
            <div class="ml-40">4、{{ $t("depositDetail.accountCredited") }}</div>
        </div>
    </div>
    <div class="p-25 bg-white round-4">
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="120px" class="demo-ruleForm">
            <el-form-item :label="$t('depositDetail.DefaultWithdrawalAccount')">
                <div class="flex">
                    <div class="account">
                        <el-select v-model="ruleForm.type" disabled>
                            <el-option label="Payoneer" value="1"></el-option>
                            <el-option :label="$t('depositDetail.bankCreditCard')" value="2"></el-option>
                            <el-option :label="$t('depositDetail.BankDebitCard')" value="3"></el-option>
                        </el-select>
                    </div>
                    <div class="account_2"><el-input disabled v-model="ruleForm.gatheringAccount"></el-input></div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('depositDetail.WithdrawalAmount')"> {{ ruleForm.withdrawableAmount }} {{ ruleForm.minWithdrawAmountUnit }} </el-form-item>
            <el-form-item :label="$t('depositDetail.ThisWithdrawalAmount')" prop="amount">
                <div class="flex vcenter">
                    <div>
                        <div class="flex">
                            <el-select v-model="ruleForm.rateId" placeholder="">
                                <el-option v-for="(item, i) in rateList" :key="i" :label="item.shortName" :value="item.id"></el-option>
                            </el-select>
                            <el-input class="ml-10" @change="amountChange" oninput="value=value.replace(/[^\d^\.]/g,'')" v-model="ruleForm.amount" maxlength="10"></el-input>
                        </div>
                        <div class="tips">{{ exchangeRate }}</div>
                        <div class="tips">{{ $t("depositDetail.drawalCurrencyAmount") }}: {{ money.money1 }} {{ shortName }}</div>
                    </div>
                    <div class="ml-20 tips">{{ $t("depositDetail.minSingleWithdrawal") }} {{ ruleForm.minWithdrawAmount }} {{ ruleForm.minWithdrawAmountUnit }}</div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('depositDetail.withdrawalPhone')" prop="parentSellerPhone">
                <div class="flex vcenter">
                    <div><el-input v-model="ruleForm.parentSellerPhone" disabled></el-input></div>
                    <div class="ml-20 tips">{{ $t("depositDetail.superAdministrator") }}</div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('depositDetail.code')" prop="code">
                <div class="flex">
                    <!-- 获得验证码 -->
                    <div><el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="ruleForm.code" maxlength="6" style="width: 167px;"></el-input></div>
                    <div class="green ml-20 cp" @click="getPhoneCode">{{ isCountdown ? count + "s" : $t("depositDetail.getCode") }}</div>
                </div>
            </el-form-item>
            <el-form-item>
                <!-- 取消 -->
                <el-button @click="goBack">{{ $t("depositDetail.cancel") }}</el-button>
                <!-- 确认提现 -->
                <el-button type="primary" @click="submitForm('ruleForm')">{{ $t("depositDetail.confirmWithdrawal") }}</el-button>
                <div class="orange">{{ $t("depositDetail.applicationWithdrawal") }}</div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter } from "vue-router";
import { financeFindWithdrawDeatil, financeApplyWithdraw, adminUmsCheckCodeGetCurrentPhoneCode, basicsRateFindAll, basicsRateCurrentExchange } from "@/api/goods";
export default {
    name: "depositDetail",
    setup(props) {
        let { proxy } = getCurrentInstance();
        const router = useRouter();

        let ruleFormRef = ref(null);

        let ruleForm = reactive({
            gatheringAccount: "", //	收款账户
            minWithdrawAmount: 0, //	最低提现金额
            minWithdrawAmountUnit: "", //	最低提现金额单位
            parentSellerPhone: "", //	父级账号手机号码
            parentSellerPhonePrefix: "", //	父级账号手机号前缀
            predictDealTime: "", //	平台预计处理时间
            predictDealTimeUnit: "", //	平台预计处理时间单位
            predictRemittanceTime: "", //	平台预计汇款时间
            predictRemittanceTimeUnit: "", //	平台预计汇款时间单位
            type: "", // 类型(1Payoneer，2银行借记卡，3银行信用卡
            withdrawableAmount: "", // 可提现余额
            amount: 0, // 提现金额
            code: "",
            rateId: ""
        });

        let money = ref({}); // 换算后的金额
        const getrateCurrentExchange = () => {
            let amount = ruleForm.amount == "" ? 0 : ruleForm.amount;
            basicsRateCurrentExchange({ otherCurrency: ruleForm.rateId, num: amount })
                .then((res) => {
                    money.value = res.data;
                    return res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        let rateList = ref([]);
        const getRate = () => {
            basicsRateFindAll()
                .then((res) => {
                    console.log(res);
                    rateList.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getRate();

        let exchangeRate = ref(""); // 汇率比
        let shortName = ref(""); // 汇率单位
        watch(
            () => ruleForm.rateId,
            (nVal) => {
                rateList.value.forEach((v) => {
                    if (v.id == ruleForm.rateId) {
                        exchangeRate.value = v.exchangeRate;
                        shortName.value = v.shortName;
                    }
                });
                getrateCurrentExchange();
            }
        );

        const amountChange = (val) => {
            console.log(val);
            getrateCurrentExchange();
        };

        const minWithdrawAmount = (rule, value, callback) => {
            var reg = /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;
            if (!reg.test(Number(value))) {
                callback(new Error(proxy.$t("depositDetail.WithdrawalSumDecimals")));
            }
            if (value < ruleForm.minWithdrawAmount || value > 10000000.0) {
                proxy.$message.error(proxy.$t("depositDetail.withdrawTips"));
                callback(new Error(proxy.$t("depositDetail.withdrawTips")));
            } else {
                callback();
            }
        };

        let rules = ref({
            amount: [{ validator: minWithdrawAmount, required: true, trigger: "blur" }],
            code: [
                { required: true, message: proxy.$t("depositDetail.VerificationCode"), trigger: "blur" },
                { min: 6, message: proxy.$t("depositDetail.verificationCode6"), trigger: "blur" }
            ]
        });

        const getData = () => {
            financeFindWithdrawDeatil()
                .then((res) => {
                    if (res.data) {
                        ruleForm.gatheringAccount = res.data.gatheringAccount; //	收款账户
                        ruleForm.minWithdrawAmount = res.data.minWithdrawAmount; //	最低提现金额
                        ruleForm.minWithdrawAmountUnit = res.data.minWithdrawAmountUnit; //	最低提现金额单位
                        ruleForm.parentSellerPhone = res.data.parentSellerPhone; //	父级账号手机号码
                        ruleForm.parentSellerPhonePrefix = res.data.parentSellerPhonePrefix; //	父级账号手机号前缀
                        ruleForm.predictDealTime = res.data.predictDealTime; //	平台预计处理时间
                        ruleForm.predictDealTimeUnit = res.data.predictDealTimeUnit; //	平台预计处理时间单位
                        ruleForm.predictRemittanceTime = res.data.predictRemittanceTime; //	平台预计汇款时间
                        ruleForm.predictRemittanceTimeUnit = res.data.predictRemittanceTimeUnit; //	平台预计汇款时间单位
                        ruleForm.type = res.data.type + ""; // 类型1Payoneer，2银行借记
                        ruleForm.withdrawableAmount = res.data.withdrawableAmount; // 可提现余额
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getData();

        let timer = null;
        let count = ref(60);
        const isCountdown = ref(false);
        const getPhoneCode = () => {
            if (isCountdown.value) {
                return;
            }

            // var reg = /^1[3456789][0-9]{9}$/;
            // if (!reg.test(phoneLoginForm.phoneNumber)) {
            //     proxy.$message.error('您的手机号格式不对');
            //     return
            // };

            isCountdown.value = true;

            timer = setInterval(() => {
                console.log(count.value);
                count.value--;
                if (count.value > 0) {
                    count.value = count.value--;
                } else {
                    clearInterval(timer);
                    count = 60;
                    isCountdown.value = false;
                }
            }, 1000);

            adminUmsCheckCodeGetCurrentPhoneCode({ type: 1, userType: "seller" })
                .then((res) => {
                    ruleForm.code = res.data;
                    if (res.code == 1) {
                        proxy.$message.error(res.msg);
                    } else {
                        proxy.$message.success(res.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const submitForm = () => {
            ruleFormRef.value.validate((valid) => {
                if (valid) {
                    financeApplyWithdraw({ code: ruleForm.code, amount: ruleForm.amount, rateId: ruleForm.rateId })
                        .then((res) => {
                            if (res.code == 0) {
                                router.go(-1);
                                proxy.$message.success(res.msg);
                            }
                            if (res.code == 1 || res.code == 10004) {
                                proxy.$message.error(res.msg);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        const resetForm = () => {
            ruleFormRef.value.resetFields();
        };

        const goBack = () => {
            router.go(-1);
        };

        return {
            ruleForm,
            rules,
            ruleFormRef,
            submitForm,
            resetForm,
            getPhoneCode,
            count,
            isCountdown,
            goBack,
            rateList,
            amountChange,
            exchangeRate,
            shortName,
            money
        };
    }
};
</script>

<style lang="scss" scoped>
.warning {
    background: #fffbe6;
    border-radius: 2px;
    border: 1px solid #ffe58f;
    width: 1000px;
    padding-top: 7px;
    padding-bottom: 29px;
}
.el-icon-warning {
    color: #faad14;
}
.account {
    /deep/.el-input__inner {
        // background-color: #E8E8E8;
        width: 129px;
    }
}
.account_2 {
    margin-left: 15px;
    /deep/.el-input__inner {
        // background-color: #E8E8E8;
        width: 232px;
    }
}
.tips {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 24px;
}
</style>
