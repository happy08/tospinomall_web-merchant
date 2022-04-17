<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 商品类目 -->
                    <el-form-item :label="$t('goods.category')" prop="_categoryId">
                        <el-cascader v-model="searchForm._categoryId" :options="categoryList" :props="{ value: 'id', label: 'cnName' }" clearable filterable :show-all-levels="false"></el-cascader>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 品牌 -->
                    <el-form-item :label="$t('goodsListTable.brandName')" prop="brandId">
                        <el-select v-model="searchForm.brandId" :placeholder="$t('pleaseSelect')" clearable filterable>
                            <el-option v-for="(item, index) in brandList" :key="index" :label="item.brandName" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 产地 -->
                    <el-form-item :label="$t('goodsListTable.countryName')" prop="countryId">
                        <el-select v-model="searchForm.countryId" :placeholder="$t('pleaseSelect')" clearable filterable>
                            <el-option v-for="(item, index) in countryList" :key="index" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 商品信息 -->
                    <el-form-item :label="$t('goodsListTable.goodsInfo')" prop="keyword">
                        <el-input v-model="searchForm.keyword" :placeholder="$t('goodsList.keyword')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div id="elCollapse" class="h-0 hidden">
                <el-row :gutter="24">
                    <!-- SKU商品信息 -->
                    <!-- <el-col :md="12" :lg="6">
                        
                        <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skuKeyword">
                            <el-input v-model="searchForm.skuKeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" placeholder="tsin / fnsku / UPC / sku_code"></el-input>
                        </el-form-item>
                    </el-col> -->

                    <el-col :md="12" :lg="6">
                        <!-- SKU商品信息 -->
                        <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skeyword">
                            <template #label>
                                <el-select v-model="searchForm.sIndex" :placeholder="$t('pleaseSelect')">
                                    <el-option v-for="(item, index) in goodsMultiList" :key="index" :label="item.name" :value="item.value"> </el-option>
                                </el-select>
                            </template>
                            <el-input v-model="searchForm.skeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" :placeholder="$t('pleaseSelect')"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <!-- 是否预售 -->
                        <el-form-item :label="$t('goodsList.isPresell')" prop="isOpenPresell">
                            <el-select v-model="searchForm.isOpenPresell" :placeholder="$t('pleaseSelect')" clearable filterable>
                                <el-option v-for="(item, index) in presellList" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <!-- 状态 -->
                        <el-form-item :label="$t('status.status')" prop="status">
                            <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable filterable>
                                <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <!-- 是否带点 -->
                        <el-form-item prop="carriedOk">
                            <template #label>
                                <el-select v-model="searchForm.carriedIndex" :placeholder="$t('pleaseSelect')">
                                    <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.value"> </el-option>
                                </el-select>
                            </template>
                            <el-select v-model="searchForm.carriedOk" :placeholder="$t('pleaseSelect')" clearable>
                                <el-option :label="$t('orderQuery.all')" value=""></el-option>
                                <el-option v-for="(item, index) in dict.yesNo" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <!-- 时间 -->
                        <el-form-item prop="_tmpTimeValue">
                            <template #label>
                                <el-select v-model="searchForm.timeType" :placeholder="$t('pleaseSelect')">
                                    <el-option v-for="(item, index) in timeTypeList" :key="index" :label="item.name" :value="item.value"> </el-option>
                                </el-select>
                            </template>
                            <el-date-picker
                                v-model="searchForm._tmpTimeValue"
                                type="daterange"
                                :start-placeholder="$t('startDate')"
                                range-separator="-"
                                :end-placeholder="$t('endDate')"
                                :shortcuts="shortcuts"
                                :disabled-date="disabledDate"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :md="12" :lg="6">
                        <!-- 商品标题 -->
                        <el-form-item :label="$t('goodsList.keyword')" prop="titleKeyword">
                            <el-input v-model="searchForm.titleKeyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

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

    <div class="p-25 bg-white round-4">
        <div class="flex between vcenter mb-20">
            <div class="flex vcenter">
                <!-- 批量恢复 -->
                <el-button v-permission="'goodsManage_recyclebin_batchReply'" plain @click="batchReply">{{ $t("recycleBin.batchReply") }}</el-button>
            </div>
            <div class="flex vcenter">
                <!-- 表格选项 -->
                <BmTableOption table="goodsListTable" :column="tableColumn" />
                <el-button v-permission="'goodsManage_recyclebin_export'" plain class="ml-15" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
            </div>
        </div>

        <BmTable
            ref="multipleTable"
            :data="tableData"
            row-key="id"
            :tree-props="{ children: 'skus' }"
            v-loading="tableLoading"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
            :column="tableColumn"
            style="width: 100%"
        >
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('goodsListTable.status')" align="center">
                <template #default="scope">
                    <div class="cells">
                        <div>
                            {{ scope.row.deliveryType === 1 ? "FBM" : scope.row.deliveryType === 2 ? "FBT" : "" }} <span v-if="scope.row.skuCount">({{ scope.row.skuCount }})</span>
                        </div>
                        <div>{{ scope.row.isDraft === 1 ? $t("recycleBin.draft") : "" }}</div>
                        <div>{{ scope.row.isLaunch === 1 && scope.row.isLaunch !== "" ? $t("recycleBin.onSale") : $t("recycleBin.notSale") }}</div>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="goodsInfo" :label="$t('goodsListTable.goodsInfo')" min-width="300" header-align="center">
                <template #default="scope">
                    <div class="flex">
                        <div>
                            <BmImage class="tabelimg" v-if="scope.row.mainPictureUrl" :src="scope.row.mainPictureUrl" :preview-src-list="[scope.row.mainPictureUrl]" />
                            <BmImage v-if="scope.row.picture" class="tabelimg" :src="scope.row.picture" :preview-src-list="scope.row.picture" />
                        </div>
                        <div class="ml-10">
                            <div class="green">{{ scope.row.goodTitle }}</div>
                            <div>TSIN: {{ scope.row.tsin }}</div>
                            <!-- <div>卖家编码: {{ scope.row.shopCode }}</div> -->
                            <div v-if="scope.row.fnsku">FNSKU: {{ scope.row.fnsku }}</div>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="price" :label="$t('goodsListTable.price')" align="center">
                <template #default="scope">
                    <div style="margin: auto">
                        <div v-if="scope.row.minPrice">{{ scope.row.minPrice }} ~ {{ scope.row.maxPrice }}</div>
                        <div>{{ scope.row.price }}</div>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="stockNum" :label="$t('goodsListTable.stockNum')" align="center">
                <template #default="scope">
                    <div style="margin: auto">
                        <div>{{ scope.row.stock }}</div>
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="goodRecommended" :label="$t('goodsListTable.goodRecommended')" width="145" align="center">
                <template #default="scope">
                    <div v-if="scope.row.fnsku">{{ scope.row.type == 1 ? $t("recycleBin.NewProducts") : scope.row.type == 2 ? $t("recycleBin.recommendation") : "" }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="estimatedCost" :label="$t('goodsListTable.estimatedCost')" width="145" align="center">
                <template #default="scope">
                    <div v-if="scope.row.estimatedCost">{{ scope.row.estimatedCost }}</div>
                    <div v-else>一</div>
                </template>
            </BmTableColumn>
            <BmTableColumn :prop="timeTypeList[columnTimeIndex].field" width="145" align="center">
                <template #header>
                    <el-dropdown @command="handleCommandColumnTime">
                        <span>
                            {{ timeTypeList[columnTimeIndex].name }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="item in timeTypeList" :key="item.field" :command="item">{{ item.name }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </BmTableColumn>
            <BmTableColumn :prop="salesTypeList[columnSalesIndex].field" width="145" align="center">
                <template #header>
                    <el-dropdown @command="handleCommandcolumnSales">
                        <span>
                            {{ salesTypeList[columnSalesIndex].name }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="item in salesTypeList" :key="item.field" :command="item">{{ item.name }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="100" header-align="center" align="center" fixed="right">
                <template #default="scope">
                    <div v-if="!scope.row.fnsku">
                        <el-button v-permission="'goodsManage_recyclebin_replay'" @click="batchReply(scope.row)" type="text">
                            {{ $t("recycleBin.recover") }}
                        </el-button>
                    </div>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject, toRaw } from "vue";
import { useStore } from "vuex";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { getsCategoryListTree, brandMallList, findByParentId, getGoodsSellerList, deleteGoodsSellerBatchRestore, goodsSellerRecycleList, goodsSellerRecycleExport } from "@/api/goods";
import { exportExcel } from "@/utils/";
export default {
    name: "recycleBin",
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        let price = ref("");

        let typeName = ref(proxy.$t("recycleBin.isCharge")); // "是否带电"

        const handleCommand = (item) => {
            typeName.value = item.name;
        };

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        const multipleTable = ref(null);
        let tableLoading = ref(true);
        let tableData = ref([]);

        //是否带电
        const typeList = computed(() => [
            {
                name: proxy.$t("goodsListTable.isCharge"), //是否带电
                value: 0
            },
            {
                name: proxy.$t("goodsListTable.isHazardousArticle"), //是否危险品
                value: 1
            },
            {
                name: proxy.$t("goodsListTable.isContainsPowder"), //是否含有粉末
                value: 2
            },
            {
                name: proxy.$t("goodsListTable.isFluid"), //是否液体
                value: 3
            }
        ]);

        //创建时间
        const timeTypeList = computed(() => [
            {
                name: proxy.$t("goodsListTable.createTime"), //创建时间
                value: 0,
                field: "createTime"
            },
            {
                name: proxy.$t("goodsListTable.updateTime"), //最近更新时修改时间
                value: 1,
                field: "updateTime"
            },
            {
                name: proxy.$t("goodsListTable.submitExamineTime"), //提审时间
                value: 2,
                field: "submitExamineTime"
            },
            // {
            //     name: proxy.$t("goodsListTable.firstExamineTime"), //审核时间
            //     value: 3,
            //     field: "firstExamineTime"
            // },
            {
                name: proxy.$t("goodsListTable.launchTime"), //最新/最好后上架时间
                value: 4,
                field: "launchTime"
            },
            {
                name: proxy.$t("goodsListTable.shelfTime"), //最新下架时间
                value: 5,
                field: "shelfTime"
            },
            {
                name: proxy.$t("goodsListTable.examineTime"), //最新/最后修改审核时间
                value: 6,
                field: "examineTime"
            }
        ]);

        //是否预售
        const presellList = computed(() => [
            {
                name: proxy.$t("orderQuery.all"),
                value: ""
            },
            {
                name: proxy.$t("goodsList.presell"), //预售
                value: 1
            },
            {
                name: proxy.$t("goodsList.notPresell"), //非预售
                value: 0
            }
        ]);

        // 商品类型
        const goodsTypellList = reactive([
            {
                name: proxy.$t("goodsListTable.all"),
                value: ""
            },
            {
                name: proxy.$t("goodsListTable.commonGoods"), // 普通商品
                value: 1
            },
            {
                name: proxy.$t("goodsListTable.virtualGoods"),
                value: 2
            }
        ]);

        //状态
        const statusList = computed(() => [
            {
                name: proxy.$t("orderQuery.all"),
                value: ""
            },
            {
                name: proxy.$t("goodsList.Understock"), //库存不足
                value: 1
            },
            {
                name: proxy.$t("goodsList.storeShelves"), //店铺下架
                value: 2
            },
            {
                name: proxy.$t("goodsList.platformScreen"), //平台屏蔽
                value: 3
            },
            {
                name: proxy.$t("goodsList.brandUpdated"), //品牌待更新
                value: 4
            },
            {
                name: proxy.$t("goodsList.draft"), //草稿
                value: 5
            },
            {
                name: proxy.$t("goodsList.modifyAudit"), //修改待审核
                value: 6
            }
        ]);

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

        // 产地国家
        let countryList = ref([]);

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            _categoryId: [],
            categoryId: "",
            brandId: "", // 品牌id
            carriedIndex: 0, //0是否带电1是否危险品2是否含有粉末3是否液体
            carriedOk: "", //0表示否 1表示是
            countryId: "", //产国Id
            deleted: "", //是否删除 0默认没有删除 1表示已删除
            deliveryType: "", //配送类型( 1 FBM 2 FBT )
            timeType: 0, //时间类型0创建时间 1最近修改时间 2提审时间 3审核时间 4最新上架时间 5最新下架时间 6最新修改审核时间
            _tmpTimeValue: [], //临时时间值
            beginTime: "", //
            endTime: "", //
            //goodRecommended: "", //商品推荐（1 精品推荐 2新品推荐 3畅销推荐） //暂无
            goodsType: "", //商品类型（1 普通商品 2虚拟商品）
            isOpenPresell: "", //是否支持预售 0表示不支持 1表示支持
            keyword: "", //spu商品信息(Title、TSIN、搜索关键字keyword)
            shopCategoryId: "", //店铺分类ID
            shopId: "", //店铺ID
            shopCode: "", //店铺编码
            keyword: "", //sku商品信息(tsin、fnsku、UPC、商品编码sku_code、)
            status: "", //状态
            saleStatus: "", // 售卖状态
            pageNum: pageNum,
            pageSize: pageSize,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        //搜索
        const handelSearch = () => {
            searchForm.categoryId = searchForm._categoryId[2] ? searchForm._categoryId[2] : searchForm._categoryId[1] ? searchForm._categoryId[1] : searchForm._categoryId[0];
            searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[0]);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[1]);
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            console.log("searchForm", searchForm);
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        //表格选项的列 //国际码(UPC),卖家信息
        const tableColumn = [
            "status",
            "goodsInfo",
            "price",
            "stockNum",
            "brandName",
            "categoryName",
            "countryName",
            "isCharge",
            "isHazardousArticle",
            "isContainsPowder",
            "isFluid",
            "shopName",
            "sellerInfo",
            "createTime",
            "internationalCode",
            "firstExamineTime",
            "submitExamineTime",
            "updateTime",
            "launchTime",
            "shelfTime",
            "examineTime",
            "last30SaleCount",
            "saleCount",
            "last30CommentCount",
            "commentCount",
            "estimatedCost",
            "goodRecommended"
        ];

        //获取列表
        const getListPage = () => {
            tableLoading.value = true;
            console.log("goodsMallList");
            goodsSellerRecycleList(searchForm)
                .then((res) => {
                    console.log("goodsMallList", res);
                    pageTotal.value = res.data.total;
                    tableData.value = res.data.records.map((v) => {
                        v.last30SaleCount = v.totalLast30SaleCount; // 近30日销量
                        v.last30CommentCount = v.totalLast30CommentCount; // 近30日评论
                        return v;
                    });
                    tableLoading.value = false;
                })
                .catch((err) => {
                    tableLoading.value = false;
                });
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

        // 获取地区产地
        const getFindByParentId = () => {
            findByParentId({ parentId: 0 }).then((res) => {
                console.log(res);
                countryList.value = res.data;
            });
        };
        getFindByParentId();

        //初始化
        const initData = () => {
            getListPage();
            console.log("initData");
        };
        initData();

        //表格时间切换
        let columnTimeIndex = ref(0);
        const handleCommandColumnTime = (item) => {
            columnTimeIndex.value = item.value;
        };

        //表格销量切换
        const salesTypeList = computed(() => [
            // {
            //     name: proxy.$t("goodsListTable.last30SaleCount"), //近30日销量
            //     value: 0,
            //     field: "last30SaleCount"
            // },
            {
                name: proxy.$t("goodsListTable.saleCount"), //累计销量
                value: 0,
                field: "saleCount"
            },
            // {
            //     name: proxy.$t("goodsListTable.last30CommentCount"), //近30日评价
            //     value: 2,
            //     field: "last30CommentCount"
            // },
            {
                name: proxy.$t("goodsListTable.commentCount"), //收藏数
                value: 1,
                field: "commentCount"
            }
        ]);
        let columnSalesIndex = ref(0);
        const handleCommandcolumnSales = (item) => {
            columnSalesIndex.value = item.value;
        };

        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
            console.log(rows);
        };

        //点击单行-选择
        const handleRowClick = (row) => {
            const index = tableSelectionRows.findIndex((item) => item.id === row.id);
            if (index > -1) {
                tableSelectionRows.push(row);
            } else {
                tableSelectionRows.splice(index, 1);
            }
            multipleTable.value.toggleRowSelection(row);
        };

        // 快捷筛选
        const shortcut = (val) => {
            searchForm.status = val;
            initData();
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

        let innerVisible = ref(false);

        const batchReply = (row) => {
            console.log("333333", row);
            let ids = [];
            if (row.id) {
                ids = row.id;
            } else if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            } else {
                ids = tableSelectionRows.map((item) => item.id);
            }
            const loading = proxy.$loading();
            deleteGoodsSellerBatchRestore(ids)
                .then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        proxy.$message.success(res.msg);
                        initData();
                    }
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            goodsSellerRecycleExport(searchForm)
                .then((res) => {
                    exportExcel("Commodity recycling bin", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        return {
            dict,
            initData,
            pageNum,
            pageSize,
            pageTotal,
            typeList,
            timeTypeList,
            presellList,
            statusList,
            shortcuts,
            disabledDate,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            categoryList,
            brandList,
            tableData,
            tableColumn,
            handleSizeChange,
            handleCurrentChange,
            handleCommandColumnTime,
            handleSelectionChange,
            shortcut,
            handleCommandcolumnSales,
            multipleTable,
            countryList,
            goodsTypellList,
            handleCommand,
            handleRowClick,
            tableLoading,
            columnTimeIndex,
            salesTypeList,
            columnSalesIndex,
            batchReply,
            innerVisible,
            handleExportExcel,
            goodsMultiList
        };
    }
};
</script>

<style lang="scss" scoped>
.cells {
    position: relative;
    float: right;
}
/deep/.el-icon-arrow-right:before {
    font-weight: 900;
    font-size: 14px;
}
.tabelimg {
    width: 59px;
    height: 59px;
    border-radius: 2px;
}
/deep/ .avatar-uploader .el-upload {
    border: 1px dashed #42b7ae;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #42b7ae;
    width: 142px;
    height: 80px;
    line-height: 80px;
    text-align: center;
}
.avatar {
    width: 142px;
    height: 80px;
    display: block;
}
</style>
