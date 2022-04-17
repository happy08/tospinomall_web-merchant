<template>
    <div class="content-wrap p-20 bg-white flex">
        <div></div>
        <el-tabs v-model="paneName" tab-position="left" @tab-click="handleClick" class="w-100">
            <!-- 基础信息 -->
            <el-tab-pane :label="$t('register.storeInfo')" name="base" class="custom-scrollbar h-100">
                <div class="fs-16 flex vcenter mb-15">
                    <div class="pane-line"></div>
                    <!-- 店铺基本信息 -->
                    <span class="pane-fs">{{ $t("register.storeBascInfo") }}</span>
                </div>
                <BmAlert :title="$t('register.storeBaseInfoTip')" icon="warning" class="mb-15 ml-20" />
                <div class="flex">
                    <el-form :model="ruleForm" label-width="auto" style="min-width: 50%">
                        <el-form-item label=""></el-form-item>
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
                            <div class="flex">
                                <div class="flex">
                                    <span v-if="!isEditStoreName">{{ ruleForm.storeName }}</span>
                                    <span v-else style="width: 400px">
                                        <el-input v-model="ruleForm.storeName" :placeholder="$t('pleaseEnter')"></el-input>
                                    </span>
                                </div>
                                <div class="ml-20">
                                    <!-- 保存 修改 -->
                                    <el-button v-if="!isEditStoreName" @click="isEditStoreName = !isEditStoreName">{{ $t("edit") }}</el-button>
                                    <el-button v-else @click="saveStoreName">{{ $t("save") }}</el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <!-- 店铺简介 -->
                        <el-form-item :label="$t('register.ShopIntroduction') + ':'" prop="storeDesc" class="item-width">
                            <div class="flex">
                                <div class="flex">
                                    <span v-if="!isEditStoreDesc">{{ ruleForm.storeDesc }}</span>
                                    <span v-else style="width: 400px">
                                        <el-input v-model="ruleForm.storeDesc" :placeholder="$t('pleaseEnter')"></el-input>
                                    </span>
                                </div>
                                <div class="ml-20">
                                    <el-button v-if="!isEditStoreDesc" @click="isEditStoreDesc = !isEditStoreDesc">{{ $t("edit") }}</el-button>
                                    <el-button v-else @click="saveStoreDesc">{{ $t("save") }}</el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <!-- 主营类目 -->
                        <el-form-item :label="$t('register.mainCategories') + ':'" prop="mainBusinessType">
                            <div class="flex">
                                <div class="flex">
                                    <span v-if="!isEditmainBusinessType">
                                        <template v-for="(item, i) in category" :key="i">
                                            <span v-if="ruleForm.mainBusinessType && ruleForm.mainBusinessType.includes(item.id)" class="p-5"> {{ item.name }} /</span>
                                        </template>
                                    </span>
                                </div>
                                <div class="ml-20">
                                    <el-button v-if="!isEditmainBusinessType" @click="isEditmainBusinessType = !isEditmainBusinessType">{{ $t("edit") }}</el-button>
                                    <el-button v-else @click="saveMainBusinessType">{{ $t("save") }}</el-button>
                                </div>
                            </div>
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
            </el-tab-pane>
            <!-- "(主体)证件信息" -->
            <el-tab-pane :label="$t('register.mainCertificateInfo')" name="certificate" class="custom-scrollbar h-100">
                <div class="fs-16 flex vcenter mb-15">
                    <div class="pane-line"></div>
                    <span class="pane-fs">{{ $t("register.certificateInfo") }}</span>
                </div>
                <BmAlert :title="$t('register.storeMainInfoTip')" icon="warning" class="mb-15 ml-20" />
                <div class="flex">
                    <div style="min-width: 50%">
                        <el-form :model="ruleForm" label-width="auto" ref="ruleFormRef" :rules="rules">
                            <!-- 证件类型 -->
                            <el-form-item :label="$t('register.certificateType') + ':'" prop="papersType" style="margin-bottom: 10px">
                                <!-- 1中国大陆身份证 2ID证件-->
                                <div class="flex">
                                    <span v-if="!isEditMain">{{ ruleForm.papersType == 1 ? $t("register.ChineseMainCard") : $t("register.idCard") }}</span>
                                    <span v-else style="width: 400px">
                                        <el-radio-group v-model="ruleForm.papersType">
                                            <el-radio :label="1">{{ $t("register.ChineseMainCard") }}</el-radio>
                                            <el-radio :label="2">{{ $t("register.idCard") }}</el-radio>
                                        </el-radio-group>
                                    </span>
                                </div>
                            </el-form-item>
                            <!-- 姓名 -->
                            <el-form-item :label="$t('register.name') + ':'" prop="papersName">
                                <div class="flex">
                                    <div v-if="!isEditMain">
                                        {{ ruleForm.papersName }}
                                    </div>
                                    <div v-else class="item-width">
                                        <el-input v-model="ruleForm.papersName" maxlength="30" show-word-limit></el-input>
                                    </div>
                                </div>
                            </el-form-item>
                            <!-- 证件号码 -->
                            <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber" v-if="ruleForm.papersType == 1">
                                <div class="flex">
                                    <div v-if="!isEditMain">
                                        {{ ruleForm.papersNumber }}
                                    </div>
                                    <div v-else class="item-width">
                                        <el-input
                                            oninput="value=value.replace(/[^\w\.\/]/ig,'')"
                                            v-model="ruleForm.papersNumber_zhcn"
                                            :placeholder="$t('register.enterCertificateNumber')"
                                            maxlength="18"
                                            show-word-limit
                                        ></el-input>
                                    </div>
                                </div>
                            </el-form-item>
                            <!-- 证件号码 -->
                            <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber" v-if="ruleForm.papersType == 2">
                                <div class="flex">
                                    <div v-if="!isEditMain">
                                        {{ ruleForm.papersNumber }}
                                    </div>
                                    <div v-else>
                                        <el-input
                                            oninput="value=value.replace(/[^\w\.\/]/ig,'')"
                                            v-model="ruleForm.papersNumber"
                                            :placeholder="$t('register.enterCertificateNumber')"
                                            maxlength="30"
                                            show-word-limit
                                            class="item-width"
                                        ></el-input>
                                    </div>
                                </div>
                            </el-form-item>
                            <!-- 证件有效期 -->
                            <el-form-item :label="$t('register.validityCertificate') + ':'" prop="papersExpired">
                                <div class="flex">
                                    <div v-if="!isEditMain">
                                        {{ ruleForm.papersExpired && ruleForm.papersExpired.join(" ~ ") }}
                                    </div>
                                    <div v-else class="item-width">
                                        <el-date-picker
                                            :disabled="ruleForm.expiredIsForever == 1"
                                            v-model="ruleForm.papersExpired"
                                            type="daterange"
                                            :start-placeholder="$t('startDate')"
                                            range-separator="-"
                                            :end-placeholder="$t('endDate')"
                                        >
                                        </el-date-picker>
                                    </div>
                                </div>
                            </el-form-item>
                            <!-- 长期 -->
                            <el-form-item label="" prop="" style="margin-bottom: 30px">
                                <div>
                                    <div v-if="!isEditMain">
                                        <!-- 长期 -->
                                        {{ ruleForm.expiredIsForever == 1 ? $t("register.longTerm") : "" }}
                                    </div>
                                    <div v-else>
                                        <el-checkbox-group v-model="ruleForm.expiredIsForever">
                                            <el-checkbox label="1">{{ $t("register.longTerm") }}</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                            </el-form-item>
                            <!-- 手持证件照 -->
                            <el-form-item :label="$t('register.HandHeldPhoto') + ':'" prop="papersPictureUrl">
                                <div class="flex">
                                    <div v-if="!isEditMain">
                                        <BmImage
                                            :src="ruleForm.papersPictureUrl"
                                            :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                                            style="width: 120px; height: 120px"
                                        />
                                    </div>
                                    <div v-else>
                                        <div class="flex vcenter">
                                            <div>
                                                <BmUpload @change="ruleForm.papersPictureUrl = $event" :fileUrl="ruleForm.papersPictureUrl" :show-file-list="false" />
                                            </div>
                                            <div class="ml-120">
                                                <div>
                                                    <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/HandHeldPhoto@2x.png')" />
                                                </div>
                                                <div>{{ $t("register.imgTips") }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                            <!-- 法定代表人证件正面照 -->
                            <el-form-item :label="$t('register.statutoryCertificateFront') + ':'" prop="papersProsPictureUrl">
                                <div class="flex">
                                    <div v-if="!isEditMain">
                                        <BmImage
                                            :src="ruleForm.papersProsPictureUrl"
                                            :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                                            style="width: 120px; height: 120px"
                                        />
                                    </div>
                                    <div v-else>
                                        <div class="flex vcenter">
                                            <div>
                                                <BmUpload @change="ruleForm.papersProsPictureUrl = $event" :fileUrl="ruleForm.papersProsPictureUrl" :show-file-list="false" />
                                            </div>
                                            <div class="ml-120">
                                                <div>
                                                    <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/zhengmian@2x.png')" />
                                                </div>
                                                <div>{{ $t("register.imgTips") }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                            <!-- 法定代表人证件反面照 -->
                            <el-form-item :label="$t('register.statutoryCertificateAgainst') + ':'" prop="papersConsPictureUrl">
                                <div class="flex">
                                    <div v-if="!isEditMain">
                                        <BmImage
                                            :src="ruleForm.papersConsPictureUrl"
                                            :preview-src-list="[ruleForm.papersPictureUrl, ruleForm.papersProsPictureUrl, ruleForm.papersConsPictureUrl]"
                                            style="width: 120px; height: 120px"
                                        />
                                    </div>
                                    <div v-else>
                                        <div class="flex vcenter">
                                            <div>
                                                <BmUpload @change="ruleForm.papersConsPictureUrl = $event" :fileUrl="ruleForm.papersConsPictureUrl" :show-file-list="false" />
                                            </div>
                                            <div class="ml-120">
                                                <div>
                                                    <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/fanmian@2x.png')" />
                                                </div>
                                                <div>{{ $t("register.imgTips") }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                            <!-- 联系地址 -->
                            <!-- <el-form-item :label="$t('register.contactAddress') + ':'" prop="storeAddress" v-if="ruleForm.sellerType == 1">
                                <div class="flex">
                                    <div v-if="!isEditMain">
                                        {{ ruleForm.address }}
                                    </div>
                                    <div v-else class="item-width">
                                        <el-cascader v-if="ruleForm.tradeForm == 1" v-model="ruleForm.storeAddress" :props="addressListOptions.props" filterable clearable />
                                        <el-cascader v-else v-model="ruleForm.storeAddress" :props="addressList.props" filterable clearable />
                                    </div>
                                </div>
                            </el-form-item> -->
                            <!-- 详细地址 -->
                            <!-- <el-form-item :label="$t('register.detailAddress') + ':'" prop="storeAddressDetail" v-if="ruleForm.sellerType == 1">
                                <div class="flex">
                                    <div v-if="!isEditMain">
                                        {{ ruleForm.storeAddressDetail }}
                                    </div>
                                    <div v-else>
                                        <el-input class="item-width" v-model="ruleForm.storeAddressDetail" type="textarea" maxlength="130" show-word-limit rows="3"></el-input>
                                    </div>
                                </div>
                            </el-form-item> -->
                            <div v-if="ruleForm.sellerType == 2">
                                <!-- -------------------------------------企业信息----------------------------------------- -->
                                <div class="fs-16 flex vcenter">
                                    <div class="pane-line"></div>

                                    <span class="pane-fs">{{ $t("register.enterpriseInfo") }}</span>
                                </div>
                                <!-- 公司名称 -->
                                <el-form-item :label="$t('register.BusinessName') + ':'" prop="name">
                                    <div class="flex">
                                        <div v-if="!isEditMain">
                                            {{ ruleForm.name }}
                                        </div>
                                        <div v-else>
                                            <el-input class="item-width" v-model="ruleForm.name" maxlength="100" show-word-limit></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <!-- 公司经营地址 -->
                                <el-form-item :label="$t('register.BusinessAddress') + ':'" prop="companyAddress">
                                    <div class="flex">
                                        <div v-if="!isEditMain">{{ ruleForm.companyAddressView }}</div>
                                        <div v-else class="item-width">
                                            <el-cascader v-if="ruleForm.tradeForm == 1" v-model="ruleForm.companyAddress" :props="addressListOptions.props" filterable />
                                            <el-cascader v-else v-model="ruleForm.companyAddress" :props="addressList.props" filterable />
                                        </div>
                                    </div>
                                </el-form-item>
                                <!-- 详细地址 -->
                                <el-form-item :label="$t('register.detailAddress') + ':'" prop="companyAddressDetail">
                                    <div class="flex">
                                        <div v-if="!isEditMain">{{ ruleForm.companyAddressDetail }}</div>
                                        <div v-else>
                                            <el-input class="item-width" v-model="ruleForm.companyAddressDetail" type="textarea" maxlength="130" show-word-limit rows="3"></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <!-- 营业执照 -->
                                <el-form-item :label="$t('register.businessLicense') + ':'" prop="businessLicense">
                                    <div class="flex">
                                        <div v-if="!isEditMain">
                                            {{ ruleForm.businessLicense }}
                                        </div>
                                        <div v-else>
                                            <el-input class="item-width" v-model="ruleForm.businessLicense" show-word-limit></el-input>
                                        </div>
                                    </div>
                                </el-form-item>
                                <!-- 营业期限 -->
                                <el-form-item :label="$t('register.businessTerm') + ':'" prop="businessExpired">
                                    <div class="flex">
                                        <div v-if="!isEditMain">
                                            {{ ruleForm.businessExpired && ruleForm.businessExpired.join(" ~ ") }}
                                        </div>
                                        <div v-else class="item-width">
                                            <el-date-picker
                                                :disabled="ruleForm.companyExpiredIsForever == 1"
                                                v-model="ruleForm.businessExpired"
                                                type="daterange"
                                                :start-placeholder="$t('startDate')"
                                                range-separator="-"
                                                :end-placeholder="$t('endDate')"
                                            >
                                            </el-date-picker>
                                        </div>
                                    </div>
                                </el-form-item>
                                <!-- 长期 -->
                                <el-form-item prop="">
                                    <div class="flex">
                                        <div v-if="!isEditMain">
                                            <!-- 长期 -->
                                            {{ ruleForm.companyExpiredIsForever == 1 ? $t("register.longTerm") : "" }}
                                        </div>
                                        <div v-else>
                                            <el-checkbox-group v-model="ruleForm.companyExpiredIsForever">
                                                <el-checkbox label="1">{{ $t("register.longTerm") }}</el-checkbox>
                                            </el-checkbox-group>
                                        </div>
                                    </div>
                                </el-form-item>

                                <!-- 营业执照 -->
                                <el-form-item :label="$t('register.businessLicense') + ':'" prop="businessLicensePictureUrl">
                                    <div class="flex">
                                        <div v-if="!isEditMain">
                                            <BmImage :src="ruleForm.businessLicensePictureUrl" :preview-src-list="[ruleForm.businessLicensePictureUrl]" style="width: 120px; height: 120px" />
                                        </div>
                                        <div v-else>
                                            <div class="flex vcenter">
                                                <div>
                                                    <BmUpload @change="ruleForm.businessLicensePictureUrl = $event" :fileUrl="ruleForm.businessLicensePictureUrl" :show-file-list="false" />
                                                </div>
                                                <div class="ml-120">
                                                    <div>
                                                        <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/enterprice.jpg')" />
                                                    </div>
                                                    <div>{{ $t("register.imgTips") }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <div>
                        <el-button v-if="isEditMain == false" @click="isEditMain = !isEditMain">{{ $t("edit") }}</el-button>
                        <el-button v-if="isEditMain == true" @click="submitForm">{{ $t("save") }}</el-button>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
    <!-- 主营类目修改 -->
    <BmDialog v-model:visible="isEditmainBusinessType" :title="$t('register.mainCategories')" :confirm="saveMainBusinessType" :cancel="cancel" :width="600">
        <el-form label-position="left">
            <el-form-item :label="$t('register.mainCategories') + ':'" prop="mainBusinessType">
                <el-checkbox-group v-model="ruleForm.mainBusinessType">
                    <el-checkbox v-for="(item, i) in category" :key="i" :label="item.id">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";
import { basicsAreaFindAreasTree, basicsAreaFindByParentId, adminSellerCheckAccount } from "@/api/goods";
import { adminUmsSellerStoreFindCurrent, adminUmsSellerUpdateStore, adminUmsSellerupdateAuditSubmit } from "@/api/user";
import { find } from "@/api/goods";
import { useStore } from "vuex";
import storage from "@/utils/storage";
export default {
    name: "merchant_Info",
    setup() {
        const { proxy } = getCurrentInstance();
        const route = useRoute();
        const router = useRouter();

        const store = useStore();

        let paneName = ref("base");

        let isEditStoreName = ref(false); // 编辑店铺名称

        let isEditStoreDesc = ref(false); // 编辑店铺简介

        let isEditmainBusinessType = ref(false); // 编辑主营类目

        let isEditMain = ref(false); // 编辑主体信息

        let ruleFormRef = ref(null);

        let userInfo = storage.get("userInfo");

        let disabled = ref(false);

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            //initData();
            cascaderProvinceCity.value = false;
            setTimeout(() => {
                cascaderProvinceCity.value = true;
            }, 0);
        });

        let cascaderProvinceCity = ref(true);

        //主营类目
        let category = ref([]);
        const finds = () => {
            find().then((res) => {
                category.value = res.data;
            });
        };
        finds();

        let ruleForm = reactive({
            papersNumber_zhcn: "", // 证件号码
            expiredIsForever: [],
            mainBusinessType: [], // 主营类目ID
            companyId: "", // 企业id
            companyExpiredIsForever: [],
            storeDesc: "",
            storeName: ""
        });
        const getSroreInfo = () => {
            adminUmsSellerStoreFindCurrent().then((res) => {
                ruleForm.companyId = res.data.umsSellerCompany.id; // 企业id
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
                ruleForm.address = res.data.address; //  个人卖家地址
                ruleForm.storeAddress = [res.data.countryCode + "", res.data.provinceCode + "", res.data.cityCode + "", res.data.districtCode + ""]; //	国家编码 省编码 市编码 区编码
                if (res.data.papersExpiredStart) {
                    ruleForm.papersExpired = [res.data.papersExpiredStart, res.data.papersExpiredEnd]; // 证件有效期
                }

                ruleForm.papersConsPictureUrl = res.data.papersConsPictureUrl; // 证件反面图片url
                ruleForm.papersName = res.data.papersName; // 证件上姓名

                ruleForm.papersPictureUrl = res.data.papersPictureUrl; // 证件图片url
                ruleForm.papersType = Number(res.data.papersType); // 证件类型: 1:大陆身份证, 2.ID证件
                ruleForm.papersProsPictureUrl = res.data.papersProsPictureUrl; // 证件正面图片url
                ruleForm.expiredIsForever = res.data.expiredIsForever != 1 ? [] : ["1"]; // 身份证是否长期

                ruleForm.businessExpired = [res.data.umsSellerCompany.businessExpiredStart, res.data.umsSellerCompany.businessExpiredEnd];
                ruleForm.businessLicense = res.data.umsSellerCompany.businessLicense; // 营业执照
                ruleForm.businessLicensePictureUrl = res.data.umsSellerCompany.businessLicensePictureUrl; // 营业执照图片id
                // 公司经营地址
                ruleForm.companyAddress = [res.data.countryCode, res.data.provinceCode, res.data.cityCode, res.data.districtCode]; //	国家编码 省编码 市编码 区编码
                ruleForm.companyAddressView = res.data.umsSellerCompany.address; // 企业地址
                ruleForm.companyAddressDetail = res.data.umsSellerCompany.addressDetail; // 详情地址
                ruleForm.name = res.data.umsSellerCompany.name; // 企业名称
                ruleForm.companyExpiredIsForever = res.data.umsSellerCompany.expiredIsForever != 1 ? [] : ["1"]; // 营业期限是否长期
                // 证件号码
                if (ruleForm.papersType == 1) {
                    ruleForm.papersNumber_zhcn = res.data.papersNumber;
                } else {
                    ruleForm.papersNumber = res.data.papersNumber;
                }
            });
        };
        getSroreInfo();

        // 账户校验
        const validatepUser = (rule, value, callback) => {
            if (value.length >= 5 && value.length <= 15 && /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test(value)) {
                adminSellerCheckAccount({ account: value })
                    .then((res) => {
                        callback();
                    })
                    .catch((err) => {
                        callback(new Error(err.data.msg));
                    });
            } else {
                callback(new Error(proxy.$t("register.accountFormat")));
                return;
            }
        };

        //"您的邮箱格式不正确"
        const validateEmail = (rule, value, callback) => {
            let reg = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;
            if (!reg.test(value)) {
                callback(new Error(proxy.$t("register.mailboxFormatTncorrect")));
                return;
            } else {
                callback();
            }
        };

        //"您的身份证格式不正确"
        const validate_papersNumber_zhcn = (rule, value, callback) => {
            var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (!regIdNo.test(value)) {
                callback(new Error(proxy.$t("register.cardFormatIncorrect")));
                return false;
            } else {
                callback();
            }
        };

        const rules = reactive({
            account: [
                { validator: validatepUser, trigger: "blur" },
                { required: true, message: "请输入账号", trigger: "blur" },
                { min: 4, max: 15, message: "长度在 30 到 个字符", trigger: "change" }
            ],
            email: [
                { validator: validateEmail, trigger: "blur" },
                { required: true, message: "请输入邮箱", trigger: "blur" }
            ],
            mainBusinessType: [{ required: true, message: proxy.$t("register.selectMainCategories"), trigger: "change" }],
            phonePrefix: [{ required: true, message: proxy.$t("register.selectAreaNumber"), trigger: "blur" }],
            sellerType: [{ required: true, message: proxy.$t("register.selectSellerType"), trigger: "blur" }],
            storeAddress: [{ required: true, message: proxy.$t("register.contactAddress"), trigger: "blur" }],
            storeAddressDetail: [{ required: true, message: proxy.$t("register.enterDetailAddress"), trigger: "blur" }],
            storeDesc: [{ required: true, message: proxy.$t("register.storeBriefDescription"), trigger: "blur" }],
            storeLogoUrl: [{ required: true, message: proxy.$t("register.uploadStoreImg"), trigger: "blur" }],
            storeName: [{ required: true, message: proxy.$t("register.enterStoreName"), trigger: "blur" }],
            storeType: [{ required: true, message: proxy.$t("register.selectStoreType"), trigger: "blur" }],
            tradeForm: [{ required: true, message: proxy.$t("register.selectTradePattern"), trigger: "change" }],
            emailCode: [{ required: true, message: proxy.$t("register.enterCode"), trigger: "blur" }],

            papersNumber_zhcn: [{ validator: validate_papersNumber_zhcn, required: true, trigger: "blur" }],
            papersNumber: [{ required: true, message: proxy.$t("register.certificateNumber"), trigger: "change" }],
            papersName: [{ required: true, message: proxy.$t("register.certificateName"), trigger: "blur" }],
            papersType: [{ required: true, message: proxy.$t("register.certificateType"), trigger: "change" }],
            papersExpired: [{ required: true, message: proxy.$t("register.certificateDate"), trigger: "blur" }],
            papersPictureUrl: [{ required: true, message: proxy.$t("register.uploadupperbodyimg"), trigger: "blur" }],
            papersProsPictureUrl: [{ required: true, message: proxy.$t("register.uploadcertificateFrontImg"), trigger: "blur" }],
            papersConsPictureUrl: [{ required: true, message: proxy.$t("register.uploadCertificateAgainstImg"), trigger: "blur" }],
            expiredIsForever: [{ required: true, message: proxy.$t("register.certificateType"), trigger: "change" }],

            companyAddress: [{ required: true, message: proxy.$t("register.enterBusinessAddress"), trigger: "blur" }],
            companyAddressDetail: [{ required: true, message: proxy.$t("register.enterDetailAddress"), trigger: "blur" }],
            businessLicense: [{ required: true, message: proxy.$t("register.businessLicenseNum"), trigger: "blur" }],
            businessLicensePictureUrl: [{ required: true, message: proxy.$t("register.uploadBusinessLicenseImg"), trigger: "blur" }],
            businessExpired: [{ required: true, message: proxy.$t("register.selectbusinessTerm"), trigger: "blur" }],
            name: [{ required: true, message: proxy.$t("register.enterBrandName"), trigger: "blur" }],
            companyExpiredIsForever: [{ required: true, message: proxy.$t("register.certificateType"), trigger: "change" }]
        });

        function submitForm() {
            let flag = ref(false);
            // let papersExpired = dayjs(ruleForm.papersExpired).format('YYYY-MM-DD HH:mm:ss');
            // let businessExpired = dayjs(ruleForm.businessExpired).format('YYYY-MM-DD HH:mm:ss');

            ruleFormRef.value.validate((valid) => {
                if (valid) {
                    flag.value = true;
                } else {
                    flag.value = false;
                }
            });

            const data = {
                sellerType: ruleForm.sellerType, // 卖家类型
                // storeAddress: ruleForm.storeAddress, // 联系地址
                storeAddressDetail: ruleForm.companyAddressDetail, // 详细地址
                storeDesc: ruleForm.storeDesc, // 店铺简介
                storeLogoUrl: ruleForm.storeLogoUrl, // 店铺logo url
                storeName: ruleForm.storeName, //  店铺名称
                storeType: ruleForm.storeType, // 店铺类型 1: 普通
                tradeForm: ruleForm.tradeForm, // 贸易行驶: 1: 本地贸易 2:跨境贸易

                papersExpiredStart: dayjs(ruleForm.papersExpired[0]).format("YYYY-MM-DD HH:mm:ss"), // 证件有效期
                papersExpiredEnd: dayjs(ruleForm.papersExpired[1]).format("YYYY-MM-DD HH:mm:ss"),
                papersConsPictureUrl: ruleForm.papersConsPictureUrl, // 证件反面图片url
                // papersExpired: papersExpired, // 证件有效期, -1长期
                papersName: ruleForm.papersName, // 证件上姓名
                papersNumber: ruleForm.papersNumber, // 证件号码
                papersPictureUrl: ruleForm.papersPictureUrl, // 证件图片url
                papersType: ruleForm.papersType, // 证件类型: 1:大陆身份证, 2.ID证件
                papersProsPictureUrl: ruleForm.papersProsPictureUrl, // 证件正面图片url
                expiredIsForever: ruleForm.expiredIsForever[0], // 是否长期
                businessExpiredStart: dayjs(ruleForm.businessExpired && ruleForm.businessExpired[0]).format("YYYY-MM-DD HH:mm:ss"),
                businessExpiredEnd: dayjs(ruleForm.businessExpired && ruleForm.businessExpired[1]).format("YYYY-MM-DD HH:mm:ss"),
                // businessExpired: businessExpired, //营业期限
                businessLicense: ruleForm.businessLicense, // 营业执照
                businessLicensePictureUrl: ruleForm.businessLicensePictureUrl, // 营业执照图片id
                // companyAddress: ruleForm.companyAddress, // 公司经营地址

                companyAddressDetail: ruleForm.companyAddressDetail, // 企业详情地址
                name: ruleForm.name, // 企业名称
                companyExpiredIsForever: ruleForm.companyExpiredIsForever[0], // 营业期限是否长期
                sellerId: userInfo.id, //卖家ID
                storeId: userInfo.storeId, // 店铺ID（提交变更审核使用）
                companyId: ruleForm.companyId // 企业id
            };

            if (ruleForm.sellerType == 1) {
                data.cityCode = ruleForm.storeAddress[2] || ""; //	市编码
                data.countryCode = ruleForm.storeAddress[0] || ""; //	国家编码
                data.districtCode = ruleForm.storeAddress[3] || ""; //	区编码
                data.provinceCode = ruleForm.storeAddress[1] || ""; //	省编码
            } else {
                data.cityCode = ruleForm.companyAddress[2] + "" || ""; //	市编码
                data.countryCode = ruleForm.companyAddress[0] + "" || ""; //	国家编码
                data.districtCode = ruleForm.companyAddress[3] + "" || ""; //	区编码
                data.provinceCode = ruleForm.companyAddress[1] + "" || ""; //	省编码
            }

            if (ruleForm.companyExpiredIsForever == 1) {
                data.businessExpired = ["2000-01-01 00:00:00: ", "2099-01-01 00:00:00"];
                delete data.businessExpired;
            }

            // 大陆身份证
            if (ruleForm.papersType == 1) {
                data.papersNumber = ruleForm.papersNumber_zhcn;
            }

            if (flag.value) {
                disabled.value = true;
                const loading = proxy.$loading();
                adminUmsSellerupdateAuditSubmit(data)
                    .then((res) => {
                        disabled.value = false;
                        proxy.$message.success(proxy.$t("register.subAuditSuccess"));
                        // router.push({ path: "/login" });
                        isEditMain.value = false;
                        loading.close();
                    })
                    .catch(() => {
                        disabled.value = false;
                        loading.close();
                    });
            }
        }

        // 修改头像
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

        // tab切换
        const handleClick = (tab, event) => {
            console.log(tab.props.name, event);
            paneName.value = tab.props.name;
            isEditMain.value = false;
        };

        // 修改店铺名称
        const saveStoreName = () => {
            if (ruleForm.storeName == "") {
                proxy.$message.error(proxy.$t("required"));
                return;
            }
            const loading = proxy.$loading();
            adminUmsSellerUpdateStore({ storeName: ruleForm.storeName })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    isEditStoreName.value = !isEditStoreName;
                    getSroreInfo();
                    // store.dispatch("user/getStoreInfo");
                    loading.close();
                })
                .catch((error) => {
                    loading.close();
                });
        };

        // 修改店铺简介
        const saveStoreDesc = () => {
            if (ruleForm.storeDesc == "") {
                proxy.$message.error(proxy.$t("required"));
                return;
            }
            const loading = proxy.$loading();
            adminUmsSellerUpdateStore({ storeDesc: ruleForm.storeDesc })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    isEditStoreDesc.value = !isEditStoreDesc;
                    getSroreInfo();
                    // store.dispatch("user/getStoreInfo");
                    loading.close();
                })
                .catch((error) => {
                    loading.close();
                });
        };

        //切换贸易形式
        const onChangeTradeForm = () => {
            ruleForm.storeAddress = ruleForm_5.companyAddress = [];
        };

        // 修改主营类目
        const saveMainBusinessType = () => {
            isEditmainBusinessType.value = !isEditmainBusinessType;
            const loading = proxy.$loading();
            adminUmsSellerUpdateStore({ mainBusinessType: ruleForm.mainBusinessType.join(",") })
                .then((res) => {
                    proxy.$message.success(res.msg);
                    isEditStoreDesc.value = !isEditStoreDesc;
                    getSroreInfo();
                    // store.dispatch("user/getStoreInfo");
                    loading.close();
                })
                .catch((error) => {
                    loading.close();
                });
        };

        const cancel = () => {
            isEditmainBusinessType.value = !isEditmainBusinessType;
        };

        const addressListOptions = reactive({
            props: {
                lazy: true,
                lazyLoad(node, resolve) {
                    const { level, data } = node;
                    basicsAreaFindByParentId({ parentId: data.id || 0, isCurrentSite: 1, status: 0 })
                        .then((res) => {
                            const nodes = res.data.map((item) => ({
                                id: item.id,
                                value: item.code,
                                label: item.name,
                                leaf: item.hasChild !== 1 //item.hasChilds
                            }));
                            resolve(nodes);
                        })
                        .catch((err) => {});
                }
            }
        });
        // getAddress();

        const addressList = reactive({
            props: {
                lazy: true,
                lazyLoad(node, resolve) {
                    const { level, data } = node;
                    basicsAreaFindByParentId({ parentId: data.id || 0, isCurrentSite: 0, status: 0 })
                        .then((res) => {
                            const nodes = res.data.map((item) => ({
                                id: item.id,
                                value: item.code,
                                label: item.name,
                                leaf: item.hasChild !== 1 //item.hasChilds
                            }));
                            resolve(nodes);
                        })
                        .catch((err) => {});
                }
            }
        });

        return {
            paneName,
            handleClick,
            category,
            ruleForm,
            onChangeUploadPicture,
            saveAvatar,
            isEditStoreName,
            isEditStoreDesc,
            isEditmainBusinessType,
            saveStoreName,
            saveStoreDesc,
            cancel,
            saveMainBusinessType,
            isEditMain,
            rules,
            onChangeTradeForm,
            addressList,
            addressListOptions,
            submitForm,
            cascaderProvinceCity,
            ruleFormRef,
            disabled
        };
    }
};
</script>
<style scoped lang="scss">
.content-wrap {
    height: calc(100vh - 120px);
}
.h-100 {
    height: 100%;
    overflow: auto;
}
::v-deep(.el-tabs__content) {
    height: 100%;
}

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

.el-tabs__header .is-top {
    margin: 0px;
}
/deep/ .avatar-uploader .el-upload {
    border: 1px dashed #42b7ae;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #42b7ae;
    width: 142px;
    height: 80px;
    line-height: 80px;
    text-align: center;
}
.avatar {
    width: 142px;
    height: 80px;
    display: block;
}
</style>
