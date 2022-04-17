<template>
    <template v-if="!editVisible">
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
                    <!-- 商品信息 -->
                    <!-- <el-col :md="12" :lg="6">
                        
                        <el-form-item :label="$t('goodsListTable.goodsInfo')" prop="keyword">
                            <el-input v-model="searchForm.keyword" :placeholder="$t('goodsList.keyword')"></el-input>
                        </el-form-item>
                    </el-col> -->

                    <el-col :md="12" :lg="6">
                        <!-- 商品标题 -->
                        <el-form-item :label="$t('goodsList.keyword')" prop="titleKeyword">
                            <el-input v-model="searchForm.titleKeyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
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
                </el-row>

                <div id="elCollapse" class="h-0 hidden">
                    <el-row :gutter="24">
                        <!-- SKU商品信息 -->
                        <!-- <el-col :md="12" :lg="6">
                            
                            <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skuKeyword">
                                <el-input v-model="searchForm.skuKeyword" oninput="value=value.replace(/\s+/g,'')" placeholder="tsin / fnsku / UPC / sku_code"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :md="12" :lg="6">
                            <!-- 编辑类型 -->
                            <el-form-item :label="$t('goodsListCheck.editType')" prop="status">
                                <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                                    <el-option v-for="(item, index) in editType" :key="index" :label="item.name" :value="item.value"> </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :md="12" :lg="6">
                            <!-- SKU商品信息 -->
                            <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skeyword">
                                <template #label>
                                    <el-select v-model="searchForm.sIndex" :placeholder="$t('pleaseSelect')">
                                        <el-option v-for="(item, index) in goodsMultiList" :key="index" :label="item.name" :value="item.value"> </el-option>
                                    </el-select>
                                </template>
                                <el-input v-model="searchForm.skeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" placeholder="tsin / fnsku / UPC / sku_code"></el-input>
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
                    <el-radio-group v-model="searchForm.deliveryType" @change="handleChangeType" class="mr-15">
                        <el-radio label="">{{ $t("status.all") }}</el-radio>
                        <el-radio label="1">FBM</el-radio>
                        <el-radio label="2">FBT </el-radio>
                    </el-radio-group>
                    <!-- 删除 -->
                    <el-button @click="newGoods" type="primary" icon="el-icon-plus">{{ $t("drafts.newsGoods") }}</el-button>
                    <el-button v-permission="'goodsManage_darft_deleteBatches'" @click="batchDeleteDraft" plain>{{ $t("drafts.deleteBatches") }}</el-button>
                    <!-- 批量改价 -->
                    <el-button plain @click="changePriceVisible" class="ml-10">{{ $t("status.batchChangePrice") }}</el-button>
                    <!-- 批量提交审核 -->
                    <el-button plain @click="batchCancelAudit" class="ml-10">{{ $t("warehouse.submitAudit") }}</el-button>
                </div>
                <div class="flex vcenter">
                    <!-- 表格选项 -->
                    <BmTableOption table="goodsListTable" :column="tableColumn" />
                    <el-button v-permission="'goodsManage_darft_export'" plain class="ml-15" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
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
                                {{ scope.row.deliveryType === 1 ? "FBM" : scope.row.deliveryType === 2 ? "FBT" : "" }}
                                <span v-if="scope.row.skuCount">({{ scope.row.skuCount }})</span>
                            </div>
                            <!-- <div>{{ scope.row.isDraft === 1 ? $t("recycleBin.draft") : "" }}</div>
                        <div>
                            {{ scope.row.isLaunch === 1 && scope.row.isLaunch !== "" ? $t("recycleBin.onSale") : $t("recycleBin.notSale") }}
                        </div> -->
                        </div>
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="goodsInfo" :label="$t('goodsListTable.goodsInfo')" min-width="300">
                    <template #default="scope">
                        <div class="flex">
                            <div>
                                <BmImage class="tabelimg" v-if="scope.row.mainPictureUrl" :src="scope.row.mainPictureUrl" :preview-src-list="[scope.row.mainPictureUrl]" />
                                <BmImage v-if="scope.row.picture" class="tabelimg" :src="scope.row.picture" :preview-src-list="[scope.row.picture]" />
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
                            <!-- <div>{{ scope.row.stockNum }}</div> -->
                        </div>
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="brandName" :label="$t('goodsListTable.brandName')" width="145" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.brandName">{{ scope.row.brandName }}</div>
                        <div v-else>一</div>
                    </template>
                </BmTableColumn>
                <!-- <BmTableColumn prop="shopName" :label="$t('goodsListTable.sellerInfo')" align="center">
                    <template #default="scope">
                        <div style="margin: auto">
                            <div v-if="scope.row.shopName">{{ scope.row.shopName }}<br /></div>
                            <div v-else>一</div>
                        </div>
                    </template>
                </BmTableColumn> -->
                <BmTableColumn prop="editStatus" :label="$t('drafts.editStatus')" align="center">
                    <template #default="scope">
                        {{ scope.row.editStatus == 1 ? $t("drafts.add") : scope.row.editStatus == 2 ? $t("drafts.edit") : "" }}
                    </template>
                </BmTableColumn>
                <BmTableColumn prop="internationalCode" :label="$t('goodsListTable.internationalCode')" align="center">
                    <template #default="scope">
                        {{ scope.row.internationalCode }}
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
                <!-- <BmTableColumn :prop="salesTypeList[columnSalesIndex].field" width="145" align="center">
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
            </BmTableColumn> -->
                <BmTableColumn :label="$t('table.operation')" width="120" fixed="right" header-align="center" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.skus">
                            <el-button v-permission="'goodsManage_darft_edit'" @click.stop="handleEdit(scope.row)" type="text">
                                {{ $t("table.edit") }}
                            </el-button>

                            <el-button v-permission="'goodsManage_darft_detail'" @click.stop="handleDetail(scope.row)" type="text">
                                {{ $t("table.detail") }}
                            </el-button>
                        </div>
                        <div>
                            <el-button type="text" @click.stop="handlePrintBarcode(scope.row)">{{ $t("goodsList.printBarcode") }}</el-button>
                        </div>
                    </template>
                </BmTableColumn>
            </BmTable>

            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
        </div>
    </template>

    <!-- 批量改价 -->
    <el-dialog :title="$t('table.batchChangePrice')" v-model="priceVisible" width="30%">
        <div class="flex vcenter">
            <span style="width: 50px">{{ $t("table.price") }}:</span><el-input v-model="price" placeholder="" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="priceVisible = false">{{ $t("cancel") }}</el-button>
                <el-button type="primary" @click="batchChangePrice">{{ $t("confirm") }}</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 批量提交审核 -->
    <el-dialog :title="$t('warehouse.submitAudit')" v-model="batchCancelAuditVisible" width="30%">
        <div class="flex center">{{ $t("warehouse.submitAudit") }}</div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="batchCancelAuditVisible = false">{{ $t("cancel") }}</el-button>
                <el-button type="primary" @click="subBatchCancelAudit">{{ $t("confirm") }}</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 编辑-->
    <GoodsInfoDetailEdit v-if="editVisible" v-model:visible="editVisible" :row="editRow" @reloadData="initData" />

    <!-- 详情&详情对比-->
    <GoodsInfoDetail v-if="detailChangeVisible" v-model:visible="detailChangeVisible" :row="detailRow" />
    <!-- 打印条码弹窗 -->
    <PrintBarcode v-if="printVisible" v-model:visible="printVisible" :row="printData"></PrintBarcode>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject, toRaw } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { dateShortcuts } from "@/utils/dateShortcuts";
import PrintBarcode from "./component/printBarcode";
import {
    getsCategoryListTree,
    brandMallList,
    findByParentId,
    goodsSellerDraftList,
    goodsSellerBatchDelete,
    goodsSellerDraftExport,
    goodsSellerBatchChangePrice,
    goodsSellerBatchAuditSub
} from "@/api/goods";
import GoodsInfoDetailEdit from "./goodsInfoDetailEdit";
import GoodsInfoDetail from "./goodsInfoDetail";
import { exportExcel } from "@/utils/";
export default {
    name: "recycleBin",
    components: { GoodsInfoDetail, GoodsInfoDetailEdit, PrintBarcode },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const router = useRouter();
        const dict = inject("dict"); //数据字典

        let price = ref("");

        let typeName = ref("是否带电");

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

        // 编辑类型
        let editType = computed(() => [
            {
                name: proxy.$t("goodsListCheck.editStatus"), // 修改
                value: 1
            },
            {
                name: proxy.$t("goodsListCheck.addStatus"), // 新增
                value: 2
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
            {
                name: proxy.$t("goodsListTable.firstExamineTime"), //审核时间
                value: 3,
                field: "firstExamineTime"
            },
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
            "editStatus"
        ];

        //获取列表
        const getListPage = () => {
            tableLoading.value = true;
            goodsSellerDraftList(searchForm)
                .then((res) => {
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

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            goodsSellerDraftExport(searchForm)
                .then((res) => {
                    exportExcel("Draft box", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
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
            {
                name: proxy.$t("goodsListTable.last30SaleCount"), //近30日销量
                value: 0,
                field: "last30SaleCount"
            },
            {
                name: proxy.$t("goodsListTable.saleCount"), //累计销量
                value: 1,
                field: "saleCount"
            },
            {
                name: proxy.$t("goodsListTable.last30CommentCount"), //近30日评价
                value: 2,
                field: "last30CommentCount"
            },
            {
                name: proxy.$t("goodsListTable.commentCount"), //收藏数
                value: 3,
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

        let innerVisible = ref("");

        // 删除草稿
        const batchDeleteDraft = () => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }

            let ids = tableSelectionRows.map((item) => item.id);
            const loading = proxy.$loading();
            goodsSellerBatchDelete(ids)
                .then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        proxy.$message.success(res.msg);
                        initData();
                        loading.close();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                });
        };

        const newGoods = () => {
            router.push({ path: "/goodsManage/publishGoods" });
        };

        //编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleEdit = (row) => {
            editRow.value = {
                goodId: row.id,
                categoryId: row.categoryId,
                isDraft: 1,
                deliveryType: row.deliveryType
            };
            editVisible.value = true;
        };

        //查看详情
        let detailRow = ref({});
        let detailChangeVisible = ref(false);
        const handleDetail = (row) => {
            detailRow.value = {
                goodsId: row.id,
                categoryId: row.categoryId,
                examineStatus: row.examineStatus,
                isChange: row.examineStatus === 1 && row.editStatus === 2 ? true : false //examineStatus审核状态（1待审核 2已通过 3未通过）  editStatus=1新提交 2已变更过
            };
            detailChangeVisible.value = true;
        };

        // 物流筛选
        const handleChangeType = (val) => {
            searchForm.deliveryType = val;
            initData();
        };

        // 改价
        let priceVisible = ref(false);
        const changePriceVisible = (val) => {
            // 审核商品
            for (let index = 0; index < tableSelectionRows.length; index++) {
                if (!tableSelectionRows[index].fnsku) {
                    proxy.$message.error(proxy.$t("status.onlySkuedit")); // 只能对SKU商品进行改价
                    return;
                }
                if (tableSelectionRows[index].examineStatus == 1) {
                    proxy.$message.error(proxy.$t("status.onlySkuedit")); // 只能对 不是 待审核 状态的SKU商品进行改价
                    return;
                }
            }

            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }

            priceVisible.value = true;
        };

        // 批量改价
        const batchChangePrice = () => {
            let ids = tableSelectionRows.map((item) => item.id);

            if (price) {
                const loading = proxy.$loading();
                goodsSellerBatchChangePrice(ids, price.value)
                    .then((res) => {
                        if (res.code === 0) {
                            proxy.$message.success(res.msg);
                            priceVisible.value = false;
                            initData();
                            loading.close();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        loading.close();
                    });
            } else {
                proxy.$message.error(proxy.$t("pleaseEnter"));
                return;
            }
        };

        // 审核列表 批量撤销审核
        let batchCancelAuditVisible = ref(false);
        const batchCancelAudit = () => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            for (let index = 0; index < tableSelectionRows.length; index++) {
                if (tableSelectionRows[index].fnsku) {
                    proxy.$message.error(proxy.$t("status.onlySPUSubAudit")); // 只能对SPU商品进行撤销审核
                    return;
                }
                //1待审核"  "2已通过 $t("status.auditPass")" "3未通过"  4 撤销审核
                if (tableSelectionRows[index].examineStatus == 1) {
                    proxy.$message.error(proxy.$t("status.onlyBatchSubAudit")); // 只能对 不是 待审核 状态的SPU商品进行撤销审核
                    return;
                }
            }

            batchCancelAuditVisible.value = true;
        };

        const subBatchCancelAudit = () => {
            let ids = tableSelectionRows.map((item) => item.id);
            const loading = proxy.$loading();
            goodsSellerBatchAuditSub(ids)
                .then((res) => {
                    proxy.$message.success(res.msg);
                    batchCancelAuditVisible.value = false;
                    initData();
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
        };
        // 条码打印弹窗显示关闭控制变量
        let printVisible = ref(false);
        // 条码打印所需数据对象
        let printData = ref({});
        // 条码打印
        const handlePrintBarcode = (row) => {
            printVisible.value = true;
            // 判断点击的是主商品还是下面的不同sku
            if (row.goodCode) {
                // 主商品
                printData.value = {
                    goodCode: row.goodCode, // 商品编码
                    tsin: row.tsin // TSIN
                };
            } else {
                // SKU
                printData.value = {
                    fnsku: row.fnsku, // FNSKU
                    tsin: row.tsin // TSIN
                };
            }
        };
        return {
            dict,
            initData,
            pageNum,
            pageSize,
            pageTotal,
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
            batchDeleteDraft,
            innerVisible,
            newGoods,
            editType,
            handleExportExcel,
            editVisible,
            handleEdit,
            editRow,
            detailRow,
            detailChangeVisible,
            handleDetail,
            handleChangeType,
            goodsMultiList,
            batchChangePrice,
            price,
            changePriceVisible,
            priceVisible,
            subBatchCancelAudit,
            batchCancelAudit,
            batchCancelAuditVisible,
            handlePrintBarcode,
            printVisible,
            printData
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
    border-radius: 3px;
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
