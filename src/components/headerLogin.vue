<template>
    <el-header class="header flex between">
        <router-link to="/" class="flex vcenter">
            <img :src="require('@/assets/img/logo.png')" style="height:30px" />
            <span class="ml-15 mr-40 fs-14">Seller Center</span>
        </router-link>

        <div class="flex vcenter">
            <el-popover placement="bottom" :width="344" trigger="hover">
                <template #reference>
                    <i class="el-icon-menu" style="font-size: 16px;"></i>
                </template>
                <div class="flex between p-20">
                    <div @click="handleLink(3)" class="tc cp">
                        <div><img :src="require('@/assets/img/help.png')" style="width:60px" /></div>
                        <div>{{ $t("Tools.helpCenter") }}</div>
                    </div>
                    <div @click="handleLink(2)" class="tc cp">
                        <div><img :src="require('@/assets/img/rules.png')" style="width:60px" /></div>
                        <div>{{ $t("Tools.ruleCenter") }}</div>
                    </div>
                    <div @click="handleLink(1)" class="tc cp">
                        <div><img :src="require('@/assets/img/videocourse.png')" style="width:60px" /></div>
                        <div>{{ $t("Tools.videoCourse") }}</div>
                    </div>
                </div>
            </el-popover>

            <ul class="flex vcenter">
                <li class="ml-25">
                    <el-select v-model="site" @change="handleChangeSite" style="width:180px">
                        <el-option v-for="item in websiteList" :key="item.key" :value="item.key" :label="item.name"> </el-option>
                    </el-select>
                </li>
                <!-- 语言 $i18n.availableLocales $i18n.locale-->
                <li class="ml-20">
                    <el-select v-model="$i18n.locale" :placeholder="$t('pleaseSelect')">
                        <el-option v-for="item in $store.state.app.langList" :key="`locale-${item}`" :value="item.value" :label="item.label"> </el-option>
                    </el-select>
                </li>
            </ul>
        </div>
    </el-header>
</template>

<script>
import { computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

export default {
    name: "headerLogin",
    setup() {
        const { locale } = useI18n();
        const store = useStore();

        //监听语言
        watch(locale, (val) => {
            store.commit("app/CHANGE_LANG", val);
        });

        // 站点
        const site = computed(() => store.state.app.site);
        const websiteList = computed(() => store.state.app.website);
        const handleChangeSite = (key) => {
            websiteList.value.forEach((element) => {
                if (element.key === key) {
                    element.websiteDetails.forEach((item) => {
                        //1:运营后台;2:卖家后台;3:PC商城;4:H5商城
                        if (item.type == 2) {
                            window.open(item.websiteAddress, item.openMode || "_blank");
                        }
                    });
                }
            });
        };

        onMounted(() => {
            //设置icon小图标
            if (store.state.app.platform.salerIcon) {
                let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
                link.type = "image/x-icon";
                link.rel = "shortcut icon";
                link.href = store.state.app.platform.salerIcon;
                document.getElementsByTagName("head")[0].appendChild(link);
            }
        });

        const handleLink = (type) => {
            window.open(window.location.origin + window.location.pathname + "#/message/message?type=" + type);
        };

        return {
            site,
            websiteList,
            handleChangeSite,
            handleLink
        };
    }
};
</script>

<style lang="scss" scoped>
.header {
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
