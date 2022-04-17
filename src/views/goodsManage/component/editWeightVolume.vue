<template>
    <BmDialog v-model:visible="visible" :title="title" :confirm="confirm" :cancel="cancel" :width="700">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
            <!-- 重量单位 -->
            <el-form-item :label="$t('releaseGoods.UnitWeight')" prop="weightUnit">
                <el-select v-model="form.weightUnit" class="w-100">
                    <el-option value="kg"></el-option>
                    <!-- <el-option value="g"></el-option> -->
                </el-select>
            </el-form-item>
            <!-- 重量 -->
            <el-form-item
                :label="$t('releaseGoods.weight')"
                prop="weight"
                :rules="
                    form.weightUnit == 'kg'
                        ? [
                              { required: true, message: $t('required'), trigger: 'blur' },
                              { validator: numberLimit3, trigger: 'blur' }
                          ]
                        : { required: true, message: $t('required'), trigger: 'blur' }
                "
            >
                <el-input v-model="form.weight" type="number" min="0"></el-input>
            </el-form-item>
            <!-- 尺寸单位 -->
            <el-form-item :label="$t('releaseGoods.measurementUnit')" prop="volumeUnit">
                <div class="flex">
                    <el-select v-model="form.volumeUnit" style="width:50%">
                        <el-option value="cm"></el-option>
                        <!-- <el-option value="m"></el-option> -->
                    </el-select>
                    <!-- 体积 -->
                    <span class="ml-20"> {{ $t("releaseGoods.volume") }}： {{ Math.ceil(total * 100) / 100 }} {{ form.volumeUnit }}³ </span>
                </div>
            </el-form-item>
            <!-- 长 -->
            <el-form-item :label="$t('releaseGoods.long')" prop="length">
                <el-input v-model="form.length" type="number" min="0"></el-input>
            </el-form-item>
            <!-- 宽 -->
            <el-form-item :label="$t('releaseGoods.wide')" prop="width">
                <el-input v-model="form.width" type="number" min="0"></el-input>
            </el-form-item>
            <!-- 高 -->
            <el-form-item :label="$t('releaseGoods.high')" prop="height">
                <el-input v-model="form.height" type="number" min="0"></el-input>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, watch, computed, getCurrentInstance } from "vue";

export default {
    name: "editWeightVolume",
    props: {
        visible: Boolean,
        title: String,
        row: [Object, String],
        type: String
    },
    emits: ["change", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        let form = ref({
            weightUnit: "kg",
            weight: "",
            volumeUnit: "cm",
            length: "",
            width: "",
            height: ""
        });

        let isBatch = false;

        let nVal = props.row;
        if (nVal) {
            form.value = {
                weightUnit: nVal[props.type + "WeightUnit"],
                weight: nVal[props.type + "Weight"],
                volumeUnit: nVal[props.type + "VolumeUnit"],
                length: nVal[props.type + "VolumeLength"],
                width: nVal[props.type + "VolumeWidth"],
                height: nVal[props.type + "VolumeHeight"]
            };
        } else {
            isBatch = true;
        }

        const total = computed(() => {
            return form.value.length * form.value.width * form.value.height || 0;
        });

        //验证只支持一位小数
        const numberLimit1 = (rule, value, callback) => {
            var reg = /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,1})?$)/;
            if (value <= 0) {
                callback(new Error(proxy.$t("releaseGoods.pleaseEnterBig0")));
            } else if (!reg.test(Number(value))) {
                callback(new Error(proxy.$t("releaseGoods.onlySupportsPersonDecimal", { num: 1 })));
            } else {
                callback();
            }
        };

        //验证只支持四位小数
        const numberLimit3 = (rule, value, callback) => {
            var reg = /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,4})?$)/;
            if (value <= 0) {
                callback(new Error(proxy.$t("releaseGoods.pleaseEnterBig0")));
            } else if (!reg.test(Number(value))) {
                callback(new Error(proxy.$t("releaseGoods.onlySupportsPersonDecimal", { num: 4 })));
            } else {
                callback();
            }
        };

        const rules = {
            weightUnit: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" },
            weight: [{ validator: numberLimit3, trigger: "blur" }],
            volumeUnit: { required: true, message: proxy.$t("pleaseSelect"), trigger: "change" },
            length: [
                { required: true, message: proxy.$t("required"), trigger: "blur" },
                { validator: numberLimit1, trigger: "blur" }
            ],
            width: [
                { required: true, message: proxy.$t("required"), trigger: "blur" },
                { validator: numberLimit1, trigger: "blur" }
            ],
            height: [
                { required: true, message: proxy.$t("required"), trigger: "blur" },
                { validator: numberLimit1, trigger: "blur" }
            ]
        };

        const formRef = ref(null);
        const confirm = () => {
            // formRef.value.resetFields();
            // return;
            formRef.value.validate((valid) => {
                if (valid) {
                    emit("update:visible", false);
                    emit("change", form.value, isBatch);
                    formRef.value.resetFields();
                } else {
                    return false;
                }
            });
        };

        const cancel = () => {
            emit("update:visible", false);
            formRef.value.resetFields();
        };

        return {
            form,
            total,
            numberLimit3,
            rules,
            formRef,
            confirm,
            cancel
        };
    }
};
</script>
