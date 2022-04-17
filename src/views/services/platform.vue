<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 订单编号 -->
                    <el-form-item :label="$t('platform.orderNumber')" prop="orderSn">
                        <el-input clearable v-model="searchForm.orderSn" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 售后编号 -->
                    <el-form-item :label="$t('platform.returnNumber')" prop="returnSn">
                        <el-input clearable v-model="searchForm.returnSn" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 订单状态 -->
                    <el-form-item prop="orderStatus" :label="$t('platform.orderStatus')">
                        <el-select clearable v-model="searchForm.orderStatus" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.lable" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 售后状态 -->
                    <el-form-item prop="returnStatus" :label="$t('platform.returnStatus')">
                        <el-select clearable v-model="searchForm.returnStatus" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in returnTypeList" :key="index" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <div id="elCollapse" class="h-0 hidden">
                <el-row :gutter="24">
                    <!-- 商品信息 -->
                    <!-- <el-col :md="12" :lg="6">
                        
                        <el-form-item :label="$t('platform.goodsInfo')" prop="goodKeyword">
                            <el-input clearable v-model="searchForm.goodKeyword" placeholder="Title/TSIN/FNSKU/Batch No./EAN/NPU"></el-input>
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
                        <!-- 退运单号 -->
                        <el-form-item :label="$t('platform.Returnawb')" prop="deliverySn">
                            <el-input clearable v-model="searchForm.deliverySn" :placeholder="$t('pleaseEnter')"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <!-- 退款原因 -->
                        <el-form-item :label="$t('platform.returnReason')" prop="applyReason">
                            <el-select clearable v-model="searchForm.applyReason" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, i) in refundList" :key="i" :label="item.applyReason" :value="item.applyReason"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <!-- 售后类型 -->
                        <el-form-item :label="$t('platform.returnType')" prop="returnType">
                            <el-select clearable v-model="searchForm.returnType" :placeholder="$t('pleaseSelect')">
                                <el-option :label="$t('platform.onlyRefund')" value="0"> </el-option>
                                <el-option :label="$t('platform.refundReturn')" value="1"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <!-- 手机号码 -->
                        <el-form-item :label="$t('platform.phone')" prop="phone">
                            <el-input clearable v-model="searchForm.phone" :placeholder="$t('pleaseEnter')"></el-input>
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
                        <!-- 商品标题 -->
                        <el-form-item :label="$t('goodsList.keyword')" prop="titleKeyword">
                            <el-input v-model="searchForm.titleKeyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
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
            <div class="flex vcenter">
                <!-- 全选 -->
                <div>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleCheckAllChange" class="mr-15">{{ $t("table.checkAll") }} </el-checkbox>
                </div>
                <div class="fl mtb-10 mr-30">
                    <el-radio-group v-model="searchForm.orderType" @change="handleChangeType">
                        <el-radio label="">{{ $t("status.all") }}</el-radio>
                        <el-radio label="2">FBT</el-radio>
                        <el-radio label="1">FBM</el-radio>
                    </el-radio-group>
                </div>
                <div class="flex vcenter fl">
                    <!-- 快速筛选 -->
                    <div>{{ $t("rapidCull") }}:</div>
                    <el-button class="ml-20" @click="shortcut(1)" plain>{{ $t("orderQuery.waitDelivery") }}({{ returnListCount.pendingCount }})</el-button>
                    <el-button @click="shortcut(3)" plain>{{ $t("orderQuery.imminentDelayShipment") }}({{ returnListCount.receivedCount }})</el-button>
                </div>
            </div>
            <div class="flex vcenter">
                <!-- 批量同意仅退款 -->
                <el-button plain v-permission="'return_platform_batchOnlyRefund'" @click="bitchDeliver">{{ $t("platform.batchOnlyRefund") }}</el-button>
                <!-- 批量同意退货退款 -->
                <el-button plain v-permission="'return_platform_BatchAgreeReturnRefund'" @click="bitchSales">{{ $t("platform.BatchAgreeReturnRefund") }}</el-button>
                <!-- 导出Excel -->
                <el-button plain v-permission="'return_platform_exportExcel'" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
            </div>
        </div>
        <template v-if="tableList && tableList.length > 0">
            <!-- 多商品售后单 -->
            <div v-for="(item, index) in tableList" :key="index">
                <div class="flex between vcenter p-20 bg-light-grey border">
                    <div>
                        <el-checkbox v-model="checkedOrderSn" @change="handleCheckOrderSnChange" :label="item.id" :key="item.id" class="mr-15">&nbsp; </el-checkbox>
                        {{ item.orderType == 1 ? "FBM" : item.orderType == 2 ? "FBT" : "" }}<span v-if="item">({{ item.orderReturnItems.length }})</span>
                        <span class="ml-15">{{ $t("platform.returnNumber") }}:</span
                        ><span class="ml-15"
                            ><text class="green">{{ item.returnSn }}</text>

                            <text v-clipboard:copy="item.returnSn" v-clipboard:success="onCopy" v-clipboard:error="onError" class="green ml-15 green cp">{{ $t("copy") }}</text></span
                        >
                        <!--申请时间  -->
                        <span class="iblock  ml-30">{{ $t("platform.timeApplication") }}： {{ item.createTime }}</span>
                        <!-- 关联订单编号 -->
                        <span v-if="item.orderSn" class="iblock ml-25">{{ $t("platform.AssociatedOrderNumber") }}：{{ item.orderSn }}</span>
                    </div>
                    <div>
                        <span
                            ><i v-if="item.sourceType == 4" class="el-icon-monitor"></i><i v-if="item.sourceType == 1 || item.sourceType == 2 || item.sourceType == 3" class="el-icon-mobile-phone"></i
                        ></span>
                    </div>
                </div>
                <BmTable :data="[item]" class="mb-20" header-align="center">
                    <!-- 商品信息 -->
                    <BmTableColumn min-width="500px">
                        <template #header>
                            <div class="flex between">
                                <div style="width: 100px;text-align: left;margin-left: 200px;">{{ $t("platform.goodsInfo") }}</div>
                                <!-- 单价/数量 -->
                                <div style="width: 86px;text-align: left;">{{ $t("platform.PriceQuantity") }}</div>
                            </div>
                        </template>
                        <template #default="scope">
                            <div :class="scope.row.orderReturnItems.length > 2 && item.checked ? 'default' : ''">
                                <div v-for="(ison, i) in scope.row.orderReturnItems" :key="i">
                                    <div class="flex mb-10 p-5" :style="i !== 0 ? 'border-top: 1px solid #ebeef5;' : ''">
                                        <div>
                                            <BmImage class="goodImg" :src="ison.productImage" :preview-src-list="[ison.productImage]" />
                                        </div>
                                        <div class="ml-20" style="width: 450px;text-align: left;">
                                            <div class="font-flow green">{{ ison.productName }}</div>
                                            <!-- 商家编码 -->
                                            <!-- <div>
                                                {{ $t("orderQuery.MerchantCode") }}:
                                                {{ scope.row.storeCode }}
                                            </div> -->
                                            <div>
                                                <span>TSIN: {{ ison.skuTsin }}</span
                                                ><span style="margin-left: 100px;">{{ ison.goodAttr }}</span>
                                            </div>
                                            <div>{{ ison.productAttr }}</div>
                                            <!-- <div>FNSKU: {{ ison.skuFnsku }}</div> -->
                                        </div>
                                        <div class="flex center ml-30">
                                            <div>{{ $store.state.app.currencySymbol }}{{ ison.productPrice }}</div>
                                            <div>x {{ ison.returnQuantity }}</div>
                                        </div>
                                        <!-- 更多 -->
                                        <div
                                            v-if="scope.row.orderReturnItems.length > 2 && item.checked && i === 1"
                                            class="green cp"
                                            style="position: absolute;bottom: 20px;right: 0;"
                                            @click="item.checked = !item.checked"
                                        >
                                            {{ $t("orderQuery.more") }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 交易金额 -->
                    <BmTableColumn prop="payAmount" :label="$t('platform.transactionAmount') + $store.state.app.currencySymbol" width="155" align="center" header-align="center"></BmTableColumn>
                    <!-- 退款金额 -->
                    <BmTableColumn prop="returnAmount" :label="$t('platform.refundAmount') + $store.state.app.currencySymbol" align="center" header-align="center"></BmTableColumn>
                    <!-- 买家信息 -->
                    <BmTableColumn :label="$t('platform.sellerInfo')" align="center" min-width="170px" show-overflow-tooltip header-align="center">
                        <template #default="scope">
                            <!-- <div><img style="width: 39px;height: 39px;" :src="scope.row.buyerHeadPictureUrl" /><span class="ml-15">{{ scope.row.memberName }}</span></div> -->
                            <div>{{ scope.row.memberId }}</div>
                            <div>{{ scope.row.memberName }}</div>
                        </template>
                    </BmTableColumn>
                    <!-- 订单状态 -->
                    <BmTableColumn prop="orderStatus" :label="$t('platform.orderStatus')" align="center" header-align="center">
                        <template #default="scope">
                            <div>
                                {{
                                    scope.row.orderStatus === 0
                                        ? $t("platform.waitPayment") //"待付款"
                                        : scope.row.orderStatus === 1
                                        ? $t("platform.waitForDelivery") //"待发货"
                                        : scope.row.orderStatus === 2
                                        ? $t("platform.waitReceiving") //"待收货"
                                        : scope.row.orderStatus === 3
                                        ? $t("platform.waitingEvaluation") //"待评价"
                                        : scope.row.orderStatus === 4
                                        ? $t("platform.fulfill") //"已完成"
                                        : scope.row.orderStatus === 5
                                        ? $t("platform.canceled") //"已取消"
                                        : scope.row.orderStatus === 6
                                        ? $t("platform.OrderTimeoutClose") //"订单关闭(超时关闭)"
                                        : scope.row.orderStatus === 7
                                        ? $t("platform.OrderAfterSaleClose") //"订单关闭(售后关闭)"
                                        : scope.row.orderStatus === 8
                                        ? $t("platform.other") //"其他"
                                        : ""
                                }}
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 订单/售后状态 -->
                    <BmTableColumn prop="status" :label="$t('platform.OrderAfterStatus')" align="center" header-align="center" width="150">
                        <template #default="scope">
                            <div class="green">
                                <div>
                                    {{
                                        scope.row.status === 1
                                            ? $t("platform.MOProcessed") //"商家运营待处理"
                                            : scope.row.status === 3
                                            ? $t("platform.MOReceived") //"商家/运营待收货"
                                            : scope.row.status === 4
                                            ? $t("platform.forrefund") //"待退款"
                                            : scope.row.status === 5
                                            ? $t("platform.refundSuccess") //"退款成功"
                                            : scope.row.status === 6
                                            ? $t("platform.CloseAfterSalesOrder") //"关闭售后单"
                                            : scope.row.status === 7
                                            ? $t("platform.MOReApp") //"商家/运营驳回申请"
                                            : scope.row.status === 8
                                            ? $t("platform.MORefuseAcceptReturn") //"商家/运营拒收退货商品"
                                            : "--"
                                    }}
                                </div>
                                <div v-if="scope.row.status == 2">
                                    <!-- 1待自行寄出 2上门取件 -->
                                    {{ scope.row.deliveryType == 1 ? $t("platform.ToSend") : scope.row.deliveryType == 2 ? $t("platform.doorTake") : "" }}
                                </div>
                                <div v-if="scope.row.involvedStatus">
                                    <!-- 工单 -->
                                    {{ $t("platform.workOrder") }}:
                                    {{
                                        scope.row.involvedStatus == 1
                                            ? $t("platform.forProof") //"待举证"
                                            : scope.row.involvedStatus == 2
                                            ? $t("platform.waitingPlatformProcessing") //"平台处理中"
                                            : scope.row.involvedStatus == 3
                                            ? $t("platform.workOrderClose") //"工单关闭"
                                            : scope.row.involvedStatus == 4
                                            ? $t("platform.WorkOrderFinished") //"工单已完结"
                                            : ""
                                    }}
                                </div>
                            </div>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('platform.returnlogisticsInfo')" align="center" min-width="100" show-overflow-tooltip header-align="center">
                        <template #default="scope">
                            <div>{{ scope.row.deliveryCompany }}</div>
                            <div>{{ scope.row.deliverySn }}</div>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('platform.operation')" align="center" fixed="right" header-align="center">
                        <template #default="scope">
                            <!-- 查看详情 -->
                            <div class="green cp">
                                <el-button type="text" v-permission="'return_platform_detail'" @click="checkDetail(scope.row)">{{ $t("platform.SeeDetails") }}</el-button>
                            </div>
                            <!-- 同意退款 -->
                            <div v-if="scope.row.status == 1 && scope.row.returnType == 0 && scope.row.orderType == 1" class="green cp">
                                <el-button type="text" v-permission="'return_platform_AgreeRefund'" @click="bitchDeliver(scope.row)">{{ $t("platform.AgreeRefund") }}</el-button>
                            </div>
                            <!-- 同意退货 -->
                            <div v-if="scope.row.status == 1 && scope.row.returnType == 1 && scope.row.orderType == 1" class="green cp" @click="bitchSales(scope.row)">
                                <el-button type="text" v-permission="'return_platform_AgreeReturn'" @click="bitchSales(scope.row)">{{ $t("platform.AgreeReturn") }}</el-button>
                            </div>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </div>
        </template>
        <BmNoData v-else />
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="600">
        <!-- 确定退款给买家吗? -->
        <el-form :label-position="left">
            <el-form-item>
                {{ $t("platform.sureRefundBuyer") }}
            </el-form-item>
        </el-form>
    </BmDialog>
    <BmDialog v-model:visible="visible_2" :title="title_2" :confirm="confirm_2" :cancel="cancel_2" :width="600">
        <!-- 确定同意买家退货吗？ -->
        <el-form :label-position="left">
            <el-form-item>
                {{ $t("platform.sureAgreeReturnGoodsBuy") }}
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { orderReturnListPage, OrderFindByConditions, orderOrderReturnReturn, orderOrderReturnListCount, orderBatchAgreeReturnGoods, orderReturnListExport } from "@/api/goods";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { exportExcel } from "@/utils/";
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

        let radio = ref(3);

        let typeName = ref("是否带电");

        let visible = ref(false);
        let visible_2 = ref(false);
        let title = ref(proxy.$t("platform.batchOnlyRefund"));
        let title_2 = ref(proxy.$t("platform.BatchAgreeReturnRefund"));

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
                lable: proxy.$t("platform.waitPayment"), // 待付款
                value: 0
            },
            {
                lable: proxy.$t("platform.waitDelivery"), // 待发货
                value: 1
            },
            {
                lable: proxy.$t("platform.waitReceive"), // 待收货
                value: 2
            },
            {
                lable: proxy.$t("platform.waitEvaluate"), // 待评价
                value: 3
            },
            {
                lable: proxy.$t("platform.fulfilled"), // 已完成
                value: 4
            },
            {
                lable: proxy.$t("platform.haveRevocation"), // 已取消
                value: 5
            },
            {
                lable: proxy.$t("platform.timeoutCancel"), // 超时取消
                value: 6
            },
            {
                lable: proxy.$t("platform.discontentOrder"), // 无效订单
                value: 7
            },
            {
                lable: proxy.$t("platform.haveRejection"), // 已拒收
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
            returnType: "", // 售后类型(0->仅退款 1->退款退货)
            sellerId: "", // 卖家Id	query	false
            storeId: "",
            pageNum: pageNum,
            pageSize: pageSize,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        let returnListCount = ref({});

        // 售后订单统计
        const orderReturnListCount = () => {
            orderOrderReturnListCount()
                .then((res) => {
                    returnListCount.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        orderReturnListCount();

        // 获取数据
        let tableList = ref([]);
        let checkedOrderSnList = [];
        let applyWaitHandleCount = ref("");
        let returnGoodsWaitHandleCount = ref("");
        const gettableData = () => {
            const loading = proxy.$loading();
            orderReturnListPage(searchForm)
                .then((res) => {
                    let ids = [];
                    res.data.records.forEach((item) => {
                        item.checked = true;
                        ids.push(item.id);
                    });
                    tableList.value = res.data.records;
                    checkedOrderSnList = ids;

                    pageTotal.value = Number(res.data.total);
                    // applyWaitHandleCount.value = res.data.applyWaitHandleCount;
                    // returnGoodsWaitHandleCount.value = res.data.returnGoodsWaitHandleCount;

                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        //初始化
        const initData = () => {
            console.log("initData");
            gettableData();
            orderReturnListCount();
        };
        initData();

        // 搜索
        const handelSearch = () => {
            //searchForm.beginTime = dayjs(searchForm._tpmTime && searchForm._tpmTime[0]).format('YYYY-MM-DD HH:mm:ss');
            searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[0]);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[1]);
            //searchForm.endTime =  dayjs(searchForm._tpmTime && searchForm._tpmTime[1]).format('YYYY-MM-DD HH:mm:ss');
            // let time = dayjs(searchForm._tpmTime && searchForm._tpmTime[0]).format('YYYY-MM-DD HH:mm:ss');
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
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

        // -----------------------------多商品售后单----------------------------

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
        const handleCheckOrderSnChange = (value) => {
            console.log(value);
            checkedAll.value = checkedOrderSn.value.length === checkedOrderSnList.length;
            isIndeterminate.value = checkedOrderSn.value.length > 0 && checkedOrderSn.value.length < checkedOrderSnList.length;
        };

        // ----------------------------------------------------------------

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
                if (checkedOrderSn.value.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                } else {
                    ids = checkedOrderSn.value;
                }
            }
            for (let index = 0; index < tableList.value.length; index++) {
                // 批量同意退款仅对FBM商品且商家待审核售后状态 status=1 待审核   orderType=2 fbt
                for (let j = 0; j < checkedOrderSn.value.length; j++) {
                    if (checkedOrderSn.value[j] == tableList.value[index].id) {
                        if (tableList.value[index].orderType == 2 || tableList.value[index].status != 1) {
                            proxy.$message.error(proxy.$t("platform.batchAgreeReturn"));
                            return;
                        }
                    }
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
                initData();
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
                if (checkedOrderSn.value.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                } else {
                    salasId = checkedOrderSn.value;
                }
            }
            for (let index = 0; index < tableList.value.length; index++) {
                // 批量同意退款仅对FBM商品且商家待审核售后状态 status=1 待审核   orderType=2 fbt returnType售后类型(0->仅退款 1->退款退货)
                for (let j = 0; j < checkedOrderSn.value.length; j++) {
                    if (checkedOrderSn.value[j] == tableList.value[index].id) {
                        if (tableList.value[index].orderType == 2 || tableList.value[index].status != 1 || tableList.value[index].returnType != 1) {
                            proxy.$message.error(proxy.$t("platform.batchAgreeSalesReturn"));
                            return;
                        }
                    }
                }
            }
            visible_2.value = true;
        };

        // 确认退货
        const confirm_2 = () => {
            // let id = tableSelectionRows.map(v => v.id)
            orderBatchAgreeReturnGoods((ids = salasId))
                .then((res) => {
                    if (res.code === 0) {
                        visible_2.value = false;
                        proxy.$message.success(res.msg);
                        initData();
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const cancel = () => {
            visible.value = false;
        };

        const cancel_2 = () => {
            visible_2.value = false;
        };

        const checkDetail = (row) => {
            window.open(window.location.origin + window.location.pathname + `#/services/platformDetail?id=${row.id}`);
            // router.push({ path: "/services/platformDetail", query: { id: row.id } });
        };

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            orderReturnListExport(searchForm)
                .then((res) => {
                    exportExcel("After-sales workbench", res);
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
            handelSearch,
            resetForm,
            handleCommand,
            handleCommandTimeType,
            shortcuts,
            disabledDate,
            typeName,
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
            applyWaitHandleCount,
            handleExportExcel,
            goodsMultiList
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
    border-radius: 3px;
}
/deep/ .el-button {
    min-height: 20px;
}
.default {
    height: 220px;
    overflow: hidden;
}
.font-flow {
    height: 45px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
</style>
