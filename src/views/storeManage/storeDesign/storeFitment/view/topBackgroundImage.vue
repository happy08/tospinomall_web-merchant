<!-- 顶部背景图 -->
<template>
    <!-- 手机 -->
    <div v-if="isMobile" :style="'background-image:url(' + datas.imageUrl + ');background-color:#42b7ae'" class="background">
        <div class="w-1200 pt-10">
            <div class="mlr-15 mb-10 round-30" style="overflow: hidden;">
                <el-input v-model="keyword" placeholder="Search" prefix-icon="el-icon-search" />
            </div>
            <div v-if="userInfo" class="flex between vcenter plr-15">
                <div class="flex vcenter ">
                    <BmImage :src="$store.state.user.storeInfo.storeLogoUrl || require('@/assets/img/store-default.png')" fit="cover" style="width:50px;height:50px" class="mr-15" />
                    <div class="white">
                        <div class="fs-14">{{ $store.state.user.storeInfo.storeName }}</div>
                        <div class="fs-12">-{{ $t("storeDesign.peopleAttention") }}</div>
                    </div>
                </div>
                <div>
                    <el-button type="danger" size="mini">{{ $t("storeDesign.attention") }}</el-button>
                </div>
            </div>
        </div>
    </div>

    <!-- pc -->
    <div v-else :style="'background-image:url(' + datas.imageUrl + ')'" class="background">
        <div class="w-1200">
            <div v-if="userInfo" class="flex vcenter pt-30 plr-20">
                <BmImage :src="$store.state.user.storeInfo.storeLogoUrl || require('@/assets/img/store-default.png')" fit="cover" style="width:50px;height:50px" class="mr-15" />
                <span class="fs-14">{{ $store.state.user.storeInfo.storeName }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { inject } from "vue";
import { computed } from "vue";
import storage from "@/utils/storage";
export default {
    name: "topBackgroundImage",
    props: {
        datas: Object
    },
    setup(props) {
        const isMobile = inject("isMobile");
        const userInfo = computed(() => storage.get("userInfo"));
        //const userInfo = computed(() => storage.get("userInfo"));

        let keyword = "";

        return {
            isMobile,
            userInfo,
            keyword
        };
    }
};
</script>

<style lang="scss" scoped>
.w-1200 {
    max-width: 1200px;
    margin: 0 auto;
}
.background {
    height: 110px;
    width: 100%;
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
