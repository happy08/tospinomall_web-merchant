<template>
    <BmDialog v-model:visible="visible" :title="updateType === 'add' ? $t('status.add') : $t('status.edit')" :confirm="confirm" :cancel="cancel" top="5vh" width="1100px">
        <BmAlert :title="$t('brandAdd.titleTip')" icon="warning" class="mb-20" />

        <div v-if="updateType === 'edit'">
            <el-steps :active="ruleForm.examineStatus" class="custom-step mb-40 mt-10 plr-50" finish-status="success">
                <el-step v-for="(item, i) in steps" :key="i" :title="item"></el-step>
            </el-steps>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="auto">
            <!-- 注册类型 商标注册人类型 品牌名称 品牌Logo 商标注册号 商标注册有效期 商标注册证明 品牌授权有效期 品牌授权证明 商标持有人身份证明-->
            <el-form-item :label="$t('brandAdd.registerType') + ':'" prop="type">
                <el-radio-group v-model="ruleForm.type">
                    <el-radio label="1">{{ $t("brandAdd.ownBrand") }}</el-radio>
                    <el-radio label="2">{{ $t("brandAdd.AuthorizedBrand") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandRegisterType') + ':'" prop="registerType">
                <el-radio-group v-model="ruleForm.registerType">
                    <el-radio label="1">{{ $t("brandAdd.noNaturalPerson") }}</el-radio>
                    <el-radio label="2">{{ $t("brandAdd.naturalPerson") }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandName') + ':'" prop="brandName">
                <el-input v-model="ruleForm.brandName" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandLogo') + ':'" prop="logo">
                <div class="flex" style="flex-wrap: wrap;">
                    <BmUpload @change="onChangeUploadPicture($event)" :fileUrl="ruleForm.logo" :show-file-list="false" />
                    <div class="tips">
                        <div class="ml-15">{{ $t("brandAdd.imgTip1") }}</div>
                        <div class="ml-15">{{ $t("brandAdd.imgTip2") }}</div>
                        <div class="ml-15">{{ $t("brandAdd.imgTip3") }}</div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandReNum')" prop="registerNumber">
                <el-input v-model="ruleForm.registerNumber" maxlength="100"></el-input>
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandDate') + ':'" required prop="_tmpTimeRegiste">
                <el-date-picker
                    v-model="ruleForm._tmpTimeRegiste"
                    @change="changeDate"
                    type="daterange"
                    :start-placeholder="$t('startDate')"
                    range-separator="-"
                    :end-placeholder="$t('endDate')"
                    :shortcuts="shortcuts"
                    style="width: 320px;"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('brandAdd.brandReProve')" prop="registerProveList">
                <div class="flex" style="flex-wrap: wrap;">
                    <div>
                        <BmUpload @change="onChangeUploadDetailImg($event)" :multiple="true" :fileList="ruleForm.registerProveList" :limit="10" />
                    </div>
                    <div class="ml-20 tips">
                        <!-- {{ $t('brandAdd.brandTip') }} -->
                        <div v-html="$t('brandAdd.brandTip')"></div>
                        <div>6.{{ $t("brandAdd.imgSizeTip") }}</div>
                    </div>
                </div>
            </el-form-item>
            <div v-if="ruleForm.type == 2">
                <el-form-item :label="$t('brandAdd.brandAuthDate')" prop="_tmpTimeAuth">
                    <el-date-picker
                        v-model="ruleForm._tmpTimeAuth"
                        @change="changeDateAuth"
                        type="daterange"
                        :start-placeholder="$t('startDate')"
                        range-separator="-"
                        :end-placeholder="$t('endDate')"
                        :shortcuts="shortcuts"
                        style="width: 321px;"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('brandAdd.brandAuthProve')" prop="authProveList">
                    <div class="flex">
                        <div>
                            <BmUpload @change="onChangeUploadAuth($event)" :multiple="true" :fileList="ruleForm.authProveList" :limit="10" />
                        </div>
                        <div class="ml-20 tips">
                            <div v-html="$t('brandAdd.brandAuthTip')"></div>
                            <div>3.{{ $t("brandAdd.imgSizeTip") }}</div>
                        </div>
                    </div>
                </el-form-item>
            </div>
            <el-form-item :label="$t('brandAdd.brandHolderAuth') + ':'" prop="holderIdentityList">
                <div class="flex" style="flex-wrap: wrap;">
                    <div>
                        <BmUpload @change="onChangeUploadHolderIdentity($event)" :multiple="true" :fileList="ruleForm.holderIdentityList" :limit="10" />
                    </div>
                    <div class="ml-20 tips">
                        <div v-html="$t('brandAdd.holderUpload')"></div>
                        <div>3.{{ $t("brandAdd.imgSizeTip") }}</div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('brandAdd.sellerRemark')" prop="remarks">
                <el-input type="textarea" v-model="ruleForm.remarks" maxlength="255" show-word-limit :rows="5"></el-input>
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
                    ruleForm.authEndTime = res.data.authEndTime || ""; // 授权有效期结束时间
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
                    ruleForm._tmpTimeAuth = !res.data.authStartTime || !res.data.authEndTime ? "" : [res.data.authStartTime, res.data.authEndTime];
                    // ruleForm._tmpTimeAuth[0] = res.data.authStartTime;
                    // ruleForm._tmpTimeAuth[1] = res.data.authEndTime || "";
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

        watch(
            () => ruleForm.type,
            (nVal) => {
                ruleForm.type = nVal;
            },
            {
                immediate: true
            }
        );

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() < Date.now();
        };

        let imageUrl = ref("");

        let ruleFormRef = ref(null);

        const validatepbrandName = (rule, value, callback) => {
            if (value.length >= 4 && value.length <= 15) {
                callback();
            } else {
                callback(new Error(proxy.$t("brandAdd.accountMaxmin")));
            }
        };

        const validatepregisterNumber = (rule, value, callback) => {
            if (value.length >= 4 && value.length <= 15) {
                callback();
            } else {
                callback(new Error(proxy.$t("brandAdd.accountMaxmin")));
            }
        };

        let rules = ref({
            name: [
                { required: true, message: proxy.$t("brandAdd.enterActiveName"), trigger: "blur" },
                { min: 3, max: 5, message: proxy.$t("brandAdd.lengthString"), trigger: "blur" }
            ],
            type: [{ required: true, message: proxy.$t("brandAdd.selectArea"), trigger: "change" }],
            registerType: [{ type: "date", required: true, message: "请上传", trigger: "change" }],
            brandName: [
                // { validator: validatepbrandName, trigger: 'blur' },
                { required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" }
            ],
            logo: [{ required: true, message: proxy.$t("pleaseUpload"), trigger: "blur" }],
            registerNumber: [
                // { validator: validatepregisterNumber, trigger: 'blur' },
                { required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" }
            ],
            registerProveList: [{ required: true, message: proxy.$t("pleaseUpload"), trigger: "blur" }],
            remarks: [{ required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" }],
            _tmpTimeRegiste: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "blur" }],
            _tmpTimeAuth: [{ required: true, message: proxy.$t("pleaseSelect"), trigger: "blur" }],
            holderIdentityList: [{ required: true, message: proxy.$t("pleaseUpload"), trigger: "blur" }],
            authProveList: [{ required: true, message: proxy.$t("pleaseUpload"), trigger: "blur" }]
        });

        // 提交
        const confirm = () => {
            let form = {
                authEndTime: dayjs(ruleForm._tmpTimeAuth && ruleForm._tmpTimeAuth[1]).format("YYYY-MM-DD HH:mm:ss"), // 授权有效期结束时间
                authProveList: [], // 授权证明（图片地址）
                authStartTime: dayjs(ruleForm._tmpTimeAuth && ruleForm._tmpTimeAuth[0]).format("YYYY-MM-DD HH:mm:ss"), // 授权有效期开始时间
                brandName: ruleForm.brandName, // 品牌名称
                holderIdentityList: [], // 持有人身份证明（图片地址）
                logo: ruleForm.logo, // 品牌logo
                registerEndTime: dayjs(ruleForm._tmpTimeRegiste && ruleForm._tmpTimeRegiste[1]).format("YYYY-MM-DD HH:mm:ss"), // 注册有效期结束时间
                registerNumber: ruleForm.registerNumber, // 商标注册号
                registerProveList: [], // 注册证明（图片地址）
                registerStartTime: dayjs(ruleForm._tmpTimeRegiste && ruleForm._tmpTimeRegiste[0]).format("YYYY-MM-DD HH:mm:ss"), // 注册有效期开始时间
                registerType: ruleForm.registerType, // 商标注册人类型（1非自然人 2自然人）
                remarks: ruleForm.remarks, // 备注
                type: ruleForm.type, // 类型（ 1自有商标 2授权商标）
                id: ruleForm.id
            };

            // ruleForm.authStartTime = dayjs(ruleForm._tmpTimeAuth[0]).format('YYYY-MM-DD HH:mm:ss');
            // ruleForm.authEndTime = dayjs(ruleForm._tmpTimeAuth[1]).format('YYYY-MM-DD HH:mm:ss');
            // ruleForm.registerStartTime = dayjs(ruleForm._tmpTimeRegiste[0]).format('YYYY-MM-DD HH:mm:ss');
            // ruleForm.registerEndTime = dayjs(ruleForm._tmpTimeRegiste[1]).format('YYYY-MM-DD HH:mm:ss');
            form.authProveList = ruleForm.authProveList.map((item) => item.url);
            form.holderIdentityList = ruleForm.holderIdentityList.map((item) => item.url);
            form.registerProveList = ruleForm.registerProveList.map((item) => item.url);

            if (form.type == 1) {
                delete form.authEndTime;
                delete form.authStartTime;
            }

            ruleFormRef.value.validate((valid) => {
                if (valid) {
                    let type = productBrandSellerUpdate; //编辑
                    if (updateType.value === "add") {
                        type = productBrandSellerSave; //新增
                    }
                    type(form)
                        .then((res) => {
                            emit("reloadData");
                            emit("update:visible", false);
                            ruleFormRef.value.resetFields();
                        })
                        .catch(() => {});
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        //取消
        const cancel = () => {
            emit("update:visible", false);
            ruleFormRef.value.resetFields();
        };

        const handleRemove = (file) => {
            console.log(file);
        };
        const handlePictureCardPreview = (file) => {
            dialogImageUrl = file.url;
            dialogVisible = true;
        };
        const handleDownload = (file) => {
            console.log(file);
        };
        const handleAvatarSuccess = (res, file) => {
            this.imageUrl = URL.createObjectURL(file.raw);
        };

        const beforeAvatarUpload = (file) => {
            const isJPG = file.type === "image/jpeg";
            // const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                proxy.$message.error("上传头像图片只能是 JPG 格式!");
            }
            //   if (!isLt2M) {
            //     proxy.$message.error('上传头像图片大小不能超过 2MB!');
            //   }
            //return isJPG && isLt2M;
            return isJPG;
        };

        // 注册商标有效期
        const changeDate = (val) => {
            ruleForm._tmpTimeRegiste = val;
            console.log("val", val);
        };

        // 品牌授权有效期
        const changeDateAuth = (val) => {
            ruleForm._tmpTimeAuth = val;
        };

        const uploadHttp = (options) => {
            let formDate = new FormData();
            formDate.append("object", options.file);
            upLoad(formDate)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {});
        };

        // 店铺logo图片
        const onChangeUploadPicture = (url) => {
            console.log(url);
            ruleForm.logo = url;
        };

        // 商标注册图片
        const onChangeUploadDetailImg = (fileList) => {
            ruleForm.registerProveList = fileList; // fileList.map((item) => item.url)
        };

        // 品牌授权证明
        const onChangeUploadAuth = (fileList) => {
            ruleForm.authProveList = fileList; // fileList.map((item) => item.url)
        };

        // 商标持有人身份证
        const onChangeUploadHolderIdentity = (fileList) => {
            ruleForm.holderIdentityList = fileList; // fileList.map((item) => item.url)
        };

        return {
            updateType,
            ruleForm,
            ruleFormRef,
            rules,
            confirm,
            cancel,
            handleDownload,
            handlePictureCardPreview,
            handleRemove,
            handleAvatarSuccess,
            beforeAvatarUpload,
            imageUrl,
            shortcuts,
            changeDate,
            uploadHttp,
            route,
            onChangeUploadPicture,
            onChangeUploadDetailImg,
            onChangeUploadAuth,
            onChangeUploadHolderIdentity,
            changeDateAuth,
            steps,
            disabledDate
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
