<template>
    <div v-show="!fitmentVisible && !previewVisible">
        <div class="top-search-form">
            <BmBreadcrumb />

            <el-button-group class="mb-5">
                <el-button v-for="(item, index) in dict.storePageList" :key="index" @click="handleChangePage(item.value)" :type="item.value === searchForm.pageType ? 'primary' : ''">
                    {{ item.name }}
                </el-button>
            </el-button-group>
        </div>

        <div class="p-25 bg-white round-4">
            <div class="flex between mb-10">
                <div class="fl mb-10">
                    <!-- 新增 -->
                    <el-button v-permission="'warehouse_storeDesign_add'" @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("status.add") }}
                    </el-button>
                </div>
            </div>
            <BmTable ref="multipleTable" :data="tableData" v-loading="tableLoading">
                <BmTableColumn prop="name" :label="$t('storeDesignTable.name')"> </BmTableColumn>
                <BmTableColumn prop="updateUser" :label="$t('storeDesignTable.updateUser')"> </BmTableColumn>
                <BmTableColumn prop="status" :label="$t('storeDesignTable.status')">
                    <template #default="scope">
                        {{ scope.row.status === 1 ? $t("storeDesign.released") : $t("storeDesign.draft") }}
                    </template>
                </BmTableColumn>
                <BmTableColumn :label="$t('table.operation')" width="250px">
                    <template #default="scope">
                        <!-- 编辑 -->
                        <el-button v-permission="'warehouse_storeDesign_edit'" @click="handleAddEdit('edit', scope.row)" type="text">
                            {{ $t("status.edit") }}
                        </el-button>
                        <el-button v-permission="'warehouse_storeDesign_Publish'" @click="handlePublish(scope.row)" :disabled="scope.row.status === 1" type="text">
                            {{ $t("storeDesign.publish") }}
                        </el-button>
                        <el-button v-permission="'warehouse_storeDesign_Fitment'" @click="handleFitment(scope.row)" type="text">
                            {{ $t("storeDesign.fitment") }}
                        </el-button>
                        <el-button v-permission="'warehouse_storeDesign_Preview'" @click="handlePreview(scope.row)" type="text">
                            {{ $t("storeDesign.preview") }}
                        </el-button>
                        <el-button v-permission="'warehouse_storeDesign_delete'" @click="handleDelete(scope.row)" :disabled="scope.row.status === 1" type="text">
                            {{ $t("status.delete") }}
                        </el-button>
                    </template>
                </BmTableColumn>
            </BmTable>
        </div>
    </div>
    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import { storeStylesGetListPage, storeStylesRemoveId, storeStylesPublishNow } from "@/api/storeDesign";
import AddEdit from "./component/addEdit";

export default {
    name: "storeListIndex",
    components: { AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();
        const dict = inject("dict"); //数据字典

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //搜索条件
        let searchForm = reactive({
            pageType: 1 //页面类型（1PC端页面 2手机端页面 3专题页）
        });
        const handleChangePage = (type) => {
            searchForm.pageType = type;
            initData();
        };

        const multipleTable = ref(null);
        let tableLoading = ref(true);
        let tableData = ref([]);

        //获取列表
        const getListPage = () => {
            tableLoading.value = true;
            storeStylesGetListPage(searchForm)
                .then((res) => {
                    tableData.value = res.data;
                    tableLoading.value = false;
                })
                .catch((err) => {
                    tableLoading.value = false;
                });
        };

        //初始化
        const initData = () => {
            getListPage();
        };
        initData();

        //新增编辑
        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {
                    pageType: searchForm.pageType
                };
            } else if (type === "edit") {
                editRow.value = row;
            }
            editVisible.value = true;
        };

        //立即发布
        const handlePublish = (row) => {
            storeStylesPublishNow(row)
                .then((res) => {
                    initData();
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
        };

        //删除
        // const handleDelete = () => {
        //     if (tableSelectionRows.length === 0) {
        //         proxy.$message.error(proxy.$t("table.selectLeastOne"));
        //         return;
        //     }
        //     const ids = tableSelectionRows.map((item) => item.id).join("_");
        //     storeStylesRemoveId(ids)
        //         .then((res) => {
        //             initData();
        //             proxy.$message.success(res.msg);
        //         })
        //         .catch((err) => {});
        // };

        //删除
        const handleDelete = (row) => {
            const ids = [row.id];
            storeStylesRemoveId(ids)
                .then((res) => {
                    initData();
                    proxy.$message.success(res.msg);
                })
                .catch((err) => {});
        };

        //装修
        const handleFitment = (row) => {
            window.open(window.location.origin + window.location.pathname + `#/storeManage/storeDesign/storeFitment?type=fitment&pageType=${row.pageType}&name=${row.name}&id=${row.id}`);
        };

        //预览
        const handlePreview = (row) => {
            window.open(window.location.origin + window.location.pathname + `#/storeManage/storeDesign/storeFitment/preview?type=preview&pageType=${row.pageType}&name=${row.name}&id=${row.id}`);
        };

        return {
            dict,
            initData,
            searchForm,
            handleChangePage,
            tableData,
            multipleTable,
            tableLoading,
            editVisible,
            editRow,
            handleAddEdit,
            handlePublish,
            handleDelete,

            handlePreview,
            handleFitment
        };
    }
};
</script>
