<template>
    <div class="content-wrap">
        <div class="left">
            <div class="fs-16 flex vcenter mb-12">
                <div class="pane-line"></div>
                <span class="pane-fs">{{ $t("home.order") }}</span>
            </div>
            <div class="flex flex-item mb-20">
                <div class="after flex vcenter">
                    <div class="flex column vcenter left-son-item">
                        <router-link to="/commodity/order?status=0" class="header">{{ countOrder.await_pay_count }}</router-link>
                        <!-- 待付款 -->
                        <div class="center">{{ $t("home.waitPay") }}</div>
                        <div class="flex between bottom">
                            <div>FBT: {{ countOrder.FBT_await_pay_count }}</div>
                            <div>FBM: {{ countOrder.FBM_await_pay_count }}</div>
                        </div>
                    </div>
                </div>
                <div class="after flex vcenter">
                    <div class="flex column vcenter left-son-item">
                        <router-link to="/commodity/order?status=1" class="header">{{ countOrder.await_delivery_count }}</router-link>
                        <!-- 待发货 -->
                        <div class="center">{{ $t("home.waitDeliverGood") }}</div>
                        <div class="flex between bottom">
                            <div>FBT: {{ countOrder.FBT_await_delivery_count }}</div>
                            <div>FBM: {{ countOrder.FBM_await_delivery_count }}</div>
                        </div>
                    </div>
                </div>
                <div class="after flex vcenter">
                    <div class="flex column vcenter left-son-item">
                        <router-link to="/commodity/order?returnStatus=1" class="header">{{ countOrder.order_refund_await_deal }}</router-link>
                        <!-- 售后待处理 -->
                        <div class="center">{{ $t("home.returnWait") }}</div>
                        <div class="flex between bottom">
                            <div>FBT: {{ countOrder.FBT_order_refund_await_deal }}</div>
                            <div>FBM: {{ countOrder.FBM_order_refund_await_deal }}</div>
                        </div>
                    </div>
                </div>
                <div class="flex column vcenter left-son-item">
                    <router-link to="/commodity/order?status=2" class="header">{{ countOrder.has_delivered }}</router-link>
                    <!-- 已发货 -->
                    <div class="center">{{ $t("home.thenDeliver") }}</div>
                    <div class="flex between bottom">
                        <div>FBT: {{ countOrder.FBT_has_delivered }}</div>
                        <div>FBM: {{ countOrder.FBM_has_delivered }}</div>
                    </div>
                </div>
            </div>
            <div class="fs-16 flex vcenter mb-12">
                <div class="pane-line"></div>
                <!-- 发/补货 -->
                <span class="pane-fs">{{ $t("home.DeliverRplenishment") }}</span>
            </div>
            <div class="flex flex-item mb-20">
                <div class="after flex vcenter">
                    <div class="flex column vcenter left-son-item">
                        <router-link to="/warehouse/shipmentsPlan?status=1" class="header">{{ backProductCount.back_product_check_ing_count }}</router-link>
                        <!-- 待平台审核 -->
                        <div class="center">{{ $t("home.PendingPlatformReview") }}</div>
                    </div>
                </div>
                <div class="after flex vcenter">
                    <div class="flex column vcenter left-son-item">
                        <router-link to="/warehouse/shipmentsPlan?status=2" class="header">{{ backProductCount.back_product_waiting_delivery_count }}</router-link>
                        <!-- 待发货 -->
                        <div class="center">{{ $t("home.waitSendGoods") }}</div>
                    </div>
                </div>
                <div class="after flex vcenter">
                    <div class="flex column vcenter left-son-item">
                        <router-link to="/warehouse/returns?status=1" class="header">{{ backProductCount.back_return_check_ing_count }}</router-link>
                        <!-- 退货待审核 -->
                        <div class="center">{{ $t("home.ReturnPendingReview") }}</div>
                    </div>
                </div>
                <div class="flex column vcenter left-son-item">
                    <router-link to="/warehouse/returns?status=3" class="header">{{ backProductCount.back_return_waiting_outbound_count }}</router-link>
                    <!-- 退货待出库 -->
                    <div class="center">{{ $t("home.ReturnPendingShipment") }}</div>
                </div>
            </div>
            <div class="fs-16 flex vcenter mb-12">
                <div class="pane-line"></div>
                <span class="pane-fs">{{ $t("home.goods") }}</span>
            </div>
            <div class="flex-item mb-20">
                <div class="flex">
                    <div class="after flex vcenter">
                        <div class="flex column vcenter left-son-item">
                            <router-link to="/goodsManage/goodsList?activeName=pane2&fastStatus=2&status=1" class="header">{{ goodsCheckCount.total_new_await_check }}</router-link>
                            <!-- 新品待审核 -->
                            <div class="center">{{ $t("home.NewProductReviewed") }}</div>
                        </div>
                    </div>
                    <div class="after flex vcenter">
                        <div class="flex column vcenter left-son-item">
                            <router-link to="/goodsManage/goodsList?activeName=pane2&fastStatus=3&status=1" class="header">{{ goodsCheckCount.total_new_check_failed }}</router-link>
                            <!-- 新品审核驳回 -->
                            <div class="center">{{ $t("home.NewGoodsReject") }}</div>
                        </div>
                    </div>
                    <div class="after flex vcenter">
                        <div class="flex column vcenter left-son-item">
                            <router-link to="/goodsManage/goodsList?activeName=pane2&fastStatus=2&status=2" class="header">{{ goodsCheckCount.total_update_await_check }}</router-link>
                            <!-- 商品修改待审核 -->
                            <div class="center">{{ $t("home.goodsModiReviewed") }}</div>
                        </div>
                    </div>
                    <div class="flex column vcenter left-son-item">
                        <router-link to="/goodsManage/goodsList?activeName=pane2&fastStatus=3&status=2" class="header">{{ goodsCheckCount.total_update_check_failed }}</router-link>
                        <!-- 商品修改审核驳回 -->
                        <div class="center">{{ $t("home.goodsModiReject") }}</div>
                    </div>
                </div>
                <div class="flex">
                    <div class="after flex vcenter">
                        <div class="flex column vcenter left-son-item">
                            <router-link to="/goodsManage/goodsList?saleStatus=1" class="header">{{ goodsSellingCount.total_selling }}</router-link>
                            <!-- 上架商品 -->
                            <div class="center">{{ $t("home.GoodsShelves") }}</div>
                            <div class="flex between bottom">
                                <div>FBT: {{ goodsSellingCount.FBT_total_selling }}</div>
                                <div>FBM: {{ goodsSellingCount.FBM_total_selling }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="after flex vcenter">
                        <div class="flex column vcenter left-son-item">
                            <router-link to="/goodsManage/goodsList?saleStatus=0" class="header">{{ goodsSellingCount.total_not_selling }}</router-link>
                            <!-- 下架商品 -->
                            <div class="center">{{ $t("home.soldOut") }}</div>
                            <div class="flex between bottom">
                                <div>FBT: {{ goodsSellingCount.FBT_total_not_selling }}</div>
                                <div>FBM: {{ goodsSellingCount.FBM_total_not_selling }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="after flex vcenter">
                        <div class="flex column vcenter left-son-item">
                            <router-link to="/goodsManage/goodsList?saleStatus=0&status=7" class="header">{{ goodsSellingCount.total_shelf_has_stock }}</router-link>
                            <!-- 下架有库存商品 -->
                            <div class="center">{{ $t("home.GoodsStockShelves") }}</div>
                            <div class="flex between bottom">
                                <div>FBT: {{ goodsSellingCount.FBT_total_shelf_has_stock }}</div>
                                <div>FBM: {{ goodsSellingCount.FBM_total_shelf_has_stock }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex column vcenter left-son-item">
                        <router-link to="/goodsManage/goodsList?status=4" class="header">{{ goodsSellingCount.total_not_stock }}</router-link>
                        <!-- 售罄(缺货) -->
                        <div class="center">{{ $t("home.sellOut") }}</div>
                        <div class="flex between bottom">
                            <div>FBT: {{ goodsSellingCount.FBT_total_not_stock }}</div>
                            <div>FBM: {{ goodsSellingCount.FBM_total_not_stock }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fs-16 flex vcenter mb-12">
                <div class="pane-line"></div>
                <!-- 库存规划 -->
                <span class="pane-fs">{{ $t("home.InventoryPlanning") }}</span>
            </div>
            <div class="flex flex-item mb-20">
                <div class="after flex vcenter">
                    <div class="flex column vcenter left-son-item">
                        <div class="header">{{ wareStockCount.total_sku_warn_num }}</div>
                        <!-- 预警SKU -->
                        <div class="center">{{ $t("home.WarningSKU") }}</div>
                        <div class="flex between bottom">
                            <div>FBT: {{ wareStockCount.FBT_total_sku_warn_num }}</div>
                            <div>FBM: {{ wareStockCount.FBM_total_sku_warn_num }}</div>
                        </div>
                    </div>
                </div>
                <div class="after flex vcenter">
                    <div class="flex column vcenter left-son-item">
                        <div class="header">{{ wareStockCount.total_can_sale_stock }}</div>
                        <!-- 可售库存 -->
                        <div class="center">{{ $t("home.AvailableStock") }}</div>
                        <div class="flex between bottom">
                            <div>FBT: {{ wareStockCount.FBT_total_can_sale_stock }}</div>
                            <div>FBM: {{ wareStockCount.FBM_total_can_sale_stock }}</div>
                        </div>
                    </div>
                </div>
                <div class="after flex vcenter">
                    <div class="flex column vcenter left-son-item">
                        <router-link to="/warehouse/inventory" class="header">{{ wareStockCount.FBT_total_stock_bad }}</router-link>
                        <!-- 次品库存 -->
                        <div class="center">{{ $t("home.DefectiveGoodsInventory") }}</div>
                        <div class="flex between bottom">
                            <div>FBT: {{ wareStockCount.FBT_total_stock_bad }}</div>
                            <div>FBM: 0</div>
                        </div>
                    </div>
                </div>
                <div class="flex column vcenter left-son-item">
                    <router-link to="/warehouse/inventory" class="header">{{ wareStockCount.FBT_total_transit_num }}</router-link>
                    <!-- 在途库存 -->
                    <div class="center">{{ $t("home.inTransitStock") }}</div>
                    <div class="flex between bottom">
                        <div>FBT: {{ wareStockCount.FBT_total_transit_num }}</div>
                        <div>FBM: 0</div>
                    </div>
                </div>
            </div>

            <!-- 订单数据统计 -->
            <div class="fs-16 flex vcenter mb-12">
                <div class="pane-line"></div>
                <span class="pane-fs">{{ $t("home.orderDataCount") }}</span>
            </div>
            <div class="charts-box" style="width: 100%;height: 400px;"></div>
        </div>
        <div class="right">
            <div class="flex between vcenter one">
                <div>{{ userInfo.storeName }}</div>
                <div><BmImage :src="userInfo.storeLogoUrl" fit="cover" style="width:50px;height:50px" class="round-999" /></div>
            </div>
            <div class="flex between vcenter two">
                <!-- 卖家编号 -->
                <div>{{ $t("home.sellerNum") }}</div>
                <div>{{ userInfo.storeCode }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed, nextTick } from "vue";
import { getOrderCount, getGoodsCheckCount, getGoodsSellingCount, getBackProductCount, getWareStockCount, getOrderLineChart } from "@/api/home";
import { useStore } from "vuex";
import echarts from "@/plugins/echarts";

export default {
    name: "home",
    setup() {
        const store = useStore();

        //店铺信息
        const userInfo = computed(() => store.state.user.storeInfo);

        // 订单统计
        let countOrder = ref({}),
            goodsCheckCount = ref({}),
            goodsSellingCount = ref({}),
            backProductCount = ref({}),
            wareStockCount = ref({});

        const initData = () => {
            //订单
            getOrderCount()
                .then((res) => {
                    countOrder.value = res.data;
                })
                .catch(() => {});

            //商品审核统计
            getGoodsCheckCount()
                .then((res) => {
                    goodsCheckCount.value = res.data;
                })
                .catch(() => {});

            // 商品上下架统计
            getGoodsSellingCount()
                .then((res) => {
                    goodsSellingCount.value = res.data;
                })
                .catch(() => {});

            //发补货统计
            getBackProductCount()
                .then((res) => {
                    backProductCount.value = res.data;
                })
                .catch(() => {});

            //库存规划
            getWareStockCount()
                .then((res) => {
                    wareStockCount.value = res.data;
                })
                .catch(() => {});
        };
        initData();

        // 指定图表的配置项和数据
        let option = {
            title: {
                text: ""
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {},
            xAxis: {
                type: "category",
                data: [],
                axisLabel: {
                    interval: 0,
                    rotate: 40 // 文字倾斜
                },
                boundaryGap: false // 无间隙
            },

            yAxis: {
                type: "value",
                minInterval: "1"
            },
            series: [
                {
                    data: [],
                    type: "line",
                    //smooth: true,
                    itemStyle: {
                        borderColor: "#42b7ae",
                        color: "#42b7ae"
                    }
                }
            ],
            lineStyle: {
                color: "#42b7ae" //改变折线颜色
            },
            grid: {
                top: "30px",
                left: "3%",
                right: "0",
                bottom: "3%",
                containLabel: true
            }
        };

        //订单折线图  xType: 0->今天总订单量 1->昨天订单 2->7天订单图 3->一个月订单图
        getOrderLineChart({ xType: 3 })
            .then((res) => {
                option.xAxis.data = res.data.xAxisData;
                option.series[0].data = res.data.saleList;
                nextTick(() => {
                    let myChart = echarts.init(document.querySelector(".charts-box"));
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                });
            })
            .catch(() => {});

        return {
            userInfo,
            countOrder,
            goodsCheckCount,
            goodsSellingCount,
            backProductCount,
            wareStockCount
        };
    }
};
</script>

<style lang="scss" scoped>
.content-wrap {
    position: relative;
    background: #ffffff;
    width: 100%;
    padding: 20px;
    .left {
        padding-right: 350px;
        height: 100%;
        .pane-line {
            width: 2px;
            height: 20px;
            background: #42b7ae;
            display: inline-block;
        }
        .pane-fs {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 22px;
            margin-left: 5px;
        }

        .flex-item {
            border: 1px solid #ededed;
            align-content: space-between;
            .left-son-item {
                width: 100%;
                height: 100px;
                justify-content: space-around;
            }

            .header {
                font-size: 22px;
                font-family: DIN-Bold, DIN;
                font-weight: bold;
                color: #42b7ae;
                line-height: 27px;
            }

            .center {
                color: #333333;
                line-height: 17px;
            }

            .bottom {
                color: #999999;
                line-height: 17px;
                > div {
                    padding: 0 10px;
                }
            }

            .after {
                width: 100%;
                height: 100px;
            }

            .after::after {
                content: "";
                display: block;
                width: 1px;
                height: 40px;
                background: #ededed;
            }
        }
    }

    .right {
        position: absolute;
        right: 20px;
        width: 325px;
        top: 20px;
        border: 1px solid #ebebeb;
        padding: 0px 19px 30px 19px;

        .one {
            height: 133px;
            border-bottom: 1px solid #ebebeb;
            margin-bottom: 27px;
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 25px;
        }

        .two {
            margin-bottom: 83px;
        }

        .three {
            margin-bottom: 12px;
        }

        .four {
        }
    }
}
</style>
