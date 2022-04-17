<template>
    <div class="p-25 bg-white">
        <div class="flex vtop lh-1">
            <BmBreadcrumb />
            {{ isEdit ? "&nbsp; / &nbsp;" + $t("table.edit") : "" }}
        </div>

        <el-tabs v-model="activeName" type="card" class="custom-tabs-green">
            <!-- 基本信息 -->
            <el-tab-pane name="title1" class="pane-1">
                <template #label>
                    <el-badge type="danger" :is-dot="formPaneErr.pane1">
                        {{ $t("releaseGoods.basicInfo") }}
                    </el-badge>
                </template>
                <div>
                    <EditCategory @change="onChangeCategory" :option="categoryOption" :treeOptions="treeCategoryOptions" />
                    <el-form :model="formPane1" :rules="rulePane1" ref="formPane1Ref" label-position="top">
                        <el-form-item prop="goodTitle">
                            <template #label>
                                <span class="fs-16 fw"><i class="el-icon-lock"></i>{{ $t("releaseGoods.commodityTitle") }}</span>
                            </template>
                            <el-input v-model="formPane1.goodTitle" type="textarea" :rows="3" :placeholder="$t('pleaseEnter')" maxlength="1000" show-word-limit></el-input>
                            <div class="lh-1 mt-10">
                                {{ $t("releaseGoods.titleCheck") }}:
                                <span class="green cp" @click="checkisRightful">{{ $t("releaseGoods.clickCheck") }}</span>
                            </div>
                        </el-form-item>
                        <el-form-item prop="goodCode">
                            <template #label>
                                <span class="fs-16 fw">{{ $t("releaseGoods.goodsCode") }}</span>
                                <span class="ml-5">
                                    <el-popover placement="right" :width="300" trigger="hover">
                                        <template #reference>
                                            <i class="el-icon-question" style="font-size: 15px"></i>
                                        </template>
                                        {{ $t("releaseGoods.goodCodeTips") }}
                                    </el-popover>
                                </span>
                            </template>
                            <el-input maxlength="30" show-word-limit v-model="formPane1.goodCode" :placeholder="$t('pleaseEnter')"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <template #label>
                                <span class="fs-16 fw">{{ $t("releaseGoods.goodsBrand") }}</span>
                            </template>
                            <el-select v-model="formPane1.brandId" :placeholder="$t('pleaseSelect')" clearable>
                                <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="videoUrl">
                            <template #label>
                                <span class="fs-16 fw"><i class="el-icon-lock"></i>{{ $t("releaseGoods.goodsSlideshow") }}</span>
                            </template>
                            <div class="flex">
                                <!-- 商品视频 -->
                                <BmUpload
                                    @change="onChangeUploadVideo($event)"
                                    :fileUrl="formPane1.videoUrl"
                                    fileType="video"
                                    accept="video/mp4,video/ogg,video/flv,video/avi,video/wmv,video/rmvb"
                                    :show-file-list="false"
                                />
                                <div class="ml-25 lh-12">
                                    <div class="fs-14">
                                        {{ $t("releaseGoods.cover") }}
                                    </div>
                                    <div class="mt-5">1.{{ $t("releaseGoods.size") }}</div>
                                    <div class="mt-5">2.{{ $t("releaseGoods.burningTime") }}</div>
                                    <div class="mt-5">3.{{ $t("releaseGoods.content") }}</div>
                                    <div class="mt-5">4.{{ $t("releaseGoods.mbSize") }}</div>
                                    <div class="mt-5">5.{{ $t("releaseGoods.Format") }}</div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item prop="carouselMapUrls">
                            <template #label>
                                <span class="fs-16 fw"><i class="el-icon-lock"></i>{{ $t("releaseGoods.goodsBanner") }}</span>
                            </template>
                            <div class="flex m-10">
                                <!-- 轮播图 -->
                                <BmUpload
                                    @change="onChangeUploadCarousel($event)"
                                    draggable
                                    :multiple="true"
                                    :fileList="formPane1.carouselMapUrls"
                                    showMainPicture
                                    :mainPicture="formPane1.mainPictureUrl"
                                    :limit="10"
                                />
                                <div class="m-10  ml-20" style="line-height: 1.6;" v-html="$t('releaseGoods.imageLimit')"></div>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>

            <!-- 销售规格 -->
            <el-tab-pane name="title2" class="sell">
                <template #label>
                    <el-badge type="danger" :is-dot="formPaneErr.pane2">{{ $t("releaseGoods.salesSpecifications") }}</el-badge>
                </template>
                <EditCategory @change="onChangeCategory" :option="categoryOption" :treeOptions="treeCategoryOptions" />

                <div class="mb-15">
                    <span>*{{ $t("releaseGoods.goodsSpec") }}</span>
                    <span class="ml-15">{{ $t("releaseGoods.goodsSpecTips") }}</span>
                    <span class="ml-15">{{ $t("releaseGoods.imgPropertySize", { num1: 500, num2: 500 }) }}</span>
                </div>

                <el-form :model="specDataList" ref="specForm" class="spec-form">
                    <div class="mb-25" v-for="(item, index) in specDataList.form" :key="index">
                        <div class="flex between vcenter mb-25 plr-25 ptb-15 bg-light-grey">
                            <div class="flex between vcenter " style="width: 50%;">
                                <el-form-item :prop="`form.${index}.cnSpecName`" :rules="rulesCommon.required">
                                    <el-select
                                        v-model="item.cnSpecName"
                                        :disabled="isGoodsList"
                                        filterable
                                        allow-create
                                        @change="onChangeSpec($event, index)"
                                        :placeholder="$t('pleaseOrEnter')"
                                        style="width: 96%;"
                                    >
                                        <el-option v-for="itemS in specOptionList" :key="itemS.id" :label="itemS.cnSpecName" :value="itemS.cnSpecName"> </el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- 是否可 属性自定义添加 -->
                                <i :class="!item.isEdit ? 'el-icon-lock' : 'el-icon-unlock'" class="fs-18"></i>
                            </div>

                            <div>
                                <el-checkbox v-if="index === 0" v-model="item.isPictureUpload" :true-label="1" :false-label="0">
                                    {{ $t("releaseGoods.addImg") }}
                                </el-checkbox>
                                <!-- 删除规格 -->
                                <el-button @click="handleSpecDel(index)" :disabled="isGoodsList" type="text" class="ml-78 red">
                                    {{ $t("releaseGoods.deleteSpec") }}
                                </el-button>
                            </div>
                        </div>

                        <el-row :gutter="40">
                            <el-col v-for="(itemSpec, i) in item.specValues" :key="i" :span="12">
                                <div class="flex vcenter mb-25">
                                    <el-checkbox v-model="itemSpec.isChecked" disabled :true-label="1" :false-label="0" class="mr-10"></el-checkbox>
                                    <div class="flex flex1">
                                        <el-form-item :prop="`form.${index}.specValues.${i}.cnName`" :rules="rulesCommon.required" class="w-100 mb-0">
                                            <!-- 属性值输入 !自定义添加&&!编辑-->
                                            <el-input show-word-limit maxlength="30" v-model="itemSpec.cnName" :disabled="(!itemSpec.isCustom && !item.isEdit) || itemSpec.isDisabled" />
                                        </el-form-item>
                                        <!-- 备注值输入 -->
                                        <el-input
                                            v-if="!itemSpec.isCustom || itemSpec.isDisabled"
                                            type="text"
                                            :placeholder="$t('remark')"
                                            v-model="itemSpec.remarks"
                                            maxlength="15"
                                            class="ml-10"
                                            show-word-limit
                                        />
                                    </div>
                                    <!-- 小图 index=0 只能第一个有图片 @click="handleChangeUpload(!item.isSellerUploadPicture)"-->
                                    <BmUpload
                                        v-if="item.isPictureUpload && index === 0"
                                        @change="onChangeUpload($event, itemSpec)"
                                        :fileUrl="itemSpec.picture"
                                        :show-file-list="false"
                                        class="ml-10"
                                        size="xs"
                                        :disabled="item.isSellerUploadPicture == 0"
                                        :isPreview="false"
                                    />
                                    <el-button v-if="itemSpec.isCustom" :disabled="itemSpec.isDisabled" @click="handleSpecValueDel(i, item.specValues)" class="ml-10 red" type="text">
                                        {{ $t("delete") }}
                                    </el-button>
                                </div>
                            </el-col>
                        </el-row>

                        <el-button v-if="item.isEdit == 1" @click="handleSpecValueAdd(item)" type="text" class="green">
                            {{ $t("releaseGoods.propertyCustomAdd") }}
                        </el-button>
                    </div>

                    <div class="mb-30 flex vcenter">
                        <!-- +添加规格 -->
                        <el-button :disabled="specDataList.form.length >= 2 || isGoodsList" @click="handleSpecAdd" plain>+{{ $t("releaseGoods.addSpec") }}</el-button>
                        <!-- +添加SKU  -->
                        <el-button @click="handleSKUAdd" class="ml-25" type="warning" style="background: #faad14;"> +{{ $t("releaseGoods.addition") }}SKU </el-button>
                        <div class="flex vcenter rejectTips ml-10 pl-5">
                            <span>
                                <svg class="icon" aria-hidden="true" style="width: 20px;height: 20px;">
                                    <use xlink:href="#iconwarning" fill="#faad14"></use>
                                </svg>
                            </span>
                            <span class="ml-5">{{ $t("releaseGoods.pleaseAddSkuTips") }} </span>
                        </div>
                    </div>
                </el-form>
                <div class="mb-10">
                    <span class="title">{{ $t("releaseGoods.volumeSet") }}</span>
                    <!-- 删除所选 国内测试环境暂时放开-->
                    <!-- <el-button @click="handleSelectionDelete" class="ml-20" plain>
                        {{ $t("releaseGoods.deleteSelected") }}
                    </el-button> -->
                    <!-- 恢复所选 -->
                    <el-button @click="handleSelectionRecover" class="ml-10" plain>
                        {{ $t("releaseGoods.restoreSelected") }}
                    </el-button>
                </div>
                <!-- 批量设置 -->
                <el-form :model="specTableList" ref="formPane2Ref" class="spec-table-form">
                    <el-table :data="specTableList.form" ref="multipleTable" border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" class="table-bg-grey">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column width="90">
                            <template #header>
                                <i class="el-icon-lock"></i>{{ $t("releaseGoods.preview") }}
                                <el-popover placement="right" :width="400" trigger="hover">
                                    <template #reference>
                                        <i class="el-icon-question" style="font-size: 15px"></i>
                                    </template>
                                    {{ $t("releaseGoods.PreviewImgTips") }}
                                </el-popover>
                            </template>
                            <template #default="scope">
                                <BmUpload @change="onChangeUploadPicture($event, scope.row)" :fileUrl="scope.row.picture" :show-file-list="false" size="xl" />
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(item, index) in specColumnList" :key="index" min-width="120px" align="center">
                            <template #header> <i class="el-icon-lock"></i>{{ item.cnSpecName }} </template>
                            <template #default="scope">
                                <span :class="scope.row.isDelete ? 'through light-grey' : ''"> &nbsp; {{ getSpecAttr(index, scope.$index) }} &nbsp; </span>
                            </template>
                        </el-table-column>
                        <el-table-column width="160">
                            <template #header>
                                <div>
                                    <span>{{ $t("releaseGoods.goodsSkuCode") }}</span>
                                    <span class="ml-5">
                                        <el-popover placement="right" :width="300" trigger="hover">
                                            <template #reference>
                                                <i class="el-icon-question" style="font-size: 15px"></i>
                                            </template>
                                            {{ $t("releaseGoods.goodCodeTips") }}
                                        </el-popover>
                                    </span>
                                </div>
                                <el-input v-model="tableType.skuCode" @blur="onBlurSpec($event, 'skuCode')" maxlength="30"></el-input>
                            </template>
                            <template #default="scope">
                                <el-form-item>
                                    <el-input v-model="scope.row.skuCode" key="skuCode" maxlength="30"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="isEdit" width="160">
                            <template #header>
                                TSIN/FNSKU
                            </template>
                            <template #default="scope">
                                <span :class="scope.row.isDelete ? 'through light-grey' : ''">
                                    TSIN: {{ scope.row.tsin }} <br />
                                    FNSKU: {{ scope.row.fnsku }} <br />
                                </span>
                            </template>
                        </el-table-column>
                        <!-- 国际编码 -->
                        <el-table-column width="160">
                            <template #header>
                                <div><i class="el-icon-lock"></i>{{ $t("releaseGoods.internationalCode") }}</div>
                                <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="tableType.internationalCode" @blur="onBlurSpec($event, 'internationalCode')" maxlength="13"></el-input>
                            </template>
                            <template #default="scope">
                                <el-form-item :prop="`form.${scope.$index}.internationalCode`" :rules="rulesCommon.requiredinternationalCode">
                                    <el-input
                                        oninput="value=value.replace(/[^\d]/g,'')"
                                        v-model="scope.row.internationalCode"
                                        key="internationalCode"
                                        :placeholder="$t('releaseGoods.internationalCode13')"
                                        maxlength="13"
                                    ></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <!-- 库存数量 deliveryType 1=>FBM 2=>FBT -->
                        <el-table-column width="110" v-if="formPane6.deliveryType == 1">
                            <template #header>
                                <div>
                                    <span class="red">*</span>
                                    <span>{{ $t("releaseGoods.quantityInStock") }}</span>
                                    <span class="ml-5">
                                        <el-popover placement="right" :width="300" trigger="hover">
                                            <template #reference>
                                                <i class="el-icon-question" style="font-size: 15px"></i>
                                            </template>
                                            {{ $t("releaseGoods.stockTips") }}
                                        </el-popover>
                                    </span>
                                </div>
                                <el-input v-model="tableType.stockNum" @blur="onBlurSpec($event, 'stockNum')" oninput="value=value.replace(/[^0-9]/g,'')" min="0" step="1"></el-input>
                            </template>
                            <template #default="scope">
                                <el-form-item :prop="`form.${scope.$index}.stockNum`" :rules="rulesCommon.required">
                                    <el-input v-model="scope.row.stockNum" oninput="value=value.replace(/[^0-9]/g,'')" min="0" step="1" key="stockNum"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <!-- 单买价 -->
                        <el-table-column width="110">
                            <template #header>
                                <div><span class="red">*</span>{{ $t("releaseGoods.unitPrice") }}({{ $store.state.app.currencySymbol }})PCS</div>
                                <el-input v-model="tableType.price" @blur="onBlurSpec($event, 'price')" oninput="value=value.replace(/[^0-9.]/g,'')" min="0" step="1"></el-input>
                            </template>
                            <template #default="scope">
                                <el-form-item :prop="`form.${scope.$index}.price`" :rules="rulesCommon.required">
                                    <el-input v-model="scope.row.price" oninput="value=value.replace(/[^0-9.]/g,'')" min="0" key="price"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column width="110">
                            <template #header>
                                <div><i class="el-icon-lock"></i>{{ $t("releaseGoods.condition") }}</div>
                                <el-select v-model="tableType.type" @change="onBlurSpec($event, 'type')" :placeholder="$t('pleaseSelect')">
                                    <el-option :label="$t('releaseGoods.wholeNew')" :value="1"></el-option>
                                    <el-option :label="$t('releaseGoods.secondHand')" :value="2"></el-option>
                                </el-select>
                            </template>
                            <template #default="scope">
                                <el-select v-model="scope.row.type" :placeholder="$t('pleaseSelect')">
                                    <el-option :label="$t('releaseGoods.wholeNew')" :value="1"></el-option>
                                    <el-option :label="$t('releaseGoods.secondHand')" :value="2"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="180px">
                            <template #header>
                                <div>
                                    {{ $t("releaseGoods.shipment") }}
                                    ({{ $t("releaseGoods.Optional") }}
                                    <span class="ml-5">
                                        <el-popover placement="right" :width="300" trigger="hover">
                                            <template #reference>
                                                <i class="el-icon-question" style="font-size: 15px"></i>
                                            </template>
                                            {{ $t("releaseGoods.shipmentTips") }}
                                        </el-popover> </span
                                    >)
                                </div>
                                <!-- '修改发货重量/体积' -->
                                <el-button @click="handleBatchWeight('send', $t('releaseGoods.modifyShippingWV'))" class="w-100">
                                    {{ $t("releaseGoods.batchWV") }}
                                </el-button>
                            </template>
                            <template #default="scope">
                                <!-- '修改发货重量/体积' -->
                                <div @click="handleBatchWeight('send', $t('releaseGoods.modifyShippingWV'), scope.row)" class="cp">
                                    <div>
                                        {{ $t("releaseGoods.weight") }}:
                                        {{ scope.row.sendWeight }}
                                        {{ scope.row.sendWeightUnit }}
                                    </div>
                                    <div>
                                        {{ $t("releaseGoods.volume") }} :{{ scope.row.sendVolumeLength }} X {{ scope.row.sendVolumeWidth }} X {{ scope.row.sendVolumeHeight }} =
                                        {{ Math.floor(scope.row.sendVolumeLength * scope.row.sendVolumeWidth * scope.row.sendVolumeHeight * 100) / 100 }}
                                        {{ scope.row.sendVolumeUnit }}³
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="180px">
                            <template #header>
                                <div>
                                    {{ $t("releaseGoods.packageWV") }}
                                    ({{ $t("releaseGoods.Optional") }}
                                    <span>
                                        <el-popover placement="right" :width="300" trigger="hover">
                                            <template #reference>
                                                <i class="el-icon-question" style="font-size: 15px"></i>
                                            </template>
                                            {{ $t("releaseGoods.packageWVTips") }}
                                        </el-popover> </span
                                    >)
                                </div>
                                <!-- '修改商品包装重量/体积' -->
                                <el-button @click="handleBatchWeight('packing', $t('releaseGoods.ModifyProductPackagingWV'))" class="w-100">
                                    {{ $t("releaseGoods.batchModificationWV") }}
                                </el-button>
                            </template>
                            <template #default="scope">
                                <!-- '修改发货重量/体积' -->
                                <div @click="handleBatchWeight('packing', $t('releaseGoods.modifyShippingWV'), scope.row)" class="cp">
                                    <div>
                                        {{ $t("releaseGoods.weight") }} :{{ scope.row.packingWeight }}
                                        {{ scope.row.packingWeightUnit }}
                                    </div>
                                    <div>
                                        {{ $t("releaseGoods.volume") }} :{{ scope.row.packingVolumeLength }} X {{ scope.row.packingVolumeWidth }} X {{ scope.row.packingVolumeHeight }} =
                                        {{ Math.floor(scope.row.packingVolumeLength * scope.row.packingVolumeWidth * scope.row.packingVolumeHeight * 100) / 100 }}
                                        {{ scope.row.packingVolumeUnit }}³
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="180px">
                            <template #header>
                                <div>
                                    {{ $t("releaseGoods.netWeightVolume") }}
                                    ({{ $t("releaseGoods.Optional") }}
                                    <span>
                                        <el-popover placement="right" :width="300" trigger="hover">
                                            <template #reference>
                                                <i class="el-icon-question" style="font-size: 15px"></i>
                                            </template>
                                            {{ $t("releaseGoods.netWeightVolumeTips") }}
                                        </el-popover> </span
                                    >)
                                </div>
                                <!-- '修改商品净重/净体积' -->
                                <el-button @click="handleBatchWeight('clean', $t('releaseGoods.ModifyProductNetWNetV'))" class="w-100">
                                    {{ $t("releaseGoods.batchModificationWV") }}
                                </el-button>
                            </template>
                            <template #default="scope">
                                <!-- '修改发货重量/体积' -->
                                <div @click="handleBatchWeight('clean', $t('releaseGoods.modifyShippingWV'), scope.row)" class="cp">
                                    <div>
                                        {{ $t("releaseGoods.weight") }} :{{ scope.row.cleanWeight }}
                                        {{ scope.row.cleanWeightUnit }}
                                    </div>
                                    <div>
                                        {{ $t("releaseGoods.volume") }} :{{ scope.row.cleanVolumeLength }} X {{ scope.row.cleanVolumeWidth }} X {{ scope.row.cleanVolumeHeight }} =
                                        {{ Math.floor(scope.row.cleanVolumeLength * scope.row.cleanVolumeWidth * scope.row.cleanVolumeHeight * 100) / 100 }}
                                        {{ scope.row.cleanVolumeUnit }}³
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </el-tab-pane>

            <!-- 描述详情 -->
            <el-tab-pane name="title3" class="pane-3">
                <template #label>
                    <el-badge type="danger" :is-dot="formPaneErr.pane3">{{ $t("releaseGoods.describeTheDetails") }}</el-badge>
                </template>
                <el-form :model="formPane3" ref="formPane3Ref" label-position="top">
                    <EditCategory @change="onChangeCategory" :option="categoryOption" :treeOptions="treeCategoryOptions" />

                    <el-form-item prop="description">
                        <template #label>
                            <span class="fs-16 fw"><i class="el-icon-lock"></i>{{ $t("releaseGoods.describeTheDetails") }}</span>
                        </template>
                        <!-- <div class="mb-10 fs-16 fw">描述详情</div> -->
                        <div class="components-container">
                            <tinymce v-model:value="formPane3.description" :height="300" />
                        </div>
                    </el-form-item>
                    <el-form-item prop="detailsPics">
                        <template #label>
                            <span class="fs-16 fw"><i class="el-icon-lock"></i>{{ $t("releaseGoods.detailImg") }}</span>
                        </template>
                        <div class="flex m-10">
                            <BmUpload @change="onChangeUploadDetailImg($event)" draggable :multiple="true" :fileList="formPane3.detailsPics" :limit="10" />
                            <div class="m-10 ml-20" style="line-height: 1.6;" v-html="$t('releaseGoods.imageLimit')"></div>
                        </div>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <!-- 合规信息 -->
            <el-tab-pane name="title4" class="pane-4">
                <template #label>
                    <el-badge type="danger" :is-dot="formPaneErr.pane4">{{ $t("releaseGoods.complianceInformation") }}</el-badge>
                </template>
                <div>
                    <EditCategory @change="onChangeCategory" :option="categoryOption" :treeOptions="treeCategoryOptions" />

                    <el-form :model="formPane4" ref="formPane4Ref" label-width="auto">
                        <el-form-item prop="isCharge" :rules="rulesCommon.required">
                            <template #label> <i class="el-icon-lock"></i> {{ $t("goodsListTable.isCharge") }} </template>
                            <el-radio-group v-model="formPane4.isCharge">
                                <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                <el-radio :label="0">{{ $t("no") }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="isHazardousArticle" :rules="rulesCommon.required">
                            <template #label> <i class="el-icon-lock"></i> {{ $t("goodsListTable.isHazardousArticle") }} </template>
                            <el-radio-group v-model="formPane4.isHazardousArticle">
                                <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                <el-radio :label="0">{{ $t("no") }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="isContainsPowder" :rules="rulesCommon.required">
                            <template #label> <i class="el-icon-lock"></i> {{ $t("goodsListTable.isContainsPowder") }} </template>
                            <el-radio-group v-model="formPane4.isContainsPowder">
                                <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                <el-radio :label="0">{{ $t("no") }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="isFluid" :rules="rulesCommon.required">
                            <template #label> <i class="el-icon-lock"></i> {{ $t("goodsListTable.isFluid") }} </template>
                            <el-radio-group v-model="formPane4.isFluid">
                                <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                <el-radio :label="0">{{ $t("no") }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item prop="isPorcelain" :rules="rulesCommon.required">
                            <template #label> <i class="el-icon-lock"></i> {{ $t("goodsListTable.isMagnetism") }} </template>
                            <el-radio-group v-model="formPane4.isPorcelain">
                                <el-radio :label="1">{{ $t("yes") }}</el-radio>
                                <el-radio :label="0">{{ $t("no") }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- <el-form-item prop="maxBuy" :rules="rulesCommon.required" :label="$t('goodsList.orderMaxNum')">
                            <el-input oninput="value=value.replace(/[^\d]/g,'')" style="width: 594px;" v-model="formPane4.maxBuy" maxlength="5"></el-input>
                            <small> “ 0 ” {{ $t("goodsList.dontPurchase") }}</small>
                        </el-form-item> -->
                        <el-form-item prop="countryId" :label="$t('goodsList.country')">
                            <el-select v-model="formPane4.countryId" :placeholder="$t('pleaseSelect')" style="width: 594px;">
                                <el-option v-for="item in countryList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>

            <!-- 关键字 -->
            <el-tab-pane :name="$t('releaseGoods.keyword')">
                <template #label>
                    <el-badge type="danger" :is-dot="formPaneErr.pane5">{{ $t("releaseGoods.keyword") }}</el-badge>
                </template>
                <EditCategory @change="onChangeCategory" :option="categoryOption" :treeOptions="treeCategoryOptions" />

                <el-form :model="formPane5" ref="formPane5Ref" label-position="top">
                    <el-form-item>
                        <template #label>
                            <span class="fs-16 fw"><i class="el-icon-lock"></i>{{ $t("releaseGoods.searchKeyword") }}</span>
                        </template>
                        <el-input type="textarea" :rows="3" maxlength="1000" show-word-limit resize="none" v-model="formPane5.keyword" :placeholder="$t('releaseGoods.moreKeyword')"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <template #label>
                            <span class="fs-16 fw">{{ $t("releaseGoods.purpose") }}</span>
                        </template>
                        <el-input show-word-limit maxlength="200" v-model="formPane5.specialPurpose" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <template #label>
                            <span class="fs-16 fw">{{ $t("releaseGoods.fitPeople") }}</span>
                        </template>
                        <el-select v-model="formPane5.forPeople" :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in dictsList.intended_for" :value="item.value" :label="item.label" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <!-- 服务与承诺 -->
            <el-tab-pane name="title6" class="pane-6">
                <template #label>
                    <el-badge type="danger" :is-dot="formPaneErr.pane6">{{ $t("releaseGoods.serviceAndCommitment") }}</el-badge>
                </template>
                <EditCategory @change="onChangeCategory" :option="categoryOption" :treeOptions="treeCategoryOptions" />

                <el-form :model="formPane6" :rules="rulePane6" ref="formPane6Ref" label-width="auto">
                    <el-form-item :label="$t('goodsList.type')" prop="goodsType">
                        <el-radio-group v-model="formPane6.goodsType">
                            <el-radio v-for="item in dictsList.product_type" :label="item.value" :key="item.id">
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('releaseGoods.distribution')" prop="deliveryType">
                        <el-radio-group v-model="formPane6.deliveryType" @change="deliveryChange">
                            <el-radio v-for="item in dictsList.distribution_type" :label="item.value" :key="item.id">{{ item.label }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('goodsList.isPresell')" prop="isOpenPresell">
                        <el-radio-group v-model="formPane6.isOpenPresell">
                            <el-radio label="0">{{ $t("goodsList.notPresell") }}</el-radio>
                            <!-- <el-radio label="1">{{$t('goodsList.presell')}}</el-radio> -->
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-show="formPane6.deliveryType == 1" :label="$t('releaseGoods.promisedDelivery')" prop="promisedDeliveryTime">
                        <el-radio-group v-model="formPane6.promisedDeliveryTime">
                            <el-radio v-for="item in dictsList.promised_delivery_time" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('releaseGoods.InventoryPiece')" prop="stockDeductType">
                        <el-radio-group v-model="formPane6.stockDeductType">
                            <el-radio :label="1">
                                {{ $t("releaseGoods.paymentDestocking") }}
                            </el-radio>
                        </el-radio-group>
                        <!-- <div class="bg-light-grey plr-15">
                                (下单减库存,
                                <span class="orange"> 存在恶拍风险</span>
                                付款减库存,
                                <span class="orange">
                                    存在超卖风险 
                                </span>
                                FBT商品默认付款减库存
                            </div> -->
                    </el-form-item>
                    <el-form-item :label="$t('releaseGoods.payDelivery')" prop="isCashDelivery">
                        <el-radio-group v-model="formPane6.isCashDelivery">
                            <el-radio v-if="formPane6.deliveryType == 1" :label="0">{{ $t("status.notSupport") }}</el-radio>
                            <el-radio v-if="formPane6.deliveryType == 2" :label="1">{{ $t("status.support") }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('releaseGoods.transport')" prop="transportMode">
                        <el-checkbox-group v-model="formPane6.transportMode">
                            <!-- sendType=1空运 2海运 3陆运 -->
                            <el-checkbox v-for="item in freightTemplateListTmp" :key="item.id" :label="item.sendType">
                                {{ item.sendType == 1 ? $t("releaseGoods.air") : item.sendType == 2 ? $t("releaseGoods.sea") : $t("releaseGoods.land") }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item :label="$t('releaseGoods.freight')">
                        <template #label>
                            <span class="fs-14 fw">{{ $t("releaseGoods.freight") }}</span>
                        </template>
                        <div v-for="item in freightTemplateList" :key="item.id" class="bg-light-grey mb-15 p-15">
                            <div
                                v-html="
                                    $t('releaseGoods.fees', {
                                        name: '<span class=orange> ' + item.tempName + ' </span>'
                                    })
                                "
                            ></div>
                            <el-table :data="item.payAreas" border :show-header="false">
                                <el-table-column prop="weightMin" width="200">
                                    <template #default="scope"> {{ scope.row.weightMin }}kg &#60; {{ $t("releaseGoods.weight") }} ≤ {{ scope.row.weightMax }} kg </template>
                                </el-table-column>
                                <el-table-column prop="firstWeight">
                                    <template #default="scope">
                                        {{ $t("releaseGoods.firstWeight") }}{{ scope.row.firstWeight }}kg,
                                        {{ $t("releaseGoods.firstCharge") }}
                                        {{ scope.row.firstWeightFreight }}{{ $store.state.app.currencySymbol }} ;
                                        {{ $t("releaseGoods.toContinue") }}
                                        {{ scope.row.addUnitWeight }}kg, {{ $t("releaseGoods.renew") }}{{ scope.row.addWeightFreight }}{{ $store.state.app.currencySymbol }} ;
                                        {{ $t("releaseGoods.packaging") }}
                                        {{ scope.row.materialsCost }} {{ $store.state.app.currencySymbol }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-form-item>

                    <el-form-item :label="$t('releaseGoods.inventoryPiece')">
                        <template #label>
                            <span class="fs-14 fw">{{ $t("releaseGoods.inventoryPiece") }}</span>
                        </template>
                        <div class="flex mb-10">
                            <div class="serve-item">{{ $t("goodsList.common") }}</div>
                            <div class="serve-item ml-10">
                                {{ $t("orderQuery.notPresell") }}
                            </div>
                            <div v-show="formPane6.deliveryType == 1" class="serve-item ml-10">
                                {{ $t("releaseGoods.promisedTime", { time: formPane6.promisedDeliveryTime }) }}
                            </div>
                        </div>
                        <!-- 售后服务承诺 -->
                        <el-checkbox-group v-model="formPane6.servicesSelected">
                            <el-checkbox v-for="item in formPane6.services" :key="item.id" :label="item.id" :disabled="item.value == 1"> {{ item.configTitle }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <!-- 更多信息 -->
            <el-tab-pane name="title7" class="pane-7">
                <template #label>
                    <el-badge type="danger" :is-dot="formPaneErr.pane7">
                        {{ $t("releaseGoods.moreInformation") }}
                    </el-badge>
                </template>
                <EditCategory @change="onChangeCategory" :option="categoryOption" :treeOptions="treeCategoryOptions" />

                <div class="mb-25">
                    {{ $t("releaseGoods.accurateFill") }}
                </div>

                <el-form :model="formPane7" ref="formPane7Ref" label-position="top">
                    <!-- 1 字符串 2自然数 3日期 4货币 5浮点数 6 select单选 7布尔 8 时间 9select多选-->
                    <el-form-item v-for="(item, index) in formPane7.attrs" :key="index" :prop="`attrs.${index}.attrValue`">
                        <template #label>
                            <span class="fs-14 fw">{{ item.title }}</span>
                        </template>

                        <el-input
                            v-if="item.mode === 1"
                            v-model="item.attrValue"
                            :class="{ 'w-50': item.isUnit }"
                            :rules="item.isRequired ? rulesCommon.required : ''"
                            :placeholder="$t('pleaseEnter')"
                            :maxlength="item.limitLenght"
                            show-word-limit
                        ></el-input>
                        <el-input
                            v-if="item.mode === 2"
                            v-model="item.attrValue"
                            type="number"
                            step="1"
                            :class="{ 'w-50': item.isUnit }"
                            :rules="item.isRequired ? rulesCommon.required : ''"
                            :placeholder="$t('pleaseEnter')"
                            :maxlength="item.limitLenght"
                            show-word-limit
                        ></el-input>
                        <el-date-picker
                            v-if="item.mode === 3"
                            v-model="item.attrValue"
                            type="date"
                            :class="item.isUnit ? 'w-50' : 'w-100'"
                            :rules="item.isRequired ? rulesCommon.required : ''"
                            :placeholder="$t('releaseGoods.selectDate')"
                        >
                        </el-date-picker>
                        <el-input
                            v-if="item.mode === 4"
                            v-model="item.attrValue"
                            type="number"
                            step="0.01"
                            :min="0"
                            :class="{ 'w-50': item.isUnit }"
                            :rules="item.isRequired ? rulesCommon.required : ''"
                            :placeholder="$t('pleaseEnter')"
                            :maxlength="item.limitLenght"
                            show-word-limit
                        ></el-input>
                        <el-input
                            v-if="item.mode === 5"
                            v-model="item.attrValue"
                            type="number"
                            step="0.1"
                            :class="{ 'w-50': item.isUnit }"
                            :rules="item.isRequired ? rulesCommon.required : ''"
                            :placeholder="$t('pleaseEnter')"
                            :maxlength="item.limitLenght"
                            show-word-limit
                        ></el-input>
                        <el-select
                            v-if="item.mode === 6"
                            v-model="item.attrValue"
                            :class="{ 'w-50': item.isUnit }"
                            :rules="item.isRequired ? rulesCommon.required : ''"
                            :placeholder="$t('pleaseSelect')"
                        >
                            <el-option v-for="value in item.paramValueArr" :key="value" :label="value" :value="value"> </el-option>
                        </el-select>
                        <el-radio-group v-if="item.mode === 7" v-model="item.attrValue" :class="{ 'w-50': item.isUnit }" :rules="item.isRequired ? rulesCommon.required : ''">
                            <el-radio v-for="value in item.paramValueArr" :key="value" :label="value">
                                {{ value }}
                            </el-radio>
                        </el-radio-group>
                        <el-date-picker
                            v-if="item.mode === 8"
                            v-model="item.attrValue"
                            type="datetime"
                            :class="item.isUnit ? 'w-50' : 'w-100'"
                            :rules="item.isRequired ? rulesCommon.required : ''"
                            :placeholder="$t('releaseGoods.selectDateTime')"
                        >
                        </el-date-picker>
                        <el-select
                            v-if="item.mode === 9"
                            v-model="item.attrValue"
                            multiple
                            :class="{ 'w-50': item.isUnit }"
                            :rules="item.isRequired ? rulesCommon.required : ''"
                            :placeholder="$t('pleaseSelect')"
                        >
                            <el-option v-for="value in item.paramValueArr" :key="value" :label="value" :value="value"> </el-option>
                        </el-select>

                        <!-- 单位 -->
                        <el-select v-if="item.isUnit" v-model="item.unit" :placeholder="$t('pleaseSelect')" class="w-50 pl-15">
                            <el-option v-for="value in item.paramValueArr" :key="value" :label="value" :value="value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>

        <div class="flex hcenter vcenter mt-25">
            <!-- 从草稿箱进来的||编辑（非发布新品时） -->
            <el-button v-if="isDraft || isEdit" @click="$emit('update:visible', false)">
                {{ $t("cancel") }}
            </el-button>

            <!-- 从草稿箱进来的||非编辑（发布新品时）才能保存草稿 -->
            <el-button v-if="isDraft || isEdit == false" @click="handleSubmit(1)" type="primary">
                {{ $t("releaseGoods.saveDraft") }}
            </el-button>
            <el-button @click="handleSubmit(0)" type="primary">
                {{ $t("releaseGoods.submitUpload") }}
            </el-button>
        </div>
    </div>

    <!-- 销售规格-批量修改重量/体积 -->
    <EditWeightVolume v-if="batchWeightVisible" v-model:visible="batchWeightVisible" :row="batchWeightRow" :type="batchWeightType" @change="batchWeightChange" :title="batchWeightTitle" />
</template>

<script>
import { ref, reactive, getCurrentInstance, watch, computed } from "vue";
import {
    listGoodsSpecModelByCategoryId,
    getDictsByTypes,
    brandListCanUse,
    baseAreaFindByParentId,
    findFreightTemplateList,
    categoryGetServiceConfig,
    mmsGoodsAttributeListGoodsAttributeByCategoryId,
    goodsSellerAdd,
    isRightful,
    goodsSellerGetExamine,
    goodSellerUpdateById,
    draftsUpdateGoodsInfoById,
    categoryGetPath,
    tree
} from "@/api/goods";
import { deepClone } from "@/utils/index";

import Tinymce from "@/components/Tinymce";
import EditWeightVolume from "./component/editWeightVolume";
import EditCategory from "./component/editCategory";
import { ElMessageBox, ElMessage } from "element-plus";
export default {
    name: "goodsInfoDetailEdit",
    components: { Tinymce, EditWeightVolume, EditCategory },
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        const isEdit = props.row.goodId ? true : false; //编辑or发布新品
        const isGoodsList = props.row.isGoodsList ? true : false; //是否从商品列表进来的
        const isDraft = props.row.isDraft ? true : false; //是否从草稿箱进来的

        let activeName = ref("title1");

        let categoryOption = reactive({
            id: props.row.categoryId //分类id
        });
        //修改分类
        const onChangeCategory = (val) => {
            categoryOption.id = val.id;
        };

        // 分类树形数据
        let treeCategoryOptions = ref([]);
        const categoryTree = () => {
            let data = { keyword: "", status: 1 };
            tree(data)
                .then((res) => {
                    treeCategoryOptions.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        categoryTree();

        //监听修改分类
        watch(
            () => categoryOption.id,
            (nVal) => {
                getListGoodsSpec(); //获取商品规格
                getMmsGoodsAttributeListGoodsAttributeByCategoryId(); //获取更多信息
                getCategoryGetPath(); //分类路径

                getFindFreightTemplateList(); //运费模板

                formPane6.servicesSelected = []; //清空选中售后服务承诺，下面会重新设置必选的
                getCategoryGetServiceConfig(); //售后服务承诺
            }
        );

        // 监听语言
        const lang = computed(() => proxy.$store.state.app.lang);
        watch(lang, (nVal) => {
            getDictsList();
        });

        let specTableListTmp = [];
        const getData = (id) => {
            return new Promise(function(reslove, reject) {
                const loading = proxy.$loading();
                goodsSellerGetExamine(id)
                    .then((res) => {
                        let data = res.data;
                        formPane1.goodTitle = data.goodTitle;
                        formPane1.goodCode = data.goodCode;
                        formPane1.brandId = data.brandId;

                        formPane1.mainPictureUrl = data.mainPictureUrl;
                        formPane1.videoUrl = data.videoUrl;

                        specOptionList.value = deepClone(data.specs);
                        specColumnList.value = specOptionList.value;

                        specDataList.form = data.specs;

                        //从商品列表进来的 禁用规格属性
                        if (isGoodsList) {
                            data.specs.forEach((item) => {
                                item.specValues.forEach((itemValues) => {
                                    itemValues.isDisabled = true;
                                });
                            });
                        }

                        specTableList.form = data.skus;
                        specTableListTmp = deepClone(data.skus);
                        //data.specs

                        formPane3.description = data.description;

                        formPane4.isCharge = data.isCharge;
                        formPane4.isContainsPowder = data.isContainsPowder;
                        formPane4.isFluid = data.isFluid;
                        formPane4.isHazardousArticle = data.isHazardousArticle;
                        formPane4.isPorceLain = data.isPorcelain;
                        formPane4.maxBuy = data.maxBuy;
                        formPane4.countryId = data.countryId;

                        formPane5.keyword = data.keyword;
                        formPane5.specialPurpose = data.specialPurpose;
                        formPane5.forPeople = data.forPeople;

                        formPane6.goodsType = data.goodsType + "";
                        formPane6.deliveryType = data.deliveryType + "";
                        formPane6.isOpenPresell = data.isOpenPresell + "";
                        formPane6.promisedDeliveryTime = data.promisedDeliveryTime;
                        formPane6.stockDeductType = data.stockDeductType;
                        formPane6.isCashDelivery = data.isCashDelivery;
                        // deliveryType =1FBM 2FBT
                        if (data.deliveryType == 1) {
                            formPane6.isCashDelivery = 0; //货到付款 0不支持 1支持
                        }
                        formPane6.transportMode = data.transportMode.split(",").map((item) => Number(item)); //运输方式选中 转成数组才能选中

                        let servicesTmp = [];
                        data.services.forEach((item) => {
                            if (item.isRequired == 1) servicesTmp.push(item.id);
                        });
                        formPane6.servicesSelected = servicesTmp;

                        formPane7.attrs.forEach((item) => {
                            data.attrs.forEach((aitem) => {
                                if (item.modelAttrId === aitem.modelAttrId) {
                                    item.id = aitem.id;
                                    item.attrValue = item.mode === 9 ? aitem.attrValue.split(",") : aitem.attrValue;
                                }
                            });
                        });

                        formPane1.carouselMapUrls = res.data.carouselMapUrls.map((item) => {
                            item.url = item.imgUrl;
                            return item;
                        });

                        formPane3.detailsPics = data.detailsPics.map((item) => {
                            item.url = item.imgUrl;
                            return item;
                        });
                        loading.close();
                        reslove();
                    })
                    .catch((err) => {
                        loading.close();
                        reject(err);
                    });
            });
        };

        //获取数据字典
        let dictsList = ref([]);
        const getDictsList = () => {
            //适用人群/承诺发货时间/配送类型/商品类型
            getDictsByTypes("intended_for,promised_delivery_time,distribution_type,product_type")
                .then((res) => {
                    dictsList.value = res.data;
                })
                .catch((err) => {});
        };
        getDictsList();

        //获取品牌列表
        let brandList = ref([]);
        function getBrandListCanUse() {
            brandListCanUse()
                .then((res) => {
                    brandList.value = res.data;
                    const brandIds = res.data.map((item) => item.id);
                    if (brandIds.indexOf(formPane1.brandId) === -1) {
                        formPane1.brandId = "";
                    }
                })
                .catch((err) => {});
        }

        //获取原产国/地区列表
        let countryList = ref([]);
        const getBaseAreaFindByParentId = () => {
            baseAreaFindByParentId()
                .then((res) => {
                    countryList.value = res.data;
                })
                .catch((err) => {});
        };
        getBaseAreaFindByParentId();

        const internationalCode = (rule, value, callback) => {
            if (value.length > 0 && value.length !== 13) {
                callback(new Error(proxy.$t("releaseGoods.internationalCode13")));
            } else {
                callback();
            }
        };

        const rulesCommon = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "change" },
            isSelect: { required: true, message: proxy.$t("pleaseEnter"), trigger: "change" },
            requiredinternationalCode: { validator: internationalCode, trigger: "blur" }
        });

        const checkisRightful = () => {
            if (formPane1.goodTitle === "") {
                proxy.$message.error(proxy.$t("pleaseEnter"));
                return;
            }
            isRightful({ content: formPane1.goodTitle })
                .then((res) => {
                    proxy.$message.success(proxy.$t(res.msg));
                })
                .catch((err) => {});
        };

        //------------------------------基本信息---------------------------

        let formPane1Ref = ref(null);
        const formPane1 = reactive({
            goodTitle: "",
            goodCode: "",
            brandId: "",
            videoUrl: "",
            carouselMapUrls: [], //轮播图
            mainPictureUrl: "" //主图
        });
        const rulePane1 = {
            goodTitle: [{ required: true, message: proxy.$t("required"), trigger: "blur" }],
            brandId: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            // videoUrl: [{ required: true, message: proxy.$t('pleaseSelect'), trigger: "change" }],
            carouselMapUrls: [
                {
                    type: "array",
                    required: true,
                    message: proxy.$t("pleaseSelect"),
                    trigger: "change"
                }
            ]
        };
        //上传视频
        const onChangeUploadVideo = (url) => {
            formPane1.videoUrl = url;
        };
        //上传轮播图
        const onChangeUploadCarousel = (fileList) => {
            //设置主图
            if (fileList.mainPicture) {
                formPane1.mainPictureUrl = fileList.mainPicture;
                return;
            }
            formPane1.carouselMapUrls = fileList; //.map((item) => item.url);
        };

        //-----------------------------销售规格-----------------------------

        let specOptionList = ref([]); //规格选项下拉
        let specDataList = reactive({
            form: [] //规格表单集合
        });
        //默认规格
        const specValues = {
            isCustom: true, //是否自定义
            isChecked: 1, //是否选中
            cnName: "",
            enName: "",
            id: "",
            picture: "",
            remarks: "",
            sort: 0,
            specId: "",
            isDisabled: false // 是否禁用
        };
        const specDefault = {
            id: "",
            cnSpecName: "",
            enSpecName: "",
            isEdit: 1,
            isPicture: 1, //是否允许添加图片
            isPictureUpload: 0, //卖家是否必传图片
            isSellerUploadPicture: 1, //卖家是否可更换图片
            remarks: "",
            sort: 0,
            specValues: [deepClone(specValues)]
        };
        //获取商品规格
        function getListGoodsSpec() {
            //从商品列表进来的编辑 属性规格是不能动的
            if (isGoodsList) {
                return;
            }
            const loading = proxy.$loading();
            listGoodsSpecModelByCategoryId({ categoryId: categoryOption.id })
                .then((res) => {
                    specTableList.form = []; //商品规格SKU table数据
                    //批量设置头部 置为空
                    tableType.skuCode = "";
                    tableType.internationalCode = "";
                    tableType.stockNum = "";
                    tableType.price = "";

                    specDataList.form = [deepClone(specDefault)]; //商品规格 默认为空
                    if (res.data.length > 0) {
                        const data = res.data.map((item) => {
                            item.isPictureUpload = 1; //卖家是否必传图片
                            item.specValues = item.specValues.map((item) => {
                                item.isChecked = 1;
                                return item;
                            });
                            return item;
                        });
                        specOptionList.value = data; //商品规格下拉选项
                    }
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        }

        //切换规格
        const onChangeSpec = (cnSpecName, index) => {
            let isFlag = false;
            for (let i = 0, len = specOptionList.value.length; i < len; i++) {
                if (specOptionList.value[i].cnSpecName === cnSpecName) {
                    //后台需要的数据
                    specOptionList.value[i].modelSpecId = specOptionList.value[i].id;
                    specOptionList.value[i].specValues.forEach((item) => {
                        item.modelSpecValueId = item.id;
                    });
                    specDataList.form[index] = deepClone(specOptionList.value[i]);
                    isFlag = true;
                }
            }
            //自定义标签
            if (!isFlag) {
                specDataList.form[index] = {
                    id: "",
                    cnSpecName: cnSpecName,
                    isEdit: 1,
                    isPicture: 0,
                    isPictureUpload: 1,
                    isSellerUploadPicture: 1,
                    specValues: [
                        {
                            id: "",
                            cnName: "",
                            isCustom: 1,
                            isChecked: 1
                        }
                    ]
                };
            }
        };

        //添加sku table图片
        const onChangeUploadPicture = (url, item) => {
            console.log(url, item);
            item.picture = url;
        };

        //添加规格
        const handleSpecAdd = () => {
            specDataList.form.push(deepClone(specDefault));
        };
        //删除规格
        const handleSpecDel = (index) => {
            specDataList.form.splice(index, 1);
        };

        //属性值自定义添加
        const handleSpecValueAdd = (item) => {
            item.specValues.push(deepClone(specValues));
        };
        const handleSpecValueDel = (index, specValues) => {
            specValues.splice(index, 1);
        };

        // 计算每个sku后面有多少项
        function getLevels(tree) {
            let level = [];
            for (let i = tree.length - 1; i >= 0; i--) {
                if (tree[i + 1] && tree[i + 1].specValues) {
                    level[i] = tree[i + 1].specValues.length * level[i + 1] || 1;
                } else {
                    level[i] = 1;
                }
            }
            return level;
        }
        /**
         * 笛卡尔积运算
         * @param  {[type]} tree   当前选中规格的value
         * @param  {Array}  stocks 当前已存在的数据
         * @return {[type]}        可配置参数
         */
        function flatten(tree, stocks = [], options) {
            let { specName = "cnSpecName", specValueName = "cnName", specValueRemarks = "remarks" } = options || {};
            let result = [];
            let skuLen = 0;
            let stockMap = {}; // 记录已存在的stock的数据
            const level = getLevels(tree);
            if (tree.length === 0) return result;
            tree.forEach((sku) => {
                const { specValues } = sku;
                if (!specValues || specValues.length === 0) return true;
                skuLen = (skuLen || 1) * specValues.length;
            });
            // 根据已有的stocks生成一个map
            stocks.forEach((stock) => {
                let { goodsSkuSaleAttrValue, ...attr } = stock;
                stockMap[goodsSkuSaleAttrValue.map((item) => `${item.k_id}_${item.v_id}`).join("|")] = attr;
            });
            for (let i = 0; i < skuLen; i++) {
                let goodsSkuSaleAttrValue = [];
                let mapKey = [];
                tree.forEach((sku, column) => {
                    const { specValues } = sku;
                    let item = {};
                    if (!specValues || specValues.length === 0) return true;
                    if (specValues.length > 1) {
                        let row = parseInt(i / level[column], 10) % specValues.length;
                        item = tree[column].specValues[row];
                    } else {
                        item = tree[column].specValues[0];
                    }
                    if (!sku[specName] || !item[specValueName]) return;
                    mapKey.push(`${sku[specName]}_${item[specValueName]}`);
                    goodsSkuSaleAttrValue.push({
                        attrId: "",
                        attrName: sku[specName],
                        attrValueId: "",
                        attrValue: item[specValueName],
                        picture: item.picture,
                        id: "",
                        skuId: ""
                    });
                });
                let { ...data } = stockMap[mapKey.join("|")] || {};
                // 从map中找出存在的sku并保留其值
                // console.log("data", data, goodsSkuSaleAttrValue);
                result.push({ ...data, goodsSkuSaleAttrValue });
            }
            return result;
        }

        //SKU添加
        let specForm = ref(null);
        let formPane2Ref = ref(null);
        let specTableList = reactive({ form: [] });
        let specColumnList = ref([]);
        const handleSKUAdd = () => {
            specForm.value.validate((valid) => {
                if (valid) {
                    if (specDataList.form.length === 0) {
                        return;
                    }

                    let specData = deepClone(specDataList.form);

                    //同个规格属性值不同重复
                    for (let i = 0; i < specData.length; i++) {
                        const cnName = specData[i].specValues.map((item) => item.cnName);
                        var nary = cnName.sort();
                        for (let j = 0; j < cnName.length; j++) {
                            if (nary[j] == nary[j + 1]) {
                                proxy.$message.error(proxy.$t("releaseGoods.repeatValue", { name: specData[i].cnSpecName, value: nary[j] })); //[{name}]规格中，{value}属性值重复
                                return;
                            }
                        }
                    }

                    //过滤未选中的
                    specData = specData.map((item) => {
                        item.specValues = item.specValues.filter((item) => {
                            return item.isChecked;
                        });
                        return item;
                    });

                    //判断 每个规格是否添加了属性自定义
                    for (let i in specData) {
                        if (specData[i].specValues.length === 0) {
                            proxy.$message.error(proxy.$t("releaseGoods.pleaseSpecAttr")); //请添加规格的属性
                            return;
                        }
                    }

                    //判断添加图片，只需要校验第一个规格的属性值是否必传图片
                    if (specData[0].isPictureUpload === 1) {
                        for (let j = 0; j < specData[0].specValues.length; j++) {
                            if (!specData[0].specValues[j].picture) {
                                proxy.$message.error(proxy.$t("releaseGoods.pleaseUpload1", { name: specData[0].cnSpecName })); //请上传规格的图片
                                return;
                            }
                        }
                    }

                    //添加后禁用所有属性值 从商品列表进来的
                    if (isGoodsList) {
                        specDataList.form.forEach((item) => {
                            item.specValues.forEach((itemValues) => {
                                itemValues.isDisabled = true;
                            });
                        });
                    }

                    //动态规格列
                    specColumnList.value = deepClone(specData);
                    //table数据
                    specTableList.form = flatten(specData).map((item) => {
                        let tmp = {
                            cleanVolumeHeight: 0,
                            cleanVolumeLength: 0,
                            cleanVolumeUnit: "cm",
                            cleanVolumeWidth: 0,
                            cleanWeight: 0,
                            cleanWeightUnit: "kg",
                            id: "",
                            internationalCode: "",
                            packingVolumeHeight: 0,
                            packingVolumeLength: 0,
                            packingVolumeUnit: "cm",
                            packingVolumeWidth: 0,
                            packingWeight: 0,
                            packingWeightUnit: "kg",
                            picture: "",
                            price: "",
                            sendVolumeHeight: 0,
                            sendVolumeLength: 0,
                            sendVolumeUnit: "cm",
                            sendVolumeWidth: 0,
                            sendWeight: 0,
                            sendWeightUnit: "kg",
                            skuCode: "",
                            stockNum: "",
                            type: 1
                        };
                        if (isEdit) {
                            specTableListTmp.forEach((sitem) => {
                                const attr1 = sitem.goodsSkuSaleAttrValue.map((item) => item.attrValue);
                                const attr2 = item.goodsSkuSaleAttrValue.map((item) => item.attrValue);
                                if (JSON.stringify(attr1) === JSON.stringify(attr2)) {
                                    tmp = sitem;
                                }
                            });
                        }

                        return {
                            ...item,
                            ...tmp
                        };
                    });
                } else {
                    ElMessageBox.alert(proxy.$t("releaseGoods.skuAddTips"), proxy.$t("depositDetail.importantNote"), {
                        confirmButtonText: "OK"
                    });
                    return false;
                }
            });
        };

        const getSpecAttr = (specIndex, index) => {
            //if (isEdit) {
            if (index < 0) return "";
            return specTableList.form[index].goodsSkuSaleAttrValue[specIndex].attrValue;
            //}

            // // 获取当前规格项目下的属性值
            // const currentValues = specColumnList.value[specIndex].specValues.filter((item) => item.isChecked == 1);
            // let indexCopy;
            // // 判断是否是最后一个规格项目
            // if (specColumnList.value[specIndex + 1] && specColumnList.value[specIndex + 1].specValues.length) {
            //     indexCopy = index / countSum(specIndex + 1);
            // } else {
            //     indexCopy = index;
            // }
            // const i = Math.floor(indexCopy % currentValues.length);
            // if (i.toString() !== "NaN") {
            //     console.log("currentValues[i]", currentValues[i]);
            //     return currentValues[i].cnName;
            //     return {
            //         ...currentValues[i],
            //         cnName: currentValues[i].cnName
            //     };
            // } else {
            //     return {};
            // }
        };

        // 计算规格的乘积
        const countSum = (index) => {
            let num = 1;
            specDataList.form.forEach((item, j) => {
                if (j >= index && item.specValues.length) {
                    num *= item.specValues.length;
                }
            });
            return num;
        };

        //上传图片
        const onChangeUpload = (url, itemSpec) => {
            itemSpec.picture = url;
        };
        const handleChangeUpload = (val) => {
            if (val === true) {
                // proxy.$message.error("111");
            }
        };

        //批量修改
        let tableType = reactive({
            skuCode: "",
            internationalCode: "",
            stockNum: "",
            price: "",
            type: 1 //1全新  2二手
        });
        //批量修改Blur触发
        const onBlurSpec = (e, type) => {
            if (type == "internationalCode") {
                if (e.target.value.length != 13) {
                    proxy.$message.error(proxy.$t("releaseGoods.internationalCode13"));
                    return;
                }
            }

            specTableList.form.forEach((item) => {
                item[type] = e.target ? e.target.value : e;
            });
        };
        //批量修改-重量/体积
        let batchWeightVisible = ref(false);
        let batchWeightType = ref("");
        let batchWeightTitle = ref("");
        let batchWeightRow = ref({}); //单个修改
        const handleBatchWeight = (type, title, row) => {
            batchWeightType.value = type;
            batchWeightVisible.value = true;
            batchWeightTitle.value = title;

            batchWeightRow.value = row || "";
        };
        const batchWeightChange = (form, isBatch) => {
            //单个修改
            if (!isBatch) {
                batchWeightRow.value[batchWeightType.value + "WeightUnit"] = form["weightUnit"];
                batchWeightRow.value[batchWeightType.value + "Weight"] = form["weight"];
                batchWeightRow.value[batchWeightType.value + "VolumeUnit"] = form["volumeUnit"];
                batchWeightRow.value[batchWeightType.value + "VolumeLength"] = form["length"];
                batchWeightRow.value[batchWeightType.value + "VolumeWidth"] = form["width"];
                batchWeightRow.value[batchWeightType.value + "VolumeHeight"] = form["height"];
                return;
            }
            // 批量修改
            specTableList.form.forEach((item) => {
                item[batchWeightType.value + "WeightUnit"] = form["weightUnit"];
                item[batchWeightType.value + "Weight"] = form["weight"];
                item[batchWeightType.value + "VolumeUnit"] = form["volumeUnit"];
                item[batchWeightType.value + "VolumeLength"] = form["length"];
                item[batchWeightType.value + "VolumeWidth"] = form["width"];
                item[batchWeightType.value + "VolumeHeight"] = form["height"];
            });
        };

        //批量删除/恢复
        let multipleSelection = ref([]);
        const handleSelectionChange = (val) => {
            multipleSelection.value = val;
        };
        const handleSelectionDelete = () => {
            if (multipleSelection.value.length == 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            multipleSelection.value.forEach((item) => {
                item.isDelete = 1;
            });
        };
        const handleSelectionRecover = () => {
            if (multipleSelection.value.length == 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            multipleSelection.value.forEach((item) => {
                item.isDelete = 0;
            });
        };
        const tableRowClassName = ({ row, rowIndex }) => {
            if (row.isDelete === 1) {
                return "bg-light-grey";
            }
            return "";
        };

        //-----------------------------描述详情-----------------------------

        let formPane3Ref = ref(null);
        const formPane3 = reactive({
            description: "",
            detailsPics: []
        });

        function removeHTMLTag(str) {
            str = str.replace(/<\/?[^>]*>/g, "");
            str = str.replace(/[ | ]*\n/g, "\n");
            str = str.replace(/&nbsp;/gi, "");
            str = str.replace(/\s/g, "");
            return str;
        }

        watch(
            () => formPane3.description,
            (nVal) => {
                var num = removeHTMLTag(nVal);
                if (num.length > 5000) {
                    proxy.$alert(proxy.$t("releaseGoods."), proxy.$t("releaseGoods.tips"), {
                        confirmButtonText: proxy.$t("confirm"),
                        type: "warning"
                    });
                }
            }
        );

        //上传详情图 validator: checkDetailsPics
        const onChangeUploadDetailImg = (fileList) => {
            formPane3.detailsPics = fileList; // fileList.map((item) => item.url)
            console.log("formPane3.detailsPics", formPane3.detailsPics);
        };

        //------------------------------合规信息-----------------------------

        let formPane4Ref = ref(null);
        const formPane4 = reactive({
            isCharge: 0,
            isContainsPowder: 0,
            isFluid: 0,
            isHazardousArticle: 0,
            isPorcelain: 0,
            maxBuy: 0, //订单商品最大数量 (0不限购 其他数限购数量)
            countryId: "" //原产国id
        });

        //------------------------------------关键字----------------------------------

        const formPane5 = reactive({
            keyword: "",
            specialPurpose: "",
            forPeople: "1"
        });

        //------------------------------------服务与承诺----------------------------------

        let formPane6Ref = ref(null);
        //formPane6.deliveryType = props.row.deliveryType; // 服务与承诺 fbt fbm deliveryType

        const formPane6 = reactive({
            goodsType: "1", //商品类型（1 普通商品 2虚拟商品）
            deliveryType: props.row.deliveryType || "1", //配送类型  服务与承诺 1FBM类型商品 2FBT类型商品
            isOpenPresell: "0", //是否支持预售( 0否 1是)
            promisedDeliveryTime: "24", //承诺发货时间（24小时 48小时 72小时）
            stockDeductType: 1, //库存扣减类型（ 1付款减库存）
            isCashDelivery: props.row.deliveryType == 2 ? 1 : 0, //货到付款 0不支持 1支持
            transportMode: [], //运输方式（1空运 2海运 3 陆运 ）提交时多个用逗号隔开
            //shippingFeeId: [], //运费模板id 多个用逗号隔开
            servicesSelected: [], //选中的集合
            services: [] //售后服务承诺
        });

        //获取运费模板
        let freightTemplateList = ref([]);
        let freightTemplateListTmp = ref([]);
        function getFindFreightTemplateList() {
            findFreightTemplateList(formPane6.deliveryType)
                .then((res) => {
                    freightTemplateListTmp.value = res.data;
                    freightTemplateList.value = res.data;
                    formPane6.transportMode = res.data.map((item) => item.sendType); //运输方式勾选上
                })
                .catch((err) => {});
        }
        //监听勾选运输方式（1空运 2海运 3 陆运）来显示对应的运费模板
        watch(
            () => formPane6.transportMode,
            () => {
                freightTemplateList.value = freightTemplateListTmp.value.filter((item) => {
                    return formPane6.transportMode.includes(item.sendType);
                });
            }
        );
        //获取服务承诺
        function getCategoryGetServiceConfig() {
            categoryGetServiceConfig({
                categoryId: categoryOption.id,
                deliveryType: formPane6.deliveryType
            })
                .then((res) => {
                    formPane6.services = res.data.configs || [];

                    //服务承诺是和 【分类、配送类型】 挂钩的，servicesSelected.length!=0说明编辑设置了就不要去覆盖掉了
                    if (formPane6.servicesSelected && formPane6.servicesSelected.length === 0) {
                        let servicesTmp = [];
                        res.data.configs.forEach((item) => {
                            if (item.value == 1) servicesTmp.push(item.id); //value=1是必填
                        });
                        formPane6.servicesSelected = servicesTmp;
                    }
                })
                .catch((err) => {});
        }

        //切换配送类型
        const deliveryChange = (val) => {
            // 1FBM 2FBT
            if (val == 1) {
                formPane6.isCashDelivery = 0; //货到付款 0不支持 1支持
            } else {
                formPane6.isCashDelivery = 1; //货到付款 0不支持 1支持
            }
            getFindFreightTemplateList();

            formPane6.servicesSelected = []; //清空选中售后服务承诺，下面会重新设置必选的
            getCategoryGetServiceConfig(); //售后服务承诺
        };

        const rulePane6 = reactive({
            goodsType: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            deliveryType: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            isOpenPresell: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            promisedDeliveryTime: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            stockDeductType: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            isCashDelivery: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "change" }],
            transportMode: [
                {
                    type: "array",
                    required: true,
                    message: proxy.$t("pleaseSelect"),
                    trigger: "change"
                }
            ]
        });

        //------------------------------------更多信息----------------------------------

        let formPane7 = reactive({
            attrs: []
        });
        let formPane7Ref = ref(null);
        function getMmsGoodsAttributeListGoodsAttributeByCategoryId() {
            mmsGoodsAttributeListGoodsAttributeByCategoryId({ categoryId: categoryOption.id })
                .then((res) => {
                    formPane7.attrs = res.data.map((item) => {
                        let paramValueArr = [];
                        if (item.paramValue) {
                            paramValueArr = item.paramValue.split(",");
                        }
                        item = {
                            ...item,
                            attrName: item.title, //属性名
                            attrValue: "", //属性值
                            paramValueArr: paramValueArr, //单位或值 的选项
                            id: "",
                            modelAttrId: item.id, //商品参数模板id
                            unit: item.paramValue ? item.paramValue.split(",")[0] : "" //单位
                        };
                        return item;
                    });
                })
                .catch((err) => {});
        }

        //获取分类路径、抽佣比例
        function getCategoryGetPath() {
            categoryGetPath(categoryOption.id)
                .then((res) => {
                    categoryOption.lable = res.data.map((item) => item.cnName).join(">");
                    categoryOption.percentage = res.data[res.data.length - 1].commissionPercentage;
                })
                .catch((err) => {});
        }

        //初始化
        const AsyncList = () => {
            const id = props.row.goodId;
            getListGoodsSpec(); //获取商品规格
            getMmsGoodsAttributeListGoodsAttributeByCategoryId(); //获取更多信息
            getCategoryGetPath(); //分类路径

            //编辑
            if (id) {
                getData(id).then(() => {
                    getBrandListCanUse(); //品牌列表
                    getFindFreightTemplateList(); //运费模板
                    getCategoryGetServiceConfig(); //服务承诺
                });
                return;
            }

            //新增 发布新商品
            getBrandListCanUse(); //品牌列表
            getFindFreightTemplateList(); //运费模板
            getCategoryGetServiceConfig(); //服务承诺
        };
        AsyncList();

        //提交校验
        let formPaneErr = reactive({
            pane1: false,
            pane2: false,
            pane3: false,
            pane4: false,
            pane5: false,
            pane6: false,
            pane7: false
        });
        const formPane1Submit = () => {
            return new Promise((resolve, reject) => {
                formPane1Ref.value.validate((valid) => {
                    if (valid) {
                        formPaneErr.pane1 = false;
                        resolve(true);
                    } else {
                        formPaneErr.pane1 = true;
                        resolve(false);
                    }
                });
            });
        };
        const formPane2Submit = (specTableSkus) => {
            return new Promise((resolve, reject) => {
                if (specTableSkus.length === 0) {
                    ElMessageBox.alert(proxy.$t("releaseGoods.skuAddTips"), proxy.$t("depositDetail.importantNote"), {
                        confirmButtonText: "OK"
                    });
                    proxy.$message.error(proxy.$t("releaseGoods.pleaseAddSku"));
                    formPaneErr.pane2 = true;
                    return resolve(false);
                }
                formPane2Ref.value.validate((valid) => {
                    if (valid) {
                        formPaneErr.pane2 = false;
                        resolve(true);
                    } else {
                        formPaneErr.pane2 = true;
                        resolve(false);
                    }
                });
            });
        };
        const formPane4Submit = () => {
            return new Promise((resolve, reject) => {
                formPane4Ref.value.validate((valid) => {
                    if (valid) {
                        formPaneErr.pane4 = false;
                        resolve(true);
                    } else {
                        formPaneErr.pane4 = true;
                        resolve(false);
                    }
                });
            });
        };
        const formPane6Submit = () => {
            return new Promise((resolve, reject) => {
                formPane6Ref.value.validate((valid) => {
                    if (valid) {
                        formPaneErr.pane6 = false;
                        resolve(true);
                    } else {
                        formPaneErr.pane6 = true;
                        resolve(false);
                    }
                });
            });
        };
        const formPane7Submit = () => {
            return new Promise((resolve, reject) => {
                formPane7Ref.value.validate((valid) => {
                    if (valid) {
                        formPaneErr.pane7 = false;
                        resolve(true);
                    } else {
                        formPaneErr.pane7 = true;
                        resolve(false);
                    }
                });
            });
        };
        //提交并上架
        const handleSubmit = async (val) => {
            try {
                let hasErr = false;
                if (!(await formPane1Submit())) {
                    activeName.value = "title1";
                    hasErr = true;
                }
                const specTableSkus = specTableList.form.filter((item) => item.isDelete != 1); //过滤删除的skus
                if (!(await formPane2Submit(specTableSkus))) {
                    if (!hasErr) activeName.value = "title2";
                    hasErr = true;
                }
                if (!(await formPane4Submit())) {
                    if (!hasErr) activeName.value = "title4";
                    hasErr = true;
                }
                if (!(await formPane6Submit())) {
                    if (!hasErr) activeName.value = "title6";
                    hasErr = true;
                }
                if (!(await formPane7Submit())) {
                    if (!hasErr) activeName.value = "title7";
                    hasErr = true;
                }

                let carouselMapUrls = formPane1.carouselMapUrls.map((item) => item.url); //轮播图

                formPane7.attrs.forEach((item) => {
                    if (item.mode === 9) {
                        item.attrValue = item.attrValue && item.attrValue.join(",");
                    }
                });

                //售后服务承诺 选中的把isRequired设置为1
                formPane6.services.forEach((item) => {
                    if (formPane6.servicesSelected.includes(item.id)) {
                        item.isRequired = 1;
                    } else {
                        item.isRequired = 0;
                    }
                    item.ruleId = item.id;
                    item.title = item.configTitle;
                });

                const detailsPics = formPane3.detailsPics.map((item) => item.url); //详情图

                const form = {
                    id: props.row.goodId || "",
                    categoryId: categoryOption.id,
                    ...formPane1,
                    carouselMapUrls: carouselMapUrls,
                    mainPictureUrl: formPane1.mainPictureUrl || (formPane1.carouselMapUrls.length && formPane1.carouselMapUrls[0].url) || "",
                    specs: specDataList.form,
                    skus: specTableSkus,
                    ...formPane3,
                    detailsPics,
                    ...formPane4,
                    ...formPane5,
                    ...formPane6,
                    shippingFeeId: freightTemplateList.value.map((item) => item.id).join(","),
                    transportMode: formPane6.transportMode.join(","),
                    attrs: [...formPane7.attrs],
                    isDraft: val
                };
                console.log("form", form);
                if (hasErr) {
                    return;
                }

                const loading = proxy.$loading();
                if (isEdit) {
                    let api = goodSellerUpdateById;
                    if (isDraft) {
                        api = draftsUpdateGoodsInfoById;
                    }
                    api(form)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            emit("reloadData");
                            emit("update:visible", false);
                            loading.close();
                        })
                        .catch((err) => {
                            loading.close();
                        });
                } else {
                    goodsSellerAdd(form)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            emit("reloadData");
                            emit("update:visible", false);
                            loading.close();
                        })
                        .catch((err) => {
                            loading.close();
                        });
                }
            } catch (error) {
                console.log("error", error);
                loading && loading.close();
            }
        };

        return {
            isEdit,
            isDraft,
            isGoodsList,

            activeName,
            rulesCommon,

            categoryOption,
            onChangeCategory,
            treeCategoryOptions,

            dictsList,
            brandList,
            countryList,
            formPane1Ref,
            formPane1,
            rulePane1,
            onChangeUploadVideo,
            onChangeUploadCarousel,

            specOptionList,
            specDataList,
            onChangeUploadPicture,
            handleSpecAdd,
            handleSpecDel,
            onChangeSpec,
            handleSpecValueAdd,
            handleSpecValueDel,
            handleSKUAdd,
            specForm,
            formPane2Ref,
            specTableList,
            specColumnList,
            getSpecAttr,
            onChangeUpload,
            handleChangeUpload,
            tableType,
            onBlurSpec,
            handleBatchWeight,
            batchWeightVisible,
            batchWeightRow,
            batchWeightType,
            batchWeightTitle,
            batchWeightChange,
            multipleSelection,
            handleSelectionChange,
            handleSelectionDelete,
            handleSelectionRecover,
            tableRowClassName,

            formPane3Ref,
            formPane3,
            onChangeUploadDetailImg,

            formPane4Ref,
            formPane4,

            formPane5,

            formPane6Ref,
            formPane6,
            rulePane6,
            freightTemplateListTmp,
            freightTemplateList,

            formPane7,
            formPane7Ref,

            formPaneErr,
            handleSubmit,

            checkisRightful,
            deliveryChange
        };
    }
};
</script>

<style lang="scss" scoped>
.sell {
    .title {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
    .avatar-uploader {
        height: 33px;
    }

    ::v-deep(.avatar-uploader .el-upload) {
        border: 1px solid #cccccc;
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .items_1 {
        flex-wrap: wrap;
    }
}
.pane-4 {
    .name {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
}
.pane-6 {
    .tips {
        // height: 48px;
        background: #fafafa;
        padding: 17px 11px 15px 18px;
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        line-height: 17px;
    }

    .orange {
        color: #ff8248;
    }

    .serve-title {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
    .serve-item {
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
        height: 31px;
        line-height: 31px;
        padding: 0px 15px 0px 15px;
        border: 1px solid #e8e8e8;
        border-radius: 2px;
    }
}
.pane-7 {
    .title-name {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
}

.editor-content {
    margin-top: 20px;
}
::v-deep(.avatar-uploader-icon_2) {
    font-size: 12px;
    color: #cccccc;
    width: 31px;
    height: 31px;
    line-height: 31px;
}
.avatar_2 {
    width: 31px;
    height: 31px;
    display: block;
}

.spec-form {
    ::v-deep(.el-form-item) {
        width: 100%;
        margin-bottom: 0;
    }
    ::v-deep(.el-form-item__content) {
        line-height: 1;
    }
}
.spec-table-form {
    ::v-deep(.el-form-item) {
        width: 100%;
        margin-bottom: 0;
        .el-form-item__error {
            display: none;
        }
    }
}
.rejectTips {
    min-width: 200px;
    background-color: #fffbe6;
    border: 1px solid #ffe58f;
    padding: 1px;
    border-radius: 5px;
}
.el-button--warning {
    border-color: #ffe58f;
    color: #fafafa;
}
</style>
