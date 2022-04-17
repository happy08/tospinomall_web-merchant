<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <el-form-item :label="$t('systemMenu.parent')" prop="parentId">
                <SelectionMenuTree
                    :data="cascaderData"
                    v-model:parentId="form.parentId"
                    :options="{
                        value: 'menuId',
                        label: 'name',
                        children: 'children'
                    }"
                />
            </el-form-item>
            <!-- 类型 -->
            <el-form-item :label="$t('systemMenu.type')" prop="type">
                <el-radio-group v-model="form.type">
                    <el-radio v-for="(item, index) in typeList" :key="index" :label="item.value">
                        {{ item.name }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('systemMenu.name')" prop="name">
                <el-input v-model="form.name" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <template v-if="form.type == 0">
                <el-form-item :label="$t('systemMenu.icon')" prop="icon">
                    <el-popover placement="top-start" :width="490" trigger="focus">
                        <template #reference>
                            <el-input v-model="form.icon" readonly></el-input>
                        </template>
                        <div>
                            <i v-for="item in iconList" :key="item" @click="form.icon = item" :class="item" class="fs-18 p-15"></i>
                        </div>
                    </el-popover>
                </el-form-item>
                <!-- 是否隐藏 -->
                <el-form-item :label="$t('systemMenu.whetherToHide')" prop="isHidden">
                    <el-radio-group v-model="form.isHidden">
                        <el-radio v-for="item in dict.yesNo" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 是否单个 -->
                <el-form-item :label="$t('systemMenu.single')" prop="isAlone">
                    <el-radio-group v-model="form.isAlone">
                        <el-radio v-for="item in dict.yesNo" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 是否头部显示 -->
                <el-form-item :label="$t('systemMenu.whetherHeadShow')" prop="isHeaderShow">
                    <el-radio-group v-model="form.isHeaderShow">
                        <el-radio v-for="item in dict.yesNo" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('systemMenu.keepAlive')" prop="keepAlive">
                    <el-radio-group v-model="form.keepAlive">
                        <el-radio v-for="(item, index) in yesNo" :key="index" :label="item.value">
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 网页URL-->
                <el-form-item :label="$t('systemMenu.path')" prop="path">
                    <el-input v-model="form.path"></el-input>
                </el-form-item>
                <!-- 组件路径 -->
                <el-form-item :label="$t('systemMenu.component')" prop="component">
                    <el-input v-model="form.component"></el-input>
                </el-form-item>
            </template>
            <template v-else>
                <!-- 按钮权限标识 -->
                <el-form-item :label="$t('systemMenu.system')" prop="permission">
                    <el-input v-model="form.permission"></el-input>
                </el-form-item>
            </template>
            <el-form-item :label="$t('systemMenu.sort')" prop="sort">
                <el-input v-model.number="form.sort" type="number"></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { menuSave, menuUpdate } from "@/api/system";
import SelectionMenuTree from "@/components/selectionMenuTree";

export default {
    name: "systemMenu",
    components: { SelectionMenuTree },
    props: {
        visible: Boolean,
        row: Object,
        tableData: Array
    },
    emits: ["update:visible", "reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); // 数据字典
        let updateType = computed(() => (props.row && props.row.menuId ? "edit" : "add"));

        //上级菜单
        let cascaderData = ref([
            {
                menuId: -1,
                name: proxy.$t("systemMenu.rootDirectory"),
                children: []
            }
        ]);
        watch(
            () => props.tableData,
            () => {
                cascaderData.value[0].children = props.tableData;
            }
        );

        //类型
        const typeList = computed(() => {
            return [
                {
                    name: proxy.$t("systemMenu.leftMenu"),
                    value: "0"
                },
                {
                    name: proxy.$t("systemMenu.button"),
                    value: "1"
                }
            ];
        });
        //是否
        const yesNo = computed(() => {
            return [
                {
                    name: proxy.$t("yes"),
                    value: "1"
                },
                {
                    name: proxy.$t("no"),
                    value: "0"
                }
            ];
        });

        let form = ref({});
        watch(
            () => props.row,
            (nVal) => {
                form.value = {
                    isHidden: 0, // 是否隐藏，0：否，1：是
                    isAlone: 0, // 是否单个，0：否，1：是
                    isHeaderShow: 0, // 是否头部显示，0：否，1：是
                    ...props.row
                };
            }
        );

        const rules = {
            parentId: {
                required: true,
                message: proxy.$t("pleaseSelect"),
                trigger: "blur"
            },
            type: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            name: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            sort: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            path: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            component: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            permission: {
                required: true,
                message: proxy.$t("required"),
                trigger: "blur"
            },
            keepAlive: {
                required: true,
                message: proxy.$t("pleaseSelect"),
                trigger: "blur"
            },
            isHidden: {
                required: true,
                message: proxy.$t("pleaseSelect"),
                trigger: "blur"
            },
            isAlone: {
                required: true,
                message: proxy.$t("pleaseSelect"),
                trigger: "blur"
            },
            isHeaderShow: {
                required: true,
                message: proxy.$t("pleaseSelect"),
                trigger: "blur"
            }
        };
        const iconList = [
            "el-icon-s-home",
            "el-icon-goods",
            "el-icon-school",
            "el-icon-refresh",
            "el-icon-delete",
            "el-icon-box",
            "el-icon-search",
            "el-icon-office-building",
            "el-icon-money",
            "el-icon-setting",
            "el-icon-user",
            "el-icon-picture-outline",
            "el-icon-edit",
            "el-icon-edit-outline",
            "el-icon-folder-add",
            "el-icon-document",
            "el-icon-document-checked",
            "el-icon-data-line",
            "el-icon-pie-chart",
            "el-icon-notebook-2",
            "el-icon-coin",
            "el-icon-bank-card",
            "el-icon-wallet",
            "el-icon-chat-round",
            "el-icon-chat-line-round",
            "el-icon-chat-line-square",
            "el-icon-chat-dot-square",
            "el-icon-message",
            "el-icon-postcard",
            "el-icon-copy-document",
            "el-icon-location-information",
            "el-icon-map-location",
            "el-icon-lock",
            "el-icon-unlock",
            "el-icon-truck",
            "el-icon-mobile-phone",
            "el-icon-cloudy"
        ];

        const formRef = ref(null);
        const confirm = () => {
            proxy
                .$confirm(proxy.$t("systemMenu.saveTips"), {
                    type: "warning"
                })
                .then(() => {
                    formRef.value.validate((valid) => {
                        if (valid) {
                            let type = menuUpdate;
                            if (updateType.value === "add") {
                                type = menuSave;
                            }
                            // 添加按钮的时候将component设为空
                            if (form.value.type == 1) {
                                form.value.component = "";
                            }
                            type(form.value)
                                .then((res) => {
                                    emit("reloadData");
                                    emit("update:visible", false);
                                })
                                .catch(() => {});
                        } else {
                            return false;
                        }
                    });
                });
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            dict,
            updateType,
            cascaderData,
            typeList,
            yesNo,
            form,
            rules,
            formRef,
            iconList,
            confirm,
            cancel
        };
    }
};
</script>
