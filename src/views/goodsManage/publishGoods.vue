<template>
    <div v-if="!editVisible" class="bg-white round-4" :class="!isEdit ? 'p-25 ' : ''">
        <div v-if="!isEdit" class="mb-20">
            <BmBreadcrumb />
        </div>
        <div>
            <div class="pane1">
                <BmAlert :title="$t('goods.releaseTips')" icon="warning" />

                <el-cascader
                    ref="searchRef"
                    :placeholder="$t('search')"
                    :options="cascaderOptions"
                    :props="cascaderOptionsProps"
                    @change="onChangeSearchCascader"
                    v-model="searchCascaderCategory"
                    class="mtb-15"
                    clearable
                    filterable
                    :filter-method="searchFilterMethod"
                ></el-cascader>

                <div class="select flex" :style="{ height: !isEdit ? 'calc(100vh - 415px)' : '350px' }">
                    <el-cascader-panel
                        ref="selectRef"
                        v-model="cascaderCategory"
                        :options="cascaderOptions"
                        :props="cascaderOptionsProps"
                        @change="onChangeCascader"
                        style="margin:-1px"
                        class="cascader-publish-goods"
                    ></el-cascader-panel>
                </div>
            </div>

            <BmAlert type="primary" class="mtb-15">
                <div class="flex between">
                    <!-- 已选 -->
                    <div>{{ $t("goods.selected") }}: {{ lable }}</div>
                    <!-- 已选分类抽佣比例 -->
                    <div>{{ $t("goods.selectedRakeRatio") }}: {{ percentageValue }}%;</div>
                </div>
            </BmAlert>

            <!-- 温馨提示 -->
            <div class="orange">{{ $t("goods.warmTips") }}</div>

            <div class="flex center">
                <!-- 确认发布该类目商品 -->
                <el-button type="primary" @click="handlePublishGoods">{{ $t("goods.confirmRelease") }}</el-button>
            </div>
        </div>
    </div>

    <!-- 选择发布商品类型 -->
    <SelectionDeliveryType v-model:visible="deliveryVisible" @change="onChangeDeliveryType" />

    <!-- 编辑-->
    <GoodsInfoDetailEdit v-if="editVisible" v-model:visible="editVisible" :row="editRow" />
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { categoryListListAll, percentage } from "@/api/goods";
import GoodsInfoDetailEdit from "./goodsInfoDetailEdit";
import SelectionDeliveryType from "./component/selectionDeliveryType";

export default {
    name: "publishGoods",
    components: { GoodsInfoDetailEdit, SelectionDeliveryType },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let searchCascaderCategory = ref("");
        let cascaderCategory = ref(); //选中数组
        let cascaderOptions = ref();

        let cascaderOptionsProps = ref({
            label: "cnName",
            value: "id",
            children: "children"
        });

        // 树形数据
        const listtree = () => {
            let params = { keyword: "", status: 1 };
            const loading = proxy.$loading();
            categoryListListAll(params)
                .then((res) => {
                    cascaderOptions.value = getTree(res.data);
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
        };
        listtree();

        function getTree(data) {
            // // 删除 所有 children,以防止多次调用
            // data.forEach(function(item) {
            //     delete item.children;
            // });

            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            let map = {};
            data.forEach(function(item) {
                map[item.id] = item;
            });

            let val = [];
            data.forEach(function(item) {
                let parent = map[item.parentId];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    val.push(item);
                }
            });
            return val;
        }

        let searchRef = ref(null);
        let selectRef = ref(null);
        let lable = ref();
        let id = ""; // 分类id
        let percentageValue = ref(); // 抽佣比例

        //搜索过滤
        const searchFilterMethod = (node, keyword) => {
            if (!!~node.text.indexOf(keyword) || !!~node.text.toUpperCase().indexOf(keyword.toUpperCase())) {
                return true;
            }
        };

        //获取分类抽佣比例
        const percentages = (id) => {
            percentage(id)
                .then((res) => {
                    percentageValue.value = res.data;
                })
                .catch(() => {});
        };

        const onChangeSearchCascader = (value) => {
            if (!value) return;
            cascaderCategory.value = value; // 给级联面板赋值数组
            let nodes = searchRef.value.getCheckedNodes();
            id = nodes[0].data.id; // 分类id
            lable.value = nodes[0].pathLabels.join(" / ");
            percentages(id);
        };

        //切换级联分类面板
        const onChangeCascader = (value) => {
            let nodes = selectRef.value.getCheckedNodes();
            id = nodes[0].data.id; // 分类id
            lable.value = nodes[0].pathLabels.join(" > ");
            console.log(nodes);
            percentages(id);
        };

        let deliveryVisible = ref(false);
        const handlePublishGoods = () => {
            if (!lable.value) {
                proxy.$message.error(proxy.$t("goods.PleaseSelectCategory"));
                return;
            }
            deliveryVisible.value = true;
        };

        //选中FBT/fBM类型
        let editVisible = ref(false);
        let editRow = ref({});
        const onChangeDeliveryType = (val) => {
            editRow.value = {
                categoryId: id,
                deliveryType: val
            };
            editVisible.value = true;
            deliveryVisible.value = false;
        };

        return {
            deliveryVisible,
            searchCascaderCategory,
            cascaderCategory,
            onChangeSearchCascader,
            cascaderOptions,
            cascaderOptionsProps,
            onChangeCascader,
            searchRef,
            selectRef,
            percentageValue,
            searchFilterMethod,
            lable,
            handlePublishGoods,
            editVisible,
            editRow,
            onChangeDeliveryType
        };
    }
};
</script>
<style lang="scss" scoped>
.pane1 {
    .select {
        min-height: 300px;
        border: 1px solid #ebebeb;
        border-radius: 3px;
        box-sizing: border-box;

        .select-item {
            width: 308px;
            height: 100%;
            padding: 17px 20px 0px 20px;
            border-right: 1px solid #ebebeb;
            .item {
                height: 20px;
                margin-bottom: 15px;
            }
        }

        .select-search {
            width: 276px;
            height: 31px;
            border: 1px solid #ebebeb;
        }
    }
}

.pane2 {
    padding: 20px 24px 24px 24px;
    border: 1px solid #ebebeb;

    .warning {
        width: 600px;
        // height: 31px;
        // background-color: #fffbe6;
        // border: 2px solid #FFE58F;
        // border-radius: 3px;
        // display: flex;
        // align-items: center;
        // padding-left: 10px;
        margin-bottom: 20px;
    }

    .search {
        width: 100%;
        height: 32px;
        margin-bottom: 20px;
    }

    .goods {
        height: 512px;
        // border: 1px solid #ebebeb;
        // border-radius: 3px;
        box-sizing: border-box;
        flex-wrap: wrap;
        align-content: flex-start;

        .goods-item {
            width: 606px;
            height: 132px;
            background: skyblue;
            margin-left: 20px;
            margin-bottom: 20px;
        }
    }
}
.cascader-publish-goods {
    ::v-deep(.el-cascader-menu__wrap) {
        height: 100%;
    }
}
</style>
