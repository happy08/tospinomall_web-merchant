<template>
    <template v-if="!editVisible">
        <div class="top-search-form">
            <BmBreadcrumb />

            <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
                <el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <!-- 申请时间 -->
                        <el-form-item :label="$t('applyTime')" prop="_timeType">
                            <el-date-picker
                                v-model="searchForm._timeType"
                                type="datetimerange"
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
                        <!-- 审核时间 -->
                        <el-form-item :label="$t('auditTime')" prop="_reviewTimeType">
                            <el-date-picker
                                v-model="searchForm._reviewTimeType"
                                type="datetimerange"
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
                        <el-form-item label="TSIN" prop="goodsTsin">
                            <el-input v-model="searchForm.goodsTsin" placeholder="TSIN" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="table-search-btns">
                    <!-- 查询 -->
                    <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                    <!-- 重置 -->
                    <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                </div>
            </el-form>
        </div>

        <div class="p-25 bg-white round-4">
            <div class="flex between mb-10">
                <div class="mb-10 mr-20">
                    <!-- 修复商品 -->
                    <el-button @click="handleRepairGoods" type="primary" icon="el-icon-plus">
                        {{ $t("repairGoods.repairGoods") }}
                    </el-button>

                    <!-- 0->草稿；1->审核中 2->审核失败 3->待出库 4->退货协商中；5->退货出库完成； -->
                    <el-radio-group v-model="searchForm.status" @change="handleChangeStatus" class="mlr-20">
                        <el-radio-button label="">{{ $t("status.all") }}</el-radio-button>
                        <el-radio-button :label="1">{{ $t("status.inReview") }}</el-radio-button>
                        <el-radio-button :label="2">{{ $t("status.pass") }}</el-radio-button>
                        <el-radio-button :label="3">{{ $t("status.reject") }}</el-radio-button>
                    </el-radio-group>
                </div>

                <div class="flex vstart"></div>
            </div>

            <BmTable ref="multipleTable" :data="tableData" v-loading="tableLoading" class="mb-20">
                <BmTableColumn :label="$t('repairGoods.goodsInfo')" align="center" width="350">
                    <template #default="scope">
                        <div class="green">{{ scope.row.goodTitle }}</div>
                        TSIN: {{ scope.row.goodsTsin }}
                    </template>
                </BmTableColumn>
                <!-- 申请修改内容 -->
                <BmTableColumn prop="repairUpdateType" :label="$t('repairGoods.modifyContent')" align="center">
                    <template #default="scope">
                        <div v-for="(item, index) in scope.row.repairUpdateTypeName" :key="index">{{ item }}</div>
                    </template>
                </BmTableColumn>
                <!-- 申请时间 -->
                <BmTableColumn prop="createTime" :label="$t('applyTime')" align="center"></BmTableColumn>
                <!-- 审核时间 -->
                <BmTableColumn prop="reviewTime" :label="$t('auditTime')" align="center"></BmTableColumn>
                <!-- 备注 -->
                <BmTableColumn prop="remark" :label="$t('remark')" width="145" align="center"> </BmTableColumn>
                <!-- 审核意见 -->
                <BmTableColumn prop="reviewOpinion" :label="$t('table.rejectReason')" align="center"></BmTableColumn>
                <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center">
                    <template #default="scope">
                        <!-- 详情  v-permission="'warehouse_returns_detail'" -->
                        <el-button @click.stop="handleDetail(scope.row)" type="text">
                            {{ $t("table.detail") }}
                        </el-button>
                    </template>
                </BmTableColumn>
            </BmTable>

            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
        </div>
    </template>

    <!-- 查看详情 -->
    <Detail v-model:visible="detailVisible" :row="detailRow" />

    <!-- 商品信息修复-->
    <AddEdit v-if="editVisible" v-model:visible="editVisible" @reloadData="initData" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { goodsRepairFindPage } from "@/api/goods";
import { dateShortcuts } from "@/utils/dateShortcuts";
import Detail from "./component/detail";
import AddEdit from "./component/addEdit";

export default {
    name: "repairGoods",
    components: { Detail, AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        //申请修改内容
        const repairUpdateTypeList = [
            {
                name: `sku${proxy.$t("repairGoods.code")}`,
                value: 1
            },
            {
                name: proxy.$t("repairGoods.attributeName"),
                value: 2
            },
            {
                name: proxy.$t("repairGoods.attributeValue"),
                value: 3
            }
        ];
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            _timeType: [], //申请时间
            _reviewTimeType: [],
            status: "",
            pageNum: pageNum,
            pageSize: pageSize
        });
        //搜索
        const handelSearch = () => {
            searchForm.createBeginTime = proxy.utils.formatStandardDate(searchForm._timeType && searchForm._timeType[0], 1) || "";
            searchForm.createEndTime = proxy.utils.formatStandardDate(searchForm._timeType && searchForm._timeType[1], 1) || "";
            searchForm.reviewBeginTime = proxy.utils.formatStandardDate(searchForm._reviewTimeType && searchForm._reviewTimeType[0], 1) || "";
            searchForm.reviewEndTime = proxy.utils.formatStandardDate(searchForm._reviewTimeType && searchForm._reviewTimeType[1], 1) || "";
            initData();
        };
        //重置
        const resetForm = () => {
            searchForm.createBeginTime = searchForm.createEndTime = "";
            searchForm.reviewBeginTime = searchForm.reviewEndTime = "";
            searchFormRef.value.resetFields();
            initData();
        };
        const handleChangeStatus = (val) => {
            searchForm.status = val;
            initData();
        };

        const multipleTable = ref(null);
        let tableLoading = ref(true);
        let tableData = ref([]);

        //获取列表
        const getListPage = () => {
            tableLoading.value = true;
            goodsRepairFindPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in dict.value.returnsStatus) {
                            if (dict.value.returnsStatus[i].value === item.status) {
                                item.returnsStatusName = dict.value.returnsStatus[i].name;
                                break;
                            }
                        }
                        let repairUpdateTypeName = [];
                        let repairUpdateType = item.repairUpdateType.split(",");
                        for (let i in repairUpdateTypeList) {
                            for (let j in repairUpdateType) {
                                if (repairUpdateTypeList[i].value == repairUpdateType[j]) {
                                    repairUpdateTypeName.push(repairUpdateTypeList[i].name);
                                }
                            }
                        }
                        item.repairUpdateTypeName = repairUpdateTypeName;
                        return item;
                    });

                    tableLoading.value = false;
                })
                .catch((err) => {
                    tableLoading.value = false;
                });
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        initData();

        //编辑
        let editVisible = ref(false);
        const handleAddEdit = (type, row) => {
            editVisible.value = true;
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = {
                type: row.repairUpdateType.split(",").map((item) => Number(item)),
                ...JSON.parse(row.dataSource),
                id: row.id
            };
            detailVisible.value = true;
        };

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            initData();
        };

        // 修复商品
        const handleRepairGoods = () => {
            editVisible.value = !editVisible.value;
        };

        return {
            dict,
            initData,
            shortcuts,
            disabledDate,
            pageNum,
            pageSize,
            pageTotal,

            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            handleChangeStatus,

            tableData,
            multipleTable,
            tableLoading,
            detailVisible,
            detailRow,
            handleDetail,
            editVisible,
            handleAddEdit,
            handleSizeChange,
            handleCurrentChange,
            handleRepairGoods
        };
    }
};
</script>
