<template>
    <div class="top-search-form">
        <BmBreadcrumb />
    </div>

    <div class="p-25 mb-20 bg-white round-4">
        <div class="flex vcenter mb-15">
            <!-- 发货地址 -->
            <div class="flex vcenter fw fs-14">{{ $t("address.shipAddress") }}</div>
            <!-- +添加 -->
            <el-button v-permission="'commodity_conveyTools_add'" @click="add(1)" class="ml-15" type="primary" plain>{{ $t("address.add") }}</el-button>
        </div>
        <template v-if="sendAddress && sendAddress.length > 0">
            <BmTable :data="sendAddress" border style="width: 100%" class="mb-30">
                <!-- 发件人 -->
                <BmTableColumn fixed prop="name" :label="$t('address.addresser')" width="180" align="center"> </BmTableColumn>
                <BmTableColumn prop="phone" :label="$t('address.phone')" width="140" align="center">
                    <template #default="scope">
                        {{ scope.row.phonePrefix }}<span class="ml-5">{{ scope.row.phone }}</span>
                    </template>
                </BmTableColumn>
                <!-- 所在地区 -->
                <BmTableColumn prop="provinceName" :label="$t('address.area')" align="center">
                    <template #default="scope"> {{ scope.row.provinceName }}{{ scope.row.cityName }}{{ scope.row.districtName }} </template>
                </BmTableColumn>
                <!-- 详细地址 -->
                <BmTableColumn prop="address" :label="$t('address.detailAddress')" align="center"> </BmTableColumn>
                <BmTableColumn prop="address" :label="$t('address.operation')" width="180" align="center">
                    <template #default="scope">
                        <div class="green">
                            <!-- 编辑 删除  设为默认-->

                            <el-button type="text" v-permission="'commodity_conveyTools_edit'" @click="editAddress(scope.row, 1)">{{ $t("address.edit") }}</el-button>

                            <el-button type="text" v-permission="'commodity_conveyTools_del'" @click="deleteAddress(scope.row)" :disabled="scope.row.isDefault == 1">
                                {{ $t("address.delete") }}
                            </el-button>

                            <el-button type="text" v-permission="'commodity_conveyTools_setDefault'" :disabled="scope.row.isDefault == 1" @click="setDefaultAddress(scope.row)">
                                {{ $t("address.SetDefault") }}
                            </el-button>
                        </div>
                    </template>
                </BmTableColumn>
            </BmTable>
        </template>
        <BmNoData v-else />
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex vcenter mb-15">
            <!-- 退货地址 +添加 -->
            <div class="flex vcenter fw fs-14">
                FBM{{ $t("address.returnAddress") }}
                <el-popover placement="top" trigger="hover">
                    <template #reference>
                        <i class="el-icon-question fs-14"></i>
                    </template>
                    {{ $t("address.returnAddressInfo") }}
                </el-popover>
            </div>
            <el-button @click="add(2)" class="ml-15" type="primary" plain>{{ $t("address.add") }}</el-button>
        </div>
        <template v-if="returnAddress && returnAddress.length > 0">
            <BmTable :data="returnAddress" border style="width: 100%">
                <!-- 收件人 -->
                <BmTableColumn fixed prop="name" :label="$t('address.recipients')" width="160" align="center"> </BmTableColumn>
                <BmTableColumn prop="phone" :label="$t('address.phone')" width="180" align="center">
                    <template #default="scope">
                        {{ scope.row.phonePrefix }}<span class="ml-5">{{ scope.row.phone }}</span>
                    </template>
                </BmTableColumn>
                <!-- 所在地区 -->
                <BmTableColumn prop="provinceName" :label="$t('address.area')" align="center">
                    <template #default="scope"> {{ scope.row.provinceName }}{{ scope.row.cityName }}{{ scope.row.districtName }} </template>
                </BmTableColumn>
                <!-- 详细地址 -->
                <BmTableColumn prop="address" :label="$t('address.detailAddress')" align="center"> </BmTableColumn>
                <BmTableColumn prop="address" :label="$t('address.operation')" width="180" align="center">
                    <template #default="scope">
                        <!-- 编辑 删除 设为默认-->
                        <el-button type="text" v-permission="'commodity_conveyTools_edit'" @click="editAddress(scope.row, 2)">{{ $t("address.edit") }}</el-button>

                        <el-button type="text" v-permission="'commodity_conveyTools_del'" @click="deleteAddress(scope.row)" :disabled="scope.row.isDefault == 1">
                            {{ $t("address.delete") }}
                        </el-button>

                        <el-button type="text" v-permission="'commodity_conveyTools_setDefault'" :disabled="scope.row.isDefault == 1" @click="setDefaultAddress(scope.row)">
                            {{ $t("address.SetDefault") }}
                        </el-button>
                    </template>
                </BmTableColumn>
            </BmTable>
        </template>
        <BmNoData v-else />
    </div>

    <BmDialog v-model:visible="state.centerDialogVisible" :title="state.title" :confirm="submitForm" :cancel="cancelClose" :width="800">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="auto">
            <!-- 发件人 -->
            <el-form-item v-if="state.status == 1" :label="$t('address.addresser') + ':'" prop="name">
                <el-input v-model="form.name" maxlength="255" show-word-limit></el-input>
            </el-form-item>
            <!-- 收件人 -->
            <el-form-item v-if="state.status == 2" :label="$t('address.recipients') + ':'" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!-- 选择地区 -->
            <el-form-item :label="$t('address.selectArea') + ':'" prop="value">
                <!-- 当前站点 -->
                <!-- <el-cascader v-if="storeInfo.tradeForm == 1" v-model="form.value" ref="addressListRef" @change="onChangeTradeForm" :props="addressListOptions.props" /> -->
                <!-- 全球站点 v-if="storeInfo.tradeForm == 2"-->
                <el-cascader v-model="form.value" ref="addressListRef" @change="onChangeTradeForm" :props="addressList.props" />
            </el-form-item>
            <!-- 详细地址 -->
            <el-form-item :label="$t('address.detailAddress') + ':'" prop="address">
                <el-input type="textarea" v-model="form.address" rows="5" show-word-limit maxlength="500" resize="none"></el-input>
            </el-form-item>
            <!-- 手机号码 -->
            <el-form-item :label="$t('address.phone') + ':'" prop="phone">
                <el-input :placeholder="$t('address.EnterContent')" v-model="form.phone" class="input-with-select" maxlength="20" show-word-limit oninput="value=value.replace(/[^\d]/g,'')">
                    <template #prepend>
                        <el-select v-model="form.phonePrefix" filterable :placeholder="$t('pleaseSelect')">
                            <el-option v-for="item in prefixPhone" :label="item.phonePrefix" :value="item.phonePrefix" :key="item.phonePrefix"></el-option>
                        </el-select>
                    </template>
                </el-input>
            </el-form-item>
            <!-- "之后获取"  "获取验证码" -->
            <!-- <el-form-item :label="$t('address.code') + ':'" prop="smsCode">
                <div class="flex vcenter">
                    <el-input v-model="form.smsCode" oninput="value=value.replace(/[^\d]/g,'')" maxlength="6"></el-input>
                    <div class="ml-15">
                        <el-button @click="getMessage" type="primary">{{ isCountdown ? count.count + "S" + $t("address.AfterObtaining") : $t("address.getCode") }}</el-button>
                    </div>
                </div>
            </el-form-item> -->
            <el-form-item>
                <!-- 设为默认地址 -->
                <el-checkbox :true-label="1" :false-label="0" v-model="form.isDefault">{{ $t("address.setDefaultAddress") }}</el-checkbox>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, toRefs, getCurrentInstance, onMounted, nextTick, computed, watch } from "vue";
import { useStore } from "vuex";
import {
    umsQuerySendAddress,
    umsQueryRefundAddress,
    adminUmsSetDefaultAddress,
    adminUmsAddressDelete,
    adminUmsDeliveryAddressUpdate,
    basicsAreaFindAreasTree,
    basicsAreaFindByParentId,
    adminUmsAddressSave,
} from "@/api/goods";
import { basePhonePrefix, getPhoneCode } from "@/api/user";
export default {
    name: "conveyTools",
    setup() {
        let { proxy } = getCurrentInstance();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            getBasePhonePrefix();
            getumsQuerySendAddress();
            getumsQueryRefundAddress();
        });
        const storeInfo = store.state.user.storeInfo;

        let checked = ref(false);

        const state = reactive({
            title: "",
            content: "",
            centerDialogVisible: false,
            status: "", // 1 发货 2退货
        });

        let form = ref({
            address: "", //	详细地址
            cityCode: "", //	市编码
            cityName: "", //	市名称
            countryCode: "", //	国家编码
            countryName: "", //	国家名称
            createTime: "", //	创建时间
            districtCode: "", //	区编码
            districtName: "", //	区/县名称
            id: "", //	主键ID
            isDefault: 0, //	是否是默认地址：1：是：0：不是
            name: "", //	发件人或者收货人姓名
            phone: "", //	手机号
            phonePrefix: proxy.$store.state.app.phonePrefix, //	手机号前缀
            provinceCode: "", //	省编码
            provinceName: "", //	省编码
            status: "", //	状态（0禁用 1启用）
            storeId: "", //	商铺ID
            tag: "", //	标签，家/公司/学校/自定义
            type: "", //	类型（1收货地址 2退货地址
            updateTime: "",
            smsCode: "",
            value: [], //地区
            areaList: [], //地区label
        });

        // 手机号前缀：
        const prefixPhone = ref([]);
        //获取手机前缀
        const getBasePhonePrefix = () => {
            basePhonePrefix(0)
                .then((res) => {
                    prefixPhone.value = res.data;
                })
                .catch((err) => {});
        };
        getBasePhonePrefix();

        let select = ref("");

        let rules = reactive({
            // "请输入发件人名称"
            name: [{ required: true, message: proxy.$t("address.EnterSenderName"), trigger: "blur" }],
            phone: [
                { required: true, message: proxy.$t("address.EnterPhoneNumber"), trigger: "blur" },
                { min: 5, max: 18, message: proxy.$t("address.lengthCheck", { min: 6, max: 30 }), trigger: "blur" },
            ],
            value: [{ type: "array", required: true, message: proxy.$t("address.selectAddressArea"), trigger: "change" }],
            smsCode: [{ required: true, message: proxy.$t("address.SMSCode"), trigger: "blur" }],
        });

        let ruleFormRef = ref(null);

        let timer = null;
        let count = reactive({ count: 60 });
        const isCountdown = ref(false);

        // 获得短信验证码
        const getMessage = () => {
            if (isCountdown.value) {
                return;
            }

            // var reg = /^1[3456789][0-9]{9}$/;
            // if (!reg.testform.phone)) {
            //     proxy.$message.error('您的手机号格式不对');
            //     return
            // };
            if (form.value.phone.length < 6) {
                // "您的手机号格式不对"
                proxy.$message.error(proxy.$t("address.phoneWrongFormat"));
                return;
            }

            isCountdown.value = true;

            timer = setInterval(() => {
                console.log(count.count);
                count.count--;
                if (count.count > 0) {
                    count.count = count.count--;
                } else {
                    clearInterval(timer);
                    count.count = 60;
                    isCountdown.value = false;
                }
            }, 1000);

            // 发送请求
            let data = {
                phone: form.value.phone,
                phonePrefix: form.value.phonePrefix,
                userType: "seller",
                type: 0,
            };

            // 发送请求
            getPhoneCode(data)
                .then((res) => {
                    console.log(res);
                    if (res.code == 0) {
                        // "获取验证码成功"
                        proxy.$message.success(proxy.$t("address.codeSuccess"));
                        form.value.smsCode = res.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        let sendAddress = ref([]);
        let returnAddress = ref([]);

        // 获取发货地址
        const getumsQuerySendAddress = () => {
            umsQuerySendAddress()
                .then((res) => {
                    sendAddress.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getumsQuerySendAddress();

        // 获取退货地址
        const getumsQueryRefundAddress = () => {
            umsQueryRefundAddress()
                .then((res) => {
                    returnAddress.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getumsQueryRefundAddress();

        // 区分 是编辑还是新增
        let tmp = ""; // 1是新增 2是编辑

        // 添加
        const add = (val) => {
            state.centerDialogVisible = !state.centerDialogVisible;
            form.value = {
                phonePrefix: proxy.$store.state.app.phonePrefix, //	手机号前缀
                value: [], //地区
                areaList: [], //地区label
                isDefault: 0,
                type: val,
            };
            state.status = val;
            if (val == 1) {
                // "新增发货地址"
                state.title = proxy.$t("address.AddShippingAddress");
            } else {
                // "新增退货地址"
                state.title = proxy.$t("address.NewReturnAddress");
            }
            tmp = 1;
        };

        // 编辑
        const editAddress = (row, val) => {
            // form.value.type = val;
            // form.value.id = row.id;
            state.status = val;
            tmp = 2;
            if (val == 1) {
                // "编辑发货地址"
                state.title = proxy.$t("address.editShipAddress");
                form.value = {
                    ...row,
                    value: [row.countryCode, row.provinceCode, row.cityCode, row.districtCode], //	国家编码 省编码	市编码	区编码
                };
            } else {
                // "编辑退货地址"
                state.title = proxy.$t("address.editReturnAddress");
                form.value = {
                    ...row,
                    value: [row.countryCode, row.provinceCode, row.cityCode, row.districtCode], //	国家编码 省编码	市编码	区编码
                };
            }
            state.centerDialogVisible = !state.centerDialogVisible;
        };

        // 新增提交
        const submitConfirm = () => {
            ruleFormRef.value.validate((valid) => {
                if (valid) {
                    let formSub = {
                        ...form.value,
                        cityCode: form.value.value[2], //	市编码
                        countryCode: form.value.value[0], //	国家编码
                        districtCode: form.value.value[3], //	区编码
                        provinceCode: form.value.value[1], //	省编码
                    };
                    const loading = proxy.$loading();
                    adminUmsAddressSave(formSub)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            ruleFormRef.value.resetFields();

                            state.centerDialogVisible = !state.centerDialogVisible;
                            getumsQuerySendAddress();
                            getumsQueryRefundAddress();
                            clearInterval(timer);
                            count.count = 60;
                            isCountdown.value = false;
                            loading.close();
                        })
                        .catch((err) => {
                            console.log(err);
                            loading.close();
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        // 编辑提交
        const updateAddress = () => {
            ruleFormRef.value.validate((valid) => {
                if (valid) {
                    let formSub = {
                        ...form.value,
                        // address: form.value.address, //	详细地址
                        // id: form.value.id, //	主键ID
                        // isDefault: form.value.isDefault, //	是否是默认地址：1：是：0：不是
                        // name: form.value.name, //	发件人或者收货人姓名
                        // phone: form.value.phone, //	手机号
                        // phonePrefix: form.value.phonePrefix, //	手机号前缀
                        // type: form.value.type, //	类型（1收货地址 2退货地址
                        // smsCode: form.value.smsCode,
                        cityCode: form.value.value[2], //	市编码
                        countryCode: form.value.value[0], //	国家编码
                        districtCode: form.value.value[3], //	区编码
                        provinceCode: form.value.value[1], //	省编码
                    };
                    const loading = proxy.$loading();
                    adminUmsDeliveryAddressUpdate(formSub)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            ruleFormRef.value.resetFields();
                            clearInterval(timer);
                            count.count = 60;
                            isCountdown.value = false;

                            state.centerDialogVisible = !state.centerDialogVisible;
                            getumsQuerySendAddress();
                            getumsQueryRefundAddress();
                            loading.close();
                        })
                        .catch((err) => {
                            console.log(err);
                            loading.close();
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        // 提交
        const submitForm = () => {
            if (tmp == 1) {
                submitConfirm();
            } else {
                updateAddress();
            }
        };

        // 取消
        const cancelClose = () => {
            nextTick(() => {
                ruleFormRef.value.resetFields();
                clearInterval(timer);
                count.count = 60;
                isCountdown.value = false;
            });
        };

        // 设为默认地址
        const setDefaultAddress = (id) => {
            const loading = proxy.$loading();
            adminUmsSetDefaultAddress(id.id)
                .then((res) => {
                    proxy.$message.success(res.msg);
                    getumsQuerySendAddress();
                    getumsQueryRefundAddress();
                    loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                });
        };

        // 删除
        const deleteAddress = (id) => {
            const loading = proxy.$loading();
            adminUmsAddressDelete(id.id)
                .then((res) => {
                    proxy.$message.success(res.msg);
                    getumsQuerySendAddress();
                    getumsQueryRefundAddress();
                    loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                });
        };

        const filterData = (val) => {
            val.forEach((item) => {
                if (item.aresChilds && item.aresChilds.length > 0) {
                    return filterData(item.aresChilds);
                } else {
                    item.aresChilds = null;
                }
            });
        };

        // 地址树
        // let options = ref([]);
        // const getAddress = () => {
        //     basicsAreaFindAreasTree({ isCurrentSite: 1 })
        //         .then((res) => {
        //             filterData(res.data);
        //             options.value = res.data;
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         });
        // };
        // getAddress();

        const addressListOptions = reactive({
            props: {
                lazy: true,
                lazyLoad(node, resolve) {
                    const { level, data } = node;
                    // status 0 过滤已删除 1正常 不传 全部 isCurrentSite 0其他国家 1当前站点国家 不传全部
                    basicsAreaFindByParentId({ parentId: data.id || 0, isCurrentSite: 1, status: 0 })
                        .then((res) => {
                            const nodes = res.data.map((item) => ({
                                id: item.id,
                                value: item.code,
                                label: item.name,
                                leaf: item.hasChild !== 1, //item.hasChilds
                            }));
                            resolve(nodes);
                        })
                        .catch((err) => {});
                },
            },
        });

        const addressList = reactive({
            props: {
                lazy: true,
                lazyLoad(node, resolve) {
                    const { level, data } = node;
                    basicsAreaFindByParentId({ parentId: data.id || 0, status: 0 })
                        .then((res) => {
                            const nodes = res.data.map((item) => ({
                                id: item.id,
                                value: item.code,
                                label: item.name,
                                leaf: item.hasChild !== 1, //item.hasChilds
                            }));
                            resolve(nodes);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                },
            },
        });

        //改变选择地区
        let addressListRef = ref(null);
        const onChangeTradeForm = (val) => {
            const labels = proxy.addressListRef.getCheckedNodes();
            if (labels && labels.length) {
                form.value.areaList = labels[0].pathLabels;
            }
        };

        return {
            prefixPhone,
            state,
            form,
            submitConfirm,
            cancelClose,
            select,
            checked,
            rules,
            submitForm,
            ruleFormRef,
            getMessage,
            count,
            isCountdown,
            add,
            sendAddress,
            returnAddress,
            setDefaultAddress,
            deleteAddress,
            updateAddress,
            // getAddress,
            // options,
            editAddress,
            addressList,
            storeInfo,
            addressListOptions,
            addressListRef,
            onChangeTradeForm,
            // beforeClose
        };
    },
};
</script>

<style lang="scss" scoped>
.disabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
}

/deep/ .el-input-group__prepend {
    width: 100px;
}
/deep/.el-select .el-input {
    width: 100px;
}
/deep/.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>
