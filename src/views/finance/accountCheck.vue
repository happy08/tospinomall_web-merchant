<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <div class="flex mb-25">
            <div class="item">
                <div class="title">{{ $t("accountChecking.TotalOrderAmount") }}</div>
                <div class="num">{{ countData.orderAmountSum }}</div>
            </div>
            <div class="item item_2">
                <div class="title">{{ $t("accountChecking.costData") }}</div>
                <div class="num">{{ countData.returnOrderAmountSum }}</div>
            </div>
            <div class="item item_2">
                <div class="title">{{ $t("accountChecking.TotalRewardsPenalties") }}</div>
                <div class="num">{{ countData.rewardAmountSum }}</div>
            </div>
            <div class="item item_2">
                <div class="title">{{ $t("accountChecking.AmountWithdrawn") }}</div>
                <div class="num">{{ countData.withdrawAmountSum }}</div>
            </div>
        </div>
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <el-form-item prop="_tpmTime" :label="$t('accountChecking.createTime')">
                        <el-date-picker
                            v-model="searchForm._tpmTime"
                            @change="changeDate"
                            type="daterange"
                            :start-placeholder="$t('startDate')"
                            range-separator="-"
                            :end-placeholder="$t('endDate')"
                            :shortcuts="shortcuts"
                            :disabled-date="disabledDate"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('accountChecking.source')" prop="expensesType">
                        <el-select v-model="searchForm.expensesType" :placeholder="$t('pleaseSelect')">
                            <el-option :label="$t('accountChecking.all')" value=""> </el-option>
                            <el-option :label="$t('accountChecking.market')" value="1"> </el-option>
                            <el-option :label="$t('accountChecking.Refund')" value="2"> </el-option>
                            <el-option :label="$t('accountChecking.withdrawDeposit')" value="3"> </el-option>
                            <el-option :label="$t('accountChecking.award')" value="4"> </el-option>
                            <el-option :label="$t('accountChecking.punish')" value="5"> </el-option>
                            <el-option :label="$t('accountChecking.other')" value="6"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item prop="collectPaymentType" :label="$t('accountChecking.type')">
                        <el-select v-model="searchForm.collectPaymentType" :placeholder="$t('pleaseSelect')">
                            <el-option key="yes" :label="$t('accountChecking.income')" :value="1"> </el-option>
                            <el-option key="no" :label="$t('accountChecking.expenditure')" :value="2"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item prop="associatedNo" :label="$t('accountChecking.AssociatedNumber')">
                        <el-input v-model="searchForm.associatedNo" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                <!-- 展开  -->
                <!-- <BmCollapse el="#elCollapse" :isShow="false" /> -->
            </div>
        </el-form>
    </div>
    <div class="p-25 bg-white round-4">
        <div class="mb-25 tr">
            <el-button v-permission="'finance_accountCheck_export'" @click="handleExportExcel" plain class="ml-15">{{ $t("table.exportExcel") }}</el-button>
        </div>
        <BmTable ref="multipleTable" :data="dataList" @selection-change="handleSelectionChange" style="width: 100%" border tooltip-effect="dark">
            <BmTableColumn type="index" width="55"> </BmTableColumn>
            <BmTableColumn prop="" :label="$t('accountChecking.source')" align="center">
                <template #default="scope">
                    {{
                        scope.row.expensesType == 1
                            ? $t("accountChecking.market") //"销售"
                            : scope.row.expensesType == 2
                            ? $t("accountChecking.Refund") //"退款"
                            : scope.row.expensesType == 3
                            ? $t("accountChecking.withdrawDeposit") //"提现"
                            : scope.row.expensesType == 4
                            ? $t("accountChecking.award") //"奖励"
                            : scope.row.expensesType == 5
                            ? $t("accountChecking.punish") //"处罚"
                            : scope.row.expensesType == 6
                            ? $t("accountChecking.other") //"其他"
                            : ""
                    }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="collectPaymentType" :label="$t('accountChecking.type')" header-align="center" align="center">
                <template #default="scope">
                    {{ scope.row.collectPaymentType == 1 ? $t("accountChecking.income") : scope.row.collectPaymentType == 2 ? $t("accountChecking.expenditure") : "" }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="serialNumber" :label="$t('accountChecking.serialNumber')" show-overflow-tooltip header-align="center" align="center"> </BmTableColumn>
            <BmTableColumn prop="associatedNo" :label="$t('accountChecking.AssociatedNumber')" show-overflow-tooltip header-align="center" align="center"> </BmTableColumn>
            <BmTableColumn prop="transactionAmount" :label="$t('accountChecking.transactionAmount')" header-align="center" align="center">
                <template #default="scope">
                    <div v-if="scope.row.collectPaymentType == 1">{{ scope.row.transactionAmount }}</div>
                    <div v-if="scope.row.collectPaymentType == 2">-{{ scope.row.transactionAmount }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="postTransactionBalance" :label="$t('accountChecking.PostTransactionBalance')" header-align="center" align="center"> </BmTableColumn>
            <BmTableColumn prop="receivingDate" :label="$t('billingDetails.paymentReceivingTime')" header-align="center" align="center"> </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { financeBillDetailsFindCurrentSellerPageSettle, financeSellerBillDetailsExport } from "@/api/goods";
import { exportExcel } from "@/utils/";

export default {
    name: "accountCheck",
    setup(props) {
        let { proxy } = getCurrentInstance();

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        let searchFormRef = ref("");
        let searchForm = reactive({
            _tpmTime: [],
            associatedNo: "", // 关联单号
            collectPaymentType: "", //	类型（1 收入 2 支出）
            createEndTime: "", //	创建时间，结束时间
            createStartTime: "", //	创建时间，开始时间
            expensesType: "", //	来源（1销售2退款3提现4奖励5处罚6其他
            pageNo: pageNum, //	页数
            pageSize: pageSize //	每页显示大小integer(int32)
        });

        // 表单数据
        const countData = ref({});
        const dataList = ref([]);

        const timeType = computed(() => [
            {
                name: proxy.$t("createTime"), //创建时间
                value: "createTime"
            },
            {
                name: proxy.$t("updateTime"), //更新时间
                value: "updateTime"
            },
            {
                name: proxy.$t("auditTime"), //审核时间
                value: "auditTime"
            },
            {
                name: proxy.$t("putawayTime"), //上架时间
                value: "putawayTime"
            },
            {
                name: proxy.$t("soldoutTime"), //下架时间
                value: "soldoutTime"
            }
        ]);

        // 创建时间
        let timeTypeValue = "createTime";
        let timeTypeName = ref(proxy.$t("createTime"));

        // 快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        // 禁用今日以后日期
        const disabledDate = (time) => {
            // return time.getTime() > Date.now();
        };

        const handleCommandTimeType = (item) => {
            console.log("val", item);
            timeTypeValue = item.value;
            timeTypeName.value = item.name;
        };

        const getData = () => {
            financeBillDetailsFindCurrentSellerPageSettle(searchForm)
                .then((res) => {
                    countData.value = res.data;
                    dataList.value = res.data.bills.records;
                    pageTotal.value = res.data.bills.total;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getData();

        // 搜索
        const handelSearch = () => {
            searchForm.createStartTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[0]);
            searchForm.createEndTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[1]);
            getData();
        };

        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            getData();
        };

        // 时间
        const changeDate = (val) => {
            console.log("val", val);
        };

        // table 多选
        const handleSelectionChange = (val) => {
            multipleSelection = val;
        };

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNo = val;
            getData();
        };

        // 每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNo = 1;
            searchForm.pageSize = val;
            getData();
        };

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            financeSellerBillDetailsExport(searchForm)
                .then((res) => {
                    exportExcel("Reconciliation center", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        return {
            searchFormRef,
            searchForm,
            disabledDate,
            shortcuts,
            handleCommandTimeType,
            handelSearch,
            resetForm,
            changeDate,
            timeTypeName,
            timeType,
            countData,
            handleSelectionChange,
            handleCurrentChange,
            handleSizeChange,
            pageNum,
            pageSize,
            pageTotal,
            dataList,
            handleExportExcel
        };
    }
};
</script>

<style lang="scss" scoped>
.item {
    width: 360px;
    height: 100px;
    border: 1px solid #e8e8e8;
    padding: 18px 14px 0px 14px;
    .title {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 17px;
        margin-bottom: 8px;
    }
    .num {
        font-size: 22px;
        font-family: DIN-Bold, DIN;
        font-weight: bold;
        color: #42b7ae;
        line-height: 27px;
    }
}
.item_2 {
    margin-left: 40px;
}
</style>
