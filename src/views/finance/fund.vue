<template>
    <div class="p-25 mb-25 bg-white round-4">
        <BmBreadcrumb />
        <div class="flex">
            <div class="item">
                <div class="flex between mb-8">
                    <div class="flex">
                        <span class="title_left">{{ $t("fund.paymentAccount") }} (GHC)</span>
                        <span @click="gobillDetails" class="green ml-20 cp">{{ $t("fund.incomeExpensesDetail") }}</span>
                    </div>
                    <span class="title_right">{{ $t("fund.AmountWithdrawn") }}: {{ sellerAccount.haveWithdrawalAmount }}</span>
                </div>
                <div class="count mb-15">{{ sellerAccount.amount }}</div>
                <div class="flex between">
                    <div>
                        <div class="extracted mb-8">{{ $t("fund.WithdrawalAmount") }}: {{ sellerAccount.withdrawableAmount }}</div>
                        <div class="extracted">{{ $t("fund.AmountSettlement") }}: {{ sellerAccount.gatheringAmount }}</div>
                    </div>
                    <div>
                        <!-- 提现 -->
                        <el-button v-permission="'finance_fund_withdrawDeposit'" type="primary" @click="handleWithdraw">{{ $t("fund.withdrawDeposit") }}</el-button>
                    </div>
                </div>
            </div>
            <div class="item ml-50">
                <div class="mb-10">{{ $t("fund.StoreDeposit") }} (GHC)</div>
                <div class="mb-15 num">{{ sellerAccount.securityAmount }}</div>
                <div style="text-align: end;">
                    <!-- 详情 -->
                    <el-button v-permission="'finance_fund_detail'" @click="checkDetail" type="primary" plain>{{ $t("fund.viewDetails") }}</el-button>
                </div>
            </div>
            <div class="item ml-50">
                <div class="mb-10">{{ $t("fund.accountToBeCredited") }}</div>
                <div v-if="sellerGatheringAccount.bankCard">
                    {{ sellerGatheringAccount.type == 2 ? $t("fund.BankDebitCard") : sellerGatheringAccount.type == 3 ? $t("fund.bankCreditCard") : "" }} {{ sellerGatheringAccount.bankCard }}
                </div>
                <div v-else-if="sellerGatheringAccount.payoneerAccount">Payonneer {{ sellerGatheringAccount.payoneerAccount }}</div>
                <div v-else class="mb-15">{{ $t("fund.accountToBeCreditedTips") }}</div>
                <div style="text-align: end;margin-top: 25px;">
                    <!-- 管理收款账户 -->
                    <el-button v-permission="'finance_fund_ManageAccount'" @click="managerCount" type="primary" plain>{{ $t("fund.ManageAccountToBeCredited") }}</el-button>
                </div>
            </div>
        </div>
    </div>
    <div class="p-25 bg-white round-4">
        <div class="flex between mb-25">
            <div class="mt-10">
                <el-radio-group v-model="searchForm.type" @change="changeAccount" class="fl mr-50 mb-10">
                    <el-radio label="">{{ $t("fund.all") }}</el-radio>
                    <el-radio label="2">{{ $t("fund.BankAccount") }}</el-radio>
                    <!-- <el-radio label="1">Payonner{{ $t("fund.account") }}</el-radio> -->
                </el-radio-group>
                <div class="fl">
                    <span class="mr-15">{{ $t("fund.WithdrawalState") }}:</span>
                    <el-radio-group v-model="searchForm.status" @change="changeStatus">
                        <el-radio label="">{{ $t("fund.all") }}</el-radio>
                        <el-radio label="1">{{ $t("fund.toAudit") }}</el-radio>
                        <el-radio label="2">{{ $t("fund.beingProcessed") }}</el-radio>
                        <el-radio label="3">{{ $t("fund.WithdrawalToComplete") }}</el-radio>
                        <el-radio label="4">{{ $t("fund.reviewTheRejected") }}</el-radio>
                        <el-radio label="5">{{ $t("fund.cancel") }}</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="flex vtop">
                <!-- 撤回申请 -->
                <el-button v-permission="'finance_fund_withdrawDeposit'" @click="cancelApply" plain>{{ $t("fund.withdrawApplication") }}</el-button>

                <!-- 导出 -->
                <el-button v-permission="'finance_fund_export'" @click="handleExportExcel" plain>{{ $t("table.exportExcel") }}</el-button>
            </div>
        </div>
        <BmTable :data="listData" ref="multipleTable" @selection-change="handleSelectionChange" tooltip-effect="dark" border style="width: 100%">
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn :label="$t('fund.accountType')" prop="type" header-align="center" align="center">
                <template #default="scope">
                    {{ scope.row.type == 1 ? "Payoneer" : scope.row.type == 2 ? $t("fund.BankAccount") : scope.row.type == 3 ? $t("fund.earnestMoney") : "" }}
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('fund.cashWithdrawalAmount')" prop="amount" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn :label="$t('fund.WithdrawalCurrency')" prop="currency" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn :label="$t('fund.exchangeRate')" prop="rate" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn :label="$t('fund.WithdrawalCurrencyAmount')" prop="currenyAmount" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn :label="$t('fund.WithdrawalState')" prop="status" header-align="center" align="center">
                <template #default="scope">
                    <div>
                        {{
                            scope.row.status == 1
                                ? $t("fund.toAudit") //"待审核"
                                : scope.row.status == 2
                                ? $t("fund.beingProcessed") //"处理中"
                                : scope.row.status == 3
                                ? $t("fund.WithdrawalToComplete") //"提现完成"
                                : scope.row.status == 4
                                ? $t("fund.reviewTheRejected") //"已驳回"
                                : scope.row.status == 5
                                ? $t("fund.cancel") //"已取消"
                                : ""
                        }}
                    </div>
                    <div v-if="scope.row.status == 4">{{ $t("fund.reviewTheRejected") }}: <span @click="checkReason(scope.row)" class="green cp"></span></div>
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('fund.createTime')" prop="createTime" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn :label="$t('fund.completionTime')" prop="completionTime" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn :label="$t('fund.accountToBeCredited')" prop="creditedAccount" header-align="center" align="center"></BmTableColumn>
            <!-- <BmTableColumn header-align="center" align="center">
                <template #default="scope">
                    <div v-if="scope.row.status == 2" @click="revocation(scope.row)">撤回申请</div>
                </template>
            </BmTableColumn> -->
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
    <!-- 撤销申请提现 -->
    <BmDialog v-model:visible="visible" :title="$t('fund.withdrawApplication')" :confirm="confirm" :cancel="cancel" :width="800">
        <div>
            {{ $t("fund.confirmWithdrawApplication") }}
        </div>
    </BmDialog>
    <!-- 提现驳回原因 -->
    <BmDialog v-model:visible="visible_2" :title="$t('fund.reviewTheRejected')" :width="800">
        <el-form :model="dialogForm" label-width="150px" class="demo-ruleForm" label-position="left">
            <el-form-item :label="$t('fund.rejectReason')">
                <div>{{ dialogForm.rejectReason }}</div>
            </el-form-item>
            <el-form-item :label="$t('fund.picture')">
                <template v-for="(item, i) in dialogForm.picUrl" :key="i">
                    <BmImage class="table_img" :src="item" style="width: 39px; height: 39px; border-radius: 2px" :preview-src-list="[item]" />
                </template>
            </el-form-item>
        </el-form>
    </BmDialog>
    <!-- 收款账户验证 -->
    <BmDialog v-model:visible="visible_3" :title="$t('fund.verificationMobilePhone')" :confirm="confirm_3" :cancel="cancel_3" :width="600">
        <el-form class="big-input" :model="phoneForm">
            <el-form-item>
                <div style="margin-top: 15px">
                    <el-input style="width: 500px;height: 48px;" disabled :placeholder="$t('fund.phone')" v-model="phoneForm.phoneNumber" class="input-with-select">
                        <template #prepend>
                            <span class="fs-14"> {{ phoneForm.phonePrefix }}</span>
                        </template>
                    </el-input>
                </div>
            </el-form-item>
            <el-form-item style="margin-bottom: 11px;">
                <div style="margin-top: 15px">
                    <el-input :placeholder="$t('fund.pleaseEnterVerificationCode')" oninput="value=value.replace(/[^\d]/g,'')" maxlength="6" v-model="phoneForm.phoneCode" style="width: 500px;">
                        <template #append>
                            <el-button type="info" @click="getMessage">{{ isCountdown ? count + "s" : $t("fund.getCode") }}</el-button>
                        </template>
                    </el-input>
                </div>
            </el-form-item>
        </el-form>
    </BmDialog>
    <!-- 撤回申请 -->
    <BmDialog v-model:visible="visible_cancel" :title="$t('fund.withdrawApplication')" :confirm="confirm_cancel" :cancel="cancel_cancel" :width="600">
        <div>{{ $t("fund.confirmWithdrawApplication") }}?</div>
    </BmDialog>

    <!-- 提现-->
    <Withdraw v-model:visible="withdrawVisible" @reloadData="initData" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { financefindfindCurrentSellerAccountWithdraws, financeWithdrawLogCancel, financeFindWithdrawDeatil, financeSellerExport } from "@/api/goods";
import { getPhoneCode, adminUmsCheckPhone } from "@/api/user";
import { useRouter } from "vue-router";
import Withdraw from "./component/withdraw";
import { exportExcel } from "@/utils/";
export default {
    name: "fund",
    components: { Withdraw },

    setup(props) {
        const { proxy } = getCurrentInstance();
        const router = useRouter();

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        const searchForm = reactive({
            type: "",
            status: "",
            pageNo: pageNum.value,
            pageSize: pageSize
        });

        const dialogForm = reactive({
            rejectReason: "",
            picUrl: []
        });

        // 短信表单
        const phoneForm = reactive({
            phoneNumber: "",
            phoneCode: "",
            phonePrefix: ""
        });

        let visible = ref(false);
        let visible_2 = ref(false); // 查看驳回原因
        let visible_3 = ref(false); // 收款账户验证

        let listData = ref([]);

        let multipleSelection = ref([]);
        const handleSelectionChange = (row) => {
            multipleSelection.value = row;
        };

        let sellerAccount = ref({});
        let sellerGatheringAccount = ref({});
        const initData = () => {
            financefindfindCurrentSellerAccountWithdraws(searchForm)
                .then((res) => {
                    listData.value = res.data.pageResult.records;
                    sellerAccount.value = res.data.sellerAccount;
                    sellerGatheringAccount.value = res.data.sellerGatheringAccount;
                    pageTotal.value = res.data.pageResult.total;
                })
                .catch(() => {});
        };
        initData();

        // // 提现状态
        // const depositList = computed(()=> [
        //     {
        //         name: proxy.$t(), // 处理中
        //         value: 1,
        //         field: ""
        //     },
        //     {
        //         name: proxy.$t(""), // 手里成功
        //         value: "",
        //         field: ""
        //     }
        // ])

        // // 账户类型
        // const accountType = computed(() => [
        //     {
        //         name: proxy.$t(""), // 银行卡
        //         value: "",
        //         field: ""
        //     },
        //     {
        //         name: proxy.$t(""), // Payonner
        //         value: "",
        //         field: ""
        //     }
        // ])

        const changeStatus = (val) => {
            searchForm.status = val;
            initData();
        };

        const changeAccount = (val) => {
            searchForm.type = val;
            initData();
        };

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNo = 1;
            searchForm.pageSize = val;
            initData();
        };

        // 撤销dialog
        let row = {};
        const revocation = (row) => {
            visible.value = true;
            row = row;
        };

        // 确定撤销
        const confirm = () => {
            let ids = multipleSelection.value.map((v) => v.id).join(",");
            const loading = proxy.$loading();
            financeWithdrawLogCancel({ id: ids })
                .then((res) => {
                    visible.value = false;
                    proxy.$message.success(res.msg);
                    initData();
                    loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                });
        };

        // 取消
        const cancel = () => {
            visible.value = false;
        };

        // 查看驳回原因
        const checkReason = (row) => {
            visible_2.value = true;
            dialogForm.rejectReason = row.rejectReason;
            dialogForm.picUrl = row.picUrl.split(",");
        };

        // 提现页面
        const withdraw = () => {
            if (sellerGatheringAccount.bankCard || sellerGatheringAccount.payoneerAccount) {
                proxy.$message.error(proxy.$t("fund.collectionEmpty"));
                return;
            }
            router.push({ path: "/finance/depositDetail" });
        };

        // 保证金详情
        const checkDetail = () => {
            router.push({ path: "/finance/deposit" });
        };

        // 管理收款账户
        const managerCount = () => {
            visible_3.value = true;
        };

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

            if (phoneForm.phoneNumber.length < 6) {
                proxy.$message.error(proxy.$t("account.phoneWrongFormat")); //您的手机号格式不对
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
                    (count = 60), (isCountdown.value = false);
                }
            }, 1000);

            let data = {
                phone: phoneForm.phoneNumber,
                phonePrefix: phoneForm.phonePrefix,
                userType: "seller"
            };

            // 发送请求
            getPhoneCode(data)
                .then((res) => {
                    phoneForm.phoneCode = res.data;
                    proxy.$message.success(res.msg);
                })
                .catch(() => {});
        };

        // 手机校验  // 管理收款账户
        const confirm_3 = () => {
            if (phoneForm.phoneCode == "") {
                proxy.$message.error(proxy.$t("fund.pleaseEnterVerificationCode")); //请输入验证码
                return;
            }
            let form = {
                code: phoneForm.phoneCode,
                phone: phoneForm.phoneNumber,
                phonePrefix: phoneForm.phonePrefix,
                userType: "seller",
                type: 0
            };
            adminUmsCheckPhone(form)
                .then((res) => {
                    clearInterval(timer);
                    count.value = 60;
                    isCountdown.value = false;
                    visible_3.value = false;
                    window.open("#/finance/accountGather");
                    // router.push({ path: "/finance/accountGather" });
                })
                .catch(() => {});
        };

        const cancel_3 = () => {
            visible_3.value = false;
        };

        const getPhone = () => {
            financeFindWithdrawDeatil().then((res) => {
                phoneForm.phoneNumber = res.data.parentSellerPhone; //	父级账号手机号码
                phoneForm.phonePrefix = res.data.parentSellerPhonePrefix; //	父级账号手机号前缀
            });
        };
        getPhone();

        let visible_cancel = ref(false);

        // 手机校验
        const confirm_cancel = () => {};

        const cancel_cancel = () => {
            visible_3.value = false;
        };

        const cancelApply = () => {
            if (multipleSelection.value.length == 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            visible.value = true;
        };

        const gobillDetails = () => {
            router.push({ path: "/finance/billDetails" });
        };

        //提现
        let withdrawVisible = ref(false);
        const handleWithdraw = () => {
            withdrawVisible.value = true;
        };

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            financeSellerExport(searchForm)
                .then((res) => {
                    exportExcel("Money management", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        return {
            multipleSelection,
            handleSelectionChange,
            handleCurrentChange,
            handleSizeChange,
            pageTotal,
            pageNum,
            listData,
            changeStatus,
            changeAccount,
            searchForm,
            sellerAccount,
            sellerGatheringAccount,
            revocation,
            confirm,
            cancel,
            visible,
            visible_2,
            visible_3,
            dialogForm,
            checkReason,
            withdraw,
            checkDetail,
            confirm_3,
            cancel_3,
            count,
            isCountdown,
            getMessage,
            phoneForm,
            managerCount,
            visible_cancel,
            confirm_cancel,
            cancel_cancel,
            cancelApply,
            gobillDetails,
            handleExportExcel,
            withdrawVisible,
            handleWithdraw,
            initData
        };
    }
};
</script>

<style lang="scss" scoped>
.item {
    width: 100%;
    min-height: 135px;
    border-radius: 2px;
    border: 1px solid #e8e8e8;
    padding: 18px 14px 12px 14px;
    .title_left {
        font-size: 12px;
        font-weight: 500;
        color: #333333;
        line-height: 17px;
    }
    .title_right {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
    }
    .count {
        font-size: 22px;
        font-weight: bold;
        color: #42b7ae;
        line-height: 27px;
    }
    .extracted {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
    }
    .num {
        font-size: 22px;
        font-weight: bold;
        color: #333333;
        line-height: 27px;
    }
}
.table_img {
    width: 49px;
    height: 49px;
}
/deep/ .el-input-group__prepend {
    width: 100px;
}
/deep/.el-select .el-input {
    width: 120px;
}
/deep/.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>
