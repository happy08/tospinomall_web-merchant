<template>
    <HeaderLogin />
    <div class="container">
        <div class="flex center">
            <div class="step">
                <!-- <el-step :steplist="step"> </el-step> -->
                <el-steps :active="step.active" class=" custom-step plr-50" finish-status="success">
                    <el-step v-for="(item, i) in step.list" :key="i" :title="item"></el-step>
                </el-steps>
            </div>
        </div>
        <div class="flex center">
            <div style="max-width: 1125px;width: 1125px;">
                <el-tabs v-model="tab" type="card" class="custom-tabs-green">
                    <el-tab-pane label="用户管理" name="first">
                        <template #label>
                            <div>
                                <div>{{ $t("register.IndividualSellers") }}</div>
                                {{ $t("register.IndividualSellersTip") }}
                            </div>
                        </template>
                        <div class="pane-info ml-84">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="auto" class="demo-ruleForm" autocomplete="off">
                                <div class="fs-16 flex vcenter mb-15">
                                    <div class="pane-line"></div>
                                    <!-- 账户信息 -->
                                    <span class="pane-fs">{{ $t("b2cPlatform.accountInfo") }}</span>
                                </div>
                                <div class="mb-64">
                                    <!-- 登录(主)账号 -->
                                    <el-form-item :label="$t('register.setAccountMain') + ':'" prop="account" class="item-width">
                                        <el-input
                                            :disabled="isNewSite"
                                            v-model="ruleForm.account"
                                            maxlength="15"
                                            minlength="5"
                                            oninput="value=value.replace(/[^\w\.\/]/ig,'')"
                                            show-word-limit
                                            autocomplete="off"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item :label="$t('phone')">{{ temp.phonePrefix }} {{ temp.phone }}</el-form-item>
                                    <!-- 邮箱账户 -->
                                    <el-form-item :label="$t('register.EmailAccount') + ':'" prop="email" class="item-width">
                                        <div>
                                            <el-input :disabled="isNewSite" :placeholder="$t('register.enterEmailAccount')" v-model="ruleForm.email" maxlength="30" show-word-limit> </el-input>
                                        </div>
                                    </el-form-item>
                                    <el-form-item v-if="!isNewSite" :label="$t('register.code') + ':'" prop="emailCode" class="item-width">
                                        <el-input v-model="ruleForm.emailCode" maxlength="6">
                                            <template #append>
                                                <el-button type="info" @click="getEmailMessage">{{ isCountdown ? count.count + "s" : $t("register.getCode") }}</el-button>
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                </div>
                                <!-- 店铺基本信息 -->
                                <div class="fs-16 flex vcenter mb-15">
                                    <div class="pane-line"></div>
                                    <span class="pane-fs">{{ $t("register.storeBascInfo") }}</span>
                                </div>
                                <!-- 店铺类型 -->
                                <el-form-item :label="$t('register.storeType')" prop="storeType " class="item-width">
                                    <el-radio-group v-model="ruleForm.storeType">
                                        <el-radio :label="1">{{ $t("register.OrdinaryShops") }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <!-- 贸易形式 -->
                                <el-form-item :label="$t('register.tradePattern')" prop="tradeForm">
                                    <!-- 本地贸易 跨境贸易-->
                                    <el-radio-group v-model="ruleForm.tradeForm" @change="onChangeTradeForm">
                                        <el-radio :label="1">{{ $t("register.localTrade") }}</el-radio>
                                        <el-radio :label="2">{{ $t("register.crossBorderTrade") }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <!-- 店铺名称 -->
                                <el-form-item :label="$t('register.storeName') + ':'" prop="storeName" class="item-width">
                                    <el-input v-model="ruleForm.storeName" maxlength="30" show-word-limit></el-input>
                                </el-form-item>
                                <!-- 店铺简介 -->
                                <el-form-item :label="$t('register.ShopIntroduction') + ':'" prop="storeDesc" class="item-width">
                                    <el-input v-model="ruleForm.storeDesc" type="textarea" rows="3" maxlength="255" show-word-limit></el-input>
                                </el-form-item>
                                <!-- 主营类目 -->
                                <el-form-item :label="$t('register.mainCategories') + ':'" prop="mainBusinessType">
                                    <el-checkbox-group v-model="ruleForm.mainBusinessType">
                                        <el-checkbox v-for="(item, i) in category" :key="i" :label="item.id">{{ item.name }}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>

                                <!-- 设置登录密码 -->
                                <el-form-item :label="$t('register.setPassword') + ':'" prop="password" class="item-width">
                                    <el-input type="password" v-model="ruleForm.password" show-password oninput="value=value.replace(/[^\w\.\/]/ig,'')" maxlength="20" autocomplete="off"></el-input>
                                </el-form-item>
                                <!-- 重复登录密码 -->
                                <el-form-item :label="$t('register.repetitionPassword') + ':'" prop="repeatPassword" class="item-width">
                                    <el-input type="password" v-model="ruleForm.repeatPassword" oninput="value=value.replace(/[^\w\.\/]/ig,'')" show-password maxlength="20"></el-input>
                                </el-form-item>
                                <!-- 联系地址 -->
                                <el-form-item :label="$t('register.contactAddress') + ':'" prop="storeAddress" class="item-width" v-if="cascaderProvinceCity">
                                    <el-cascader v-if="ruleForm.tradeForm == 1" v-model="ruleForm.storeAddress" :props="addressListOptions.props" filterable clearable />
                                    <el-cascader v-else v-model="ruleForm.storeAddress" :props="addressList.props" filterable clearable />
                                </el-form-item>
                                <!-- 详细地址 -->
                                <el-form-item :label="$t('register.detailAddress') + ':'" prop="storeAddressDetail" class="item-width">
                                    <el-input v-model="ruleForm.storeAddressDetail" type="textarea" maxlength="130" show-word-limit rows="3"></el-input>
                                </el-form-item>

                                <!-- 入驻邀请码 -->
                                <el-form-item :label="$t('register.CheckInInvitationCode') + ':'" prop="invitationCode" class="item-width">
                                    <el-input v-model="ruleForm.invitationCode" maxlength="30" show-word-limit></el-input>
                                </el-form-item>
                            </el-form>

                            <el-form :model="ruleForm_2" :rules="rules_2" ref="ruleFormRef_2" label-width="auto" class="demo-ruleForm mb-64">
                                <div class="fs-16 flex vcenter mb-15">
                                    <div class="pane-line"></div>
                                    <!-- 证件信息 -->
                                    <span class="pane-fs">{{ $t("register.certificateInfo") }}</span>
                                </div>
                                <!-- 证件类型 -->
                                <el-form-item :label="$t('register.certificateType') + ':'" prop="papersType" class="mb-15">
                                    <el-radio-group v-model="ruleForm_2.papersType">
                                        <el-radio :label="1">{{ $t("register.ChineseMainCard") }}</el-radio>
                                        <el-radio :label="2">{{ $t("register.idCard") }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <!-- 姓名 -->
                                <el-form-item :label="$t('register.name') + ':'" prop="papersName" class="item-width">
                                    <el-input v-model="ruleForm_2.papersName" maxlength="30" show-word-limit></el-input>
                                </el-form-item>
                                <!-- 证件号码 -->
                                <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber_zhcn" class="item-width" v-if="ruleForm_2.papersType == 1">
                                    <el-input
                                        oninput="value=value.replace(/[^\w\.\/]/ig,'')"
                                        v-model="ruleForm_2.papersNumber_zhcn"
                                        :placeholder="$t('register.enterCertificateNumber')"
                                        maxlength="18"
                                        show-word-limit
                                    ></el-input>
                                </el-form-item>
                                <!-- 证件号码 -->
                                <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber" class="item-width" v-if="ruleForm_2.papersType == 2">
                                    <el-input
                                        oninput="value=value.replace(/[^\w\.\/]/ig,'')"
                                        v-model="ruleForm_2.papersNumber"
                                        :placeholder="$t('register.enterCertificateNumber')"
                                        maxlength="30"
                                        show-word-limit
                                    ></el-input>
                                </el-form-item>
                                <!-- 证件有效期 -->
                                <el-form-item
                                    v-if="ruleForm_2.expiredIsForever != 1"
                                    :label="$t('register.validityCertificate') + ':'"
                                    prop="papersExpired"
                                    class="item-width"
                                    style="margin-bottom: 30px;"
                                >
                                    <el-date-picker v-model="ruleForm_2.papersExpired" type="daterange" :start-placeholder="$t('startDate')" range-separator="-" :end-placeholder="$t('endDate')">
                                    </el-date-picker>
                                </el-form-item>
                                <!-- 长期 -->
                                <el-form-item label="" prop="" class="item-width" style="margin-bottom: 30px;">
                                    <el-checkbox-group v-model="ruleForm_2.expiredIsForever">
                                        <el-checkbox label="1">{{ $t("register.longTerm") }}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <!-- 手持证件照 -->
                                <el-form-item :label="$t('register.HandHeldPhoto') + ':'" prop="papersPictureUrl">
                                    <div class="flex vcenter">
                                        <div>
                                            <BmUpload @change="ruleForm_2.papersPictureUrl = $event" :fileUrl="ruleForm_2.papersPictureUrl" :show-file-list="false" />
                                        </div>
                                        <div class="ml-120 ">
                                            <div>
                                                <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/HandHeldPhoto@2x.png')" />
                                            </div>
                                            <div>{{ $t("register.imgTips") }}</div>
                                        </div>
                                    </div>
                                </el-form-item>
                                <!-- 法定代表人证件正面照 -->
                                <el-form-item :label="$t('register.statutoryCertificateFront') + ':'" prop="papersProsPictureUrl">
                                    <div class="flex vcenter">
                                        <div>
                                            <BmUpload @change="ruleForm_2.papersProsPictureUrl = $event" :fileUrl="ruleForm_2.papersProsPictureUrl" :show-file-list="false" />
                                        </div>
                                        <div class="ml-120 ">
                                            <div>
                                                <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/zhengmian@2x.png')" />
                                            </div>
                                            <div>{{ $t("register.imgTips") }}</div>
                                        </div>
                                    </div>
                                </el-form-item>
                                <!-- 法定代表人证件反面照 -->
                                <el-form-item :label="$t('register.statutoryCertificateAgainst') + ':'" prop="papersConsPictureUrl">
                                    <div class="flex vcenter">
                                        <div>
                                            <BmUpload @change="ruleForm_2.papersConsPictureUrl = $event" :fileUrl="ruleForm_2.papersConsPictureUrl" :show-file-list="false" />
                                        </div>
                                        <div class="ml-120 ">
                                            <div>
                                                <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/fanmian@2x.png')" />
                                            </div>
                                            <div>{{ $t("register.imgTips") }}</div>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="flex center" style="margin:50px 0 50px 0;">
                            <!--提交审核资料 去登录 -->
                            <el-button class="btn-next" type="primary" @click="submitForm" :disabled="disabled">{{ $t("register.subAuditData") }}</el-button>
                            <span class="ml-30"
                                >{{ $t("register.alreadyAccount") }}? <span class="green cp" @click="goLogin">{{ $t("register.goLogin") }}</span></span
                            >
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="专业卖家" name="second">
                        <template #label>
                            <div>
                                <div>{{ $t("register.ProfessionalSellers") }}</div>
                                {{ $t("register.enterpriseSellersTip") }}
                            </div>
                        </template>
                        <div class="pane-info ml-84">
                            <el-form :model="ruleForm_3" :rules="rules_3" ref="ruleFormRef_3" label-width="auto" class="demo-ruleForm">
                                <div class="fs-16 flex vcenter mb-15">
                                    <div class="pane-line"></div>
                                    <!-- 账户信息 -->
                                    <span class="pane-fs">{{ $t("b2cPlatform.accountInfo") }}</span>
                                </div>
                                <!-- 登录(主)账号 -->
                                <el-form-item :label="$t('register.setAccountMain') + ':'" prop="account" class="item-width">
                                    <el-input
                                        :disabled="isNewSite"
                                        v-model="ruleForm_3.account"
                                        maxlength="15"
                                        minlength="5"
                                        oninput="value=value.replace(/[^\w\.\/]/ig,'')"
                                        show-word-limit
                                        autocomplete="off"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('phone')">{{ temp.phonePrefix }} {{ temp.phone }}</el-form-item>
                                <!-- 邮箱账户 -->
                                <el-form-item :label="$t('register.EmailAccount') + ':'" prop="email" class="item-width">
                                    <div>
                                        <el-input :disabled="isNewSite" :placeholder="$t('register.enterEmailAccount')" v-model="ruleForm_3.email" maxlength="30" show-word-limit> </el-input>
                                    </div>
                                </el-form-item>

                                <!-- 验证码 -->
                                <el-form-item v-if="!isNewSite" :label="$t('register.code') + ':'" prop="emailCode" class="item-width">
                                    <el-input v-model="ruleForm_3.emailCode" maxlength="6">
                                        <template #append>
                                            <el-button type="info" @click="getEmailMessage_2">{{ isCountdown ? count.count + "s" : $t("register.getCode") }}</el-button>
                                        </template>
                                    </el-input>
                                </el-form-item>

                                <div class="fs-16 flex vcenter">
                                    <div class="pane-line"></div>
                                    <!-- 店铺基本信息 -->
                                    <span class="pane-fs">{{ $t("register.storeBascInfo") }}</span>
                                </div>
                                <!-- 店铺类型 -->
                                <el-form-item :label="$t('register.storeType')" prop="storeType" class="item-width">
                                    <el-radio-group v-model="ruleForm_3.storeType">
                                        <el-radio :label="1">{{ $t("register.OrdinaryShops") }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <!-- 贸易形式 -->
                                <el-form-item :label="$t('register.tradePattern')" prop="tradeForm">
                                    <!-- 1本地贸易 2跨境贸易-->
                                    <el-radio-group v-model="ruleForm_3.tradeForm" @change="onChangeTradeForm">
                                        <el-radio :label="1">{{ $t("register.localTrade") }}</el-radio>
                                        <el-radio :label="2">{{ $t("register.crossBorderTrade") }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <!-- 店铺名称 -->
                                <el-form-item :label="$t('register.storeName') + ':'" prop="storeName" class="item-width">
                                    <el-input v-model="ruleForm_3.storeName" maxlength="30" show-word-limit></el-input>
                                </el-form-item>
                                <!-- 店铺简介 -->
                                <el-form-item :label="$t('register.ShopIntroduction') + ':'" prop="storeDesc" class="item-width">
                                    <el-input v-model="ruleForm_3.storeDesc" type="textarea" rows="3" maxlength="255" show-word-limit></el-input>
                                </el-form-item>
                                <!-- 主营类目 -->
                                <el-form-item :label="$t('register.mainCategories') + ':'" prop="mainBusinessType">
                                    <el-checkbox-group v-model="ruleForm_3.mainBusinessType">
                                        <el-checkbox v-for="(item, i) in category" :key="i" :label="item.id">{{ item.name }}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>

                                <!-- 设置登录密码 -->
                                <el-form-item :label="$t('register.setPassword') + ':'" prop="password" class="item-width">
                                    <el-input type="password" v-model="ruleForm_3.password" show-password oninput="value=value.replace(/[^\w\.\/]/ig,'')" maxlength="20" autocomplete="off"></el-input>
                                </el-form-item>
                                <!-- 重复登录密码 -->
                                <el-form-item :label="$t('register.repetitionPassword') + ':'" prop="repeatPassword" class="item-width">
                                    <el-input type="password" v-model="ruleForm_3.repeatPassword" show-password oninput="value=value.replace(/[^\w\.\/]/ig,'')" maxlength="20"></el-input>
                                </el-form-item>

                                <!-- 入驻邀请码 -->
                                <el-form-item :label="$t('register.CheckInInvitationCode') + ':'" prop="invitationCode" class="item-width">
                                    <el-input v-model="ruleForm_3.invitationCode" maxlength="30" show-word-limit></el-input>
                                </el-form-item>
                            </el-form>

                            <el-form :model="ruleForm_4" :rules="rules_4" ref="ruleFormRef_4" label-width="auto" class="demo-ruleForm">
                                <div class="fs-16 flex vcenter mb-15">
                                    <div class="pane-line"></div>
                                    <!-- 证件信息 (法人) -->
                                    <span class="pane-fs">{{ $t("register.certificateInfo") }} ({{ $t("register.legalPerson") }})</span>
                                </div>
                                <!-- 证件类型 -->
                                <el-form-item :label="$t('register.certificateType') + ':'" prop="papersType" class="mb-15">
                                    <el-radio-group v-model="ruleForm_4.papersType">
                                        <el-radio :label="1">{{ $t("register.ChineseMainCard") }}</el-radio>
                                        <el-radio :label="2">{{ $t("register.idCard") }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <!-- 姓名 -->
                                <el-form-item :label="$t('register.name') + ':'" prop="papersName" class="item-width">
                                    <el-input v-model="ruleForm_4.papersName" maxlength="30" show-word-limit></el-input>
                                </el-form-item>
                                <!-- 证件号码 -->
                                <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber_zhcn" class="item-width" v-if="ruleForm_4.papersType == 1">
                                    <el-input
                                        oninput="value=value.replace(/[^\w\.\/]/ig,'')"
                                        v-model="ruleForm_4.papersNumber_zhcn"
                                        :placeholder="$t('register.enterCertificateNumber')"
                                        maxlength="18"
                                        show-word-limit
                                    ></el-input>
                                </el-form-item>
                                <!-- 证件号码 -->
                                <el-form-item :label="$t('register.certificateNum') + ':'" prop="papersNumber" class="item-width" v-if="ruleForm_4.papersType == 2">
                                    <el-input
                                        oninput="value=value.replace(/[^\w\.\/]/ig,'')"
                                        v-model="ruleForm_4.papersNumber"
                                        :placeholder="$t('register.enterCertificateNumber')"
                                        maxlength="30"
                                        show-word-limit
                                    ></el-input>
                                </el-form-item>
                                <!-- 证件有效期 -->
                                <el-form-item v-if="ruleForm_4.expiredIsForever != 1" :label="$t('register.validityCertificate') + ':'" prop="papersExpired" class="item-width">
                                    <el-date-picker v-model="ruleForm_4.papersExpired" type="daterange" :start-placeholder="$t('startDate')" range-separator="-" :end-placeholder="$t('endDate')">
                                    </el-date-picker>
                                </el-form-item>
                                <!-- 长期 -->
                                <el-form-item label="" prop="" class="item-width" style="margin-bottom: 30px;">
                                    <el-checkbox-group v-model="ruleForm_4.expiredIsForever">
                                        <el-checkbox label="1">{{ $t("register.longTerm") }}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <!-- 手持证件照 -->
                                <el-form-item :label="$t('register.HandHeldPhoto') + ':'" prop="papersPictureUrl">
                                    <div class="flex vcenter">
                                        <div>
                                            <BmUpload @change="ruleForm_4.papersPictureUrl = $event" :fileUrl="ruleForm_4.papersPictureUrl" :show-file-list="false" />
                                        </div>
                                        <div class="ml-120 ">
                                            <div>
                                                <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/HandHeldPhoto@2x.png')" />
                                            </div>
                                            <div>{{ $t("register.imgTips") }}</div>
                                        </div>
                                    </div>
                                </el-form-item>
                                <!-- 法定代表人证件正面照 -->
                                <el-form-item :label="$t('register.statutoryCertificateFront') + ':'" prop="papersProsPictureUrl">
                                    <div class="flex vcenter">
                                        <div>
                                            <BmUpload @change="ruleForm_4.papersProsPictureUrl = $event" :fileUrl="ruleForm_4.papersProsPictureUrl" :show-file-list="false" />
                                        </div>
                                        <div class="ml-120 ">
                                            <div>
                                                <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/zhengmian@2x.png')" />
                                            </div>
                                            <div>{{ $t("register.imgTips") }}</div>
                                        </div>
                                    </div>
                                </el-form-item>
                                <!-- 法定代表人证件反面照 -->
                                <el-form-item :label="$t('register.statutoryCertificateAgainst') + ':'" prop="papersConsPictureUrl">
                                    <div class="flex vcenter">
                                        <div>
                                            <BmUpload @change="ruleForm_4.papersConsPictureUrl = $event" :fileUrl="ruleForm_4.papersConsPictureUrl" :show-file-list="false" />
                                        </div>
                                        <div class="ml-120 ">
                                            <div>
                                                <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/fanmian@2x.png')" />
                                            </div>
                                            <div>{{ $t("register.imgTips") }}</div>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>

                            <el-form :model="ruleForm_5" :rules="rules_5" ref="ruleFormRef_5" label-width="auto" class="demo-ruleForm mb-110">
                                <!-- 企业信息 -->
                                <div class="fs-16 flex vcenter">
                                    <div class="pane-line"></div>
                                    <span class="pane-fs">{{ $t("register.enterpriseInfo") }}</span>
                                </div>
                                <!-- 公司名称 -->
                                <el-form-item :label="$t('register.BusinessName') + ':'" prop="name" class="item-width">
                                    <el-input v-model="ruleForm_5.name" maxlength="100" show-word-limit></el-input>
                                </el-form-item>
                                <!-- 公司经营地址 -->
                                <el-form-item :label="$t('register.BusinessAddress') + ':'" prop="companyAddress" class="item-width" v-if="cascaderProvinceCity">
                                    <!-- <el-cascader
                                        v-if="ruleForm_3.tradeForm == 1"
                                        :options="addressListOptions"
                                        :props="{ value: 'code', label: 'name', children: 'aresChilds' }"
                                        @change="handleChange_5"
                                        v-model="ruleForm_5.companyAddress"
                                        filterable
                                    ></el-cascader> -->
                                    <el-cascader v-if="ruleForm_3.tradeForm == 1" v-model="ruleForm_5.companyAddress" :props="addressListOptions.props" filterable />
                                    <el-cascader v-else v-model="ruleForm_5.companyAddress" :props="addressList.props" filterable />
                                </el-form-item>
                                <!-- 详细地址 -->
                                <el-form-item :label="$t('register.detailAddress') + ':'" prop="companyAddressDetail" class="item-width">
                                    <el-input v-model="ruleForm_5.companyAddressDetail" type="textarea" maxlength="130" show-word-limit rows="3"></el-input>
                                </el-form-item>
                                <!-- 营业执照号 -->
                                <el-form-item :label="$t('register.businessLicenseNum') + ':'" prop="businessLicense" class="item-width">
                                    <el-input v-model="ruleForm_5.businessLicense" show-word-limit></el-input>
                                </el-form-item>
                                <!-- 营业期限 -->
                                <el-form-item :label="$t('register.businessTerm') + ':'" prop="businessExpired" class="item-width">
                                    <el-date-picker
                                        :disabled="ruleForm_5.companyExpiredIsForever == 1"
                                        v-model="ruleForm_5.businessExpired"
                                        type="daterange"
                                        :start-placeholder="$t('startDate')"
                                        range-separator="-"
                                        :end-placeholder="$t('endDate')"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                                <!-- 长期 -->
                                <el-form-item prop="" class="item-width">
                                    <el-checkbox-group v-model="ruleForm_5.companyExpiredIsForever">
                                        <el-checkbox label="1">{{ $t("register.longTerm") }}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <!-- 营业执照 -->
                                <el-form-item :label="$t('register.businessLicense') + ':'" prop="businessLicensePictureUrl">
                                    <div class="flex vcenter">
                                        <div>
                                            <BmUpload @change="ruleForm_5.businessLicensePictureUrl = $event" :fileUrl="ruleForm_5.businessLicensePictureUrl" :show-file-list="false" />
                                        </div>
                                        <div class="ml-120 ">
                                            <div>
                                                <span>{{ $t("register.example") }}: </span><img class="ml-15" :src="require('@/assets/img/enterprice.jpg')" />
                                            </div>
                                            <div>{{ $t("register.imgTips") }}</div>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>

                            <div class="flex center" style="margin-bottom: 129px;">
                                <!-- 提交审核资料  去登录-->
                                <el-button class="btn-next" type="primary" @click="submitForm_2">{{ $t("register.subAuditData") }}</el-button>
                                <span class="ml-30"
                                    >{{ $t("register.alreadyAccount") }}? <span class="green cp" @click="goLogin">{{ $t("register.goLogin") }}</span></span
                                >
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
    <el-dialog :title="state.title" v-model="state.centerDialogVisible" width="70%" :close-on-click-modal="false" :show-close="false">
        <div v-html="agreement.content" style="max-height: 500px;"></div>
        <template #footer>
            <div class="flex hcenter vcenter">
                <span>
                    <!-- 同意并继续 -->
                    <el-button class="btn" type="primary" @click="submitConfirm">{{ $t("register.agreeNext") }}</el-button>
                </span>
            </div>
        </template>
    </el-dialog>

    <el-dialog title="" v-model="state.tabs" width="30%">
        <div class="flex hcenter vcenter" style="height: 150px;">
            <span>{{ $t("register.operationTip") }}</span>
        </div>
        <div class="flex hcenter vcenter">
            <span>
                <el-button @click="cancel">{{ $t("register.cancel") }}</el-button>
                <el-button type="primary" @click="confirm">{{ $t("register.confirm") }}</el-button>
            </span>
        </div>
    </el-dialog>
</template>

<script>
import { ref, reactive, unref, getCurrentInstance, onMounted, nextTick, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import HeaderLogin from "@/components/headerLogin";
import { register, getEmailCode } from "@/api/user";
import { basicsAreaFindByParentId, adminSellerCheckAccount } from "@/api/goods";
import { basicsOperateSinglePageFindByQuery, adminFindByIdNotLogin } from "@/api/user";
import { find } from "@/api/goods";
import dayjs from "dayjs";
import { encrypt } from "@/utils/cryptoAES";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { useStore } from "vuex";
export default {
    name: "registerDetail",
    components: { HeaderLogin },
    setup() {
        const { proxy } = getCurrentInstance();
        const route = useRoute();
        const router = useRouter();
        const store = useStore();

        const lang = computed(() => store.state.app.lang);
        watch(lang, (nVal) => {
            //initData();
            cascaderProvinceCity.value = false;
            setTimeout(() => {
                cascaderProvinceCity.value = true;
            }, 0);
        });

        let cascaderProvinceCity = ref(true);

        let temp = reactive({ phone: "", phonePrefix: "" });

        let disabled = ref(false);

        let userId = "";
        let isNewSite = ref(false);

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        onMounted(() => {
            console.log("onmounted");
            temp.phone = route.query.phone;
            temp.phonePrefix = route.query.phonePrefix;
            finds();
            if (route.query.id) {
                isNewSite.value = true;
                adminFindByIdNotLogin({ id: route.query.id })
                    .then((res) => {
                        console.log(res);
                        ruleForm.account = res.data.account;
                        ruleForm.email = res.data.email;
                        temp.phonePrefix = res.data.phonePrefix;
                        temp.phone = res.data.phone;
                        userId = res.data.id;
                        ruleForm_3.account = res.data.account;
                        ruleForm_3.email = res.data.email;
                    })
                    .catch(() => {});
            }
        });

        let category = ref([]);
        const finds = () => {
            find()
                .then((res) => {
                    console.log("主营类目");
                    console.log(res);
                    category.value = res.data;
                })
                .catch(() => {});
        };

        const step = reactive({
            list: [proxy.$t("register.storeInfo"), proxy.$t("register.qualificationInfo"), proxy.$t("register.auditPlatform"), proxy.$t("register.registerSuccess")],
            active: 1
        });

        const tab = ref("first");

        let ruleFormRef = ref(null);
        let ruleFormRef_2 = ref(null);
        let ruleFormRef_3 = ref(null);
        let ruleFormRef_4 = ref(null);
        let ruleFormRef_5 = ref(null);

        const ruleForm = reactive({
            account: "",
            brandlds: "", // 品牌id
            email: "", // 邮箱
            invitationCode: "", // 邀请码
            mainBusinessType: [], // 主营类目ID
            password: "", // 密码
            phone: "", // 手机号
            phonePrefix: "", // 手机号前缀
            sellerType: "1", // 卖家类型
            storeAddress: "", // 联系地址
            storeAddressDetail: "", // 详细地址
            storeDesc: "", // 店铺简介
            storeLogoUrl: "", // 店铺logo url
            storeName: "", //  店铺名称
            storeType: 1, // 店铺类型 1: 普通
            tradeForm: 1, // 贸易行驶: 1: 本地贸易 2:跨境贸易
            emailCode: "", // 邮箱验证码
            repeatPassword: "" // 密码
        });

        const ruleForm_2 = reactive({
            papersConsPictureUrl: "", // 证件反面图片url
            papersExpired: [], // 证件有效期, -1长期
            papersName: "", // 证件上姓名
            papersNumber_zhcn: "", // 证件号码
            papersNumber: "", // 证件号码
            papersPictureUrl: "", // 证件图片url
            papersType: "", // 证件类型: 1:大陆身份证, 2.ID证件
            papersProsPictureUrl: "", // 证件正面图片url
            expiredIsForever: []
        });

        const ruleForm_3 = reactive({
            account: "",
            brandlds: "", // 品牌id
            businessExpired: "", //营业期限
            businessLicense: "", // 营业执照
            businessLicensePictureUrl: "", // 营业执照图片id
            email: "", // 邮箱
            invitationCode: "", // 邀请码
            mainBusinessType: [], // 主营类目ID
            name: "", // 企业名称
            papersType: "", // 证件类型: 1:大陆身份证, 2.ID证件
            password: "", // 密码
            phone: "", // 手机号
            phonePrefix: "", // 手机号前缀
            sellerType: "2", // 卖家类型
            storeDesc: "", // 店铺简介
            storeLogoUrl: "", // 店铺logo url
            storeName: "", //  店铺名称
            storeType: 1, // 店铺类型 1: 普通
            tradeForm: 1, // 贸易行驶: 1: 本地贸易 2:跨境贸易
            emailCode: "", // 邮箱验证码
            repeatPassword: ""
        });

        const ruleForm_4 = reactive({
            papersConsPictureUrl: "", // 证件反面图片url
            papersExpired: [], // 证件有效期, -1长期
            papersName: "", // 证件上姓名
            papersNumber_zhcn: "",
            papersNumber: "", // 证件号码
            papersPictureUrl: "", // 证件图片url
            papersType: "", // 证件类型: 1:大陆身份证, 2.ID证件
            papersProsPictureUrl: "", // 证件正面图片url
            papersType: "", // 证件类型: 1:大陆身份证, 2.ID证件
            expiredIsForever: []
        });

        const ruleForm_5 = reactive({
            businessExpired: [], //营业期限
            businessLicense: "", // 营业执照
            businessLicensePictureUrl: "", // 营业执照图片id
            companyAddress: "", // 公司经营地址
            companyAddressDetail: "", // 公司详情地址
            name: "", // 企业名称
            companyExpiredIsForever: []
        });

        watch(
            () => ruleForm_5.companyExpiredIsForever,
            (nVal) => {
                if (ruleForm_5.companyExpiredIsForever == 1) {
                    ruleForm_5.businessExpired = ["2000-01-01 00:00:00: ", "2099-01-01 00:00:00"]; //营业期限
                } else {
                    ruleForm_5.businessExpired = [];
                }
            }
        );

        const validatepPassword = (rule, value, callback) => {
            if (value.length >= 6 && value.length <= 20 && /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test(value)) {
                callback();
            } else {
                callback(new Error(proxy.$t("register.passwordLength")));
            }
        };

        const validatepPhoneCode = (rule, value, callback) => {
            if (value !== ruleForm.password) {
                callback(new Error(proxy.$t("register.inconformityPassword")));
            } else {
                callback();
            }
        };

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

        const rules = {
            account: [
                { validator: validatepUser, trigger: "blur" },
                { required: true, message: "请输入账号", trigger: "blur" },
                { min: 4, max: 15, message: "长度在 5 到 15 个字符", trigger: "change" }
            ],
            email: [
                { validator: validateEmail, trigger: "blur" },
                { required: true, message: "请输入邮箱", trigger: "blur" }
            ],
            mainBusinessType: [{ required: true, message: proxy.$t("register.selectMainCategories"), trigger: "change" }],
            password: [
                { validator: validatepPassword, trigger: "change" },
                { required: true, message: "请输入密码", trigger: "change" }
            ],
            repeatPassword: [{ validator: validatepPhoneCode, trigger: "change" }],
            phonePrefix: [{ required: true, message: proxy.$t("register.selectAreaNumber"), trigger: "blur" }],
            sellerType: [{ required: true, message: proxy.$t("register.selectSellerType"), trigger: "blur" }],
            storeAddress: [{ required: true, message: proxy.$t("register.contactAddress"), trigger: "blur" }],
            storeAddressDetail: [{ required: true, message: proxy.$t("register.enterDetailAddress"), trigger: "blur" }],
            storeDesc: [{ required: true, message: proxy.$t("register.storeBriefDescription"), trigger: "blur" }],
            storeLogoUrl: [{ required: true, message: proxy.$t("register.uploadStoreImg"), trigger: "blur" }],
            storeName: [{ required: true, message: proxy.$t("register.enterStoreName"), trigger: "blur" }],
            storeType: [{ required: true, message: proxy.$t("register.selectStoreType"), trigger: "blur" }],
            tradeForm: [{ required: true, message: proxy.$t("register.selectTradePattern"), trigger: "change" }],
            emailCode: [{ required: true, message: proxy.$t("register.enterCode"), trigger: "blur" }]
        };

        const rules_2 = reactive({
            papersNumber_zhcn: [{ validator: validate_papersNumber_zhcn, trigger: "blur" }],
            papersNumber: [{ required: true, message: proxy.$t("register.certificateNumber"), trigger: "change" }],
            papersName: [{ required: true, message: proxy.$t("register.certificateName"), trigger: "blur" }],
            papersType: [{ required: true, message: proxy.$t("register.certificateType"), trigger: "change" }],
            papersExpired: [{ required: true, message: proxy.$t("register.certificateDate"), trigger: "blur" }],
            papersPictureUrl: [{ required: true, message: proxy.$t("register.uploadupperbodyimg"), trigger: "blur" }],
            papersProsPictureUrl: [{ required: true, message: proxy.$t("register.uploadcertificateFrontImg"), trigger: "blur" }],
            papersConsPictureUrl: [{ required: true, message: proxy.$t("register.uploadCertificateAgainstImg"), trigger: "blur" }],
            expiredIsForever: [{ required: true, message: proxy.$t("register.selectLongTerm"), trigger: "change" }]
        });

        const validatep3Password = (rule, value, callback) => {
            if (value.length >= 6 && value.length <= 20 && /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test(value)) {
                callback();
            } else {
                callback(new Error(proxy.$t("register.passwordLength")));
            }
        };

        const validatep3PhoneCode = (rule, value, callback) => {
            if (value !== ruleForm_3.password) {
                callback(new Error(proxy.$t("register.inconformityPassword")));
            } else {
                callback();
            }
        };

        const rules_3 = reactive({
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
            password: [
                { validator: validatep3Password, trigger: "change" },
                { required: true, message: "请输入密码", trigger: "change" }
            ],
            repeatPassword: [{ validator: validatep3PhoneCode, trigger: "change" }],
            phonePrefix: [{ required: true, message: proxy.$t("register.selectAreaNumber"), trigger: "blur" }],
            sellerType: [{ required: true, message: proxy.$t("register.selectSellerType"), trigger: "blur" }],
            storeDesc: [{ required: true, message: proxy.$t("register.storeBriefDescription"), trigger: "blur" }],
            storeLogoUrl: [{ required: true, message: proxy.$t("register.uploadStoreImg"), trigger: "blur" }],
            storeName: [{ required: true, message: proxy.$t("register.enterStoreName"), trigger: "blur" }],
            storeType: [{ required: true, message: proxy.$t("register.selectStoreType"), trigger: "blur" }],
            tradeForm: [{ required: true, message: proxy.$t("register.selectTradePattern"), trigger: "change" }],
            emailCode: [{ required: true, message: proxy.$t("register.enterCode"), trigger: "blur" }]
        });

        const rules_4 = reactive({
            papersNumber_zhcn: [{ validator: validate_papersNumber_zhcn, required: true, trigger: "blur" }],
            papersNumber: [{ required: true, message: proxy.$t("register.certificateNumber"), trigger: "change" }],
            papersName: [{ required: true, message: proxy.$t("register.certificateName"), trigger: "blur" }],
            papersType: [{ required: true, message: proxy.$t("register.certificateType"), trigger: "change" }],
            papersExpired: [{ required: true, message: proxy.$t("register.certificateDate"), trigger: "blur" }],
            papersPictureUrl: [{ required: true, message: proxy.$t("register.uploadupperbodyimg"), trigger: "blur" }],
            papersProsPictureUrl: [{ required: true, message: proxy.$t("register.uploadcertificateFrontImg"), trigger: "blur" }],
            papersConsPictureUrl: [{ required: true, message: proxy.$t("register.uploadCertificateAgainstImg"), trigger: "blur" }],
            expiredIsForever: [{ required: true, message: proxy.$t("register.certificateType"), trigger: "change" }]
        });

        const rules_5 = reactive({
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
            // let papersExpired = dayjs(ruleForm_2.papersExpired).format('YYYY-MM-DD HH:mm:ss');
            let password = encrypt(ruleForm.password);
            let repeatPassword = encrypt(ruleForm.repeatPassword);
            ruleFormRef.value.validate((valid) => {
                if (valid) {
                    flag.value = true;
                } else {
                    flag.value = false;
                }
            });

            ruleFormRef_2.value.validate((valid) => {
                if (valid) {
                    flag.value = true;
                } else {
                    flag.value = false;
                }
            });

            const data = {
                account: ruleForm.account,
                brandlds: ruleForm.brandlds, // 品牌id
                email: ruleForm.email, // 邮箱
                invitationCode: ruleForm.invitationCode, // 邀请码
                mainBusinessType: ruleForm.mainBusinessType.join(","), // 主营类目ID
                password: password, // 密码
                phone: temp.phone, // 手机号
                phonePrefix: temp.phonePrefix, // 手机号前缀
                sellerType: ruleForm.sellerType, // 卖家类型
                // storeAddress: ruleForm.storeAddress, // 联系地址
                storeAddressDetail: ruleForm.storeAddressDetail, // 详细地址
                storeDesc: ruleForm.storeDesc, // 店铺简介
                storeLogoUrl: ruleForm.storeLogoUrl, // 店铺logo url
                storeName: ruleForm.storeName, //  店铺名称
                storeType: ruleForm.storeType, // 店铺类型 1: 普通
                tradeForm: ruleForm.tradeForm, // 贸易行驶: 1: 本地贸易 2:跨境贸易
                emailCode: ruleForm.emailCode, // 邮箱验证码
                repeatPassword: repeatPassword, // 密码
                cityCode: ruleForm.storeAddress[2] || "", //	市编码
                countryCode: ruleForm.storeAddress[0] || "", //	国家编码
                districtCode: ruleForm.storeAddress[3] || "", //	区编码
                provinceCode: ruleForm.storeAddress[1] || "", //	省编码

                papersExpiredStart: dayjs(ruleForm_2.papersExpired && ruleForm_2.papersExpired[0]).format("YYYY-MM-DD HH:mm:ss"),
                papersExpiredEnd: dayjs(ruleForm_2.papersExpired && ruleForm_2.papersExpired[1]).format("YYYY-MM-DD HH:mm:ss"),
                papersConsPictureUrl: ruleForm_2.papersConsPictureUrl, // 证件反面图片url
                // papersExpired: papersExpired, // 证件有效期, -1长期
                papersName: ruleForm_2.papersName, // 证件上姓名
                papersNumber: ruleForm_2.papersNumber, // 证件号码
                papersPictureUrl: ruleForm_2.papersPictureUrl, // 证件图片url
                papersType: ruleForm_2.papersType, // 证件类型: 1:大陆身份证, 2.ID证件
                papersProsPictureUrl: ruleForm_2.papersProsPictureUrl, // 证件正面图片url
                expiredIsForever: ruleForm_2.expiredIsForever[0], // 身份证是否长期
                id: userId
            };
            // 大陆身份证
            if (ruleForm_2.papersType == 1) {
                data.papersNumber = ruleForm_2.papersNumber_zhcn;
            }
            if (flag.value) {
                disabled.value = true;
                register(data)
                    .then((res) => {
                        disabled.value = false;
                        proxy.$message.success(proxy.$t("register.subAuditSuccess"));
                        router.push({ path: "/login" });
                    })
                    .catch(() => {
                        disabled.value = false;
                    });
            }
        }

        function submitForm_2() {
            let flag = ref(false);
            // let papersExpired = dayjs(ruleForm_4.papersExpired).format('YYYY-MM-DD HH:mm:ss');
            // let businessExpired = dayjs(ruleForm_5.businessExpired).format('YYYY-MM-DD HH:mm:ss');
            let password = encrypt(ruleForm_3.password);
            let repeatPassword = encrypt(ruleForm_3.repeatPassword);
            ruleFormRef_3.value.validate((valid) => {
                if (valid) {
                    flag.value = true;
                } else {
                    flag.value = false;
                }
            });

            ruleFormRef_4.value.validate((valid) => {
                if (valid) {
                    flag.value = true;
                } else {
                    flag.value = false;
                }
            });

            ruleFormRef_5.value.validate((valid) => {
                if (valid) {
                    flag.value = true;
                } else {
                    flag.value = false;
                }
            });

            const data_2 = {
                account: ruleForm_3.account,
                brandlds: ruleForm_3.brandlds, // 品牌id
                email: ruleForm_3.email, // 邮箱
                invitationCode: ruleForm_3.invitationCode, // 邀请码
                mainBusinessType: ruleForm_3.mainBusinessType.join(","), // 主营类目ID
                password: password, // 密码
                phone: temp.phone, // 手机号
                phonePrefix: temp.phonePrefix, // 手机号前缀
                sellerType: ruleForm_3.sellerType, // 卖家类型
                // storeAddress: ruleForm_3.storeAddress, // 联系地址
                storeAddressDetail: ruleForm_5.companyAddressDetail, // 详细地址
                storeDesc: ruleForm_3.storeDesc, // 店铺简介
                storeLogoUrl: ruleForm_3.storeLogoUrl, // 店铺logo url
                storeName: ruleForm_3.storeName, //  店铺名称
                storeType: ruleForm_3.storeType, // 店铺类型 1: 普通
                tradeForm: ruleForm_3.tradeForm, // 贸易行驶: 1: 本地贸易 2:跨境贸易
                emailCode: ruleForm_3.emailCode, // 邮箱验证码
                repeatPassword: repeatPassword, // 密码

                papersExpiredStart: dayjs(ruleForm_4.papersExpired[0]).format("YYYY-MM-DD HH:mm:ss"),
                papersExpiredEnd: dayjs(ruleForm_4.papersExpired[1]).format("YYYY-MM-DD HH:mm:ss"),
                papersConsPictureUrl: ruleForm_4.papersConsPictureUrl, // 证件反面图片url
                // papersExpired: papersExpired, // 证件有效期, -1长期
                papersName: ruleForm_4.papersName, // 证件上姓名
                papersNumber: ruleForm_4.papersNumber, // 证件号码
                papersPictureUrl: ruleForm_4.papersPictureUrl, // 证件图片url
                papersType: ruleForm_4.papersType, // 证件类型: 1:大陆身份证, 2.ID证件
                papersProsPictureUrl: ruleForm_4.papersProsPictureUrl, // 证件正面图片url
                expiredIsForever: ruleForm_4.expiredIsForever[0], // 是否长期
                businessExpiredStart: dayjs(ruleForm_5.businessExpired && ruleForm_5.businessExpired[0]).format("YYYY-MM-DD HH:mm:ss"),
                businessExpiredEnd: dayjs(ruleForm_5.businessExpired && ruleForm_5.businessExpired[1]).format("YYYY-MM-DD HH:mm:ss"),
                // businessExpired: businessExpired, //营业期限
                businessLicense: ruleForm_5.businessLicense, // 营业执照
                businessLicensePictureUrl: ruleForm_5.businessLicensePictureUrl, // 营业执照图片id
                // companyAddress: ruleForm_5.companyAddress, // 公司经营地址
                cityCode: ruleForm_5.companyAddress[2] || "", //	市编码
                countryCode: ruleForm_5.companyAddress[0] || "", //	国家编码
                districtCode: ruleForm_5.companyAddress[3] || "", //	区编码
                provinceCode: ruleForm_5.companyAddress[1] || "", //	省编码

                companyAddressDetail: ruleForm_5.companyAddressDetail, // 详情地址
                name: ruleForm_5.name, // 企业名称
                companyExpiredIsForever: ruleForm_5.companyExpiredIsForever[0],
                id: userId
            };

            if (ruleForm_5.companyExpiredIsForever == 1) {
                data_2.businessExpired = ["2000-01-01 00:00:00: ", "2099-01-01 00:00:00"];
                delete data_2.businessExpired;
            }
            // 大陆身份证
            if (ruleForm_4.papersType == 1) {
                data_2.papersNumber = ruleForm_4.papersNumber_zhcn;
            }
            const loading = proxy.$loading();
            if (flag.value) {
                disabled.value = true;
                register(data_2)
                    .then((res) => {
                        loading.close();
                        disabled.value = false;
                        proxy.$message.success(proxy.$t("register.subAuditSuccess"));
                        router.push({ path: "/login" });
                    })
                    .catch(() => {
                        loading.close();
                        disabled.value = false;
                    });
            }
        }

        function resetForm(formName) {
            this.$refs[formName].resetFields();
        }

        let timer = null;
        let count = reactive({ count: 60 });
        const isCountdown = ref(false);

        // 获得邮箱验证码
        const getEmailMessage = () => {
            if (isCountdown.value) {
                return;
            }

            let reg = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;
            if (!reg.test(ruleForm.email)) {
                proxy.$message.error(proxy.$t("register.emailFormatNo"));
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
                    (count.count = 60), (isCountdown.value = false);
                }
            }, 1000);

            let data = { email: ruleForm.email, userType: "seller", type: "1" };
            // 发送请求
            getEmailCode(data).then((res) => {
                ruleForm.emailCode = res.data;
                console.log(res);
            });
        };

        const getEmailMessage_2 = () => {
            if (isCountdown.value) {
                return;
            }

            let reg = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;
            if (!reg.test(ruleForm_3.email)) {
                proxy.$message.error(proxy.$t("register.emailFormatNo"));
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
                    (count.count = 60), (isCountdown.value = false);
                }
            }, 1000);

            let data = { email: ruleForm_3.email, userType: "seller", type: "1" };
            // 发送请求
            // 缺上传图片接口,获得邮箱验证码接口
            getEmailCode(data).then((res) => {
                ruleForm_3.emailCode;
                console.log(res);
            });
        };

        const state = reactive({
            title: proxy.$t("register.protocolPolicy"), // "注册协议和隐私政策",
            content: "欢迎注册成为…",
            centerDialogVisible: true,
            tabs: false
        });

        const handleClick = (activeName, oldActiveName, params) => {
            console.log(params, activeName, oldActiveName);
            if (activeName !== tab.value) {
                state.tabs = !state.tabs;
                return false;
            }

            if (params) {
                return true;
            }
        };

        const submitConfirm = () => {
            state.centerDialogVisible = !state.centerDialogVisible;
            // context.emit('sub', state)
        };

        const cancelClose = () => {
            state.centerDialogVisible = !state.centerDialogVisible;
            // context.emit('sub', state)
        };

        const confirm = () => {
            state.tabs = !state.tabs;
            handleClick(true);
        };

        const cancel = () => {
            state.tabs = !state.tabs;
        };

        const tabclick = (params) => {
            console.log(params);
        };

        const goLogin = () => {
            router.push(`/login`);
        };

        const filterData = (val) => {
            val.forEach((item) => {
                if (item.aresChilds && item.aresChilds.length > 0) {
                    return filterData(item.aresChilds);
                } else {
                    delete item.aresChilds;
                }
            });
        };

        // 地址树
        // let addressListOptions = ref([]);
        // const getAddress = () => {
        //     basicsAreaFindAreasTree({ isCurrentSite: 1 }).then((res) => {
        //         filterData(res.data);
        //         addressListOptions.value = res.data; // 请求地区信息数据
        //     });
        // };
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

        //切换贸易形式
        const onChangeTradeForm = () => {
            ruleForm.storeAddress = ruleForm_5.companyAddress = [];
        };

        let agreement = ref({});
        const getagreement = () => {
            // 类型 type 1:隐私政策 2:服务协议 3:版权信息 4:入住协议 5:提现协议
            basicsOperateSinglePageFindByQuery({ platform: 3, type: "4" }).then((res) => {
                if (res.data) {
                    agreement.value = res.data;
                }
            });
        };
        getagreement();

        return {
            step,
            tab,
            handleClick,
            resetForm,
            submitForm,
            ruleForm,
            getEmailMessage,
            isCountdown,
            count,
            state,
            submitConfirm,
            cancelClose,
            ruleForm_2,
            ruleForm_3,
            ruleForm_4,
            ruleForm_5,
            ruleFormRef,
            ruleFormRef_2,
            ruleFormRef_3,
            ruleFormRef_4,
            ruleFormRef_5,
            rules,
            rules_2,
            rules_3,
            rules_4,
            rules_5,
            submitForm_2,
            category,
            temp,
            getEmailMessage_2,
            tabclick,
            confirm,
            cancel,
            goLogin,
            addressListOptions,
            addressList,
            onChangeTradeForm,
            shortcuts,
            disabledDate,
            disabled,
            agreement,
            isNewSite,
            cascaderProvinceCity
        };
    }
};
</script>
<style>
html,
body {
    overflow-y: auto;
}
</style>
<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 60px 0;

    .step {
        width: 1500px;
        margin-bottom: 80px;
    }

    .pane-info {
        // border: 1px solid #ebebeb;
        // border-top: none;
        border-radius: 1px;
        height: 100;
        margin-bottom: 20px;
        // padding-left: 93px;
        padding-top: 30px;

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
            width: 627px;
        }

        img {
            width: 142px;
            height: 80px;
        }
    }
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

.btn {
    width: 300px;
}
</style>
