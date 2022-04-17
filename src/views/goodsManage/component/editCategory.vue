<template>
    <div class="flex between vcenter mb-15">
        <div>
            {{ option.lable }}
            <span v-if="isEdit" @click="visible = true" class="green cp ml-15">
                {{ $t("releaseGoods.modifyCategory") }}
            </span>
        </div>
        <div>{{ $t("releaseGoods.commissionRatio") }}: {{ option.percentage }}%</div>
    </div>
    <BmDialog v-model:visible="visible" :title="$t('releaseGoods.category')" :width="770" :confirm="confirmCategory" custom-class="edit-category">
        <el-cascader-panel
            ref="selectRef"
            v-model="cascaderCategory"
            :options="treeOptions"
            :props="cascaderOptionsProps"
            @change="onChangeCascader"
            style="margin:-1px"
            class="cascader-publish-goods"
        ></el-cascader-panel>
        <BmAlert type="primary" class="mtb-15">
            <div class="flex between">
                <!-- 已选 -->
                <div>{{ $t("goods.selected") }}: {{ categoryLable }}</div>
                <!-- 已选分类抽佣比例 -->
                <div>{{ $t("goods.selectedRakeRatio") }}: {{ percentageValue }}%;</div>
            </div>
        </BmAlert>
    </BmDialog>

    <!-- 选择发布商品类型
    <SelectionDeliveryType v-model:visible="deliveryVisible" @change="onChangeDeliveryType" /> -->
</template>

<script>
import { ref } from "vue";
import { percentage } from "@/api/goods";
//import SelectionDeliveryType from "./selectionDeliveryType";

export default {
    name: "editCategory",
    //components: { SelectionDeliveryType },
    props: {
        option: {
            type: Object,
            default: () => ({
                lable: "",
                percentage: ""
            })
        },
        isEdit: {
            type: Boolean,
            default: true
        },
        //分类树
        treeOptions: {
            type: Array,
            default: () => []
        }
    },
    emits: ["change"],
    setup(props, { emit }) {
        let cascaderCategory = ref(); //选中数组
        let cascaderOptionsProps = ref({
            label: "cnName",
            value: "code",
            children: "children"
        });

        let selectRef = ref(null);
        let categoryLable = ref(); //已选分类
        let categoryId = ""; // 分类id
        let percentageValue = ref(); // 抽佣比例

        //切换级联分类面板
        const onChangeCascader = (value) => {
            let nodes = selectRef.value.getCheckedNodes();
            categoryId = nodes[0].data.id; // 分类id
            categoryLable.value = nodes[0].pathLabels.join(" > ");
            percentages(categoryId);
        };

        //获取分类抽佣比例
        const percentages = (id) => {
            percentage(id).then((res) => {
                percentageValue.value = res.data;
            });
        };

        //确认分类
        let visible = ref(false);
        let deliveryVisible = ref(false);
        const confirmCategory = () => {
            if (!categoryLable.value) {
                proxy.$message.error("请选择类目");
                return;
            }
            // deliveryVisible.value = true;

            visible.value = false;
            emit("change", { id: categoryId });
        };

        //选中FBT/fBM类型
        // const onChangeDeliveryType = (val) => {
        //     visible.value = false;
        //     deliveryVisible.value = false;
        //     emit("change", { id: categoryId, deliveryType: val });
        // };

        return {
            selectRef,
            cascaderCategory,
            cascaderOptionsProps,
            onChangeCascader,
            categoryLable,
            percentageValue,

            visible,
            confirmCategory,

            deliveryVisible
            //onChangeDeliveryType
        };
    }
};
</script>

<style lang="scss">
// .el-dialog.edit-category .el-dialog__body {
//     padding: 0 !important;
// }
</style>
