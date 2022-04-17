<template>
    <BmDialog v-model:visible="visible" :title="$t('table.detail')" width="90%" top="5vh" @close="cancel">
        <BmAlert :title="$t('warehouse.alert2')" icon="warning" class="mb-20" />

        <template v-if="form.id">
            <el-form ref="formRef" :model="form" :inline="true" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <!-- 包装类型 -->
                        <el-form-item :label="$t('warehouse.boxType')" prop="boxType" :rules="rulesCommon.isSelect" class="mb-0">
                            <el-radio-group v-model="form.boxType">
                                <el-radio :label="0" disabled>{{ $t("warehouse.standardType") }} </el-radio>
                                <el-radio :label="1" disabled>{{ $t("warehouse.mixedType") }} </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <!-- 头程物流 -->
                        <el-form-item :label="$t('warehouse.logistics')" prop="firstExpress" :rules="rulesCommon.isSelect" class="ml-30 mb-0">
                            <el-radio-group v-model="form.firstExpress">
                                <el-radio label="0" disabled>{{ $t("warehouse.tospinoLogistics") }} </el-radio>
                                <el-radio label="1" disabled>{{ $t("warehouse.TPL") }} </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <!-- 卖家地址 -->
                        <el-form-item :label="$t('warehouse.shipAddress')" prop="deliveryAddress" :rules="rulesCommon.isSelect" class="w-100">
                            {{ form.deliveryAddress }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.receiveWareAddress">
                        <el-form-item :label="$t('warehouse.warehouseAddress')" prop="receiveWareAddress" class="ml-30">
                            {{ form.receiveWareAddress }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div class="flex mb-5" style="justify-content:flex-end">
                <!-- 打印供货单 -->
                <el-button v-if="![0, 1, 6].includes(form.status)" class="ml-20" type="primary" @click="handlePrint(1)">{{ $t("warehouse.printSupplyOrder") }}</el-button>
            </div>

            <!-- 标准装箱类型 -->
            <div v-for="(tableData, tbIndex) in tableDataStandard" :key="tbIndex">
                <el-form :model="tableData" :inline="true">
                    <div class="mb-0 p-10 border bg-light-grey">
                        <div class="fl mt-10">{{ $t("warehouse.standardType") }}{{ tbIndex + 1 }}~BOX~{{ tableData.deliveryBoxnum || 0 }}</div>
                        <div class="fl ml-20">
                            <!-- 装箱毛重 -->
                            <el-form-item prop="boxWeightUnit" :rules="rulesCommon.noMessage" class="mb-0 mr-0">
                                <template #label>
                                    {{ $t("warehouse.grossWeight") }}:
                                    <el-select v-model="tableData.boxWeightUnit" class="w-70" :key="`boxWeightUnit${tbIndex}`" disabled>
                                        <el-option label="kg" value="kg"></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                            <el-form-item prop="boxWeight" :rules="rulesCommon.noMessage" class="mb-0">
                                <el-input v-model="tableData.boxWeight" :placeholder="$t('warehouse.grossWeight')" style="width:80px" :key="`boxWeight${tbIndex}`" disabled> </el-input>
                            </el-form-item>
                            <!-- 装箱尺寸 -->
                            <el-form-item prop="boxSizeUnit" :rules="rulesCommon.noMessage" class="mb-0 ml-20 mr-0">
                                <template #label>
                                    {{ $t("warehouse.measurement") }}:
                                    <el-select v-model="tableData.boxSizeUnit" class="w-70" :key="`boxSizeUnit${tbIndex}`" disabled>
                                        <el-option label="cm" value="cm"></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                            <el-form-item prop="boxLong" :rules="rulesCommon.noMessage" class="mb-0">
                                <el-input v-model="tableData.boxLong" :placeholder="$t('warehouse.long')" class="w-70" :key="`boxLong${tbIndex}`" disabled> </el-input>
                            </el-form-item>
                            <el-form-item prop="boxWide" :rules="rulesCommon.noMessage" class="mb-0">
                                <el-input v-model="tableData.boxWide" :placeholder="$t('warehouse.wide')" class="w-70" :key="`boxWide${tbIndex}`" disabled> </el-input>
                            </el-form-item>
                            <el-form-item prop="boxHigh" :rules="rulesCommon.noMessage" class="mb-0">
                                <el-input v-model="tableData.boxHigh" :placeholder="$t('warehouse.high')" class="w-70" :key="`boxHigh${tbIndex}`" disabled> </el-input>
                            </el-form-item>
                        </div>
                        <div class="fr flex vcenter">
                            <!-- 发货箱数 -->
                            <el-form-item :label="$t('warehouse.caseNumber')" prop="deliveryBoxnum" :rules="rulesCommon.noMessage" class="ml-20 mb-0">
                                <el-input v-model="tableData.deliveryBoxnum" class="w-70" :key="`deliveryBoxnum${tbIndex}`" disabled> </el-input>
                            </el-form-item>
                            <!-- 打印箱唛 -->
                            <el-dropdown>
                                <el-button class="ml-20" type="primary">{{ $t("warehouse.print") }}</el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handlePrint(2, tableData, tbIndex + 1, 'new')">{{ $t("warehouse.print") }}(New)</el-dropdown-item>
                                        <el-dropdown-item @click="handlePrint(2, tableData)">{{ $t("warehouse.print") }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!-- <el-button class="ml-20" type="primary" @click="handlePrint(2, tableData)">{{ $t("warehouse.print") }}</el-button> -->
                        </div>
                        <div class="clear"></div>
                    </div>

                    <BmTable ref="multipleTable" :data="tableData.backProductBoxItems" class="mb-10">
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
                        <BmTableColumn :label="$t('image')" width="80px">
                            <template #default="scope">
                                <BmImage :src="scope.row.picture" style="width:50px;height:50px" />
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
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.packingWeight") }}{{ tableData.productWeightUnit }}</div>
                            </template>
                            <template #default="scope"> {{ scope.row.weight }} </template>
                        </BmTableColumn>
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.packingSize") }}({{ $t("warehouse.long") }}{{ tableData.productSizeUnit }})</div>
                            </template>
                            <template #default="scope"> {{ scope.row.itemLong }} </template>
                        </BmTableColumn>
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.packingSize") }}({{ $t("warehouse.wide") }}{{ tableData.productSizeUnit }})</div>
                            </template>
                            <template #default="scope"> {{ scope.row.itemWide }} </template>
                        </BmTableColumn>
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.packingSize") }}({{ $t("warehouse.high") }}{{ tableData.productSizeUnit }})</div>
                            </template>
                            <template #default="scope"> {{ scope.row.itemHigh }} </template>
                        </BmTableColumn>
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.shipmentsNum") }}</div>
                            </template>
                            <template #default="scope"> {{ scope.row.backNum }} </template>
                        </BmTableColumn>
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.packingNum") }}</div>
                            </template>
                            <template #default="scope">
                                {{ scope.row.waperBoxnum }}
                            </template>
                        </BmTableColumn>
                        <!-- 国际码 -->
                        <BmTableColumn prop="internationalCode" :label="$t('warehouse.internationalCode')" width="150">
                            <template #default="scope">
                                {{ scope.row.backProductSkuVo.internationalCode }}
                            </template>
                        </BmTableColumn>
                        <!-- 入库批次号 status=5入库完成-->
                        <BmTableColumn v-if="row.status == 5" prop="batchNo" :label="$t('warehouse.batchNo')" width="140"></BmTableColumn>
                        <BmTableColumn :label="$t('warehouse.validity')" width="145" align="center">
                            <template #header>
                                <div>{{ $t("warehouse.validity") }}</div>
                            </template>

                            <template #default="scope">
                                {{ scope.row.validStartTime }}
                                <div>~</div>
                                {{ scope.row.validEndTime }}
                            </template>
                        </BmTableColumn>
                    </BmTable>
                </el-form>
            </div>

            <!-- 混装类型 -->
            <div v-for="(tableData, tbIndex) in tableDataMixed" :key="tbIndex">
                <el-form :model="tableData" :inline="true">
                    <div class="mb-0 p-10 border bg-light-grey">
                        <div class="fl mt-10">{{ $t("warehouse.mixedType") }}{{ tbIndex + 1 }}~BOX~{{ tableData.deliveryBoxnum || 0 }}</div>
                        <div class="fl ml-20">
                            <!-- 装箱毛重 -->
                            <el-form-item prop="boxWeightUnit" :rules="rulesCommon.noMessage" class="mb-0 mr-0">
                                <template #label>
                                    {{ $t("warehouse.grossWeight") }}:
                                    <el-select v-model="tableData.boxWeightUnit" class="w-70" :key="`boxWeightUnit${tbIndex}`" disabled>
                                        <el-option label="kg" value="kg"></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                            <el-form-item prop="boxWeight" :rules="rulesCommon.noMessage" class="mb-0">
                                <el-input v-model="tableData.boxWeight" :placeholder="$t('warehouse.grossWeight')" style="width:80px" :key="`boxWeight${tbIndex}`" disabled> </el-input>
                            </el-form-item>
                            <!-- 装箱尺寸 -->
                            <el-form-item prop="boxSizeUnit" :rules="rulesCommon.noMessage" class="mb-0 ml-20 mr-0">
                                <template #label>
                                    {{ $t("warehouse.measurement") }}:
                                    <el-select v-model="tableData.boxSizeUnit" class="w-70" :key="`boxSizeUnit${tbIndex}`" disabled>
                                        <el-option label="cm" value="cm"></el-option>
                                    </el-select>
                                </template>
                            </el-form-item>
                            <el-form-item prop="boxLong" :rules="rulesCommon.noMessage" class="mb-0">
                                <el-input v-model="tableData.boxLong" :placeholder="$t('warehouse.long')" class="w-70" :key="`boxLong${tbIndex}`" disabled> </el-input>
                            </el-form-item>
                            <el-form-item prop="boxWide" :rules="rulesCommon.noMessage" class="mb-0">
                                <el-input v-model="tableData.boxWide" :placeholder="$t('warehouse.wide')" class="w-70" :key="`boxWide${tbIndex}`" disabled> </el-input>
                            </el-form-item>
                            <el-form-item prop="boxHigh" :rules="rulesCommon.noMessage" class="mb-0">
                                <el-input v-model="tableData.boxHigh" :placeholder="$t('warehouse.high')" class="w-70" :key="`boxHigh${tbIndex}`" disabled> </el-input>
                            </el-form-item>
                        </div>
                        <div class="fr flex vcenter">
                            <!-- 发货箱数 -->
                            <el-form-item :label="$t('warehouse.caseNumber')" prop="deliveryBoxnum" :rules="rulesCommon.noMessage" class="ml-20 mb-0">
                                <el-input v-model="tableData.deliveryBoxnum" class="w-70" :key="`deliveryBoxnum${tbIndex}`" disabled> </el-input>
                            </el-form-item>
                            <!-- 打印箱唛 -->
                            <el-dropdown>
                                <el-button class="ml-20" type="primary">{{ $t("warehouse.print") }}</el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handlePrint(2, tableData, tbIndex + 1, 'new')">{{ $t("warehouse.print") }}(New)</el-dropdown-item>
                                        <el-dropdown-item @click="handlePrint(2, tableData)">{{ $t("warehouse.print") }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!-- <el-button class="ml-20" type="primary" @click="handlePrint(2, tableData)">{{ $t("warehouse.print") }}</el-button> -->
                        </div>
                        <div class="clear"></div>
                    </div>

                    <BmTable ref="multipleTable" :data="tableData.backProductBoxItems" class="mb-10">
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
                        <BmTableColumn :label="$t('image')" width="80px">
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
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.packingWeight") }}{{ tableData.productWeightUnit }}</div>
                            </template>
                            <template #default="scope"> {{ scope.row.weight }} </template>
                        </BmTableColumn>
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.packingSize") }}({{ $t("warehouse.long") }}{{ tableData.productSizeUnit }})</div>
                            </template>
                            <template #default="scope"> {{ scope.row.itemLong }} </template>
                        </BmTableColumn>
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.packingSize") }}({{ $t("warehouse.wide") }}{{ tableData.productSizeUnit }})</div>
                            </template>
                            <template #default="scope"> {{ scope.row.itemWide }} </template>
                        </BmTableColumn>
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.packingSize") }}({{ $t("warehouse.high") }}{{ tableData.productSizeUnit }} )</div>
                            </template>
                            <template #default="scope"> {{ scope.row.itemHigh }}</template>
                        </BmTableColumn>
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.shipmentsNum") }}</div>
                            </template>
                            <template #default="scope">
                                {{ scope.row.backNum }}
                            </template>
                        </BmTableColumn>
                        <BmTableColumn width="110">
                            <template #header>
                                <div>{{ $t("warehouse.packingNum") }}</div>
                            </template>
                            <template #default="scope">
                                {{ scope.row.waperBoxnum }}
                            </template>
                        </BmTableColumn>
                        <!-- 国际码 -->
                        <BmTableColumn prop="internationalCode" :label="$t('warehouse.internationalCode')" width="150">
                            <template #default="scope">
                                {{ scope.row.backProductSkuVo.internationalCode }}
                            </template>
                        </BmTableColumn>
                        <!-- 入库批次号 status=5入库完成-->
                        <BmTableColumn v-if="row.status == 5" prop="batchNo" :label="$t('warehouse.batchNo')" width="140"></BmTableColumn>
                        <BmTableColumn :label="$t('warehouse.validity')" width="145" align="center">
                            <template #header>
                                <div>{{ $t("warehouse.validity") }}</div>
                            </template>

                            <template #default="scope">
                                {{ scope.row.validStartTime }}
                                <div>~</div>
                                {{ scope.row.validEndTime }}
                            </template>
                        </BmTableColumn>
                    </BmTable>
                </el-form>
            </div>

            <div class="flex mt-20">
                <!-- 商家备注 -->
                <div class="flex flex1 mr-30 fs-12">
                    <span> {{ $t("warehouse.businessmenNote") }}：</span>
                    <div class="flex1">{{ form.note }}</div>
                </div>
                <!-- 平台备注 -->
                <div class="flex flex1 ml-30 fs-12">
                    <span> {{ $t("warehouse.platformNote") }}：</span>
                    <div class="flex1">
                        <div>{{ form.reason }}</div>
                        <BmImage v-for="(item, index) in form.voucherImgList" :key="index" :src="item" :preview-src-list="form.voucherImgList" class="m-5" style="width:50px;height:50px;" />
                    </div>
                </div>
            </div>
        </template>

        <BmNoData v-else text="loading..." />

        <template #footer>
            <div class="flex hcenter vcenter">
                <template v-if="form.id">
                    <el-button @click="cancel">
                        {{ $t("cancel") }}
                    </el-button>
                    <el-button v-if="row.status === 0 || row.status === 6 || row.status === 7" @click="onSaveAndAudit" type="primary">
                        {{ $t("warehouse.saveSubmitAgain") }}
                    </el-button>
                </template>
            </div>
        </template>
    </BmDialog>

    <!-- 打印箱唛 -->
    <PrintBoxMark v-if="printVisible" v-model:visible="printVisible" :row="printData3" @close="cancel" />

    <!-- 打印箱唛(New) -->
    <PrintBoxMarkNew v-if="printNewVisible" v-model:visible="printNewVisible" :row="printData3" @close="cancel" />

    <!-- 打印供货单 -->
    <PrintSupplyOrder v-if="printOrderVisible" v-model:visible="printOrderVisible" :row="printData2" @close="cancel" />
</template>

<script>
import { ref, reactive, getCurrentInstance, watch, computed } from "vue";
import { productSellerUpdateStatus, productInfo } from "@/api/warehouse";
import PrintBoxMark from "./printBoxMark.vue";
import PrintBoxMarkNew from "./printBoxMarkNew";
import PrintSupplyOrder from "./printSupplyOrder";
import { deepClone } from "@/utils/";

export default {
    name: "ShipmentsPlanDetail",
    components: { PrintBoxMark, PrintBoxMarkNew, PrintSupplyOrder },
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        //头部表单
        const formRef = ref(null);
        let form = reactive({
            id: "",
            boxType: 0,
            firstExpress: 0,
            deliveryAddress: "",
            saveStatus: 0, //保存状态0->保存为草稿 1->保存并提交审核
            receiveWare: "",
            note: "",
            reason: "",
            voucherImgList: [] //平台备注图片
        });

        //---------------------------标准装table-----------------------------

        let tableDataStandard = ref([]);

        //---------------------------混装table-------------------------------

        let tableDataMixed = ref([]);

        // watch(
        //     () => props.row.id,
        //     (nVal) => {
        //         if (nVal) {
        //             //获取详情
        //             productInfo(nVal)
        //                 .then((res) => {
        //                     form.id = nVal.id;
        //                     form.boxType = res.data.boxType; //包装类型
        //                     form.firstExpress = res.data.firstExpress; //头程物流
        //                     form.deliveryAddress = res.data.deliveryAddress; //卖家发货地址
        //                     form.deliveryAddressId = res.data.deliveryAddressId; //卖家发货地址id
        //                     form.receiveWareAddress = res.data.receiveWareAddress; //仓库地址
        //                     form.note = res.data.note; //商家备注
        //                     form.reason = res.data.reason; //平台备注
        //                     form.voucherImgList = res.data.voucherImgList; //平台备注图片
        //                     form.receiveWare = res.data.receiveWare; // 集货仓地址
        //                     form.status = res.data.status; //状态

        //                     let standard = [],
        //                         mixed = [];
        //                     res.data.backProductBoxList.forEach((item) => {
        //                         item.tableBatch = {};
        //                         if (item.boxType === 0) {
        //                             standard.push(item);
        //                         } else {
        //                             mixed.push(item);
        //                         }
        //                     });
        //                     tableDataStandard.value = standard;
        //                     tableDataMixed.value = mixed;

        //                     printData.value = deepClone(res.data);
        //                     printData2.value = res.data;
        //                 })
        //                 .catch((err) => {});
        //         }
        //     },
        // 	{immediate:true}
        // );

        if (props.row.id) {
            //获取详情
            productInfo(props.row.id)
                .then((res) => {
                    form.id = props.row.id;
                    form.boxType = res.data.boxType; //包装类型
                    form.firstExpress = res.data.firstExpress; //头程物流
                    form.deliveryAddress = res.data.deliveryAddress; //卖家发货地址
                    form.deliveryAddressId = res.data.deliveryAddressId; //卖家发货地址id
                    form.receiveWareAddress = res.data.receiveWareAddress; //仓库地址
                    form.note = res.data.note; //商家备注
                    form.reason = res.data.reason; //平台备注
                    form.voucherImgList = res.data.voucherImgList; //平台备注图片
                    form.receiveWare = res.data.receiveWare; // 集货仓地址
                    form.status = res.data.status; //状态

                    let standard = [],
                        mixed = [];
                    res.data.backProductBoxList.forEach((item) => {
                        item.tableBatch = {};
                        if (item.boxType === 0) {
                            standard.push(item);
                        } else {
                            mixed.push(item);
                        }
                    });
                    tableDataStandard.value = standard;
                    tableDataMixed.value = mixed;

                    printData.value = deepClone(res.data);
                    printData2.value = res.data;
                })
                .catch((err) => {});
        }

        const rulesCommon = reactive({
            required: { required: true, message: proxy.$t("pleaseEnter"), trigger: "change" },
            isSelect: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" },
            noMessage: { required: true, message: " ", trigger: "change" }
        });

        //重新提交审核
        const onSaveAndAudit = () => {
            productSellerUpdateStatus({ id: props.row.id, status: 1 })
                .then((res) => {
                    emit("reloadData");
                    emit("update:visible", false);
                })
                .catch(() => {});
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        let printVisible = ref(false);
        let printNewVisible = ref(false);
        let printOrderVisible = ref(false);
        // 打印的数据对象
        let printData = ref({});
        let printData2 = ref({});
        let printData3 = ref({});
        // // 打印按钮监听事件
        // const handlePrint = (row) => {
        //     printData.value = { ...row, storeCode: printData.value.storeCode, storeCountryName: printData.value.storeCountryName };
        //     printOrderVisible.value = true;
        // };
        // 打印按钮监听事件
        const handlePrint = (num, row, boxIndex, version) => {
            if (num == 1) {
                // 打印供货单
                printOrderVisible.value = true;
            } else {
                //打印箱麦
                printData3.value = {
                    ...row,
                    backSn: printData.value.backSn,
                    storeCode: printData.value.storeCode,
                    storeCountryName: printData.value.storeCountryName,
                    boxIndex: boxIndex, //第几个箱子
                    deliveryAddress: form.deliveryAddress,
                    receiveWareAddress: form.receiveWareAddress
                };
                if (version === "new") {
                    printNewVisible.value = true;
                    return;
                }
                printVisible.value = true;
            }
        };

        return {
            form,
            rulesCommon,
            formRef,

            tableDataStandard,

            tableDataMixed,

            onSaveAndAudit,
            cancel,
            printVisible,
            printOrderVisible,
            handlePrint,
            printNewVisible,
            printData2,
            printData3
        };
    }
};
</script>

<style lang="scss" scoped>
.w-70 {
    width: 70px;
}
</style>
