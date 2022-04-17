<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('warehouse.alert', { num: 25, num2: '10 m3' })" icon="warning" class="mb-20" />
        <el-radio-group v-model="radio" @change="statusChange" size="medium" class="mb-10">
            <!-- 三月前 近三月 -->
            <el-radio-button label="1">{{ $t("orderQuery.OrdersInTheLastThreeMonths") }}</el-radio-button>
            <el-radio-button label="2">{{ $t("orderQuery.OrderThreeMonthsAgo") }}</el-radio-button>
        </el-radio-group>
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 发/补货单号 -->
                    <el-form-item :label="$t('warehouse.odd')" prop="backSn">
                        <el-input v-model="searchForm.backSn" clearable :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <!-- 商品信息 -->
                <!-- <el-col :md="12" :lg="6">
                    
                    <el-form-item :label="$t('warehouse.goodsInfo')" prop="goodKeyword">
                        <el-input v-model="searchForm.goodKeyword" placeholder="Title / TSIN / FNSKU / Batch No. / EAN / UPC" clearable></el-input>
                    </el-form-item>
                </el-col> -->

                <el-col :md="12" :lg="6">
                    <!-- SKU商品信息 -->
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
                    <!-- 创建时间 -->
                    <el-form-item prop="_timeType">
                        <template #label>
                            <el-select v-model="searchForm.timeType" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, index) in timeTypeList" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </template>
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
                    <!-- 头程物流 -->
                    <el-form-item :label="$t('warehouse.logistics')" prop="firstExpress">
                        <el-select v-model="searchForm.firstExpress" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option :label="$t('orderQuery.all')" value=""></el-option>
                            <el-option :label="$t('warehouse.tospinoLogistics')" :value="0"> </el-option>
                            <el-option :label="$t('warehouse.TPL')" :value="1"> </el-option>
                        </el-select>
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
                <!-- 展开
                <BmCollapse el="#elCollapse" :isShow="false" />  -->
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div>
                <!-- 状态0->草稿 1->审核中 2->待发货 3->待收货 4->在运营中心 5->入仓完成 6->驳回 7->已拒签 -->
                <div class="fl mb-10 mr-20">
                    <el-radio-group v-model="searchForm.status" @change="handleChangeStatus" class="fl mlr-20 mtb-10">
                        <el-radio label="">{{ $t("status.all") }}</el-radio>
                        <el-radio v-for="item in dict.shippingStatus" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                    </el-radio-group>
                </div>
                <div class="fl mb-10">
                    <!-- 添加发/补货 -->
                    <el-button @click="handleAddEdit('add')" v-permission="'warehouse_shipmentsPlan_add'" type="primary" plain icon="el-icon-plus">
                        {{ $t("warehouse.add") }}
                    </el-button>
                </div>
            </div>
            <div class="flex vstart">
                <!-- <el-button class="mr-15">立即发货</el-button> -->
                <el-button class="mr-15" @click="handleExportExcel" v-permission="'warehouse_shipmentsPlan_export'">{{ $t("table.exportExcel") }}</el-button>
                <!-- 表格选项 -->
                <BmTableOption table="warehouseTable" :column="tableColumn" class="ml-10" />
            </div>
        </div>
        <template v-if="tableData && tableData.length > 0">
            <div v-for="item in tableData" :key="item.id">
                <div class="p-15 border bg-light-grey flex between">
                    <div>
                        {{ $t("warehouse.odd") }}：{{ item.backSn }}
                        <span class="ml-15 green cp" v-clipboard:copy="item.backSn" v-clipboard:success="onCopy" v-clipboard:error="onError">{{ $t("copy") }}</span>
                        <span class="plr-30"> {{ $t("warehouseTable.createTime") }}：{{ item.createTime }} </span>
                        <span v-if="item.deliverTime"> {{ $t("warehouseTable.deliverTime") }}：{{ item.deliverTime }} </span>
                    </div>
                    <!-- 超标箱数 -->
                    <span v-if="item.excessiveBoxnum" class="red pr-20">{{ $t("warehouseTable.OverweightContainerNum") }}: {{ item.excessiveBoxnum }}</span>
                </div>
                <BmTable ref="multipleTable" :data="[item]" @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowdblClick" :column="tableColumn" class="mb-20">
                    <!-- <BmTableColumn type="selection"> </BmTableColumn> -->
                    <BmTableColumn prop="status" :label="$t('warehouseTable.status')" width="100">
                        <template #default="scope">
                            {{ scope.row.shippingStatusName }}
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="receiveWareAddress" :label="$t('warehouseTable.receiveWare')" min-width="250"> </BmTableColumn>
                    <BmTableColumn prop="totalBoxnum" :label="$t('warehouseTable.totalBoxnum')" align="center">
                        <template #default="scope">
                            <div>{{ scope.row.totalBoxnum }}</div>
                            <div v-if="scope.row.totalMixedBoxnum">({{ $t("warehouse.MixedLoading") }}:{{ scope.row.totalMixedBoxnum }})</div>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="realTotalNum" :label="$t('warehouseTable.realTotalNum')" align="center">
                        <template #default="scope">
                            <div>{{ scope.row.realTotalNum }}</div>
                            <div v-if="scope.row.realMixedNum">({{ $t("warehouse.MixedLoading") }}: {{ scope.row.realMixedNum }})</div>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="totalWeight" :label="$t('warehouseTable.totalWeight')" width="145"> </BmTableColumn>
                    <BmTableColumn prop="realTotalWeight" :label="$t('warehouseTable.realTotalWeight')"> </BmTableColumn>
                    <BmTableColumn prop="totalBulk" :label="$t('warehouseTable.totalBulk')"></BmTableColumn>
                    <BmTableColumn prop="realTotalBulk" :label="$t('warehouseTable.realTotalBulk')"> </BmTableColumn>
                    <BmTableColumn :prop="timeTypeList[columnTimeIndex].field" width="145">
                        <template #header>
                            <el-dropdown @command="handleCommandColumnTime">
                                <span>
                                    {{ timeTypeList[columnTimeIndex].name }}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item v-for="item in timeTypeList" :key="item.field" :command="item">{{ item.name }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="firstExpress" :label="$t('warehouseTable.firstExpress')">
                        <template #default="scope">
                            {{ scope.row.firstExpress == 0 ? $t("warehouse.tospinoLogistics") : $t("warehouse.TPL") }}
                            <br />
                            {{ scope.row.deliverySn }}
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="note" :label="$t('warehouseTable.note')"> </BmTableColumn>
                    <BmTableColumn :label="$t('table.operation')" fixed="right" width="150" align="center">
                        <template #default="scope">
                            <!--status立即发货 0->草稿 1->审核中 2->待发货 3->待收货 4->在运营中心 5->入仓完成 6->驳回 7->已拒签 -->

                            <!-- 立即发货 -->
                            <el-button v-if="scope.row.status === 2" v-permission="'warehouse_shipmentsPlan_Shipping'" @click.stop="handleShipping(scope.row)" type="text">
                                {{ $t("warehouse.delivery") }}
                            </el-button>
                            <!-- 删除草稿 -->
                            <el-button v-if="scope.row.status === 0" v-permission="'warehouse_shipmentsPlan_Delete'" @click.stop="handleDelete(scope.row)" type="text">
                                {{ $t("delete") }}
                            </el-button>
                            <!-- 编辑 -->
                            <el-button
                                v-if="scope.row.status === 0 || scope.row.status === 6 || scope.row.status === 7"
                                v-permission="'warehouse_shipmentsPlan_edit'"
                                @click.stop="handleAddEdit('edit', scope.row)"
                                type="text"
                            >
                                {{ $t("table.edit") }}
                            </el-button>
                            <!-- 提交审核 -->
                            <el-button
                                v-if="scope.row.status === 0 || scope.row.status === 6 || scope.row.status === 7"
                                v-permission="'warehouse_shipmentsPlan_subAudit'"
                                @click.stop="handleAudit(scope.row)"
                                type="text"
                            >
                                {{ $t("warehouse.submitAudit") }}
                            </el-button>
                            <!-- 撤销计划 -->
                            <el-button v-if="scope.row.status === 1" @click.stop="handleCancel(scope.row)" v-permission="'warehouse_shipmentsPlan_cancel'" type="text">
                                {{ $t("warehouse.cancelPlan") }}
                            </el-button>

                            <!-- 详情 -->
                            <el-button @click.stop="handleDetail(scope.row)" v-permission="'warehouse_shipmentsPlan_detail'" type="text">
                                {{ $t("table.detail") }}
                            </el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </div>
        </template>
        <BmNoData v-else />

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />

    <!-- 立即发货 -->
    <Shipping v-model:visible="shippingVisible" :row="shippingRow" @reloadData="initData" />

    <!-- 查看详情 -->
    <Detail v-if="detailVisible" v-model:visible="detailVisible" :row="detailRow" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { productSellerListPage, productDelete, productSellerUpdateStatus, productSellerExport } from "@/api/warehouse";
import { basicsFbtGetLimitMapInner } from "@/api/goods";
import { dateShortcuts } from "@/utils/dateShortcuts";
import AddEdit from "./component/addEdit";
import Shipping from "./component/shipping";
import Detail from "./component/detail";
import { exportExcel } from "@/utils/";
export default {
    name: "warehouseShipmentsPlan",
    components: { AddEdit, Shipping, Detail },
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

        //时间类型 0创建时间 1提审时间 2发货时间 3入库时间 4签收时间 5最后提审时间 6最新审核时间
        const timeTypeList = computed(() => [
            {
                name: proxy.$t("warehouseTable.createTime"), //创建时间
                value: 0,
                field: "createTime"
            },
            {
                name: proxy.$t("warehouseTable.firstSubmitExamineTime"), //提审时间
                value: 1,
                field: "firstSubmitExamineTime"
            },
            {
                name: proxy.$t("warehouseTable.deliverTime"), //发货时间
                value: 2,
                field: "deliverTime"
            },
            {
                name: proxy.$t("warehouseTable.putInstorgeTime"), //入库时间
                value: 3,
                field: "putInstorgeTime"
            },
            {
                name: proxy.$t("warehouseTable.signTime"), //签收时间
                value: 4,
                field: "signTime"
            },
            {
                name: proxy.$t("warehouseTable.submitExamineTime"), //最后提审时间
                value: 5,
                field: "submitExamineTime"
            },
            {
                name: proxy.$t("warehouseTable.examineTime"), //最后审核时间
                value: 6,
                field: "examineTime"
            }
        ]);

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

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            backSn: "",
            goodKeyword: "",
            _timeType: [],
            timeType: 0,
            firstExpress: "",
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
            searchForm.beginTime = (searchForm._timeType && searchForm._timeType[0]) || "";
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
        const tableColumn = [
            "status",
            "receiveWare",
            "totalBoxnum",
            "realTotalNum",
            "totalWeight",
            "realTotalWeight",
            "totalBulk",
            "realTotalBulk",
            "createTime",
            "deliverTime",
            "firstSubmitExamineTime",
            "putInstorgeTime",
            "submitExamineTime",
            "examineTime",
            "signTime",
            "firstExpress",
            "note",
            "receiveWareAddress"
        ];

        const getbasicsFbtGetLimitMapInner = () => {
            basicsFbtGetLimitMapInner().then((res) => {
                console.log(res);
            });
        };
        getbasicsFbtGetLimitMapInner();

        //获取列表
        const getListPage = () => {
            const loading = proxy.$loading();
            productSellerListPage(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        for (let i in dict.value.shippingStatus) {
                            if (dict.value.shippingStatus[i].value === item.status) {
                                item.shippingStatusName = dict.value.shippingStatus[i].name;
                                break;
                            }
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

        //表格时间切换
        let columnTimeIndex = ref(3);
        const handleCommandColumnTime = (item) => {
            columnTimeIndex.value = item.value;
        };

        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
        };

        //点击单行-选择
        const handleRowClick = (row) => {
            // const index = tableSelectionRows.findIndex((item) => item.id === row.id);
            // if (index > -1) {
            //     tableSelectionRows.push(row);
            // } else {
            //     tableSelectionRows.splice(index, 1);
            // }
            multipleTable.value.toggleRowSelection(row);
        };

        //双击行编辑
        const handleRowdblClick = (row) => {
            editRow.value = row;
            editVisible.value = true;
        };

        //新增编辑
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

        //立即发货
        let shippingVisible = ref(false);
        let shippingRow = ref({});
        const handleShipping = (row) => {
            shippingRow.value = row;
            shippingVisible.value = true;
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = row;
            detailVisible.value = true;
        };

        //删除草稿
        const handleDelete = (row) => {
            const loading = proxy.$loading();
            proxy
                .$confirm(proxy.$t("confirmDelete"))
                .then(() => {
                    productDelete(row.id)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            initData();
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                })
                .catch(() => {
                    loading.close();
                });
        };

        //提交审核
        const handleAudit = (row) => {
            const loading = proxy.$loading();
            productSellerUpdateStatus({ id: row.id, status: 1 })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    initData();
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
        };

        //撤销计划
        const handleCancel = (row) => {
            const loading = proxy.$loading();
            productSellerUpdateStatus({ id: row.id, status: 0 })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    initData();
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
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

        const onCopy = (e) => {
            proxy.$message.success(e.text);
        };
        const onError = (e) => {
            proxy.$message.error("Failed to copy texts");
        };

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            productSellerExport(searchForm)
                .then((res) => {
                    exportExcel("Release plan", res);
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
            timeTypeList,

            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            handleChangeStatus,
            tableData,
            columnTimeIndex,
            handleCommandColumnTime,
            tableColumn,
            multipleTable,
            handleSelectionChange,
            handleRowClick,
            handleRowdblClick,
            editVisible,
            editRow,
            handleAddEdit,
            shippingVisible,
            shippingRow,
            handleShipping,
            detailVisible,
            detailRow,
            handleDetail,
            handleDelete,
            handleAudit,
            handleCancel,
            handleSizeChange,
            handleCurrentChange,
            statusChange,
            radio,
            onCopy,
            onError,
            handleExportExcel,
            goodsMultiList
        };
    }
};
</script>
