<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('returns.createReturn') : $t('status.edit')" @close="cancel" :width="1000" top="6vh">
        <!-- <el-form :model="searchForm" ref="searchFormRef" :inline="true" label-width="auto">
            <el-form-item :label="$t('warehouse.info')" prop="keyword">
                <el-input
                    v-model="searchForm.keyword"
                    placeholder="Title / TSIN / FNSKU / Batch No. / EAN / UPC"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
            </el-form-item>
        </el-form> -->
        <div class="warning p-10">
            <i class="el-icon-warning"></i><span class="ml-15">{{ $t("warehouse.createReturnTips") }}</span>
        </div>
        <!-- 卖家地址 -->
        <div class="fs-12">
            <span class="red">*</span> {{ $t("warehouse.receivingAddress") }}：
            {{ tableData.receiverAddress }}
            <el-button @click="handleChangeSellerAddress" type="text" class="ml-15">
                {{ !tableData.receiverAddress ? $t("warehouse.selectReceivingAddress") : $t("warehouse.modifyReceivingAddress") }}
            </el-button>
        </div>

        <div class="mtb-10">
            <!-- 添加商品 -->
            <el-button @click="handleAddGoods" type="primary" icon="el-icon-plus">
                {{ $t("warehouse.addGoods") }}
            </el-button>
        </div>
        <BmTable v-if="tableData.backReturnItems" :data="tableData.backReturnItems" v-loading="tableLoading" class="mb-20">
            <BmTableColumn prop="status" :label="$t('status.status')" width="90">
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
                        {{ scope.row.backProductSkuVo.isDown == 1 ? "下架" : "上架" }}
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

            <BmTableColumn :label="$t('returns.returnNum')" width="150">
                <template #default="scope">
                    <el-input-number v-model="scope.row.returnNum" controls-position="right" :min="1" class="w-100"></el-input-number>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="internationalCode" :label="$t('goodsListTable.internationalCode')" width="150"></BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="100">
                <template #default="scope">
                    <el-button @click="handleDelete(scope.$index)" type="text">
                        {{ $t("status.delete") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <div class="flex">
            <!-- 商家备注 -->
            <div class="flex flex1 mr-30 fs-12">
                <span> {{ $t("warehouse.businessmenNote") }}：</span>
                <el-input type="textarea" v-model="tableData.sellerNote" show-word-limit maxlength="200" rows="3" class="flex1" />
            </div>
            <!-- 平台备注 -->
            <div v-if="tableData.reason" class="flex flex1 ml-30 fs-12">
                <span> {{ $t("warehouse.platformNote") }}：</span>
                <div class="flex1">
                    <div>{{ tableData.reason }}</div>
                    <BmImage v-for="(item, index) in tableData.voucherImgList" :key="index" :src="item" :preview-src-list="tableData.voucherImgList" class="m-5" style="width:50px;height:50px;" />
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex hcenter vcenter">
                <el-button @click="cancel">{{ $t("close") }}</el-button>
                <el-button type="primary" plain @click="confirm(0)">
                    {{ $t("warehouse.saveDrafts") }}
                </el-button>
                <el-button type="primary" @click="confirm(1)">
                    {{ $t("warehouse.saveSubmit") }}
                </el-button>
            </div>
        </template>
    </BmDialog>

    <!-- sku列表 isBack:2 发补货退货的商品搜索列表-->
    <SelectionSkuList v-model:visible="skuVisible" :rows="skuRows" :isBack="2" @change="onChangeAddGoods" />

    <!-- 卖家地址列表-->
    <SelectionSellerAddressList v-model:visible="sellerAddressVisible" @change="onChangeSellerAddress" />
</template>

<script>
import { ref, reactive, computed, getCurrentInstance, watch, toRaw } from "vue";
import { returnProductInfo, returnProductSellerSave, returnProductSellerUpdate } from "@/api/warehouse";
import SelectionSkuList from "@/components/selectionSkuList.vue";
import SelectionSellerAddressList from "@/components/selectionSellerAddressList.vue";
import { deepClone } from "@/utils/";

export default {
    name: "replenishManageAddEdit",
    components: { SelectionSkuList, SelectionSellerAddressList },
    emits: ["reloadData", "update:visible"],
    props: {
        visible: Boolean,
        row: Object
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        //标题
        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));

        // //搜索条件
        // let searchFormRef = ref(null);
        // let searchForm = reactive({
        //     keyword: "",
        // });
        // //搜索
        // const handelSearch = () => {
        //     tableData.value.backReturnItems = tableDataTmp.backReturnItems.filter((item) => {
        //         return item.goodTitle.indexOf(searchForm.keyword) !== -1;
        //     });
        // };
        // //重置
        // const resetForm = () => {
        //     searchFormRef.value.resetFields();
        //     tableData.value.backReturnItems = tableDataTmp.backReturnItems;
        // };

        //获取列表
        let tableLoading = ref(false);
        let tableData = ref({
            sellerNote: "",
            reason: "",
            receiverAddress: "",
            saveStatus: 0, //保存状态0草稿 1保存并提交审核
            backReturnItems: [],
            receiverAddressId: ""
        });
        let tableDataTmp = [];
        watch(
            () => props.row,
            (nVal) => {
                if (nVal.id) {
                    tableLoading.value = true;
                    returnProductInfo(nVal.id)
                        .then((res) => {
                            tableDataTmp = deepClone(res.data);
                            tableData.value = res.data;
                            tableLoading.value = false;
                        })
                        .catch((err) => {
                            tableLoading.value = false;
                        });
                }
            }
        );

        //添加商品
        let skuVisible = ref(false);
        let skuRows = ref([]);
        const handleAddGoods = () => {
            skuRows.value = tableData.value.backReturnItems || [];
            skuVisible.value = true;
        };
        const onChangeAddGoods = (skuList) => {
            let tmp = [];
            const idsArr = tableData.value.backReturnItems.map((item) => item.id);
            skuList.forEach((item) => {
                if (!idsArr.includes(item.id)) {
                    console.log("itemitem", item);
                    tmp.push({
                        //...item,
                        isNew: true, //是否新选择的商品,提交时有用,需要把id清空
                        skuId: item.id,
                        returnNum: 1,
                        id: item.id,
                        goodTitle: item.title,
                        picture: item.picture,
                        backProductSkuVo: {
                            fnsku: item.fnsku,
                            internationalCode: item.internationalCode,
                            skuAttr: item.skuAttr,
                            skuCode: item.skuCode,
                            stockNum: item.stockNum,
                            tsin: item.tsin,
                            deliveryType: item.deliveryType,
                            hasSale: item.hasSale,
                            stock: item.stock,
                            isDown: item.isDown
                        }
                    });
                }
            });
            tableData.value.backReturnItems = tableData.value.backReturnItems.concat(tmp);
            tableDataTmp = deepClone(toRaw(tableData.value.backReturnItems));
        };

        //删除
        const handleDelete = (index) => {
            tableData.value.backReturnItems.splice(index, 1);
        };

        //卖家地址
        let sellerAddressVisible = ref(false);
        const handleChangeSellerAddress = () => {
            sellerAddressVisible.value = true;
        };
        const onChangeSellerAddress = (row) => {
            tableData.value.receiverAddress = row.countryName + row.provinceName + " " + row.cityName + " " + row.districtName + " " + row.address;
            tableData.value.receiverAddressId = row.id;
        };

        //保存并提交审核
        const confirm = (saveStatus) => {
            console.log("tableData.value.backReturnItems", tableData.value.backReturnItems);
            //校验地址
            if (!tableData.value.receiverAddress) {
                proxy.$message.error(proxy.$t("warehouse.selectAddress"));
                return;
            }
            //检验退货数量
            for (let i = 0, length = tableData.value.backReturnItems.length; i < length; i++) {
                if (!tableData.value.backReturnItems[i].returnNum || tableData.value.backReturnItems[i].returnNum < 0) {
                    proxy.$message.error(proxy.$t("returns.pleaseReturnNum"));
                    return;
                }
                //新选择的商品要把id清空,否则会被以为是编辑的商品
                if (tableData.value.backReturnItems[i].isNew === true) {
                    tableData.value.backReturnItems[i].id = "";
                }
                tableData.value.backReturnItems[i] = {
                    ...tableData.value.backReturnItems[i].backProductSkuVo,
                    ...tableData.value.backReturnItems[i]
                };
            }

            //提交
            let typeApi = returnProductSellerUpdate;
            if (updateType.value === "add") {
                typeApi = returnProductSellerSave;
            }
            const loading = proxy.$loading();
            typeApi({ ...tableData.value, saveStatus: saveStatus })
                .then((res) => {
                    emit("reloadData");
                    emit("update:visible", false);
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            updateType,
            // searchFormRef,
            // handelSearch,
            // resetForm,
            // searchForm,
            tableLoading,
            tableData,
            skuVisible,
            handleAddGoods,
            onChangeAddGoods,
            skuRows,
            handleDelete,

            sellerAddressVisible,
            handleChangeSellerAddress,
            onChangeSellerAddress,

            confirm,
            cancel
        };
    }
};
</script>
<style lang="scss" scoped>
.warning {
    background: #fffbe6;
    border-radius: 2px;
    border: 1px solid #ffe58f;
}
.el-icon-warning:before {
    color: #faad14;
}
</style>
