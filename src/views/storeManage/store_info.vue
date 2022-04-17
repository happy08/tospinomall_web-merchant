<template>
    <div class="content-wrap p-20 bg-white flex">
        <div style="min-width:50%">
            <div class="fs-16 flex vcenter">
                <div class="pane-line"></div>
                <!-- 店铺基本信息 -->
                <span class="pane-fs">{{ $t("register.storeBascInfo") }}</span>
            </div>

            <el-form :model="ruleForm" label-width="auto">
                <!-- 店铺类型: -->
                <el-form-item :label="$t('register.storeType')" prop="storeType " class="item-width">
                    <!-- "1专业卖家" "2普通卖家"-->
                    {{ ruleForm.sellerType == 2 ? $t("register.ProfessionalSellers") : $t("register.OrdinarySeller") }}
                </el-form-item>
                <!-- 贸易形式 -->
                <el-form-item :label="$t('register.tradePattern')" prop="tradeForm">
                    <!-- 1本地贸易 2跨境贸易-->
                    {{ ruleForm.tradeForm == 1 ? $t("register.localTrade") : $t("register.crossBorderTrade") }}
                </el-form-item>
                <!-- 店铺名称 -->
                <el-form-item :label="$t('register.storeName') + ':'" prop="storeName" class="item-width">
                    {{ ruleForm.storeName }}
                </el-form-item>
                <!-- 店铺简介 -->
                <el-form-item :label="$t('register.ShopIntroduction') + ':'" prop="storeDesc" class="item-width">
                    {{ ruleForm.storeDesc }}
                </el-form-item>
                <!-- 主营类目 -->
                <el-form-item :label="$t('register.mainCategories') + ':'" prop="mainBusinessType">
                    <template v-for="(item, i) in category" :key="i">
                        <span v-if="ruleForm.mainBusinessType && ruleForm.mainBusinessType.includes(item.id)" class="p-5"> {{ item.name }} /</span>
                    </template>
                </el-form-item>
                <!-- 登录(主)账号 -->
                <el-form-item :label="$t('register.setAccountMain') + ':'" prop="account" class="item-width">
                    {{ ruleForm.account }}
                </el-form-item>

                <!-- 联系地址 -->
                <el-form-item :label="$t('register.contactAddress') + ':'" prop="storeAddress" class="item-width"> {{ ruleForm.address }} {{ ruleForm.storeAddressDetail }} </el-form-item>
                <!-- 邮箱账户 -->
                <el-form-item :label="$t('register.EmailAccount') + ':'" prop="email" class="item-width">
                    {{ ruleForm.email }}
                </el-form-item>

                <el-form-item :label="$t('register.CheckInInvitationCode') + ':'" prop="invitationCode" class="item-width">
                    {{ ruleForm.invitationCode }}
                </el-form-item>
            </el-form>

            <div class="fs-16 flex vcenter mb-15">
                <div class="pane-line"></div>
                <span class="pane-fs">{{ $t("register.certificateInfo") }}</span>
            </div>

            <el-form :model="ruleForm" label-width="auto">
                <!-- 证件类型 -->
                <el-form-item :label="$t('register.certificateType') + ':'" prop="papersType" style="margin-bottom: 10px;">
                    <!-- 1中国大陆身份证 2ID证件-->
                    {{ ruleForm.papersType == 1 ? $t("register.ChineseMainCard") : $t("register.idCard") }}
                </el-form-item>
                <!-- 姓名 -->
                <el-form-item :label="$t('register.name') + ':'" prop="papersName" class="item-width">
                    {{ ruleForm.papersName }}
                </el-form-item>
                <!-- 证件号码 -->
                <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber" class="item-width" v-if="ruleForm.papersType == 1">
                    {{ ruleForm.papersNumber }}
                </el-form-item>
                <!-- 证件号码 -->
                <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber" class="item-width" v-if="ruleForm.papersType == 2">
                    {{ ruleForm.papersNumber }}
                </el-form-item>
                <!-- 证件有效期 -->
                <el-form-item :label="$t('register.validityCertificate') + ':'" prop="papersExpired" class="item-width">
                    {{ ruleForm.papersExpired && ruleForm.papersExpired.join(" ~ ") }}
                    <!-- 长期 -->
                    {{ ruleForm.expiredIsForever == 1 ? $t("register.longTerm") : "" }}
                </el-form-item>
                <!-- 手持证件照 -->
                <el-form-item :label="$t('register.HandHeldPhoto') + ':'" prop="papersPictureUrl">
                    <BmImage
                        :src="ruleForm.papersPictureUrl"
                        :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                        style="width:120px;height:120px"
                    />
                </el-form-item>
                <!-- 法定代表人证件正面照 -->
                <el-form-item :label="$t('register.statutoryCertificateFront') + ':'" prop="papersProsPictureUrl">
                    <BmImage
                        :src="ruleForm.papersProsPictureUrl"
                        :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                        style="width:120px;height:120px"
                    />
                </el-form-item>
                <!-- 法定代表人证件反面照 -->
                <el-form-item :label="$t('register.statutoryCertificateAgainst') + ':'" prop="papersConsPictureUrl">
                    <BmImage
                        :src="ruleForm.papersConsPictureUrl"
                        :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                        style="width:120px;height:120px"
                    />
                </el-form-item>
            </el-form>

            <div v-if="ruleForm.sellerType == 2">
                <div class="fs-16 flex vcenter">
                    <div class="pane-line"></div>
                    <!-- 企业信息 -->
                    <span class="pane-fs">{{ $t("register.enterpriseInfo") }}</span>
                </div>

                <el-form :model="ruleForm" label-width="auto">
                    <!-- 公司名称 -->
                    <el-form-item :label="$t('register.BusinessName') + ':'" prop="name" class="item-width">
                        {{ ruleForm.name }}
                    </el-form-item>
                    <!-- 公司经营地址 -->
                    <el-form-item :label="$t('register.BusinessAddress') + ':'" prop="companyAddress" class="item-width"> {{ ruleForm.address }} {{ ruleForm.companyAddressDetail }} </el-form-item>
                    <!-- 营业执照 -->
                    <el-form-item :label="$t('register.businessLicense') + ':'" prop="businessLicense" class="item-width">
                        {{ ruleForm.businessLicense }}
                    </el-form-item>
                    <!-- 营业期限 -->
                    <el-form-item :label="$t('register.businessTerm') + ':'" prop="businessExpired" class="item-width">
                        {{ ruleForm.businessExpired && ruleForm.businessExpired.join(" ~ ") }}
                        <!-- 长期 -->
                        {{ ruleForm.companyExpiredIsForever == 1 ? $t("register.longTerm") : "" }}
                    </el-form-item>
                    <!-- 营业执照 -->
                    <el-form-item :label="$t('register.businessLicense') + ':'" prop="businessLicensePictureUrl">
                        <BmImage :src="ruleForm.businessLicensePictureUrl" :preview-src-list="[ruleForm.businessLicensePictureUrl]" style="width:120px;height:120px" />
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="tc">
            <BmUpload @change="onChangeUploadPicture($event)" :fileUrl="ruleForm.storeLogoUrl" :show-file-list="false" class="mb-15" />
            <div class="ml-25 lh-12 mb-15">
                {{ $t("register.imgTips") }}
            </div>
            <div>
                <el-button type="primary" @click="saveAvatar">{{ $t("status.update") }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, unref, getCurrentInstance, onMounted, nextTick } from "vue";
import { adminUmsSellerStoreFindCurrent, adminUmsSellerUpdateStore } from "@/api/user";
import { find } from "@/api/goods";
import { useStore } from "vuex";
export default {
    name: "store_info",
    setup() {
        const { proxy } = getCurrentInstance();

        const store = useStore();

        //主营类目
        let category = ref([]);
        const finds = () => {
            find().then((res) => {
                category.value = res.data;
            });
        };
        finds();

        let ruleForm = reactive({});
        const getSroreInfo = () => {
            adminUmsSellerStoreFindCurrent().then((res) => {
                ruleForm.sellerType = res.data.sellerType; // 卖家类型

                ruleForm.account = res.data.sellerUser.account;
                ruleForm.email = res.data.sellerUser.email; // 邮箱
                ruleForm.invitationCode = res.data.invitationCode; // 邀请码
                ruleForm.mainBusinessType = (res.data.mainBusinessType && res.data.mainBusinessType.split(",").map(Number)) || []; // 主营类目ID
                ruleForm.password = res.data.sellerUser.password; // 密码
                ruleForm.storeAddressDetail = res.data.addressDetail; // 详细地址
                ruleForm.storeDesc = res.data.storeDesc; // 店铺简介
                ruleForm.storeLogoUrl = res.data.storeLogoUrl; // 店铺logo url
                ruleForm.storeName = res.data.storeName; //  店铺名称
                ruleForm.storeType = Number(res.data.storeType); // 店铺类型 1: 普通
                ruleForm.tradeForm = Number(res.data.tradeForm); // 贸易行驶: 1: 本地贸易 2:跨境贸易
                ruleForm.storeAddress = [res.data.countryCode, res.data.provinceCode, res.data.cityCode, res.data.districtCode]; //	国家编码 省编码 市编码 区编码
                if (res.data.papersExpiredStart) {
                    ruleForm.papersExpired = [res.data.papersExpiredStart, res.data.papersExpiredEnd]; // 证件有效期
                }

                ruleForm.papersConsPictureUrl = res.data.papersConsPictureUrl; // 证件反面图片url
                ruleForm.papersName = res.data.papersName; // 证件上姓名
                ruleForm.papersNumber = res.data.papersNumber; // 证件号码
                ruleForm.papersPictureUrl = res.data.papersPictureUrl; // 证件图片url
                ruleForm.papersType = Number(res.data.papersType); // 证件类型: 1:大陆身份证, 2.ID证件
                ruleForm.papersProsPictureUrl = res.data.papersProsPictureUrl; // 证件正面图片url
                ruleForm.expiredIsForever = res.data.expiredIsForever; // 身份证是否长期

                ruleForm.businessExpired = [res.data.umsSellerCompany.businessExpiredStart, res.data.umsSellerCompany.businessExpiredEnd];
                ruleForm.businessLicense = res.data.umsSellerCompany.businessLicense; // 营业执照
                ruleForm.businessLicensePictureUrl = res.data.umsSellerCompany.businessLicensePictureUrl; // 营业执照图片id
                // 公司经营地址
                ruleForm.companyAddress = [res.data.countryCode, res.data.provinceCode, res.data.cityCode, res.data.districtCode]; //	国家编码 省编码 市编码 区编码
                ruleForm.address = res.data.umsSellerCompany.address; // 地址
                ruleForm.companyAddressDetail = res.data.umsSellerCompany.addressDetail; // 详情地址
                ruleForm.name = res.data.umsSellerCompany.name; // 企业名称
                ruleForm.companyExpiredIsForever = res.data.umsSellerCompany.expiredIsForever; // 营业期限是否长期
            });
        };
        getSroreInfo();

        const onChangeUploadPicture = (url) => {
            console.log(url);
            ruleForm.storeLogoUrl = url;
        };

        const saveAvatar = () => {
            const loading = proxy.$loading();
            adminUmsSellerUpdateStore({ storeLogoUrl: ruleForm.storeLogoUrl })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    store.dispatch("user/getStoreInfo");
                    loading.close();
                })
                .catch((error) => {
                    loading.close();
                });
        };

        return {
            category,
            ruleForm,
            onChangeUploadPicture,
            saveAvatar
        };
    }
};
</script>
