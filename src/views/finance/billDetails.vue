<template>
    <div class="p-25 mb-25 bg-white round-4 top-search-form">
        <BmBreadcrumb />
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form mb-25">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <el-form-item prop="_tpmTime" :label="$t('billingDetails.paymentReceivingTime')">
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
                    <el-form-item :label="$t('billingDetails.StatementNo')" prop="statementNo">
                        <el-input v-model="searchForm.statementNo" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item prop="associatedNo" :label="$t('billingDetails.AssociatedNumber')">
                        <el-input v-model="searchForm.associatedNo" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item prop="billingStatus" :label="$t('billingDetails.status')">
                        <el-select v-model="searchForm.billingStatus" :placeholder="$t('pleaseSelect')">
                            <el-option value="" :label="$t('all')"></el-option>
                            <!--待结算  -->
                            <el-option value="0" :label="$t('billingDetails.ForThe')"></el-option>
                            <!-- 已结算 -->
                            <el-option value="1" :label="$t('billingDetails.haveAlreadySettled')"></el-option>
                            <!-- 无需结算 -->
                            <el-option value="2" :label="$t('billingDetails.NoSettlement')"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <div id="elCollapse" class="h-0 hidden">
                <el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <el-form-item prop="expensesType" :label="$t('billingDetails.NoSettlement')">
                            <el-select v-model="searchForm.expensesType" :placeholder="$t('pleaseSelect')">
                                <el-option value="" :label="$t('all')"></el-option>
                                <el-option value="1" :label="$t('billingDetails.market')"></el-option>
                                <el-option value="2" :label="$t('billingDetails.refund')"></el-option>
                                <el-option value="3" :label="$t('billingDetails.withdrawDeposit')"></el-option>
                                <el-option value="4" :label="$t('billingDetails.award')"></el-option>
                                <el-option value="5" :label="$t('billingDetails.punish')"></el-option>
                                <el-option value="6" :label="$t('billingDetails.other')"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <el-form-item prop="collectPaymentType" :label="$t('billingDetails.fundFlow')">
                            <el-select v-model="searchForm.collectPaymentType" :placeholder="$t('pleaseSelect')">
                                <!-- 收入 -->
                                <el-option value="1" :label="$t('billingDetails.income')"></el-option>
                                <!-- 支出 -->
                                <el-option value="2" :label="$t('billingDetails.expenditure')"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                <!-- 展开  -->
                <BmCollapse el="#elCollapse" :isShow="false" />
            </div>
        </el-form>
        <div class="flex">
            <div class="item">
                <div class="title">{{ $t("billingDetails.incomeSum") }} (GHC)</div>
                <div class="num">{{ tableData.collectAmount }}</div>
            </div>
            <div class="item item_2">
                <div class="title">{{ $t("billingDetails.IncomeNumber") }}</div>
                <div class="num">{{ tableData.collectCount }}</div>
            </div>
            <div class="item item_2">
                <div class="title">{{ $t("billingDetails.expenditureSum") }} (GHC)</div>
                <div class="num">{{ tableData.paymentAmount }}</div>
            </div>
            <div class="item item_2">
                <div class="title">{{ $t("billingDetails.expenditureNumber") }} ({{ $t("billingDetails.stock") }})</div>
                <div class="num">{{ tableData.paymentCount }}</div>
            </div>
        </div>
    </div>
    <div class="p-25 bg-white round-4">
        <div class="table_title">
            <span>{{ $t("generalUtilityTool") }}:</span><el-button v-permission="'finance_billDetails_export'" @click="handleExportExcel" plain class="ml-15">{{ $t("table.exportExcel") }}</el-button>
        </div>
        <BmTable :data="dataList" ref="multipleTable" @selection-change="handleSelectionChange" tooltip-effect="dark" border style="width: 100%">
            <BmTableColumn type="selection" width="55"></BmTableColumn>
            <BmTableColumn prop="expensesType" :label="$t('billingDetails.inOrOut')" header-align="center" align="center">
                <template #default="scope">
                    {{
                        scope.row.expensesType == 1
                            ? $t("billingDetails.market")
                            : scope.row.expensesType == 2
                            ? $t("billingDetails.refund")
                            : scope.row.expensesType == 3
                            ? $t("billingDetails.withdrawDeposit")
                            : scope.row.expensesType == 4
                            ? $t("billingDetails.award")
                            : scope.row.expensesType == 5
                            ? $t("billingDetails.punish")
                            : scope.row.expensesType == 6
                            ? $t("billingDetails.other")
                            : ""
                    }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="statementNo" :label="$t('billingDetails.StatementNo')" min-width="120" show-overflow-tooltip header-align="center" align="center"></BmTableColumn>
            <BmTableColumn prop="associatedNo" :label="$t('billingDetails.AssociatedNumber')" min-width="120" show-overflow-tooltip header-align="center" align="center"></BmTableColumn>
            <BmTableColumn prop="associatedStatus" :label="$t('billingDetails.StateOfAssociatedDocuments')" min-width="100" header-align="center" align="center">
                <template #default="scope">
                    <!-- {{
                        scope.row.associatedStatus == 0
                            ? $t("billingDetails.waitPayment")
                            : scope.row.associatedStatus == 1
                            ? $t("billingDetails.waitReceiving")
                            : scope.row.associatedStatus == 2
                            ? $t("billingDetails.waitForDelivery")
                            : scope.row.associatedStatus == 4
                            ? $t("billingDetails.fulfill")
                            : scope.row.associatedStatus == 5
                            ? $t("billingDetails.canceled")
                            : scope.row.associatedStatus == 6
                            ? $t("billingDetails.timeoutCancel")
                            : scope.row.associatedStatus == 7
                            ? $t("billingDetails.refuseReceiveGoods")
                            : scope.row.associatedStatus == 8
                            ? $t("billingDetails.other")
                            : scope.row.associatedStatus == 9
                            ? $t("billingDetails.haveEvaluation")
                            : scope.row.associatedStatus == 10
                            ? $t("billingDetails.remainEvaluated")
                            : scope.row.associatedStatus == 11
                            ? $t("billingDetails.haveBeenSigned")
                            : ""
                    }} -->
                    <!-- associatedType	关联单号类型(1订单2售后单3提现4赏罚） -->
                    <div v-if="scope.row.associatedType == 1">
                        {{
                            scope.row.associatedStatus === 0
                                ? $t("orderQuery.waitPayment")
                                : scope.row.associatedStatus === 1
                                ? $t("orderQuery.waitForDelivery")
                                : scope.row.associatedStatus === 2
                                ? $t("orderQuery.waitReceiving")
                                : scope.row.associatedStatus === 3
                                ? $t("orderQuery.waitingEvaluation")
                                : scope.row.associatedStatus === 4
                                ? $t("orderQuery.fulfill")
                                : scope.row.associatedStatus === 5
                                ? $t("orderQuery.canceled")
                                : scope.row.associatedStatus === 6
                                ? $t("platform.OrderTimeoutClose")
                                : scope.row.associatedStatus === 7
                                ? $t("platform.OrderAfterSaleClose")
                                : scope.row.associatedStatus === 8
                                ? $t("platform.rejectClose")
                                : ""
                        }}
                    </div>
                    <div v-if="scope.row.associatedType == 2">
                        {{
                            scope.row.associatedStatus === 1
                                ? $t("billingDetails.MOProcessed")
                                : scope.row.associatedStatus === 3
                                ? $t("billingDetails.MOReceived")
                                : scope.row.associatedStatus === 4
                                ? $t("billingDetails.forrefund")
                                : scope.row.associatedStatus === 5
                                ? $t("billingDetails.refundSuccess")
                                : scope.row.associatedStatus === 6
                                ? $t("billingDetails.CloseAfterSalesOrder")
                                : scope.row.associatedStatus === 7
                                ? $t("billingDetails.MOReApp")
                                : scope.row.associatedStatus === 8
                                ? $t("billingDetails.MORefuseAcceptReturn")
                                : "--"
                        }}
                    </div>
                    <div v-if="scope.row.associatedType == 3">
                        {{
                            scope.row.associatedStatus == 1
                                ? $t("billingDetails.toAudit")
                                : scope.row.associatedStatus == 2
                                ? $t("billingDetails.beingProcessed")
                                : scope.row.associatedStatus == 3
                                ? $t("billingDetails.WithdrawalToComplete")
                                : scope.row.associatedStatus == 4
                                ? $t("billingDetails.reviewTheRejected")
                                : scope.row.associatedStatus == 5
                                ? $t("billingDetails.cancel")
                                : ""
                        }}
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="productAmount" :label="$t('billingDetails.goodsSum')" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn prop="discountAmount" :label="$t('billingDetails.discountsSum')" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn prop="vat" :label="$t('billingDetails.VAT')" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn prop="brokerage" :label="$t('billingDetails.commission')" header-align="center" align="center"> </BmTableColumn>
            <!-- 运费 -->
            <BmTableColumn :label="$t('billingDetails.freight') + '(' + $store.state.app.currencySymbol + ')'" width="70" align="center" prop="freight">
                <template #default="scope">{{ scope.row.freight }}</template>
            </BmTableColumn>
            <BmTableColumn prop="billingStatus" :label="$t('billingDetails.status')" header-align="center" align="center">
                <template #default="scope">
                    {{
                        scope.row.billingStatus == 0
                            ? $t("billingDetails.ForThe")
                            : scope.row.billingStatus == 1
                            ? $t("billingDetails.haveAlreadySettled")
                            : scope.row.billingStatus == 2
                            ? $t("billingDetails.NoSettlement")
                            : ""
                    }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="expensesAmount" :label="$t('billingDetails.PaymentAmount')" header-align="center" align="center">
                <template #default="scope">
                    <div v-if="scope.row.collectPaymentType == 1">{{ scope.row.expensesAmount }}</div>
                    <div v-if="scope.row.collectPaymentType == 2">-{{ scope.row.expensesAmount }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="receivingDate" :label="$t('billingDetails.paymentReceivingTime')" min-width="100" header-align="center" align="center"></BmTableColumn>
            <BmTableColumn prop="remark" :label="$t('billingDetails.remark')" min-width="100" show-overflow-tooltip header-align="center" align="center"></BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { financeBillDetailsFindPageSeller, financeBillDetailsExport } from "@/api/goods";
import dayjs from "dayjs";
import { exportExcel } from "@/utils/";
export default {
    name: "billDetails",
    setup(props) {
        let { proxy } = getCurrentInstance();
        let searchFormRef = ref("");

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        let searchForm = reactive({
            _tpmTime: [],
            associatedNo: null, // 关联单号
            billingStatus: null, // 状态(0待结算1已结算)
            collectPaymentType: null, //	资金流向（1 收入 2 支出）
            expensesType: null, // 收支类型（1销售2退款3提现4奖励5处罚6其他）
            receivingEndDate: null, // 入账日期范围，结束时间
            receivingStartDate: null, // 入账日期范围，开始时间
            sellerId: null, // 卖家ID
            statementNo: null, //	结算单号
            pageNo: pageNum, //	页码
            pageSize: pageSize // 每页显示条数
        });

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

        const tableData = ref({});

        //创建时间
        let timeTypeValue = "createTime";
        let timeTypeName = ref(proxy.$t("createTime"));

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            // return time.getTime() > Date.now();
        };

        const handleCommandTimeType = (item) => {
            console.log("val", item);
            timeTypeValue = item.value;
            timeTypeName.value = item.name;
        };

        const changeDate = (val) => {
            console.log("val", val);
        };

        // table 多选
        const handleSelectionChange = (val) => {
            multipleSelection = val;
        };

        let dataList = ref([]);

        // 获得列表数据
        const getDate = () => {
            const loading = proxy.$loading();
            financeBillDetailsFindPageSeller(searchForm)
                .then((res) => {
                    tableData.value = res.data;
                    dataList.value = res.data.billingDetails.records;
                    pageTotal.value = res.data.billingDetails.total;
                    loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                });
        };
        getDate();

        // 搜索
        const handelSearch = () => {
            searchForm.receivingStartDate = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[0]);
            searchForm.receivingEndDate = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[1]);
            getDate();
        };

        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            getDate();
        };

        //当前页
        const handleCurrentChange = (val) => {
            console.log(val + "页");
            searchForm.pageNo = val;
            getDate();
        };

        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNo = 1;
            searchForm.pageSize = val;
            getDate();
        };

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            financeBillDetailsExport(searchForm)
                .then((res) => {
                    exportExcel("Billing Details", res);
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
            tableData,
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
.table_title {
    text-align: right;
    margin-bottom: 15px;
}
</style>
