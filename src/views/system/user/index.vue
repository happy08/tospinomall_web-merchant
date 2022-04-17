<template>
    <div class="top-search-form">
        <BmBreadcrumb />

        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="8">
                    <!-- 关键字 -->
                    <el-form-item :label="$t('systemUser.account')" prop="account">
                        <el-input v-model="searchForm.account" :placeholder="$t('systemUser.account')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="8">
                    <el-form-item :label="$t('email')" prop="email">
                        <el-input v-model="searchForm.email" :placeholder="$t('email')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="8">
                    <el-form-item :label="$t('phone')" prop="phone">
                        <el-input v-model="searchForm.phone" :placeholder="$t('phone')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between mb-10">
            <div>
                <div class="fl mb-10 mr-15">
                    <!-- 新增 -->
                    <el-button @click="handleAddEdit('add')" type="primary" icon="el-icon-plus">
                        {{ $t("status.add") }}
                    </el-button>
                </div>
                <div class="fl mb-10">
                    <!-- 批量操作 -->
                    <span>{{ $t("status.batchOperation") }}：</span>

                    <!-- 启用 -->
                    <el-button @click="handleOpenShield(1)">{{ $t("status.enable") }}</el-button>
                    <!-- 禁用 -->
                    <el-button @click="handleOpenShield(0)">{{ $t("status.forbidden") }}</el-button>
                </div>
            </div>
            <div class="flex vstart"></div>
        </div>

        <BmTable ref="multipleTable" :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange" @row-click="handleRowClick">
            <BmTableColumn type="selection"> </BmTableColumn>
            <BmTableColumn prop="status" :label="$t('systemUser.status')" width="120">
                <template #default="scope">
                    {{ scope.row.statusName }}
                </template>
            </BmTableColumn>
            <BmTableColumn prop="account" :label="$t('systemUser.account')"> </BmTableColumn>

            <BmTableColumn prop="roles" :label="$t('systemUser.roles')">
                <template #default="scope">
                    <span v-for="(item, index) in scope.row.roles" :key="item.roleId"> <span v-if="index !== 0"> /</span> {{ item.roleName }} </span>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="phone" :label="$t('systemUser.phone')"> </BmTableColumn>
            <BmTableColumn prop="remark" :label="$t('systemUser.remark')"> </BmTableColumn>

            <!-- 站点数据 -->
            <BmTableColumn v-for="item in siteInfo" :key="item.id" :prop="item.name" :label="item.name">
                <template #default="scope">
                    <span class="block">{{ scope.row.sellerWebsite[item.id] ? $t("b2cPlatform.alreadyOpened") : $t("b2cPlatform.nonactivated") }}</span>
                    <!-- 取消授权 -->
                    <el-button type="text" v-if="scope.row.sellerWebsite[item.id]" @click="handleChangeStatus(0, scope.row.id, item.key)">{{ $t("b2cPlatform.cancelAuthorization") }}</el-button>
                    <!-- 授权登录 -->
                    <el-button type="text" v-else @click="handleChangeStatus(2, scope.row.id, item.key)">{{ $t("b2cPlatform.authorizedLogin") }}</el-button>
                </template>
            </BmTableColumn>
            <BmTableColumn prop="categoryNum" :label="$t('table.operation')" width="100" fixed="right">
                <template #default="scope">
                    <!-- 编辑 -->
                    <el-button @click.stop="handleAddEdit('edit', scope.row)" type="text">
                        {{ $t("status.edit") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-model:visible="editVisible" :row="editRow" @reloadData="initData" :isEdit="edit" @initEdit="resetEdit" />
</template>

<script>
import { ref, toRefs, reactive, computed, watch, getCurrentInstance, inject } from "vue";
import { useStore } from "vuex";
import {
    userFindByConditions,
    userFindCurrentOrByIdSub,
    userBatchCloseUser,
    userBatchOpenUser,
    adminSellerBatchClose,
    adminSellerBatchOpen,
    getAllSiteInfo,
    adminWesiteSellerSon,
    adminWesiteSellerSave,
    adminWesiteAuth
} from "@/api/system";
import { adminDictType } from "@/api/goods";
import AddEdit from "./component/addEdit";

export default {
    name: "systemUser",
    components: { AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        let edit = ref(false);

        //分页
        let pageNo = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索条件
        let searchFormRef = ref(null);
        let searchForm = reactive({
            //keywords: "",
            account: "",
            pageNo: pageNo,
            pageSize: pageSize,
            phone: "",
            email: ""
        });
        //状态
        const forbiddenEnable = computed(() => {
            return {
                0: proxy.$t("status.enable"),
                1: proxy.$t("status.forbidden")
            };
        });
        //搜索
        const handelSearch = () => {
            initData();
        };
        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        let dictList = [];
        const getDict = () => {
            adminDictType("seller_account_status").then((res) => {
                dictList = res.data;
            });
        };
        getDict();

        const multipleTable = ref(null);
        let tableLoading = ref(true);
        let tableData = ref([]);

        // 站点信息
        let siteInfo = ref({});
        //获取列表
        const getListPage = () => {
            tableLoading.value = true;
            // 获取站点信息接口
            getAllSiteInfo()
                .then((res) => {
                    siteInfo.value = res.data;
                })
                .catch(() => {});
            // adminWesiteSellerSon()
            //     .then((res) => {
            //         //siteInfo.value = res.data;
            //     })
            //     .catch(() => {});
            //userFindCurrentOrByIdSub
            userFindCurrentOrByIdSub(searchForm)
                .then((res) => {
                    // tableData.value = res.data;
                    tableData.value = res.data.records;
                    pageTotal.value = res.data.total;
                    // tableData.value = res.data.records.map((item) => {
                    //     item.statusName = forbiddenEnable.value[item.status];
                    //     return item;
                    // });
                    tableLoading.value = false;
                    tableData.value = res.data.records.map((item) => {
                        dictList.forEach((v) => {
                            if (v.value == item.status) {
                                item.statusName = v.label;
                            }
                        });
                        return item;
                    });
                })
                .catch((err) => {
                    tableLoading.value = false;
                });
        };

        //初始化
        const initData = () => {
            edit.value = false;
            getListPage();
        };
        initData();

        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
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

        //新增编辑

        let editVisible = ref(false);
        let editRow = ref({});
        const handleAddEdit = (type, row) => {
            if (type === "add") {
                editRow.value = {};
            } else if (type === "edit") {
                editRow.value = row;
                edit.value = true; // 禁用账户编辑
            }

            editVisible.value = true;
        };

        //批量启用禁用
        const handleOpenShield = (type) => {
            let ids = "";

            if (tableSelectionRows.length === 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            ids = tableSelectionRows.map((item) => item.id);

            let api = adminSellerBatchClose;
            if (type === 1) {
                api = adminSellerBatchOpen;
            }
            const loading = proxy.$loading();
            api(ids)
                .then((res) => {
                    initData();
                    proxy.$message.success(res.msg);
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNo = val;
            initData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNo = 1;
            searchForm.pageSize = val;
            initData();
        };

        // 取消与授权站点
        const handleChangeStatus = (status, userId, siteKey) => {
            // status 授权状态 0 授权 2 取消授权     userId 用户id  websiteId 站点ID
            const loading = proxy.$loading();
            adminWesiteAuth({
                status,
                userId,
                siteKey
            })
                .then(() => {
                    initData();
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
        };

        const resetEdit = () => {
            edit.value = false;
        };

        return {
            forbiddenEnable,
            initData,
            pageNo,
            pageSize,
            pageTotal,
            searchFormRef,
            handelSearch,
            resetForm,
            searchForm,
            tableData,
            multipleTable,
            tableLoading,
            handleSelectionChange,
            handleRowClick,
            editVisible,
            editRow,
            handleAddEdit,
            handleOpenShield,
            handleSizeChange,
            handleCurrentChange,
            siteInfo,
            handleChangeStatus,
            edit,
            resetEdit
        };
    }
};
</script>
