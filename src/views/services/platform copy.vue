<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <el-form-item label="订单编号" prop="orderSn">
                        <el-input clearable v-model="searchForm.orderSn" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item label="售后编号" prop="returnSn">
                        <el-input clearable v-model="searchForm.returnSn" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item prop="orderStatus" label="订单状态">
                        <el-select clearable v-model="searchForm.orderStatus" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.lable" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item prop="returnStatus" label="售后状态">
                        <el-select clearable v-model="searchForm.returnStatus" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in returnTypeList" :key="index" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <div id="elCollapse" class="h-0 hidden">
                <el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <el-form-item label="商品信息" prop="goodKeyword">
                            <el-input clearable v-model="searchForm.goodKeyword" placeholder="Title/TSIN/FNSKU/Batch No./EAN/NPU"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item label="退运单号" prop="deliverySn">
                            <el-input clearable v-model="searchForm.deliverySn" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item label="退款原因" prop="applyReason">
                            <el-select clearable v-model="searchForm.applyReason" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, i) in refundList" :key="i" :label="item.applyReason" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item label="售后类型" prop="returnType">
                            <el-select clearable v-model="searchForm.returnType" :placeholder="$t('pleaseSelect')">
                                <el-option :label="$t('platform.onlyRefund')" value="0"> </el-option>
                                <el-option :label="$t('platform.refundReturn')" value="1"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <el-form-item label="手机号码" prop="phone">
                            <el-input clearable v-model="searchForm.phone" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <el-form-item prop="_tpmTime">
                            <template #label>
                                <el-dropdown @command="handleCommandTimeType">
                                    <span class="green">
                                        {{ timeTypeName }}
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item v-for="item in timeType" :key="item.value" :command="item">{{ item.name }}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </template>
                            <!-- :disabled-date="disabledDate" -->
                            <el-date-picker
                                clearable
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
    </div>
    <div class="p-25 bg-white round-4">
        <div class="flex between vcenter mb-20">
            <div class="flex1">
                <div class="fl mtb-10 mr-30">
                    <el-radio-group v-model="searchForm.orderType" @change="handleChangeType">
                        <el-radio label="">{{ $t("status.all") }}</el-radio>
                        <el-radio label="2">FBT</el-radio>
                        <el-radio label="1">FBM</el-radio>
                    </el-radio-group>
                </div>
                <div class="flex vcenter fl">
                    <div>快速筛选:</div>
                    <el-button class="ml-20" @click="shortcut(1)" plain>{{ $t("orderQuery.waitDelivery") }}({{ applyWaitHandleCount }})</el-button>
                    <el-button @click="shortcut(3)" plain>{{ $t("orderQuery.imminentDelayShipment") }}({{ returnGoodsWaitHandleCount }})</el-button>
                </div>
            </div>
            <div class="flex vcenter">
                <el-button plain @click="bitchDeliver">批量同意退款</el-button>
                <el-button plain @click="bitchSales">批量同意退货</el-button>
                <el-button plain>导出Excel</el-button>
            </div>
        </div>
        <!-- <div v-for="(item, i) in tableList" :key="i"> -->
        <!-- <div class="flex between table_title vcenter">
                <div>
                    <el-checkbox
                        v-model="checkedOrderSn"
                        @change="handleCheckOrderSnChange"
                        :label="item.id"
                        :key="item.id"
                        class="mr-15"
                    >&nbsp;
                    </el-checkbox>
                    {{ item.deliveryType === 1 ? "FBM":item.deliveryType == 2 ? "FBT":""}}<span v-if="item">()</span> 
                    <span class="ml-15">售后编号:</span><span class="ml-15"><text class="blue">{{ item.returnSn }}</text>
                    <text v-clipboard:copy="item.orderSn" v-clipboard:success="onCopy" v-clipboard:error="onError" class="green ml-15 blue cp">复制</text></span>
                    <span class="ml-15">申请时间：{{ item.createTime }}</span>
                    <span class="ml-15">关联订单号：{{ item.orderSn }}</span>
                </div>
                <div><span ><i v-if="item.sourceType == 5" class="el-icon-monitor"></i><i v-if="item.sourceType ==  2 || item.sourceType == 3" class="el-icon-mobile-phone"></i></span></div>
            </div>   @selection-change="handleSelectionChange($event, i)" :default-sort="{ prop: 'creatTime', order: 'descending' }"-->
        <BmTable :data="tableList" class="mb-20" @selection-change="handleSelectionChange">
            <BmTableColumn type="selection"></BmTableColumn>
            <BmTableColumn label="商品信息" min-width="500px">
                <template #header>
                    <div class="flex between">
                        <div style="width: 100px;text-align: left;margin-left: 200px;">商品信息</div>
                        <div style="width: 86px;text-align: left;">单价/数量</div>
                    </div>
                </template>
                <template #default="scope">
                    <div class="flex">
                        <div class="flex between" style="flex-direction: column;align-items: center;">
                            <div>
                                <BmImage class="goodImg" :src="scope.row.productImage" :preview-src-list="[scope.row.productImage]" />
                            </div>
                            <div>
                                {{ scope.row.orderType == 1 ? "FBM" : scope.row.orderType == 2 ? "FBT" : "" }}
                            </div>
                        </div>
                        <div class="ml-20" style="width: 450px;text-align: left;">
                            <div>{{ scope.row.productName }}</div>
                            <div>TSIN: {{ scope.row.skuTsin }}</div>
                            <div>{{ scope.row.productAttr }}</div>
                            <span>售后编号:</span
                            ><span class="ml-15"
                                ><text class="green">{{ scope.row.returnSn }}</text>
                            </span>
                            <span class="ml-15"> <text v-clipboard:copy="scope.row.returnSn" v-clipboard:success="onCopy" v-clipboard:error="onError" class="green ml-15 cp">复制</text></span>
                            <div>申请时间：{{ scope.row.createTime }}</div>
                            <div>关联订单号：{{ scope.row.orderSn }}</div>
                        </div>
                        <!-- <div class="ml-10" style="width: 50px;">
                                <div>₵ {{ scope.row. productPrice }}</div>
                                <div>x {{ scope.row.returnQuantity }}</div>
                            </div> -->
                        <div style="width: 150px;text-align: center;">
                            <div>{{ scope.row.productPrice }}</div>
                            <div>x{{ scope.row.returnQuantity }}</div>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="payAmount" label="交易金额" width="155" align="center" header-align="center"></BmTableColumn>
            <BmTableColumn prop="realAmount" label="退款金额" align="center" header-align="center"></BmTableColumn>
            <BmTableColumn label="买家信息" align="center" min-width="170px" show-overflow-tooltip header-align="center">
                <template #default="scope">
                    <!-- <div><img style="width: 39px;height: 39px;" :src="scope.row.buyerHeadPictureUrl" /><span class="ml-15">{{ scope.row.memberName }}</span></div> -->
                    <div>{{ scope.row.memberId }}</div>
                    <div>{{ scope.row.memberName }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="orderStatus" label="订单状态" align="center" header-align="center">
                <template #default="scope">
                    <div>
                        {{
                            scope.row.orderStatus === 0
                                ? "待付款"
                                : scope.row.orderStatus === 1
                                ? "待发货"
                                : scope.row.orderStatus === 2
                                ? "待收货"
                                : scope.row.orderStatus === 3
                                ? "待评价"
                                : scope.row.orderStatus === 4
                                ? "已完成"
                                : scope.row.orderStatus === 5
                                ? "已取消"
                                : scope.row.orderStatus === 6
                                ? "超时未付款"
                                : scope.row.orderStatus === 7
                                ? "已拒收"
                                : scope.row.orderStatus === 8
                                ? "其他"
                                : ""
                        }}
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="status" label="订单/售后状态" align="center" header-align="center" width="100">
                <template #default="scope">
                    <div class="green">
                        <div>
                            {{
                                scope.row.status === 1
                                    ? "待处理"
                                    : scope.row.status === 3
                                    ? "待收货"
                                    : scope.row.status === 4
                                    ? "待退款"
                                    : scope.row.status === 5
                                    ? "退款成功"
                                    : scope.row.status === 6
                                    ? "关闭售后单"
                                    : scope.row.status === 7
                                    ? "驳回申请"
                                    : scope.row.status === 8
                                    ? "拒收退货商品"
                                    : ""
                            }}
                        </div>
                        <div v-if="scope.row.status === 2">
                            {{ scope.row.deliveryType === 1 ? "待自行寄出" : deliveryType == 2 ? "上门取件" : "" }}
                        </div>
                        <div>
                            {{
                                scope.row.involvedStatus === 1
                                    ? "买家申请品台介入"
                                    : scope.row.involvedStatus === 2
                                    ? "待商家举证"
                                    : scope.row.involvedStatus === 3
                                    ? "等待品台仲裁"
                                    : scope.row.involvedStatus === 4
                                    ? "卖家胜诉退款"
                                    : scope.row.involvedStatus === 5
                                    ? "卖家胜诉退款给卖家"
                                    : scope.row.involvedStatus === 6
                                    ? "买家胜诉退款给买家"
                                    : scope.row.involvedStatus === 7
                                    ? "买家胜诉无需退款"
                                    : scope.row.involvedStatus === 8
                                    ? "均无 责任无需退款"
                                    : scope.row.involvedStatus === 9
                                    ? "均我责任退款给买家"
                                    : ""
                            }}
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn label="退货物流信息" align="center" min-width="100" show-overflow-tooltip header-align="center">
                <template #default="scope">
                    <div>{{ scope.row.deliveryCompany }}</div>
                    <div>{{ scope.row.deliverySn }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn label="操作" align="center" fixed="right" header-align="center">
                <template #default="scope">
                    <div class="green cp" @click="checkDetail(scope.row)">查看详情</div>
                    <div v-if="scope.row.status == 1 && scope.row.returnType == 0" class="green cp" @click="bitchDeliver(scope.row)">同意退款</div>
                    <div v-if="scope.row.status == 1 && scope.row.returnType == 1" class="green cp" @click="bitchSales(scope.row)">同意退货</div>
                </template>
            </BmTableColumn>
        </BmTable>
        <!-- </div> -->
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form label-position="left">
            <el-form-item>
                确定退款给买家吗?
            </el-form-item>
        </el-form>
    </BmDialog>
    <BmDialog v-model:visible="visible_2" :title="title_2" :confirm="confirm_2" :cancel="cancel_2" :width="600">
        <el-form label-position="left">
            <el-form-item>
                确定同意买家退货吗？
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { orderReturnListPage, OrderFindByConditions, orderOrderReturnReturn, orderOrderReturnListCount, orderBatchAgreeReturnGoods } from "@/api/goods";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
export default {
    name: "platform",
    setup(props) {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const router = useRouter();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //搜索
        let searchFormRef = ref(null);

        let tableLoading = ref(true);

        let radio = ref(3);

        let typeName = ref("是否带电");

        let visible = ref(false);
        let visible_2 = ref(false);
        let title = ref("批量同意退款");
        let title_2 = ref("批量同意退货");

        const handleCommand = (item) => {
            typeName.value = item.name;
        };

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        // 订单状态
        let orderStatusList = computed(() => [
            {
                lable: proxy.$t("orderQuery.waitPayment"), // 待付款
                value: 0
            },
            {
                lable: proxy.$t("orderQuery.waitDelivery"), // 待发货
                value: 1
            },
            {
                lable: proxy.$t("orderQuery.waitReceiving"), // 待收货
                value: 2
            },
            // {
            //     lable: proxy.$t("orderQuery.waitingEvaluation"), // 待评价
            //     value: 3
            // },
            {
                lable: proxy.$t("orderQuery.fulfill"), // 已完成
                value: 4
            },
            {
                lable: proxy.$t("orderQuery.canceled"), // 已取消
                value: 5
            },
            {
                lable: proxy.$t("orderQuery.timeoutCancel"), // 超时取消
                value: 6
            },
            {
                lable: proxy.$t("orderQuery.hasRejected"), // 无效订单
                value: 7
            },
            {
                lable: proxy.$t("orderQuery.refuseReceiveGoods"), // 拒收
                value: 8
            }
        ]);

        //创建时间
        let timeTypeValue = "createTime";
        let timeTypeName = ref(proxy.$t("createTime"));
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

        // 售后状态
        let returnTypeList = computed(() => [
            {
                label: proxy.$t("platform.MOProcessed"), // 商家/运营待处理
                value: 1
            },
            {
                label: proxy.$t("platform.backDoor"), // 待自行寄回/待上门
                value: 2
            },
            {
                label: proxy.$t("platform.MOReceived"), // 商家/运营待收货
                value: 3
            },
            {
                label: proxy.$t("platform.forrefund"), // 待退款
                value: 4
            },
            {
                label: proxy.$t("platform.refundSuccess"), // 退款成功
                value: 5
            },
            {
                label: proxy.$t("platform.CloseAfterSalesOrder"), // 关闭售后订单
                value: 6
            },
            {
                label: proxy.$t("platform.MOReApp"), // 商家/运营驳回申请
                value: 7
            },
            {
                label: proxy.$t("platform.MORefuseAcceptReturn"), // 商家/运营拒收退货商品
                value: 8
            }
        ]);

        let searchForm = reactive({
            _tpmTime: [],
            applyReason: "", // 退款原因
            beginTime: "", // 开始时间
            buyerId: "", // 会员id
            deliverySn: "", // 退运单号
            endTime: "", //	结束时间
            goodKeyword: "", //	商品信息
            orderSn: "", //	订单编号
            orderStatus: "", //	订单状态：0->待付款；1->待发货；2->待收货；3->待评价；4->已完成 5->已取消；6->超时取消；7->无效订单；8->已拒收
            orderType: "", // 订单类型1->FBM订单 2->FBT订单
            pageSize: "", // pageSize,示例值(10)
            phone: "", // 手机号
            returnSn: "", //	售后编号
            returnStatus: "", // 售后状态（1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品）
            returnType: "", // 售后类型(是否支持预售( 0否 1是))
            sellerId: "", // 卖家Id	query	false
            storeId: "",
            pageNum: pageNum,
            pageSize: pageSize
        });

        // 获取数据
        let tableList = ref([]);
        let checkedOrderSnList = [];
        let applyWaitHandleCount = ref("");
        let returnGoodsWaitHandleCount = ref("");
        const gettableData = () => {
            tableLoading.value = false;
            orderReturnListPage(searchForm).then((res) => {
                console.log(res);
                tableList.value = res.data.pageDatas.records;
                pageTotal.value = Number(res.data.pageDatas.total);
                applyWaitHandleCount.value = res.data.applyWaitHandleCount;
                returnGoodsWaitHandleCount.value = res.data.returnGoodsWaitHandleCount;
                //checkedOrderSnList = res.data.records.map(item=>item.id);
            });
        };

        //初始化
        const initData = () => {
            console.log("initData");
            gettableData();
        };
        initData();

        // 搜索
        const handelSearch = () => {
            //searchForm.beginTime = dayjs(searchForm._tpmTime && searchForm._tpmTime[0]).format('YYYY-MM-DD HH:mm:ss');
            searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[0]);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[1]);
            //searchForm.endTime =  dayjs(searchForm._tpmTime && searchForm._tpmTime[1]).format('YYYY-MM-DD HH:mm:ss');
            // let time = dayjs(searchForm._tpmTime && searchForm._tpmTime[0]).format('YYYY-MM-DD HH:mm:ss');
            console.log("searchForm", searchForm);
            gettableData();
        };

        // 重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        // 物流筛选
        const handleChangeType = (val) => {
            searchForm.orderType = val;
            initData();
        };

        // 退款原因
        let refundList = ref([]);
        const refundReason = () => {
            OrderFindByConditions({ orderType: 1 }).then((res) => {
                refundList.value = res.data;
            });
        };
        refundReason();

        // 快捷筛选
        const shortcut = (val) => {
            searchForm.returnStatus = val;
            initData();
        };

        let returnListCount = ref({});

        // 售后订单统计
        const orderReturnListCount = () => {
            orderOrderReturnListCount().then((res) => {
                returnListCount.value = res.data;
            });
        };
        orderReturnListCount();

        const handleCommandTimeType = (item) => {
            console.log("val", item);
            timeTypeValue = item.value;
            timeTypeName.value = item.name;
        };

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        const changeDate = (val) => {
            console.log("val", val);
        };

        //表格时间切换
        let columnTime = ref("createTime");
        let columnTimeName = ref(proxy.$t("createTime"));
        const handleCommandColumnTime = (item) => {
            columnTime.value = item.value;
            columnTimeName.value = item.name;
        };

        //当前页
        let currentPage = ref(1);
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

        const onCopy = (e) => {
            proxy.$message.success(e.text);
        };
        const onError = (e) => {
            alert("Failed to copy texts");
        };

        // 全选
        let checkedAll = ref(false);
        let isIndeterminate = ref(false);

        //全选表行
        const multipleTable = ref([]);

        // 已选订单号
        let checkedOrderSn = ref([]);

        // 全选
        const handleCheckAllChange = (val) => {
            checkedOrderSn.value = val ? checkedOrderSnList : [];
            isIndeterminate.value = false;
        };
        // 单选表格
        const handleCheckOrderSnChange = (value) => {
            console.log(value);
            checkedAll.value = checkedOrderSn.value.length === pageSize;
            isIndeterminate.value = checkedOrderSn.value.length > 0 && checkedOrderSn.value.length < pageSize;
        };

        // 选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
            console.log(rows);
        };

        // 批量退款 单选退款
        let ids = [];
        const bitchDeliver = (val) => {
            if (val.id) {
                ids.push(val.id);
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                } else {
                    ids = tableSelectionRows.map((v) => v.id);
                }
            }
            visible.value = true;
        };

        // 批量退款
        const confirm = () => {
            orderOrderReturnReturn((ids = ids)).then((res) => {
                if (res.code === 0) {
                    visible.value = false;
                    proxy.$message.success(res.msg);
                }
            });
        };

        // 批量退货
        let salasId = [];
        const bitchSales = (val) => {
            // if(tableSelectionRows.length == 0) {
            //     proxy.$message.error(proxy.$t("table.selectLeastOne"));
            //     return;
            // }
            // visible_2.value = true;

            if (val.id) {
                salasId.push(val.id);
            } else {
                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                } else {
                    salasId = tableSelectionRows.map((v) => v.id);
                }
            }
            visible_2.value = true;
        };

        // 确认退货
        const confirm_2 = () => {
            // let id = tableSelectionRows.map(v => v.id)
            orderBatchAgreeReturnGoods((ids = salasId)).then((res) => {
                if (res.code === 0) {
                    visible_2.value = false;
                    proxy.$message.success(res.msg);
                    initData();
                }
            });
        };

        const cancel = () => {
            visible.value = false;
        };

        const cancel_2 = () => {
            visible_2.value = false;
        };

        const checkDetail = (row) => {
            router.push({ path: "/services/platformDetail", query: { id: row.id } });
        };

        return {
            searchFormRef,
            searchForm,
            handelSearch,
            resetForm,
            handleCommand,
            handleCommandTimeType,
            shortcuts,
            disabledDate,
            typeName,
            changeDate,
            timeTypeValue,
            timeTypeName,
            timeType,
            isIndeterminate,
            checkedAll,
            handleCheckAllChange,
            currentPage,
            handleSizeChange,
            tableList,
            radio,

            handleCurrentChange,
            columnTime,
            columnTimeName,
            handleCommandColumnTime,
            multipleTable,
            onCopy,
            onError,
            returnTypeList,

            orderStatusList,
            returnTypeList,
            pageNum,
            pageSize,
            pageTotal,
            checkedOrderSn,
            handleCheckAllChange,
            handleChangeType,
            handleCheckOrderSnChange,
            refundList,
            shortcut,
            visible,
            visible_2,
            title,
            title_2,
            bitchDeliver,
            cancel,
            confirm,
            cancel_2,
            confirm_2,
            bitchSales,
            returnListCount,
            checkDetail,
            handleSelectionChange,
            returnGoodsWaitHandleCount,
            applyWaitHandleCount
        };
    }
};
</script>

<style lang="scss" scoped>
.table_title {
    border: 1px solid #edebed;
    border-bottom: none;
    height: 54px;
    padding: 20px 25px 20px 25px;
}
img {
    width: 59px;
    height: 59px;
}
.goodImg {
    width: 59px;
    height: 59px;
}
/deep/ .el-button {
    min-height: 20px;
}
</style>
