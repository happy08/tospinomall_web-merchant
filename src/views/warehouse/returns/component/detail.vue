<template>
    <BmDialog v-model:visible="visible" :title="$t('table.detail')" :width="1000" @close="cancel" top="10vh">
        <!-- 卖家地址 -->
        <div class="mb-15 fs-12">
            <span class="red">*</span> {{ $t("warehouse.shipAddress") }}：
            {{ tableData.receiverAddress }}
        </div>
        <BmTable v-if="tableData.backReturnItems" :data="tableData.backReturnItems" v-loading="tableLoading" class="mb-20">
            <BmTableColumn prop="status" :label="$t('status.status')" width="90">
                <template #default="scope">
                    <!-- deliveryType 1FBM  2FBT
								hasSale 1可售 0不可售   
								stock数量
								isDown 1下架  0上架 
							-->
                    <div>
                        {{ scope.row.backProductSkuVo.deliveryType == 1 ? "FBM" : "FBT" }}
                    </div>
                    <div>{{ scope.row.backProductSkuVo.hasSale == 1 ? $t("status.onSale") : $t("status.notSale") }}({{ scope.row.backProductSkuVo.stock }})</div>
                    <div>
                        {{ scope.row.backProductSkuVo.isDown == 1 ? "下架" : "上架" }}
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('image')" width="70px">
                <template #default="scope">
                    <BmImage :src="scope.row.picture" style="width:50px;height:50px" class="mr-10" />
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('warehouse.info')">
                <template #default="scope">
                    <div :class="scope.row.delFlag ? 'through grey' : ''">
                        <span class="green"> {{ scope.row.goodTitle }}</span>
                        （
                        {{ scope.row.backProductSkuVo.skuAttr && scope.row.backProductSkuVo.skuAttr.join(" / ") }}
                        ）<br />
                        {{ $t("warehouse.sellerSKU") }}：{{ scope.row.backProductSkuVo.skuCode }}
                        <br />
                        TSIN：{{ scope.row.backProductSkuVo.tsin }}<br />
                        FNSKU：{{ scope.row.backProductSkuVo.fnsku }}
                    </div>
                </template>
            </BmTableColumn>

            <BmTableColumn prop="returnNum" :label="$t('returns.returnNum')" width="100"></BmTableColumn>
            <BmTableColumn prop="internationalCode" :label="$t('goodsListTable.internationalCode')" width="150">
                <template #default="scope">
                    {{ scope.row.backProductSkuVo.internationalCode }}
                </template>
            </BmTableColumn>
        </BmTable>

        <div class="flex">
            <!-- 商家备注 -->
            <div class="flex flex1 mr-30 fs-12">
                <span> {{ $t("warehouse.businessmenNote") }}：</span>
                <div class="flex1">{{ tableData.sellerNote }}</div>
            </div>
            <!-- 平台备注 -->
            <div v-if="tableData.reason" class="flex flex1 ml-30 fs-12">
                <span> {{ $t("warehouse.platformNote") }}：</span>
                <div class="flex1">
                    <div>{{ tableData.reason }}</div>
                    <BmImage v-for="(item, index) in tableData.voucherImgList" :key="index" :src="item" :preview-src-list="tableData.voucherImgList" class="m-5" style="width:50px;height:50px;" />
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex hcenter vcenter">
                <el-button @click="cancel">{{ $t("cancel") }}</el-button>
            </div>
        </template>
    </BmDialog>
</template>

<script>
import { ref, watch } from "vue";
import { returnProductInfo } from "@/api/warehouse";

export default {
    name: "replenishManageAddEdit",
    components: {},
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: Object
    },
    setup(props, { emit }) {
        //获取列表
        let tableLoading = ref(false);
        let tableData = ref({
            sellerNote: "",
            reason: "",
            receiverAddress: "",
            saveStatus: 0, //保存状态0草稿 1保存并提交审核
            backReturnItems: []
        });
        watch(
            () => props.row,
            (nVal) => {
                if (nVal.id) {
                    tableLoading.value = true;
                    returnProductInfo(nVal.id)
                        .then((res) => {
                            tableData.value = res.data;
                            tableLoading.value = false;
                        })
                        .catch((err) => {
                            tableLoading.value = false;
                            //清空
                            tableData.value = {
                                sellerNote: "",
                                reason: "",
                                receiverAddress: "",
                                saveStatus: 0, //保存状态0草稿 1保存并提交审核
                                backReturnItems: []
                            };
                        });
                }
            }
        );

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            tableLoading,
            tableData,
            cancel
        };
    }
};
</script>
