<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <el-radio-group v-model="radio" @change="statusChange" size="medium" class="mb-10">
            <!-- 三月前 近三月 -->
            <el-radio-button label="1">{{ $t("orderQuery.OrdersInTheLastThreeMonths") }}</el-radio-button>
            <el-radio-button label="2">{{ $t("orderQuery.OrderThreeMonthsAgo") }}</el-radio-button>
        </el-radio-group>
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 退货出库单号 -->
                    <el-form-item :label="$t('returns.backReturnSn')" prop="backReturnSn">
                        <el-input v-model="searchForm.backReturnSn" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
                <!-- 商品信息 -->
                <!-- <el-col :md="12" :lg="6">
                    
                    <el-form-item :label="$t('warehouse.info')" prop="goodKeyword">
                        <el-input v-model="searchForm.goodKeyword" placeholder="Title / TSIN / FNSKU / Batch No. / EAN / UPC" clearable></el-input>
                    </el-form-item>
                </el-col> -->
                <!-- SKU商品信息 -->
                <el-col :md="12" :lg="6">
                    <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skeyword">
                        <template #label>
                            <el-select v-model="searchForm.sIndex" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, index) in goodsMultiList" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </template>
                        <el-input v-model="searchForm.skeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" :placeholder="$t('pleaseSelect')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('returns.deliveryTime')" prop="_timeType">
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
                    <!-- 商品标题 -->
                    <el-form-item :label="$t('goodsList.keyword')" prop="titleKeyword">
                        <el-input v-model="searchForm.titleKeyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
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
            <div>
                <div class="fl mb-10 mr-20">
                    <!-- 全选 -->
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleCheckAllChange" class="fl mr-15 mt-10 lh-1">{{ $t("table.checkAll") }} </el-checkbox>
                    <!-- 0->草稿；1->审核中 2->审核失败 3->待出库 4->退货协商中；5->退货出库完成； -->
                    <el-radio-group v-model="searchForm.status" @change="handleChangeStatus" class="fl mlr-20 mtb-10">
                        <el-radio label="">{{ $t("status.all") }}</el-radio>
                        <el-radio :label="1">{{ $t("status.inReview") }}</el-radio>
                        <el-radio :label="3">{{ $t("returns.outbound") }}</el-radio>
                        <el-radio :label="4">{{ $t("returns.negotiation") }}</el-radio>
                        <el-radio :label="5">{{ $t("returns.finish") }}</el-radio>
                        <el-radio :label="0">{{ $t("returns.draft") }}</el-radio>
                        <!-- <el-radio v-for="item in dict.returnsStatus" :key="item.value" :label="item.value">{{ item.name }}</el-radio> -->
                    </el-radio-group>
                    <div class="fl">
                        <!-- 创建退货单 -->
                        <el-button @click="addReturnOrder" v-permission="'warehouse_returns_add'" type="primary" plain icon="el-icon-plus">
                            {{ $t("returns.createReturn") }}
                        </el-button>
                        <!-- 批量提交审核 -->
                        <el-button @click="handleAudit" type="default" v-permission="'warehouse_returns_batchAudit'">
                            {{ $t("warehouse.submitAudit") }}
                        </el-button>
                        <el-button v-permission="'warehouse_returns_exporst'" @click="handleExportExcel" class="mr-15">{{ $t("table.exportExcel") }}</el-button>
                    </div>
                </div>
            </div>
            <div class="flex vstart">
                <!-- 表格选项 -->
                <BmTableOption table="returns" :column="tableColumn" class="ml-10" />
            </div>
        </div>
        <template v-if="tableData && tableData.length > 0">
            <div v-for="item in tableData" :key="item.id">
                <div class="p-15 border bg-light-grey">
                    <el-checkbox v-model="checkedOrderSn" @change="handleCheckOrderSnChange" :label="item.id" :key="item.id" :disabled="item.status !== 0 && item.status !== 2" class="mr-15">
                        {{ $t("returns.backDeliverySn") }}：{{ item.backReturnSn }}
                    </el-checkbox>

                    <span v-if="item.backDeliverySn" class="plr-30"> {{ $t("returns.backReturnSn") }}：{{ item.backDeliverySn }} </span>
                    <span>
                        <text v-clipboard:copy="item.backReturnSn" v-clipboard:success="onCopy" v-clipboard:error="onError" class="green ml-15 green cp">{{ $t("copy") }}</text>
                    </span>
                </div>

                <BmTable ref="multipleTable" :data="[item]" :column="tableColumn" class="mb-20">
                    <BmTableColumn :label="$t('status.status')" align="center">
                        <template #default="scope">
                            {{ scope.row.returnsStatusName }}
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="returnWare" :label="$t('returns.returnWare')" align="center"> </BmTableColumn>
                    <BmTableColumn prop="returnGoodNum" :label="$t('returns.returnGoodNum')" align="center"> </BmTableColumn>
                    <BmTableColumn prop="returnSkuNum" :label="$t('returns.returnSkuNum')" align="center"> </BmTableColumn>
                    <BmTableColumn prop="returnTotalNum" :label="$t('returns.returnTotalNum')" align="center"></BmTableColumn>
                    <BmTableColumn prop="returnWeight" :label="$t('returns.returnWeight')" width="145" align="center"> </BmTableColumn>
                    <BmTableColumn prop="returnBulk" :label="$t('returns.returnBulk')" align="center"></BmTableColumn>
                    <BmTableColumn prop="deliveryTime" :label="$t('returns.deliveryTime')" align="center"></BmTableColumn>
                    <BmTableColumn prop="note" :label="$t('returns.note')" align="center"> </BmTableColumn>

                    <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center">
                        <template #default="scope">
                            <!--status 状态：0->草稿；1->审核中 2->审核驳回 3->待出库 4->退货协商中；5->退货出库完成 -->
                            <el-button v-if="scope.row.status === 0 || scope.row.status === 2" v-permission="'warehouse_returns_edit'" @click.stop="handleAddEdit('edit', scope.row)" type="text">
                                {{ $t("status.edit") }}
                            </el-button>
                            <!-- 详情 -->
                            <el-button @click.stop="handleDetail(scope.row)" v-permission="'warehouse_returns_detail'" type="text">
                                {{ $t("table.detail") }}
                            </el-button>
                            <!-- 删除 -->
                            <el-button @click.stop="handleDelete(scope.row)" v-permission="'warehouse_returns_delete'" type="text">
                                {{ $t("delete") }}
                            </el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </div>
        </template>
        <BmNoData v-else />

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
    <!-- 查看详情 -->
    <Detail v-model:visible="detailVisible" :row="detailRow" />

    <!-- 创建编辑退货单-->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { returnProductSellerListPage, returnProductSellerSubmitCheck, returnProductSellerBatchDelete, returnProductSellerExport } from "@/api/warehouse";
import { dateShortcuts } from "@/utils/dateShortcuts";
import Detail from "./component/detail";
import AddEdit from "./component/addEdit";
import { exportExcel } from "@/utils/";
export default {
    name: "warehouseReturns",
    components: { Detail, AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const route = useRoute();
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

        // 0tsin  1fnsku 2upc 3商品编码 4 商品标题 搜索
        const goodsMultiList = computed(() => [
            {
                name: "Tsin", //tsin
                value: 0
            },
            {
                name: "Fnsku", //fnsku
                value: 1
            },
            {
                name: "UPC", //upc
                value: 2
            },
            {
                name: proxy.$t("releaseGoods.goodsCode"), //商品编码
                value: 3
            }
            // {
            //     name: proxy.$t("goodsList.keyword"), //商品标题
            //     value: 4
            // }
        ]);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            backReturnSn: "",
            goodKeyword: "",
            _timeType: [],
            monthSort: "",
            status: route.query.status * 1 || "",
            pageNum: pageNum,
            pageSize: pageSize,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });
        //搜索
        const handelSearch = () => {
            searchForm.startTime = (searchForm._timeType && searchForm._timeType[0]) || "";
            searchForm.endTime = (searchForm._timeType && searchForm._timeType[1]) || "";
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };
        const handleChangeStatus = (val) => {
            searchForm.status = val;
            initData();
        };

        const multipleTable = ref(null);
        let tableData = ref([]);

        //表格选项的列
        const tableColumn = ["returnWare", "returnGoodNum", "returnSkuNum", "returnTotalNum", "returnWeight", "returnBulk", "deliveryTime", "note"];

        //获取列表
        let checkedOrderSnList = [];
        const getListPage = () => {
            const loading = proxy.$loading();
            returnProductSellerListPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in dict.value.returnsStatus) {
                            if (dict.value.returnsStatus[i].value === item.status) {
                                item.returnsStatusName = dict.value.returnsStatus[i].name;
                                break;
                            }
                        }
                        //全选的值   status 状态：0->草稿；1->审核中 2->审核驳回 3->待出库 4->退货协商中；5->退货出库完成
                        if (item.status === 0 || item.status === 2) {
                            checkedOrderSnList.push(item.id);
                        }
                        return item;
                    });

                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        initData();

        //全选
        let checkedAll = ref(false);
        let isIndeterminate = ref(false);
        // 已选订单号
        let checkedOrderSn = ref([]);
        // 全选
        const handleCheckAllChange = (val) => {
            checkedOrderSn.value = val ? checkedOrderSnList : [];
            isIndeterminate.value = false;
        };
        // 单选表格
        const handleCheckOrderSnChange = () => {
            checkedAll.value = checkedOrderSn.value.length === checkedOrderSnList.length;
            isIndeterminate.value = checkedOrderSn.value.length > 0 && checkedOrderSn.value.length < checkedOrderSnList.length;
        };

        //表格时间切换
        let columnTimeIndex = ref(1);
        const handleCommandColumnTime = (item) => {
            columnTimeIndex.value = item.value;
        };

        //提交审核
        const handleAudit = () => {
            if (checkedOrderSn.value.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            const loading = proxy.$loading();
            returnProductSellerSubmitCheck(checkedOrderSn.value)
                .then((res) => {
                    proxy.$message.success(res.msg);
                    initData();
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
        };

        //删除
        const handleDelete = (row) => {
            const loading = proxy.$loading();
            proxy
                .$confirm(proxy.$t("confirmDelete"), proxy.$t("delete"), {
                    type: "warning"
                })
                .then((_) => {
                    returnProductSellerBatchDelete([row.id])
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            initData();
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                })
                .catch((_) => {
                    loading.close();
                });
        };

        //编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {};
            } else if (type === "edit") {
                editRow.value = row;
            }
            editVisible.value = true;
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = row;
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

        // 三个月前
        let radio = ref("1");
        const statusChange = (e) => {
            console.log(e);
            if (e == 2) {
                searchForm.monthSort = "3_lt";
                initData();
            } else {
                searchForm.monthSort = "3_gt";
                initData();
            }
        };

        const addReturnOrder = () => {
            editVisible.value = !editVisible.value;
        };

        const onCopy = (e) => {
            proxy.$message.success(e.text);
        };
        const onError = (e) => {
            proxy.$message.error("Failed to copy texts");
        };

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            returnProductSellerExport(searchForm)
                .then((res) => {
                    exportExcel("Return management", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
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

            checkedAll,
            isIndeterminate,
            checkedOrderSn,
            handleCheckAllChange,
            handleCheckOrderSnChange,

            tableData,
            columnTimeIndex,
            handleCommandColumnTime,
            tableColumn,
            multipleTable,
            detailVisible,
            detailRow,
            handleDetail,
            editVisible,
            editRow,
            handleAddEdit,
            handleAudit,
            handleDelete,
            handleSizeChange,
            handleCurrentChange,
            statusChange,
            radio,
            addReturnOrder,
            onCopy,
            onError,
            handleExportExcel,
            goodsMultiList
        };
    }
};
</script>
