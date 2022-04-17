<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <el-form-item :label="$t('systemRole.roleName')" prop="roleName">
                <el-input v-model="form.roleName" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('systemRole.roleCode')" prop="roleCode">
                <el-input v-model.number="form.roleCode"></el-input>
            </el-form-item> -->
            <el-form-item :label="$t('systemRole.roleDesc')" prop="roleDesc">
                <el-input v-model="form.roleDesc" type="textarea" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('systemRole.system')" prop="menuIds">
                <!-- <el-tree
                    ref="menuTree"
                    :data="menuList"
                    :default-checked-keys="form.menuIds"
                    :check-strictly="false"
                    :props="{
                        children: 'children',
                        label: 'name'
                    }"
                    @getCheckedKeys="getCheckedKeys"
                    :current-node-key="form.menuIds"
                    @check="getCurrentNode"
                    :key="updateType"
                    style="height:420px;overflow: auto;"
                    class="custom-scrollbar"
                    @check-change="handleCheckChange(false, true)"
                >
                </el-tree> -->
                <!-- <el-tree
                    ref="menuTree"
                    :data="treeData"
                    :default-checked-keys="checkedKeys"
                    :check-strictly="false"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    class="filter-tree"
                    node-key="id"
                    highlight-current
                    show-checkbox
                    default-expand-all/> -->
                <el-tree
                    ref="menuTree"
                    :data="menuList"
                    :default-checked-keys="form.menuIds"
                    :check-strictly="false"
                    :props="{
                        children: 'children',
                        label: 'name'
                    }"
                    node-key="menuId"
                    highlight-current
                    show-checkbox
                    default-expand-all
                    style="height:420px;overflow: auto;"
                    class="custom-scrollbar"
                />
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, getCurrentInstance, watch, computed } from "vue";
import { roleSave, roleUpdate, menuFindByStatus } from "@/api/system";

export default {
    name: "systemRole",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();

        let updateType = computed(() => (props.row && props.row.roleId ? "edit" : "add"));

        let form = ref({});
        const rules = {
            roleName: { required: true, message: proxy.$t("required"), trigger: "blur" }
            //roleCode: { required: true, message: proxy.$t("required"), trigger: "blur" },
        };

        //获取菜单列表
        let menuTree = ref(null);
        let menuList = ref([]);
        const getMenuFindByStatus = () => {
            menuFindByStatus().then((res) => {
                menuList.value = getTree(res.data.records);

                let menuIds = [];
                if (updateType.value === "edit") {
                    menuIds = props.row.menus.map((item) => item.menuId);
                    menuIds = resolveAllEunuchNodeId(menuList.value, menuIds, []);
                }
                form.value = { ...props.row, menuIds: menuIds };
            });
        };
        getMenuFindByStatus();

        function getTree(data) {
            // // 删除 所有 children,以防止多次调用
            // data.forEach(function(item) {
            //     delete item.children;
            // });

            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            let map = {};
            data.forEach(function(item) {
                map[item.menuId] = item;
            });

            let val = [];
            data.forEach(function(item) {
                let parent = map[item.parentId];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    val.push(item);
                }
            });
            return val;
        }

        /**
         * 解析出所有的太监节点id
         * @param json 待解析的json串
         * @param idArr 原始节点数组
         * @param temp 临时存放节点id的数组
         * @return 太监节点id数组
         */
        const resolveAllEunuchNodeId = (json, idArr, temp) => {
            for (let i = 0; i < json.length; i++) {
                const item = json[i];
                // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
                if (item.children && item.children.length !== 0) {
                    resolveAllEunuchNodeId(item.children, idArr, temp);
                } else {
                    temp.push(idArr.filter((menuId) => menuId === item.menuId));
                }
            }
            return temp;
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    const loading = proxy.$loading();
                    form.value.menuIds = proxy.menuTree.getCheckedKeys().concat(proxy.menuTree.getHalfCheckedKeys());

                    let type = roleUpdate;
                    if (updateType.value === "add") {
                        type = roleSave;
                    }
                    type(form.value)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false);
                            loading.close();
                        })
                        .catch(() => {
                            loading.close();
                        });
                } else {
                    return false;
                }
            });
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        const getCurrentNode = (nodeObj, selectObj) => {
            let flag = selectObj.checkedKeys.some((menuId) => {
                return menuId == nodeObj.menuId;
            });
            let addArry = [];
            // 勾选
            if (flag) {
                statusAllReverseElection(nodeObj, addArry);
                form.value.menuIds = [...new Set([...form.value.menuIds, ...addArry])];
            } else {
                // 反选
                // statusAllReverseElection(nodeObj, addArry);
                // addArry.forEach((item) => {
                //     let index = form.value.menuIds.indexOf(item);
                //     if (index) {
                //         form.value.menuIds.splice(index, 1);
                //     }
                // });
            }
            proxy.$forceUpdate();
        };

        // 递归循环,选/反选当前节点下面的子节点
        const statusAllReverseElection = (node, addArry) => {
            if (Array.isArray(node)) {
                node.forEach((item) => {
                    if (item.children && item.children.length) {
                        return statusAllReverseElection(item.children, addArry);
                    }
                    addArry.push(item.menuId);
                });
            } else {
                if (node.children) {
                    addArry.push(node.menuId);
                    return statusAllReverseElection(node.children, addArry);
                }
            }
        };

        const handleCheckChange = () => {
            return menuTree.value.getCheckedNodes().concat(menuTree.value.getHalfCheckedNodes());
        };

        return {
            updateType,
            form,
            rules,
            formRef,
            confirm,
            cancel,
            menuTree,
            menuList,
            getCurrentNode,
            handleCheckChange
        };
    }
};
</script>
