<template>
    <div class="mb-25 p-15 bg-white round-4">
        <BmBreadcrumb />
        <div class="flex vcenter rejectTips mb-10">
            <span>
                <svg class="icon" aria-hidden="true" style="width: 25px;height: 25px;">
                    <use xlink:href="#iconicon-test"></use>
                </svg>
            </span>
            <span>{{ $t("platformDe.KPITips") }} </span>
        </div>
    </div>

    <div class="content p-25 bg-white round-4 flex">
        <div class="left">
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("platformDe.orderInfo") }}</div>
                </div>
            </div>
            <!-- 订单信息 -->
            <div class="left-item mb-20 bg-light-fa">
                <div class="order_time">
                    <!--订单号 下单时间 订单确认时间-->
                    <div class="mb-15">{{ $t("platformDe.orderSn") }}:&#8195; {{ omsOrder.orderSn }}</div>
                    <div class="mb-15">{{ $t("platformDe.createOrderTime") }}:&#8195; {{ omsOrder.createTime }}</div>
                    <div>{{ $t("platformDe.orderConfirmTime") }}:&#8195; {{ omsOrder.receiveTime }}</div>
                </div>
                <!-- goodsInfo 商品单价  购买数量-->
                <BmTable :data="omsOrder.items" border style="width: 100%">
                    <BmTableColumn prop="name" :label="$t('platformDe.goodsInfo')" width="563">
                        <template #default="scope">
                            <div class="flex">
                                <div>
                                    <BmImage v-if="scope.row.goodImg" class="goodsImg" :src="scope.row.goodImg" :preview-src-list="[scope.row.goodImg]" />
                                </div>
                                <div class="ml-10">
                                    <div>{{ scope.row.name }}</div>
                                    <div>
                                        <div>{{ scope.row.goodAttr }}</div>
                                    </div>
                                    <div>TSIN：{{ scope.row.skuTsin }}</div>
                                    <div>FNSKU：{{ scope.row.skuFnsku }}</div>
                                </div>
                            </div>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="goodPrice" :label="$t('platformDe.commodityPrice')" align="center"></BmTableColumn>
                    <BmTableColumn prop="goodQuantity" :label="$t('platformDe.purchaseQuantity')" align="center"></BmTableColumn>
                </BmTable>
                <!-- <div class="count" v-if="omsOrder.items">
                    {{ $t("platformDe.common") }}&#8195;{{ orderCount }}&#8195;{{ $t("platformDe.piecesGoods") }}&#8195; {{ $t("platformDe.paid") }}{{ $store.state.app.currencySymbol }}：{{
                        omsOrder.sellerRealIncome
                    }}
                    &#8195;（{{ $t("platformDe.freight") }}{{ $store.state.app.currencySymbol }}： {{ omsOrder.buyerFreightAmount }}）
                </div> -->
                <div class="userInfo mb-15" v-if="omsOrder.deliveryType == 1">
                    <div>{{ $t("platformDe.buyerInfo") }}: &#8195;{{ omsOrder.receiverName }} {{ omsOrder.receiverPhone }}</div>
                    <div>{{ $t("platformDe.contactAddress") }}: &#8195;{{ omsOrder.receiverProvince }} {{ omsOrder.receiverRegion }} {{ omsOrder.receiverDetailAddress }}</div>
                </div>
                <div class="userInfo mb-15" v-if="omsOrder.deliveryType == 2">
                    <div>{{ $t("platformDe.buyerInfo") }}: &#8195;☆☆☆☆☆☆</div>
                    <div>{{ $t("platformDe.contactAddress") }}: &#8195;☆☆☆☆☆☆</div>
                </div>
            </div>
            <!-- 商家信息 -->
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("platformDe.businessInfo") }}</div>
                </div>
            </div>
            <div class="shopInfo mb-15">
                <!--商家编码  店铺名称-->
                <div class="mb-25">
                    <span>{{ $t("platformDe.businessCode") }}: </span><span class="ml-30">&#8195;{{ omsOrder.storeCode }}</span>
                </div>
                <div class="mb-25">
                    <span>{{ $t("platformDe.storeName") }}: </span><span class="ml-30">&#8195;{{ omsOrder.storeName }}</span>
                </div>
            </div>
            <!-- 订单备注 -->
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("platformDe.businessRemark") }}</div>
                    <div class="ml-30 orange">{{ $t("platformDe.orderRemarkTips") }}</div>
                </div>
                <!-- 查看备注历史 -->
                <el-popover placement="bottom" :title="$t('platformDe.remarkhistory')" :width="500" trigger="click">
                    <template #reference>
                        <el-button class="green">{{ $t("platformDe.seeRemarkHistory") }}</el-button>
                    </template>
                    <div>this is a remark history</div>
                </el-popover>
            </div>
            <div class="remark mb-15" style="text-align: center;">{{ omsOrder.mnote }}</div>
            <!-- 物流信息 -->
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <!--物流信息  订单物流信息-->
                    <div class="title flex vcenter">{{ $t("platformDe.logisticsInfo") }}</div>
                    <div class="ml-30 light-grey">{{ $t("platformDe.orderLogisticsInfo") }}</div>
                </div>
            </div>
            <div class="express">
                <!-- 快递公司 快递单号 查看更多物流信息-->
                <!-- <div class="mb-15">收货人: {{ orderExpressData.arriveName }} {{ orderExpressData.arrivePhone }}</div> -->
                <div>{{ $t("platformDe.ExpressCompany") }}: {{ omsOrder.deliveryCompany }}</div>
                <div class="mb-15">
                    <span>{{ $t("platformDe.trackingNumber") }}: {{ omsOrder.deliverySn }}</span
                    ><span v-clipboard:copy="omsOrder.deliverySn" v-clipboard:success="onCopy" v-clipboard:error="onError" class="green ml-30 cp">{{ $t("copy") }}</span>
                </div>
                <div class="mb-30">
                    <el-popover placement="bottom" :title="$t('platformDe.logisticsInfo')" :width="500" trigger="click">
                        <template #reference>
                            <div class="green cp" style="width: 200px;">{{ $t("platformDe.viewMoreLogisticsInformation") }}</div>
                        </template>
                        <div>
                            <el-timeline>
                                <el-timeline-item v-for="(activity, index) in moreOrderExpessInfo" :key="index" :color="activity.color" size="large" :timestamp="activity.createTime">
                                    {{ activity.context }}
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                    </el-popover>
                </div>
                <el-timeline>
                    <el-timeline-item v-for="(activity, index) in orderExpessInfo" :key="index" :type="activity.type" :color="activity.color" size="large" :timestamp="activity.createTime">
                        {{ activity.context }}
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>

        <!-- 右边 状态 -->
        <div class="right">
            <!-- 售后状态 -->
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("platformDe.afterSaleState") }}</div>
                </div>
            </div>
            <!-- <div class="serviceState bg-light-fa">
                <div class="item1 flex between">
                    <span class="stateTitle_2">买家已寄回,等待商家收货</span><span><el-button plain>确认收货</el-button><el-button plain>拒收</el-button></span>
                </div>
                <div class="item2">退款金额 {{ $store.state.app.currencySymbol }}90.0</div>
            </div>
            <div class="serviceState bg-light-fa">
                <div class="item1 flex between">
                    <span class="stateTitle_3">买家已寄回,等待商家收货</span><span><el-button type="primary">处理</el-button></span>
                </div>
                <div class="item2">退款金额 {{ $store.state.app.currencySymbol }}90.0</div>
            </div> -->
            <!-- 工单状态 -->
            <div v-if="omsOrderReturn.workId" class="mb-15">
                <!-- 工单状态1->待举证 2->平台处理中 3->工单关闭 4->工单已完结 -->
                <div v-if="returnWork.status == 1" class="serviceState bg-light-fa">
                    <div class="item3">
                        <div class="flex between">
                            <!-- 等待商家提供凭证 上传凭证-->
                            <span>{{ $t("platformDe.waitingForTheMerchantToProvideTheVoucher") }}</span
                            ><span
                                ><el-button type="primary" plain @click="addExhibit(1)">{{ $t("platformDe.upCertificate") }}</el-button></span
                            >
                        </div>
                        <div>{{ $t("platformDe.exceed") }} {{ poofDown }} {{ $t("platformDe.automaticRefundToBuyer") }}</div>
                        <div>{{ $t("platformDe.voucherTips1") }}</div>
                        <div>{{ $t("platformDe.voucherTips2") }}</div>
                    </div>
                    <div class="item2">
                        <div class="flex between">
                            <span>{{ $t("platformDe.noObjection") }}: </span>
                            <!-- 退款退货 -->
                            <span
                                ><el-button @click="moneyback(2)" v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.returnType === 1" type="primary">{{
                                    $t("platformDe.agreeToRefund")
                                }}</el-button></span
                            >
                            <!-- 仅退款 -->
                            <span
                                ><el-button @click="moneyback(1)" v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.returnType === 0" type="primary">{{
                                    $t("platformDe.agreeToRefund")
                                }}</el-button></span
                            >
                        </div>
                    </div>
                </div>
                <div v-if="returnWork.status == 2" class="serviceState_2">
                    <div class="item3">
                        <div class="flex between">
                            <!-- 平台处理中 追加凭证-->
                            <span class="stateTitle">{{ $t("platformDe.platformProcessing") }}</span
                            ><span
                                ><el-button type="primary" plain @click="addExhibit(2)">{{ $t("platformDe.AddDocuments") }}</el-button></span
                            >
                        </div>
                        <!-- 平台处理需要时间,请耐心等待判定结果 -->
                        <div>{{ $t("platformDe.platformProcessingTips") }}</div>
                    </div>
                    <div class="item4">
                        <div class="flex between">
                            <span></span>
                            <!-- 退款退货 -->
                            <span
                                ><el-button @click="moneyback(2)" type="primary" v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.returnType === 1">{{
                                    $t("platformDe.agreeToRefund")
                                }}</el-button></span
                            >
                            <!-- 仅退款 -->
                            <span
                                ><el-button @click="moneyback(1)" type="primary" v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.returnType === 0">{{
                                    $t("platformDe.agreeToRefund")
                                }}</el-button></span
                            >
                        </div>
                    </div>
                </div>
                <div v-if="returnWork.status == 3" class="serviceState bg-light-fa p-30">
                    <!-- 工单关闭  -->
                    <span class="stateTitle">{{ $t("platformDe.ticketClosed") }}</span>
                </div>
                <!-- 工单已完结 显示 判责结果 -->
                <div v-if="returnWork.status == 4" class="serviceState bg-light-fa p-30">
                    <div class="mb-15">
                        <!-- 工单违规 -->
                        <!-- "均无责任"  "卖家责任" "买家责任"-->
                        <!-- "无需退款" "退款给买家" -->
                        <span v-if="returnWork.responsJudage == 3" class="stateTitle mb-15 mr-15">{{ $t("platformDe.workOrderViolation") }}</span>
                        <span class="stateTitle">{{
                            returnWork.responsJudage == 0
                                ? $t("platformDe.noResponsibility")
                                : returnWork.responsJudage == 1
                                ? $t("platformDe.sellerResponsibility")
                                : returnWork.responsJudage == 2
                                ? $t("platformDe.buyerResponsibility")
                                : ""
                        }}</span
                        ><span class="stateTitle">{{ returnWork.refundJudage == 0 ? $t("platformDe.noRefundRequired") : returnWork.refundJudage == 1 ? $t("platformDe.refundToBuyer") : "" }}</span>
                    </div>
                    <!-- 责任提示 -->
                    <div v-if="returnWork.responsJudage !== 3">{{ $t("platformDe.responsJudageTips") }}</div>
                    <!-- 工单违规 -->
                    <div v-if="returnWork.responsJudage == 3">
                        <!-- <div class="item3 mb-15 stateTitle"></div> -->
                        <div>{{ $t("platformDe.workOrderViolationTips") }}</div>
                    </div>
                </div>
            </div>
            <div v-else class="serviceState bg-light-fa mb-15">
                <div class="item1 flex between">
                    <span class="stateTitle" v-if="omsOrderReturn.orderType == 1">
                        {{
                            omsOrderReturn.status === 1
                                ? $t("platformDe.waitingForMerchantReview") //"等待商家审核"
                                : omsOrderReturn.status === 2
                                ? $t("platformDe.returnOrderStatus2") //"等待货品寄回"
                                : omsOrderReturn.status === 3
                                ? $t("platformDe.returnOrderStatus3") //"买家已寄回,等待商家收货"
                                : omsOrderReturn.status === 4
                                ? $t("platformDe.refundProcessStatus3") //"商家审核通过,退款中"
                                : omsOrderReturn.status === 5
                                ? $t("platformDe.returnOrderStatus5") //"退款成功"
                                : omsOrderReturn.status === 6
                                ? $t("platformDe.returnOrderStatus6") //"关闭售后单"
                                : omsOrderReturn.status === 7
                                ? $t("platformDe.returnOrderStatus7") //"商家/运营  已驳回,售后单关闭"
                                : omsOrderReturn.status === 8
                                ? $t("platformDe.refundProcessStatus4") //"商家拒收,售后单关闭"
                                : ""
                        }}
                    </span>

                    <div class="stateTitle" v-if="omsOrderReturn.orderType == 2 && omsOrderReturn.status !== 1">
                        <span>
                            {{
                                omsOrderReturn.status === 2
                                    ? $t("platformDe.returnOrderStatus2") //"等待货品寄回"
                                    : omsOrderReturn.status === 3
                                    ? $t("platformDe.returnOrderStatus3_2") //"买家已寄回,等待平台收货"
                                    : omsOrderReturn.status === 4
                                    ? $t("platformDe.returnOrderStatus4") //"平台审核通过,退款中"
                                    : omsOrderReturn.status === 5
                                    ? $t("platformDe.returnOrderStatus5") //"退款成功"
                                    : ""
                            }}
                        </span>
                        <!-- 关闭原因 6 "买家撤销已关闭" -->
                        <span v-if="omsOrderReturn.status === 6">
                            {{ omsOrderReturn.closeType == 6 ? $t("platformDe.buyerCloseCancel") : "" }}
                        </span>
                        <!-- "平台审核不通过关闭订单" -->
                        <span v-if="omsOrderReturn.status === 6">
                            {{ omsOrderReturn.closeType == 4 ? $t("platformDe.platformAuditRejectClose") : "" }}
                        </span>
                        <!-- "平台拒收关闭订单" -->
                        <span v-if="omsOrderReturn.status === 6"> {{ omsOrderReturn.closeType == 5 ? $t("platformDe.platformRejectReceiveClose") : "" }} </span>
                    </div>
                    <!-- "等待平台审核" -->
                    <span class="stateTitle" v-if="omsOrderReturn.orderType == 2">{{ omsOrderReturn.status === 1 ? $t("platformDe.returnOrderStatus1") : "" }}</span>
                    <!-- v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.status == 3 && omsOrderReturn.returnType === 1" -->
                    <!--确认收货 拒收 -->
                    <span v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.status == 3 && omsOrderReturn.returnType === 1"
                        ><el-button @click="affirmReceive" plain>{{ $t("platformDe.confirmTheReceiptOfGoods") }}</el-button
                        ><el-button @click="rejectReceive" plain>{{ $t("platformDe.reject") }}</el-button></span
                    >
                    <!--处理 退货退款 -->
                    <!-- v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.status == 1 && omsOrderReturn.returnType === 1" -->
                    <span v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.status == 1 && omsOrderReturn.returnType === 1"
                        ><el-button type="primary" @click="dispose(2)">{{ $t("platformDe.process") }}</el-button></span
                    >
                    <!--处理 仅退款 -->
                    <!-- v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.status == 1 && omsOrderReturn.returnType === 0" -->
                    <span v-if="omsOrderReturn.orderType == 1 && omsOrderReturn.status == 1 && omsOrderReturn.returnType === 0"
                        ><el-button type="primary" @click="dispose(1)">{{ $t("platformDe.process") }}</el-button></span
                    >
                </div>
                <div class="item2">
                    <!-- <div>{{ $t("platformDe.refundAmount") }}: {{ omsOrderReturn.returnAmount }}</div> -->
                    <div>{{ $t("platformDe.platformRefund") }}: {{ omsOrderReturn.returnAmount }} {{ $store.state.app.currencySymbol }}</div>
                    <div>{{ $t("platformDe.sellerRefund") }}: {{ omsOrderReturn.sellerWithholdAmount }} {{ $store.state.app.currencySymbol }}</div>
                </div>
            </div>

            <!-- 售后申请单 -->
            <div class="flex between mb-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("platformDe.afterSalesApplicationForm") }}</div>
                </div>
            </div>
            <div class="orderService bg-light-fa">
                <!--售后编码  -->
                <div class="mb-15">{{ $t("platformDe.afterSaleCoding") }}: {{ omsOrderReturn.returnSn }}</div>
                <!-- 售后类型: "退款" "退货退款"-->
                <div class="mb-15">
                    {{ $t("platformDe.afterSaleType") }}: <span>{{ omsOrderReturn.returnType === 0 ? $t("platformDe.refund") : omsOrderReturn.returnType === 1 ? $t("platformDe.refunds") : "" }}</span>
                </div>
                <!--发货状态: "未收到货" "已收到货" -->
                <div class="mb-15">
                    {{ $t("platformDe.deliveryStatus") }}:
                    <span>{{ omsOrderReturn.goodState === 0 ? $t("platformDe.notReceiveGoods") : omsOrderReturn.goodState === 1 ? $t("platformDe.receivedGoods") : "" }}</span>
                </div>
                <!--退款金额  -->
                <div class="mb-15">
                    {{ $t("platformDe.refundAmount") }}: <span>{{ $store.state.app.currencySymbol }}{{ omsOrderReturn.returnAmount }}</span>
                </div>
                <!--退款原因  -->
                <div>
                    {{ $t("platformDe.returnReason") }}: <span>{{ omsOrderReturn.applyReason }}</span>
                </div>
            </div>
            <el-table v-if="omsOrderReturn.returnType === 1" :data="omsOrderReturn.items" border style="width: 100%" class="bg-light-fa">
                <!-- 退款单价 退货数量-->
                <el-table-column prop="name" :label="$t('platformDe.goodsInfo')" width="563">
                    <template #default="scope">
                        <div class="flex">
                            <div>
                                <BmImage v-if="scope.row.productImage" class="goodsImg" :src="scope.row.productImage" :preview-src-list="[scope.row.productImage]" />
                            </div>
                            <div class="ml-10">
                                <div>{{ scope.row.productName }}</div>
                                <div>
                                    <div>{{ scope.row.productAttr }}</div>
                                </div>
                                <div>TSIN：{{ scope.row.skuTsin }}</div>
                                <div>FNSKU：{{ scope.row.skuFnsku }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="returnUnitAmount" :label="$t('platformDe.refundUnitPrice')"></el-table-column>
                <el-table-column prop="returnQuantity" :label="$t('platformDe.Num')"></el-table-column>
            </el-table>
            <!-- <div v-if="omsOrderReturn.returnType === 1" class="count bg-light-fa">实收 {{ omsOrderReturn.realAmount }} （运费： {{ omsOrderReturn.buyerFreightAmount }}）</div> -->
            <div v-if="omsOrderReturn.returnType === 1" class="userInfo mb-15 bg-light-fa">
                <div>{{ $t("platformDe.buyerInfo") }}: {{ omsOrderReturn.receiverName }} {{ omsOrderReturn.receiverPhone }}</div>
                <div>{{ $t("platformDe.returnAddress") }}: {{ omsOrderReturn.receiverProvince }} {{ omsOrderReturn.receiverCity }} {{ omsOrderReturn.receiverRegion }}</div>
            </div>

            <!-- 举证 举证详情-->
            <div v-if="omsOrderReturn.workId" class="flex between mb-15 mt-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("platformDe.detailsOfProof") }}</div>
                </div>
            </div>
            <div class="bg-light-fa" v-if="omsOrderReturn.workId" v-for="(item, i) in exhibit" :key="i">
                <!-- 卖家 -->
                <div v-if="item.utype == 2" class="flex between proof">
                    <div class="flex">
                        <img src="../../assets/img/compoter.png" />
                        <div class="ml-30">
                            <!-- 卖家举证 -->
                            <div class="mb-20 header">{{ $t("platformDe.sellerProof") }}</div>
                            <div>{{ item.workDesc }}</div>
                            <div>
                                <div class="mb-5">
                                    <template v-for="(items, index) in item.workMustVoucher" :key="index">
                                        <BmImage :src="items" v-if="items != ''" class="mr-5 goodsImg" :preview-src-list="[items]" />
                                    </template>
                                </div>
                                <div>
                                    <template v-for="(items_2, index_2) in item.workOptionalVoucher" :key="index_2">
                                        <BmImage :src="items_2" v-if="items_2 != ''" class="mr-5 goodsImg" :preview-src-list="[items_2]" />
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>{{ item.createTime }}</div>
                </div>
                <!-- 买家 买家举证-->
                <div v-if="item.utype == 1" class="flex between proof">
                    <div class="flex">
                        <svg class="icon" aria-hidden="true" style="font-size: 48px;">
                            <use xlink:href="#iconuser"></use>
                        </svg>
                        <div class="ml-30">
                            <div class="mb-20 header">{{ $t("platformDe.buyerProof") }}</div>
                            <div>{{ item.workDesc }}</div>
                            <div>
                                <div class="mb-5">
                                    <template v-for="(items, index) in item.workMustVoucher" :key="index" class="flex">
                                        <BmImage v-if="items" :src="items" class="mr-5 goodsImg" :preview-src-list="[items]" />
                                    </template>
                                </div>
                                <div>
                                    <template v-for="(items_2, index_2) in item.workOptionalVoucher" :key="index_2" class="flex">
                                        <BmImage v-if="items_2" :src="items_2" class="mr-5 goodsImg" :preview-src-list="[items_2]" />
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>{{ item.createTime }}</div>
                </div>
            </div>
            <div class="bottom"></div>

            <!-- 协商详情 -->
            <div class="flex between mb-15 mt-15">
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("platformDe.negotiationDetails") }}</div>
                </div>
            </div>
            <div class="bg-light-fa" v-for="(item, i) in orderReturnOperateHistoryVOS" :key="i">
                <!-- 运营申请售后 -->
                <div v-if="item.userType === 3" class="flex between proof">
                    <div class="flex">
                        <img src="../../assets/img/compoter.png" />
                        <div class="ml-30">
                            <div class="mb-20 header">
                                {{
                                    item.status == 1
                                        ? $t("platformDe.buyersApplyForAfterSales") //"买家申请售后"
                                        : item.status == 4
                                        ? $t("platformDe.sendBackWaitConfirmReceive") //"已寄回,待商家确认收货"
                                        : item.status == 5
                                        ? $t("platformDe.CourierSuccessfullyCollectsParcel") //"快递员揽件成功"
                                        : item.status == 7
                                        ? $t("platformDe.platformRejects") //"平台已拒收,售后单关闭"
                                        : item.status == 8
                                        ? $t("platformDe.returnOrderStatus5") //"退款成功"
                                        : item.status == 9
                                        ? $t("platformDe.returnOrderOperationStatus10") //"FBT订单,审核不通过关闭订单"
                                        : item.status == 10
                                        ? $t("platformDe.returnOrderOperationStatus11") //"买家超时未填写退货单号,自动关闭售后单"
                                        : item.status == 11
                                        ? $t("platformDe.returnOrderOperationStatus12") //"卖家驳回后,买家超时未客服介入,自动关闭售后单"
                                        : item.status == 12
                                        ? $t("platformDe.returnOrderOperationStatus13") //"卖家拒收后,买家超时未客服介入,自动关闭售后单"
                                        : item.status == 13
                                        ? $t("platformDe.fBTOrderRejectAndCloseTheOrder") //"FBT订单,拒收关闭订单"
                                        : item.status == 14
                                        ? $t("platformDe.undoIsClosed") //"撤销已关闭"
                                        : item.status == 15
                                        ? $t("platformDe.operationClosed") //"平台关闭"
                                        : item.status == 16
                                        ? $t("platformDe.sellerEditApply") //"买家修改申请"
                                        : item.status == 17
                                        ? $t("platformDe.sellerEditExpressNum") //"买家修改运单号"
                                        : item.status == 18
                                        ? $t("platformDe.timeoutSysAutoPlatformPass") //"因平台超时未处理, 系统自动审核通过"
                                        : item.status == 19
                                        ? $t("platformDe.timeoutConfirmSysAutoReceiving") //"因商家超时未确认收货，系统自动收货"
                                        : item.status == 20
                                        ? $t("platformDe.buyerCancelVisitFetch") //"买家取消上门取件"
                                        : item.status == 21
                                        ? $t("platformDe.workOrderCancel") //"工单撤销关闭"
                                        : item.status == 22
                                        ? $t("platformDe.orderEnd") //"工单完结关闭"
                                        : ""
                                }}
                            </div>
                            <!-- 平台同意 1退款退货 和 同意 0退款 -->
                            <div v-if="item.status == 2">
                                <div class="mb-20 header">{{ $t("platformDe.platformAgreesRefundProgress") }}</div>
                                <div>{{ $t("platformDe.RefundApplyPassTimeCheck") }}</div>
                            </div>
                            <div v-if="item.status == 23">
                                <div class="mb-20 header">{{ $t("platformDe.platformAgreesRefundWaitBuyer") }}</div>
                                <div>{{ $t("platformDe.salesReturnPassEnterExpressNum") }}</div>
                            </div>
                            <div v-if="item.status == 6 && item.orderReturn.returnType == 1">
                                <div class="mb-20 header">{{ $t("platformDe.platformReceiveRefunding") }}</div>
                                <div>{{ $t("platformDe.goodsReceiveTimeMoney") }}</div>
                            </div>
                            <div v-if="item.status == 7 || item.status == 13" style="word-wrap:break-word;">{{ $t("platformDe.reasonForRejection") }}:{{ item.reason }}</div>
                            <div v-if="item.status == 3">
                                <div class="mb-20 header">
                                    {{ $t("platformDe.platformReject") }}
                                    {{ item.orderReturn.returnType == 0 ? $t("platformDe.refund") : item.orderReturn.returnType == 1 ? $t("platformDe.salesReturn") : "" }}{{ $t("platformDe.apply") }},
                                    {{ item.orderReturn.returnType == 0 ? $t("platformDe.refund") : item.orderReturn.returnType == 1 ? $t("platformDe.salesReturn") : ""
                                    }}{{ $t("platformDe.orderClose") }}
                                </div>
                                <div>{{ $t("platformDe.refundApplyReject") }}</div>
                            </div>
                            <div>
                                <template v-for="(items, i) in item.voucherImgs" :key="i">
                                    <BmImage v-if="items != ''" class="mr-5 goodsImg" :src="items" :preview-src-list="item.voucherImgs" />
                                </template>
                            </div>
                        </div>
                    </div>
                    <div>{{ item.createTime }}</div>
                </div>

                <!-- 卖家申请售后 -->
                <div v-if="item.userType == 2" class="flex between proof">
                    <div class="flex">
                        <img src="../../assets/img/compoter.png" />
                        <div class="ml-30">
                            <div class="mb-20 header">
                                {{
                                    item.status == 1
                                        ? $t("platformDe.buyersApplyForAfterSales") //"买家申请售后"
                                        : item.status == 3
                                        ? $t("platformDe.merchantReviewRejected") //"商家审核驳回"
                                        : item.status == 4
                                        ? $t("platformDe.sendBackWaitConfirmReceive") //"已寄回,待商家确认收货"
                                        : item.status == 5
                                        ? $t("platformDe.CourierSuccessfullyCollectsParcel") //"快递员揽件成功"
                                        : item.status == 6
                                        ? $t("platformDe.sellerConfirmReceive") //"商家确定收货"
                                        : item.status == 7
                                        ? $t("platformDe.refundProcessStatus4") //"平台已拒收,售后单关闭"
                                        : item.status == 8
                                        ? $t("platformDe.returnOrderStatus5") //"退款成功"
                                        : item.status == 9
                                        ? $t("platformDe.returnOrderOperationStatus10") //"FBT订单,审核不通过关闭订单"
                                        : item.status == 10
                                        ? $t("platformDe.returnOrderOperationStatus11") //"买家超时未填写退货单号,自动关闭售后单"
                                        : item.status == 11
                                        ? $t("platformDe.returnOrderOperationStatus12") //"卖家驳回后,买家超时未客服介入,自动关闭售后单"
                                        : item.status == 12
                                        ? $t("platformDe.returnOrderOperationStatus13") //"卖家拒收后,买家超时未客服介入,自动关闭售后单"
                                        : item.status == 13
                                        ? $t("platformDe.fBTOrderRejectAndCloseTheOrder") //"FBT订单,拒收关闭订单"
                                        : item.status == 14
                                        ? $t("platformDe.undoIsClosed") //"撤销已关闭"
                                        : item.status == 15
                                        ? $t("platformDe.operationClosed") //"平台关闭"
                                        : item.status == 16
                                        ? $t("platformDe.sellerEditApply") //"买家修改申请"
                                        : item.status == 17
                                        ? $t("platformDe.sellerEditExpressNum") //"买家修改运单号"
                                        : item.status == 18
                                        ? $t("platformDe.timeoutSysAutoPass") //"因商家超时未处理, 系统自动审核通过"
                                        : item.status == 19
                                        ? $t("platformDe.timeoutConfirmSysAutoReceiving") //"因商家超时未确认收货，系统自动收货"
                                        : item.status == 20
                                        ? $t("platformDe.buyerCancelVisitFetch") //"买家取消上门取件"
                                        : item.status == 21
                                        ? $t("platformDe.workOrderCancel") //"工单撤销关闭"
                                        : item.status == 22
                                        ? $t("platformDe.orderEnd") //"工单完结关闭"
                                        : ""
                                }}
                            </div>
                            <!-- 商家审核通过,退款中 -->
                            <div v-if="item.status == 2">
                                <div class="mb-20 header">{{ $t("platformDe.sellerAgreesRefundProgress") }}</div>
                                <!-- 您的退款申请我们已经申请通过, 具体到账时间请查看退款规则或联系客服,谢谢支持理解! -->
                                <div>{{ $t("platformDe.RefundApplyPassTimeCheck") }}</div>
                            </div>
                            <!-- 商家同意退货退款, 等待买家寄回 -->
                            <div v-if="item.status == 23">
                                <div class="mb-20 header">{{ $t("platformDe.sellerAgreesRefundWaitBuyer") }}</div>
                                <!--您的退货退款申请我们已经申请通过, 请填写邮寄单号  -->
                                <div>{{ $t("platformDe.salesReturnPassEnterExpressNum") }}</div>
                            </div>

                            <div v-if="item.status == 6">{{ $t("platformDe.refundRulesTips2") }}</div>
                            <div v-if="item.status == 7 || item.status == 13" style="word-wrap:break-word;">{{ $t("platformDe.reasonForRejection") }}:{{ item.reason }}</div>
                            <div v-if="item.status == 3">{{ $t("platformDe.refundRulesTips3") }}</div>
                            <div>
                                <template v-for="(items, i) in item.voucherImgs" :key="i">
                                    <BmImage class="mr-5 goodsImg" v-if="items != ''" :src="items" :preview-src-list="item.voucherImgs" />
                                </template>
                            </div>
                        </div>
                    </div>
                    <div>{{ item.createTime }}</div>
                </div>

                <!-- 买家申请售后 -->
                <div v-if="item.userType == 1" class="flex between proof">
                    <div class="flex">
                        <!-- <img src="../../assets/img/phone@2x.png" /> -->
                        <svg class="icon" aria-hidden="true" style="font-size: 48px;">
                            <use xlink:href="#iconuser"></use>
                        </svg>
                        <div class="ml-30">
                            <div class="mb-20 header">
                                {{
                                    item.status == 1
                                        ? $t("platformDe.buyersApplyForAfterSales") //"买家申请售后"
                                        : item.status == 2
                                        ? $t("platformDe.sellerOperationApproved") //"商家/运营审核通过"
                                        : item.status == 3
                                        ? $t("platformDe.merchantReviewRejected") //"商家审核驳回"
                                        : item.status == 4
                                        ? $t("platformDe.sendBackWaitConfirmReceive") //"已寄回,待商家确认收货"
                                        : item.status == 5
                                        ? $t("platformDe.CourierSuccessfullyCollectsParcel") //"快递员揽件成功"
                                        : item.status == 6
                                        ? $t("platformDe.sellerConfirmReceive") //"商家确定收货"
                                        : item.status == 7
                                        ? $t("platformDe.refundProcessStatus4") //"商家拒收,售后单关闭"----------------
                                        : item.status == 8
                                        ? $t("platformDe.returnOrderStatus5") //"退款成功"
                                        : item.status == 9
                                        ? $t("platformDe.returnOrderOperationStatus10") //"FBT订单,审核不通过关闭订单"
                                        : item.status == 10
                                        ? $t("platformDe.returnOrderOperationStatus11") //"买家超时未填写退货单号,自动关闭售后单"
                                        : item.status == 11
                                        ? $t("platformDe.returnOrderOperationStatus12") //"卖家驳回后,买家超时未客服介入,自动关闭售后单"
                                        : item.status == 12
                                        ? $t("platformDe.returnOrderOperationStatus13") //"卖家拒收后,买家超时未客服介入,自动关闭售后单"
                                        : item.status == 13
                                        ? $t("platformDe.fBTOrderRejectAndCloseTheOrder") //"FBT订单,拒收关闭订单"
                                        : item.status == 14
                                        ? $t("platformDe.undoIsClosed") //"撤销已关闭"
                                        : item.status == 15
                                        ? $t("platformDe.operationClosed") //"平台关闭"
                                        : item.status == 16
                                        ? $t("platformDe.sellerEditApply") //"买家修改申请"
                                        : item.status == 17
                                        ? $t("platformDe.sellerEditExpressNum") //"买家修改运单号"
                                        : item.status == 18
                                        ? $t("platformDe.timeoutSysAutoPass") //"因商家超时未处理, 系统自动审核通过"
                                        : item.status == 19
                                        ? $t("platformDe.timeoutConfirmSysAutoReceiving") //"因商家超时未确认收货，系统自动收货"
                                        : item.status == 20
                                        ? $t("platformDe.buyerCancelVisitFetch") //"买家取消上门取件"
                                        : item.status == 21
                                        ? $t("platformDe.workOrderCancel") //"工单撤销关闭"
                                        : item.status == 22
                                        ? $t("platformDe.orderEnd") //"工单完结关闭"
                                        : ""
                                }}
                            </div>
                            <div>
                                <!--退款金额  问题描述-->
                                <div>{{ $t("platformDe.refundAmount") }}: {{ $store.state.app.currencySymbol }}{{ item.orderReturn.returnAmount }}</div>
                                <div style="word-wrap:break-word;">{{ $t("platformDe.problemDescription") }}: {{ item.orderReturn.applyDesc }}</div>
                            </div>
                            <div>
                                <!-- 联系方式 退款原因-->
                                <span>{{ $t("platformDe.contactInformation") }}: {{ item.orderReturn.receiverPhone }}</span>
                                <span class="ml-15">{{ $t("platformDe.returnReason") }}: {{ item.orderReturn.applyReason }}</span>
                            </div>
                            <div v-if="item.status == 4">{{ $t("platformDe.buyerReceiveGoodsTips") }}</div>
                            <div>
                                <template v-for="(items, i) in item.orderReturn.proofPics.split(',')" :key="i">
                                    <BmImage class="mr-5 goodsImg" v-if="items != ''" :src="items" :preview-src-list="[items]" />
                                </template>
                            </div>
                        </div>
                    </div>
                    <div>{{ item.createTime }}</div>
                </div>
            </div>
            <div class="bottom"></div>

            <div class="flex between mb-15 mt-15">
                <!--物流信息  退货单物流信息-->
                <div class="flex vcenter">
                    <div class="title flex vcenter">{{ $t("platformDe.logisticsInfo") }}</div>
                    <div class="ml-30 light-grey">{{ $t("platformDe.returnLogisticsInfo") }}</div>
                </div>
            </div>
            <div class="express">
                <!-- <div class="mb-15">收货人: {{ orderReturnData.arriveName }} {{ orderReturnData.arrivePhone }}</div> -->
                <!-- 快递公司 -->
                <div>{{ $t("platformDe.ExpressCompany") }}: {{ omsOrderReturn.deliveryCompany }}</div>
                <div class="mb-15">
                    <!-- 快递单号 -->
                    <span>{{ $t("platformDe.trackingNumber") }}: {{ omsOrderReturn.deliverySn }}</span
                    ><span v-clipboard:copy="omsOrderReturn.deliverySn" v-clipboard:success="onCopy" v-clipboard:error="onError" class="green ml-30 cp">{{ $t("copy") }}</span>
                </div>
                <!-- 物流信息 -->
                <div class="blue mb-30">
                    <el-popover placement="bottom" :title="$t('platformDe.logisticsInfo')" :width="500" trigger="click">
                        <template #reference>
                            <div class="green cp" style="width: 200px;">{{ $t("platformDe.viewMoreLogisticsInformation") }}</div>
                        </template>
                        <div>
                            <el-timeline>
                                <el-timeline-item v-for="(activity, index) in moreOrderReturnExpressInfo" :key="index" :color="activity.color" size="large" :timestamp="activity.createTime">
                                    {{ activity.context }}
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                    </el-popover>
                </div>
                <el-timeline>
                    <el-timeline-item v-for="(activity, index) in orderReturnExpressInfo" :key="index" :color="activity.color" size="large" :timestamp="activity.createTime">
                        {{ activity.context }}
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
    </div>
    <!-- 退款退货 -->
    <BmDialog v-model:visible="visible" :title="title" :showFooter="false" :width="800">
        <BmDialog v-model:visible="visible_2" :title="title_2" :confirm="confirm_2" :cancel="cancel_2" :width="600">
            <el-form label-position="left">
                <el-form-item>
                    <div class="flex">
                        <div>!</div>
                        <div class="ml-15">
                            <div v-if="returnStatus == 2">
                                <div>{{ $t("platformDe.refundReminder3") }}</div>
                                <div>{{ $t("platformDe.refundReminder4") }}</div>
                            </div>
                            <div v-else>
                                <div>{{ $t("platformDe.refundReminder1") }}</div>
                                <div>{{ $t("platformDe.refundReminder2") }}</div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </BmDialog>

        <div class="flex center mb-30" style="font-weight: 900;font-size: 16px;">
            <!--买家申请 退货退款 "退款" 待商家处理-->
            <span>{{ $t("platformDe.sellerApply") }} {{ state == 2 ? $t("platformDe.refunds") : state == 1 ? $t("platformDe.refund") : "" }} ,{{ $t("platformDe.waitSellerDispose") }}</span>
        </div>
        <el-form label-position="left">
            <!-- 同意退货: 同意退款: 驳回申请: 若商家未处理:-->
            <el-form-item :label="$t('platformDe.agreeReturnGoods')">
                {{ $t("platformDe.refundProcessStatus2") }}
            </el-form-item>
            <el-form-item :label="$t('platformDe.agreeToRefund')">
                {{ $t("platformDe.refundReminder1") }}
            </el-form-item>
            <el-form-item :label="$t('platformDe.rejectTheApplication')">
                {{ $t("platformDe.rejectSellerHave") }} {{ appealTime }} {{ appealUnit }} {{ $t("platformDe.TimeSelectedModify") }};
            </el-form-item>
            <!-- <el-form-item :label="$t('platformDe.sellerNotProcess')"> {{ $t("platformDe.exceed") }} {{ poofDown }} {{ $t("platformDe.refundTimeTip") }} </el-form-item> -->
        </el-form>
        <div class="flex center">
            <!-- 驳回申请 -->
            <el-button @click="rejectApply">{{ $t("platformDe.rejectTheApplication") }}</el-button>
            <div v-if="state == 1" class="ml-15">
                <!-- 同意退款 -->
                <el-button type="primary" @click="dialogVisble(1)">{{ $t("platformDe.agreeToRefund") }}</el-button>
            </div>
            <div v-if="state == 2" class="ml-15">
                <!-- 同意退款 同意退款退货-->
                <el-button type="primary" @click="dialogVisble(1)">{{ $t("platformDe.agreeToRefund") }}</el-button>
                <el-button type="primary" @click="dialogVisble(2)">{{ $t("platformDe.AgreeRefundGoods") }}</el-button>
            </div>
        </div>
    </BmDialog>
    <!-- 驳回申请 -->
    <BmDialog v-model:visible="visible_3" :title="$t('platformDe.rejectTheApplication')" :confirm="confirm_3" :cancel="cancel_3" :width="800">
        <div class="flex vcenter rejectTips">
            <span>
                <svg class="icon" aria-hidden="true" style="width: 48px;height: 48px;">
                    <use xlink:href="#iconicon-test"></use>
                </svg>
            </span>
            <span>{{ $t("platformDe.rejectTips") }}</span>
        </div>
        <el-form :model="rejectForm" :rules="rejectRules" ref="rejectRef" label-width="100px" class="demo-ruleForm" label-position="left">
            <!-- 驳回原因 -->
            <el-form-item :label="$t('platformDe.rejectReason')" prop="reason">
                <el-select v-model="rejectForm.reason" :placeholder="$t('pleaseSelect')">
                    <el-option v-for="item in rejectReason" :key="item.id" :label="item.description" :value="item.description"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 驳回说明 -->
            <el-form-item :label="$t('platformDe.rejectExplain')" prop="remark">
                <el-input v-model="rejectForm.remark" type="textarea" rows="5" show-word-limit maxlength="200" :placeholder="$t('platformDe.rejectExplainTips')" />
            </el-form-item>
            <!-- 上传凭证 -->
            <el-form-item :label="$t('platformDe.upCertificate')">
                <div>{{ $t("platformDe.upCertificateTips") }}</div>
                <div>
                    <BmUpload @change="onChangeUploadCarousel($event)" :multiple="true" :fileList="rejectForm._tempImg" :limit="8" />
                </div>
            </el-form-item>
        </el-form>
    </BmDialog>
    <!-- 确认收货 -->
    <BmDialog v-model:visible="visible_4" :title="$t('platformDe.confirmTheReceiptOfGoods')" :confirm="confirm_4" :cancel="cancel_4" :width="600">
        <el-form label-position="left">
            <el-form-item> {{ $t("platformDe.reallyRecivedGoods") }}? </el-form-item>
        </el-form>
    </BmDialog>
    <BmDialog v-model:visible="visible_5" :title="$t('platformDe.reject')" :confirm="confirm_5" :cancel="cancel_5" :width="800">
        <div class="flex vcenter rejectTips mb-15">
            <span>
                <svg class="icon" aria-hidden="true" style="width: 25px;height: 25px;">
                    <use xlink:href="#iconicon-test"></use>
                </svg>
            </span>
            <span>{{ $t("platformDe.refusalAfterSalesTips") }}</span>
        </div>
        <el-form :model="rejectGoodsForm" :rules="rejectGoodsRules" ref="rejectGoodsRef" label-width="100px" class="demo-ruleForm" label-position="left">
            <!-- 驳回说明 -->
            <el-form-item :label="$t('platformDe.rejectExplain')" prop="reason">
                <el-input v-model="rejectGoodsForm.reason" type="textarea" rows="5" show-word-limit maxlength="200" :placeholder="$t('platformDe.rejectExplainTips')" />
            </el-form-item>
            <!-- 上传凭证 -->
            <el-form-item :label="$t('platformDe.upCertificate')">
                <div>{{ $t("platformDe.upCertificateTips") }}</div>
                <div>
                    <BmUpload @change="onChangeUploadDetailImg_5($event)" :multiple="true" :fileList="rejectGoodsForm._tempImgs" :limit="8" size="xl" />
                </div>
            </el-form-item>
        </el-form>
    </BmDialog>
    <!-- 退款 -->
    <BmDialog v-model:visible="visible_6" :title="$t('platformDe.refund')" :confirm="confirm_6" :cancel="cancel_6" :width="800">
        <el-form label-position="left">
            <el-form-item>
                {{ $t("platformDe.refundApplyTip") }}
            </el-form-item>
        </el-form>
    </BmDialog>
    <BmDialog v-model:visible="visible_7" :title="title_7" :confirm="confirm_7" :cancel="cancel_7" :width="800">
        <div class="flex vcenter rejectTips mb-15">
            <span>{{ $t("platformDe.AppealDescription") }}</span>
        </div>
        <el-form :model="exhibitForm" :rules="exhibitRules" ref="exhibitRef" label-width="100px" class="demo-ruleForm" label-position="left">
            <!-- 补充描述 -->
            <el-form-item :label="$t('platformDe.supplementaryDescription')" prop="workDesc">
                <el-input v-model="exhibitForm.workDesc" type="textarea" rows="5" show-word-limit maxlength="200" :placeholder="$t('platformDe.rejectExplainTips')" />
            </el-form-item>
            <!-- 上传凭证 -->
            <el-form-item :label="$t('platformDe.upCertificate')" prop="workMustVoucher_temp">
                <div>{{ $t("platformDe.MustHaveProofTip") }}</div>
                <div>
                    <!-- 主要凭证 -->
                    <BmUpload @change="onChangeUploadCarousel_workMustVoucher($event)" :multiple="true" :fileList="exhibitForm.workMustVoucher_temp" :limit="8" />
                    <!-- 次要凭证 -->
                    <BmUpload @change="onChangeUploadCarousel_workOptionalVoucher($event)" :multiple="true" :fileList="exhibitForm.workOptionalVoucher_temp" :limit="8" />
                </div>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import {
    orderReturnDetail,
    findReturnWorkAllegeList,
    orderReturnGetLogisticsInfo,
    orderReturnAgreeRefund,
    orderReturnagreeRefundInReturnGoodsAndRefund,
    orderBatchAgreeReturnGoods,
    adminDictType,
    orderReturnSellerReject,
    orderReturnConfirmReceipt,
    orderReturnRejectDelivery,
    orderReturnAddToProof
} from "@/api/goods";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { deepClone } from "@/utils/index";
export default {
    name: "platformDetail",
    setup(props) {
        const { proxy } = getCurrentInstance();
        const router = useRouter();
        const route = useRoute();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        let visible = ref(false);
        let visible_2 = ref(false);
        let visible_3 = ref(false);
        let visible_4 = ref(false);
        let visible_5 = ref(false);
        let visible_6 = ref(false);
        let visible_7 = ref(false);
        let title = ref(proxy.$t("platformDe.afterSaleState")); //"售后状态"
        let title_2 = ref(proxy.$t("platformDe.BatchAgreeReturnRefund")); //"批量同意退货"
        let title_7 = ref(proxy.$t("platformDe.AddCredentials")); //"添加凭证"

        // 退款仅退款1仅退款 2退货退款
        let state = ref("");
        let returnStatus = ref(""); // 退货退款-> 1.仅退款 2退货退款

        let omsOrder = ref({}); // 订单信息
        let omsOrderReturn = ref({}); // 售后单信息
        let orderReturnOperateHistoryVOS = ref([]); // 协商历史
        let orderSetVOS = ref([]); // 同意/驳回订单设置时间
        let returnWork = ref({});

        let remainTimer = null;
        let poofDown = ref(""); // 举证 倒计时 售后商家未处理到计时

        let appealTime = ref(""); // 申诉时间 天
        let appealUnit = ref(""); // 申诉时间单位
        let orderCount = ref(0);
        const getData = () => {
            orderReturnDetail(route.query.id)
                .then((res) => {
                    omsOrder.value = res.data.omsOrder;
                    omsOrderReturn.value = res.data.omsOrderReturn;
                    orderReturnOperateHistoryVOS.value = res.data.orderReturnOperateHistoryVOS.map((v) => {
                        v.voucherImgs = v.voucherImgs.split(",");
                        return v;
                    });

                    returnWork.value = res.data.returnWork;

                    orderSetVOS.value = res.data.orderSetVOS;
                    // 待举证剩余时间 或者  商家未处理时间
                    if (returnWork.value.status == 1 || omsOrderReturn.value.status == 1) {
                        let remainTime = Math.ceil(orderSetVOS.value[0].remainTime / 1000);
                        remainTimer = setInterval(() => {
                            poofDown.value = countDown(remainTime);
                            remainTime--;
                            if (remainTime < 0) {
                                clearInterval(remainTimer);
                                remainTimer = null;
                            }
                        }, 1000);
                    }

                    // 申诉天数剩余时间
                    if (omsOrderReturn.status == 1) {
                        // 申诉天数剩余时间
                        appealTime.value = orderSetVOS.value[1].value;
                        if (orderSetVOS.value[1].unit == "min") {
                            appealUnit.value = proxy.$t("minute");
                        } else if (orderSetVOS.value[1].unit == "h") {
                            appealUnit.value = proxy.$t("hour");
                        } else if (orderSetVOS.value[1].unit == "day") {
                            appealUnit.value = proxy.$t("day");
                        }
                    }

                    // 获取举证详情
                    if (res.data.omsOrderReturn.workId) {
                        getfindReturnWorkAllegeList(res.data.omsOrderReturn.workId);
                    }
                    // 上门取件才有售后物流单信息
                    if (res.data.omsOrderReturn.deliveryType == 2) {
                        // 售后单物流信息
                        if (res.data.omsOrderReturn.deliverySn) {
                            console.log(res.data.omsOrderReturn, "==============================");
                            getWorkOrderReturnGetLogisticsInfo(res.data.omsOrderReturn.deliverySn);
                        }
                    }
                    // 在线下单才有订单物流信息
                    if (res.data.omsOrder.expressType == 0) {
                        // 订单物流信息
                        if (res.data.omsOrder.deliverySn) {
                            getorderReturnGetLogisticsInfo(res.data.omsOrder.deliverySn);
                        }
                    }
                    // getorderReturnGetLogisticsInfo(res.data.omsOrder.deliverySn);
                    omsOrder.value.items.forEach((v) => {
                        orderCount.value = orderCount.value + v.goodQuantity;
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getData();

        //设置倒计时
        function countDown(surplusTime) {
            const seconds = surplusTime;
            const second = seconds % 60;
            const minutes = (seconds - second) / 60;
            const minute = minutes % 60;
            const hours = (minutes - minute) / 60;
            const hour = hours % 24;
            const day = (hours - hour) / 24;
            const res = day + proxy.$t("day") + hours + proxy.$t("hour") + minute + proxy.$t("minute") + second + proxy.$t("second");
            return res;
        }

        let exhibit = ref([]);
        // 举证详情
        const getfindReturnWorkAllegeList = (workIds) => {
            findReturnWorkAllegeList({ workId: workIds })
                .then((res) => {
                    res.data.omsOrderReturnWorkAlleges.forEach((v) => {
                        v.workMustVoucher = v.workMustVoucher.split(",");
                        v.workOptionalVoucher = v.workOptionalVoucher.split(",");
                    });
                    exhibit.value = res.data.omsOrderReturnWorkAlleges;
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        let orderExpessInfo = ref([]); // 订单物流信息
        let moreOrderExpessInfo = ref([]); // 更多物流信息
        let orderExpressData = ref({});
        // 获取订单物流信息
        const getorderReturnGetLogisticsInfo = (deliverySn) => {
            orderReturnGetLogisticsInfo(deliverySn)
                .then((res) => {
                    orderExpressData.value = res.data;
                    moreOrderExpessInfo.value = deepClone(res.data.locusList);
                    if (res.data.locusList.length !== 0) {
                        res.data.locusList.forEach((v, i) => {
                            if (i < 3) {
                                orderExpessInfo.value.push({
                                    context: v.context,
                                    createTime: v.createTime,
                                    color: "#f2f2f2"
                                });
                            }
                        });
                        orderExpessInfo.value[0].color = "#0bbd87";
                        moreOrderExpessInfo.value.map((v) => (v.color = "#f2f2f2"));
                        moreOrderExpessInfo.value[0].color = "#0bbd87";
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        let orderReturnExpressInfo = ref([]); // 售后物流信息
        let moreOrderReturnExpressInfo = ref([]); // 更多售后单物流信息
        let orderReturnData = ref({});
        // 获取售后物流信息
        const getWorkOrderReturnGetLogisticsInfo = (deliverySn) => {
            orderReturnGetLogisticsInfo(deliverySn)
                .then((res) => {
                    console.log(res);
                    orderReturnData.value = res.data;
                    moreOrderReturnExpressInfo.value = deepClone(res.data.locusList);
                    if (res.data.locusList.length !== 0) {
                        res.data.locusList.forEach((v, i) => {
                            if (i < 3) {
                                orderReturnExpressInfo.value.push({
                                    context: v.context,
                                    createTime: v.createTime,
                                    color: "#f2f2f2"
                                });
                            }
                        });
                        orderReturnExpressInfo.value[0].color = "#0bbd87";
                        moreOrderReturnExpressInfo.value.map((v) => (v.color = "#f2f2f2"));
                        moreOrderReturnExpressInfo.value[0].color = "#0bbd87";
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        let rejectReason = ref([]);
        // 获取驳回原因选项
        const DictType = () => {
            adminDictType("return_reject_reason")
                .then((res) => {
                    console.log(res);
                    rejectReason.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        DictType();

        // 处理 一级弹框
        // 区分是  1仅退款 2退货退款
        const dispose = (val) => {
            visible.value = true;
            state.value = val;
            returnStatus.value = val;
        };

        // 处理 二级弹框
        // 区分是退货还是退款 1.退款 2.退货退款
        let refundSalas = "";
        const dialogVisble = (val) => {
            returnStatus.value = val;
            visible_2.value = true;
            if (val == 1) {
                refundSalas = val;
                title_2.value = proxy.$t("platformDe.agreeToRefund"); //"同意退款";
            } else {
                refundSalas = val;
                title_2.value = proxy.$t("platformDe.agreeReturnGoods"); //"同意退货";
            }
        };

        // 退款退货
        const confirm_2 = () => {
            // 同意退款
            if (refundSalas == 1) {
                if (state.value == 2) {
                    // 退货 -> 退款
                    orderReturnagreeRefundInReturnGoodsAndRefund({ id: omsOrderReturn.value.id }).then((res) => {
                        if (res.code === 0) {
                            visible.value = false;
                            proxy.$message.success(res.msg);
                        }
                    });
                } else if (state.value == 1) {
                    // 仅退款
                    let id = [omsOrderReturn.value.id];
                    orderReturnAgreeRefund(id).then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            visible.value = false;
                            proxy.$message.success(res.msg);
                        }
                    });
                }
            } else {
                // 退货 -> 退货退款
                let ids = [omsOrderReturn.value.id];
                orderBatchAgreeReturnGoods(ids).then((res) => {
                    console.log(res);
                    visible.value = false;
                    proxy.$message.success(res.msg);
                    router.go(0);
                });
            }
        };

        const cancel_2 = () => {
            visible_2.value = false;
        };

        // 驳回
        let rejectRef = ref(null);
        let rejectForm = reactive({
            voucherImgs: "",
            _tempImg: [],
            reason: "",
            remark: "",
            returnId: omsOrderReturn.value.id
        });

        // "请选择驳回原因" "请填写说明"
        const rejectRules = {
            reason: [{ required: true, message: proxy.$t("platformDe.enterRejectReason"), trigger: "change" }],
            remark: [{ required: true, message: proxy.$t("platformDe.enterFillInstructions"), trigger: "blur" }]
        };

        // 凭证图片
        const onChangeUploadDetailImg = (fileList) => {
            rejectForm._tempImg = fileList; // fileList.map((item) => item.url)
            console.log("rejectForm.voucherImgs", rejectForm._tempImg);
        };

        const rejectApply = () => {
            visible_3.value = true;
        };

        // 驳回申请
        const confirm_3 = () => {
            rejectForm.returnId = omsOrderReturn.value.id;
            if (rejectForm._tempImg) {
                rejectForm.voucherImgs = rejectForm._tempImg.map((v) => v.url).join(",");
            }
            delete rejectForm._tempImg;
            rejectRef.value.validate((valid) => {
                if (valid) {
                    orderReturnSellerReject(rejectForm).then((res) => {
                        visible_3.value = false;
                        proxy.$message.success(res.msg);
                        router.go(0);
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        const cancel_3 = () => {
            visible_3.value = false;
        };

        // 确认收货
        const affirmReceive = () => {
            visible_4.value = true;
        };

        // 确认收货
        const confirm_4 = () => {
            orderReturnConfirmReceipt({ id: omsOrderReturn.value.id }).then((res) => {
                if (res.code == 0) {
                    visible_4.value = false;
                    proxy.$message.success(res.msg);
                    router.go(0);
                }
            });
        };

        const cancel_4 = () => {
            visible_4.value = false;
        };

        // 拒收
        const rejectReceive = () => {
            visible_5.value = true;
        };

        // 拒收
        let rejectGoodsForm = reactive({
            reason: "",
            imgs: "",
            _tempImgs: [],
            id: omsOrderReturn.value.id
        });
        const rejectGoodsRules = {
            reason: [{ required: true, message: proxy.$t("platformDe.enterFillInstructions"), trigger: "blur" }]
        };
        let rejectGoodsRef = ref(null);

        const onChangeUploadDetailImg_5 = (fileList) => {
            rejectGoodsForm._tempImgs = fileList; // fileList.map((item) => item.url)
            console.log("rejectGoodsForm._tempImgs", rejectGoodsForm._tempImgs);
        };
        // 拒收
        const confirm_5 = () => {
            rejectGoodsForm.imgs = rejectGoodsForm._tempImgs.map((v) => v.url).join(",");
            rejectGoodsForm.id = omsOrderReturn.value.id;
            delete rejectGoodsForm._tempImgs;
            rejectGoodsRef.value.validate((valid) => {
                if (valid) {
                    orderReturnRejectDelivery(rejectGoodsForm).then((res) => {
                        if (res.code == 0) {
                            visible_5.value = false;
                            proxy.$message.success(res.msg);
                            router.go(0);
                        }
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        const cancel_5 = () => {
            visible_5.value = false;
        };

        // 工单 退款
        let tmp = "";
        const moneyback = (val) => {
            visible_6.value = true;
            tmp = val;
        };

        const confirm_6 = () => {
            if (tmp == 2) {
                // 退货退款 -> 退款
                orderReturnagreeRefundInReturnGoodsAndRefund({ id: omsOrderReturn.value.id }).then((res) => {
                    if (res.code === 0) {
                        visible_6.value = false;
                        proxy.$message.success(res.msg);
                    }
                });
            } else {
                // 仅退款
                //returnId: omsOrderReturn.value.id, workId: omsOrderReturn.value.workId
                orderReturnAgreeRefund([omsOrderReturn.value.id]).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        visible_6.value = false;
                        proxy.$message.success(res.msg);
                    }
                });
            }
        };

        const cancel_6 = () => {
            visible_6.value = false;
        };

        // 凭证form
        let exhibitForm = reactive({
            workDesc: "", // 描述
            orderWorkId: returnWork.value.id, // 工单id
            workMustVoucher_temp: [],
            workMustVoucher: "", // 主凭证
            workOptionalVoucher: "", // 次凭证
            workOptionalVoucher_temp: []
        });

        let exhibitRef = ref(null);

        const exhibitRules = ref({
            workDesc: [{ required: true, message: proxy.$t("platformDe.enterFillDescription"), trigger: "blur" }],
            workMustVoucher_temp: [{ required: true, message: proxy.$t("platformDe.enterUploadImg"), trigger: "blur" }]
        });

        // 添加凭证,追加凭证
        // 主要凭证图片
        const onChangeUploadCarousel_workMustVoucher = (fileList) => {
            exhibitForm.workMustVoucher_temp = fileList;
        };

        // 次要凭证图片
        const onChangeUploadCarousel_workOptionalVoucher = (fileList) => {
            exhibitForm.workOptionalVoucher_temp = fileList;
        };

        const addExhibit = (val) => {
            visible_7.value = true;
            if (val == 1) {
                title_7.value = proxy.$t("platformDe.AddCredentials"); // "添加凭证";
            } else {
                title_7.value = proxy.$t("platformDe.AddDocuments"); //"追加凭证";
            }
        };

        const confirm_7 = () => {
            exhibitForm.orderWorkId = returnWork.value.id;
            exhibitForm.workMustVoucher = exhibitForm.workMustVoucher_temp.map((v) => v.url).join(",");
            exhibitForm.workOptionalVoucher = exhibitForm.workOptionalVoucher_temp.map((v) => v.url).join(",");
            // delete exhibitForm.workMustVoucher_temp;
            // delete exhibitForm.workOptionalVoucher_temp;
            exhibitRef.value.validate((valid) => {
                if (valid) {
                    orderReturnAddToProof(exhibitForm)
                        .then((res) => {
                            console.log(res);
                            router.go(0);
                            // getData();
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    visible_7.value = false;
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        const cancel_7 = () => {
            visible_7.value = false;
        };

        const onCopy = (e) => {
            proxy.$message.success(e.text);
        };
        const onError = (e) => {
            proxy.$message.error("Failed to copy texts");
        };

        return {
            omsOrder,
            omsOrderReturn,
            orderReturnOperateHistoryVOS,
            orderSetVOS,
            returnWork,
            exhibit,
            orderExpessInfo,
            orderReturnExpressInfo,
            moreOrderExpessInfo,
            moreOrderReturnExpressInfo,
            orderReturnData,
            orderExpressData,
            title,
            visible,
            visible_2,
            visible_3,
            visible_4,
            visible_5,
            visible_6,
            visible_7,
            title_2,
            title_7,
            confirm_2,
            cancel_2,
            confirm_3,
            cancel_3,
            dispose,
            state,
            returnStatus,
            dialogVisble,
            rejectApply,
            rejectRef,
            rejectForm,
            rejectRules,
            rejectReason,
            onChangeUploadDetailImg,
            affirmReceive,
            rejectReceive,
            confirm_4,
            cancel_4,
            confirm_5,
            cancel_5,
            rejectGoodsForm,
            rejectGoodsRules,
            rejectGoodsRef,
            onChangeUploadDetailImg_5,
            moneyback,
            confirm_6,
            cancel_6,
            onChangeUploadCarousel_workMustVoucher,
            onChangeUploadCarousel_workOptionalVoucher,
            addExhibit,
            confirm_7,
            cancel_7,
            exhibitRef,
            exhibitRules,
            onCopy,
            onError,
            orderCount,
            exhibitForm,
            poofDown,
            appealTime,
            appealUnit
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
.content {
    // height: 100%;
    // overflow: hidden;

    .left {
        width: 50%;

        .order_time {
            border: 1px solid #ececec;
            padding: 30px 18px 30px 18px;
            border-bottom: none;
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
        .shopInfo {
            height: 105px;
            border: 1px solid #ececec;
            padding: 24px 17px 24px 17px;
        }
        .remark {
            height: 105px;
            border: 1px solid #ececec;
            padding: 24px 17px 24px 17px;
        }
        .express {
            border: 1px solid #ececec;
            padding: 24px 17px 24px 17px;
        }
        .userInfo {
            padding: 25px 27px 25px 27px;
            border: 1px solid #ececec;
        }
        .count {
            text-align: end;
            height: 55px;
            padding: 15px 20px 22px 0px;
            border: 1px solid #ececec;
            border-top: none;
            border-bottom: none;
        }
    }

    .right {
        width: 50%;
        margin-left: 20px;

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

        .serviceState {
            height: 238px;
            border: 1px solid #ececec;

            .item1 {
                height: 96px;
                border-bottom: 1px solid #ececec;
                padding: 30px 36px 30px 36px;
            }
            .item2 {
                height: 142px;
                padding: 30px 36px 30px 36px;
            }
            .item3 {
                border-bottom: 1px solid #ececec;
                padding: 30px 36px 30px 36px;
            }
            .item4 {
                padding: 30px 36px 30px 36px;
            }

            .stateTitle {
                font-size: 22px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 30px;
            }
            .stateTitle_2 {
                font-size: 22px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #42b7ae;
                line-height: 30px;
            }
            .stateTitle_3 {
                color: #ff6666;
                font-size: 22px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                line-height: 30px;
            }
        }
        .serviceState_2 {
            border: 1px solid #ececec;
            margin-bottom: 20px;

            .item1 {
                height: 96px;
                border-bottom: 1px solid #ececec;
                padding: 30px 36px 30px 36px;
            }
            .item2 {
                height: 142px;
                padding: 30px 36px 30px 36px;
            }
            .item3 {
                border-bottom: 1px solid #ececec;
                padding: 30px 36px 30px 36px;
            }
            .item4 {
                padding: 30px 36px 30px 36px;
            }
        }
        .orderService {
            height: 205px;
            padding: 28px 17px 12px 17px;
            border: 1px solid #ececec;
        }
        .count {
            text-align: end;
            height: 55px;
            padding: 15px 20px 22px 0px;
            border: 1px solid #ececec;
        }
        .userInfo {
            padding: 25px 27px 25px 27px;
            border: 1px solid #ececec;
        }
        .proof {
            padding: 22px 18px 22px 18px;
            border: 1px solid #ececec;
            border-bottom: none;
            .header {
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 700;
                color: #333333;
                line-height: 17px;
            }
            img {
                width: 48px;
                height: 48px;
            }
        }
        .bottom {
            border-top: 1px solid #ececec;
            height: 1px;
        }
        .express {
            border: 1px solid #ececec;
            padding: 24px 17px 24px 17px;
        }
    }
}

.rejectTips {
    width: 800px;
    background-color: #fffbe6;
    border: 1px solid #ffe58f;
    padding: 7px;
}

.goodsImg {
    width: 59px;
    height: 59px;
    border-radius: 2px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 59px;
    height: 59px;
}
</style>
