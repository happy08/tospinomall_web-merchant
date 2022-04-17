<template>
    <div v-if="!editVisible" class="content-wrap top-search-form mb-25 p-25 bg-white round-4 mb-25">
        <div class="flex between">
            <div>
                <BmBreadcrumb />
            </div>
            <div class="flex cp">
                <div @click="goDrafts">
                    <span><i class="el-icon-document-remove"></i></span><span class="ml-15">{{ $t("goodsList.drafts") }}({{ sellStatisticalList.total_draft }})</span>
                </div>
                <div @click="goRecycleBin" class="ml-15">
                    <span><i class="el-icon-delete"></i></span><span class="ml-15">{{ $t("goodsList.recycleBin") }}({{ sellStatisticalList.total_deleted }})</span>
                </div>
            </div>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="custom-tabs-green">
            <el-tab-pane :label="$t('goods.releasedMerchandise')" name="pane1">
                <div class="p-20">
                    <div class="flex p-20 mb-20 border tc">
                        <div class="flex1">
                            <div>{{ $t("goods.sold") }}</div>
                            <div>
                                {{ sellStatisticalList.total_not_stock }}
                            </div>
                        </div>
                        <div class="flex1 border-left">
                            <div>FBM{{ $t("goods.someStockHasBeenTakenOffTheShelves") }}</div>
                            <div>
                                {{ sellStatisticalList.FBM_total_shelf_has_stock }}
                            </div>
                        </div>
                        <div class="flex1 border-left">
                            <div>FBT{{ $t("goods.someStockHasBeenTakenOffTheShelves") }}</div>
                            <div>
                                {{ sellStatisticalList.FBT_total_shelf_has_stock }}
                            </div>
                        </div>
                        <div class="flex1 border-left">
                            <div>
                                {{ $t("goods.platformIllegalRemovalOfGoods") }}
                            </div>
                            <div>
                                {{ sellStatisticalList.total_shielding }}
                            </div>
                        </div>
                        <!-- <div class="flex column vcenter">
                        <div>平台违规下架商品</div>
                        <div>1</div>
                        </div> -->
                    </div>
                    <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
                        <el-row :gutter="24">
                            <el-col :md="12" :lg="6">
                                <!-- 商品类目 -->
                                <el-form-item :label="$t('goods.category')" prop="_categoryId">
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
                            <!-- 商品信息 -->
                            <!-- <el-col :md="12" :lg="6">
                                <el-form-item :label="$t('goodsListTable.goodsInfo')" prop="keyword">
                                    <el-input v-model="searchForm.keyword" :placeholder="$t('goodsList.keyword')"></el-input>
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
                        </el-row>

                        <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
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
                                        type="datetimerange"
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

                <div class="bg-light-grey mb-20 p-10"></div>

                <div class="plr-20 pb-20">
                    <div class="flex between mb-10">
                        <div>
                            <el-radio-group v-model="searchForm.saleStatus" @change="handleChangeStatus" class="fl mr-10 mb-10">
                                <!-- 全部 -->
                                <el-radio-button label="">{{ $t("all") }}</el-radio-button>
                                <!-- 在售中 -->
                                <el-radio-button label="1">{{ $t("status.onSale") }}({{ statisticalTotal.total_selling }})</el-radio-button>
                                <!-- 不可售 -->
                                <el-radio-button label="0">{{ $t("status.notSale") }}({{ statisticalTotal.total_not_selling }})</el-radio-button>
                            </el-radio-group>
                            <el-radio-group v-model="searchForm.deliveryType" @change="handleChangeType" class="fl mr-10 mt-10" style="height: 30px">
                                <el-radio label="">{{ $t("status.all") }}</el-radio>
                                <el-radio label="1">
                                    FBM
                                    <span class="ml-5">
                                        <el-popover placement="right" :width="300" trigger="hover">
                                            <template #reference>
                                                <i class="el-icon-question" style="font-size: 15px"></i>
                                            </template>
                                            {{ $t("status.FBMTips") }}
                                        </el-popover>
                                    </span>
                                </el-radio>
                                <el-radio label="2"
                                    >FBT
                                    <span class="ml-5">
                                        <el-popover placement="right" :width="300" trigger="hover">
                                            <template #reference>
                                                <i class="el-icon-question" style="font-size: 15px"></i>
                                            </template>
                                            {{ $t("status.FBTTips") }}
                                        </el-popover>
                                    </span>
                                </el-radio>
                            </el-radio-group>
                            <div class="fl mr-10">
                                <!-- 快速筛选 -->
                                <!-- 发布商品 -->
                                <el-button @click="goNewsGoods" class="mb-10" type="primary" plain icon="el-icon-plus">{{ $t("status.releaseNewProduct") }}</el-button>
                                <!-- 批量转换配送方式 -->
                                <!-- <el-button plain v-permission="'goodsManage_goodsList_batchConversion'" @click="outerVisibleDialog(1)" class="mb-10">{{ $t("status.batchConversion") }}</el-button> -->
                                <!-- 批量下架 -->
                                <el-button plain v-permission="'goodsManage_goodsList_batchUndercarriage'" @click="outerVisibleDialog(2)" class="mb-10">{{
                                    $t("status.batchUndercarriage")
                                }}</el-button>
                                <!-- 批量上架 -->
                                <el-button plain v-permission="'goodsManage_goodsList_BatchShelves'" @click="outerVisibleDialog(4)" class="mb-10">{{ $t("status.BatchShelves") }}</el-button>
                                <!-- 批量删除 -->
                                <el-button plain v-permission="'goodsManage_goodsList_batchDelete'" @click="outerVisibleDialog(3)" class="mb-10">{{ $t("status.batchDelete") }}</el-button>
                                <!-- 复制商品 -->
                                <el-button plain v-permission="'goodsManage_goodsList_batchcopyGoods'" @click="copyGoods" class="mb-10">{{ $t("status.copyGoods") }}</el-button>
                                <!-- 立即补货 -->
                                <el-button plain v-permission="'goodsManage_goodsList_immediateReplenishment'" @click="immediateReplenishment" class="mb-10">{{
                                    $t("status.immediateReplenishment")
                                }}</el-button>
                                <!-- 批量改价 1-->
                                <el-button plain v-permission="'goodsManage_goodsList_batchChangePrice'" @click="changePriceVisible(1)" class="mb-10">{{ $t("status.batchChangePrice") }}</el-button>
                            </div>
                        </div>
                        <div class="flex vstart">
                            <!-- 刷新数据 -->
                            <el-button @click="Refresh">{{ $t("goodsList.refresh") }}</el-button>
                            <!-- 表格选项 -->
                            <BmTableOption table="goodsListTable" :column="tableColumn" class="mlr-10" />
                            <el-button v-permission="'goodsManage_goodsList_export'" @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
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
                        <BmTableColumn prop="status" :label="$t('goodsListTable.status')" align="center" min-width="150">
                            <template #default="scope">
                                <div class="cells">
                                    <div>
                                        {{ scope.row.deliveryType == 1 ? "FBM" : scope.row.deliveryType == 2 ? "FBT" : "" }}
                                        <span v-if="scope.row.skuCount">({{ scope.row.skuCount }})</span>
                                    </div>

                                    <!-- <div v-if="scope.row.isDraft == 1">
                                        {{ scope.row.isDraft == 1 ? "是稿箱" : scope.row.isDraft == 0 ? "不是草稿箱" : "" }}
                                    </div> -->
                                    <!-- 在售中 -->
                                    <div v-if="!scope.row.fnsku && scope.row.total_selling">{{ $t("status.onSale") }}: ({{ scope.row.total_selling }})</div>
                                    <!-- 不可售 -->
                                    <div v-if="!scope.row.fnsku && scope.row.total_not_selling">{{ $t("status.notSale") }}: ({{ scope.row.total_not_selling }})</div>
                                    <div v-if="!scope.row.fnsku">
                                        <!-- 审核状态 -->
                                        <!-- {{ $t("goodsList.auditStatus") }}: -->
                                        <!--"待审核"  "已通过" "未通过"-->
                                        <!-- {{
                                            scope.row.examineStatus == 1
                                                ? $t("status.beAudit")
                                                : scope.row.examineStatus == 2
                                                ? $t("status.auditPass")
                                                : scope.row.examineStatus == 3
                                                ? $t("goodsList.notPass")
                                                : ""
                                        }} -->
                                    </div>
                                    <div v-if="scope.row.brandStatus == 4 || scope.row.brandStatus == 5">
                                        <!-- 品牌状态: scope.row.brandStatus == 1 ? "正常" : 4"品牌屏蔽" 5"品牌待更新"-->
                                        {{ scope.row.brandStatus == 4 ? $t("goodsList.brandShield") : scope.row.brandStatus == 5 ? $t("goodsList.brandBeUpdated") : "" }}
                                    </div>
                                    <div v-if="scope.row.isShield == 1 && scope.row.fnsku">
                                        <!-- 是否屏蔽: scope.row.isShield == 0 ? "否" :  "已屏蔽"-->
                                        {{ scope.row.isShield == 1 ? $t("goodsList.HasBeenBlocked") : "" }}
                                    </div>
                                    <div v-if="scope.row.isDown == 1 && scope.row.fnsku">
                                        <!-- 上架状态: "已下架"-->
                                        {{ scope.row.isDown == 1 ? $t("goodsList.removeSthShelves") : "" }}
                                    </div>
                                    <!--库存不足 {{  scope.row.fnsku + "sku " }}{{scope.row.deliveryType}}{{"===" + scope.row.fbtStockNum + "库存 "}} {{ fbmStockNum + "库存fbm"}} -->
                                    <div v-if="scope.row.fnsku && scope.row.stock <= 0">{{ $t("goodsList.Understock") }}</div>
                                    <!-- <div v-if="scope.row.fnsku && scope.row.deliveryType == 1 && scope.row.stock <= 0">FBM库存不足</div> -->
                                </div>
                            </template>
                        </BmTableColumn>
                        <BmTableColumn prop="goodsInfo" :label="$t('goodsListTable.goodsInfo')" min-width="300" header-align="center">
                            <template #default="scope">
                                <div class="flex">
                                    <div>
                                        <el-image class="tabelimg" v-if="scope.row.mainPictureUrl" :src="scope.row.mainPictureUrl" :preview-src-list="[scope.row.mainPictureUrl]" />
                                        <el-image class="tabelimg" v-if="scope.row.picture" :src="scope.row.picture" :preview-src-list="[scope.row.picture]" />
                                    </div>
                                    <div class="ml-10">
                                        <div v-if="scope.row.skuAttr">
                                            {{ scope.row.skuAttr.join(",") }}
                                        </div>
                                        <!-- @click="handleDetail(scope.row)" -->
                                        <div class="green font-flow">
                                            {{ scope.row.goodTitle }}
                                        </div>

                                        <div>TSIN: {{ scope.row.tsin }}</div>
                                        <!-- <div>
                                            卖家编码: {{ scope.row.shopCode }}
                                        </div> -->
                                        <div v-if="scope.row.fnsku">FNSKU: {{ scope.row.fnsku }}</div>
                                    </div>
                                </div>
                            </template>
                        </BmTableColumn>
                        <!-- 售价 -->
                        <BmTableColumn prop="price" :label="$store.state.app.currencySymbol + $t('goodsListTable.price')" align="center">
                            <template #default="scope">
                                <div style="margin: auto">
                                    <div v-if="scope.row.minPrice">
                                        {{ scope.row.minPrice }} ~
                                        {{ scope.row.maxPrice }}
                                    </div>
                                    <div>{{ scope.row.price }}</div>
                                </div>
                            </template>
                        </BmTableColumn>
                        <!-- 库存 -->
                        <BmTableColumn prop="stockNum" :label="$t('goodsListTable.stockNum')" align="center" min-width="100px">
                            <template #default="scope">
                                <el-popover placement="right" title="" :width="200" trigger="hover">
                                    <template #reference>
                                        <div v-if="!scope.row.fnsku">
                                            <div>
                                                <!-- FBM库存 FBT库存-->
                                                {{ $t("status.fbmStock") }}:
                                                {{ scope.row.fbmStockNum }}
                                            </div>
                                            <div>{{ $t("status.fbtStock") }}:{{ scope.row.fbtStockNum }}</div>
                                        </div>
                                        <div v-else>
                                            <div>
                                                {{ $t("status.fbmStock") }}:
                                                {{ scope.row.stockNum }}
                                            </div>
                                            <div>{{ $t("status.fbtStock") }}:{{ scope.row.fbtStockNum }}</div>
                                        </div>
                                    </template>
                                    <div v-if="!scope.row.fnsku">
                                        <div class="mb-15">
                                            <!--FBM可售库存  -->
                                            {{ $t("status.maysellfbmStock") }}:
                                            {{ scope.row.fbmStockNum }}
                                        </div>
                                        <!-- <div class="mb-15" v-if="scope.row.deliveryType == 2">
                                            FBT可售库存:
                                            {{ scope.row.fbtStockNum }}
                                        </div> -->
                                        <!-- FBT库存 -->
                                        <div class="mb-5">{{ $t("status.fbtStock") }}: {{ scope.row.fbtStockNum }}</div>
                                        <div class="mb-5">
                                            <!--总入库数量  -->
                                            {{ $t("status.totalSupplyNum") }}:
                                            {{ scope.row.totalSupplyNum }}
                                        </div>
                                        <div class="mb-5">
                                            <!-- 已出售数量 -->
                                            {{ $t("status.fbtSaleCount") }}:
                                            {{ scope.row.fbtSaleCount }}
                                        </div>
                                        <div class="mb-5">
                                            <!-- 仓库(可售)正品数量 -->
                                            {{ $t("status.fbtStockNum") }}:
                                            {{ scope.row.fbtStockNum }}
                                        </div>
                                        <div class="mb-5">
                                            <!-- 仓库(不可售)次品数量 -->
                                            {{ $t("status.totalStockBadNum") }}:
                                            {{ scope.row.totalStockBadNum }}
                                        </div>
                                        <div>
                                            <!-- 发/补货在途数量 -->
                                            {{ $t("status.totalStockWayNum") }}:
                                            {{ scope.row.totalStockWayNum }}
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="mb-5">
                                            <!-- fbt锁库存数量 -->
                                            FBT {{ $t("goodsListTable.lockStock") }}:
                                            {{ scope.row.fbtLockStock }}
                                        </div>
                                        <div class="mb-5">
                                            <!-- fbt仓库库存 -->
                                            FBT {{ $t("goodsListTable.storehouseStock") }}:
                                            {{ scope.row.fbtWareNum }}
                                        </div>
                                        <div class="mb-5">
                                            <!-- fbt可售库存 -->
                                            FBT {{ $t("goodsListTable.saleStock") }}:
                                            {{ scope.row.fbtStockNum }}
                                        </div>
                                        <div class="mb-5">
                                            <!-- fbm锁库存数量 -->
                                            FBM {{ $t("goodsListTable.lockStock") }}:
                                            {{ scope.row.lockStock }}
                                        </div>
                                        <div class="mb-5">
                                            <!-- fbm可售库存 -->
                                            FBM {{ $t("goodsListTable.saleStock") }}:
                                            {{ scope.row.stockNum }}
                                        </div>
                                    </div>
                                </el-popover>
                            </template>
                        </BmTableColumn>
                        <!-- 每件售出预计费用 -->
                        <BmTableColumn prop="estimatedCost" :label="$t('goodsListTable.estimatedCost')" align="center" min-width="150px">
                            <template #default="scope">
                                <div v-if="scope.row.estimatedCost">
                                    {{ scope.row.estimatedCost }}
                                </div>
                                <div v-else>一</div>
                            </template>
                        </BmTableColumn>
                        <!-- 关注数 -->
                        <BmTableColumn prop="commentCount" :label="$t('goodsListTable.commentCount')" align="center" min-width="100px">
                            <template #default="scope">
                                <div v-if="scope.row.commentCount">
                                    {{ scope.row.commentCount }}
                                </div>
                                <div v-else>一</div>
                            </template>
                        </BmTableColumn>
                        <!-- <BmTableColumn
                            prop="brandName"
                            :label="$t('goodsListTable.brandName')"
                            width="145"
                            align="center"
                        >
                            <template #default="scope">
                                <div v-if="scope.row.brandName">{{ scope.row.brandName }}</div>
                                <div v-else>一</div>
                            </template>
                        </BmTableColumn> -->
                        <!-- <BmTableColumn
                            prop="shopName"
                            :label="$t('goodsListTable.sellerInfo')"
                            align="center"
                        >
                            <template #default="scope">
                                <div style="margin: auto">
                                    <div v-if="scope.row.shopName">
                                        {{ scope.row.shopName }}<br />
                                    </div>
                                    <div v-else>一</div>
                                </div>
                            </template>
                        </BmTableColumn> -->
                        <!-- <BmTableColumn
                            prop="internationalCode"
                            :label="$t('goodsListTable.internationalCode')"
                            align="center"
                        >
                            <template #default="scope">
                                {{ scope.row.internationalCode }}
                            </template>
                        </BmTableColumn> -->
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
                        <!-- 累计销量 -->
                        <BmTableColumn prop="saleCount" :label="$t('goodsListTable.saleCount')"></BmTableColumn>
                        <!-- <BmTableColumn :prop="salesTypeList[columnSalesIndex].field" width="145" align="center">
                            <template #header>
                                <el-dropdown @command="handleCommandcolumnSales">
                                    <span>
                                        {{ salesTypeList[columnSalesIndex].name }}
                                        <i
                                            class="
                                                el-icon-arrow-down
                                                el-icon--right
                                            "
                                        ></i>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item v-for="item in salesTypeList" :key="item.field" :command="item">{{ item.name }}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </template>
                        </BmTableColumn> -->
                        <BmTableColumn :label="$t('table.operation')" width="145" header-align="center" align="center" fixed="right">
                            <template #default="scope">
                                <div v-if="scope.row.skus">
                                    <div>
                                        <!-- 审核 1待审 2通过 3驳回 -->
                                        <div v-if="scope.row.examineStatus !== 1" class="green cp">
                                            <el-button type="text" v-permission="'goodsManage_goodsList_edit'" @click.stop="handleEdit(scope.row)">{{ $t("table.edit") }}</el-button>
                                        </div>
                                        <div class="green cp">
                                            <el-button type="text" v-permission="'goodsManage_goodsList_detail'" @click.stop="handleDetail(scope.row)">{{ $t("table.detail") }}</el-button>
                                        </div>
                                    </div>
                                    <div>
                                        <!-- <div class="green">
                                            <el-button type="text" v-permission="'goodsManage_goodsList_printLabels'" @click="handleDetail(scope.row)">{{ $t("table.printLabels") }}</el-button>
                                        </div> -->
                                        <div class="green">
                                            <el-button type="text" v-permission="'goodsManage_goodsList_copyGoods'" @click.stop="copyGoods(scope.row)">{{ $t("table.copyGoods") }}</el-button>
                                        </div>
                                        <!-- <div class="green cp" @click="handleDetail(scope.row)">
                                            {{ $t("table.share") }}
                                        </div> -->
                                    </div>
                                </div>
                                <!-- 打印 -->
                                <el-button type="text" @click.stop="handlePrintBarcode(scope.row)">{{ $t("goodsList.printBarcode") }}</el-button>
                            </template>
                        </BmTableColumn>
                    </BmTable>

                    <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('goods.commodityAudit')" name="pane2">
                <div class="p-20">
                    <el-form :model="searchForm_2" ref="searchForm_2Ref" labelPosition="top" class="table-search-form">
                        <el-row :gutter="24">
                            <el-col :md="12" :lg="6">
                                <!-- 商品类目 -->
                                <el-form-item :label="$t('goods.category')" prop="_categoryId">
                                    <el-cascader
                                        v-model="searchForm_2._categoryId"
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
                            <el-col :md="12" :lg="6">
                                <!-- 商品标题 -->
                                <el-form-item :label="$t('goodsList.keyword')" prop="titleKeyword">
                                    <el-input v-model="searchForm_2.titleKeyword" :placeholder="$t('pleaseEnter')"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :md="12" :lg="6">
                                <!-- 时间 -->
                                <el-form-item prop="_tmpTimeValue">
                                    <template #label>
                                        <el-select v-model="searchForm_2.timeType" :placeholder="$t('pleaseSelect')">
                                            <el-option v-for="(item, index) in timeTypeList" :key="index" :label="item.name" :value="item.value"> </el-option>
                                        </el-select>
                                    </template>
                                    <el-date-picker
                                        v-model="searchForm_2._tmpTimeValue"
                                        type="datetimerange"
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
                                <!-- 品牌 -->
                                <el-form-item :label="$t('goodsListTable.brandName')" prop="brandId">
                                    <el-select v-model="searchForm_2.brandId" :placeholder="$t('pleaseSelect')" clearable filterable>
                                        <el-option v-for="(item, index) in brandList" :key="index" :label="item.brandName" :value="item.id"> </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row id="elCollapsePane2" class="h-0 hidden" :gutter="24">
                            <el-col :md="12" :lg="6">
                                <!-- 编辑类型 -->
                                <el-form-item :label="$t('goodsListCheck.editType')" prop="status">
                                    <el-select v-model="searchForm_2.status" :placeholder="$t('pleaseSelect')" clearable>
                                        <el-option v-for="(item, index) in editType" :key="index" :label="item.name" :value="item.value"> </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <!-- sku编码 搜索 -->
                            <el-col :md="12" :lg="6">
                                <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skeyword">
                                    <template #label>
                                        <el-select v-model="searchForm_2.sIndex" :placeholder="$t('pleaseSelect')">
                                            <el-option v-for="(item, index) in goodsMultiList" :key="index" :label="item.name" :value="item.value"> </el-option>
                                        </el-select>
                                    </template>
                                    <el-input v-model="searchForm_2.skeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" placeholder="tsin / fnsku / UPC / sku_code"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <div class="table-search-btns">
                            <!-- 查询 -->
                            <el-button @click="handelSearchPane_2" type="primary">{{ $t("search") }}</el-button>
                            <!-- 重置 -->
                            <el-button @click="resetFormPane_2">{{ $t("reset") }}</el-button>
                            <!-- 展开  -->
                            <BmCollapse el="#elCollapsePane2" :isShow="false" />
                        </div>
                    </el-form>
                </div>

                <div class="bg-light-grey mb-20 p-10"></div>

                <div class="plr-20 pb-20">
                    <div class="p-5">
                        <div class="flex between vcenter mb-5">
                            <div class="flex vcenter">
                                <el-radio-group v-model="searchForm_2.fastStatus" @change="handleChangeStatus">
                                    <!-- 全部 -->
                                    <el-radio-button label="">{{ $t("status.all") }}</el-radio-button>
                                    <!-- 发布中 -->
                                    <el-radio-button label="2">{{ $t("goodsListCheck.release") }}({{ statisticalTotal.total_await_check }})</el-radio-button>
                                    <!-- 已驳回 -->
                                    <el-radio-button label="3">{{ $t("goodsListCheck.goodsCheckReject") }}({{ statisticalTotal.total_check_failed }})</el-radio-button>
                                    <!-- 发布成功 -->
                                    <!-- <el-radio-button label="4">{{ $t("goodsListCheck.releaseSuccess") }}({{ statisticalTotal.total_check_success }})</el-radio-button> -->
                                </el-radio-group>
                                <el-radio-group v-model="searchForm_2.deliveryType" @change="handleChangeType" class="ml-15">
                                    <el-radio label="">{{ $t("status.all") }}</el-radio>
                                    <el-radio label="1">FBM</el-radio>
                                    <el-radio label="2">FBT</el-radio>
                                </el-radio-group>
                                <div class="ml-20">
                                    <!-- 发布新商品 -->
                                    <el-button @click="goNewsGoods" type="primary" plain icon="el-icon-plus">{{ $t("status.releaseNewProduct") }}</el-button>
                                </div>
                            </div>
                            <div class="flex vcenter">
                                <!-- 表格选项 -->
                                <BmTableOption table="goodsListTable" :column="tableColumn" />
                            </div>
                        </div>

                        <div class="mb-5">
                            <!-- 批量改价 2-->
                            <el-button plain v-permission="'goodsManage_goodsList_batchChangePrice'" @click="changePriceVisible(2)">{{ $t("status.batchChangePrice") }}</el-button>
                            <!-- 批量删除 -->
                            <el-button plain v-permission="'goodsManage_goodsList_batchDelete'" @click="auditBatchDelete" class="ml-10">{{ $t("status.batchDelete") }}</el-button>
                            <!-- 批量撤销审核 -->
                            <el-button plain @click="batchCancelAudit(1)" class="ml-10">{{ $t("goodsList.cancelAudit") }}</el-button>
                            <!-- 批量提交审核 -->
                            <el-button plain @click="batchCancelAudit(2)" class="ml-10">{{ $t("warehouse.submitAudit") }}</el-button>
                        </div>
                    </div>

                    <BmTable
                        ref="multipleTable"
                        :data="tableData_2"
                        row-key="id"
                        :tree-props="{ children: 'skus' }"
                        v-loading="tableLoading_2"
                        @selection-change="handleSelectionChangeAudit"
                        @row-click="handleRowClickAudit"
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

                                    <!-- <div v-if="scope.row.isDraft === 1">
                                        {{ scope.row.isDraft === 1 ? "是草稿箱" : scope.row.isDraft == 0 ? "不是草稿箱" : "" }}
                                    </div> -->
                                    <!-- <div v-if="!scope.row.fnsku && scope.row.total_selling">在售中: ({{ scope.row.total_selling }})</div>
                                    <div v-if="!scope.row.fnsku && scope.row.total_not_selling">不可售: ({{ scope.row.total_not_selling }})</div> -->
                                    <div v-if="!scope.row.fnsku">
                                        <!-- 审核状态 -->
                                        {{ $t("goodsList.auditStatus") }}:
                                        <!--"1待审核"  "2已通过 $t("status.auditPass")" "3未通过"  4 撤销审核-->
                                        {{
                                            scope.row.examineStatus == 1
                                                ? $t("status.beAudit")
                                                : scope.row.examineStatus == 3
                                                ? $t("goodsList.notPass")
                                                : scope.row.examineStatus == 4
                                                ? $t("goodsList.cancelAudit")
                                                : ""
                                        }}
                                    </div>

                                    <div v-if="scope.row.brandStatus == 4 || scope.row.brandStatus == 5">
                                        <!-- 品牌状态: scope.row.brandStatus == 1 ? "正常" : 4"品牌屏蔽" 5"品牌待更新"-->
                                        {{ scope.row.brandStatus == 4 ? $t("goodsList.brandShield") : scope.row.brandStatus == 5 ? $t("goodsList.brandBeUpdated") : "" }}
                                    </div>

                                    <div v-if="scope.row.isShield == 1 && !scope.row.fnsku">
                                        <!-- 是否屏蔽: scope.row.isShield == 0 ? "否" :  "已屏蔽"-->
                                        {{ scope.row.isShield == 1 ? $t("goodsList.HasBeenBlocked") : "" }}
                                    </div>
                                    <div v-if="scope.row.isLaunch == 0">
                                        <!-- 上架状态: "已下架"-->
                                        <!-- {{ scope.row.isDown == 1 ? $t("goodsList.removeSthShelves") : "" }} -->
                                    </div>
                                </div>
                            </template>
                        </BmTableColumn>
                        <BmTableColumn prop="goodsInfo" :label="$t('goodsListTable.goodsInfo')" min-width="300">
                            <template #default="scope">
                                <div class="flex">
                                    <div>
                                        <el-image class="tabelimg" v-if="scope.row.mainPictureUrl" :src="scope.row.mainPictureUrl" :preview-src-list="[scope.row.mainPictureUrl]" />
                                        <el-image class="tabelimg" v-if="scope.row.picture" :src="scope.row.picture" :preview-src-list="[scope.row.picture]" />
                                    </div>
                                    <div class="ml-10">
                                        <div class="green">
                                            {{ scope.row.goodTitle }}
                                        </div>
                                        <div>TSIN: {{ scope.row.tsin }}</div>
                                        <!-- <div>
                                            卖家编码: {{ scope.row.shopCode }}
                                        </div> -->
                                    </div>
                                </div>
                            </template>
                        </BmTableColumn>
                        <BmTableColumn prop="price" :label="$store.state.app.currencySymbol + $t('goodsListTable.price')" align="center">
                            <template #default="scope">
                                <div style="margin: auto">
                                    <div v-if="scope.row.minPrice">
                                        {{ scope.row.minPrice }} ~
                                        {{ scope.row.maxPrice }}
                                    </div>
                                    <div>{{ scope.row.price }}</div>
                                </div>
                            </template>
                        </BmTableColumn>
                        <BmTableColumn prop="stockNum" :label="$t('goodsListTable.stockNum')" align="center">
                            <template #default="scope">
                                <div style="margin: auto">
                                    <span>{{ scope.row.stock }}</span>
                                </div>
                            </template>
                        </BmTableColumn>
                        <BmTableColumn prop="brandName" :label="$t('goodsListTable.brandName')" width="145" align="center">
                            <template #default="scope">
                                <div v-if="scope.row.brandName">
                                    {{ scope.row.brandName }}
                                </div>
                                <div v-else>一</div>
                            </template>
                        </BmTableColumn>

                        <!-- <BmTableColumn prop="examineStatus" :label="$t('goodsListTable.examineStatus')" align="center" width="145" show-overflow-tooltip>
                            <template #default="scope">
                                {{
                                    scope.row.examineStatus == 2
                                        ? $t("goodsListTable.passed")
                                        : scope.row.examineStatus == 1
                                        ? $t("goodsListTable.waitCheck")
                                        : scope.row.examineStatus == 3
                                        ? $t("goodsListTable.fail")
                                        : ""
                                }}
                            </template>
                        </BmTableColumn> -->
                        <BmTableColumn prop="internationalCode" :label="$t('goodsListTable.internationalCode')" align="center" width="145" show-overflow-tooltip>
                            <template #default="scope">
                                {{ scope.row.internationalCode }}
                            </template>
                        </BmTableColumn>

                        <BmTableColumn :label="$t('goodsListTable.submitExamineTime')" prop="submitExamineTime" width="145" align="center"> </BmTableColumn>
                        <BmTableColumn :label="$t('goodsListTable.examineTime')" prop="examineTime" width="145" align="center"> </BmTableColumn>
                        <BmTableColumn :label="$t('table.operation')" width="145" header-align="center" fixed="right" align="center">
                            <template #default="scope">
                                <div v-if="scope.row.skus">
                                    <!-- 审核 1待审 2通过 3驳回 -->
                                    <div v-if="scope.row.examineStatus !== 1" class="green cp">
                                        <el-button type="text" v-permission="'goodsManage_goodsList_auditEdit'" @click.stop="handleEdit(scope.row)">{{ $t("table.edit") }}</el-button>
                                    </div>

                                    <div class="green cp">
                                        <el-button type="text" v-permission="'goodsManage_goodsList_auditDetail'" @click.stop="handleDetail(scope.row)">{{ $t("table.detail") }}</el-button>
                                    </div>
                                    <div v-if="scope.row.examineStatus == 1">
                                        <!-- 撤销审核 -->
                                        <el-button type="text" @click="cancelAudit(scope.row.id)">{{ $t("goodsList.cancelAudit") }}</el-button>
                                    </div>
                                    <!-- 查看驳回原因 -->
                                    <div v-if="scope.row.examineStatus == 3" @click="checkRejectReason(scope.row)" class="green cp">
                                        <!-- <el-popover placement="left" width="400" trigger="click">
                                            <template #reference>
                                                <div class="green cp">
                                                    {{ $t("goodsList.checkRejectReason") }}
                                                </div>
                                            </template>
                                            <span>{{ scope.row.auditReason }}</span>
                                        </el-popover> -->
                                        {{ $t("goodsList.checkRejectReason") }}
                                    </div>
                                </div>
                                <!-- 打印 -->
                                <el-button type="text" @click.stop="handlePrintBarcode(scope.row)">{{ $t("goodsList.printBarcode") }}</el-button>
                            </template>
                        </BmTableColumn>
                    </BmTable>
                    <BmPagination @size-change="handleSizeChangePane_2" @current-change="handleCurrentChangePane_2" :current-page="pageNum_2" :total="pageTotal_2"> </BmPagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
    <!-- 批量转换配送方式 -->
    <el-dialog :title="titleContent" v-model="outerVisible" width="30%">
        <div class="flex center">{{ dialogContent }}</div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="outerVisible = false">{{ $t("cancel") }}</el-button>
                <el-button type="primary" @click="confirmSubmit">{{ $t("confirm") }}</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 批量改价 -->
    <el-dialog :title="$t('table.batchChangePrice')" v-model="innerVisible" width="30%">
        <div class="flex vcenter">
            <span style="width: 50px">{{ $t("table.price") }}:</span><el-input v-model="price" placeholder="" />
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="innerVisible = false">{{ $t("cancel") }}</el-button>
                <el-button type="primary" @click="batchChangePrice">{{ $t("confirm") }}</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 驳回原因 -->
    <el-dialog :title="$t('fund.rejectReason')" v-model="rejectVisible" width="30%">
        <div class="mb-15">{{ $t("fund.rejectReason") }}: {{ auditReason }}</div>
        <div>
            <template v-for="(item, i) in auditImgList" :key="i">
                <el-image class="tabelimg m-5" v-if="item" :src="item" :preview-src-list="auditImgList" />
            </template>
        </div>
    </el-dialog>

    <!-- 审核列表 批量删除 -->
    <el-dialog :title="$t('status.batchDelete')" v-model="auditBatchDeleteVisible" width="30%">
        <div class="flex center">{{ dialogContent }}</div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="auditBatchDeleteVisible = false">{{ $t("cancel") }}</el-button>
                <el-button type="primary" @click="subAuditBatchDelete">{{ $t("confirm") }}</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 批量提交审核 -->
    <el-dialog :title="auditContent" v-model="batchCancelAuditVisible" width="30%">
        <div class="flex center">{{ auditContent }}</div>
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
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { dateShortcuts } from "@/utils/dateShortcuts";
import {
    getsCategoryListTree,
    brandMallList,
    specModelMallListGoodsCategoryByAttrId,
    specModelMallRelationCategory,
    specModelMallExport,
    goodsMallGetStatistical,
    findByParentId,
    getGoodsSellerList,
    goodsSellerStatistical,
    batchTransformDeliveryType,
    goodsSellerBatchShelf,
    goodsSellerBatchDelete,
    goodsSellerBatchChangePrice,
    getGoodsSellerCheckList,
    goodsSellerCopyGoodsInfo,
    productGoodsUndoSubCheck,
    goodsSellerBatchAuditSub,
    productGoodsFindLastGoodsExamine
} from "@/api/goods";
import GoodsInfoDetailEdit from "./goodsInfoDetailEdit";
import GoodsInfoDetail from "./goodsInfoDetail";
import { exportExcel } from "@/utils/";
import PrintBarcode from "./component/printBarcode";
export default {
    name: "goodsList",
    components: { GoodsInfoDetail, GoodsInfoDetailEdit, PrintBarcode },
    setup() {
        const { proxy } = getCurrentInstance();
        const route = useRoute();
        const router = useRouter();
        const dict = inject("dict"); //数据字典

        let activeName = ref("pane1");
        if (route.query.activeName) {
            activeName.value = route.query.activeName;
        }

        let price = ref(""); // 批量改价

        let formLabelWidth = ref("65px");
        let typeName = ref(proxy.$t("goodsListTable.isCharge")); //"是否带电"

        const handleCommand = (item) => {
            typeName.value = item.name;
        };

        let outerVisible = ref(false);
        let innerVisible = ref(false);
        let rejectVisible = ref(false); // 驳回原因

        let auditReason = ref(); // 驳回原因
        let auditImgList = ref([]); // 驳回原因图片

        // const lang = computed(() => store.state.app.lang);
        // watch(lang, (nVal) => {
        //     initData();
        // });

        //分页 线上商品
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        // 审核商品
        let pageNum_2 = ref(1),
            pageSize_2 = 10,
            pageTotal_2 = ref(0);

        let statisticalTotal = reactive({
            total_bank_waiting_update: "", // 待更新
            total_mall_shielding: "", // 屏蔽中
            total_not_selling: "", // 不可售
            total_selling: "" // 在售中
        });

        // 卖家获取商品统计数据
        let sellStatisticalList = reactive({
            total_fbm_shelf_has_stock: "",
            total_fbt_shelf_has_stock: "",
            total_not_stock: "",
            total_shielding: "",
            total_await_check: "",
            total_check_failed: "",
            total_check_success: ""
        });

        const multipleTable = ref(null);
        let tableLoading = ref(true);
        let tableLoading_2 = ref(true);
        let tableData = ref([]);
        let tableData_2 = ref([]);

        // 编辑类型
        let editType = computed(() => [
            {
                name: proxy.$t("orderQuery.all"), //
                value: ""
            },
            {
                name: proxy.$t("goodsListCheck.editStatus"), // 修改
                value: 2
            },
            {
                name: proxy.$t("goodsListCheck.addStatus"), // 新增
                value: 1
            }
        ]);

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
            {
                name: proxy.$t("goodsListTable.firstExamineTime"), //审核时间
                value: 3,
                field: "examineTime"
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
                name: proxy.$t("goodsListTable.NewExamineTime"), //最新/最后修改审核时间
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
                name: proxy.$t("orderQuery.all"), //
                value: ""
            },
            {
                name: proxy.$t("goodsList.underReview"), //审核中
                value: 1
            },
            {
                name: proxy.$t("goodsList.Reviewtherejected"), //审核驳回
                value: 2
            },
            {
                name: proxy.$t("goodsList.Understock"), //库存不足
                value: 3
            },
            {
                name: proxy.$t("goodsList.Sold"), //已售馨
                value: 4
            },
            {
                name: proxy.$t("goodsList.removesthfromshelves"), //已下架
                value: 5
            },
            {
                name: proxy.$t("goodsList.Salesprohibitedontheplatform"), //平台禁止售卖
                value: 6
            },
            {
                name: proxy.$t("goodsList.derstock"), //库存充足
                value: 7
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
            status: route.query.status * 1 || "", //状态
            fastStatus: route.query.fastStatus || "", //状态
            saleStatus: route.query.saleStatus || "", // 售卖状态
            pageNum: pageNum,
            pageSize: pageSize,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        // 审核搜索条件
        let searchForm_2Ref = ref(null);
        let searchForm_2 = reactive({
            _categoryId: [],
            categoryId: "",
            brandId: "", // 品牌id
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
            status: route.query.status * 1 || "", //状态
            fastStatus: route.query.fastStatus || "",
            saleStatus: route.query.saleStatus || "", // 售卖状态
            pageNum: pageNum_2,
            pageSize: pageSize_2,
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        //搜索
        const handelSearch = () => {
            searchForm.categoryId = searchForm._categoryId[3]
                ? searchForm._categoryId[3]
                : searchForm._categoryId[2]
                ? searchForm._categoryId[2]
                : searchForm._categoryId[1]
                ? searchForm._categoryId[1]
                : searchForm._categoryId[0];
            // searchForm.beginTime = dayjs(searchForm._tmpTimeValue[0]).format("YYYY-MM-DD HH:mm:ss");
            // searchForm.endTime = dayjs(searchForm._tmpTimeValue[1]).format("YYYY-MM-DD HH:mm:ss");
            searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[0]);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tmpTimeValue && searchForm._tmpTimeValue[1]);
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/\s+/g, " ") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            console.log("searchForm", searchForm);
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        //搜索
        const handelSearchPane_2 = () => {
            searchForm_2.categoryId = searchForm_2._categoryId[2] ? searchForm_2._categoryId[2] : searchForm_2._categoryId[1] ? searchForm_2._categoryId[1] : searchForm_2._categoryId[0];
            searchForm_2.beginTime = proxy.utils.formatStandardDate(searchForm_2._tmpTimeValue && searchForm_2._tmpTimeValue[0]);
            searchForm_2.endTime = proxy.utils.formatStandardDate(searchForm_2._tmpTimeValue && searchForm_2._tmpTimeValue[1]);
            searchForm_2.skeyword = searchForm_2.skeyword ? searchForm_2.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm_2.titleKeyword = searchForm_2.titleKeyword ? searchForm_2.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            console.log("searchForm", searchForm);
            initData();
        };
        //重置
        const resetFormPane_2 = () => {
            searchForm_2Ref.value.resetFields();
            searchForm_2.fastStatus = "";
            searchForm_2.status = "";
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
            "commentCount",
            "examineStatus"
        ];

        //获取列表
        const getListPage = () => {
            tableLoading.value = true;
            if (activeName.value === "pane1") {
                getGoodsSellerList(searchForm)
                    .then((res) => {
                        pageTotal.value = res.data.total;
                        tableData.value = res.data.records.map((v) => {
                            v.last30SaleCount = v.totalLast30SaleCount; // 近30日销量
                            v.last30CommentCount = v.totalLast30CommentCount; // 近30日评论
                            v.total_not_selling = v.skuCountMap.total_not_selling;
                            v.total_selling = v.skuCountMap.total_selling;
                            v.skus.forEach((item) => {
                                item.examineStatus = v.examineStatus;
                            });
                            return v;
                        });
                        tableLoading.value = false;
                    })
                    .catch((err) => {
                        tableLoading.value = false;
                    });
            } else {
                // 获取审核列表
                getGoodsSellerCheckList(searchForm_2)
                    .then((res) => {
                        pageTotal_2.value = res.data.total;
                        tableData_2.value = res.data.records.map((v) => {
                            //v.last30SaleCount = v.totalLast30SaleCount; // 近30日销量
                            //v.last30CommentCount = v.totalLast30CommentCount; // 近30日评论
                            // v.total_not_selling = v.skuCountMap.total_not_selling;
                            // v.total_selling = v.skuCountMap.total_selling;
                            v.skus.forEach((item) => {
                                item.examineStatus = v.examineStatus;
                            });
                            return v;
                        });
                        tableLoading_2.value = false;
                    })
                    .catch((err) => {
                        tableLoading_2.value = false;
                    });
            }
        };

        // 商家后台接口》卖家中心搜索统计数据type=list表示商品列表统计 type=check审核商品列表 type=updatecheck更新审核列表
        const searchCount = () => {
            let type = "";
            if (activeName.value === "pane1") {
                type = "list";
            } else {
                type = "check";
            }
            goodsMallGetStatistical(type)
                .then((res) => {
                    console.log("list", res);
                    statisticalTotal.total_not_selling = res.data.total_not_selling;
                    statisticalTotal.total_selling = res.data.total_selling;
                    statisticalTotal.total_await_check = res.data.total_await_check;
                    statisticalTotal.total_check_failed = res.data.total_check_failed;
                    statisticalTotal.total_check_success = res.data.total_check_success;
                })
                .catch((err) => {});
        };
        searchCount();

        // tab切换
        const handleClick = (tab, event) => {
            searchForm_2.fastStatus = "";
            getListPage();
            searchCount();
        };

        // 卖家获取商品统计数据
        const getGoodsSellerStatistical = () => {
            goodsSellerStatistical()
                .then((res) => {
                    console.log("卖家商品", res);
                    sellStatisticalList.total_not_stock = res.data.total_not_stock;
                    sellStatisticalList.FBM_total_shelf_has_stock = res.data.FBM_total_shelf_has_stock;
                    sellStatisticalList.FBT_total_shelf_has_stock = res.data.FBT_total_shelf_has_stock;
                    sellStatisticalList.total_shielding = res.data.total_shielding;
                    sellStatisticalList.total_draft = res.data.total_draft;
                    sellStatisticalList.total_deleted = res.data.total_deleted;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getGoodsSellerStatistical();

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
            findByParentId({ parentId: 0 })
                .then((res) => {
                    console.log(res);
                    countryList.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
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
            }
            // {
            //     name: proxy.$t("goodsListTable.commentCount"), //收藏数
            //     value: 3,
            //     field: "commentCount",
            // },
        ]);
        let columnSalesIndex = ref(0);
        const handleCommandcolumnSales = (item) => {
            columnSalesIndex.value = item.value;
        };

        // 线上商品 选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
            console.log(rows, "2222222222222222");
        };

        // 审核列表 选中的行
        let tableSelectionRowsAudit = [];
        const handleSelectionChangeAudit = (rows) => {
            tableSelectionRowsAudit = rows;
            console.log(rows, "33333333333333333");
        };

        // 线上 点击单行-选择
        const handleRowClick = (row) => {
            const index = tableSelectionRows.findIndex((item) => item.id === row.id);
            if (index > -1) {
                tableSelectionRows.push(row);
            } else {
                tableSelectionRows.splice(index, 1);
            }
            multipleTable.value.toggleRowSelection(row);
        };

        // 审核商品 点击单行-选择
        const handleRowClickAudit = (row) => {
            const index = tableSelectionRowsAudit.findIndex((item) => item.id === row.id);
            if (index > -1) {
                tableSelectionRowsAudit.push(row);
            } else {
                tableSelectionRowsAudit.splice(index, 1);
            }
            multipleTable.value.toggleRowSelection(row);
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

        //编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleEdit = (row) => {
            editRow.value = {
                goodId: row.id,
                categoryId: row.categoryId,
                deliveryType: row.deliveryType,
                isGoodsList: true
            };
            editVisible.value = true;
        };

        //关联类目数量
        let goodsCategoryVisible = ref(false);
        let goodsCategoryRow = ref([]); //点击的当前行
        const handleCategoryNum = (row) => {
            const loading = proxy.$loading();
            specModelMallListGoodsCategoryByAttrId({ specId: row.id })
                .then((res) => {
                    goodsCategoryRow.value = {
                        ...row,
                        ids: res.data.map((item) => item.id)
                    };
                    goodsCategoryVisible.value = true;
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
        };

        const changeGoodsCategory = (ids) => {
            specModelMallRelationCategory({
                id: goodsCategoryRow.value.id,
                categoryIds: ids
            })
                .then((res) => {
                    initData();
                })
                .catch(() => {
                    initData();
                });
        };

        //属性值
        let specValuesVisible = ref(false);
        let specValuesRow = ref({});
        const handleSpecValues = (row) => {
            specValuesRow.value = row;
            specValuesVisible.value = true;
        };

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            specModelMallExport(searchForm)
                .then((res) => {
                    exportExcel("Product list", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
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

        //当前页
        const handleCurrentChangePane_2 = (val) => {
            searchForm_2.pageNum = val;
            initData();
        };
        //每页n条
        const handleSizeChangePane_2 = (val) => {
            searchForm_2.pageNum = 1;
            searchForm_2.pageSize = val;
            initData();
        };

        // tab切换状态
        const handleChangeStatus = (val) => {
            if (activeName.value == "pane1") {
                searchForm.saleStatus = val;
            } else {
                searchForm_2.fastStatus = val;
            }
            console.log(val, "===============");
            initData();
        };

        // 物流筛选
        const handleChangeType = (val) => {
            searchForm.deliveryType = val;
            initData();
        };

        // 商品发布页面
        const goNewsGoods = () => {
            router.push({ path: "/goodsManage/publishGoods" });
        };

        // 1批量转换配送方式/ 3批量删除,上架2,下架4
        let titleContent = ref("");
        let dialogContent = ref("");
        let status = "";
        let deliveryType = "";
        let goodType = ""; // 0 spu 1 sku
        const outerVisibleDialog = (val) => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }

            if (val === 1) {
                for (let index = 0; index < tableSelectionRows.length; index++) {
                    if (tableSelectionRows[index].deliveryType !== tableSelectionRows[0].deliveryType) {
                        proxy.$message.error(proxy.$t("transport"));
                        return;
                    }
                    if (tableSelectionRows[index].fnsku) {
                        proxy.$message.error(proxy.$t("selectedSPUTransform"));
                        return;
                    }
                }
                if (tableSelectionRows[0].deliveryType === 1) {
                    deliveryType = 2;
                    titleContent.value = proxy.$t("goodsListCheck.toFbt");
                    dialogContent.value = proxy.$t("goodsListCheck.FbmToFbt");
                } else {
                    deliveryType = 1;
                    titleContent.value = proxy.$t("goodsListCheck.toFbm");
                    dialogContent.value = proxy.$t("goodsListCheck.FbtToFbm");
                }
            } else if (val === 2 || val === 4) {
                let spu = false;
                let sku = false;
                for (let index = 0; index < tableSelectionRows.length; index++) {
                    //只有sku才有fnsku
                    if (tableSelectionRows[index].fnsku) {
                        sku = true;
                    } else {
                        spu = true;
                    }
                }

                if (sku && spu) {
                    proxy.$message.error(proxy.$t("status.oneSpuOrSku")); // "一次操作只能选择SPU或SKU一种类型"
                    return;
                }

                if (sku) {
                    goodType = 1;
                } else {
                    goodType = 0;
                }

                if (val == 2) {
                    titleContent.value = proxy.$t("goodsListCheck.shelves");
                    dialogContent.value = proxy.$t("goodsListCheck.shelvesContent");
                } else if (val == 4) {
                    titleContent.value = proxy.$t("goodsListCheck.ConfirmToMountMount");
                    dialogContent.value = proxy.$t("goodsListCheck.putGoodsOnSale");
                }
            } else {
                for (let index = 0; index < tableSelectionRows.length; index++) {
                    if (tableSelectionRows[index].fnsku) {
                        proxy.$message.error(proxy.$t("selectedSPUDelete"));
                        return;
                    }
                }
                titleContent.value = proxy.$t("goodsListCheck.confirmDeletion");
                dialogContent.value = proxy.$t("goodsListCheck.deletionContent");
            }

            outerVisible.value = true;
            status = val;
        };

        // 上下架
        const confirmSubmit = () => {
            const loading = proxy.$loading();
            let ids = [];
            ids = tableSelectionRows.map((item) => item.id);
            console.log("ids", ids);
            if (status === 1) {
                // 转换配送方式
                batchTransformDeliveryType(ids, deliveryType)
                    .then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            proxy.$message.success(res.msg);
                            outerVisible.value = false;
                            initData();
                            loading.close();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        loading.close();
                    });
            } else if (status === 2) {
                let status = 0; // 下架
                goodsSellerBatchShelf(ids, status, goodType)
                    .then((res) => {
                        console.log(res);
                        proxy.$message.success(res.msg);
                        outerVisible.value = false;
                        initData();
                        loading.close();
                    })
                    .catch((err) => {
                        console.log(err);
                        loading.close();
                    });
            } else if (status == 4) {
                let status = 1; // 上架
                goodsSellerBatchShelf(ids, status, goodType)
                    .then((res) => {
                        console.log(res);
                        proxy.$message.success(res.msg);
                        outerVisible.value = false;
                        initData();
                        loading.close();
                    })
                    .catch((err) => {
                        console.log(err);
                        loading.close();
                    });
            } else {
                // 删除
                goodsSellerBatchDelete(ids)
                    .then((res) => {
                        console.log(res);
                        if (res.code === 0) {
                            proxy.$message.success(res.msg);
                            outerVisible.value = false;
                            initData();
                            loading.close();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        loading.close();
                    });
            }
        };

        // 改价
        let priceType = "";
        const changePriceVisible = (val) => {
            priceType = val;
            if (val == 1) {
                // 线上商品
                for (let index = 0; index < tableSelectionRows.length; index++) {
                    if (!tableSelectionRows[index].fnsku) {
                        proxy.$message.error(proxy.$t("status.onlySkuedit")); // 只能对SKU商品进行改价
                        return;
                    }
                }

                if (tableSelectionRows.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
            } else {
                // 审核商品
                for (let index = 0; index < tableSelectionRowsAudit.length; index++) {
                    if (!tableSelectionRowsAudit[index].fnsku) {
                        proxy.$message.error(proxy.$t("status.onlySkuedit")); // 只能对SKU商品进行改价
                        return;
                    }
                    if (tableSelectionRowsAudit[index].examineStatus == 1) {
                        proxy.$message.error(proxy.$t("status.onlySkuedit")); // 只能对 不是 待审核 状态的SKU商品进行改价
                        return;
                    }
                }

                if (tableSelectionRowsAudit.length === 0) {
                    proxy.$message.error(proxy.$t("table.selectLeastOne"));
                    return;
                }
            }

            innerVisible.value = true;
        };

        // 批量改价
        const batchChangePrice = () => {
            const loading = proxy.$loading();
            let ids = "";
            if (priceType == 1) {
                ids = tableSelectionRows.map((item) => item.id);
            } else {
                ids = tableSelectionRowsAudit.map((item) => item.id);
            }

            if (price) {
                goodsSellerBatchChangePrice(ids, price.value)
                    .then((res) => {
                        if (res.code === 0) {
                            proxy.$message.success(res.msg);
                            innerVisible.value = false;
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

        // 复制商品
        const copyGoods = (row) => {
            for (let index = 0; index < tableSelectionRows.length; index++) {
                if (tableSelectionRows[index].fnsku) {
                    proxy.$message.error(proxy.$t("status.onlySPUCopy")); // "只能对SPU商品进行复制"
                    return;
                }
            }
            const loading = proxy.$loading();
            let ids = "";
            if (row.id) {
                ids = row.id;
            } else if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            } else {
                ids = tableSelectionRows.map((item) => item.id);
            }
            if (typeof ids == "string") {
                goodsSellerCopyGoodsInfo({ goodsId: ids })
                    .then((res) => {
                        proxy.$message.success(res.msg);
                        initData();
                        loading.close();
                    })
                    .catch((err) => {
                        console.log(err);
                        loading.close();
                    });
            } else {
                goodsSellerCopyGoodsInfo({ goodsId: ids[0] })
                    .then((res) => {
                        proxy.$message.success(res.msg);
                        initData();
                        loading.close();
                    })
                    .catch((err) => {
                        console.log(err);
                        loading.close();
                    });
            }

            // else if (tableSelectionRows.length > 1) {
            //     proxy.$message.error(proxy.$t("table.onlySelectOne"));
            //     return;
            // }
        };

        // 跳转立即补货
        const immediateReplenishment = () => {
            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            let fnsku = false;
            let isFbm = false;
            tableSelectionRows.forEach((v) => {
                if (v.fnsku) {
                    fnsku = true;
                }
                if (v.deliveryType == 1) {
                    isFbm = true;
                }
            });
            if (fnsku) {
                proxy.$message.error(proxy.$t("status.skuNoDeliver")); // sku不支持发补货
                return;
            }
            if (isFbm) {
                proxy.$message.error(proxy.$t("status.fbmEditStock")); // FBM商品请编辑自行修改库存
                return;
            }
            let ids = tableSelectionRows.map((item) => item.id);
            router.push({ path: "/warehouse/shipmentsPlan", query: { ids } });
        };

        // 刷新数据
        const Refresh = () => {
            initData();
            searchCount();
        };

        const goDrafts = () => {
            router.push({ path: "/goodsManage/drafts" });
        };

        const goRecycleBin = () => {
            router.push({ path: "/goodsManage/recycleBin" });
        };

        // 撤销审核
        const cancelAudit = (val) => {
            const loading = proxy.$loading();
            productGoodsUndoSubCheck([val])
                .then((res) => {
                    initData();
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
        };

        // 驳回原因弹框
        const checkRejectReason = (row) => {
            rejectVisible.value = true;
            const loading = proxy.$loading();
            productGoodsFindLastGoodsExamine(row.id)
                .then((res) => {
                    auditReason.value = res.data.reason;
                    auditImgList.value = res.data.imgList;
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        // 审核列表 批量删除
        let auditBatchDeleteVisible = ref(false);
        const auditBatchDelete = () => {
            if (tableSelectionRowsAudit.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            for (let index = 0; index < tableSelectionRowsAudit.length; index++) {
                if (tableSelectionRowsAudit[index].fnsku) {
                    proxy.$message.error(proxy.$t("status.onlySPUDelete")); // 只能对SPU商品进行删除
                    return;
                }
                if (tableSelectionRowsAudit[index].examineStatus == 1) {
                    proxy.$message.error(proxy.$t("status.noWaitSPUDelete")); // 只能对 不是 待审核 状态的SPU商品进行删除
                    return;
                }
            }

            auditBatchDeleteVisible.value = true;
            dialogContent.value = proxy.$t("goodsListCheck.deletionContent");
        };

        // 审核列表 批量删除
        const subAuditBatchDelete = () => {
            const loading = proxy.$loading();
            let ids = tableSelectionRowsAudit.map((item) => item.id);
            goodsSellerBatchDelete(ids)
                .then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        proxy.$message.success(res.msg);
                        auditBatchDeleteVisible.value = false;
                        initData();
                        loading.close();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                });
        };

        // 审核列表 批量提交2/撤销审核1
        let batchCancelAuditVisible = ref(false);
        let auditType = ""; // 1 取消 2提交
        let auditContent = ref("");
        const batchCancelAudit = (val) => {
            auditType = val;

            if (tableSelectionRowsAudit.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            if (val == 1) {
                auditContent.value = proxy.$t("goodsList.cancelAudit");
                for (let index = 0; index < tableSelectionRowsAudit.length; index++) {
                    if (tableSelectionRowsAudit[index].fnsku) {
                        proxy.$message.error(proxy.$t("status.onlySPUCancelAudit")); // 只能对SPU商品进行撤销审核
                        return;
                    }
                    //1待审核"  "2已通过 $t("status.auditPass")" "3未通过"  4 撤销审核
                    if (tableSelectionRowsAudit[index].examineStatus != 1) {
                        proxy.$message.error(proxy.$t("status.onlyBatchWaitAudit")); // 只能对 不是 待审核 状态的SPU商品进行撤销审核
                        return;
                    }
                }
            } else {
                auditContent.value = proxy.$t("warehouse.submitAudit");
                for (let index = 0; index < tableSelectionRowsAudit.length; index++) {
                    if (tableSelectionRowsAudit[index].fnsku) {
                        proxy.$message.error(proxy.$t("status.onlySPUSubAudit")); // 只能对SPU商品进行撤销审核
                        return;
                    }
                    //1待审核"  "2已通过 $t("status.auditPass")" "3未通过"  4 撤销审核
                    if (tableSelectionRowsAudit[index].examineStatus == 1) {
                        proxy.$message.error(proxy.$t("status.onlyBatchSubAudit")); // 只能对 不是 待审核 状态的SPU商品进行撤销审核
                        return;
                    }
                }
            }

            batchCancelAuditVisible.value = true;
        };

        const subBatchCancelAudit = () => {
            let ids = tableSelectionRowsAudit.map((item) => item.id);
            const loading = proxy.$loading();
            if (auditType == 1) {
                productGoodsUndoSubCheck(ids)
                    .then((res) => {
                        proxy.$message.success(res.msg);
                        batchCancelAuditVisible.value = false;
                        initData();
                        loading.close();
                    })
                    .catch(() => {
                        loading.close();
                    });
            } else {
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
            }
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
            pageNum_2,
            pageSize_2,
            pageTotal,
            pageTotal_2,
            typeList,
            timeTypeList,
            presellList,
            statusList,
            shortcuts,
            disabledDate,
            searchFormRef,
            handelSearch,
            handelSearchPane_2,
            resetForm,
            resetFormPane_2,
            searchForm,
            categoryList,
            brandList,
            tableData,
            tableData_2,
            tableColumn,
            handleSizeChange,
            handleCurrentChange,
            handleCommandColumnTime,
            formLabelWidth,
            handleClick,
            activeName,
            handleSelectionChange,
            handleSelectionChangeAudit,
            handleChangeStatus,
            handleChangeType,
            shortcut,
            handleExportExcel,
            handleSpecValues,
            changeGoodsCategory,
            handleCategoryNum,
            handleCommandcolumnSales,
            multipleTable,
            detailRow,
            detailChangeVisible,
            handleDetail,
            countryList,
            goodsTypellList,
            handleCommand,
            handleRowClick,
            handleRowClickAudit,
            tableLoading,
            tableLoading_2,
            statisticalTotal,
            columnTimeIndex,
            salesTypeList,
            columnSalesIndex,
            goNewsGoods,
            sellStatisticalList,
            outerVisible,
            outerVisibleDialog,
            confirmSubmit,
            titleContent,
            dialogContent,
            innerVisible,
            batchChangePrice,
            changePriceVisible,
            price,
            copyGoods,
            immediateReplenishment,
            searchForm_2Ref,
            searchForm_2,
            handleCurrentChangePane_2,
            handleSizeChangePane_2,
            editType,
            editVisible,
            handleEdit,
            editRow,
            detailRow,
            Refresh,
            goDrafts,
            goRecycleBin,
            cancelAudit,
            rejectVisible,
            auditReason,
            checkRejectReason,
            auditImgList,
            goodsMultiList,
            auditBatchDelete,
            auditBatchDeleteVisible,
            subAuditBatchDelete,
            batchCancelAudit,
            subBatchCancelAudit,
            batchCancelAuditVisible,
            auditContent,
            handlePrintBarcode,
            printVisible,
            printData
        };
    }
};
</script>

<style lang="scss" scoped>
::v-deep(.el-tabs__content) {
    padding: 0;
}
.cells {
    position: relative;
    float: right;
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
.font-flow {
    height: 45px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
</style>
