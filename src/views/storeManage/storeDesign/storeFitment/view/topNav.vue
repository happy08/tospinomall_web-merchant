<template>
    <div class="bg-green white">
        <!-- PC -->
        <div v-if="!isMobile" class="w-1200">
            <div class="p-10">
                <span class="plr-15">{{ $t("storeDesign.home") }}</span>
                <span class="plr-15">{{ $t("storeDesign.allGoods") }}</span>
            </div>
        </div>

        <!-- 手机tabbar -->
        <div v-if="isMobile" class="tabbar-fixed flex between border-top">
            <span class="flex center flex1 red column"><i class="el-icon-s-home fs-14"></i> {{ $t("storeDesign.home") }}</span>
            <span class="flex center flex1 black column"><i class="el-icon-s-goods fs-14"></i>{{ $t("storeDesign.goods") }}</span>
        </div>
    </div>
</template>

<script>
import { inject, ref } from "vue";
export default {
    name: "storeDesignTopNav",
    props: ["datas"],
    setup(props) {
        const isMobile = inject("isMobile");
        return { isMobile };
    }
};
</script>

<style lang="scss" scoped>
.bg-green {
    background-color: #3eb5ae;
}
.w-1200 {
    max-width: 1200px;
    margin: 0 auto;
}
.tabbar-fixed {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: #fff;
    z-index: 99;
}
</style>
