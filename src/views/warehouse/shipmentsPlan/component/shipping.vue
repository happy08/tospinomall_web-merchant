<template>
    <!-- 立即发货 -->
    <BmDialog v-model:visible="visible" :title="$t('warehouse.delivery')" :confirm="confirm" :cancel="cancel" :width="600">
        <el-form ref="formRef" :model="form" label-width="auto">
            <el-form-item :label="$t('warehouse.consignNum')" :rules="commonRules.required" prop="backSn">
                <el-input v-model="form.backSn" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('warehouse.logisticsCompany')" prop="deliveryCompanyType" :rules="commonRules.required">
                <el-select v-model="form.deliveryCompanyType" :placeholder="$t('pleaseSelect')">
                    <el-option v-for="(item, index) in deliveryCompanyList" :key="index" :label="item.name" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <!-- 公司名称 -->
            <el-form-item v-if="form.deliveryCompanyType === 0" :label="$t('warehouse.companyName')" prop="deliveryCompany" :rules="commonRules.required">
                <el-input v-model="form.deliveryCompany"></el-input>
            </el-form-item>
            <!-- 物流单号 -->
            <el-form-item v-if="form.deliveryCompanyType !== -1" :label="$t('warehouse.trackingNumber')" prop="deliverySn" :rules="commonRules.required">
                <el-input v-model="form.deliverySn"></el-input>
            </el-form-item>
            <!-- 送货人姓名 -->
            <el-form-item v-if="form.deliveryCompanyType === -1" :label="$t('warehouse.delivererName')" prop="deliveryName" :rules="commonRules.required">
                <el-input v-model="form.deliveryName"></el-input>
            </el-form-item>
            <!-- 送货人电话 -->
            <el-form-item v-if="form.deliveryCompanyType === -1" :label="$t('warehouse.delivererPhone')" prop="deliveryPhone" :rules="commonRules.required">
                <el-input v-model="form.deliveryPhone"></el-input>
            </el-form-item>
            <!-- 货柜号 -->
            <el-form-item :label="$t('warehouse.containerNo')" prop="containerNum">
                <el-input v-model="form.containerNum"></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, inject, getCurrentInstance, watch, computed } from "vue";
import { productSellerDelivery } from "@/api/warehouse";

export default {
    name: "warehouseShipping",
    components: {},
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const dict = inject("dict"); //数据字典

        let form = reactive({
            deliveryCompanyType: 1
        });
        watch(
            () => props.row,
            (nVal) => {
                form.id = props.row.id;
                form.backSn = props.row.backSn;
            }
            //{ immediate: true }
        );

        //物流公司类型
        const deliveryCompanyList = computed(() => [
            {
                name: "Tospino",
                value: 1
            },
            {
                name: proxy.$t("warehouse.theirDistribution"),
                value: -1
            },
            {
                name: proxy.$t("warehouse.other"),
                value: 0
            }
        ]);

        const commonRules = {
            required: { required: true, message: proxy.$t("required"), trigger: "blur" }
        };

        const formRef = ref(null);
        const confirm = () => {
            formRef.value.validate((valid) => {
                if (valid) {
                    productSellerDelivery(form)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false);
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        };

        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            dict,
            deliveryCompanyList,
            form,
            commonRules,
            formRef,
            confirm,
            cancel
        };
    }
};
</script>
