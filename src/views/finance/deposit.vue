<template>
    <div class="p-25 mb-25 bg-white round-4">
        <BmBreadcrumb />

        <div class="p-20 mr-20 mb-20 border fl" style="width:400px">
            <div class="flex between mb-8">
                <div class="caption">{{ $t("deposit.StoreDeposit") }} {{ $store.state.app.currencySymbol }}</div>
                <div class="threshold">{{ $t("deposit.thresholdValue") }} {{ tableData.threshold }}</div>
            </div>
            <div class="num mb-40">{{ tableData.securityBalance }}.00</div>
            <div class="flex between">
                <div class="explain">{{ $t("deposit.deposit1") }}</div>
                <div>
                    <!-- 提现 -->
                    <el-button v-if="tableData.securityBalance > tableData.threshold" plain v-permission="'finance_deposit_withdrawDeposit'" @click="withdrawDeposit">{{
                        $t("deposit.withdrawDeposit")
                    }}</el-button>
                    <!-- 充值 -->
                    <el-tooltip class="item" effect="dark" :content="$t('deposit.btnTips')" placement="left">
                        <el-button type="primary" v-permission="'finance_deposit_charge'" @click="charge">{{ $t("deposit.rechargeAmount") }}</el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div class="flex column">
            <div class="flex">
                <div class="flex1 p-10 mb-15 mr-15 bg-light-grey">
                    <div>{{ $t("deposit.deposit2_tip_1") }}</div>
                    <div>{{ $t("deposit.deposit2_tip_2") }}</div>
                    <div>{{ $t("deposit.deposit2_tip_3") }}</div>
                </div>
                <div class="flex1 p-10 mb-15 bg-light-grey">
                    <div>{{ $t("deposit.deposit3_tip_1") }}</div>
                </div>
            </div>
            <div class="flex">
                <div class="flex1 p-10 mr-15 bg-light-grey">{{ $t("deposit.deposit4_tip_1") }}。</div>
                <div class="flex1 p-10 bg-light-grey">
                    <div>{{ $t("deposit.deposit5_tip_1") }}</div>
                    <div>{{ $t("deposit.deposit5_tip_2") }}</div>
                    <div>{{ $t("deposit.deposit5_tip_3") }}</div>
                    <div>{{ $t("deposit.deposit5_tip_4") }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="p-25 bg-white round-4">
        <div class="flex between mb-20">
            <el-radio-group v-model="searchForm.businessType" @change="changeRadio" class="mt-10">
                <el-radio label="">{{ $t("deposit.all") }}</el-radio>
                <el-radio label="2">{{ $t("deposit.withdrawDeposit") }}</el-radio>
                <el-radio label="1">{{ $t("deposit.rechargeAmount") }}</el-radio>
                <el-radio label="3">{{ $t("deposit.withhold") }}</el-radio>
                <el-radio label="4">{{ $t("deposit.abouchement") }}</el-radio>
            </el-radio-group>
            <div>
                <el-button plain @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
            </div>
        </div>
        <BmTable :data="dataList" ref="multipleTable" @selection-change="handleSelectionChange" tooltip-effect="dark" border style="width: 100%">
            <BmTableColumn prop="transactionNo" :label="$t('deposit.transactionNumber')" align="center"></BmTableColumn>
            <BmTableColumn prop="capitalAccount" :label="$t('deposit.capitalAccount')" align="center">
                <template #default="scope">{{ scope.row.capitalAccount == 1 ? $t("deposit.StoreDeposit") : "" }}</template>
            </BmTableColumn>
            <BmTableColumn prop="businessType" :label="$t('deposit.businessType')" align="center">
                <template #default="scope">
                    {{
                        scope.row.businessType == 1
                            ? $t("deposit.rechargeAmount")
                            : scope.row.businessType == 2
                            ? $t("deposit.withdrawDeposit")
                            : scope.row.businessType == 3
                            ? $t("deposit.withhold")
                            : scope.row.businessType == 4
                            ? $t("deposit.abouchement")
                            : ""
                    }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="amount" :label="$t('deposit.Sum')" align="center"></BmTableColumn>
            <BmTableColumn prop="payChannel" :label="$t('deposit.channelDisbursement')" align="center">
                <template #default="scope">
                    {{
                        scope.row.payChannel == 1
                            ? $t("deposit.bankTransfer")
                            : scope.row.payChannel == 2
                            ? $t("deposit.loanAccount")
                            : scope.row.payChannel == 3
                            ? $t("deposit.SystemTopUp")
                            : scope.row.payChannel == 4
                            ? $t("deposit.SystemDeductions")
                            : ""
                    }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="transactionStatus" :label="$t('deposit.transactionStatus')" align="center">
                <template #default="scope">
                    <!-- 充值汇入成功 -->
                    <div v-if="scope.row.transactionStatus == 1">
                        {{ scope.row.businessType == 1 ? $t("deposit.rechargeAmount") : scope.row.businessType == 4 ? $t("deposit.abouchement") : "" }}{{ $t("deposit.success") }}
                    </div>
                    <!-- 提现 扣款 待审核 -->
                    <div v-if="scope.row.transactionStatus == 2">
                        {{ scope.row.businessType == 2 ? $t("deposit.withdrawDeposit") : scope.row.businessType == 3 ? $t("deposit.withhold") : "" }}{{ $t("deposit.toAudit") }}
                    </div>
                    <!-- 提现 扣款 待处理 -->
                    <div v-if="scope.row.transactionStatus == 3">
                        {{ scope.row.businessType == 2 ? $t("deposit.withdrawDeposit") : scope.row.businessType == 3 ? $t("deposit.withhold") : "" }}{{ $t("deposit.pending") }}
                    </div>
                    <!-- 提现 扣款 完成 -->
                    <div v-if="scope.row.transactionStatus == 4">
                        {{ scope.row.businessType == 2 ? $t("deposit.withdrawDeposit") : scope.row.businessType == 3 ? $t("deposit.withhold") : "" }}{{ $t("deposit.accomplish") }}
                    </div>
                    <!-- 提现 扣款 驳回 -->
                    <div v-if="scope.row.transactionStatus == 5">
                        {{ scope.row.businessType == 2 ? $t("deposit.withdrawDeposit") : scope.row.businessType == 3 ? $t("deposit.withhold") : "" }}{{ $t("deposit.reviewTheRejected") }}
                    </div>
                    <!-- 充值 汇入 待确认 -->
                    <div v-if="scope.row.transactionStatus == 6">
                        {{ scope.row.businessType == 1 ? $t("deposit.rechargeAmount") : scope.row.businessType == 4 ? $t("deposit.abouchement") : "" }}{{ $t("deposit.tobeConfirmed") }}
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="createTime" :label="$t('deposit.createTime')" align="center"></BmTableColumn>
            <BmTableColumn prop="completionTime" :label="$t('deposit.completionTime')" align="center"></BmTableColumn>
            <BmTableColumn prop="transactionExplain" :label="$t('deposit.tradeDescription')" align="center">
                <template #default="scope">
                    <div>{{ scope.row.transactionExplain ? scope.row.transactionExplain : "一" }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="remark" :label="$t('deposit.remark')" align="center"></BmTableColumn>
            <BmTableColumn prop="" :label="$t('deposit.operation')" align="center">
                <template #default="scope">
                    <div class="green cp">
                        <el-button v-permission="'finance_deposit_detail'" @click="checkDetail(scope.row)" type="text">{{ $t("deposit.viewDetails") }}</el-button>
                    </div>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
    <!-- 保证金充值 -->
    <BmDialog v-model:visible="visible" :title="$t('deposit.MarginRecharge')" :confirm="confirm" :cancel="cancel" :width="1000">
        <div class="dialog_title mb-30" v-html="$t('deposit.depositDialogTip')"></div>
        <el-form :model="dialogForm" :rules="rules" ref="dialogFormRef" label-position="right" label-width="150px">
            <el-form-item :label="$t('deposit.StoreMarginThreshold', GHC)">
                {{ dialogForm.threshold }}
            </el-form-item>
            <el-form-item :label="$t('deposit.BalanceAfterRecharge')">{{ dialogForm.count ? dialogForm.count : "---" }}</el-form-item>
            <el-form-item :label="$t('deposit.PaymentCurrency')">
                <el-select v-model="dialogForm.shortName" disabled :placeholder="$t('pleaseSelect')">
                    <el-option label="CNY" value="cny"></el-option>
                    <el-option label="USD" value="usd"></el-option>
                    <el-option label="GHS" value="ghs"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('deposit.rechargeAmount')" prop="amount">
                <el-input oninput="value=value.replace(/[^\d^\.]/g,'')" maxlength="10" v-model="dialogForm.amount" :placeholder="$t('deposit.rechargeTip2')" style="width: 300px;"></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
    <!-- 详情 -->
    <BmDialog v-model:visible="detail_visible" :title="$t('deposit.MarginDetails')" :width="500" :showFooter="false">
        <el-form :model="detailForm">
            <el-form-item :label="$t('deposit.detail')">
                <div>{{ detailForm.rejectReason }}</div>
            </el-form-item>
            <el-form-item :label="$t('deposit.picture')">
                <div v-for="(item, i) in detailForm.voucherUrl">
                    <BmImage v-if="item" class="imgSize" :src="item" :preview-src-list="[item]" />
                </div>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { financefindCurrentShopSecurityAmountRecords, basicsRateFindSiteCurrent } from "@/api/goods";
import { useRouter } from "vue-router";
import { exportExcel } from "@/utils/";
export default {
    setup(props) {
        const { proxy } = getCurrentInstance();
        const router = useRouter();
        let tableData = ref({});
        let dataList = ref([]);

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        let visible = ref(false);
        let dialogFormRef = ref(null);

        let detail_visible = ref(false); // 保证金详情

        // 表单form
        let searchForm = reactive({
            businessType: "",
            pageSize: pageSize,
            pageNo: pageNum
        });

        // dialog form
        let dialogForm = reactive({
            threshold: "", // 保证金阀值
            securityBalance: "", // 保证金余额
            amount: "", // 充值金额
            count: "", // 充值后余额
            shortName: "ghs"
        });

        const minWithdrawAmount = (rule, value, callback) => {
            var reg = /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;
            if (!reg.test(Number(value))) {
                callback(new Error(proxy.$t("deposit.rechargeTip1")));
            }
            if (Number(value) == undefined || Number(value) == "") {
                callback(new Error(proxy.$t("deposit.rechargeTip2")));
            } else {
                callback();
            }
        };

        let rules = ref({
            amount: [{ validator: minWithdrawAmount, required: true, trigger: "change" }]
        });

        let multipleSelection = ref([]);
        const handleSelectionChange = (val) => {
            multipleSelection = val;
        };
        const cityOptions = [];
        let checkAll = ref(false);
        let checkedCities = ref([]);
        let cities = cityOptions;
        let isIndeterminate = ref(true);
        const handleCheckAllChange = (val) => {
            checkedCities.value = val ? cityOptions : [];
            isIndeterminate.value = false;
        };
        const handleCheckedCitiesChange = (value) => {
            let checkedCount = value.length;
            checkAll.value = checkedCount === cities.length;
            isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length;
        };

        // 获取汇率
        let shortName = "";
        const getRate = () => {
            basicsRateFindSiteCurrent().then((res) => {
                dialogForm.shortName = res.data.shortName;
                shortName = res.data.shortName;
            });
        };
        getRate();

        const getData = () => {
            financefindCurrentShopSecurityAmountRecords(searchForm).then((res) => {
                tableData.value = res.data;
                pageTotal.value = res.data.list.total;
                dataList.value = res.data.list.records;
                (dialogForm.threshold = res.data.threshold), // 保证金阀值
                    (dialogForm.securityBalance = res.data.securityBalance); // 保证金余额
            });
        };
        getData();

        watch(
            () => dialogForm.amount,
            (nVal) => {
                dialogForm.count = Number(dialogForm.securityBalance) + Number(nVal);
            }
        );

        // 筛选
        const changeRadio = (val) => {
            searchForm.status = val;
            getData();
        };

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            getData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNo = 1;
            searchForm.pageSize = val;
            getData();
        };

        // 充值dialog
        const charge = () => {
            visible.value = true;
        };

        // 确认充值
        const confirm = () => {
            dialogFormRef.value.validate((valid) => {
                if (valid) {
                    router.push({ path: "/finance/cashier", query: { amount: dialogForm.amount, withdrawableAmount: tableData.value.withdrawableAmount, shortName: shortName } });
                } else {
                    console.log("error submit");
                    return false;
                }
            });
        };

        const cancel = () => {
            visible.value = false;
        };

        // 提现
        const withdrawDeposit = () => {
            router.push({ path: "/finance/guaranteeDeposit" });
        };

        let detailForm = ref({});
        const checkDetail = (row) => {
            row.voucherUrl = row.voucherUrl.split(",");
            detailForm.value = row;
            detail_visible.value = true;
        };

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            goodsSellerRecycleExport(searchForm)
                .then((res) => {
                    exportExcel("Margin", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        return {
            multipleSelection,
            tableData,
            handleSelectionChange,
            handleCurrentChange,
            handleSizeChange,
            checkAll,
            checkedCities,
            cities,
            isIndeterminate,
            handleCheckAllChange,
            handleCheckedCitiesChange,
            changeRadio,
            pageNum,
            pageTotal,
            searchForm,
            visible,
            confirm,
            cancel,
            charge,
            dataList,
            dialogForm,
            rules,
            dialogFormRef,
            withdrawDeposit,
            checkDetail,
            detailForm,
            detail_visible,
            handleExportExcel
        };
    }
};
</script>

<style lang="scss" scoped>
.sum {
    .num {
        font-size: 22px;
        font-family: DIN-Bold, DIN;
        font-weight: bold;
        color: #42b7ae;
        line-height: 27px;
    }

    .caption {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 17px;
    }
    .threshold {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
    }
    .explain {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
    }
}
.dialog_title {
    border: 1px solid #f59a23;
    border-radius: 2px;
    padding: 15px;
    background-color: #fff7dd;
}
.imgSize {
    width: 49px;
    height: 49px;
    border-radius: 2px;
}
</style>
