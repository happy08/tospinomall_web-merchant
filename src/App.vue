<template>
    <router-view />
</template>
<script>
import { provide, computed, getCurrentInstance } from "vue";

export default {
    name: "App",
    setup() {
        const { proxy } = getCurrentInstance();

        //数据字典
        const dict = computed(() => {
            return {
                //是否（1是 0否）
                yesNo: [
                    {
                        name: proxy.$t("yes"),
                        value: 1
                    },
                    {
                        name: proxy.$t("no"),
                        value: 0
                    }
                ],
                //有无 (0有 1无)
                haveNone: [
                    {
                        name: proxy.$t("have"),
                        value: 0
                    },
                    {
                        name: proxy.$t("none"),
                        value: 1
                    }
                ],
                //通过驳回（2通过 3驳回）
                passReject: [
                    {
                        name: proxy.$t("status.pass"),
                        value: 2
                    },
                    {
                        name: proxy.$t("status.reject"),
                        value: 3
                    }
                ],
                //禁用启用（0禁用 1启用）
                forbiddenEnable: [
                    {
                        name: proxy.$t("status.enable"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.forbidden"),
                        value: 0
                    }
                ],
                //支持不支持（0不支持 1支持）
                supportOrNot: [
                    {
                        name: proxy.$t("status.support"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.notSupport"),
                        value: 0
                    }
                ],
                //允许不允许（0不允许 1允许）
                allowOrNot: [
                    {
                        name: proxy.$t("status.allow"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.notAllow"),
                        value: 0
                    }
                ],
                //必填不必填（0不必填 1必填）
                requiredOrNot: [
                    {
                        name: proxy.$t("status.required"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.notRequired"),
                        value: 0
                    }
                ],
                //必选不必选（0不必选 1必选）
                selectOrNot: [
                    {
                        name: proxy.$t("status.select"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.notSelect"),
                        value: 0
                    }
                ],
                //商品参数录入方式（1字符串 2自然数 3日期 4货币 5浮点数 6select单选 7布尔 8时间 9select多选）
                goodsModeList: [
                    {
                        name: proxy.$t("attribute.string"),
                        value: 1
                    },
                    {
                        name: proxy.$t("attribute.number"),
                        value: 2
                    },
                    {
                        name: proxy.$t("attribute.date"),
                        value: 3
                    },
                    {
                        name: proxy.$t("attribute.currency"),
                        value: 4
                    },
                    {
                        name: proxy.$t("attribute.decimals"),
                        value: 5
                    },
                    {
                        name: proxy.$t("attribute.bool"),
                        value: 7
                    },
                    {
                        name: proxy.$t("attribute.time"),
                        value: 8
                    },
                    {
                        name: proxy.$t("attribute.radio"),
                        value: 6
                    },
                    {
                        name: proxy.$t("attribute.select"),
                        value: 9
                    }
                ],
                //审核状态（1待审核 2已通过 3未通过 4屏蔽中 5待更新）
                auditStatus: [
                    {
                        name: proxy.$t("status.beAudit"),
                        value: 1
                    },
                    {
                        name: proxy.$t("status.auditPass"),
                        value: 2
                    },
                    {
                        name: proxy.$t("status.auditRejected"),
                        value: 3
                    },
                    {
                        name: proxy.$t("status.shield"),
                        value: 4
                    },
                    {
                        name: proxy.$t("status.beUpdated"),
                        value: 5
                    }
                ],
                //商标类型（1自有商标 2授权商标）
                brandType: [
                    {
                        name: proxy.$t("brand.own"),
                        value: 1
                    },
                    {
                        name: proxy.$t("brand.auth"),
                        value: 2
                    }
                ],
                //商标注册人类型（1自有商标 2授权商标）
                brandRegistrant: [
                    {
                        name: proxy.$t("brand.notNatural"),
                        value: 1
                    },
                    {
                        name: proxy.$t("brand.natural"),
                        value: 2
                    }
                ],
                //发补货状态列表（0->草稿 1->审核中 2->待发货 3->待收货 4->在运营中心 5->入仓完成 6->驳回 7->已拒签）
                shippingStatus: [
                    {
                        name: proxy.$t("warehouse.audit"),
                        value: 1
                    },
                    {
                        name: proxy.$t("warehouse.waitDelivery"),
                        value: 2
                    },
                    {
                        name: proxy.$t("warehouse.waitReceiving"),
                        value: 3
                    },
                    {
                        name: proxy.$t("warehouse.InOperations"),
                        value: 4
                    },
                    {
                        name: proxy.$t("warehouse.completedLevite"),
                        value: 5
                    },
                    {
                        name: proxy.$t("warehouse.draft"),
                        value: 0
                    },
                    {
                        name: proxy.$t("warehouse.reject"),
                        value: 6
                    },
                    {
                        name: proxy.$t("warehouse.haveVisa"),
                        value: 7
                    }
                ],
                //退货发补货状态（0草稿 1审核中 2审核驳回 3待出库 4退货协商中 5退货出库完成）
                returnsStatus: [
                    {
                        name: proxy.$t("returns.draft"),
                        value: 0
                    },
                    {
                        name: proxy.$t("returns.inReview"),
                        value: 1
                    },
                    {
                        name: proxy.$t("returns.auditRejected"),
                        value: 2
                    },
                    {
                        name: proxy.$t("returns.outbound"),
                        value: 3
                    },
                    {
                        name: proxy.$t("returns.negotiation"),
                        value: 4
                    },
                    {
                        name: proxy.$t("returns.finish"),
                        value: 5
                    }
                ],
                //店铺装修页面类型（1PC端页面 2手机端页面 3专题页）
                storePageList: [
                    {
                        name: proxy.$t("storeDesign.pcPage"),
                        value: 1
                    },
                    {
                        name: proxy.$t("storeDesign.mobilePage"),
                        value: 2
                    }
                ],
                // 付款方式(1.在线支付  2.货到付款 3.在线支付货到付款)
                onlineOffline: [
                    {
                        name: proxy.$t("orderQuery.onlinePayment"),
                        value: 1
                    },
                    {
                        name: proxy.$t("orderQuery.payOnDelivery"),
                        value: 2
                    },
                    {
                        name: proxy.$t("orderQuery.onlinePayment") + " / " + proxy.$t("orderQuery.payOnDelivery"),
                        value: 3
                    }
                ]
            };
        });
        provide("dict", dict);
    }
};
</script>
