<template>
    <div class="top-search-form">
        <BmBreadcrumb />
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
            </div>
            <div class="flex vstart"></div>
        </div>

        <BmTable :data="tableData" v-loading="tableLoading">
            <BmTableColumn prop="roleName" :label="$t('systemRole.roleName')"> </BmTableColumn>
            <!-- <BmTableColumn prop="roleCode" :label="$t('systemRole.roleCode')"> </BmTableColumn> -->
            <BmTableColumn prop="roleDesc" :label="$t('systemRole.roleDesc')"> </BmTableColumn>
            <BmTableColumn prop="createTime" :label="$t('systemRole.createTime')"></BmTableColumn>
            <BmTableColumn :label="$t('table.operation')" width="120">
                <template #default="scope">
                    <!-- 编辑 -->
                    <el-button @click="handleAddEdit('edit', scope.row)" type="text">
                        {{ $t("status.edit") }}
                    </el-button>
                    <!-- 删除 -->
                    <el-button @click="handleDelete(scope.row)" type="text">
                        {{ $t("status.delete") }}
                    </el-button>
                </template>
            </BmTableColumn>
        </BmTable>
    </div>

    <!-- 新增编辑 -->
    <AddEdit v-if="editVisible" v-model:visible="editVisible" :row="editRow" @reloadData="initData" />
</template>

<script>
import { ref, computed, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { roleFind, roleDelete } from "@/api/system";
import AddEdit from "./component/addEdit";

export default {
    name: "systemRole",
    components: { AddEdit },
    setup() {
        const { proxy } = getCurrentInstance();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            initData();
        });

        //状态
        const forbiddenEnable = computed(() => {
            return [
                {
                    name: proxy.$t("status.enable"),
                    value: 0
                },
                {
                    name: proxy.$t("status.forbidden"),
                    value: 1
                }
            ];
        });

        let tableLoading = ref(true);
        let tableData = ref([]);

        //获取列表
        const getListPage = () => {
            tableLoading.value = true;
            roleFind()
                .then((res) => {
                    tableData.value = res.data.records.map((item) => {
                        for (let i in forbiddenEnable.value) {
                            if (forbiddenEnable.value[i].value === item.status) {
                                item.statusName = forbiddenEnable.value[i].name;
                                break;
                            }
                        }
                        return item;
                    });
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
                editRow.value = {};
            } else if (type === "edit") {
                editRow.value = row;
            }
            editVisible.value = true;
        };

        //删除
        const handleDelete = (row) => {
            proxy
                .$confirm(proxy.$t("confirmDelete"), "", {
                    type: "warning"
                })
                .then(() => {
                    const loading = proxy.$loading();
                    roleDelete({ roleId: row.roleId })
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            initData();
                            loading.close();
                        })
                        .catch((err) => {
                            loading.close();
                        });
                })
                .catch(() => {});
        };

        return {
            forbiddenEnable,
            initData,
            tableData,
            tableLoading,
            editVisible,
            editRow,
            handleAddEdit,
            handleDelete
        };
    }
};
</script>
