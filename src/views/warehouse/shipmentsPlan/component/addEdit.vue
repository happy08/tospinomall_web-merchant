<template>
    <BmDialog
        v-model:visible="visible"
        :title="updateType === 'add' ? $t('warehouse.add') : $t('warehouse.edit')"
        width="89%"
        top="5vh"
        @close="cancel"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <BmAlert :title="$t('warehouse.alert2')" icon="warning" class="mb-20" />

        <el-form ref="formRef" :model="form" :inline="true" label-width="auto">
            <el-row>
                <el-col :span="12">
                    <!-- 包装类型 -->
                    <el-form-item :label="$t('warehouse.boxType')" prop="boxType" :rules="rulesCommon.isSelect" class="mb-0">
                        <!-- 0开启混装 1关闭 -->
                        <el-radio-group v-model="form.boxType" @change="onChangeBoxType">
                            <el-radio :label="0">{{ $t("warehouse.standardType") }} </el-radio>
                            <el-radio :label="1" v-if="boxLimit.open_mixed_set_value == 0">{{ $t("warehouse.mixedType") }} </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- 头程物流 -->
                    <el-form-item :label="$t('warehouse.logistics')" prop="firstExpress" :rules="rulesCommon.chooselogistics" class="ml-30 mb-0">
                        <el-radio-group v-model="form.firstExpress">
                            <el-radio label="0">{{ $t("warehouse.tospinoLogistics") }} </el-radio>
                            <el-radio label="1">{{ $t("warehouse.TPL") }} </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- 卖家地址 -->
                    <el-form-item :label="$t('warehouse.shipAddress')" prop="deliveryAddress" :rules="rulesCommon.selectAddress" class="w-100">
                        <div>
                            {{ form.deliveryAddress }}
                            <el-button @click="handleChangeSellerAddress" type="text" class="m-0">
                                {{ form.deliveryAddress === "" ? $t("warehouse.selectAddress") : $t("warehouse.modifyAddress") }}
                            </el-button>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col v-if="form.receiveWareAddress" :span="12">
                    <el-form-item :label="$t('warehouse.warehouseAddress')" prop="receiveWareAddress" :rules="rulesCommon.isSelect" class="ml-30">
                        {{ form.receiveWareAddress }}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 混装类型 -->
        <div v-for="(tableData, tbIndex) in tableDataMixed" :key="tbIndex">
            <el-form :ref="setTableDataMixedRef" :model="tableData" :inline="true">
                <div class="mb-0 p-10 border bg-light-grey">
                    <div class="fl mt-10">{{ $t("warehouse.mixedType") }}{{ tbIndex + 1 }}~BOX~{{ tableData.deliveryBoxnum || 0 }}</div>
                    <div class="fl ml-20">
                        <!-- 装箱毛重 -->
                        <el-form-item prop="boxWeightUnit" :rules="rulesCommon.noMessage" class="mb-0 mr-0">
                            <template #label>
                                {{ $t("warehouse.grossWeight") }}({{ $t("warehouse.limit") }}
                                <span class="orange">{{ boxLimit.weight_limit_value }}</span>
                                ):
                                <el-select v-model="tableData.boxWeightUnit" class="w-70" :key="`boxWeightUnit${tbIndex}`">
                                    <el-option label="kg" value="kg"></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item prop="boxWeight" :rules="rulesCommon.noMessage" class="mb-0">
                            <el-input
                                v-model="tableData.boxWeight"
                                oninput="value=value.replace(/[^\d^\.]/g,'')"
                                maxlength="8"
                                @change="onChangeLimitBoxWeight($event, tableData)"
                                :placeholder="$t('warehouse.grossWeight')"
                                style="width:80px"
                                :key="`boxWeight${tbIndex}`"
                            >
                            </el-input>
                        </el-form-item>
                        <!-- 装箱尺寸 -->
                        <el-form-item prop="boxSizeUnit" :rules="rulesCommon.noMessage" class="mb-0 ml-20 mr-0">
                            <template #label>
                                {{ $t("warehouse.measurement") }}({{ $t("warehouse.limit") }}
                                <span class="orange">{{ boxLimit.size_limit_length }}* {{ boxLimit.size_limit_wide }}* {{ boxLimit.size_limit_high }} </span>):
                                <el-select v-model="tableData.boxSizeUnit" class="w-70" :key="`boxSizeUnit${tbIndex}`">
                                    <el-option label="cm" value="cm"></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item prop="boxLong" :rules="rulesCommon.noMessage" class="mb-0">
                            <el-input
                                v-model="tableData.boxLong"
                                oninput="value=value.replace(/[^\d^\.]/g,'')"
                                maxlength="8"
                                @change="onChangeLimitBoxSize($event, 'boxLong')"
                                :placeholder="$t('warehouse.long')"
                                class="w-70"
                                :key="`boxLong${tbIndex}`"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="boxWide" :rules="rulesCommon.noMessage" class="mb-0">
                            <el-input
                                v-model="tableData.boxWide"
                                oninput="value=value.replace(/[^\d^\.]/g,'')"
                                maxlength="8"
                                @change="onChangeLimitBoxSize($event, 'boxWide')"
                                :placeholder="$t('warehouse.wide')"
                                class="w-70"
                                :key="`boxWide${tbIndex}`"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="boxHigh" :rules="rulesCommon.noMessage" class="mb-0">
                            <el-input
                                v-model="tableData.boxHigh"
                                oninput="value=value.replace(/[^\d^\.]/g,'')"
                                maxlength="8"
                                @change="onChangeLimitBoxSize($event, 'boxHigh')"
                                :placeholder="$t('warehouse.high')"
                                class="w-70"
                                :key="`boxHigh${tbIndex}`"
                            >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="fr flex vcenter">
                        <!-- 发货箱数 -->
                        <el-form-item :label="$t('warehouse.caseNumber')" prop="deliveryBoxnum" :rules="rulesCommon.noMessage" class="ml-20 mb-0">
                            <el-input v-model="tableData.deliveryBoxnum" oninput="value=value.replace(/[^0-9]/g,'')" class="w-70" :key="`deliveryBoxnum${tbIndex}`"> </el-input>
                        </el-form-item>
                        <!-- 添加商品 -->
                        <el-button @click="handleAddGoods(tbIndex, 'tableDataMixed')" type="primary" icon="el-icon-plus" plain>
                            {{ $t("warehouse.addGoods") }}
                        </el-button>
                        <!-- 删除 -->
                        <el-button @click="handleDelGoodsMixed(tbIndex)" type="text" class="plr-20">
                            {{ $t("warehouse.delete") }}
                        </el-button>
                    </div>
                    <div class="clear"></div>
                </div>
                <BmTable ref="multipleTable" :data="tableData.backProductBoxItems" :row-class-name="tableRowClassName" class="mb-10">
                    <BmTableColumn prop="status" :label="$t('goodsListTable.status')" width="90">
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
                                {{ scope.row.backProductSkuVo.isDown == 1 ? $t("status.notSale") : $t("status.onSale") }}
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
                                （ {{ scope.row.backProductSkuVo.skuAttr && scope.row.backProductSkuVo.skuAttr.join(" / ") }} ）<br />
                                {{ $t("warehouse.sellerSKU") }}：{{ scope.row.backProductSkuVo.skuCode }} <br />
                                TSIN：{{ scope.row.backProductSkuVo.tsin }}<br />
                                FNSKU：{{ scope.row.backProductSkuVo.fnsku }}
                            </div>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn width="200">
                        <template #header>
                            <div><span class="red">*</span>{{ $t("warehouse.packingWeight") }}</div>
                            <div class="flex center">
                                <el-input
                                    oninput="value=value.replace(/[^\d^\.]/g,'')"
                                    maxlength="8"
                                    v-model="tableData.tableBatch.itemWeight"
                                    @change="onBlurBatchChange($event, 'weight', tableData)"
                                    :placeholder="$t('warehouse.packingWeight')"
                                    min="0"
                                    step="1"
                                ></el-input>
                                <el-form-item prop="productWeightUnit" :rules="rulesCommon.noMessage" class="ml-5 m-0" style="width:80%">
                                    <el-select v-model="tableData.productWeightUnit" :key="`productWeightUnit${tbIndex}`">
                                        <el-option label="kg" value="kg"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </template>
                        <template #default="scope">
                            <!-- :prop="`backProductBoxItems.${scope.$index}.weight`" -->
                            <el-form-item :rules="rulesCommon.required" class="m-0">
                                <el-input
                                    v-model="scope.row.weight"
                                    oninput="value=value.replace(/[^\d^\.]/g,'')"
                                    maxlength="8"
                                    :placeholder="$t('warehouse.packingWeight')"
                                    min="0"
                                    step="1"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </BmTableColumn>
                    <!-- 包装尺寸(长*宽*高) -->
                    <BmTableColumn width="350">
                        <template #header>
                            <div><span class="red">*</span>{{ $t("warehouse.packingSizeInfo") }}</div>
                            <div class="flex center">
                                <el-input
                                    oninput="value=value.replace(/[^\d^\.]/g,'')"
                                    maxlength="8"
                                    v-model="tableData.tableBatch.itemLong"
                                    @change="onBlurBatchChange($event, 'itemLong', tableData)"
                                    min="0"
                                    step="1"
                                    :placeholder="$t('warehouse.long')"
                                ></el-input>
                                <span class="p-5">*</span>
                                <el-input
                                    oninput="value=value.replace(/[^\d^\.]/g,'')"
                                    maxlength="8"
                                    v-model="tableData.tableBatch.itemWide"
                                    @change="onBlurBatchChange($event, 'itemWide', tableData)"
                                    min="0"
                                    step="1"
                                    :placeholder="$t('warehouse.wide')"
                                ></el-input>
                                <span class="p-5">*</span>
                                <el-input
                                    oninput="value=value.replace(/[^\d^\.]/g,'')"
                                    maxlength="8"
                                    v-model="tableData.tableBatch.itemHigh"
                                    @change="onBlurBatchChange($event, 'itemHigh', tableData)"
                                    min="0"
                                    step="1"
                                    :placeholder="$t('warehouse.high')"
                                ></el-input>
                                <el-select v-model="tableData.productSizeUnit" class="w-100 ml-5" :key="`productSizeUnit${tbIndex}`">
                                    <el-option label="cm" value="cm"></el-option>
                                </el-select>
                            </div>
                        </template>
                        <template #default="scope">
                            <div class="flex center">
                                <el-form-item :rules="rulesCommon.required" class="m-0">
                                    <el-input
                                        oninput="value=value.replace(/[^\d^\.]/g,'')"
                                        maxlength="8"
                                        v-model="scope.row.itemLong"
                                        min="0"
                                        step="1"
                                        key="itemLong"
                                        :placeholder="$t('warehouse.long')"
                                    ></el-input>
                                </el-form-item>
                                <span class="p-5">*</span>
                                <el-form-item :rules="rulesCommon.required" class="m-0">
                                    <el-input
                                        oninput="value=value.replace(/[^\d^\.]/g,'')"
                                        maxlength="8"
                                        v-model="scope.row.itemWide"
                                        min="0"
                                        step="1"
                                        key="itemWide"
                                        :placeholder="$t('warehouse.wide')"
                                    ></el-input>
                                </el-form-item>
                                <span class="p-5">*</span>
                                <el-form-item :rules="rulesCommon.required" class="m-0">
                                    <el-input
                                        oninput="value=value.replace(/[^\d^\.]/g,'')"
                                        maxlength="8"
                                        v-model="scope.row.itemHigh"
                                        min="0"
                                        step="1"
                                        key="itemHigh"
                                        :placeholder="$t('warehouse.high')"
                                    ></el-input>
                                </el-form-item>
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 发/补货数量 -->
                    <BmTableColumn width="100">
                        <template #header>
                            <div><span class="red">*</span>{{ $t("warehouse.shipmentsNum") }}</div>
                            <el-input
                                v-model="tableData.tableBatch.backNum"
                                oninput="value=value.replace(/[^0-9]/g,'')"
                                maxlength="8"
                                @change="onBlurBatchChange($event, 'backNum', tableData, 1)"
                                :placeholder="$t('warehouse.shipmentsNum')"
                                min="0"
                                step="1"
                            ></el-input>
                        </template>
                        <template #default="scope">
                            <el-form-item :rules="rulesCommon.required" class="m-0">
                                <el-input
                                    v-model="scope.row.backNum"
                                    oninput="value=value.replace(/[^0-9]/g,'')"
                                    @change="onChangeComputeDeliveryBoxnum(tableData)"
                                    :placeholder="$t('warehouse.shipmentsNum')"
                                    min="0"
                                    step="1"
                                    key="backNum"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </BmTableColumn>
                    <!-- 装箱数量 -->
                    <BmTableColumn width="100">
                        <template #header>
                            <div><span class="red">*</span>{{ $t("warehouse.packingNum") }}</div>
                            <el-input
                                v-model="tableData.tableBatch.waperBoxnum"
                                oninput="value=value.replace(/[^0-9]/g,'')"
                                maxlength="8"
                                @change="onBlurBatchChange($event, 'waperBoxnum', tableData, 1)"
                                :placeholder="$t('warehouse.packingNum')"
                                min="0"
                                step="1"
                            ></el-input>
                        </template>
                        <template #default="scope">
                            <el-form-item :rules="rulesCommon.required" class="m-0">
                                <el-input
                                    v-model="scope.row.waperBoxnum"
                                    oninput="value=value.replace(/[^0-9]/g,'')"
                                    maxlength="8"
                                    @change="onChangeComputeDeliveryBoxnum(tableData)"
                                    :placeholder="$t('warehouse.packingNum')"
                                    min="0"
                                    step="1"
                                    key="waperBoxnum"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn prop="internationalCode" :label="$t('warehouse.internationalCode')" width="150">
                        <template #default="scope">
                            {{ scope.row.backProductSkuVo.internationalCode }}
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('warehouse.validity')" width="330" align="center">
                        <template #header>
                            <div><span class="red">*</span>{{ $t("warehouse.validity") }}</div>
                            <el-date-picker
                                v-model="tableData.tableBatch.validTime"
                                @change="onBlurBatchChange($event, ['validStartTime', 'validEndTime'], tableData)"
                                type="datetimerange"
                                range-separator="~"
                                :start-placeholder="$t('startDate')"
                                :end-placeholder="$t('endDate')"
                                style="100%"
                            >
                            </el-date-picker>
                        </template>

                        <template #default="scope">
                            <!-- reqPeriodValid 0非必填 1必填 -->
                            <el-form-item v-if="scope.row.reqPeriodValid == 1" :rules="rulesCommon.required" class="mr-0 mb-0">
                                <el-date-picker v-model="scope.row.validStartTime" type="datetime" :placeholder="$t('startDate')" style="width:200px"> </el-date-picker>
                            </el-form-item>
                            <div v-if="scope.row.reqPeriodValid == 1" class="lh-1">~</div>
                            <el-form-item v-if="scope.row.reqPeriodValid == 1" :rules="rulesCommon.required" class="mr-0 mb-0">
                                <el-date-picker v-model="scope.row.validEndTime" type="datetime" :placeholder="$t('endDate')" style="width:200px"> </el-date-picker>
                            </el-form-item>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('table.operation')" width="60" fixed="right">
                        <template #default="scope">
                            <el-button v-if="scope.row.delFlag && scope.row.delFlag === 1" @click.stop="scope.row.delFlag = 0" type="text">
                                {{ $t("warehouse.recover") }}
                            </el-button>
                            <el-button v-else @click.stop="scope.row.delFlag = 1" type="text">
                                {{ $t("warehouse.delete") }}
                            </el-button>
                        </template>
                    </BmTableColumn>
                </BmTable>
            </el-form>
        </div>
        <!-- boxType=1混装类型 -->
        <div v-if="form.boxType === 1">
            <el-button @click="handleAddMixedType" type="primary" icon="el-icon-plus" plain class="w-100 mb-20">
                {{ $t("warehouse.addMixedType") }}
            </el-button>
        </div>

        <!-- 标准装箱类型 -->
        <div v-for="(tableData, tbIndex) in tableDataStandard" :key="tbIndex">
            <el-form :ref="setTableDataStandardRef" :model="tableData" :inline="true">
                <div class="mb-0 p-10 border bg-light-grey">
                    <div class="fl mt-10">{{ $t("warehouse.standardType") }}{{ tbIndex + 1 }}~BOX~{{ tableData.deliveryBoxnum || 0 }}</div>
                    <div class="fl ml-20">
                        <!-- 装箱毛重 -->
                        <el-form-item prop="boxWeightUnit" :rules="rulesCommon.noMessage" class="mb-0 mr-0">
                            <template #label>
                                {{ $t("warehouse.grossWeight") }}({{ $t("warehouse.limit") }}
                                <span class="orange">{{ boxLimit.weight_limit_value }}</span>
                                ):
                                <el-select v-model="tableData.boxWeightUnit" class="w-70" :key="`boxWeightUnit${tbIndex}`">
                                    <el-option label="kg" value="kg"></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item prop="boxWeight" :rules="rulesCommon.noMessage" class="mb-0">
                            <el-input
                                oninput="value=value.replace(/[^\d^\.]/g,'')"
                                maxlength="8"
                                v-model="tableData.boxWeight"
                                @change="onChangeLimitBoxWeight($event, tableData)"
                                :placeholder="$t('warehouse.grossWeight')"
                                style="width:80px"
                                :key="`boxWeight${tbIndex}`"
                            >
                            </el-input>
                        </el-form-item>
                        <!-- 装箱尺寸 -->
                        <el-form-item prop="boxSizeUnit" :rules="rulesCommon.noMessage" class="mb-0 ml-20 mr-0">
                            <template #label>
                                {{ $t("warehouse.measurement") }}({{ $t("warehouse.limit") }}
                                <span class="orange">{{ boxLimit.size_limit_length }}* {{ boxLimit.size_limit_wide }}* {{ boxLimit.size_limit_high }}</span
                                >):
                                <el-select v-model="tableData.boxSizeUnit" class="w-70" :key="`boxSizeUnit${tbIndex}`">
                                    <el-option label="cm" value="cm"></el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item prop="boxLong" :rules="rulesCommon.noMessage" class="mb-0">
                            <el-input
                                oninput="value=value.replace(/[^\d^\.]/g,'')"
                                maxlength="8"
                                v-model="tableData.boxLong"
                                @change="onChangeLimitBoxSize($event, 'boxLong')"
                                :placeholder="$t('warehouse.long')"
                                class="w-70"
                                :key="`boxLong${tbIndex}`"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="boxWide" :rules="rulesCommon.noMessage" class="mb-0">
                            <el-input
                                oninput="value=value.replace(/[^\d^\.]/g,'')"
                                maxlength="8"
                                v-model="tableData.boxWide"
                                @change="onChangeLimitBoxSize($event, 'boxWide')"
                                :placeholder="$t('warehouse.wide')"
                                class="w-70"
                                :key="`boxWide${tbIndex}`"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="boxHigh" :rules="rulesCommon.noMessage" class="mb-0">
                            <el-input
                                oninput="value=value.replace(/[^\d^\.]/g,'')"
                                maxlength="8"
                                v-model="tableData.boxHigh"
                                @change="onChangeLimitBoxSize($event, 'boxHigh')"
                                :placeholder="$t('warehouse.high')"
                                class="w-70"
                                :key="`boxHigh${tbIndex}`"
                            >
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="fr flex vcenter">
                        <!-- 发货箱数 -->
                        <el-form-item :label="$t('warehouse.caseNumber')" prop="deliveryBoxnum" :rules="rulesCommon.noMessage" class="ml-20 mb-0">
                            <el-input v-model="tableData.deliveryBoxnum" oninput="value=value.replace(/[^0-9]/g,'')" disabled class="w-70" :key="`deliveryBoxnum${tbIndex}`"> </el-input>
                        </el-form-item>
                        <!-- 添加商品 -->
                        <el-button @click="handleAddGoods(tbIndex, 'tableDataStandard')" type="primary" icon="el-icon-plus" plain>
                            {{ $t("warehouse.addGoods") }}
                        </el-button>
                        <!-- 删除 -->
                        <el-button @click="handleDelGoodsStandard(tbIndex)" type="text" class="plr-20">
                            {{ $t("warehouse.delete") }}
                        </el-button>
                    </div>
                    <div class="clear"></div>
                </div>
                <BmTable ref="multipleTable" :data="tableData.backProductBoxItems" :row-class-name="tableRowClassName" class="mb-10">
                    <BmTableColumn prop="status" :label="$t('goodsListTable.status')" width="95">
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
                            <!-- "下架" "上架"-->
                            <div>
                                {{ scope.row.backProductSkuVo.isDown == 1 ? $t("status.notSale") : $t("status.onSale") }}
                            </div>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('image')" width="75px">
                        <template #default="scope">
                            <BmImage :src="scope.row.picture" style="width:50px;height:50px" class="mr-10" />
                        </template>
                    </BmTableColumn>
                    <BmTableColumn :label="$t('warehouse.info')">
                        <template #default="scope">
                            <div :class="scope.row.delFlag ? 'through grey' : ''">
                                <span class="green"> {{ scope.row.goodTitle }}</span> （ {{ scope.row.backProductSkuVo.skuAttr && scope.row.backProductSkuVo.skuAttr.join(" / ") }} ）<br />
                                {{ $t("warehouse.sellerSKU") }}：{{ scope.row.backProductSkuVo.skuCode }} <br />
                                TSIN：{{ scope.row.backProductSkuVo.tsin }}<br />
                                FNSKU：{{ scope.row.backProductSkuVo.fnsku }}
                            </div>
                        </template>
                    </BmTableColumn>
                    <BmTableColumn width="200">
                        <template #header>
                            <div><span class="red">*</span>{{ $t("warehouse.packingWeight") }}</div>
                            <div class="flex center">
                                <el-input
                                    oninput="value=value.replace(/[^\d^\.]/g,'')"
                                    maxlength="8"
                                    v-model="tableData.tableBatch.itemWeight"
                                    @change="onBlurBatchChange($event, 'weight', tableData)"
                                    :placeholder="$t('warehouse.packingWeight')"
                                    min="0"
                                    step="1"
                                ></el-input>
                                <el-form-item prop="productWeightUnit" :rules="rulesCommon.noMessage" class="ml-5 m-0" style="width:80%">
                                    <el-select v-model="tableData.productWeightUnit" :key="`productWeightUnit${tbIndex}`">
                                        <el-option label="kg" value="kg"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </template>
                        <template #default="scope">
                            <!-- :prop="`backProductBoxItems.${scope.$index}.weight`" -->
                            <el-form-item :rules="rulesCommon.required" class="m-0">
                                <el-input
                                    oninput="value=value.replace(/[^\d^\.]/g,'')"
                                    maxlength="8"
                                    v-model="scope.row.weight"
                                    :placeholder="$t('warehouse.packingWeight')"
                                    min="0"
                                    step="1"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </BmTableColumn>
                    <!-- 包装尺寸(长*宽*高) -->
                    <BmTableColumn width="350">
                        <template #header>
                            <div><span class="red">*</span>{{ $t("warehouse.packingSizeInfo") }}</div>
                            <div class="flex center">
                                <el-input
                                    oninput="value=value.replace(/[^\d^\.]/g,'')"
                                    maxlength="8"
                                    v-model="tableData.tableBatch.itemLong"
                                    @change="onBlurBatchChange($event, 'itemLong', tableData)"
                                    min="0"
                                    step="1"
                                    :placeholder="$t('warehouse.long')"
                                ></el-input>
                                <span class="p-5">*</span>
                                <el-input
                                    oninput="value=value.replace(/[^\d^\.]/g,'')"
                                    maxlength="8"
                                    v-model="tableData.tableBatch.itemWide"
                                    @change="onBlurBatchChange($event, 'itemWide', tableData)"
                                    min="0"
                                    step="1"
                                    :placeholder="$t('warehouse.wide')"
                                ></el-input>
                                <span class="p-5">*</span>
                                <el-input
                                    oninput="value=value.replace(/[^\d^\.]/g,'')"
                                    maxlength="8"
                                    v-model="tableData.tableBatch.itemHigh"
                                    @change="onBlurBatchChange($event, 'itemHigh', tableData)"
                                    min="0"
                                    step="1"
                                    :placeholder="$t('warehouse.high')"
                                ></el-input>
                                <el-select v-model="tableData.productSizeUnit" class="w-100 ml-5" :key="`productSizeUnit${tbIndex}`">
                                    <el-option label="cm" value="cm"></el-option>
                                </el-select>
                            </div>
                        </template>
                        <template #default="scope">
                            <div class="flex center">
                                <el-form-item :rules="rulesCommon.required" class="m-0">
                                    <el-input
                                        oninput="value=value.replace(/[^\d^\.]/g,'')"
                                        maxlength="8"
                                        v-model="scope.row.itemLong"
                                        min="0"
                                        step="1"
                                        key="itemLong"
                                        :placeholder="$t('warehouse.long')"
                                    ></el-input>
                                </el-form-item>
                                <span class="p-5">*</span>
                                <el-form-item :rules="rulesCommon.required" class="m-0">
                                    <el-input
                                        oninput="value=value.replace(/[^\d^\.]/g,'')"
                                        maxlength="8"
                                        v-model="scope.row.itemWide"
                                        min="0"
                                        step="1"
                                        key="itemWide"
                                        :placeholder="$t('warehouse.wide')"
                                    ></el-input>
                                </el-form-item>
                                <span class="p-5">*</span>
                                <el-form-item :rules="rulesCommon.required" class="m-0">
                                    <el-input
                                        oninput="value=value.replace(/[^\d^\.]/g,'')"
                                        maxlength="8"
                                        v-model="scope.row.itemHigh"
                                        min="0"
                                        step="1"
                                        key="itemHigh"
                                        :placeholder="$t('warehouse.high')"
                                    ></el-input>
                                </el-form-item>
                            </div>
                        </template>
                    </BmTableColumn>
                    <!-- 发/补货数量 -->
                    <BmTableColumn width="100">
                        <template #header>
                            <div><span class="red">*</span>{{ $t("warehouse.shipmentsNum") }}</div>
                        </template>
                        <template #default="scope">
                            <el-form-item :rules="rulesCommon.required" class="m-0">
                                <el-input
                                    oninput="value=value.replace(/[^0-9]/g,'')"
                                    maxlength="8"
                                    v-model="scope.row.backNum"
                                    @change="
                                        (e) => {
                                            if (scope.row.waperBoxnum > 0 && e > 0) {
                                                tableData.deliveryBoxnum = Math.ceil(e / scope.row.waperBoxnum);
                                            } else {
                                                tableData.deliveryBoxnum = 0;
                                            }
                                        }
                                    "
                                    :placeholder="$t('warehouse.shipmentsNum')"
                                    min="0"
                                    step="1"
                                    key="backNum"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </BmTableColumn>
                    <!-- 装箱数量 -->
                    <BmTableColumn width="100">
                        <template #header>
                            <div><span class="red">*</span>{{ $t("warehouse.packingNum") }}</div>
                        </template>
                        <template #default="scope">
                            <el-form-item :rules="rulesCommon.required" class="m-0">
                                <el-input
                                    oninput="value=value.replace(/[^0-9]/g,'')"
                                    maxlength="8"
                                    v-model="scope.row.waperBoxnum"
                                    @change="
                                        (e) => {
                                            if (scope.row.backNum > 0 && e > 0) {
                                                tableData.deliveryBoxnum = Math.ceil(scope.row.backNum / e);
                                            } else {
                                                tableData.deliveryBoxnum = 0;
                                            }
                                        }
                                    "
                                    :placeholder="$t('warehouse.packingNum')"
                                    min="0"
                                    step="1"
                                    key="waperBoxnum"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </BmTableColumn>
                    <!-- 国际码 -->
                    <BmTableColumn prop="internationalCode" :label="$t('warehouse.internationalCode')" width="150">
                        <template #default="scope">
                            {{ scope.row.backProductSkuVo.internationalCode }}
                        </template>
                    </BmTableColumn>
                    <!-- 有效期 -->
                    <BmTableColumn :label="$t('warehouse.validity')" width="330" align="center">
                        <template #header>
                            <div><span class="red">*</span>{{ $t("warehouse.validity") }}</div>
                            <el-date-picker
                                v-model="tableData.tableBatch.validTime"
                                @change="onBlurBatchChange($event, ['validStartTime', 'validEndTime'], tableData)"
                                type="datetimerange"
                                range-separator="~"
                                :start-placeholder="$t('startDate')"
                                :end-placeholder="$t('endDate')"
                                style="100%"
                            >
                            </el-date-picker>
                        </template>

                        <template #default="scope">
                            <!-- reqPeriodValid 0非必填 1必填 -->
                            <el-form-item v-if="scope.row.reqPeriodValid == 1" :rules="rulesCommon.required" class="mr-0 mb-0">
                                <el-date-picker v-model="scope.row.validStartTime" type="datetime" :placeholder="$t('startDate')" style="width:200px"> </el-date-picker>
                            </el-form-item>
                            <div v-if="scope.row.reqPeriodValid == 1" class="lh-1">~</div>
                            <el-form-item v-if="scope.row.reqPeriodValid == 1" :rules="rulesCommon.required" class="mr-0 mb-0">
                                <el-date-picker v-model="scope.row.validEndTime" type="datetime" :placeholder="$t('endDate')" style="width:200px"> </el-date-picker>
                            </el-form-item>
                        </template>
                    </BmTableColumn>
                    <!-- <BmTableColumn :label="$t('table.operation')" width="60">
                        <template #default="scope">
                            <el-button v-if="scope.row.delFlag && scope.row.delFlag === 1" @click.stop="scope.row.delFlag = 0" type="text">
                                {{ $t("warehouse.recover") }}
                            </el-button>
                            <el-button v-else @click.stop="scope.row.delFlag = 1" type="text">
                                {{ $t("warehouse.delete") }}
                            </el-button>
                        </template>
                    </BmTableColumn> -->
                </BmTable>
            </el-form>
        </div>
        <!-- 添加装箱类型 -->
        <el-button @click="handleAddStandardType" type="primary" icon="el-icon-plus" plain class="mb-30 w-100">
            {{ $t("warehouse.addStandardType") }}
        </el-button>

        <div class="flex mt-20">
            <!-- 商家备注 -->
            <div class="flex mr-30 fs-12" style="width:50%">
                <span> {{ $t("warehouse.businessmenNote") }}：</span>
                <el-input type="textarea" v-model="form.note" show-word-limit maxlength="200" rows="3" class="flex1" />
            </div>
        </div>

        <template #footer>
            <div class="flex hcenter vcenter">
                <!-- <el-button @click="cancel">{{ $t("cancel") }}</el-button> -->
                <el-button @click="onSaveDraft" :disabled="saveDisabled" type="primary" plain>{{ $t("warehouse.saveDrafts") }}</el-button>
                <el-button @click="onSaveAndAudit" :disabled="saveDisabled" type="primary">
                    {{ $t("warehouse.saveSubmit") }}
                </el-button>
            </div>
        </template>
    </BmDialog>

    <!-- sku列表 isBack:1 发货计划筛选-->
    <SelectionSkuList v-model:visible="skuVisible" :rows="skuRows" :selectionType="selectionType" :isBack="1" @change="onChangeAddGoods" />

    <!-- 卖家地址列表-->
    <SelectionSellerAddressList v-model:visible="sellerAddressVisible" @change="onChangeSellerAddress" />
</template>

<script>
import { ref, reactive, getCurrentInstance, watch, computed } from "vue";
import SelectionSkuList from "@/components/selectionSkuList.vue";
import SelectionSellerAddressList from "@/components/selectionSellerAddressList.vue";
import { deepClone, formatStandardDate } from "@/utils/";
import { productSellerUpdate, productSellerSave, productInfo, fbtSendGoodsLimit, productSellerGetSkuInfo } from "@/api/warehouse";
import dayjs from "dayjs";

export default {
    name: "ShipmentsPlanAdd",
    components: { SelectionSkuList, SelectionSellerAddressList },
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        //标题
        let updateType = computed(() => (JSON.stringify(props.row) == "{}" ? "add" : "edit"));

        //头部表单
        const formRef = ref(null);
        let form = reactive({
            id: "",
            boxType: 0, //包装类型
            firstExpress: "0", //头程物流
            deliveryAddress: "", //卖家发货地址
            deliveryAddressId: "", //卖家发货地址ID
            receiveWareAddress: "", //仓库地址
            note: "" //商家备注
        });

        watch(
            () => props.row,
            (nVal) => {
                if (nVal.id) {
                    //获取详情
                    const loading = proxy.$loading();
                    productInfo(nVal.id)
                        .then((res) => {
                            form.id = nVal.id;
                            form.boxType = res.data.boxType; //包装类型
                            form.firstExpress = res.data.firstExpress; //头程物流
                            form.deliveryAddress = res.data.deliveryAddress; //卖家发货地址
                            form.deliveryAddressId = res.data.deliveryAddressId; //卖家发货地址id
                            form.receiveWareAddress = res.data.receiveWareAddress; //仓库地址
                            form.note = res.data.note; //商家备注

                            let standard = [],
                                mixed = [];
                            res.data.backProductBoxList.forEach((item) => {
                                item.tableBatch = {};
                                item.backProductBoxItems.forEach((bitem) => {
                                    bitem.tsin = bitem.backProductSkuVo.tsin;
                                    bitem.skuAttr = bitem.backProductSkuVo.skuAttr;
                                    bitem.fnsku = bitem.backProductSkuVo.fnsku;
                                    bitem.title = bitem.backProductSkuVo.title;
                                });

                                if (item.boxType === 0) {
                                    standard.push(item);
                                } else {
                                    mixed.push(item);
                                }
                            });
                            tableDataStandard.value = standard;
                            tableDataMixed.value = mixed;
                            loading.close();
                        })
                        .catch((err) => {
                            loading.close();
                        });
                } else {
                    form.id = "";
                    form.boxType = boxLimit.value.open_mixed_set_value == 0 ? 1 : 0; //包装类型 开启了混装默认选择混装(0开启混装 1关闭)
                    form.firstExpress = ""; //头程物流
                    form.deliveryAddress = ""; //卖家发货地址
                    form.deliveryAddressId = ""; //卖家发货地址id
                    form.receiveWareAddress = ""; //仓库地址
                    form.note = ""; //商家备注

                    // // 0开启混装 1关闭
                    // if (boxLimit.value.open_mixed_set_value == 0) {
                    //     // 默认添加一个混装
                    //     defualtDataTable.boxType = 1;
                    //     tableDataMixed.value = [deepClone(defualtDataTable)];
                    //     tableDataStandard.value = [];
                    // } else {
                    //     // 默认添加一个标准装
                    //     defualtDataTable.boxType = 0;
                    //     tableDataStandard.value = [deepClone(defualtDataTable)];
                    //     tableDataMixed.value = [];
                    // }
                }
            }
            //{ immediate: true }
        );

        const rulesCommon = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" },
            isSelect: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" },
            noMessage: { required: true, message: " ", trigger: "blur" },
            chooselogistics: { required: true, message: proxy.$t("warehouse.chooselogistics"), trigger: "blur" },
            selectAddress: { required: true, message: proxy.$t("warehouse.selectAddress"), trigger: "blur" }
        });

        //查询发补货在运营后台的设置限制
        let boxLimit = ref({});
        const getFbtSendGoodsLimit = () => {
            fbtSendGoodsLimit()
                .then((res) => {
                    boxLimit.value = res.data;
                })
                .catch((err) => {});
        };
        getFbtSendGoodsLimit();

        //批量修改
        const onBlurBatchChange = (e, type, tableData, isComputeDeliveryBoxnum) => {
            if (Array.isArray(type)) {
                tableData.backProductBoxItems.forEach((item) => {
                    item[type[0]] = formatStandardDate(e[0], 1);
                    item[type[1]] = formatStandardDate(e[1], 1);
                });
            } else {
                tableData.backProductBoxItems.forEach((item) => {
                    item[type] = e.target ? e.target.value : e;
                });
            }

            //计算混装发货箱数
            if (isComputeDeliveryBoxnum === 1) {
                onChangeComputeDeliveryBoxnum(tableData);
            }
        };

        //计算混装发货箱数
        const onChangeComputeDeliveryBoxnum = (tableData) => {
            // let deliveryBoxnum = 0;
            // tableData.backProductBoxItems.forEach((item) => {
            //     if (item.backNum > 0 && item.waperBoxnum > 0) {
            //         deliveryBoxnum = deliveryBoxnum + Math.ceil(item.backNum / item.waperBoxnum);
            //     }
            // });
            // tableData.deliveryBoxnum = deliveryBoxnum;
        };

        //删除sku
        const tableRowClassName = ({ row, rowIndex }) => {
            if (row.delFlag === 1) {
                return "bg-grey";
            }
            return "";
        };

        //限制装箱毛重
        const onChangeLimitBoxWeight = (e) => {
            if (e * 1 > boxLimit.value.weight_limit_value) {
                proxy.$message.warning(proxy.$t("warehouse.alert3", { num: boxLimit.value.weight_limit_value }));
            }
        };

        //限制装箱尺寸
        const onChangeLimitBoxSize = (val, type) => {
            const msg = proxy.$t("warehouse.alert3", { num: boxLimit.value.size_limit_length + "*" + boxLimit.value.size_limit_wide + "*" + boxLimit.value.size_limit_high });
            if (type === "boxLong" && val * 1 > boxLimit.value.size_limit_length) {
                proxy.$message.warning(msg);
            } else if (type === "boxWide" && val * 1 > boxLimit.value.size_limit_wide) {
                proxy.$message.warning(msg);
            } else if (type === "boxHigh" && val * 1 > boxLimit.value.size_limit_high) {
                proxy.$message.warning(msg);
            }
        };

        //添加商品
        let selectionType = ref("radio"); //标准装radio单选 混装checkbox多选
        let skuVisible = ref(false);
        let addGoodsIndex = 0;
        let skuRows = ref([]);
        let tableType = "tableDataStandard";
        //点击添加商品
        const handleAddGoods = (index, type) => {
            let tableData = "";
            // 标准装
            if (type === "tableDataStandard") {
                selectionType.value = "radio";
                tableData = tableDataStandard.value;
            } else {
                //混装
                selectionType.value = "checkbox";
                tableData = tableDataMixed.value;
            }

            skuRows.value = tableData[index].backProductBoxItems;
            tableType = type;
            addGoodsIndex = index;
            skuVisible.value = true;
        };
        //选中的商品装箱
        const onChangeAddGoods = (skuList, skuIdsNew) => {
            let tableData = "";
            if (tableType === "tableDataStandard") {
                tableData = tableDataStandard.value;
            } else {
                tableData = tableDataMixed.value;
            }
            let skuIdsOld = [];
            // 过滤掉新选择的商品不存在于旧商品中 就是要把哪些旧商品删掉 (最终要把旧商品差集删掉,新商品差集push进来)
            let backProductBoxItems = tableData[addGoodsIndex].backProductBoxItems.filter((item) => {
                skuIdsOld.push(item.skuId);
                return skuIdsNew.includes(item.skuId);
            });

            let skuListTmp = [],
                skuListIds = [];
            skuList.forEach((item) => {
                //存在的商品不要替换了(新商品差集push进来)
                if (!skuIdsOld.includes(item.skuId)) {
                    skuListIds.push(item.skuId);
                    skuListTmp.push({
                        isNew: true, //是否新选择的商品,提交时有用,需要把id清空
                        //id: item.id,
                        skuId: item.skuId,
                        goodTitle: item.title,
                        picture: item.picture,
                        price: item.price,
                        // deliveryType: item.deliveryType,
                        // hasSale: item.hasSale,
                        // stock: item.stock,
                        // isDown: item.isDown,
                        weight: "",
                        itemLong: "",
                        itemWide: "",
                        itemHigh: "",
                        backNum: "",
                        waperBoxnum: "",
                        validEndTime: "",
                        validStartTime: "",
                        title: item.title,
                        fnsku: item.fnsku,
                        // internationalCode: item.internationalCode,
                        skuAttr: item.skuAttr,
                        // skuCode: item.skuCode,
                        // stockNum: item.stockNum,
                        tsin: item.tsin,
                        backProductSkuVo: {
                            //id: item.id,
                            skuId: item.skuId,
                            fnsku: item.fnsku,
                            internationalCode: item.internationalCode,
                            skuAttr: item.skuAttr,
                            skuCode: item.skuCode,
                            stockNum: item.stockNum,
                            tsin: item.tsin,
                            deliveryType: item.deliveryType,
                            hasSale: item.hasSale,
                            stock: item.stock,
                            isDown: item.isDown,
                            reqPeriodValid: item.reqPeriodValid //有效期是0非必填 1必填
                        }
                    });
                }
            });
            //没有新产品要push
            if (skuListTmp.length === 0) return;

            //通过skuid获取发补货原先的重量体积
            const loading = proxy.$loading();
            productSellerGetSkuInfo({ skuIds: skuListIds.join(",") })
                .then((res) => {
                    loading.close();
                    //找不到说明以前没有添加过这个商品
                    if (res.data && res.data.length === 0) {
                        // 标准装
                        if (tableType === "tableDataStandard") {
                            tableData[addGoodsIndex].backProductBoxItems = [...skuListTmp];
                            return;
                        }
                        //混装
                        tableData[addGoodsIndex].backProductBoxItems = backProductBoxItems.concat([...skuListTmp]);
                        //计算混装发货箱数
                        onChangeComputeDeliveryBoxnum(tableData[addGoodsIndex]);
                        return;
                    }

                    //以前有添加过
                    // 标准装
                    if (tableType === "tableDataStandard") {
                        const data = res.data[0];
                        tableData[addGoodsIndex].backProductBoxItems = [
                            {
                                ...skuListTmp[0],
                                itemLong: data.itemLong,
                                itemWide: data.itemWide,
                                itemHigh: data.itemHigh,
                                weight: data.weight,
                                backNum: data.backNum, //发/补货数量
                                waperBoxnum: data.waperBoxnum, //装箱数量
                                validStartTime: data.validStartTime, //有效期开始
                                validEndTime: data.validEndTime //有效期结束
                            }
                        ];
                        //计算发货箱数
                        if (data.backNum > 0 && data.waperBoxnum > 0) {
                            tableData[addGoodsIndex].deliveryBoxnum = Math.ceil(data.backNum / data.waperBoxnum);
                        } else {
                            tableData[addGoodsIndex].deliveryBoxnum = 0;
                        }
                        return;
                    }
                    //混装
                    skuListTmp.forEach((item) => {
                        res.data.forEach((sitem) => {
                            if (item.skuId == sitem.skuId) {
                                item.itemLong = sitem.itemLong;
                                item.itemWide = sitem.itemWide;
                                item.itemHigh = sitem.itemHigh;
                                item.weight = sitem.weight;
                                item.backNum = sitem.backNum; //发/补货数量
                                item.waperBoxnum = sitem.waperBoxnum; //装箱数量
                                item.validStartTime = sitem.validStartTime; //有效期开始
                                item.validEndTime = sitem.validEndTime; //有效期结束
                            }
                        });
                    });
                    //console.log("skuListTmp", skuListTmp);
                    tableData[addGoodsIndex].backProductBoxItems = backProductBoxItems.concat([...skuListTmp]);
                    //计算混装发货箱数
                    onChangeComputeDeliveryBoxnum(tableData[addGoodsIndex]);
                })
                .catch(() => {
                    loading.close();
                    // 标准装
                    if (tableType === "tableDataStandard") {
                        tableData[addGoodsIndex].backProductBoxItems = [...skuListTmp];
                        return;
                    }
                    //混装
                    tableData[addGoodsIndex].backProductBoxItems = backProductBoxItems.concat([...skuListTmp]);
                });
        };

        //默认装箱table
        const defualtDataTable = {
            boxType: 0, //装箱的类型0->标准装箱类型 1->混装类型
            backProductId: "",
            name: "", //装箱名称
            boxWeightUnit: "kg",
            boxWeight: "",
            productWeightUnit: "kg",
            boxSizeUnit: "cm",
            boxLong: "",
            boxWide: "",
            boxHigh: "",
            productSizeUnit: "cm",
            deliveryBoxnum: "", //发货箱数
            delFlag: 0,
            backProductBoxItems: [],
            //批量修改
            tableBatch: {
                itemWeight: "",
                itemLong: "",
                itemWide: "",
                itemHigh: "",
                validTime: "",
                backNum: "",
                waperBoxnum: "",
                validTime: ""
            }
        };

        //---------------------------标准装table-----------------------------

        let tableDataStandard = ref([]);
        let tableDataStandardRef = [];
        //删除标准装商品
        const handleDelGoodsStandard = (index) => {
            tableDataStandard.value.splice(index, 1);
            tableDataStandardRef = [];
        };
        const setTableDataStandardRef = (el) => {
            if (el) {
                tableDataStandardRef.push(el);
            }
        };
        //添加标准装箱类型
        const handleAddStandardType = () => {
            defualtDataTable.boxType = 0;
            tableDataStandard.value.push(deepClone(defualtDataTable));
        };

        //---------------------------混装table-------------------------------

        let tableDataMixed = ref([]);
        let tableDataMixedRef = [];
        //删除混装商品
        const handleDelGoodsMixed = (index) => {
            tableDataMixed.value.splice(index, 1);
            tableDataMixedRef = [];
        };
        const setTableDataMixedRef = (el) => {
            if (el) {
                tableDataMixedRef.push(el);
            }
        };
        //添加混装箱类型
        const handleAddMixedType = () => {
            defualtDataTable.boxType = 1;
            tableDataMixed.value.push(deepClone(defualtDataTable));
        };

        //保存并提交审核
        let saveDisabled = ref(false);
        const onSaveAndAudit = async (isDraft) => {
            //验证发货地址
            await formValidate();

            //标准装过滤已删除
            let standardData = tableDataStandard.value.map((item) => {
                item.backProductBoxItemsTmp = item.backProductBoxItems.filter((pitem) => pitem.delFlag != 1);
                return item;
            });
            //混装过滤已删除
            let mixedData = tableDataMixed.value.map((item) => {
                item.backProductBoxItemsTmp = item.backProductBoxItems.filter((pitem) => pitem.delFlag != 1);
                return item;
            });

            //至少添加一种包装类型
            if (tableDataStandard.value.length === 0 && tableDataMixed.value.length === 0) {
                proxy.$message.error(proxy.$t("warehouse.boxTypeOne"));
                return;
            }

            //非保存草稿
            if (isDraft !== true) {
                //验证标准装
                let standardValidate = 0;
                for (let i = 0; i < tableDataStandardRef.length; i++) {
                    tableDataStandardRef[i].validate((valid) => {
                        if (valid) {
                            standardValidate++;
                        } else {
                            return false;
                        }
                    });
                }
                if (standardValidate === tableDataStandardRef.length) {
                    //验证table每个箱子 每项不能为空
                    for (let i = 0, length = standardData.length; i < length; i++) {
                        let productItems = standardData[i].backProductBoxItemsTmp;
                        if (productItems.length === 0) {
                            proxy.$message.error(proxy.$t("warehouse.standardTypeAdd")); //请添加[标准装箱类型]商品
                            return;
                        }
                        for (let j = 0, len = productItems.length; j < len; j++) {
                            if (
                                productItems[j].weight === "" ||
                                productItems[j].itemLong === "" ||
                                productItems[j].itemWide === "" ||
                                productItems[j].itemHigh === "" ||
                                productItems[j].backNum === "" ||
                                productItems[j].waperBoxnum === "" ||
                                (productItems[j].reqPeriodValid == 1 && (productItems[j].validEndTime === "" || productItems[j].validStartTime === ""))
                            ) {
                                proxy.$message.error(proxy.$t("warehouse.standardTypeInfo")); //标准装箱类型信息未填写完整
                                return;
                            }
                        }
                    }
                } else {
                    proxy.$message.error(proxy.$t("warehouse.standardTypeInfo")); //标准装箱类型信息未填写完整
                    return;
                }

                //验证混装
                let mixedValidate = 0;
                for (let i = 0; i < tableDataMixedRef.length; i++) {
                    tableDataMixedRef[i].validate((valid) => {
                        if (valid) {
                            mixedValidate++;
                        } else {
                            return false;
                        }
                    });
                }
                if (mixedValidate === tableDataMixedRef.length) {
                    //验证table每个箱子 每项不能为空
                    for (let i = 0, length = mixedData.length; i < length; i++) {
                        let productItems = mixedData[i].backProductBoxItemsTmp;
                        if (productItems.length === 0) {
                            proxy.$message.error(proxy.$t("warehouse.mixedTypeAdd")); //请添加[混装类型]商品
                            return;
                        }
                        for (let j = 0, len = productItems.length; j < len; j++) {
                            if (
                                productItems[j].weight === "" ||
                                productItems[j].itemLong === "" ||
                                productItems[j].itemWide === "" ||
                                productItems[j].itemHigh === "" ||
                                productItems[j].backNum === "" ||
                                productItems[j].waperBoxnum === "" ||
                                (productItems[j].reqPeriodValid == 1 && (productItems[j].validEndTime === "" || productItems[j].validStartTime === ""))
                            ) {
                                proxy.$message.error(proxy.$t("warehouse.mixedTypeInfo")); //混装类型信息未填写完整
                                return;
                            }
                        }
                    }
                } else {
                    proxy.$message.error(proxy.$t("warehouse.mixedTypeInfo")); //混装类型信息未填写完整
                    return;
                }
            }

            for (let i = 0, length = standardData.length; i < length; i++) {
                standardData[i].backProductBoxItems = standardData[i].backProductBoxItemsTmp.map((v) => {
                    //新选择的商品要把id清空,否则会被以为是编辑的商品
                    if (v.isNew === true) {
                        v.id = "";
                    }
                    v.validStartTime = v.validStartTime ? dayjs(v.validStartTime).format("YYYY-MM-DD HH:mm:ss") : "";
                    v.validEndTime = v.validEndTime ? dayjs(v.validEndTime).format("YYYY-MM-DD HH:mm:ss") : "";
                    return v;
                });
                delete standardData[i].backProductBoxItemsTmp;
            }
            for (let i = 0, length = mixedData.length; i < length; i++) {
                mixedData[i].backProductBoxItems = mixedData[i].backProductBoxItemsTmp.map((v) => {
                    //新选择的商品要把id清空,否则会被以为是编辑的商品
                    if (v.isNew === true) {
                        v.id = "";
                    }
                    v.validStartTime = v.validStartTime ? dayjs(v.validStartTime).format("YYYY-MM-DD HH:mm:ss") : "";
                    v.validEndTime = v.validEndTime ? dayjs(v.validEndTime).format("YYYY-MM-DD HH:mm:ss") : "";
                    return v;
                });
                delete mixedData[i].backProductBoxItemsTmp;
            }

            //提交
            let typeApi = productSellerUpdate; //编辑
            if (updateType.value === "add") {
                typeApi = productSellerSave; //新增
            }
            const params = {
                ...form,
                saveStatus: isDraft === true ? 0 : 1, //保存状态0->保存为草稿 1->保存并提交审核
                backProductBoxes: [...standardData, ...mixedData]
            };
            saveDisabled.value = true;
            const loading = proxy.$loading();
            typeApi(params)
                .then((res) => {
                    loading.close();
                    emit("reloadData");
                    emit("update:visible", false);
                    tableDataStandard.value = [];
                    tableDataMixed.value = [];
                    saveDisabled.value = false;
                })
                .catch(() => {
                    saveDisabled.value = false;
                    loading.close();
                });
        };

        //验证头部表单
        const formValidate = () => {
            return new Promise(function(resolve, reject) {
                formRef.value.validate((valid, err) => {
                    if (valid) {
                        resolve();
                    } else {
                        proxy.$message.error(Object.values(err)[0][0].message);
                    }
                });
            });
        };

        //保存草稿
        const onSaveDraft = () => {
            onSaveAndAudit(true);
        };

        //切换包装类型
        const onChangeBoxType = (val) => {
            // 0标准 1混装
            if (val == 0 && tableDataMixed.value.length > 0) {
                proxy.$message.warning(proxy.$t("warehouse.changeStandardType")); //请先删除当前的混装类型箱规内容，再切换到[标准装箱类型]
                form.boxType = 1;
            }
        };

        //卖家地址
        let sellerAddressVisible = ref(false);
        let sellerAddressRow = reactive({});
        const handleChangeSellerAddress = () => {
            sellerAddressVisible.value = true;
            //sellerAddressRow = form
        };
        const onChangeSellerAddress = (row) => {
            form.deliveryAddressId = row.id;
            form.deliveryAddress = row.countryName + row.provinceName + " " + row.cityName + " " + row.districtName + " " + row.address;
        };

        const cancel = () => {
            tableDataStandard.value = [];
            tableDataMixed.value = [];
            emit("update:visible", false);
        };

        return {
            updateType,
            form,
            rulesCommon,
            boxLimit,
            skuVisible,
            skuRows,
            onBlurBatchChange,
            formRef,
            onChangeComputeDeliveryBoxnum,

            onChangeLimitBoxWeight,
            onChangeLimitBoxSize,
            selectionType,
            handleAddGoods,
            onChangeAddGoods,

            handleDelGoodsStandard,
            setTableDataStandardRef,
            tableDataStandard,
            tableDataStandardRef,
            handleAddStandardType,

            handleDelGoodsMixed,
            setTableDataMixedRef,
            tableDataMixed,
            tableDataMixedRef,
            handleAddMixedType,

            tableRowClassName,
            saveDisabled,
            onSaveAndAudit,
            onSaveDraft,
            onChangeBoxType,

            sellerAddressVisible,
            sellerAddressRow,
            handleChangeSellerAddress,
            onChangeSellerAddress,

            cancel
        };
    }
};
</script>

<style lang="scss" scoped>
.w-70 {
    width: 70px;
}
</style>
