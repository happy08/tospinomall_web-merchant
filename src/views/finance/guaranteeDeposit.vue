<template>
    <div class="p-25 mb-25 bg-white round-4">
        <BmBreadcrumb />
        <div class="warning">
            <div class="ml-15">
                <i class="el-icon-warning"></i><span class="ml-15">{{ $t("guarDeposit.importantNote") }}:</span>
            </div>
            <div class="ml-40">1、{{ $t("guarDeposit.depositTips1") }}</div>
            <div class="ml-40">2、{{ $t("guarDeposit.depositTips2") }}</div>
        </div>
    </div>
    <div class="p-25 bg-white round-4">
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="120px" class="demo-ruleForm">
            <el-form-item :label="$t('guarDeposit.DefaultWithdrawalAccount')">
                <div class="flex">
                    <div class="account">
                        <el-select v-model="ruleForm.type" disabled>
                            <el-option label="Payoneer" value="1"></el-option>
                            <el-option :label="$t('guarDeposit.bankCreditCard')" value="2"></el-option>
                            <el-option :label="$t('guarDeposit.BankDebitCard')" value="3"></el-option>
                        </el-select>
                    </div>
                    <div class="account_2"><el-input disabled v-model="ruleForm.gatheringAccount"></el-input></div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('guarDeposit.balance')">
                {{ ruleForm.balanceAmount }}
            </el-form-item>
            <el-form-item :label="$t('guarDeposit.threshold')">
                {{ ruleForm.thresholdAmount }}
            </el-form-item>
            <el-form-item :label="$t('guarDeposit.WithdrawalAmount')" prop="">
                <div class="flex vcenter">
                    <div><el-input v-model="ruleForm.withdrawableAmount" disabled></el-input></div>
                    <!-- <div class="ml-20 tips">单笔提现金额最小为 {{ ruleForm.minWithdrawAmount }} {{ ruleForm.minWithdrawAmountUnit }}</div> -->
                </div>
            </el-form-item>
            <el-form-item :label="$t('guarDeposit.withdrawalPhone')" prop="parentSellerPhone">
                <div class="flex vcenter">
                    <div><el-input v-model="ruleForm.parentSellerPhone" disabled></el-input></div>
                    <div class="ml-20 tips">{{ $t("guarDeposit.superAdministrator") }}</div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('guarDeposit.code')" prop="code">
                <div class="flex">
                    <div><el-input v-model="ruleForm.code" style="width: 167px;"></el-input></div>
                    <div class="green ml-20 cp" @click="getPhoneCode">{{ isCountdown ? count + "s" : $t("guarDeposit.getCode") }}</div>
                </div>
            </el-form-item>
            <el-form-item>
                <!-- 确认提现 -->
                <el-button type="primary" @click="submitForm('ruleForm')">{{ $t("guarDeposit.confirmWithdrawal") }}</el-button>
                <div class="orange">{{ $t("guarDeposit.applicationWithdrawal") }}</div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { financeWithdrawDetail, financeShopSecurityAmountRecode, adminUmsCheckCodeGetCurrentPhoneCode } from "@/api/goods";
export default {
    name: "guaranteeDeposit",
    setup(props) {
        let { proxy } = getCurrentInstance();
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        let ruleFormRef = ref(null);

        let ruleForm = reactive({
            gatheringAccount: "", //	收款账户
            parentSellerPhone: "", //	父级账号手机号码
            parentSellerPhonePrefix: "", //	父级账号手机号前缀
            type: "", // 类型(1Payoneer，2银行借记卡，3银行信用卡
            withdrawableAmount: "", // 可提现金额
            code: "",
            balanceAmount: "", // 总余额
            thresholdAmount: "" // 阀值
        });

        let rules = ref({
            amount: [{ required: true, message: proxy.$t("guarDeposit.fillWithdrawalAmount"), trigger: "blur" }],
            code: [
                { required: true, message: proxy.$t("guarDeposit.VerificationCode"), trigger: "blur" },
                { min: 6, message: proxy.$t("guarDeposit.verificationCode6"), trigger: "blur" }
            ]
        });

        const getData = () => {
            financeWithdrawDetail()
                .then((res) => {
                    (ruleForm.gatheringAccount = res.data.gatheringAccount), //	收款账户
                        (ruleForm.parentSellerPhone = res.data.parentSellerPhone), //	父级账号手机号码
                        (ruleForm.parentSellerPhonePrefix = res.data.parentSellerPhonePrefix), //	父级账号手机号前缀
                        (ruleForm.type = res.data.type + ""), // 类型(1Payoneer，2银行借记，3银行信用卡）
                        (ruleForm.withdrawableAmount = res.data.withdrawableAmount), // 可提现金额
                        (ruleForm.thresholdAmount = res.data.thresholdAmount), // 阀值
                        (ruleForm.balanceAmount = res.data.balanceAmount); // 总余额
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getData();

        let timer = null;
        let count = ref(60);
        const isCountdown = ref(false);
        // 验证码
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
                    (count = 60), (isCountdown.value = false);
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
                    const loading = proxy.$loading();
                    financeShopSecurityAmountRecode({ code: ruleForm.code, amount: ruleForm.amount })
                        .then((res) => {
                            if (res.code == 0) {
                                router.go(-1);
                                proxy.$message.success(res.msg);
                            }
                            if (res.code == 1 || res.code == 10004) {
                                proxy.$message.error(res.msg);
                            }
                            loading.close();
                        })
                        .catch((err) => {
                            console.log(err);
                            loading.close();
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

        return {
            ruleForm,
            rules,
            ruleFormRef,
            submitForm,
            resetForm,
            getPhoneCode,
            count,
            isCountdown
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
