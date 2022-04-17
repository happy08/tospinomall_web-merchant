<template>
    <BmDialog v-model:visible="visible" :title="$t('sellerAddress.title')" :confirm="confirm" :cancel="cancel" :width="850" top="10vh">
        <!-- <el-form :model="searchForm" :inline="true">
            <el-form-item :label="$t('sellerAddress.info')" prop="keyword">
                <el-input v-model="searchForm.keyword" placeholder="title / tsin / fnsku / upc">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
            </el-form-item>
        </el-form> -->

        <BmTable ref="multipleTable" :data="tableData" v-loading="tableLoading" @row-click="handleRowClick" row-key="id" height="400" class="mb-20">
            <BmTableColumn width="60" align="center">
                <template #default="scope">
                    <el-radio :label="scope.row.id" v-model="currentRadio">&nbsp;</el-radio>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="name" :label="$t('sellerAddress.name')" width="160"> </BmTableColumn>
            <BmTableColumn prop="phone" :label="$t('sellerAddress.phone')" width="160"> </BmTableColumn>
            <BmTableColumn :label="$t('sellerAddress.address')">
                <template #default="scope">
                    {{ scope.row.countryName }}
                    {{ scope.row.provinceName }}
                    {{ scope.row.cityName }}
                    {{ scope.row.districtName }}
                    {{ scope.row.address }}
                </template>
            </BmTableColumn>
        </BmTable>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance, watch, computed, nextTick } from "vue";
import { sellerDeliveryAddressPage } from "@/api/warehouse";

export default {
    name: "selectionSellerAddressList",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["change", "update:visible"],
    setup(props, { emit }) {
        //const { proxy } = getCurrentInstance();

        const multipleTable = ref(null);
        let tableLoading = ref(true);
        let tableData = ref([]);

        // 商家地址分页查询列表
        const initData = () => {
            sellerDeliveryAddressPage()
                .then((res) => {
                    tableData.value = res.data;
                    tableLoading.value = false;
                })
                .catch(() => {});
        };
        initData();

        let currentRadio = ref("");
        let tableSelectionRows = reactive({}); //选中的
        watch(
            () => props.rows,
            (nVal) => {
                currentRadio.value = nVal.id;
            }
            // {
            //     deep: true,
            // }
        );

        //点击单行-选择
        const handleRowClick = (row) => {
            tableSelectionRows = row;
            currentRadio.value = row.id;
        };

        const confirm = () => {
            emit("change", tableSelectionRows);
            emit("update:visible", false);
            // setTimeout(() => {
            //     tableSelectionRows = {};
            //     multipleTable.value.clearSelection();
            // }, 500);
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            multipleTable,
            tableData,
            tableLoading,
            currentRadio,
            tableSelectionRows,
            tableSelectionRows,
            handleRowClick,
            confirm,
            cancel
        };
    }
};
</script>
