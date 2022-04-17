<template>
    <div class="mb-25 p-25 bg-white round-4 top-search-form" id="content">
        <BmBreadcrumb />
        <div>
            <el-radio-group v-model="radio" @change="statusChange" size="medium" class="mb-10">
                <!-- 三月前 近三月 -->
                <el-radio-button label="1">{{ $t("orderQuery.OrdersInTheLastThreeMonths") }}</el-radio-button>
                <el-radio-button label="2">{{ $t("orderQuery.OrderThreeMonthsAgo") }}</el-radio-button>
            </el-radio-group>
            <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
                <el-row :gutter="24">
                    <!-- 订单编号 -->
                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('orderQuery.orderNumber')" prop="orderSn">
                            <el-input v-model="searchForm.orderSn" :placeholder="$t('pleaseEnter')" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <!--快递单号  -->
                    <el-col :md="12" :lg="6">
                        <el-form-item :label="$t('orderQuery.trackingNumber')" prop="deliverySn">
                            <el-input v-model="searchForm.deliverySn" :placeholder="$t('pleaseEnter')" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- 订单状态 -->
                    <el-col :md="12" :lg="6">
                        <el-form-item prop="status" :label="$t('orderQuery.orderStatus')">
                            <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                                <el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.lable" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 售后状态 -->
                    <el-col :md="12" :lg="6">
                        <el-form-item prop="returnStatus" :label="$t('orderQuery.AfterState')">
                            <el-select v-model="searchForm.returnStatus" :placeholder="$t('pleaseSelect')" clearable>
                                <el-option v-for="(item, index) in aftersales" :key="index" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div id="elCollapse" class="h-0 hidden">
                    <el-row :gutter="24">
                        <!-- 商品信息 -->
                        <!-- <el-col :md="12" :lg="6">
                            <el-form-item :label="$t('orderQuery.goodsInfo')" prop="goodKeyword">
                                <el-input v-model="searchForm.goodKeyword" placeholder="Title/TSIN/FNSKU/Batch No./EAN/NPU" clearable></el-input>
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
                        <!-- 下单时间 -->
                        <el-col :md="12" :lg="6">
                            <el-form-item :label="$t('orderQuery.orderTime')" prop="_tpmTime">
                                <el-date-picker
                                    v-model="searchForm._tpmTime"
                                    @change="changeDate"
                                    type="datetimerange"
                                    :start-placeholder="$t('startDate')"
                                    range-separator="-"
                                    :end-placeholder="$t('endDate')"
                                    :shortcuts="shortcuts"
                                    :disabled-date="disabledDate"
                                    placeholder="xxxx-xx-xx xx-xx-xx ~ xxxx-xx-xx xx-xx-xx"
                                    clearable
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <!-- 支付状态 -->
                        <el-col :md="12" :lg="6">
                            <el-form-item prop="payState" :label="$t('orderQuery.stateOfPayment')">
                                <el-select v-model="searchForm.payState" :placeholder="$t('pleaseSelect')" clearable>
                                    <el-option :label="$t('orderQuery.all')" value=""> </el-option>
                                    <el-option :label="$t('orderQuery.unpaid')" value="2"> </el-option>
                                    <el-option :label="$t('orderQuery.havePaid')" value="1"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- 是否预售 -->
                        <!-- //是否支持预售 0表示不支持 1表示支持 -->
                        <!-- <el-col :md="12" :lg="6">
                            <el-form-item prop="isOpenPresell" :label="$t('orderQuery.WhetherToBooking')">
                                
                                <el-select v-model="searchForm.isOpenPresell" :placeholder="$t('pleaseSelect')" clearable>
                                    <el-option :label="$t('orderQuery.all')" value=""> </el-option>
                                    <el-option :label="$t('orderQuery.presell')" value="1"> </el-option>
                                    <el-option :label="$t('orderQuery.notPresell')" value="0"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
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
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between vcenter mb-20" style="flex-wrap: wrap">
            <div class="flex vcenter">
                <!-- 全选 -->
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleCheckAllChange" class="mr-15">{{ $t("table.checkAll") }} </el-checkbox>
                <div style="width: 2px; line-height: 15px">|</div>
                <!-- FBT FBM -->
                <div class="ml-25">
                    <el-radio-group v-model="searchForm.deliveryType" @change="handleChangeType">
                        <el-radio label="">{{ $t("status.all") }}</el-radio>
                        <el-radio label="2">FBT</el-radio>
                        <el-radio label="1">FBM</el-radio>
                    </el-radio-group>
                </div>
                <!-- 快速筛选 -->
                <div class="ml-30">
                    <el-radio-group v-model="searchForm.fastStatus" @change="initData()" class="mr-15">
                        <el-radio-button label="" plain>{{ $t("orderQuery.all") }}</el-radio-button>
                        <!-- 待发货 -->
                        <el-radio-button :label="0" plain>{{ $t("orderQuery.waitForDelivery") }}({{ orderCountList.await_delivery_count }})</el-radio-button>
                        <!-- 即将延迟发货 -->
                        <el-radio-button :label="1" plain>{{ $t("orderQuery.shipmentWillBeDelayedSoon") }}({{ orderCountList.will_delay_good_count }})</el-radio-button>
                        <!-- 已延迟发货 -->
                        <el-radio-button :label="2" plain>{{ $t("orderQuery.delayedShipment") }}({{ orderCountList.delay_good_count }})</el-radio-button>
                        <!-- 已发货未签收 -->
                        <el-radio-button :label="3" plain>{{ $t("orderQuery.shipmentNotSigned") }}({{ orderCountList.has_delivered_not_sign }})</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div class="flex">
                <!-- 批量备注 批量发货 -->
                <el-button plain class="ml-15" v-permission="'commodity_order_batchnote'" @click="bitchRemarks">{{ $t("orderQuery.BatchNote") }}</el-button>
                <el-button v-permission="'commodity_order_batchDlivery'" @click="batchShipments" plain class="ml-15">{{ $t("orderQuery.batchDelivery") }}</el-button>
                <el-button plain v-permission="'commodity_order_export'" class="ml-15" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
            </div>
        </div>
        <template v-if="tableList && tableList.length > 0">
            <div v-for="(item, i) in tableList" :key="i">
                <div class="flex between table_title vcenter" style="flex-wrap: wrap">
                    <div>
                        <el-checkbox v-model="checkedOrderSn" @change="handleCheckOrderSnChange" :label="item.id" :key="item.id" class="mr-15">&nbsp; </el-checkbox>
                        {{ item.deliveryType == 1 ? "FBM" : item.deliveryType == 2 ? "FBT" : "" }}<span v-if="item">({{ item.items.length }})</span>
                        <span class="ml-15">{{ $t("orderQuery.orderNumber") }}:</span
                        ><span class="ml-15"
                            ><text class="green">{{ item.orderSn }}</text>

                            <text v-clipboard:copy="item.orderSn" v-clipboard:success="onCopy" v-clipboard:error="onError" class="green ml-15 green cp">{{ $t("copy") }}</text></span
                        >
                        <!--下单时间 ({{ item.promisedDeliveryTime }}) -->
                        <span class="iblock ml-30">{{ $t("orderQuery.orderTime") }}： {{ item.createTime }}</span>
                        <!-- 承诺发货时间 -->
                        <span v-if="item.promisedDeliveryDateTime" class="iblock ml-25">{{ $t("orderQuery.PromisedDeliveryTime") }}：{{ item.promisedDeliveryDateTime }}</span>
                        <!-- 发货时间 -->
                        <span v-if="item.deliveryTime" class="iblock ml-15">{{ $t("orderQuery.deliveryTime") }}: {{ item.deliveryTime }}</span>
                        <!-- 付款时间 -->
                        <span v-if="item.paymentTime" class="iblock ml-15">{{ $t("orderQuery.timeOfPayment") }}: {{ item.paymentTime }}</span>
                        <!-- 完成时间 -->
                        <span v-if="item.receiveTime" class="iblock ml-15">{{ $t("orderQuery.finishTime") }}{{ item.receiveTime }}</span>
                        <!-- 订单取消时间 -->
                        <span v-if="item.cancelTime" class="iblock ml-15">{{ $t("orderQuery.OrderCancellationTime") }}: {{ item.cancelTime }}</span>
                        <!-- 即将超时发货： -->
                        <!-- <span v-if="item.deliveryTimeOutCountdown" class="iblock ml-15">{{ $t("orderQuery.TheDeliveryWillBeTimedOut") }}:{{ item.deliveryTimeOutCountdown }}</span> -->
                    </div>
                    <div>
                        <i v-if="item.sourceType == 4" class="el-icon-monitor"></i><i v-if="item.sourceType == 1 || item.sourceType == 2 || item.sourceType == 3" class="el-icon-mobile-phone"></i>
                    </div>
                </div>

                <BmTable
                    :data="[item]"
                    @selection-change="handleSelectionChange($event, i)"
                    :default-sort="{ prop: 'creatTime', order: 'descending' }"
                    :ref="
                        (el) => {
                            if (el) multipleTable[i] = el;
                        }
                    "
                    class="mb-20"
                    header-align="center"
                >
                    <!-- <BmTableColumn type="selection"></BmTableColumn> -->
                    <!-- 商品信息 -->
                    <BmTableColumn prop="date" label="" min-width="600px;" header-align="center">
                        <template #header>
                            <!-- 商家信息 数量/价格 -->
                            <div class="flex between">
                                <div style="width: 100px; text-align: left; margin-left: 200px">{{ $t("orderQuery.goodsInfo") }}</div>
                                <div style="width: 86px; text-align: left">{{ $t("orderQuery.UnitPriceQuantity") }}</div>
                            </div>
                        </template>
                        <template #default="scope">
                            <div :class="scope.row.items.length > 2 && item.checked ? 'default' : ''">
                                <div v-for="(ison, i) in scope.row.items" :key="i">
                                    <div class="flex mb-10" :style="i !== 0 ? 'border-top: 1px solid #ebeef5;' : ''">
                                        <div>
                                            <el-image class="goodImg" :src="ison.goodImg" :preview-src-list="[ison.goodImg]"> </el-image>
                                        </div>
                                        <div class="ml-20" style="width: 450px; text-align: left">
                                            <div class="font-flow">{{ ison.goodName }}</div>
                                            <!-- 商家编码 -->
                                            <!-- <div>{{ $t("orderQuery.MerchantCode") }}: {{ scope.row.storeCode }}</div> -->
                                            <div>
                                                <span>TSIN: {{ ison.skuTsin }}</span
                                                ><span style="margin-left: 100px">{{ ison.goodAttr }}</span>
                                            </div>
                                            <div>FNSKU: {{ ison.skuFnsku }}</div>
                                        </div>
                                        <div style="width: 150px; text-align: center">
                                            <div>{{ $store.state.app.currencySymbol }} {{ ison.goodPrice }}</div>
                                            <div>x{{ ison.goodQuantity }}</div>
                                        </div>
                                        <div
                                            v-if="scope.row.items.length > 2 && item.checked && i === 1"
                                            class="green cp"
                                            style="position: absolute; bottom: 20px; right: 0"
                                            @click="item.checked = !item.checked"
                                        >
                                            {{ $t("orderQuery.more") }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 商品总价 -->
                    <BmTableColumn prop="productAmount" :label="$t('orderQuery.CommodityPrice')" width="100" align="center"> </BmTableColumn>
                    <!-- 交易总额 -->
                    <BmTableColumn prop="payAmount" :label="$store.state.app.currencySymbol + $t('orderQuery.grossMerchandiseVolume')" min-width="150px;" header-align="center" align="center">
                        <template #default="scope">
                            <div style="min-width: 150px; text-align: left">
                                <div>{{ scope.row.payAmount }}</div>
                                <div>{{ $t("orderQuery.sellerEarningsAccount") }} {{ scope.row.sellerRealIncome }}</div>
                                <!-- 支付状态：0->未支付 1表示已经支付 -->
                                <div>{{ scope.row.payState ? $t("orderQuery.havePaid") : $t("orderQuery.unpaid") }}</div>
                                <!-- 支付方式  1->在线支付；2->货到付款     支付渠道--0->系统支付；1->余额支付 2->UniwalletPay 3:Tingg Pay 4:Brij Pay 5: 货到付款 6: PaySwitch -->
                                <div class="light-grey">
                                    <span>
                                        {{ scope.row.paymentType === 1 ? $t("orderQuery.onlinePayment") + ":" : $t("orderQuery.payOnDelivery") }}
                                        <span v-if="scope.row.payType">{{ $t(`orderQuery.payType[${scope.row.payType}]`) }}</span>
                                    </span>
                                    <span v-if="scope.row.paymentMethodName">-{{ scope.row.paymentMethodName }}</span>
                                </div>
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 收货人 -->
                    <BmTableColumn prop="" :label="$t('orderQuery.consignee')" min-width="250" header-align="center">
                        <template #default="scope">
                            <div style="text-align: left" v-if="scope.row.deliveryType == 1">
                                <!-- 收货人姓名 -->
                                <div>{{ $t("orderQuery.consigneeName") }}: {{ scope.row.receiverName }}</div>
                                <!-- 手机号码 -->
                                <div>{{ $t("orderQuery.phone") }}: {{ scope.row.receiverPhone }}</div>
                                <!-- 收货人邮编 -->
                                <!-- <div>{{$t("orderQuery.ConsigneePostcode")}}: {{ scope.row.receiverPostCode }}</div> -->
                                <!-- 省份/区 -->
                                <div>{{ $t("orderQuery.ProvinceArea") }}: {{ scope.row.receiverProvince + scope.row.receiverRegion }}</div>
                                <!-- 详细地址 -->
                                <div>{{ $t("orderQuery.detailedAddress") }}: {{ scope.row.receiverDetailAddress }}</div>
                            </div>
                            <div style="text-align: left" v-if="scope.row.deliveryType == 2">
                                <!-- 收货人姓名 -->
                                <div>{{ $t("orderQuery.consigneeName") }}: ☆☆☆☆☆☆</div>
                                <!-- 手机号码 -->
                                <div>{{ $t("orderQuery.phone") }}: ☆☆☆☆☆☆</div>
                                <!-- 收货人邮编 -->
                                <!-- <div>{{$t("orderQuery.ConsigneePostcode")}}: {{ scope.row.receiverPostCode }}</div> -->
                                <!-- 省份/区 -->
                                <div>{{ $t("orderQuery.ProvinceArea") }}: ☆☆☆☆☆☆</div>
                                <!-- 详细地址 -->
                                <div>{{ $t("orderQuery.detailedAddress") }}: ☆☆☆☆☆☆</div>
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 买家信息 -->
                    <BmTableColumn prop="columnTime" :label="$t('orderQuery.BuyersInformation')" align="center" min-width="200px;" header-align="center">
                        <template #default="scope">
                            <div>
                                <BmImage v-if="scope.row.buyerHeadPictureUrl" :src="scope.row.buyerHeadPictureUrl" style="width: 39px; height: 39px; border-radius: 2px" />
                                <span class="ml-15">{{ scope.row.buyerNickname }}</span>
                            </div>
                            <div>{{ $t("remark") }}: {{ scope.row.note }}</div>
                        </template>
                    </BmTableColumn>
                    <!-- 订单/售后状态 -->
                    <BmTableColumn prop="" :label="$t('orderQuery.OrderAfterSaleStatus')" align="center" min-width="130px;" header-align="center">
                        <template #default="scope">
                            <!-- 待付款 待发货 待收货 待评价  已完成 已取消 超时未付款 无效订单 已拒收-->
                            <div>
                                {{
                                    scope.row.status === 0
                                        ? $t("orderQuery.waitPayment")
                                        : scope.row.status === 1
                                        ? $t("orderQuery.waitForDelivery")
                                        : scope.row.status === 2
                                        ? $t("orderQuery.waitReceiving")
                                        : scope.row.status === 3
                                        ? $t("orderQuery.waitingEvaluation")
                                        : scope.row.status === 4
                                        ? $t("orderQuery.fulfill")
                                        : scope.row.status === 5
                                        ? $t("orderQuery.canceled")
                                        : scope.row.status === 6
                                        ? $t("platform.OrderTimeoutClose")
                                        : scope.row.status === 7
                                        ? $t("platform.OrderAfterSaleClose")
                                        : scope.row.status === 8
                                        ? $t("platform.rejectClose")
                                        : ""
                                }}
                            </div>
                            <!-- FBT 商品 fbt模式发货状态：1->待推送至WMS；2->等待仓库处理；3->仓库处理中；4->已出库-->
                            <div v-if="scope.row.deliveryType == 2 && scope.row.status != 5 && scope.row.status != 6 && scope.row.status != 7">
                                {{
                                    scope.row.fbtDeliveryStatus == 1
                                        ? $t("orderQuery.WMS")
                                        : scope.row.fbtDeliveryStatus == 2
                                        ? $t("orderQuery.WaitingForWarehouseProcessing")
                                        : scope.row.fbtDeliveryStatus == 3
                                        ? $t("orderQuery.WarehouseProcessing")
                                        : scope.row.fbtDeliveryStatus == 4
                                        ? $t("orderQuery.HaveOutbound")
                                        : ""
                                }}
                            </div>
                            <div v-if="scope.row.status === 2">
                                ({{
                                    scope.row.hasSign == 0
                                        ? $t("orderQuery.ToSignForIt")
                                        : scope.row.hasSign == 1
                                        ? $t("orderQuery.haveBeenSigned")
                                        : scope.row.hasSign == 2
                                        ? $t("orderQuery.refuseReceiveGoods")
                                        : ""
                                }})
                            </div>
                            <!-- 售后详情 -->
                            <div @click="checkOrderReturnDetail(scope.row)" v-if="scope.row.returnStatus !== 0" class="green cp">{{ $t("orderQuery.returnDetail") }}</div>
                        </template>
                    </BmTableColumn>
                    <!-- 操作 -->
                    <BmTableColumn prop="" :label="$t('orderQuery.operation')" align="center" header-align="center" width="120px" fixed="right">
                        <template #default="scope">
                            <!-- 查看详情 -->
                            <div class="green cp">
                                <el-button type="text" v-permission="'commodity_order_detail'" @click="checkDetail(scope.row)">{{ $t("orderQuery.SeeDetails") }}</el-button>
                            </div>
                            <!-- 打印购物单 -->
                            <div class="green cp">
                                <el-button type="text" v-permission="'commodity_order_print'" @click="handelPrint(scope.row)">{{ $t("orderQuery.printShoppingList") }}</el-button>
                            </div>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </div>
        </template>
        <BmNoData v-else />

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <el-dialog :title="$t('orderQuery.batchDelivery')" @close="batchVisible" v-model="dialogFormVisible" width="70%">
        <div class="dialog_tips">
            <div>
                <!-- 发货警示 -->
                {{ $t("orderQuery.TheDeliveryWarning") }}
            </div>
            <div class="ml-25">{{ $t("orderQuery.warningOne") }}</div>
            <div class="ml-25">{{ $t("orderQuery.warningTwo") }}</div>
        </div>
        <div class="dialog_info">{{ $t("orderQuery.warningThree") }}</div>
        <div class="mb-10">
            <el-radio-group v-model="batchForm.expressType">
                <!-- 在线下单 -->
                <!-- <el-radio-button label="0">{{ $t("orderQuery.TheOnlineOrder") }}</el-radio-button> -->
                <!-- 自己联系物流 -->
                <el-radio-button label="1">{{ $t("orderQuery.ContactLogisticsByYourself") }}</el-radio-button>
            </el-radio-group>
        </div>
        <el-form :model="batchForm" class="mb-25" label-width="65px">
            <!-- 发货方式 -->
            <el-form-item v-if="batchForm.expressType == 1" :label="$t('orderQuery.deliveryMethod')">
                <!-- 物流发货 -->
                <el-radio v-model="express" label="1">{{ $t("orderQuery.LogisticsDelivery") }}</el-radio>
            </el-form-item>
            <!-- 选择快递 -->
            <el-form-item v-if="batchForm.expressType == 1" :label="$t('orderQuery.ChooseExpress')">
                <!-- 请选择快递公司 -->
                <el-select v-model="batchForm.deliveryCompany" :placeholder="$t('orderQuery.PleaseChooseTheExpressCompany')" style="width: 543px; height: 32px">
                    <el-option label="Tospino" value="1"></el-option>
                </el-select>
            </el-form-item>
            <!-- 发货地址 -->
            <el-form-item :label="$t('orderQuery.shipAddress')">
                <div class="flex vcenter">
                    <!-- 请选择快递公司 -->
                    <el-select v-model="batchForm.sendAddressId" :placeholder="$t('orderQuery.PleaseChooseTheExpressCompany')" style="width: 543px; height: 32px">
                        <el-option v-for="(item, i) in sendfAddressList" :key="i" :label="item.address" :value="item.id"></el-option>
                    </el-select>
                    <!-- 发货须知 -->
                    <!-- <div class="ml-25">
                        <el-popover placement="top-start" :title="$t('orderQuery.notice')" :width="200" trigger="hover">
                           
                            <template #reference>
                                <div class="cp green">{{ $t("orderQuery.TheDeliveryInstructions") }}</div>
                            </template>
                        </el-popover>
                    </div> -->
                </div>
            </el-form-item>
            <!-- 退货地址 -->
            <el-form-item :label="$t('orderQuery.returnAddress')">
                <div class="flex vcenter">
                    <el-select v-model="batchForm.returnAddressId" :placeholder="$t('orderQuery.PleaseChooseTheExpressCompany')" style="width: 543px; height: 32px">
                        <el-option v-for="(item, i) in refundAddressList" :key="i" :label="item.address" :value="item.id"></el-option>
                    </el-select>
                    <div class="ml-25">
                        <el-popover placement="top-start" :title="$t('orderQuery.notice')" :width="200" trigger="hover" :content="$t('orderQuery.returnGoodTips')">
                            <template #reference>
                                <div class="cp green">{{ $t("orderQuery.returnGoodInstructions") }}</div>
                            </template>
                        </el-popover>
                    </div>
                </div>
            </el-form-item>
        </el-form>
        <div class="flex between mb-25">
            <div class="flex vcenter">
                <!-- 快递单 -->
                <div class="title flex vcenter">{{ $t("orderQuery.expressWaybill") }}</div>
            </div>
        </div>
        <el-form :model="tableData_2" ref="expressRef">
            <el-table :data="tableData_2.form" height="250" border style="width: 100%" class="mb-62">
                <!-- 待发货 -->
                <el-table-column prop="orderSn" :label="$t('orderQuery.orderSn')" min-width="180"> </el-table-column>
                <!-- 发货 -->
                <el-table-column prop="status" :label="$t('orderQuery.orderStatus')" width="180">
                    <template #default="scope">
                        {{ scope.row.status === 1 ? $t("orderQuery.waitForDelivery") : "" }}
                    </template>
                </el-table-column>
                <!-- 收货人 -->
                <el-table-column prop="receiverName" :label="$t('orderQuery.consignee')" width="180"> </el-table-column>
                <!-- 手机 -->
                <el-table-column prop="receiverPhone" :label="$t('orderQuery.phone')" width="180"> </el-table-column>
                <!-- 地区 -->
                <el-table-column prop="receiverCompleteAddress" :label="$t('orderQuery.region')" min-width="200"> </el-table-column>
                <!-- 快递单号 oninput="value=value.replace(/[^\d]/g,'')"-->
                <el-table-column prop="deliverySn" :label="$t('orderQuery.trackingNumber')" width="180">
                    <template #default="scope">
                        <el-form-item v-if="batchForm.expressType == 0" :prop="`form.${scope.$index}.deliverySn`">
                            <el-input v-model="scope.row.deliverySn" key="deliverySn" :disabled="batchForm.expressType == 0" />
                        </el-form-item>
                        <el-form-item v-if="batchForm.expressType == 1" :prop="`form.${scope.$index}.deliverySn`" :rules="rulesCommon.required">
                            <el-input v-model="scope.row.deliverySn" key="deliverySn" :disabled="batchForm.expressType == 0" />
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <span class="dialog-footer flex center">
            <el-button @click="batchVisible">{{ $t("cancel") }}</el-button>
            <el-button type="primary" @click="subBatchShipents">{{ $t("confirm") }}</el-button>
        </span>
        <!-- 我已同意 《在线发货协议》 -->
        <div>
            <el-radio v-model="radio" label="1" class="green">{{ $t("orderQuery.IHaveAgreedOnlineDeliveryAgreement") }}</el-radio>
            <a href="#/message/agreement?type=30" target="_blank">{{ $t("orderQuery.agreement") }}</a>
        </div>
    </el-dialog>

    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form label-position="left">
            <el-form-item :label="$t('remark')">
                <el-input :placeholder="$t('pleaseEnter')" v-model="remarks" type="textarea" maxlength="500" style="width: 500px" :rows="5" show-word-limit />
            </el-form-item>
        </el-form>
    </BmDialog>

    <BmDialog v-model:visible="orderReturnVisible" :title="$t('orderQuery.returnDetail')" :showFooter="false" :width="1400">
        <BmTable ref="multipleTable" :data="orderReturnData" style="width: 100%">
            <!--退款编号  退款金额 申请时间 申请人 退款状态-->
            <BmTableColumn prop="returnSn" :label="$t('orderQuery.returnNum')" align="center"></BmTableColumn>
            <BmTableColumn prop="returnAmount" :label="$t('orderQuery.refundAmount')" align="center"></BmTableColumn>
            <BmTableColumn prop="createTime" :label="$t('orderQuery.timeApplication')" align="center"></BmTableColumn>
            <BmTableColumn prop="name" :label="$t('orderQuery.proposer')" align="center"></BmTableColumn>
            <BmTableColumn prop="status" :label="$t('orderQuery.returnStatus')" align="center">
                <template #default="scope">
                    <div class="green">
                        {{
                            scope.row.status === 1
                                ? $t("orderQuery.MOProcessed") //"商家运营待处理"
                                : scope.row.status === 2
                                ? $t("orderQuery.backDoor") //"待自行寄回/上门取件"
                                : scope.row.status === 3
                                ? $t("orderQuery.MOReceived") //"商家/运营待收货"
                                : scope.row.status === 4
                                ? $t("orderQuery.forrefund") //"待退款"
                                : scope.row.status === 5
                                ? $t("orderQuery.refundSuccess") //"退款成功"
                                : scope.row.status === 6
                                ? $t("orderQuery.CloseAfterSalesOrder") //"关闭售后单"
                                : scope.row.status === 7
                                ? $t("orderQuery.MOReApp") //"商家/运营驳回申请"
                                : scope.row.status === 8
                                ? $t("orderQuery.MORefuseAcceptReturn") //"商家/运营拒收退货商品"
                                : "--"
                        }}
                    </div>
                </template>
            </BmTableColumn>
            <!-- 退款时间 -->
            <BmTableColumn prop="refundTime" :label="$t('orderQuery.refundTime')" align="center">
                <template #default="scope">
                    {{ scope.row.refundTime ? scope.row.refundTime : "--" }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="" :label="$t('remark')" align="center">
                <template #default="scope">
                    <!-- 申请原因: 申请说明:-->
                    <div v-if="scope.row.applyReason">{{ $t("orderQuery.reasonApplication") }}: {{ scope.row.applyReason ? scope.row.applyReason : "-" }}</div>
                    <div v-if="scope.row.applyDesc">{{ $t("orderQuery.ApplyInstructions") }}: {{ scope.row.applyDesc ? scope.row.applyDesc : "-" }}</div>
                </template>
            </BmTableColumn>
        </BmTable>
    </BmDialog>
    <!-- 打印购物清单弹窗 -->
    <PrintShoppingList v-if="printVisble" v-model:visible="printVisble" :row="printData" @close="cancelPrint" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { useStore } from "vuex";
import {
    orderOmsorderSellerList,
    omsorderSellerBatchRemark,
    omsorderSellerBatchDelivery,
    omsorderSellerBatchListCount,
    umsQueryRefundAddress,
    umsQuerySendAddress,
    omsorderDetail,
    orderOmsorderSellerListExport,
    orderReturnFindNegotiationHistory
} from "@/api/goods";
import { useRoute } from "vue-router";
import { deepClone } from "@/utils/index";
import PrintShoppingList from "./component/printShoppingList";
import { exportExcel } from "@/utils/";
import dayjs from "dayjs";
export default {
    components: { PrintShoppingList },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const route = useRoute();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        let radio = ref("1");
        let dialogFormVisible = ref(false);

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        // 发货方式
        let express = ref("1");

        // 批量发货表单
        let batchForm = reactive({
            expressType: "1", // 发货类型
            sendAddressId: "", // 发货地址id
            deliveryCompany: "Tospino", // 物流公司名称
            deliveryCompanyType: "1", // 物流公司id
            returnAddressId: "", // 退货地址id
            deliveryItems: [
                {
                    deliverySn: "", // 快递单号
                    orderId: "" // 订单id
                }
            ]
        });

        let refundAddressList = ref([]); // 退货地址
        let sendfAddressList = ref([]); // 发货地址
        const refundAddress = () => {
            umsQueryRefundAddress()
                .then((res) => {
                    //console.log(res);
                    refundAddressList.value = res.data;
                    batchForm.returnAddressId = res.data[0].id;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        refundAddress();

        const sendAddress = () => {
            umsQuerySendAddress()
                .then((res) => {
                    //console.log(res);
                    sendfAddressList.value = res.data;

                    batchForm.sendAddressId = res.data[0].id;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        sendAddress();

        // table数据
        let tableList = ref([]);
        // dialog 表格数据
        const tableData_2 = reactive({ form: [] });
        let expressRef = ref(null);

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        // 订单状态
        let orderStatusList = computed(() => [
            {
                lable: proxy.$t("orderQuery.all"), // 待付款
                value: ""
            },
            {
                lable: proxy.$t("orderQuery.waitPayment"), // 待付款
                value: 0
            },
            {
                lable: proxy.$t("orderQuery.waitForDelivery"), // 待发货
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
                lable: proxy.$t("orderQuery.other"), // 其他
                value: 8
            },
            {
                lable: proxy.$t("orderQuery.haveEvaluation"), // 已评价
                value: 9
            },
            {
                lable: proxy.$t("orderQuery.remainEvaluated"), // 待评价
                value: 10
            },
            {
                lable: proxy.$t("orderQuery.haveBeenSigned"), // 已签收
                value: 11
            }
        ]);

        // 售后状态
        let aftersales = computed(() => [
            {
                label: proxy.$t("orderQuery.normalOrder"), //正常订单
                value: 0
            },
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
            // {
            //     name: "UPC", //upc
            //     value: 2
            // },
            {
                name: proxy.$t("releaseGoods.goodsCode"), //商品编码
                value: 3
            }
            // {
            //     name: proxy.$t("goodsList.keyword"), //商品标题
            //     value: 4
            // }
        ]);

        //搜索
        let searchFormRef = ref(null);
        let searchForm = reactive({
            _tpmTime: [],
            beginTime: "", //开始时间
            buyerId: "", //买家ID
            deliverySn: "", //运费单关键字
            deliveryType: "", //配送类型( 1 FBM 2 FBT )
            endTime: "", //结束时间
            goodKeyword: "", //商品关键字
            isPresale: "", //是否预售0->不是预售1->是预售
            orderSn: "", //订单关键字
            payState: "", //支付状态
            returnStatus: route.query.returnStatus * 1 || "", //售后状态：0->正常订单 1->售后处理中 2->售后完成 3->售后驳回
            status: route.query.status * 1 || "", //订单状态：0->待付款；1->待发货；2->待收货；3->待评价；4->已完成 5->已取消；6->超时取消；7->无效订单；8->已拒收
            storeId: "", //店铺ID
            timeType: 0, //->0->下单时间 1->发货时间 2->出库时间 3->支付时间 4->确认收货时间 5->评价时间 6->订单取消时间
            deliveryType: "", //贸易类型：1->国内贸易；2->跨境贸易
            pageNum: pageNum, //示例值(1)
            pageSize: pageSize,
            monthSort: "",
            isOpenPresell: "", // 是否预售
            pageSize: pageSize,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        // 获取数据
        let checkedOrderSnList = [];
        let dataTmp = [];
        const getTableData = () => {
            const loading = proxy.$loading();
            orderOmsorderSellerList(searchForm)
                .then((res) => {
                    dataTmp = deepClone(res.data.records);
                    pageTotal.value = res.data.total;
                    let ids = [];
                    res.data.records.forEach((item) => {
                        item.checked = true;
                        ids.push(item.id);
                    });
                    tableList.value = res.data.records;

                    checkedOrderSn.value = []; //清空选中的订单
                    checkedAll.value = false; //取消全选
                    checkedOrderSnList = ids;

                    // checkedOrderSnList = res.data.records.map((item) => item.id);
                    // tableList.value.forEach((v) => (v.checked = true));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        //初始化
        const initData = () => {
            getTableData();
        };
        initData();

        //搜索
        const handelSearch = () => {
            // if (searchForm._tpmTime.length > 0) {
            //     searchForm.beginTime = dayjs(searchForm._tpmTime[0]).format("YYYY-MM-DD HH:mm:ss");
            //     searchForm.endTime = dayjs(searchForm._tpmTime[1]).format("YYYY-MM-DD HH:mm:ss");
            // } else {
            //     searchForm.beginTime = "";
            //     searchForm.endTime = "";
            // }

            searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tpmTime.length && searchForm._tpmTime[0], 1) || "";
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tpmTime.length && searchForm._tpmTime[1], 1) || "";

            searchForm.fastStatus = "";
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            initData();
        };

        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            searchForm.status = "";
            initData();
        };

        // 获取订单统计
        let orderCountList = reactive({
            await_delivery_count: 0,
            has_delivered_not_sign: 0,
            delay_good_count: 0,
            will_delay_good_count: 0
        });
        const orderCount = () => {
            // searchForm
            omsorderSellerBatchListCount(searchForm)
                .then((res) => {
                    orderCountList.await_delivery_count = res.data.await_delivery_count; // 待发货
                    orderCountList.has_delivered_not_sign = res.data.has_delivered_not_sign; // 已发货未签收
                    orderCountList.delay_good_count = res.data.delay_good_count; // 已延迟发货
                    orderCountList.will_delay_good_count = res.data.will_delay_good_count; // 即将延迟发货
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        orderCount();

        // 物流筛选
        const handleChangeType = (val) => {
            searchForm.deliveryType = val;
            orderCount();
            initData();
        };

        const changeDate = (val) => {
            //console.log("val", val);
        };

        //表格时间切换
        let columnTime = ref("createTime");
        let columnTimeName = ref(proxy.$t("createTime"));
        const handleCommandColumnTime = (item) => {
            columnTime.value = item.value;
            columnTimeName.value = item.name;
        };

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
            checkedAll.value = checkedOrderSn.value.length === checkedOrderSnList.length;
            isIndeterminate.value = checkedOrderSn.value.length > 0 && checkedOrderSn.value.length < checkedOrderSnList.length;
        };

        //全选表行
        const multipleTable = ref([]);

        // 当前页
        let currentPage = ref(1);
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            initData();
            content.scrollIntoView();
        };

        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            initData();
        };

        let visible = ref(false);
        let title = ref(proxy.$t("orderQuery.batchEditMark"));
        let remarks = ref("");

        // 批量修改备注
        const confirm = () => {
            if (checkedOrderSn.value.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }

            if (remarks.value) {
                const loading = proxy.$loading();
                omsorderSellerBatchRemark({ remark: remarks.value, orderIds: checkedOrderSn.value }).then((res) => {
                    proxy.$message.success(res.msg);
                    visible.value = false;
                    remarks.value = "";
                    initData();
                    loading.close();
                });
            } else {
                proxy.$message.error(proxy.$t("pleaseEnter"));
                return;
            }
        };

        const cancel = () => {
            visible.value = false;
        };

        // 批量备注
        const bitchRemarks = () => {
            if (checkedOrderSn.value.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            visible.value = true;
        };

        // 三个月前
        const statusChange = (val) => {
            radio.value = val;
            if (val == 2) {
                // var date = new Date();
                // date.setMonth(date.getMonth()-3);
                // // date.setMonth(date.getMonth()-3, 1);
                // date.setDate(date.getDate()-1)
                // searchForm.endTime = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
                searchForm.monthSort = "3_lt";

                initData();
            } else {
                searchForm.monthSort = "3_gt";
                // searchForm.beginTime = ""
                // searchForm.endTime = ""
                initData();
            }
        };

        // 详情页
        const checkDetail = (e) => {
            window.open(window.location.origin + window.location.pathname + `#/commodity/orderDetail?id=${e.id}`);
            // router.push({ path: "/commodity/orderDetail", query: { id: e.id } });
        };

        let printVisble = ref(false);
        let printData = ref({});
        // 打印购物单
        const handelPrint = (row) => {
            omsorderDetail(row.id)
                .then((res) => {
                    printData.value = res.data;
                    printVisble.value = true;
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const cancelPrint = () => {
            printVisble.value = false;
        };

        // 快递单号校验
        const rulesCommon = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" },
            isSelect: { required: true, message: proxy.$t("pleaseEnter"), trigger: "change" }
        });

        // 关闭dialog
        const batchVisible = () => {
            dialogFormVisible.value = false;
            tableData_2.form = [];
        };

        // 批量发货
        const batchShipments = () => {
            let flag = true;
            if (checkedOrderSn.value.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            //debugger
            checkedOrderSn.value.forEach((item) => {
                dataTmp.forEach((v) => {
                    if (item === v.id) {
                        // 支持发货的订单状态
                        if (v.status != 1) {
                            proxy.$message.error(proxy.$t("orderQuery.ordersCannotDelivered"));
                            flag = false;
                        }
                        // FBT 不支持商家发货
                        if (v.deliveryType == 2) {
                            proxy.$message.error(proxy.$t("orderQuery.FBTPlatformDelivery"));
                            flag = false;
                        }
                        tableData_2.form.push({
                            orderSn: v.orderSn,
                            receiverName: v.receiverName,
                            receiverPhone: v.receiverPhone,
                            receiverCompleteAddress: v.receiverCompleteAddress,
                            deliverySn: "",
                            status: v.status,
                            orderId: v.id
                        });
                    }
                });
            });
            if (flag) {
                dialogFormVisible.value = true;
            } else {
                return;
            }
        };

        // 提交批量发货
        const subBatchShipents = () => {
            expressRef.value.validate((valid) => {
                if (valid) {
                    const loading = proxy.$loading();
                    batchForm.deliveryItems = [];
                    tableData_2.form.forEach((v) => {
                        batchForm.deliveryItems.push({
                            deliverySn: v.deliverySn,
                            orderId: v.orderId
                        });
                    });

                    omsorderSellerBatchDelivery(batchForm)
                        .then((res) => {
                            loading.close();
                            proxy.$message.success(res.msg);
                            dialogFormVisible.value = false;
                            tableData_2.form = [];
                            initData();
                        })
                        .catch((err) => {
                            loading.close();
                            console.log(err);
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        const onCopy = (e) => {
            proxy.$message.success("You just copied: " + e.text);
        };
        const onError = (e) => {
            proxy.$message.error("Failed to copy texts");
        };

        // 展开
        const unfold = (items) => {
            items.checked = !items.checked;
        };

        // 订单下的售后单
        let orderReturnData = ref([]);
        let orderReturnVisible = ref(false);
        const checkOrderReturnDetail = (row) => {
            orderReturnVisible.value = true;
            // orderReturnFindByOrderIdInner
            orderReturnFindNegotiationHistory(row.id)
                .then((res) => {
                    orderReturnData.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const handleExportExcel = () => {
            const loading = proxy.$loading();
            orderOmsorderSellerListExport(searchForm)
                .then((res) => {
                    exportExcel("order Data", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        return {
            subBatchShipents,
            batchVisible,
            rulesCommon,
            expressRef,
            visible,
            title,
            confirm,
            cancel,
            remarks,
            bitchRemarks,
            orderCountList,

            pageNum,
            pageTotal,
            pageSize,

            disabledDate,
            shortcuts,
            initData,

            changeDate,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            tableData_2,
            tableList,
            currentPage,
            handleSizeChange,
            handleCurrentChange,
            multipleTable,
            checkedAll,
            isIndeterminate,
            handleCheckAllChange,
            columnTime,
            columnTimeName,
            handleCommandColumnTime,
            radio,
            dialogFormVisible,
            batchForm,
            statusChange,
            orderStatusList,
            aftersales,
            handleChangeType,
            checkDetail,
            checkedOrderSn,
            handleCheckOrderSnChange,
            batchShipments,
            express,
            onCopy,
            onError,
            refundAddressList,
            sendfAddressList,
            unfold,
            orderReturnVisible,
            checkOrderReturnDetail,
            orderReturnData,
            printVisble,
            handelPrint,
            printData,
            cancelPrint,
            handleExportExcel,
            goodsMultiList
        };
    }
};
</script>

<style lang="scss" scoped>
//头部搜索栏
.table-search-form {
    position: relative;
    padding-right: 240px;
    .table-search-btns {
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 5px;
        right: 0;
    }
}
.table_title {
    border: 1px solid #edebed;
    border-bottom: none;
    padding: 20px 25px 20px 25px;
}

.dialog_tips {
    border: 1px solid #ffe58f;
    background-color: #fffbe6;
    width: 656px;
    height: 80px;
    border-radius: 2px;
    padding: 6px 0px 16px 14px;
    margin-bottom: 10px;
}

.dialog_info {
    border: 1px solid #42b8ff;
    background-color: #d9f1ff;
    width: 656px;
    height: 32px;
    border-radius: 2px;
    padding: 6px 0px 6px 40px;
    margin-bottom: 27px;
}

.title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
}

.title::before {
    content: "";
    display: block;
    width: 2px;
    height: 16px;
    background: #42b7ae;
    margin-right: 5px;
}

.el-form-item {
    margin-bottom: 0px;
}

.dialog-footer {
    position: relative;
    bottom: 0px;
}

.goodImg {
    width: 59px;
    height: 59px;
    border-radius: 2px;
}
.default {
    height: 250px;
    overflow: hidden;
}
.font-flow {
    height: 45px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
</style>
