<template>
    <div class="content-wrap p-20 bg-white">
        <!-- 店铺基本信息 -->
        <!-- <div class="fs-16 flex vcenter mb-20">
            <div class="pane-line"></div>
            <span class="pane-fs">{{ $t("register.storeBascInfo") }}</span>
        </div> -->
        <BmAlert :title="$t('register.storeInfoAuditTip')" icon="warning" class="mb-15 ml-20" />
        <el-form :model="ruleForm" label-width="auto">
            <!-- 店铺类型: "1专业卖家" "2普通卖家"-->
            <!-- <el-form-item :label="$t('register.storeType')" prop="storeType ">
                {{ ruleForm.sellerType == 2 ? $t("register.ProfessionalSellers") : $t("register.OrdinarySeller") }}
            </el-form-item> -->
            <!-- 贸易形式 1本地贸易 2跨境贸易-->
            <!-- <el-form-item :label="$t('register.tradePattern')" prop="tradeForm">
                {{ ruleForm.tradeForm == 1 ? $t("register.localTrade") : $t("register.crossBorderTrade") }}
            </el-form-item> -->
            <!-- 店铺名称 -->
            <!-- <el-form-item :label="$t('register.storeName') + ':'" prop="storeName">
                {{ ruleForm.storeName }}
            </el-form-item> -->
            <!-- 店铺简介 -->
            <!-- <el-form-item :label="$t('register.ShopIntroduction') + ':'" prop="storeDesc">
                {{ ruleForm.storeDesc }}
            </el-form-item> -->
            <!-- 主营类目 -->
            <!-- <el-form-item :label="$t('register.mainCategories') + ':'" prop="mainBusinessType">
                <template v-for="(item, i) in category" :key="i">
                    <span v-if="ruleForm.mainBusinessType && ruleForm.mainBusinessType.includes(item.id)" class="p-5"> {{ item.name }} /</span>
                </template>
            </el-form-item> -->
            <!-- 登录(主)账号 -->
            <!-- <el-form-item :label="$t('register.setAccountMain') + ':'" prop="account" >
                {{ ruleForm.account }}
            </el-form-item> -->

            <!-- 联系地址 -->
            <!-- <el-form-item :label="$t('register.contactAddress') + ':'" prop="storeAddress"> {{ ruleForm.address }} {{ ruleForm.storeAddressDetail }} </el-form-item> -->
            <!-- 邮箱账户 -->
            <!-- <el-form-item :label="$t('register.EmailAccount') + ':'" prop="email" >
                {{ ruleForm.email }}
            </el-form-item> -->

            <!-- <el-form-item :label="$t('register.CheckInInvitationCode') + ':'" prop="invitationCode" >
                {{ ruleForm.invitationCode }}
            </el-form-item> -->
            <div class="fs-16 flex vcenter mb-15">
                <div class="pane-line"></div>
                <span class="pane-fs">{{ $t("register.certificateInfo") }}</span>
            </div>
            <!-- 证件类型 -->
            <el-form-item :label="$t('register.certificateType') + ':'" prop="papersType" style="margin-bottom: 10px;">
                <!-- 1中国大陆身份证 2ID证件-->
                {{ ruleForm.papersType == 1 ? $t("register.ChineseMainCard") : $t("register.idCard") }}
            </el-form-item>
            <!-- 姓名 -->
            <el-form-item :label="$t('register.name') + ':'" prop="papersName">
                {{ ruleForm.papersName }}
            </el-form-item>
            <!-- 证件号码 -->
            <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber" v-if="ruleForm.papersType == 1">
                <div class="flex">
                    <div>
                        <span>{{ storeData.papersNumber }}</span> <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                    </div>
                    <div class="ml-20">
                        <span>{{ storeData.papersNumber }}</span> <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                    </div>
                </div>
            </el-form-item>
            <!-- 证件号码 -->
            <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber" v-if="ruleForm.papersType == 2">
                <div class="flex">
                    <div>
                        {{ storeData.papersNumber }} <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                    </div>
                    <div class="ml-20">
                        {{ storeData.papersNumber }} <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                    </div>
                </div>
            </el-form-item>
            <!-- 证件有效期 -->
            <el-form-item :label="$t('register.validityCertificate') + ':'" prop="papersExpired">
                {{ ruleForm.papersExpired && ruleForm.papersExpired.join(" ~ ") }}
                <!-- 长期 -->
                {{ ruleForm.expiredIsForever == 1 ? $t("register.longTerm") : "" }}
            </el-form-item>
            <!-- 手持证件照 -->
            <el-form-item :label="$t('register.HandHeldPhoto') + ':'" prop="papersPictureUrl">
                <div class="flex">
                    <div>
                        <BmImage
                            :src="storeData.papersPictureUrl"
                            :preview-src-list="[storeData.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                            style="width:120px;height:120px"
                        />
                        <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                    </div>
                    <div class="ml-20">
                        <BmImage
                            :src="ruleForm.papersPictureUrl"
                            :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                            style="width:120px;height:120px"
                        />
                        <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                    </div>
                </div>
            </el-form-item>
            <!-- 法定代表人证件正面照 -->
            <el-form-item :label="$t('register.statutoryCertificateFront') + ':'" prop="papersProsPictureUrl">
                <div class="flex">
                    <div>
                        <BmImage
                            :src="storeData.papersProsPictureUrl"
                            :preview-src-list="[ruleForm.papersPictureUrl, storeData.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                            style="width:120px;height:120px"
                        />
                        <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                    </div>
                    <div class="ml-20">
                        <BmImage
                            :src="ruleForm.papersProsPictureUrl"
                            :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                            style="width:120px;height:120px"
                        />
                        <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                    </div>
                </div>
            </el-form-item>
            <!-- 法定代表人证件反面照 -->
            <el-form-item :label="$t('register.statutoryCertificateAgainst') + ':'" prop="papersConsPictureUrl">
                <div class="flex">
                    <div>
                        <BmImage
                            :src="storeData.papersConsPictureUrl"
                            :preview-src-list="[ruleForm.papersPictureUrl, storeData.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                            style="width:120px;height:120px"
                        />
                        <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                    </div>
                    <div class="ml-20">
                        <BmImage
                            :src="ruleForm.papersConsPictureUrl"
                            :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                            style="width:120px;height:120px"
                        />
                        <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                    </div>
                </div>
            </el-form-item>
            <div v-if="ruleForm.sellerType == 2">
                <div class="fs-16 flex vcenter">
                    <div class="pane-line"></div>
                    <!-- 企业信息 -->
                    <span class="pane-fs">{{ $t("register.enterpriseInfo") }}</span>
                </div>

                <el-form :model="ruleForm" label-width="auto">
                    <!-- 公司名称 -->
                    <el-form-item :label="$t('register.BusinessName') + ':'" prop="name">
                        {{ ruleForm.name }}
                    </el-form-item>
                    <!-- 公司经营地址 -->
                    <el-form-item :label="$t('register.BusinessAddress') + ':'" prop="companyAddress"> {{ ruleForm.address }} {{ ruleForm.companyAddressDetail }} </el-form-item>
                    <!-- 营业执照 -->
                    <el-form-item :label="$t('register.businessLicense') + ':'" prop="businessLicense">
                        {{ ruleForm.businessLicense }}
                    </el-form-item>
                    <!-- 营业期限 -->
                    <el-form-item :label="$t('register.businessTerm') + ':'" prop="businessExpired">
                        {{ ruleForm.businessExpired && ruleForm.businessExpired.join(" ~ ") }}
                        <!-- 长期 -->
                        {{ ruleForm.companyExpiredIsForever == 1 ? $t("register.longTerm") : "" }}
                    </el-form-item>
                    <!-- 营业执照 -->
                    <el-form-item :label="$t('register.businessLicense') + ':'" prop="businessLicensePictureUrl">
                        <div class="flex">
                            <div>
                                <BmImage :src="company.businessLicensePictureUrl" :preview-src-list="[company.businessLicensePictureUrl]" style="width:120px;height:120px" />
                                <span class="ml-5 green">{{ $t("register.beforeEdit") }}</span>
                            </div>
                            <div class="ml-20">
                                <BmImage :src="ruleForm.businessLicensePictureUrl" :preview-src-list="[ruleForm.businessLicensePictureUrl]" style="width:120px;height:120px" />
                                <span class="ml-5 green">{{ $t("register.afterEdit") }}</span>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 审核状态 1审核中 2"正常营业" 3"停业" 4审核驳回-->
            <el-form-item :label="$t('goodsList.auditStatus') + ':'" prop="">
                {{
                    storeData.status == 1
                        ? $t("status.inReview")
                        : storeData.status == 2
                        ? $t("register.NormalBusiness")
                        : storeData.status == 3
                        ? $t("register.Closed")
                        : storeData.status == 4
                        ? $t("status.auditRejected")
                        : ""
                }}
            </el-form-item>
            <!-- 审核时间 -->
            <el-form-item :label="$t('auditTime') + ':'" prop=""> {{ storeData.updateTime }} </el-form-item>
            <!-- 审核原因 -->
            <el-form-item :label="$t('fund.rejectReason') + ':'" prop="">
                {{ storeData.reason }}
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { ref, reactive, unref, getCurrentInstance, onMounted, nextTick } from "vue";
import { adminUmsSellerStoreFindCurrent, adminUmsSellerUpdateStore, adminUmsSellerFindLastUpdateAudit } from "@/api/user";
import { find } from "@/api/goods";
import { useStore } from "vuex";
import storage from "@/utils/storage";
export default {
    name: "merchantInfoAudit",
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

        let userInfo = storage.get("userInfo");

        let ruleForm = reactive({});
        let company = ref({});
        let companyUpdateAudit = ref({}); // 修改后企业信息
        let storeData = ref({});
        let storeUpdateAudit = ref({}); // 修改后店铺信息
        const getSroreInfo = () => {
            adminUmsSellerFindLastUpdateAudit(userInfo.storeId).then((res) => {
                company.value = res.data.company;
                companyUpdateAudit.value = res.data.companyUpdateAudit;
                storeData.value = res.data.store;
                storeUpdateAudit.value = res.data.storeUpdateAudit;

                ruleForm.sellerType = res.data.storeUpdateAudit.sellerType; // 卖家类型

                ruleForm.account = res.data.storeUpdateAudit.sellerUser.account;

                ruleForm.invitationCode = res.data.storeUpdateAudit.invitationCode; // 邀请码
                ruleForm.mainBusinessType = (res.data.storeUpdateAudit.mainBusinessType && res.data.storeUpdateAudit.mainBusinessType.split(",").map(Number)) || []; // 主营类目ID

                ruleForm.storeAddressDetail = res.data.storeUpdateAudit.addressDetail; // 详细地址
                ruleForm.storeDesc = res.data.storeUpdateAudit.storeDesc; // 店铺简介
                ruleForm.storeLogoUrl = res.data.storeUpdateAudit.storeLogoUrl; // 店铺logo url
                ruleForm.storeName = res.data.storeUpdateAudit.storeName; //  店铺名称
                ruleForm.storeType = Number(res.data.storeUpdateAudit.storeType); // 店铺类型 1: 普通
                ruleForm.tradeForm = Number(res.data.storeUpdateAudit.tradeForm); // 贸易行驶: 1: 本地贸易 2:跨境贸易
                ruleForm.storeAddress = [res.data.storeUpdateAudit.countryCode, res.data.storeUpdateAudit.provinceCode, res.data.storeUpdateAudit.cityCode, res.data.storeUpdateAudit.districtCode]; //	国家编码 省编码 市编码 区编码
                if (res.data.storeUpdateAudit.papersExpiredStart) {
                    ruleForm.papersExpired = [res.data.storeUpdateAudit.papersExpiredStart, res.data.storeUpdateAudit.papersExpiredEnd]; // 证件有效期
                }

                ruleForm.papersConsPictureUrl = res.data.storeUpdateAudit.papersConsPictureUrl; // 证件反面图片url
                ruleForm.papersName = res.data.storeUpdateAudit.papersName; // 证件上姓名
                ruleForm.papersNumber = res.data.storeUpdateAudit.papersNumber; // 证件号码
                ruleForm.papersPictureUrl = res.data.storeUpdateAudit.papersPictureUrl; // 证件图片url
                ruleForm.papersType = Number(res.data.storeUpdateAudit.papersType); // 证件类型: 1:大陆身份证, 2.ID证件
                ruleForm.papersProsPictureUrl = res.data.storeUpdateAudit.papersProsPictureUrl; // 证件正面图片url
                ruleForm.expiredIsForever = res.data.storeUpdateAudit.expiredIsForever; // 身份证是否长期

                ruleForm.businessExpired = [res.data.companyUpdateAudit.businessExpiredStart, res.data.companyUpdateAudit.businessExpiredEnd];
                ruleForm.businessLicense = res.data.companyUpdateAudit.businessLicense; // 营业执照
                ruleForm.businessLicensePictureUrl = res.data.companyUpdateAudit.businessLicensePictureUrl; // 营业执照图片id
                // 公司经营地址
                ruleForm.companyAddress = [
                    res.data.companyUpdateAudit.countryCode,
                    res.data.companyUpdateAudit.provinceCode,
                    res.data.companyUpdateAudit.cityCode,
                    res.data.companyUpdateAudit.districtCode
                ]; //	国家编码 省编码 市编码 区编码
                ruleForm.address = res.data.companyUpdateAudit.address; // 地址
                ruleForm.companyAddressDetail = res.data.companyUpdateAudit.addressDetail; // 详情地址
                ruleForm.name = res.data.companyUpdateAudit.name; // 企业名称
                ruleForm.companyExpiredIsForever = res.data.companyUpdateAudit.expiredIsForever; // 营业期限是否长期
            });
        };
        getSroreInfo();

        const onChangeUploadPicture = (url) => {
            console.log(url);
            ruleForm.storeLogoUrl = url;
        };

        const saveAvatar = () => {
            adminUmsSellerUpdateStore({ storeLogoUrl: ruleForm.storeLogoUrl })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    store.dispatch("user/getStoreInfo");
                })
                .catch((error) => {});
        };

        return {
            category,
            ruleForm,
            onChangeUploadPicture,
            saveAvatar,
            storeData,
            company
        };
    }
};
</script>

<style scoped lang="scss">
// .content-wrap {
//     height: calc(100vh - 120px);
// }

.pane-line {
    width: 2px;
    height: 20px;
    background: #42b7ae;
    margin-left: 20px;
    display: inline-block;
}

.pane-fs {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
    margin-left: 5px;
}

.item-width {
    width: 400px;
}

img {
    width: 142px;
    height: 80px;
}
</style>
