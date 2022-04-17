<template>
    <BmDialog v-model:visible="visible" :title="$t('warehouse.info')" :confirm="confirm" :cancel="cancel" :width="850" top="10vh">
        <el-form ref="searchFormRef" :model="searchForm" :inline="true">
            <!-- 信息 -->
            <el-form-item :label="$t('warehouse.info')" prop="keyword">
                <el-input v-model="searchForm.keyword" placeholder="title / tsin / fnsku / upc"> </el-input>
            </el-form-item>
            <!-- 库存 -->
            <el-form-item :label="$t('goodsListTable.stockNum')" prop="hasStock">
                <el-select v-model="searchForm.hasStock" clearable :placeholder="$t('pleaseSelect')">
                    <el-option v-for="item in haveNone" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 库存 -->
            <el-form-item :label="$t('status.status')" prop="status">
                <el-select v-model="searchForm.status" clearable :placeholder="$t('pleaseSelect')">
                    <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>

            <!-- 分类ID -->
            <el-form-item :label="$t('goods.selectCategory')" prop="categoryId">
                <el-select v-model="searchForm.categoryId" filterable remote clearable :placeholder="$t('pleaseSelect')" :remote-method="getCategoryList">
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.cnName" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 有效品牌 -->
            <el-form-item :label="$t('releaseGoods.goodsBrand')" prop="brandId">
                <el-select v-model="searchForm.brandId" filterable remote clearable :placeholder="$t('pleaseSelect')" :remote-method="getBrandListCanUse">
                    <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 查询 -->
            <el-form-item>
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
            </el-form-item>
        </el-form>
        <el-tabs class="custom-tabs-green" v-model="activeName" type="card">
            <!-- 全部 -->
            <el-tab-pane name="first">
                <template #label>
                    <div class="label">{{ $t("status.all") }}</div>
                </template>

                <template v-if="selectionType === 'checkbox'">
                    <!-- 全选按钮 -->
                    <div class="checkbox-all-btn">
                        <el-checkbox v-model="checkboxAll" @change="changeCheckboxAll"> &nbsp;</el-checkbox>
                    </div>
                    <!-- 多选 -->
                    <el-checkbox-group v-model="tableSelectionIds">
                        <BmTable ref="multipleTable" :data="tableData" v-loading="tableLoading" @row-click="handleRowClick" row-key="id" height="400" class="mb-20">
                            <BmTableColumn width="55px">
                                <template #default="scope">
                                    <el-checkbox v-model="scope.row.id" @click.stop @change="changeCheckbox($event, scope.row)" :label="scope.row.id">
                                        &nbsp;
                                    </el-checkbox>
                                </template>
                            </BmTableColumn>
                            <BmTableColumn :label="$t('image')" width="70px">
                                <template #default="scope">
                                    <BmImage :src="scope.row.picture" style="width:50px;height:50px" class="mr-10" />
                                </template>
                            </BmTableColumn>
                            <BmTableColumn :label="$t('warehouse.info')">
                                <template #default="scope">
                                    {{ scope.row.title }}
                                    <span class="green"> ({{ scope.row.skuAttr && scope.row.skuAttr.join("/") }}) </span>
                                </template>
                            </BmTableColumn>
                            <BmTableColumn prop="tsin" label="TSIN" width="160"> </BmTableColumn>
                            <BmTableColumn prop="fnsku" label="FNSKU" width="160"> </BmTableColumn>
                        </BmTable>
                    </el-checkbox-group>
                </template>

                <!-- 单选 -->
                <BmTable v-else ref="multipleTable" :data="tableData" v-loading="tableLoading" @row-click="handleRowClick" row-key="id" height="400" class="mb-20">
                    <BmTableColumn width="55px">
                        <template #default="scope">
                            <el-radio v-model="tableSelectionIds" @click.stop @change="changeRadio($event, scope.row)" :label="scope.row.id">
                                &nbsp;
                            </el-radio>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('image')" width="70px">
                        <template #default="scope">
                            <BmImage :src="scope.row.picture" style="width:50px;height:50px" class="mr-10" />
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('warehouse.info')">
                        <template #default="scope">
                            {{ scope.row.title }}
                            <span class="green"> ({{ scope.row.skuAttr && scope.row.skuAttr.join("/") }}) </span>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="tsin" label="TSIN" width="160"> </BmTableColumn>
                    <BmTableColumn prop="fnsku" label="FNSKU" width="160"> </BmTableColumn>
                </BmTable>

                <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
            </el-tab-pane>

            <!-- 已选 -->
            <el-tab-pane name="second" class="p-0">
                <template #label>
                    <div class="label">{{ $t("table.selected") }}（{{ tableSelectionRows.length }}）</div>
                </template>
                <BmTable :data="tableSelectionRows" height="400" class="mb-20">
                    <BmTableColumn :label="$t('image')" width="70px">
                        <template #default="scope">
                            <BmImage :src="scope.row.picture" style="width:50px;height:50px" class="mr-10" />
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('warehouse.info')">
                        <template #default="scope">
                            {{ scope.row.title }}
                            <span class="green"> ({{ scope.row.skuAttr && scope.row.skuAttr.join("/") }}) </span>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="tsin" label="TSIN" width="160"> </BmTableColumn>
                    <BmTableColumn prop="fnsku" label="FNSKU" width="160"> </BmTableColumn>
                    <BmTableColumn :label="$t('table.operation')" width="80">
                        <template #default="scope">
                            <el-button @click="handleDelete(scope.row)" type="text">
                                {{ $t("warehouse.delete") }}
                            </el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </el-tab-pane>
        </el-tabs>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { skuSellerList } from "@/api/warehouse";
import { categoryListTree, brandListCanUse } from "@/api/goods";

export default {
    name: "ShipmentsPlanAdd",
    components: {},
    props: {
        visible: Boolean,
        rows: Array,
        //单选radio 多选checkbox
        selectionType: {
            type: String,
            default: "checkbox"
        },
        isBack: [Number, String] //1->表示添加发补货的商品搜索列表 2->发补货退货的商品搜索列表
    },
    emits: ["change", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let activeName = ref("first");
        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //有无 (1有 0无)
        const haveNone = [
            {
                name: proxy.$t("have"),
                value: 1
            },
            {
                name: proxy.$t("none"),
                value: 0
            }
        ];
        //状态
        const statusList = [
            {
                name: proxy.$t("orderQuery.all"),
                value: ""
            },
            {
                name: proxy.$t("status.inReview"),
                value: 0
            },
            {
                name: proxy.$t("status.auditPass"),
                value: 1
            },
            {
                name: proxy.$t("status.auditRejected"),
                value: 2
            },
            {
                name: proxy.$t("status.onSale"),
                value: 3
            },
            {
                name: proxy.$t("status.notSale"),
                value: 4
            }
        ];
        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            keyword: "", //参数名称
            pageNum,
            pageSize,
            status: "",
            isBack: props.isBack //1->表示添加发补货的商品搜索列表 2->发补货退货的商品搜索列表
        });
        //搜索
        const handelSearch = () => {
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        const multipleTable = ref(null);
        let tableLoading = ref(true);
        let tableData = ref([]);
        //获取商品sku列表
        const initData = () => {
            skuSellerList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((item) => {
                        item.skuId = item.id;
                        return item;
                    });
                    tableLoading.value = false;
                })
                .catch(() => {});
        };
        initData();

        let tableSelectionRows = ref([]); //所有选中的
        let tableSelectionIds = ref([]); //所有选中的ids

        watch(
            () => props.rows,
            (nVal) => {
                tableSelectionRows.value = [...nVal];

                //单选
                if (props.selectionType === "radio") {
                    tableSelectionIds.value = (nVal && nVal.length && nVal[0].skuId) || "";
                    return;
                }
                tableSelectionIds.value = nVal.map((item) => item.skuId);
            },
            {
                deep: true
            }
        );

        //多选的全选
        let checkboxAll = ref(false);
        const changeCheckboxAll = (val) => {
            if (val === true) {
                tableSelectionRows.value = [...tableData.value];
                tableSelectionIds.value = tableData.value.map((item) => item.skuId);
            } else {
                tableSelectionRows.value = [];
                tableSelectionIds.value = [];
            }
        };

        //点击单行-选择
        const handleRowClick = (row) => {
            //单选
            if (props.selectionType === "radio") {
                tableSelectionRows.value = [row];
                tableSelectionIds.value = row.id;
                return;
            }
            const index = tableSelectionRows.value.findIndex((item) => item.skuId === row.skuId);
            if (index === -1) {
                tableSelectionRows.value.push(row);
                tableSelectionIds.value.push(row.id);
            } else {
                tableSelectionRows.value.splice(index, 1);
                tableSelectionIds.value.splice(index, 1);
            }
        };

        //切换单个Checkbox
        const changeCheckbox = (val, row) => {
            if (val === true) {
                tableSelectionRows.value.push(row);
            } else {
                const index = tableSelectionRows.value.findIndex((item) => item.skuId === row.skuId);
                tableSelectionRows.value.splice(index, 1);
                //全选设置为false
                if (tableSelectionRows.value.length === 0) {
                    checkboxAll.value = false;
                }
            }
        };

        //切换单个radio
        const changeRadio = (val, row) => {
            tableSelectionRows.value = [row];
        };

        //删除
        const handleDelete = (row) => {
            const index = tableSelectionRows.value.findIndex((item) => item.skuId === row.skuId);
            tableSelectionRows.value.splice(index, 1);
            //单选
            if (props.selectionType === "radio") {
                tableSelectionIds.value = "";
                return;
            }
            tableSelectionIds.value.splice(index, 1);
        };

        //分类
        let categoryList = ref([]);
        const getCategoryList = (key) => {
            const params = {
                keyword: key,
                status: 1 //状态：1：可用 0：不可用
            };
            categoryListTree(params).then((res) => {
                categoryList.value = res.data;
            });
        };
        //品牌
        let brandList = ref([]);
        const getBrandListCanUse = (key) => {
            const params = {
                keyword: key
            };
            brandListCanUse(params).then((res) => {
                brandList.value = res.data;
            });
        };

        const confirm = () => {
            //单选tableSelectionIds.value是字符串，多选是数组
            if (props.selectionType === "radio") {
                emit("change", [...tableSelectionRows.value], [tableSelectionIds.value]);
            } else {
                emit("change", [...tableSelectionRows.value], [...tableSelectionIds.value]);
            }
            emit("update:visible", false);
            setTimeout(() => {
                tableSelectionIds.value = [];
                tableSelectionRows.value = [];
            }, 500);
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        //当前页
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

        return {
            haveNone,
            activeName,
            searchFormRef,
            searchForm,
            handelSearch,
            resetForm,
            multipleTable,
            tableData,
            tableLoading,
            tableSelectionRows,
            tableSelectionIds,
            checkboxAll,
            changeCheckboxAll,
            changeCheckbox,
            changeRadio,
            handleRowClick,
            handleDelete,
            confirm,
            cancel,
            pageNum,
            pageTotal,
            handleSizeChange,
            handleCurrentChange,
            categoryList,
            getCategoryList,
            statusList,
            brandList,
            getBrandListCanUse
        };
    }
};
</script>

<style lang="scss" scoped>
.checkbox-all-btn {
    position: absolute;
    top: 45px;
    left: 35px;
}
</style>
