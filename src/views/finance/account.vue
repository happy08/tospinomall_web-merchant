<template>
    <div class="p-25">
        {{ $t("fund.ManageAccountToBeCredited") }}
    </div>

    <div class="p-25 bg-white round-4">
        <!-- 立即验证 -->
        <div class="flex mb-25">
            <!-- <div class="item">
                <div class="flex between title">
                    <img src="https://img02.mockplus.cn/preview/2021-07-15/6314ada2-81f6-413a-9413-1d076d4642b9/images/%E6%94%B6%E6%AC%BE%E8%B4%A6%E6%88%B7/u11869.png" />
                    <div class="orange" v-if="paynoeer.defaultStatus == 1">{{ $t("accountGather.DefaultWithdrawalAccount") }}</div>
                    <div class="orange" v-if="paynoeer.defaultStatus == 0">{{ $t("accountGather.setDefaultWithdrawalAccount") }}</div>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.accountStatus") }}:</span
                    ><span class="active mlt">{{ paynoeer.payoneerStatus == 0 ? $t("accountGather.nonactivated") : paynoeer.payoneerStatus == 1 ? $t("accountGather.activated") : "" }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">Payonner{{ $t("accountGather.email") }}:</span><span class="mlt">{{ paynoeer.payoneerEmail }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.accountHolder") }}:</span><span class="mlt">{{ paynoeer.holder }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.contactInformation") }}:</span><span class="mlt">{{ paynoeer.phone }}</span>
                </div>
                <div class="flex between">
                    <div class="flex">
                        <span class="left">{{ $t("accountGather.lastValidationTime") }}:</span><span class="mlt">{{ paynoeer.payoneerProofTime }}</span>
                    </div>
                    
                    <div>
                        <el-button type="primary" @click="getData">{{ $t("accountGather.ImmediatelyVerify") }}</el-button>
                    </div>
                </div>
            </div> -->
            <!-- 点击登陆 --><!-- 点击注册 -->
            <!-- <div class="ml-50">
                <div class="flex item_right mb-15">
                    <div>
                        <svg class="icon" aria-hidden="true" style="width: 30px;height: 30px;">
                            <use xlink:href="#iconicon-test"></use>
                        </svg>
                    </div>
                    <div class="ml-15">
                        <div class="mb-10" style="font-size: 18px;">{{ $t("accountGather.importance") }}</div>
                        <div>{{ $t("accountGather.TipInfo") }}</div>
                    </div>
                </div>
                <div class="">
                    <div class="mb-15">
                        <span>{{ $t("accountGather.alreadyHavePayonnerAccount") }}</span>
                        
                        <span class="ml-15 green cp" style="font-size: 20px"
                            ><a class="green" target="blank" :href="loginUrl">{{ $t("accountGather.clickLanding") }}</a></span
                        >
                        <span class="ml-30">{{ $t("accountGather.noPayonnerAccount") }}</span>
                        
                        <span class="ml-20 cp" style="font-size: 20px"
                            ><a class="green" target="blank" :href="url">{{ $t("accountGather.clickRegister") }}</a></span
                        >
                    </div>
                    <div class="mb-15">{{ $t("accountGather.payoneerInfo") }}</div>
                    <div>{{ $t("accountGather.whyUsePayoneer") }}</div>
                    <div>{{ $t("accountGather.payoneerDetail1") }}</div>
                    <div>{{ $t("accountGather.payoneerDetail2") }}</div>
                    <div>{{ $t("accountGather.payoneerDetail3") }}</div>
                </div>
            </div> -->
        </div>

        <div class="flex">
            <div class="item item_2 mb-25">
                <div class="flex between title">
                    <div class="card">{{ $t("accountGather.BankDebitCardInformation") }}</div>
                    <div class="orange" v-if="bankCard_1.defaultStatus === 1">{{ $t("accountGather.DefaultWithdrawalAccount") }}</div>
                    <div class="orange cp" v-if="bankCard_1.defaultStatus === 0" @click="financeSetDefault(bankCard_1.id)">{{ $t("accountGather.setDefaultWithdrawalAccount") }}</div>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.cardholder") }}:</span><span class="active mlt">{{ bankCard_1.holder }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.creditCardNumbers") }}:</span><span class="mlt">{{ bankCard_1.bankCard }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.bankReservesMobileNumber") }}:</span><span class="mlt">{{ bankCard_1.phone }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.BankBranch") }}:</span><span class="mlt">{{ bankCard_1.openingBank }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.LocationBranchOpeningBank") }}:</span><span class="mlt">{{ bankCard_1.openingBankLocation }}</span>
                </div>
                <div class="flex between">
                    <div class="flex">
                        <span class="left">{{ $t("accountGather.licenceOpeningAccounts") }}:</span><img v-for="(item, i) in bankCard_1.licencePic" :key="i" :src="item" class="mlt img_size" />
                    </div>
                    <div>
                        <el-button plain @click="editOrAddCard(bankCard_1.type, 2)">{{ $t("accountGather.edit") }}</el-button>
                    </div>
                </div>
            </div>
            <div class="ml-50 " style="padding-top: 80px;">
                {{ $t("accountGather.BankCardTips") }}
            </div>
        </div>

        <div class="flex">
            <div class="item item_2 item_3">
                <div class="flex between title">
                    <div class="card">{{ $t("accountGather.BankCreditCardInformation") }}</div>
                    <div class="orange" v-if="bankCard_2.defaultStatus === 1">{{ $t("accountGather.DefaultWithdrawalAccount") }}</div>
                    <div class="orange cp" v-if="bankCard_2.defaultStatus === 0" @click="financeSetDefault(bankCard_2.id)">{{ $t("accountGather.setDefaultWithdrawalAccount") }}</div>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.cardholder") }}:</span><span class="active mlt">{{ bankCard_2.holder }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.creditCardNumbers") }}:</span><span class="mlt">{{ bankCard_2.bankCard }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.bankReservesMobileNumber") }}:</span><span class="mlt">{{ bankCard_2.phone }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.BankBranch") }}:</span><span class="mlt">{{ bankCard_2.openingBank }}</span>
                </div>
                <div class="flex mb-10">
                    <span class="left">{{ $t("accountGather.LocationBranchOpeningBank") }}:</span><span class="mlt">{{ bankCard_2.openingBankLocation }}</span>
                </div>
                <div class="flex between">
                    <div class="flex">
                        <span class="left">{{ $t("accountGather.licenceOpeningAccounts") }}:</span><img v-for="(item, i) in bankCard_2.licencePic" :key="i" :src="item" class="mlt img_size" />
                    </div>
                    <div>
                        <el-button plain @click="editOrAddCard(bankCard_2.type, 3)">{{ $t("accountGather.edit") }}</el-button>
                    </div>
                </div>
            </div>
            <div class="ml-50" style="padding-top: 80px;">
                {{ $t("accountGather.BankCardTips") }}
            </div>
        </div>
    </div>
    <BmDialog v-model:visible="visible" :title="$t('accountGather.edit')" :confirm="confirm" :cancel="cancel" :width="800" destroy-on-close>
        <el-form :model="dialogForm" :rules="rules" ref="dialogFormRef" label-position="right" label-width="120px">
            <el-form-item :label="$t('accountGather.accountType') + ':'" prop="type">
                {{ dialogForm.type == 2 ? $t("accountGather.debitCard") : dialogForm.type == 3 ? $t("accountGather.DebitCreditCard") : "" }}
            </el-form-item>
            <el-form-item :label="$t('accountGather.cardholder')" prop="holder">
                <el-input :placeholder="$t('accountGather.enterCardName') + ':'" v-model="dialogForm.holder" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('accountGather.receivingBankAccountNum') + ':'" prop="bankCard">
                <el-input :placeholder="$t('accountGather.enterBankAccountNum')" v-model="dialogForm.bankCard" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('accountGather.bankReservesMobileNumber') + ':'" prop="phone">
                <el-input v-model="dialogForm.phone" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('accountGather.BankBranch') + ':'" prop="openingBank">
                <el-input :placeholder="$t('accountGather.pleaseEnterBranchName')" v-model="dialogForm.openingBank" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('accountGather.BranchAddress') + ':'" prop="openingBankLocation">
                <el-input :placeholder="$t('accountGather.pleaseEnterBranchAddress')" v-model="dialogForm.openingBankLocation" style="width: 500px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('accountGather.licenceOpeningAccounts') + ':'" prop="licencePic">
                <BmUpload @change="onChangeUpload($event)" :multiple="true" :fileList="dialogForm.licencePic" :limit="8" size="xl" />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import {
    financeFindCurrentsOrBySellerId,
    financeGetAuthorizationPage,
    financeGatheringAccount,
    financeGatheringAccountEdit,
    financeGetAuthorizationLoginPage,
    financeSetDefaultWithdrawAccount
} from "@/api/goods";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default {
    name: "accountGather",
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const router = useRouter();

        const userInfo = store.state.user.storeInfo.sellerUser;

        let listData = ref([]);
        let url = ref("");
        let loginUrl = ref("");

        let visible = ref(false);
        let dialogFormRef = ref("");

        let dialogForm = reactive({
            bankCard: "", //	银行卡号
            holder: "", //	持卡人/开户人
            id: "", //	id
            licencePic: [], //	开户许可证
            openingBank: "", //	开户行支行
            openingBankLocation: "", //	开户行支行所在地
            phone: "", //	联系手机号
            sellerId: "", //	卖家id
            storeName: "", //	店铺名称
            type: "" //	类型(1Payoneer，2银行借记卡，3银行信用卡）
        });

        let rules = ref({
            holder: [{ required: true, message: proxy.$t("accountGather.enterCardName"), trigger: "blur" }],
            bankCard: [{ required: true, message: proxy.$t("accountGather.enterBankAccountNum"), trigger: "blur" }],
            phone: [{ required: true, message: proxy.$t("accountGather.enterBankPhoneNum"), trigger: "blur" }],
            openingBank: [{ required: true, message: proxy.$t("accountGather.pleaseEnterBranchName"), trigger: "blur" }],
            openingBankLocation: [{ required: true, message: proxy.$t("accountGather.pleaseEnterBranchAddress"), trigger: "blur" }]
        });

        let paynoeer = {}; // 账户类型1
        let bankCard_1 = ref({}); // 银行借记卡信息
        let bankCard_2 = ref({}); // 银行信用卡信息

        const getData = () => {
            financeFindCurrentsOrBySellerId()
                .then((res) => {
                    listData.value = res.data;
                    res.data.forEach((v, i) => {
                        if (v.type == 1) {
                            paynoeer.value = res.data[i];
                        } else if (v.type == 2) {
                            bankCard_1.value = res.data[i];
                            bankCard_1.value.licencePic = bankCard_1.value.licencePic.split(","); //	开户许可证
                        } else if (v.type == 3) {
                            bankCard_2.value = res.data[i];
                            bankCard_2.value.licencePic = bankCard_2.value.licencePic.split(","); //	开户许可证
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getData();

        // 获取授权链接
        const getPayAuthUrl = () => {
            financeGetAuthorizationPage({ payeeId: userInfo.id })
                .then((res) => {
                    url.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
            financeGetAuthorizationLoginPage({ payeeId: userInfo.id })
                .then((res) => {
                    loginUrl.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getPayAuthUrl();

        // 许可图片
        const onChangeUpload = (fileList) => {
            dialogForm.licencePic = fileList;
        };

        // 编辑或新增
        let editAdd = false;
        const editOrAddCard = (type, v) => {
            visible.value = true;
            if (type == 2 || v == 2) {
                setTimeout(() => {
                    editAdd = true;
                    dialogForm.bankCard = bankCard_1.value.bankCard; //	银行卡号
                    dialogForm.holder = bankCard_1.value.holder; //	持卡人/开户人
                    dialogForm.id = bankCard_1.value.id; //	id
                    dialogForm.openingBank = bankCard_1.value.openingBank; //	开户行支行
                    dialogForm.openingBankLocation = bankCard_1.value.openingBankLocation; //	开户行支行所在地
                    dialogForm.phone = bankCard_1.value.phone; //	联系手机号
                    dialogForm.sellerId = bankCard_1.value.sellerId; //	卖家id
                    dialogForm.storeName = bankCard_1.value.storeName; //	店铺名称
                    dialogForm.type = 2; //	类型(1Payoneer，2银行借记卡，3银行信用卡）
                    //	开户许可证
                    bankCard_1.value.licencePic.forEach((v) => {
                        dialogForm.licencePic.push({ url: v });
                    });
                }, 1000);
            } else if (type == 3 || v == 3) {
                editAdd = true;

                setTimeout(() => {
                    dialogForm.bankCard = bankCard_2.value.bankCard; //	银行卡号
                    dialogForm.holder = bankCard_2.value.holder; //	持卡人/开户人
                    dialogForm.id = bankCard_2.value.id; //	id
                    dialogForm.openingBank = bankCard_2.value.openingBank; //	开户行支行
                    dialogForm.openingBankLocation = bankCard_2.value.openingBankLocation; //	开户行支行所在地
                    dialogForm.phone = bankCard_2.value.phone; //	联系手机号
                    dialogForm.sellerId = bankCard_2.value.sellerId; //	卖家id
                    dialogForm.storeName = bankCard_2.value.storeName; //	店铺名称
                    dialogForm.type = 3; //	类型(1Payoneer，2银行借记卡，3银行信用卡）
                    //	开户许可证
                    bankCard_2.value.licencePic.forEach((v) => {
                        dialogForm.licencePic.push({ url: v });
                    });
                }, 1000);
            }
        };

        const confirm = () => {
            let form = {
                bankCard: dialogForm.bankCard, //	银行卡号
                holder: dialogForm.holder, //	持卡人/开户人
                id: dialogForm.id, //	id
                licencePic: dialogForm.licencePic.map((v) => v.url).join(","), //	开户许可证
                openingBank: dialogForm.openingBank, //	开户行支行
                openingBankLocation: dialogForm.openingBankLocation, //	开户行支行所在地
                phone: dialogForm.phone, //	联系手机号
                sellerId: dialogForm.sellerId, //	卖家id
                storeName: dialogForm.storeName, //	店铺名称
                type: dialogForm.type //	类型(1Payoneer，2银行借记卡，3银行信用卡）
            };

            if (editAdd) {
                // 修改
                dialogFormRef.value.validate((valid) => {
                    if (valid) {
                        const loading = proxy.$loading();
                        financeGatheringAccountEdit(form)
                            .then((res) => {
                                proxy.$message.success(res.msg);
                                visible.value = false;
                                dialogFormRef.value.resetFields();
                                router.go(0);
                                loading.close();
                            })
                            .catch((err) => {
                                loading.close();
                            });
                    } else {
                        console.log("error submit");
                        return false;
                    }
                });
            } else {
                // 新增
                dialogFormRef.value.validate((valid) => {
                    if (valid) {
                        const loading = proxy.$loading();
                        financeGatheringAccount(form)
                            .then((res) => {
                                proxy.$message.success(res.msg);
                                visible.value = false;
                                dialogFormRef.value.resetFields();
                                router.go(0);
                                loading.close();
                            })
                            .catch((err) => {
                                loading.close();
                            });
                    } else {
                        console.log("error submit");
                        return false;
                    }
                });
            }
        };

        const cancel = () => {
            dialogFormRef.value.resetFields();
            visible.value = false;
        };

        const financeSetDefault = (val) => {
            const loading = proxy.$loading();
            financeSetDefaultWithdrawAccount({ id: val })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    getData();
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        return {
            url,
            paynoeer,
            bankCard_1,
            bankCard_2,
            getData,
            dialogForm,
            visible,
            confirm,
            cancel,
            editOrAddCard,
            rules,
            dialogFormRef,
            onChangeUpload,
            loginUrl,
            financeSetDefault
        };
    }
};
</script>

<style lang="scss" scoped>
.item {
    width: 665px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 12px 24px 22px 12px;
    .title {
        margin-bottom: 23px;
    }
    .active {
        color: #0e66de;
    }
    .mlt {
        margin-left: 16px;
    }
    .left {
        display: block;
        width: 100px;
        text-align: end;
    }
}
.item_2 {
    .card {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 22px;
    }
}
.item_right {
    background-color: #fef9ed;
    padding: 15px;
    border-radius: 5px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 59px;
    height: 59px;
}
.tableImg {
    width: 42px;
    height: 42px;
}
.img_size {
    width: 49px;
    height: 49px;
    border-radius: 5px;
}
</style>
