<template>
    <div class="p-25 mb-25 bg-white round-4 top-search-form">
        <BmBreadcrumb />
        <el-radio-group v-model="radio" class="mb-25" @change="radioChange">
            <!-- 批次维度 SKU维度-->
            <el-radio-button label="0">{{ $t("inventory.BatchDimension") }}</el-radio-button>
            <el-radio-button label="1">{{ $t("inventory.skuDimensionality") }}</el-radio-button>
        </el-radio-group>
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form mb-25">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 发补货单号 -->
                    <el-form-item :label="$t('inventory.ReplenishmentBillNo')" prop="backSn">
                        <el-input v-model="searchForm.backSn" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>
                <!-- 商品信息 -->
                <!-- <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('inventory.goodsInfo')" prop="keyword">
                        <el-input v-model="searchForm.keyword" placeholder="Title / TSIN / FNSKU / Batch No. / EAN / UPC"></el-input>
                    </el-form-item>
                </el-col> -->

                <!-- SKU商品信息 -->
                <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skeyword">
                    <template #label>
                        <el-select v-model="searchForm.sIndex" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="(item, index) in goodsMultiList" :key="index" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </template>
                    <el-input v-model="searchForm.skeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" :placeholder="$t('pleaseSelect')"></el-input>
                </el-form-item>

                <el-col :md="12" :lg="6">
                    <!-- 商品类目 -->
                    <el-form-item :label="$t('inventory.goodsCategories')" prop="_categoryId">
                        <el-cascader
                            v-model="searchForm._categoryId"
                            :options="categoryList"
                            :props="{
                                value: 'id',
                                label: 'cnName'
                            }"
                            clearable
                            filterable
                            :show-all-levels="false"
                        ></el-cascader>
                    </el-form-item>
                </el-col>

                <!-- 品牌 -->
                <el-col :md="12" :lg="6">
                    <el-form-item :label="$t('goodsListTable.brandName')" prop="brandId">
                        <el-select v-model="searchForm.brandId" :placeholder="$t('pleaseSelect')" clearable filterable>
                            <el-option v-for="(item, index) in brandList" :key="index" :label="item.brandName" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24" id="elCollapse" class="h-0 hidden">
                <el-col :md="12" :lg="6">
                    <!-- 商品标题 -->
                    <el-form-item :label="$t('goodsList.keyword')" prop="titleKeyword">
                        <el-input v-model="searchForm.titleKeyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

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
    <div class="p-25 bg-white round-4" v-if="radio == 0">
        <div class="pt-10 pb-10">
            <span>| {{ $t("generalUtilityTool") }}:</span
            ><span class="ml-15"
                ><el-button v-permission="'warehouse_inventory_export'" @click="handleExportExcel(0)">{{ $t("table.exportExcel") }}</el-button></span
            >
        </div>
        <BmTable ref="multipleTable" :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange" style="width: 100%">
            <BmTableColumn type="selection"></BmTableColumn>
            <BmTableColumn prop="brandName" :label="$t('inventory.brand')" align="center" min-width=""></BmTableColumn>
            <BmTableColumn prop="" :label="$t('inventory.goodsInfo')" align="center" min-width="300">
                <template #default="scope">
                    <div class="flex">
                        <div>
                            <BmImage class="img" :src="scope.row.picture" :preview-src-list="[scope.row.picture]" />
                        </div>
                        <div class="pl-15" style="text-align: left;">
                            <div class="hidden-2 green">{{ scope.row.title }}</div>
                            <div>
                                {{ $t("inventory.sellerNum") }}: {{ scope.row.storeCode }}
                                <span v-clipboard:copy="scope.row.storeCode" v-clipboard:success="onCopy" v-clipboard:error="onError" class="cp green ml-15">{{ $t("copy") }}</span>
                            </div>
                            <div>TSIN: {{ scope.row.tsin }}</div>
                            <div>FNSKU: {{ scope.row.fnsku }}</div>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 规格 -->
            <BmTableColumn prop="attr" :label="$t('inventory.specification')" align="center" min-width="">
                <template #default="scope">
                    <div v-if="scope.row.attr">{{ scope.row.attr.join(",") }}</div>
                </template>
            </BmTableColumn>
            <!-- 国际码 -->
            <BmTableColumn prop="upc" :label="$t('inventory.internationalCode')" align="center" min-width="150" show-overflow-tooltip></BmTableColumn>
            <!-- 批次号 -->
            <BmTableColumn prop="" :label="$t('inventory.batchNumber')" header-align="center" min-width="200" show-overflow-tooltip>
                <template #default="scope">
                    <div>{{ $t("inventory.HairReplenishment") }}: {{ scope.row.batchNo }}</div>
                    <!-- <div>入库: {{ scope.row.warehousingBatchNo }}</div> -->
                </template>
            </BmTableColumn>
            <!-- 补货总数量 -->
            <BmTableColumn prop="backNum" :label="$t('inventory.ReplenishmentQuantityNum')" align="center" min-width=""></BmTableColumn>
            <!-- 入库总数量 -->
            <BmTableColumn prop="putStorageNum" :label="$t('inventory.QuantityStorageNum')" align="center" min-width=""></BmTableColumn>
            <!-- 库存 -->
            <BmTableColumn prop="" :label="$t('inventory.repertory')" align="center" min-width="80">
                <template #default="scope">
                    <!--正品  次品 在途 调拨-->
                    <div>{{ $t("inventory.qualityGoods") }}: {{ scope.row.batchNoGoodNum }}</div>
                    <div>{{ $t("inventory.InferiorQuality") }}: {{ scope.row.batchNoBadNum }}</div>
                    <div>{{ $t("inventory.onPassage") }}: {{ scope.row.batchNoWayNum }}</div>
                    <div>{{ $t("inventory.allot") }}: {{ scope.row.batchNoTransitNum }}</div>
                </template>
            </BmTableColumn>
            <!-- 补货 重量/尺寸 -->
            <BmTableColumn prop="" :label="$t('inventory.ReplenishmentWeightSize')" align="center" min-width="80">
                <template #default="scope">
                    <div>{{ scope.row.weight }}KG</div>
                    <div>{{ scope.row.itemVolume }}m3</div>
                    <div>{{ scope.row.itemLong }}x{{ scope.row.itemWide }}x{{ scope.row.itemHigh }}</div>
                </template>
            </BmTableColumn>
            <!-- 入库 重量/尺寸 -->
            <BmTableColumn prop="" :label="$t('inventory.StorageWeightSize')" align="center" min-width="80">
                <template #default="scope">
                    <div>{{ scope.row.putWeight }}KG</div>
                    <div>{{ scope.row.putItemVolume }}m3</div>
                    <div>{{ scope.row.putItemLong }}x{{ scope.row.putItemWide }}x{{ scope.row.putItemHigh }}</div>
                </template>
            </BmTableColumn>
            <!-- <BmTableColumn prop="" label="补货 重量/尺寸" align="center" min-width="120"></BmTableColumn>
            <BmTableColumn prop="" label="入库 重量/尺寸" align="center" min-width="120"></BmTableColumn> -->
            <BmTableColumn prop="" :label="$t('inventory.expiryDate')" align="center" min-width="200">
                <template #default="scope">
                    <!--生产时间 到期时间 -->
                    <div>{{ $t("inventory.productionTime") }}: {{ scope.row.validStartTime }}</div>
                    <div>{{ $t("inventory.ExpirationDate") }}: {{ scope.row.validEndTime }}</div>
                </template>
            </BmTableColumn>
        </BmTable>
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
    <!-- sku维度 -->
    <div class="p-25 bg-white round-4" v-if="radio == 1">
        <div class="pt-10 pb-10">
            <span>| {{ $t("generalUtilityTool") }}:</span
            ><span class="ml-15"
                ><el-button v-permission="'warehouse_inventory_export'" @click="handleExportExcel(1)">{{ $t("table.exportExcel") }}</el-button></span
            >
        </div>
        <BmTable ref="multipleTable" :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange" style="width: 100%">
            <BmTableColumn type="selection"></BmTableColumn>
            <!-- 品牌 -->
            <BmTableColumn prop="brandName" :label="$t('inventory.brand')" align="center" min-width=""></BmTableColumn>
            <!-- 商品信息 -->
            <BmTableColumn prop="" :label="$t('inventory.goodsInfo')" align="center" min-width="300">
                <template #default="scope">
                    <div class="flex">
                        <div>
                            <BmImage class="img" :src="scope.row.picture" :preview-src-list="[scope.row.picture]" />
                        </div>
                        <div class="pl-15" style="text-align: left;">
                            <div class="hidden-2 green">{{ scope.row.title }}</div>
                            <div>
                                {{ $t("inventory.sellerNum") }}: {{ scope.row.storeCode }}
                                <span v-clipboard:copy="scope.row.storeCode" v-clipboard:success="onCopy" v-clipboard:error="onError" class="cp green ml-15">复制</span>
                            </div>
                            <div>TSIN: {{ scope.row.tsin }}</div>
                            <div>FNSKU: {{ scope.row.fnsku }}</div>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 规格 -->
            <BmTableColumn prop="skuAttr" :label="$t('inventory.specification')" align="center" min-width="">
                <template #default="scope">
                    <div v-if="scope.row.skuAttr">{{ scope.row.skuAttr.join(",") }}</div>
                </template>
            </BmTableColumn>
            <!-- 国际码 -->
            <BmTableColumn prop="internationalCode" :label="$t('inventory.internationalCode')" align="center" min-width="150" show-overflow-tooltip></BmTableColumn>
            <!-- FBT总入库数 -->
            <BmTableColumn prop="totalSupplyNum" :label="$t('inventory.FBTIncomingNum')" align="center" min-width=""></BmTableColumn>
            <!-- FBT总退货数 -->
            <BmTableColumn prop="totalSupplyRefundNum" :label="$t('inventory.totalReturnNum')" align="center" min-width=""></BmTableColumn>
            <!-- 销售出库数 -->
            <BmTableColumn prop="saleOutNum" :label="$t('inventory.SalesOutWarehouseNum')" align="center" min-width=""></BmTableColumn>
            <!-- 售后入库数 -->
            <BmTableColumn prop="totalSaleRefundNum" :label="$t('inventory.warehouseAfterSaleNum')" align="center" min-width=""></BmTableColumn>
            <!-- 仓库正品数 -->
            <BmTableColumn prop="fbtStockNum" :label="$t('inventory.WarehouseQuantityNum')" align="center" min-width=""></BmTableColumn>
            <!-- 仓库次品数 -->
            <BmTableColumn prop="stockBadNum" :label="$t('inventory.warehouseInferiorQualityNum')" align="center" min-width=""></BmTableColumn>
            <!-- 发/补货在途 -->
            <BmTableColumn prop="stockWayNum" :label="$t('inventory.ShipmentReplenishment')" align="center" min-width=""></BmTableColumn>
            <!-- 预警库存 -->
            <BmTableColumn prop="warnStock" :label="$t('inventory.EarlyWarningInventory')" align="center" min-width=""></BmTableColumn>
        </BmTable>
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { getsCategoryListTree, brandMallList } from "@/api/goods";
import { productBatchStockDetail, productSkuStockDetail, productStockGoodExport, productBatchExport } from "@/api/storeDesign";
import { exportExcel } from "@/utils/";
export default {
    name: "inventory",
    setup(props) {
        let { proxy } = getCurrentInstance();
        let radio = ref("0");

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

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
            {
                name: "UPC", //upc
                value: 2
            },
            {
                name: proxy.$t("releaseGoods.goodsCode"), //商品编码
                value: 3
            }
            // {
            //     name: proxy.$t("goodsList.keyword"), //商品标题
            //     value: 4
            // }
        ]);

        let searchFormRef = ref("");
        let searchForm = reactive({
            brandId: "",
            backSn: "",
            keyword: "",
            _categoryId: [],
            categoryId: "",
            pageTotal: pageTotal.value,
            pageSize: pageSize,
            pageNum: pageNum.value,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        //创建时间
        let timeTypeValue = "createTime";
        let timeTypeName = ref(proxy.$t("createTime"));

        let typeName = ref("是否带电");

        let multipleSelection = ref([]);
        let tableLoading = ref(true);
        let tableData = ref([]);

        const initData = () => {
            tableLoading.value = true;
            searchForm.categoryId = searchForm._categoryId[3]
                ? searchForm._categoryId[3]
                : searchForm._categoryId[2]
                ? searchForm._categoryId[2]
                : searchForm._categoryId[1]
                ? searchForm._categoryId[1]
                : searchForm._categoryId[0];
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            if (radio.value == 0) {
                // 批次维度
                productBatchStockDetail(searchForm)
                    .then((res) => {
                        tableData.value = res.data.records;
                        pageTotal.value = res.data.total;
                        tableLoading.value = false;
                    })
                    .catch(() => {
                        tableLoading.value = false;
                    });
            } else {
                productSkuStockDetail(searchForm)
                    .then((res) => {
                        tableData.value = res.data.records;
                        pageTotal.value = res.data.total;
                        tableLoading.value = false;
                    })
                    .catch(() => {
                        tableLoading.value = false;
                    });
            }
        };
        initData();

        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        //搜索
        const handelSearch = () => {
            initData();
            console.log("searchForm", searchForm);
        };

        const handleSelectionChange = (val) => {
            multipleSelection.value = val;
        };

        //商品类目列表
        let categoryList = ref([]);
        const getCategoryListTree = () => {
            getsCategoryListTree({ status: 1 })
                .then((res) => {
                    categoryList.value = res.data;
                })
                .catch((err) => {});
        };
        getCategoryListTree();

        //品牌列表
        let brandList = ref([]);
        const getBrandMallList = () => {
            brandMallList()
                .then((res) => {
                    brandList.value = res.data;
                })
                .catch((err) => {});
        };
        getBrandMallList();

        let currentPage = ref(1);
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            initData();
            console.log(`当前页: ${val}`);
        };
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            initData();
            console.log(`每页 ${val} 条`);
        };

        const radioChange = (val) => {
            radio.value = val;
            searchForm.pageNum = 1;
            searchFormRef.value.resetFields();
            initData();
        };

        const onCopy = (e) => {
            proxy.$message.success("You just copied: " + e.text);
        };
        const onError = (e) => {
            proxy.$message.error("Failed to copy texts");
        };

        //导出Excel
        const handleExportExcel = (val) => {
            // 1 sku维度 2 批次
            let api = "";
            if (val == 1) {
                api = productStockGoodExport;
            } else {
                api = productBatchExport;
            }
            const loading = proxy.$loading();
            api(searchForm)
                .then((res) => {
                    exportExcel("Inventory details", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        return {
            currentPage,
            handleCurrentChange,
            handelSearch,
            resetForm,

            typeName,
            timeTypeName,
            timeTypeValue,
            radio,
            searchFormRef,
            searchForm,
            tableData,
            tableLoading,
            multipleSelection,
            handleSelectionChange,
            categoryList,
            brandList,
            pageTotal,
            pageNum,
            handleSizeChange,
            handleCurrentChange,
            radioChange,
            onCopy,
            onError,
            handleExportExcel,
            goodsMultiList
        };
    }
};
</script>

<style lang="scss" scoped>
.img {
    width: 59px;
    height: 59px;
    border-radius: 2px;
}
</style>
