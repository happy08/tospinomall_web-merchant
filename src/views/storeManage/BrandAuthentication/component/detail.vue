<template>
    <BmDialog v-model:visible="visible" :title="$t('table.detail')" @close="cancel" noConfirm top="5vh" width="1100px">
        <el-form :model="ruleForm" label-width="auto">
            <el-form-item :label="$t('brandAdd.registerType') + ':'" prop="type">
                <el-radio-group v-model="ruleForm.type" disabled>
                    <el-radio label="1">{{ $t("brandAdd.ownBrand") }}</el-radio>
                    <el-radio label="2">{{ $t("brandAdd.AuthorizedBrand") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandRegisterType') + ':'" prop="registerType">
                <el-radio-group v-model="ruleForm.registerType" disabled>
                    <el-radio label="1">{{ $t("brandAdd.noNaturalPerson") }}</el-radio>
                    <el-radio label="2">{{ $t("brandAdd.naturalPerson") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandName') + ':'" prop="brandName">
                {{ ruleForm.brandName }}
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandLogo') + ':'" prop="logo">
                <BmImage :src="ruleForm.logo" fit="contain" style="width:120px" />
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandReNum')" prop="registerNumber">
                {{ ruleForm.registerNumber }}
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandAuthDate')" required prop="_tmpTimeRegiste">
                {{ ruleForm._tmpTimeRegiste.join(" - ") }}
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandReProve')" prop="registerProveList">
                <div class="flex">
                    <div>
                        <BmImage v-for="(item, index) in ruleForm.registerProveList" :key="index" :src="item.url" fit="contain" class="mr-10" style="width:120px" />
                    </div>
                    <div class="ml-20 tips">
                        <div v-html="$t('brandAdd.brandTip')"></div>
                    </div>
                </div>
            </el-form-item>
            <div v-if="ruleForm.type == 2">
                <el-form-item :label="$t('brandAdd.brandAuthProve')" prop="_tmpTimeAuth">
                    {{ ruleForm._tmpTimeAuth.join("-") }}
                </el-form-item>
                <el-form-item :label="$t('brandAdd.brandAuthProve')" prop="authProveList">
                    <div class="flex">
                        <div>
                            <BmImage v-for="(item, index) in ruleForm.authProveList" :key="index" :src="item.url" fit="contain" class="mr-10" style="width:120px" />
                        </div>
                        <div class="ml-20 tips">
                            <div v-html="$t('brandAdd.brandAuthTip')"></div>
                        </div>
                    </div>
                </el-form-item>
            </div>
            <el-form-item :label="$t('brandAdd.brandHolderAuth')" prop="holderIdentityList">
                <div class="flex">
                    <div>
                        <BmImage v-for="(item, index) in ruleForm.holderIdentityList" :key="index" :src="item.url" fit="contain" class="mr-10" style="width:120px" />
                    </div>
                    <div class="ml-20 tips">
                        <div v-html="$t('brandAdd.holderUpload')"></div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('brandAdd.sellerRemark')" prop="remarks">
                {{ ruleForm.remarks }}
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import { productBrandInfo, upLoad, productBrandSellerSave, productBrandSellerUpdate } from "@/api/goods";
import { dateShortcuts } from "@/utils/dateShortcuts";
import dayjs from "dayjs";
export default {
    name: "addBrand",
    props: {
        visible: Boolean,
        row: Object
    },
    emits: ["update:visible", "reloadData"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const router = useRouter();
        const route = useRoute();

        let updateType = computed(() => (props.row && props.row.id ? "edit" : "add"));

        watch(
            () => props.row,
            (nVal) => {
                nVal.id && init(nVal.id);
            }
        );

        let ruleForm = reactive({
            _tmpTimeRegiste: [],
            _tmpTimeAuth: [],
            authEndTime: "", // 授权有效期结束时间
            authProveList: [], // 授权证明（图片地址）
            authStartTime: "", // 授权有效期开始时间
            brandName: "", // 品牌名称
            createTime: "", // 创建时间
            createUser: "", // 创建人
            delFlag: "", // 删除状态
            examineStatus: 1, // 审核状态（1待审核 2已通过 3未通过 4屏蔽中 5待更新）
            examineTime: "", // 最后审核时间
            examiner: "", // 最后审核人
            holderIdentityList: [], // 持有人身份证明（图片地址）
            id: "", // 主键
            logo: "", // 品牌logo
            registerEndTime: "", // 注册有效期结束时间
            registerNumber: "", // 商标注册号
            registerProveList: [], // 注册证明（图片地址）
            registerStartTime: "", // 注册有效期开始时间
            registerType: "1", // 商标注册人类型（1非自然人 2自然人）
            remarks: "", // 备注
            sellerId: "", // 卖家id
            //shopId: "",// 店铺id
            sort: "", // 排序号
            type: "1", // 类型（ 1自有商标 2授权商标）
            updateTime: "" // 更新时间
            //updateUser: ""	// 更新人
        });

        let steps = ref([]);

        const init = (id) => {
            productBrandInfo(id)
                .then((res) => {
                    ruleForm.authEndTime = res.data.authEndTime; // 授权有效期结束时间
                    ruleForm.authStartTime = res.data.authStartTime; // 授权有效期开始时间
                    ruleForm.brandName = res.data.brandName; // 品牌名称

                    ruleForm.id = res.data.id; // 主键
                    ruleForm.logo = res.data.logo; // 品牌logo
                    ruleForm.registerEndTime = res.data.registerEndTime; // 注册有效期结束时间
                    (ruleForm.registerNumber = res.data.registerNumber), // 商标注册号
                        (ruleForm.registerStartTime = res.data.registerStartTime); // 注册有效期开始时间
                    ruleForm.registerType = res.data.registerType + ""; // 商标注册人类型（1非自然人 2自然人）
                    ruleForm.remarks = res.data.remarks; // 备注
                    ruleForm.type = res.data.type + ""; // 类型（ 1自有商标 2授权商标）
                    ruleForm._tmpTimeAuth[0] = res.data.authStartTime;
                    ruleForm._tmpTimeAuth[1] = res.data.authEndTime;
                    ruleForm._tmpTimeRegiste[0] = res.data.registerStartTime;
                    ruleForm._tmpTimeRegiste[1] = res.data.registerEndTime;

                    if (res.data.examineStatus == 2) {
                        // "待审核" "已通过" "屏蔽中" "待更新"
                        steps.value = [proxy.$t("brand.beAudit"), proxy.$t("brand.auditPass"), proxy.$t("brand.shielding"), proxy.$t("brand.beUpdated")];
                    } else {
                        // "待审核" "未通过" "屏蔽中" "待更新"
                        steps.value = [proxy.$t("brand.beAudit"), proxy.$t("brand.auditRejected"), proxy.$t("brand.shielding"), proxy.$t("brand.beUpdated")];
                    }

                    if (res.data.examineStatus == 2) {
                        ruleForm.examineStatus = res.data.examineStatus - 1; // 审核状态（1待审核 2已通过 3未通过 4屏蔽中 5待更新）
                    } else if (res.data.examineStatus == 3) {
                        ruleForm.examineStatus = res.data.examineStatus - 2;
                    } else if (res.data.examineStatus == 5) {
                        ruleForm.examineStatus = res.data.examineStatus - 2;
                    }

                    ruleForm.authProveList = [];
                    res.data.authProveList.forEach((v) => {
                        ruleForm.authProveList.push({ url: v });
                    }); // 授权证明（图片地址）

                    ruleForm.holderIdentityList = [];
                    res.data.holderIdentityList.forEach((v) => {
                        ruleForm.holderIdentityList.push({ url: v });
                    }); // 持有人身份证明（图片地址）

                    ruleForm.registerProveList = [];
                    res.data.registerProveList.forEach((v) => {
                        ruleForm.registerProveList.push({ url: v });
                    }); // 注册证明（图片地址）
                })
                .catch(() => {});
        };

        //取消
        const cancel = () => {
            emit("update:visible", false);
        };

        return {
            updateType,
            ruleForm,

            cancel
        };
    }
};
</script>

<style lang="scss" scoped>
.tips {
    font-size: 12px;
    color: #999999;
    line-height: 24px;
}
</style>
