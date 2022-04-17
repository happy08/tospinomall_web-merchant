<template>
    <div class="p-25 mb-25 bg-white round-4">
        <BmBreadcrumb />
        <div class="p-5 mb-25 flex vcenter" style="border-radius: 2px;border: 1px solid #fbe9c5;background: #fef9ed;">
            <svg class="icon" aria-hidden="true" style="width: 20px;height: 20px;color: red;">
                <use xlink:href="#iconicon-test"></use>
            </svg>
            <span class="ml-5">{{ $t("siteManage.tips") }}</span>
        </div>
        <div class="flex between mb-20" style="border-radius: 3px;">
            <div>{{ $t("siteManage.loginInfo") }}</div>
            <!-- 查看子账号 -->
            <div>
                <el-button type="primary" @click="checkSonAccount">{{ $t("siteManage.checkSonAccount") }}</el-button>
            </div>
        </div>
        <div class="p-15 border mb-15" style="">
            <div class="mb-5">
                {{ $t("siteManage.site") }} : &#8195;<span>{{ siteName }}</span>
            </div>
            <div class="mb-5">{{ $t("siteManage.mainAccount") }}:&#8195;{{ userInfo.account }}</div>
            <!-- <div class="mb-5">登录状态:&#8195;</div> -->
            <div class="mb-5">{{ $t("phone") }}:&#8195; {{ userInfo.phonePrefix }} {{ userInfo.phone }}</div>
            <div class="mb-5">{{ $t("siteManage.accountStatus") }}:&#8195; {{ $t("siteManage.default") }}</div>
            <div>
                {{ $t("siteManage.siteAddress") }}: <span class="green cp">&#8195;{{ siteAddress }}</span>
            </div>
        </div>

        <el-row :gutter="20">
            <el-col :lg="6" :md="12" :sm="12" v-for="(item, i) in siteList" :key="i">
                <div class="border p-15 mb-20">
                    <div class="mb-20"><BmImage style="width: 52px;height: 36px;" :src="item.website.flagIcon" /></div>
                    <div class="mb-5 fw">{{ $t("siteManage.site") }}: &#8195;{{ item.website.name }}</div>
                    <!-- 0取消授权 1待审核 2启用中(已授权) 3冻结中 4审核驳回 -->
                    <div class="mb-5">
                        {{ $t("siteManage.accountStatus") }}:&#8195;
                        {{
                            item.websiteRelationStatus == 0
                                ? $t("siteManage.cancelAuth") // 取消授权"
                                : item.websiteRelationStatus == 1
                                ? $t("siteManage.waitAudit") // "待审核"
                                : item.websiteRelationStatus == 2
                                ? $t("siteManage.active") // "启用中(已授权)"
                                : item.websiteRelationStatus == 3
                                ? $t("siteManage.Freezing") // "冻结中"
                                : item.websiteRelationStatus == 4
                                ? $t("siteManage.ReviewRejected") // "审核驳回"
                                : ""
                        }}
                    </div>

                    <div class="mb-20">
                        <!-- 站点地址 -->
                        {{ $t("siteManage.siteAddress") }}: &#8195;<span class="green cp">{{ item.websiteAddress }}</span>
                    </div>
                    <div class="flex center">
                        <!-- 去开通 -->
                        <el-button type="primary" v-if="item.websiteRelationStatus != 2" @click="goopenSite(item.websiteAddress)">{{ $t("siteManage.goOpen") }}</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- <div class="p-15 mb-25 border mr-20" style="width: 404px;height: 238px;">
                <div class="mb-20" style="width: 52px;height: 36px;"><BmImage src="" /></div>
                <div class="mb-5">站点:</div>
                <div class="mb-5">登录状态:</div>
                <div class="mb-5">账户状态:</div>
                <div class="mb-20">站点地址: <span class="green cp">www.appale.com</span></div>
                <div class="flex center">
                    <el-button type="primary">去开通</el-button>
                </div>
            </div>
            <div class="p-15 border " style="width: 404px;height: 238px;">
                <div><BmImage src="" /></div>
                <div class="mb-20">站点:</div>
                <div class="mb-5">登录状态:</div>
                <div class="mb-5">账户状态:</div>
                <div class="mb-20">站点地址: <span class="green cp">www.appale.com</span></div>
                <div class="flex center">
                    <el-button type="primary">去开通</el-button>
                </div>
            </div>
            <div class="p-15 border mr-20" style="width: 404px;height: 238px;">
                <div class="mb-20"><BmImage src="" /></div>
                <div class="mb-5">站点:</div>
                <div class="mb-5">登录状态:</div>
                <div class="mb-5">账户状态:</div>
                <div class="mb-20">站点地址: <span class="green cp">www.appale.com</span></div>
                <div class="flex center">
                    <el-button type="primary">去开通</el-button>
                </div>
            </div> -->
    </div>
</template>

<script>
import { ref, reactive, unref, getCurrentInstance, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { adminWbsiteSellerManage } from "@/api/user";
import { useStore } from "vuex";
import storage from "@/utils/storage";
export default {
    setup(props) {
        const { proxy } = getCurrentInstance();
        const route = useRoute();
        const router = useRouter();
        const store = useStore();

        let siteAddress = storage.get("siteAddress");
        let siteName = storage.get("siteName");
        // let userInfo = storage.get("userInfo");
        const userInfo = store.state.user.storeInfo.sellerUser;

        let siteList = ref([]);
        const getData = () => {
            adminWbsiteSellerManage().then((res) => {
                res.data.forEach((v) => {
                    v.website.websiteDetails.forEach((item) => {
                        if (item.type == 2) {
                            v.websiteAddress = item.websiteAddress;
                            v.logoAddress = item.logoAddress;
                            v.flagIcon = item.flagIcon;
                        }
                    });
                });
                siteList.value = res.data;
                console.log(siteList.value);
            });
        };
        getData();

        const goopenSite = (url) => {
            let res = url + "#/register/detail" + `?id=${userInfo.id}`;
            window.open(res);
        };

        const checkSonAccount = () => {
            router.push({ path: "/system/user" });
        };

        return {
            siteList,
            siteAddress,
            siteName,
            userInfo,
            goopenSite,
            checkSonAccount
        };
    }
};
</script>

<style lang="scss" scoped>
// .div {
//     .item:nth-child(3n) {
//         margin-left: 0px !important;
//     }
// }
</style>
