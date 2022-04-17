<template>
    <div class="mb-20 bg-white round-4 p-20">
        <BmBreadcrumb />
    </div>
    <div class="wrap-container bg-white round-4">
        <el-steps :active="active" class="custom-step mb-50" finish-status="success">
            <el-step v-for="(item, i) in steps" :key="i" :title="item.title">
                <template #description>
                    <div>
                        <!--提交订单时间 支付时间 承诺发货时间 超时发货时间 待推送wms仓库时间 仓库处理中 已出库 已发货 退款成功时间 已完成时间 已取消 交易关闭 拒收时间 即将发货倒计时-->
                        <div v-if="item.createTime">{{ $t("orderD.subOrderTime") }}:{{ item.createTime }}</div>
                        <div v-if="item.paymentTime">{{ $t("orderD.payTime") }}:{{ item.paymentTime }}</div>
                        <div v-if="item.promisedDeliveryDateTime">{{ $t("orderD.PromisedDeliveryTime") }}: {{ item.promisedDeliveryDateTime }}</div>
                        <div v-if="item.deliveryTimeOutMinute">{{ $t("orderD.DeliveryTimeout") }}: {{ item.deliveryTimeOutMinute }}</div>
                        <div v-if="item.sendWmsTime">{{ $t("orderD.WMSWarehouseTimePushed") }}: {{ item.sendWmsTime }}</div>
                        <div v-if="item.wmsDealTime">{{ $t("orderD.WarehouseProcess") }}: {{ item.wmsDealTime }}</div>
                        <div v-if="item.outStorageTime">{{ $t("orderD.HaveOutbound") }}: {{ item.outStorageTime }}</div>
                        <div v-if="item.deliveryTime">{{ $t("orderD.shipped") }}: {{ item.deliveryTime }}</div>
                        <div v-if="item.refundSuccessTime">{{ $t("orderD.RefundTime") }}: {{ item.refundSuccessTime }}</div>
                        <div v-if="item.receiveTime">{{ $t("orderD.fullTime") }}: {{ item.receiveTime }}</div>
                        <div v-if="item.cancelTime">{{ $t("orderD.thencancel") }}: {{ item.cancelTime }}</div>
                        <div v-if="item.cancelTime">{{ $t("orderD.invalidOrders") }}: {{ item.cancelTime }}</div>
                        <div v-if="item.rejectTime">{{ $t("orderD.rejectTime") }}: {{ item.rejectTime }}</div>
                    </div>
                    <div v-if="item.hasTimeOutDelivery == 0">{{ $t("orderD.ImminentCountdown") }}: {{ item.deliveryTimeOutCountdown }}</div>
                </template>
            </el-step>
        </el-steps>
        <div class="mb-50">
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <!--订单信息   订单号 复制 发货-->
                    <div class="title flex vcenter">{{ $t("orderD.orderInfo") }}</div>
                    <span class="ml-20 order-num">{{ $t("orderD.orderNumber") }}:{{ orderList.orderSn }}</span>
                    <span class="ml-30 green cp" v-clipboard:copy="orderList.orderSn" v-clipboard:success="onCopy" v-clipboard:error="onError">{{ $t("copy") }}</span>
                </div>
                <div>
                    <!-- v-if="orderList.deliveryType === 1 && orderList.status === 1" -->
                    <span class="green cp"></span
                    ><span class="ml-20"
                        ><el-button v-if="orderList.deliveryType === 1 && orderList.status === 1" @click="batchShipments" type="primary">{{ $t("orderD.shipments") }}</el-button></span
                    >
                </div>
            </div>
            <BmTable border :data="orderList.items" style="width: 100%" min-height="250" v-loading="tableLoading">
                <!--商品信息 规格  商品单价 商品数量 商品金额 店铺优惠抵扣 佣金/税费(代缴) 增值税 佣金-->
                <BmTableColumn prop="goodName" :label="$t('orderD.goodsInfo')" min-width="300">
                    <template #default="scope">
                        <div class="flex">
                            <div><img :src="scope.row.goodImg" /></div>
                            <div class="ml-20">
                                <div>{{ scope.row.goodName }}</div>
                                <div>{{ $t("orderD.storeNumber") }}: {{ scope.row.storeCode }}</div>
                                <div>TSIN: {{ scope.row.skuTsin }}</div>
                                <div>FNSKU: {{ scope.row.skuFnsku }}</div>
                            </div>
                        </div>
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="goodAttr" :label="$t('orderD.attr')" align="center"></BmTableColumn>
                <BmTableColumn prop="goodPrice" :label="$t('orderD.CommodityPrice')" align="center"></BmTableColumn>
                <BmTableColumn prop="goodQuantity" :label="$t('orderD.goodsNumber')" align="center"></BmTableColumn>
                <BmTableColumn prop="unit" :label="$t('orderD.unit')" align="center">
                    <template #default>PCS</template>
                </BmTableColumn>
                <BmTableColumn prop="productAmount" :label="$t('orderD.goodsSum') + $store.state.app.currencySymbol" align="center"></BmTableColumn>
                <BmTableColumn prop="storeDisAmount" :label="$t('orderD.StoreDiscount') + $store.state.app.currencySymbol" align="center"></BmTableColumn>
                <BmTableColumn prop="commission" :label="$t('orderD.CommissionTaxes')">
                    <template #default="scope">
                        <div>{{ $t("orderD.VAT") }}:{{ $store.state.app.currencySymbol }}{{ scope.row.valueAddedTax }}</div>
                        <div>{{ $t("orderD.commission") }}:{{ $store.state.app.currencySymbol }}{{ scope.row.commission }}</div>
                    </template>
                </BmTableColumn>
            </BmTable>
            <div class="goodsCount">
                <div class="flex vcenter item">
                    <!-- 商品总金额 平台优惠金额 店铺优惠金额-->
                    <span class="sum">{{ $t("orderD.amountGoods") }}(</span><span>{{ $store.state.app.currencySymbol }}</span
                    ><span>): &#8195;{{ orderList.productAmount }} &#8195;&#8195;{{ $t("orderD.PlatformDiscountAmount") }}({{ $store.state.app.currencySymbol }}: &#8195;</span
                    ><span> {{ orderList.platformDisAmount }} &#8195;&#8195;{{ $t("orderD.StoreDiscountAmount") }}(</span><span>{{ $store.state.app.currencySymbol }}</span
                    ><span>)：&#8195;{{ orderList.storeDisAmount }} </span>
                </div>
                <div class="flex vcenter item">
                    <!--商家配送费 增值税 佣金 -->
                    {{ $t("orderD.DistributionFee") }}({{ $store.state.app.currencySymbol }}): &#8195;{{ orderList.sellerFreightAmount }}&#8195;&#8195; {{ $t("orderD.VAT") }}({{
                        $store.state.app.currencySymbol
                    }}): &#8195;{{ orderList.valueAddedTax }} &#8195;&#8195;{{ $t("orderD.commission") }}({{ $store.state.app.currencySymbol }})：&#8195;{{ orderList.commission }} &#8195;&#8195;{{
                        $t("orderD.MReceivableAmount")
                    }}({{ $store.state.app.currencySymbol }})：&#8195;{{ orderList.sellerRealIncome }}
                    <span class="ml-15">
                        <el-popover placement="top-start" :width="400" trigger="hover">
                            <template #reference>
                                <i class="el-icon-info" style="font-size: 18px;"></i>
                            </template>
                            <div class="p-20">
                                <div class="flex between mb-20">
                                    <span>
                                        <svg class="icon" aria-hidden="true" style="font-size: 15px;">
                                            <use xlink:href="#icondoubt"></use>
                                        </svg>
                                    </span>
                                    <span class="green"> {{ $t("orderD.MReceivableAmount") }}:&#8195; {{ orderList.sellerRealIncome }} </span>
                                </div>
                                <div style="font-weight: 800;" class="mb-10">{{ $t("orderD.explain") }}</div>
                                <div>{{ $t("orderD.MRAccount") }}</div>
                            </div>
                        </el-popover>
                        <!-- <el-tooltip placement="top">
                            <template #content>
                                多行信息<br/>第二行信息
                            </template>
                            <svg class="icon" aria-hidden="true" style="font-size: 15px;">
                                <use xlink:href="#icondoubt"></use>
                            </svg>
                        </el-tooltip> -->
                    </span>
                </div>
            </div>
        </div>
        <!-- 收货信息 -->
        <div class="mb-50">
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("orderD.goodsReceivingInfo") }}</div>
                </div>
                <div>
                    <!-- 联系买家 -->
                    <!-- <span class="ml-20"
                        ><el-button plain type="primary">{{ $t("orderD.ContactBuyer") }}</el-button></span
                    > -->
                </div>
            </div>
            <div class="goodsInfo" v-if="orderList.deliveryType == 1">
                <!-- 收货人：联系地址：会员信息 -->
                <div class="mb-15">{{ $t("orderD.consignee") }}&#8195;{{ orderList.receiverName }} &#8195;{{ orderList.receiverPhone }}</div>
                <div class="mb-15">
                    <span>{{ $t("orderD.contactAddress") }}&#8195;{{ orderList.receiverCompleteAddress }}</span>
                </div>
                <div>{{ $t("orderD.userInfo") }}&#8195;{{ orderList.buyerAccount }}&#8195; {{ $t("orderD.nickname") }}&#8195;{{ orderList.buyerNickname }}</div>
            </div>
            <div class="goodsInfo" v-if="orderList.deliveryType == 2">
                <!-- 收货人：联系地址：会员信息 -->
                <div class="mb-15">{{ $t("orderD.consignee") }}&#8195;☆☆☆☆☆☆</div>
                <div class="mb-15">
                    <span>{{ $t("orderD.contactAddress") }}&#8195;☆☆☆☆☆☆</span>
                </div>
                <div>{{ $t("orderD.userInfo") }}&#8195;☆☆☆☆☆☆</div>
            </div>
        </div>
        <div class="mb-50">
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("orderD.buyRemark") }}</div>
                    <span class="ml-20 orange">{{ $t("orderD.buyMarkAdd") }}</span>
                </div>
                <div>
                    <span class="ml-20">
                        <!-- <el-popover
                            placement="top"
                            title="标题"
                            :width="200"
                            trigger="click"
                        >
                            <template #reference>
                                <el-button type="primary" plain>查看备注历史</el-button>
                            </template>
                            <div>
                                这是一段内容,这是一段内容,这是一段内容,这是一段内容。
                            </div>
                        </el-popover> -->
                    </span>
                </div>
            </div>
            <div class="buyRemark" style="word-wrap:break-word;">{{ orderList.note }}</div>
        </div>
        <div class="mb-50">
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("orderD.sellerMark") }}</div>
                    <span class="ml-20 orange">{{ $t("orderD.orderMarkTips") }}</span>
                </div>
                <div>
                    <!-- 添加备注 -->
                    <el-button type="primary" @click="bitchRemarks">{{ $t("orderD.addRemark") }}</el-button>
                    <span class="ml-20">
                        <!-- 查看备注历史 -->
                        <el-popover placement="top" :title="$t('orderD.HistoryNote')" :width="500" trigger="click">
                            <template #reference>
                                <el-button type="primary" plain>{{ $t("orderD.remarkHistory") }}</el-button>
                            </template>
                            <div v-for="(item, i) in sellerRemarkList" :key="i" style="min-width: 400px;" class="mb-15 p-15">
                                <div style="width: 400px;">{{ item.remark }}</div>
                                <div>{{ item.createTime }}</div>
                            </div>
                        </el-popover>
                    </span>
                </div>
            </div>
            <div class="buyRemark">
                <!-- 买家备注 暂无数据 -->
                <div v-if="sellerRemarkList.length > 0" style="word-wrap:break-word;">
                    {{ sellerRemarkList[0].remark }}
                </div>
                <div v-else style="text-align: center;">{{ $t("orderD.noData") }}</div>
            </div>
        </div>
        <div class="mb-50">
            <div class="flex vcenter mb-15">
                <!-- 物流信息 订单物流信息-->
                <div class="title flex vcenter">{{ $t("orderD.logisticsInfo") }}</div>
                <span class="ml-20 light-grey">{{ $t("orderD.orderLogisticsInfo") }}</span>
            </div>
            <div class="flex logisticsInfo">
                <div class="item">
                    <!-- 快递公司 快递单号-->
                    <div class="mb-30">{{ $t("orderD.express") }} {{ orderList.deliveryCompany }}</div>
                    <div class="mb-30">
                        <span>{{ $t("orderD.deliverySn") }} {{ orderList.deliverySn }}</span
                        ><span class="ml-86 green cp" v-clipboard:copy="orderList.deliverySn" v-clipboard:success="onCopy" v-clipboard:error="onError">{{ $t("copy") }}</span>
                    </div>
                    <!-- <div><el-button plain>修改物流信息</el-button></div> -->
                </div>
                <div class="item">
                    <div class="mb-30">
                        <!-- 查看更多物流信息 -->
                        <el-popover placement="bottom" :title="$t('orderD.logisticsInfo')" :width="500" trigger="click">
                            <template #reference>
                                <div class="green cp" style="width: 200px;">{{ $t("orderD.checkLogisticsInfo") }}</div>
                            </template>
                            <div>
                                <el-timeline>
                                    <el-timeline-item
                                        v-for="(activity, index) in logisticsInformationList.locusList"
                                        :key="index"
                                        :color="activity.color"
                                        size="large"
                                        :timestamp="activity.createTime"
                                    >
                                        {{ activity.context }}
                                    </el-timeline-item>
                                </el-timeline>
                            </div>
                        </el-popover>
                    </div>
                    <div style="height: 150px;">
                        <el-timeline>
                            <el-timeline-item v-for="(activity, index) in locusList" :key="index" :color="activity.color" size="large" :timestamp="activity.createTime">
                                {{ activity.context }}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div>
            </div>
        </div>
        <div class="mb-50">
            <!-- 售后信息 -->
            <div class="flex mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("orderD.returnInfo") }}</div>
                </div>
            </div>
            <!--退款编号 退款金额 申请时间 申请人 退款状态 退款时间  备注-->
            <BmTable border :data="orderReturnList" style="width: 100%" min-height="250" v-loading="tableLoading">
                <BmTableColumn prop="returnSn" :label="$t('orderD.returnNum')" align="center"></BmTableColumn>
                <BmTableColumn prop="returnAmount" :label="$t('orderD.refundAmount')" align="center"></BmTableColumn>
                <BmTableColumn prop="createTime" :label="$t('orderD.proposerTime')" align="center"></BmTableColumn>
                <BmTableColumn prop="createUserName" :label="$t('orderD.proposer')" align="center"></BmTableColumn>
                <BmTableColumn prop="status" :label="$t('orderD.returnStatus')" align="center">
                    <template #default="scope">
                        <div>
                            <!-- {{
                                scope.row.status === 1
                                    ? $t("orderD.MOProcessed") //"商家运营待处理"
                                    : scope.row.status === 2
                                    ? $t("orderD.backDoor") //"待自行寄回/上门取件"
                                    : scope.row.status === 3
                                    ? $t("orderD.MOReceived") //"商家/运营待收货"
                                    : scope.row.status === 4
                                    ? $t("orderD.forrefund") //"待退款"
                                    : scope.row.status === 5
                                    ? $t("orderD.refundSuccess") //"退款成功"
                                    : scope.row.status === 6
                                    ? $t("orderD.CloseAfterSalesOrder") //"关闭售后单"
                                    : scope.row.status === 7
                                    ? $t("orderD.MOReApp") //"商家/运营驳回申请"
                                    : scope.row.status === 8
                                    ? $t("orderD.MORefuseAcceptReturn") //"商家/运营拒收退货商品"
                                    : "--"
                            }} -->
                            {{
                                scope.row.status == 1
                                    ? $t("platformDe.buyersApplyForAfterSales") //"买家申请售后"
                                    : scope.row.status == 3
                                    ? $t("platformDe.merchantReviewRejected") //"商家审核驳回"
                                    : scope.row.status == 4
                                    ? $t("platformDe.sendBackWaitConfirmReceive") //"已寄回,待商家确认收货"
                                    : scope.row.status == 5
                                    ? $t("platformDe.CourierSuccessfullyCollectsParcel") //"快递员揽件成功"
                                    : scope.row.status == 6
                                    ? $t("platformDe.sellerConfirmReceive") //"商家确定收货"
                                    : scope.row.status == 7
                                    ? $t("platformDe.refundProcessStatus4") //"平台已拒收,售后单关闭"
                                    : scope.row.status == 8
                                    ? $t("platformDe.returnOrderStatus5") //"退款成功"
                                    : scope.row.status == 9
                                    ? $t("platformDe.returnOrderOperationStatus10") //"FBT订单,审核不通过关闭订单"
                                    : scope.row.status == 10
                                    ? $t("platformDe.returnOrderOperationStatus11") //"买家超时未填写退货单号,自动关闭售后单"
                                    : scope.row.status == 11
                                    ? $t("platformDe.returnOrderOperationStatus12") //"卖家驳回后,买家超时未客服介入,自动关闭售后单"
                                    : scope.row.status == 12
                                    ? $t("platformDe.returnOrderOperationStatus13") //"卖家拒收后,买家超时未客服介入,自动关闭售后单"
                                    : scope.row.status == 13
                                    ? $t("platformDe.fBTOrderRejectAndCloseTheOrder") //"FBT订单,拒收关闭订单"
                                    : scope.row.status == 14
                                    ? $t("platformDe.undoIsClosed") //"撤销已关闭"
                                    : scope.row.status == 15
                                    ? $t("platformDe.operationClosed") //"平台关闭"
                                    : scope.row.status == 16
                                    ? $t("platformDe.sellerEditApply") //"买家修改申请"
                                    : scope.row.status == 17
                                    ? $t("platformDe.sellerEditExpressNum") //"买家修改运单号"
                                    : scope.row.status == 18
                                    ? $t("platformDe.timeoutSysAutoPass") //"因商家超时未处理, 系统自动审核通过"
                                    : scope.row.status == 19
                                    ? $t("platformDe.timeoutConfirmSysAutoReceiving") //"因商家超时未确认收货，系统自动收货"
                                    : scope.row.status == 20
                                    ? $t("platformDe.buyerCancelVisitFetch") //"买家取消上门取件"
                                    : scope.row.status == 21
                                    ? $t("platformDe.workOrderCancel") //"工单撤销关闭"
                                    : scope.row.status == 22
                                    ? $t("platformDe.orderEnd") //"工单完结关闭"
                                    : ""
                            }}
                        </div>
                        <!-- 平台同意 1退款退货 和 同意 0退款 -->
                        <div v-if="scope.row.userType == 3 && scope.row.status == 2">
                            <div class="mb-20 header">{{ $t("platformDe.platformAgreesRefundProgress") }}</div>
                            <!-- <div>{{ $t("platformDe.RefundApplyPassTimeCheck") }}</div> -->
                        </div>
                        <!-- 商家审核通过,退款中 -->
                        <div v-if="scope.row.userType == 2 && scope.row.status == 2">
                            <div class="mb-20 header">{{ $t("platformDe.sellerAgreesRefundProgress") }}</div>
                            <!-- 您的退款申请我们已经申请通过, 具体到账时间请查看退款规则或联系客服,谢谢支持理解! -->
                            <!-- <div>{{ $t("platformDe.RefundApplyPassTimeCheck") }}</div> -->
                        </div>
                        <div v-if="scope.row.userType == 3 && scope.row.status == 23">
                            <div class="mb-20 header">{{ $t("platformDe.platformAgreesRefundWaitBuyer") }}</div>
                            <!-- <div>{{ $t("platformDe.salesReturnPassEnterExpressNum") }}</div> -->
                        </div>
                        <!-- 商家同意退货退款, 等待买家寄回 -->
                        <div v-if="scope.row.userType == 2 && scope.row.status == 23">
                            <div class="mb-20 header">{{ $t("platformDe.sellerAgreesRefundWaitBuyer") }}</div>
                            <!--您的退货退款申请我们已经申请通过, 请填写邮寄单号  -->
                            <!-- <div>{{ $t("platformDe.salesReturnPassEnterExpressNum") }}</div> -->
                        </div>
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="" :label="$t('orderD.refundTime')" align="center"></BmTableColumn>
                <BmTableColumn prop="applyReason" :label="$t('orderD.remark')" align="center"></BmTableColumn>
            </BmTable>
        </div>
        <div class="mb-50">
            <!-- 退货地址信息 -->
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("orderD.returnAddressInfo") }}</div>
                </div>
                <div>
                    <span class="ml-20"
                        ><el-button plain>{{ $t("copy") }}</el-button></span
                    >
                </div>
            </div>
            <div class="refund">
                <div class="mb-20">{{ $t("orderD.contacts") }} &#8195;{{ returnAddress.name }}&#8195;{{ returnAddress.phone }}</div>
                <div>{{ $t("orderD.contactAddress") }} &#8195;{{ returnAddress.address }} {{ returnAddress.detailAddress }}</div>
            </div>
        </div>
        <div>
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("orderD.serviceInfo") }}</div>
                </div>
                <div>
                    <!-- <span class="ml-20"><el-button plain>复制</el-button></span> -->
                </div>
            </div>
            <div class="serve">
                <div class="mb-20" v-for="(item, i) in servicePromises" :key="i">
                    <span>{{ item.title }}:</span><span class="ml-15">{{ item.isRequired == 1 ? $t("orderD.support") : item.isRequired == 0 ? $t("orderD.no") : "-" }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 批量发货 -->
    <el-dialog :title="$t('orderD.batchDelivery')" @close="batchVisible" v-model="dialogFormVisible" width="70%">
        <div class="dialog_tips">
            <div>
                {{ $t("orderD.batchDelivery") }}
            </div>
            <div class="ml-25">1. {{ $t("orderD.deliveryTip1") }}</div>
            <div class="ml-25">2. {{ $t("orderD.deliveryTip2") }}</div>
        </div>
        <div class="dialog_info">{{ $t("orderD.deliveryTip3") }}</div>
        <div class="mb-10">
            <el-radio-group v-model="batchForm.expressType">
                <!--在线下单 自己联系物流 -->
                <!-- <el-radio-button label="0">{{ $t("orderD.OnlineOrder") }}</el-radio-button> -->
                <el-radio-button label="1">{{ $t("orderD.ContactLogistics") }}</el-radio-button>
            </el-radio-group>
        </div>
        <el-form :model="batchForm" class="mb-25" label-width="200">
            <!-- 发货方式 物流发货-->
            <el-form-item v-if="batchForm.expressType == 1" :label="$t('orderD.deliveryMethod')" :label-width="formLabelWidth">
                <el-radio v-model="express" label="1">{{ $t("orderD.LogisticsDelivery") }}</el-radio>
            </el-form-item>
            <!--v  请选择快递公司-->
            <el-form-item v-if="batchForm.expressType == 1" :label="$t('orderD.ChooseExpress')" :label-width="formLabelWidth">
                <el-select v-model="batchForm.deliveryCompany" :placeholder="$t('orderD.selectExpressCompany')" style="width: 543px;height: 32px;">
                    <el-option label="Tospino" value="1"></el-option>
                </el-select>
            </el-form-item>
            <!-- 发货地址 请选择快递公司-->
            <el-form-item :label="$t('orderD.shipAddress')" :label-width="formLabelWidth">
                <div class="flex vcenter">
                    <el-select v-model="batchForm.sendAddressId" :placeholder="$t('orderD.selectExpressCompany')" style="width: 543px;height: 32px;">
                        <el-option v-for="(item, i) in sendfAddressList" :key="i" :label="item.address" :value="item.id"></el-option>
                    </el-select>
                    <!-- <div class="ml-25">
                        <el-popover placement="top-start" :title="$t('orderD.notice')" :width="200" trigger="hover">
                            <template #reference>
                                <div class="cp green">{{ $t("orderD.deliveryNotice") }}</div>
                            </template>
                        </el-popover>
                    </div> -->
                </div>
            </el-form-item>
            <el-form-item :label="$t('orderD.returnAddress')" :label-width="formLabelWidth">
                <div class="flex vcenter">
                    <el-select v-model="batchForm.returnAddressId" :placeholder="$t('orderD.selectExpressCompany')" style="width: 543px;height: 32px;">
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
                <!-- 快递单号 -->
                <div class="title flex vcenter">{{ $t("orderD.deliverySn") }}</div>
            </div>
        </div>
        <el-form :model="tableData_2" ref="expressRef">
            <el-table :data="tableData_2.form" height="250" border style="width: 100%" class="mb-62">
                <el-table-column prop="orderSn" :label="$t('orderD.orderNumber')" min-width="180"> </el-table-column>
                <el-table-column prop="status" :label="$t('orderD.deliverGoods')" width="180">
                    <template #default="scope">
                        {{ scope.row.status === 1 ? $t("orderD.waitForDelivery") : "" }}
                    </template>
                </el-table-column>
                <el-table-column prop="receiverName" :label="$t('orderD.consignee')" width="180"> </el-table-column>
                <el-table-column prop="receiverPhone" :label="$t('orderD.phone')" width="180"> </el-table-column>
                <el-table-column prop="receiverCompleteAddress" :label="$t('orderD.area')" min-width="200"> </el-table-column>
                <el-table-column prop="deliverySn" :label="$t('orderD.orderNum')" width="180">
                    <template #default="scope">
                        <el-form-item v-if="batchForm.expressType == 0" :prop="`form.${scope.$index}.deliverySn`">
                            <el-input v-model="scope.row.deliverySn" type="number" key="deliverySn" :disabled="batchForm.expressType == 0" />
                        </el-form-item>
                        <el-form-item v-if="batchForm.expressType == 1" :prop="`form.${scope.$index}.deliverySn`" :rules="rulesCommon.required">
                            <el-input v-model="scope.row.deliverySn" type="number" key="deliverySn" />
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <span class="dialog-footer flex center">
            <el-button @click="batchVisible">{{ $t("orderD.cancel") }}</el-button>
            <el-button type="primary" @click="subBatchShipents">{{ $t("orderD.confirm") }}</el-button>
        </span>
        <div>
            <el-radio v-model="radio" label="1" class="green">{{ $t("orderQuery.IHaveAgreedOnlineDeliveryAgreement") }}</el-radio>
            <a href="#/message/agreement?type=30" target="_blank">{{ $t("orderQuery.agreement") }}</a>
        </div>
    </el-dialog>
    <BmDialog v-model:visible="visible" :title="$t('orderD.addRemark')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form label-position="left">
            <el-form-item :label="$t('remark')">
                <el-input :placeholder="$t('pleaseEnter')" v-model="remarks" type="textarea" maxlength="500" style="width: 500px;" :rows="5" show-word-limit />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, unref, getCurrentInstance, onMounted, nextTick, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { omsorderDetail, umsQueryRefundAddress, umsQuerySendAddress, omsorderSellerBatchDelivery, omsorderSellerBatchRemark } from "@/api/goods";
import { deepClone } from "@/utils/index";
export default {
    name: "orderDetail",
    setup() {
        const { proxy } = getCurrentInstance();
        const router = useRouter();
        const route = useRoute();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        const deleteRow = (index, rows) => {
            rows.splice(index, 1);
        };

        onMounted(() => {
            console.log(route.query.id);
        });

        let radio = ref("1");

        let dialogFormVisible = ref(false);

        let formLabelWidth = ref("65px");

        let tableLoading = ref(true);

        // 发货方式
        let express = ref("1");

        // dialog 表格数据
        const tableData_2 = reactive({ form: [] });
        let expressRef = ref(null);

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

        // 步骤条
        let active = ref();
        let steps = ref([]);

        // 订单数据信息
        let orderList = ref({});
        let orderReturnList = ref([]); // 售后服务信息
        let logisticsInformationList = ref({}); // 更多物流信息
        let locusList = ref([]); // 物流信息
        let returnAddress = ref({}); // 退货地址信息
        let servicePromises = ref([]); // 服务信息
        let sellerRemarkList = ref([]); //
        const getDataList = () => {
            let id = route.query.id;
            omsorderDetail(id)
                .then((res) => {
                    console.log(res);
                    tableLoading.value = false;
                    orderList.value = res.data.order;
                    orderReturnList.value = res.data.orderReturnList;
                    logisticsInformationList.value = deepClone(res.data.logisticsInformationList);
                    returnAddress.value = res.data.returnAddress;
                    servicePromises.value = res.data.servicePromises;
                    sellerRemarkList.value = res.data.sellerRemarkList;
                    if (Object.keys(res.data.logisticsInformationList.locusList).length !== 0) {
                        res.data.logisticsInformationList.locusList.forEach((v, i) => {
                            if (i < 3) {
                                locusList.value.push({
                                    context: v.context,
                                    createTime: v.createTime,
                                    color: "#f2f2f2"
                                });
                            }
                        });
                        locusList.value[0].color = "#0bbd87";
                        logisticsInformationList.value.locusList.map((v) => (v.color = "#f2f2f2"));
                        logisticsInformationList.value.locusList[0].color = "#0bbd87";
                    }

                    // createTime: orderList.value.createTime,
                    //         paymentTime: orderList.value.paymentTime,
                    //         deliveryTime: orderList.value.deliveryTime, // 已发货
                    //         promisedDeliveryTime: orderList.value.promisedDeliveryTime, // 承诺发货时间
                    //         deliveryTimeOutMinute: orderList.value.deliveryTimeOutMinute, // 超时发货时间
                    //         wmsDealTime: orderList.value.wmsDealTime, // 仓库处理时间
                    //         sendWmsTime: orderList.value.sendWmsTime, // 待推送wms仓库时间
                    //         outStorageTime: orderList.value.outStorageTime, // 出库时间
                    //         cancelTime: orderList.value.closeMills, // 交易关闭

                    let step = [
                        {
                            title: proxy.$t("orderD.submitOrder"), //"提交订单",
                            createTime: orderList.value.createTime,
                            paymentTime: "",
                            deliveryTime: "",
                            promisedDeliveryTime: "",
                            deliveryTimeOutMinute: "",
                            wmsDealTime: "",
                            sendWmsTime: "",
                            outStorageTime: "",
                            cancelTime: ""
                        },
                        {
                            title: proxy.$t("orderD.paySuccess"), //"付款成功",
                            paymentTime: orderList.value.paymentTime,
                            deliveryTime: "",
                            promisedDeliveryTime: "",
                            deliveryTimeOutMinute: "",
                            wmsDealTime: "",
                            sendWmsTime: "",
                            outStorageTime: "",
                            cancelTime: ""
                        },
                        {
                            title: proxy.$t("orderD.waitForDelivery"), //"等待发货",
                            promisedDeliveryDateTime: orderList.value.promisedDeliveryDateTime, // 承诺发货时间
                            deliveryTimeOutMinute: orderList.value.deliveryTimeOutMinute, // 超时发货时间
                            sendWmsTime: orderList.value.sendWmsTime, // 待推送wms仓库时间
                            wmsDealTime: orderList.value.wmsDealTime, // 仓库处理时间
                            outStorageTime: orderList.value.outStorageTime, // 出库时间
                            deliveryTime: orderList.value.deliveryTime, // 已发货
                            refundSuccessTime: orderList.value.refundSuccessTime // 退款成功时间
                        },
                        {
                            title: proxy.$t("orderD.fulfill"), //"已完成",
                            deliveryTime: "",
                            promisedDeliveryTime: "",
                            deliveryTimeOutMinute: "",
                            wmsDealTime: "",
                            sendWmsTime: "",
                            outStorageTime: "",
                            cancelTime: "",
                            receiveTime: orderList.value.receiveTime // 已完成  确认收货时间
                        },
                        {
                            title: proxy.$t("orderD.waitReceiving"), //"待收货",
                            promisedDeliveryDateTime: orderList.value.promisedDeliveryDateTime, // 承诺发货时间
                            deliveryTimeOutMinute: orderList.value.deliveryTimeOutMinute, // 超时发货时间
                            sendWmsTime: orderList.value.sendWmsTime, // 待推送wms仓库时间
                            wmsDealTime: orderList.value.wmsDealTime, // 仓库处理时间
                            outStorageTime: orderList.value.outStorageTime, // 出库时间
                            deliveryTime: orderList.value.deliveryTime // 已发货
                        },
                        {
                            title: proxy.$t("orderD.thencancel"), //"已取消",
                            createTime: "",
                            paymentTime: "",
                            deliveryTime: "",
                            promisedDeliveryTime: "",
                            deliveryTimeOutMinute: "",
                            wmsDealTime: "",
                            sendWmsTime: "",
                            outStorageTime: "",
                            cancelTime: orderList.value.cancelTime // 交易关闭 取消时间
                        },
                        {
                            title: proxy.$t("orderD.invalidOrders"), //"交易关闭",
                            createTime: "",
                            paymentTime: "",
                            deliveryTime: "",
                            promisedDeliveryTime: "",
                            deliveryTimeOutMinute: "",
                            wmsDealTime: "",
                            sendWmsTime: "",
                            outStorageTime: "",
                            cancelTime: orderList.value.cancelTime // 交易关闭 取消时间
                        },
                        {
                            title: proxy.$t("orderD.hasRejected"), // "已拒收",
                            deliveryTime: "",
                            promisedDeliveryTime: "",
                            deliveryTimeOutMinute: "",
                            wmsDealTime: "",
                            sendWmsTime: "",
                            outStorageTime: "",
                            cancelTime: "",
                            rejectTime: orderList.value.rejectTime // 拒收时间
                        }
                    ];

                    let paymentType = orderList.value.paymentType; // 1->在线支付；2->货到付款
                    let status = res.data.order.status;

                    if (status == 0) {
                        // 待付款
                        steps.value.push(step[0], step[1], step[2], step[3]);
                        active.value = 0;
                    } else if (status == 1) {
                        // 待发货,
                        if (paymentType === 1) {
                            steps.value = [step[0], step[1], step[2], step[3]];
                            active.value = 1;
                        } else {
                            steps.value = [step[0], step[2], step[3]];
                            active.value = 0;
                        }
                    } else if (status == 2) {
                        // 待收货
                        if (paymentType === 1) {
                            steps.value = [step[0], step[1], step[2], step[3]];
                            active.value = 2;
                        } else {
                            steps.value = [step[0], step[2], step[3]];
                            active.value = 1;
                        }
                    } else if (status == 4) {
                        // 已完成
                        if (paymentType === 1) {
                            steps.value = [step[0], step[1], step[2], step[3]];
                            active.value = 3;
                        } else {
                            steps.value = [step[0], step[2], step[3]];
                            active.value = 2;
                        }
                    } else if (status == 5) {
                        // 已取消
                        steps.value = [step[0], step[5]];
                        active.value = 1;
                    } else if (status == 6) {
                        // 交易关闭 超时取消
                        steps.value = [step[0], step[5]];
                        active.value = 1;
                    } else if (status == 7) {
                        // 拒收
                        steps.value = [step[0], step[2], step[7]];
                        active.value = 2;
                    }

                    let timer = setInterval(() => {
                        orderList.value.deliveryTimeOutMinute--;
                        if (orderList.value.deliveryTimeOutMinute === 0) {
                            clearInterval(timer);
                        }
                    }, 1000);
                })
                .catch(() => {});
        };
        getDataList();

        const onCopy = (e) => {
            proxy.$message.success(e.text);
        };
        const onError = (e) => {
            proxy.$message.error("Failed to copy texts");
        };

        let refundAddressList = ref([]); // 退货地址
        let sendfAddressList = ref([]); // 发货地址
        const refundAddress = () => {
            umsQueryRefundAddress()
                .then((res) => {
                    console.log(res);
                    refundAddressList.value = res.data;
                    batchForm.returnAddressId = res.data[0].id;
                })
                .catch(() => {});
        };
        refundAddress();

        const sendAddress = () => {
            umsQuerySendAddress()
                .then((res) => {
                    console.log(res);
                    sendfAddressList.value = res.data;
                    batchForm.sendAddressId = res.data[0].id;
                })
                .catch(() => {});
        };
        sendAddress();

        // 关闭dialog
        const batchVisible = () => {
            dialogFormVisible.value = false;
            tableData_2.form = [];
        };

        // 快递单号校验
        const rulesCommon = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" },
            isSelect: { required: true, message: proxy.$t("pleaseEnter"), trigger: "change" }
        });

        // 批量发货
        const batchShipments = () => {
            dialogFormVisible.value = true;
            tableData_2.form.push({
                orderSn: orderList.value.orderSn,
                receiverName: orderList.value.receiverName,
                receiverPhone: orderList.value.receiverPhone,
                receiverCompleteAddress: orderList.value.receiverCompleteAddress,
                deliverySn: "",
                status: orderList.value.status,
                orderId: orderList.value.id
            });
        };

        // 提交批量发货
        const subBatchShipents = () => {
            expressRef.value.validate((valid) => {
                if (valid) {
                    batchForm.deliveryItems = [];

                    batchForm.deliveryItems.push({
                        deliverySn: tableData_2.form[0].deliverySn,
                        orderId: orderList.value.id
                    });
                    const loading = proxy.$loading();
                    omsorderSellerBatchDelivery(batchForm)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            dialogFormVisible.value = false;
                            tableData_2.form = [];
                            router.go(0);
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        let visible = ref(false);
        let remarks = ref("");

        // 批量修改备注
        const confirm = () => {
            const loading = proxy.$loading();
            omsorderSellerBatchRemark({ remark: remarks.value, orderIds: [orderList.value.id] })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    visible.value = false;
                    getDataList();
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
        };

        const cancel = () => {
            visible.value = false;
        };

        // 批量备注
        const bitchRemarks = () => {
            visible.value = true;
        };

        return {
            onCopy,
            onError,
            deleteRow,
            getDataList,
            orderList,
            orderReturnList,
            logisticsInformationList,
            tableLoading,
            locusList,
            steps,
            active,
            returnAddress,
            dialogFormVisible,
            batchShipments,
            batchVisible,
            batchForm,
            refundAddressList,
            sendfAddressList,
            formLabelWidth,
            tableData_2,
            expressRef,
            subBatchShipents,
            rulesCommon,
            express,
            radio,
            visible,
            remarks,
            confirm,
            cancel,
            bitchRemarks,
            servicePromises,
            sellerRemarkList
        };
    }
};
</script>
<style>
html,
body {
    overflow-y: auto;
}
</style>
<style lang="scss" scoped>
.wrap-container {
    width: 100%;
    padding: 40px 185px 168px 104px;
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

    .order-num {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
    }

    .goodsCount {
        width: 100%;
        border: 1px solid #ededed;

        .item {
            justify-content: flex-end;
            height: 57px;
            font-size: 12px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 17px;
            padding-right: 59px;
        }

        .item:nth-child(1) {
            border-bottom: 1px solid #ededed;
        }

        .sum {
            font-size: 12px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 17px;
        }
    }

    .goodsInfo {
        width: 100%;
        border: 1px solid #ededed;
        padding: 24px 17px 24px 17px;
    }

    .buyRemark {
        width: 100%;
        height: 105px;
        border: 1px solid #ededee;
        padding: 24px 17px 24px 17px;
    }

    .logisticsInfo {
        height: 255px;
        border: 1px solid #ededee;
        padding: 24px 17px 24px 17px;
        .item {
            width: 50%;
        }
        .item:nth-child(2) {
            padding-left: 100px;
            border-left: 1px solid #ededed;
        }
    }

    .refund {
        border: 1px solid #ededee;
        padding: 24px 17px 24px 17px;
    }

    .serve {
        border: 1px solid #ededee;
        padding: 24px 17px 24px 17px;
    }
}
img {
    width: 59px;
    height: 59px;
}
.dialog_tips {
    border: 1px solid #ffe58f;
    background-color: #fffbe6;
    width: 656px;
    border-radius: 2px;
    padding: 6px 0px 16px 14px;
    margin-bottom: 10px;
}

.dialog_info {
    border: 1px solid #42b8ff;
    background-color: #d9f1ff;
    width: 656px;
    border-radius: 2px;
    padding: 6px 0px 6px 40px;
    margin-bottom: 27px;
}
.rejectTips {
    width: 800px;
    background-color: #fffbe6;
    border: 1px solid #ffe58f;
    padding: 7px;
}
</style>
