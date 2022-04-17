<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('brand.detailAlert')" icon="warning" class="mb-10" />
    </div>
    <div class="p-25 bg-white round-4">
        <div class="flex mb-20">
            <!-- <el-checkbox-group v-model="checkboxGroup" size="small" class="el-checkbox__inner_custom ml-15">
                <el-checkbox label="全部" border></el-checkbox>
                <el-checkbox label="待更新()" border></el-checkbox>
                <el-checkbox label="审核中()" border></el-checkbox>
                <el-checkbox label="深核通过()" border></el-checkbox>
                <el-checkbox label="审核驳回()" border></el-checkbox>
                <el-checkbox label="屏蔽中()" border></el-checkbox>
            </el-checkbox-group> -->
            <el-radio-group v-model="status" @change="handleChangeStatus" class="mr-15">
                <!-- 全部 -->
                <el-radio-button label="">{{ $t("brand.all") }}</el-radio-button>
                <!-- 待更新 -->
                <el-radio-button label="5">{{ $t("brand.waitUpdated") }}({{ brandList.total_await_update }})</el-radio-button>
                <!-- 审核中 -->
                <el-radio-button label="1">{{ $t("brand.underReview") }}({{ brandList.total_await_check }})</el-radio-button>
                <!-- 深核通过 -->
                <el-radio-button label="2">{{ $t("brand.passTheAudit") }}({{ brandList.total_check_success }})</el-radio-button>
                <!-- 审核驳回 -->
                <el-radio-button label="3">{{ $t("brand.auditRejected") }}({{ brandList.total_check_failed }})</el-radio-button>
                <!-- 屏蔽中 -->
                <el-radio-button label="4">{{ $t("brand.shielding") }}({{ brandList.total_shielding }})</el-radio-button>
            </el-radio-group>
            <!-- 新增商标 -->
            <el-button v-permission="'warehouse_BrandAuthentication_add'" @click="handleAddEdit('add')" type="primary" plain icon="el-icon-plus">{{ $t("brand.addBrand") }}</el-button>
        </div>

        <BmTable ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" v-loading="tableLoading" @selection-change="handleSelectionChange">
            <!--商标类型 LOGO 商标名 商品注册号 有效截止日期 状态 提交时间 原因/备注-->
            <BmTableColumn :label="$t('brand.brandType')" prop="" show-overflow-tooltip header-align="center" align="center">
                <template #default="scope">
                    <!--"自有商标"  "授权商标"-->
                    <div>{{ scope.row.type == 1 ? $t("brand.ownBrand") : scope.row.type == 2 ? $t("brand.AuthorizedBrand") : "" }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn label="LOGO" prop="logo" show-overflow-tooltip header-align="center" align="center">
                <template #default="scope">
                    <BmImage :src="scope.row.logo" fit="contain" class="tableImg" />
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('brand.brandName')" prop="brandName" show-overflow-tooltip header-align="center" align="center"></BmTableColumn>
            <BmTableColumn :label="$t('brand.brandRegisterNum')" prop="registerNumber" show-overflow-tooltip header-align="center" align="center"></BmTableColumn>
            <BmTableColumn :label="$t('brand.ExpirationDate')" prop="authEndTime" show-overflow-tooltip header-align="center" align="center" width="180px">
                <template #default="scope">
                    <div v-if="scope.row.type == 1">{{ scope.row.registerEndTime }}</div>
                    <div v-if="scope.row.type == 2">{{ scope.row.authEndTime }}</div>
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('brand.status')" prop="examineStatus" show-overflow-tooltip header-align="center" align="center">
                <template #default="scope">
                    <div>
                        {{
                            scope.row.examineStatus == 1
                                ? $t("brand.beAudit") //"待审核"
                                : scope.row.examineStatus == 2
                                ? $t("brand.auditPass") //"已通过"
                                : scope.row.examineStatus == 3
                                ? $t("brand.auditRejected") //"未通过"
                                : scope.row.examineStatus == 4
                                ? $t("brand.shielding") //"屏蔽中"
                                : scope.row.examineStatus == 5
                                ? $t("brand.waitUpdated") //"待更新"
                                : ""
                        }}
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('brand.subTime')" prop="createTime" show-overflow-tooltip header-align="center" align="center" width="180px"></BmTableColumn>
            <BmTableColumn :label="$t('brand.reasonMark')" prop="" show-overflow-tooltip max-width="400" header-align="center" align="center">
                <template #default="scope">
                    <div v-if="scope.row.reason">{{ $t("brand.platform") }}平台: {{ scope.row.reason }}</div>
                    <div v-if="scope.row.imgList">
                        <BmImage class="tableImg" v-for="(item, i) in scope.row.imgList" :key="i" :src="item" :preview-src-list="[item]" hide-on-click-modal="true" />
                    </div>
                </template>
            </BmTableColumn>
            <BmTableColumn :label="$t('brand.operation')" prop="" fixed="right" header-align="center" align="center" width="180px">
                <template #default="scope">
                    <span class="green"
                        ><el-button type="text" v-permission="'warehouse_BrandAuthentication_detail'" @click="handleDetail(scope.row)">{{ $t("brand.checkDetail") }}</el-button></span
                    >
                    <span v-if="scope.row.examineStatus == 3 || scope.row.examineStatus == 4 || scope.row.examineStatus == 5" class=" green ml-15">
                        <el-button type="text" v-permission="'warehouse_BrandAuthentication_edit'" @click="handleAddEdit('edit', scope.row)">{{ $t("brand.edit") }}</el-button>
                    </span>
                    <span class="green ml-15"
                        ><el-button type="text" v-permission="'warehouse_BrandAuthentication_delete'" @click="deleteBrand(scope.row)">{{ $t("brand.delete") }}</el-button></span
                    >
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 确认删除该品牌吗 -->
    <BmDialog v-model:visible="visible" :confirm="confirm" :cancel="cancel" :width="600">
        <div>{{ $t("brand.sureDelete") }}?</div>
    </BmDialog>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />

    <!-- 查看详情 -->
    <Detail v-model:visible="detailVisible" :row="detailRow" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject, toRaw } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { productBrandSellerList, productBrandDelete, productSellerListStatistical } from "@/api/goods";
import AddEdit from "./component/addEdit";
import Detail from "./component/detail";

export default {
    name: "BrandAuthentication",
    components: { AddEdit, Detail },
    setup(props) {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const router = useRouter();
        const dict = inject("dict"); //数据字典

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        let multipleTable = ref(null);
        let multipleSelection = ref([]);
        let tableLoading = ref(true);

        let visible = ref(false);

        let checkboxGroup = ref([]);

        let status = ref(""); // 筛选状态

        let tableData = ref([]);

        let brandList = ref({});
        const getBrandCount = () => {
            productSellerListStatistical().then((res) => {
                brandList.value = res.data;
            });
        };
        getBrandCount();

        const initData = () => {
            getBrandCount();
            productBrandSellerList({ pageNum: pageNum.value, pageSize, status: status.value })
                .then((res) => {
                    tableLoading.value = false;
                    tableData.value = res.data.records;
                    pageTotal.value = res.data.total;
                })
                .catch(() => {});
        };
        initData();

        // 表格选择
        const handleSelectionChange = (val) => {
            multipleSelection.value = val;
        };

        // 切换筛选状态
        const handleChangeStatus = (val) => {
            status.value = val;
            initData();
        };

        //当前页
        const handleCurrentChange = (val) => {
            pageNum.value = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            pageNum.value = 1;
            pageSize = val;
            initData();
        };

        // const handleAddEdit = (val) => {
        //     router.push({ path: "/storeManage/addBrand", query: { id: val.id } });
        // };

        // const editBrand = (val) => {
        //     router.push({ path: "/storeManage/addBrand", query: { id: val.id, isEdit: true } });
        // };

        // const addBrand = (val) => {
        //     router.push({ path: "/storeManage/addBrand", query: { isEdit: true, isAdd: true } });
        // };

        //新增编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {};
            } else if (type === "edit") {
                editRow.value = row;
            }
            editVisible.value = true;
        };

        //详情
        let detailVisible = ref(false);
        let detailRow = ref({});
        const handleDetail = (row) => {
            detailRow.value = row;
            detailVisible.value = true;
        };

        // 删除品牌
        let id = "";
        const deleteBrand = (val) => {
            visible.value = true;
            id = val.id;
        };

        // 确认删除备注
        const confirm = () => {
            console.log(id);
            productBrandDelete(id).then((res) => {
                proxy.$message.success(res.msg);
                visible.value = false;
                initData();
            });
        };

        const cancel = () => {
            visible.value = false;
        };

        return {
            initData,
            pageNum,
            pageSize,
            pageTotal,
            status,
            multipleSelection,
            multipleTable,
            tableLoading,
            tableData,
            handleSelectionChange,
            checkboxGroup,
            handleCurrentChange,
            handleSizeChange,
            handleChangeStatus,
            deleteBrand,
            editVisible,
            editRow,
            handleAddEdit,
            detailVisible,
            detailRow,
            handleDetail,
            getBrandCount,
            brandList,
            visible,
            confirm,
            cancel
        };
    }
};
</script>

<style lang="scss" scoped>
.table_title {
    border: 1px solid #edebed;
    border-bottom: none;
    height: 54px;
    padding: 20px 25px 20px 25px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin: 0;
    margin-left: 15px;
}
.el-checkbox.is-bordered.el-checkbox--small {
    margin: 0;
}
.tableImg {
    width: 59px;
    height: 59px;
}
</style>
