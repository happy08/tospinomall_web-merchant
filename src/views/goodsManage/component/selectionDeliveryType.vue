<template>
    <!-- 选择发布商品FBT/FTM类型 -->
    <BmDialog v-model:visible="visible" :title="$t('goods.goodsType')" :width="712" @close="$emit('update:visible', false)" :showFooter="false">
        <div class="flex between vcenter">
            <!-- FBM类型商品 -->
            <div class="dialog-item bg-light-grey" @click="selectType('1')">
                <div class="fw">{{ $t("goods.FBMGoods") }}</div>
                <div class="mb-55">{{ $t("goods.MerchantExpress") }}</div>
                <div>{{ $t("goods.sellerSelectedExpress") }}</div>
            </div>
            <!-- FBT类型商品 -->
            <div class="dialog-item bg-light-grey" @click="selectType('2')">
                <div class="fw">{{ $t("goods.FBTGoods") }}</div>
                <div class="mb-55">{{ $t("goods.TospinoExpressDelivery") }}</div>
                <div>{{ $t("goods.TospinoDelivery") }}</div>
            </div>
        </div>
    </BmDialog>
</template>

<script>
import { ref } from "vue";

export default {
    name: "selectionDeliveryType",
    components: {},
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ["change", "update:visible"],
    setup(props, { emit }) {
        const selectType = (val) => {
            emit("change", val);
        };

        return {
            selectType
        };
    }
};
</script>

<style lang="scss">
.dialog-item {
    width: 319px;
    height: 163px;
    border: 1px solid #ebebeb;
    padding: 23px;
}
.dialog-item:hover {
    border-color: #42b7ae !important;
}
</style>
