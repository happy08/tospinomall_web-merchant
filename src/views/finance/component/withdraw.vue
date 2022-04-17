<template>
    <BmDialog v-model:visible="visible" :title="$t('fund.withdrawDeposit')" :confirm="confirm" :confirmText="$t('depositDetail.confirmWithdrawal')" :cancel="cancel" :width="1000" top="10vh">
        <div class="mb-25">
            <div class="warning">
                <div class="ml-15">
                    <i class="el-icon-warning" style="width: 18px;height: 18px;"></i><span class="ml-15">{{ $t("depositDetail.importantNote") }}:</span>
                </div>
                <div class="ml-40">1、{{ $t("depositDetail.WithdrawalBalance") }}</div>
                <div class="ml-40">2、{{ $t("depositDetail.minWithdrawalAmount", { minWithdrawAmount: ruleForm.minWithdrawAmount, unit: ruleForm.minWithdrawAmountUnit }) }}</div>
                <div class="ml-40">3、{{ $t("depositDetail.CashCycle", { withdrawableCount: ruleForm.withdrawableCount, predictDealTime: ruleForm.predictDealTime }) }}</div>
                <div class="ml-40">4、{{ $t("depositDetail.accountCredited") }}</div>
                <div class="ml-40">5、{{ $t("depositDetail.storeWarrantyAmount") }}: {{ ruleForm.qualityAmount }}{{ ruleForm.qualityAmountUnit }}</div>
            </div>
        </div>
        <div class="bg-white round-4">
            <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="120px" class="demo-ruleForm">
                <el-form-item :label="$t('depositDetail.DefaultWithdrawalAccount')">
                    <div class="flex">
                        <div class="account">
                            <el-select v-model="ruleForm.type" disabled>
                                <el-option label="Payoneer" value="1"></el-option>
                                <el-option :label="$t('depositDetail.bankCreditCard')" value="3"></el-option>
                                <el-option :label="$t('depositDetail.BankDebitCard')" value="2"></el-option>
                            </el-select>
                        </div>
                        <div class="account_2"><el-input disabled v-model="ruleForm.gatheringAccount"></el-input></div>
                    </div>
                </el-form-item>
                <!-- 可提现金额 -->
                <el-form-item :label="$t('depositDetail.WithdrawalAmount')"> {{ ruleForm.withdrawableAmount }} {{ ruleForm.minWithdrawAmountUnit }} </el-form-item>
                <!-- 本次提现金额 -->
                <el-form-item :label="$t('depositDetail.ThisWithdrawalAmount')" prop="amount">
                    <div class="flex vcenter">
                        <div>
                            <el-input
                                @change="amountChange"
                                oninput="value=value.replace(/[^\d^\.]/g,'')"
                                v-model="ruleForm.amount"
                                :min="ruleForm.minWithdrawAmount"
                                :max="ruleForm.withdrawableAmount"
                                maxlength="10"
                            ></el-input>
                        </div>
                        <div class="ml-20 tips">{{ $t("depositDetail.minSingleWithdrawal") }} {{ ruleForm.minWithdrawAmount }} {{ ruleForm.minWithdrawAmountUnit }}</div>
                    </div>
                </el-form-item>
                <el-form-item :label="$t('attribute.currency')">
                    <el-select v-model="ruleForm.rateId">
                        <el-option v-for="(item, i) in rateList" :key="i" :label="item.shortName" :value="item.id"></el-option>
                    </el-select>

                    <div class="tips">{{ exchangeRate }}</div>
                    <div class="tips">{{ $t("depositDetail.drawalCurrencyAmount") }}: {{ money.money1 }} {{ shortName }}</div>
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
                    <div class="orange">{{ $t("depositDetail.applicationWithdrawal", { predictDealTime: ruleForm.predictDealTime }) }}</div>
                </el-form-item>
            </el-form>
        </div>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { financeFindWithdrawDeatil, financeApplyWithdraw, adminUmsCheckCodeGetCurrentPhoneCode, basicsRateFindAll, basicsRateCurrentExchange } from "@/api/goods";
export default {
    name: "withdraw",
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ["reloadData", "update:visible"],

    setup(props, { emit }) {
        let { proxy } = getCurrentInstance();

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
            rateId: "",
            withdrawableCount: "", // 提现次数
            qualityAmountUnit: "", // 店铺质保金额单位
            qualityAmount: "" // 店铺质保金额
        });

        let money = ref({}); // 换算后的金额
        const getrateCurrentExchange = () => {
            if (!ruleForm.amount || isNaN(ruleForm.amount)) {
                ruleForm.amount = 0;
            }
            basicsRateCurrentExchange({ otherCurrency: ruleForm.rateId, num: ruleForm.amount })
                .then((res) => {
                    money.value = res.data;
                })
                .catch(() => {});
        };

        let rateList = ref([]);
        const getRate = () => {
            basicsRateFindAll()
                .then((res) => {
                    rateList.value = res.data;
                    ruleForm.rateId = res.data[0].id;
                })
                .catch(() => {});
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
            if (val < 0) {
                return;
            }
            if (val > ruleForm.withdrawableAmount) {
                ruleForm.amount = ruleForm.withdrawableAmount;
            }
            getrateCurrentExchange();
        };

        const minWithdrawAmount = (rule, value, callback) => {
            var reg = /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;
            if (!reg.test(Number(value))) {
                callback(new Error(proxy.$t("depositDetail.WithdrawalSumDecimals")));
            }
            //<最低提现金额 & >可提现余额
            if (value < ruleForm.minWithdrawAmount || value > 10000000) {
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
                        ruleForm.minWithdrawAmount = res.data.minWithdrawAmount || 0; //	最低提现金额
                        ruleForm.minWithdrawAmountUnit = res.data.minWithdrawAmountUnit; //	最低提现金额单位
                        ruleForm.parentSellerPhone = res.data.parentSellerPhone; //	父级账号手机号码
                        ruleForm.parentSellerPhonePrefix = res.data.parentSellerPhonePrefix; //	父级账号手机号前缀
                        ruleForm.predictDealTime = res.data.predictDealTime; //	平台预计处理时间
                        ruleForm.predictDealTimeUnit = res.data.predictDealTimeUnit; //	平台预计处理时间单位
                        ruleForm.predictRemittanceTime = res.data.predictRemittanceTime; //	平台预计汇款时间
                        ruleForm.predictRemittanceTimeUnit = res.data.predictRemittanceTimeUnit; //	平台预计汇款时间单位
                        ruleForm.type = res.data.type + ""; // 类型1Payoneer，2银行借记
                        ruleForm.withdrawableAmount = res.data.withdrawableAmount || 0; // 可提现余额
                        ruleForm.withdrawableCount = res.data.withdrawableCount; // 提现次数
                        ruleForm.qualityAmountUnit = res.data.qualityAmountUnit; // 店铺质保金额单位
                        ruleForm.qualityAmount = res.data.qualityAmount; // 店铺质保金额
                    }
                })
                .catch(() => {});
        };
        getData();

        let timer = null;
        let count = ref(60);
        const isCountdown = ref(false);
        const getPhoneCode = () => {
            if (isCountdown.value) {
                return;
            }
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
                    proxy.$message.success(res.msg);
                })
                .catch(() => {});
        };

        const confirm = () => {
            ruleFormRef.value.validate((valid) => {
                if (valid) {
                    const loading = proxy.$loading();
                    financeApplyWithdraw({ code: ruleForm.code, amount: ruleForm.amount, rateId: ruleForm.rateId })
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            emit("reloadData");
                            emit("update:visible", false);
                            ruleFormRef.value.resetFields();
                            clearInterval(timer);
                            count.value = 60;
                            isCountdown.value = false;
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                } else {
                    return false;
                }
            });
        };

        const cancel = () => {
            emit("update:visible", false);
            ruleFormRef.value.resetFields();
        };

        return {
            ruleForm,
            rules,
            ruleFormRef,
            confirm,
            cancel,
            getPhoneCode,
            count,
            isCountdown,
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
