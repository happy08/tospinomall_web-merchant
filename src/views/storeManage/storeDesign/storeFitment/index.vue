<template>
    <div class="store-design-layout">
        <div class="store-design-layout-top flex between vcenter plr-20">
            <div class="flex center">
                <BmImage style="width: 35px; height: 35px" :src="require('@/assets/img/logo.png')" class="mr-15" />
                <span class="fw">{{ pageName }}</span>
            </div>
            <div>
                <el-button @click="handlePreview" type="success" plain class="ml-20">
                    {{ $t("storeDesign.preview") }}
                </el-button>
                <el-button @click="handleSave(0)" :disabled="saveDisabled" type="primary" plain class="ml-20">
                    {{ $t("storeDesign.saveDrafts") }}
                </el-button>
                <el-button @click="handleSave(1)" :disabled="saveDisabled" type="primary">
                    {{ $t("storeDesign.savePublish") }}
                </el-button>
            </div>
        </div>

        <!-- 左侧基础组件 -->
        <div class="store-design-layout-left" :class="baseComponentShow ? 'show' : ''">
            <i @click="handleBaseComponentShow" class="el-icon-s-fold"></i>
            <Draggable class="" :list="BaseComponentList" :group="{ name: 'center', pull: 'clone', put: false }" :clone="cloneComponent" item-key="id">
                <template #item="{ element }">
                    <div v-if="(isMobile === true && element.device.includes('mobile')) || (isMobile === false && element.device.includes('pc'))" class="base-componen-item">
                        <BmIcon :name="element.icon" style="width:25px;height:25px" />
                        <div>{{ element.name }}</div>
                    </div>
                </template>
            </Draggable>
        </div>

        <!-- 中间视图组件 -->
        <div
            :class="['store-design-layout-center', { 'config-show': configShow }, { 'base-componen-show': baseComponentShow }, { 'is-preview': isPreview && !isMobile }]"
            :style="'transform: scale(' + scale + ');'"
        >
            <!-- 手机端 -->
            <div v-if="isMobile" class="store-design-layout-view store-design-mobile custom-scrollbar" :class="{ 'is-preview': isPreview }">
                <Draggable :list="viewComponentList.components" group="center" tag="transition-group" @change="changeViewComponent" item-key="id" :delay="0">
                    <template #header>
                        <div key="id">
                            <!-- 顶部背景图 -->
                            <div @click="handelTopBackgroundImage">
                                <TopBackgroundImage :datas="topBackgroundImage" />
                            </div>

                            <!-- 导航 -->
                            <TopNav />
                        </div>
                    </template>
                    <template #item="{ element, index }">
                        <div @click="handelViewComponent(index)" :class="['component-view', { 'is-active': element.isActive }, { 'isnot-preview': !isPreview }]">
                            <div class="component-name">{{ element.name }}</div>
                            <el-tooltip :content="$t('delete')" placement="right" effect="light">
                                <el-button class="delete" @click.stop="handleDeleteComponent(index)" icon="el-icon-delete" circle></el-button>
                            </el-tooltip>

                            <component :is="element.component" :datas="element"></component>
                        </div>
                    </template>
                </Draggable>
            </div>

            <!-- 电脑端 -->
            <div v-if="!isMobile" class="store-design-layout-view store-design-pc">
                <Draggable :distance="1" :list="viewComponentList.components" group="center" tag="transition-group" @change="changeViewComponent" item-key="id">
                    <template #header>
                        <div key="id">
                            <!-- 固定导航 -->
                            <HeaderPC />

                            <!-- 顶部背景图 -->
                            <div @click="handelTopBackgroundImage">
                                <TopBackgroundImage :datas="topBackgroundImage" />
                            </div>

                            <!-- 导航 -->
                            <TopNav />
                        </div>
                    </template>

                    <template #item="{ element, index }">
                        <div @click="handelViewComponent(index)" :class="['component-view', { 'is-active': element.isActive }, { 'isnot-preview': !isPreview }]">
                            <div class="component-name">{{ element.name }}</div>
                            <el-tooltip :content="$t('delete')" placement="right" effect="light">
                                <el-button class="delete" @click.stop="handleDeleteComponent(index)" icon="el-icon-delete" circle></el-button>
                            </el-tooltip>
                            <component :is="element.component" :datas="element"></component>
                        </div>
                    </template>
                </Draggable>
                <!-- footer -->
                <div class="store-design-pcfooter" :style="`background:url( ${require('@/assets/img/footer-pc.jpg')}) center no-repeat;height: ${isPreview ? '426px' : '426px'};`"></div>
            </div>
        </div>

        <!-- 放大缩小 -->
        <div class="store-design-scale">
            <el-tooltip :content="$t('storeDesign.normal')" placement="top" effect="light">
                <el-button @click="scale = 1" icon="el-icon-check" circle></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('storeDesign.zoomIn')" placement="top" effect="light">
                <el-button @click="scale = scale >= 1.4 ? 1.4 : scale + 0.1" icon="el-icon-plus" circle></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('storeDesign.shrink')" placement="top" effect="light">
                <el-button @click="scale = scale <= 0.6 ? 0.6 : scale - 0.1" icon="el-icon-minus" circle></el-button>
            </el-tooltip>
        </div>

        <!-- 右侧配置 -->
        <div :class="['store-design-layout-right', { 'config-show': configShow }]">
            <i @click="handleconfigShow" class=" el-icon-s-unfold "></i>
            <div class="content">
                <EditComponentConfig :config="curConfig"></EditComponentConfig>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, provide, getCurrentInstance, toRaw } from "vue";
import Draggable from "vuedraggable";

import EditComponentConfig from "./edit/index";
import imageHot from "./view/imageHot";
import HeaderPC from "./view/headerPC";
import TopNav from "./view/topNav";
import TopBackgroundImage from "./view/topBackgroundImage";

import { storeStylesUpdateComponentInfo, storeStylesGetById } from "@/api/storeDesign";
import { deepClone } from "@/utils/";
import { useRoute } from "vue-router";

let idGlobal = 1;

export default {
    name: "StoreDesign",
    components: {
        EditComponentConfig,
        Draggable,
        imageHot,
        HeaderPC,
        TopNav,
        TopBackgroundImage
    },
    props: {
        visible: Boolean,
        row: Object
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const route = useRoute();

        const pageName = route.query.name || "";

        let scale = ref(1);
        let curConfig = ref(null); //正在编辑的组件参数配置

        //左侧基础组件
        let BaseComponentList = [
            {
                type: 2,
                device: ["mobile", "pc"], //mobile&PC
                component: "imageHot", // 热区图片
                name: proxy.$t("storeDesign.hotPictures"), //组件名称
                icon: "hot",
                imageUrl: "",
                componentDetails: []
            }
        ];
        let baseComponentShow = ref(true);
        const handleBaseComponentShow = () => {
            baseComponentShow.value = !baseComponentShow.value;
        };

        let viewComponentList = ref({
            components: []
        }); //中间显示组件

        //是否预览
        let isPreview = route.query.type == "preview" ? true : false;
        provide("isPreview", isPreview);

        //是否手机端 pageType 1=PC 2=手机
        let isMobile = route.query.pageType == 1 ? false : true;
        provide("isMobile", isMobile);

        //顶部背景图
        let topBackgroundImage = ref({
            type: 7,
            device: ["pc", "mobile"],
            component: "topBackgroundImage", //PC 顶部背景图
            name: proxy.$t("storeDesign.topBackgroundImage"), //组件名称
            icon: "hot",
            imageUrl: "",
            componentDetails: []
        });

        // 获取详情
        if (route.query.id) {
            const loading = proxy.$loading();
            storeStylesGetById(route.query.id)
                .then((res) => {
                    let components = [];
                    res.data.components.forEach((item) => {
                        componentType.forEach((citem) => {
                            if (citem.type === item.type) {
                                item.component = citem.component;
                                item.name = citem.name;
                            }
                        });
                        if (item.type === 7) {
                            //取出顶部背景图 放最上面
                            topBackgroundImage.value = item;
                        } else {
                            components.push(item);
                        }
                    });

                    viewComponentList.value = {
                        id: res.data.id,
                        components: components
                    };
                    loading.close();
                })
                .catch(() => {
                    loading.close();
                });
        }
        //组件列表
        const componentType = [
            {
                type: 2,
                component: "imageHot",
                name: proxy.$t("storeDesign.hotPictures")
            },
            {
                type: 7,
                component: "topBackgroundImage",
                name: proxy.$t("storeDesign.topBackgroundImage")
            }
        ];

        // 点击顶部背景图
        const handelTopBackgroundImage = () => {
            console.log("topBackgroundImage", topBackgroundImage.value);
            curConfig.value = topBackgroundImage.value;
            configShow.value = true;
        };

        //拖动组件到中间视图
        const cloneComponent = (item) => {
            return {
                id: idGlobal++,
                ...deepClone(item)
            };
        };

        // 点击中间视图组件
        const handelViewComponent = (index) => {
            for (let i = 0, length = viewComponentList.value.components.length; i < length; i++) {
                viewComponentList.value.components[i].isActive = i === index ? true : false;
            }
            curConfig.value = viewComponentList.value.components[index];
            configShow.value = true;
        };

        //中间视图组件变化时
        const changeViewComponent = (element) => {
            const { moved, added } = element;
            const newIndex = (moved && moved.newIndex) || (added && added.newIndex);
            handelViewComponent(newIndex);
        };

        //删除组件
        const handleDeleteComponent = (index) => {
            proxy
                .$confirm(proxy.$t("confirmDelete"), {
                    type: "warning"
                })
                .then(() => {
                    viewComponentList.value.components.splice(index, 1);
                    curConfig.value = {};
                })
                .catch(() => {});
        };

        //保存 status=1草稿 2=发布
        let saveDisabled = ref(false);
        const handleSave = (status, closeWindow = true) => {
            return new Promise((resolve, reject) => {
                let msg = "";
                const viewComponent = deepClone(toRaw(viewComponentList.value));
                viewComponent.status = status;

                viewComponent.components.forEach((item) => {
                    //热区图片 热区换算成%
                    if (item.type === 2) {
                        if (item.imageUrl != "") {
                            let areaData = item.componentDetails;
                            const pageWidth = isMobile ? 375 : 1280;
                            if (item.imgInfo.width < pageWidth) {
                                for (let i = 0, length = areaData.length; i < length; i++) {
                                    areaData[i].positionX = (areaData[i].positionX / item.imgInfo.width) * 100;
                                    areaData[i].positionY = (areaData[i].positionY / item.imgInfo.height) * 100;
                                    areaData[i].areaWidth = (areaData[i].areaWidth / item.imgInfo.width) * 100;
                                    areaData[i].areaHeight = (areaData[i].areaHeight / item.imgInfo.height) * 100;
                                }
                            } else {
                                for (let i = 0, length = areaData.length; i < length; i++) {
                                    areaData[i].positionX = (areaData[i].positionX * 100) / pageWidth;
                                    areaData[i].positionY = (areaData[i].positionY * 100) / (pageWidth / item.imgInfo.percent);
                                    areaData[i].areaWidth = (areaData[i].areaWidth * 100) / pageWidth;
                                    areaData[i].areaHeight = (areaData[i].areaHeight * 100) / (pageWidth / item.imgInfo.percent);
                                }
                            }
                            item.proportion = item.imgInfo.percent;
                        } else {
                            msg = `[ ${item.name} ]` + proxy.$t("storeDesign.uploadImage");
                        }
                    }
                });
                if (msg) {
                    proxy.$message.error(msg);
                    return;
                }

                //return;
                viewComponent.components.unshift(topBackgroundImage.value);

                //return;
                saveDisabled.value = true;
                storeStylesUpdateComponentInfo(viewComponent)
                    .then((res) => {
                        proxy.$message.success(res.msg);
                        resolve();

                        //是否关闭窗口
                        if (closeWindow) {
                            setTimeout(() => {
                                window.close();
                            }, 1500);
                        } else {
                            saveDisabled.value = false;
                        }
                    })
                    .catch(() => {
                        saveDisabled.value = false;
                        reject();
                    });
            });
        };

        let configShow = ref(true);
        const handleconfigShow = () => {
            configShow.value = !configShow.value;
        };

        //预览
        const handlePreview = () => {
            //是否保存为草稿预览最新模板？
            proxy
                .$confirm(proxy.$t("storeDesign.saveDraftsPreview"), {
                    type: "warning"
                })
                .then(() => {
                    //保存草稿 才能预览到最新的
                    handleSave(1, false)
                        .then(() => {
                            window.open(
                                window.location.origin + window.location.pathname + `#/storeManage/storeDesign/storeFitment/preview?type=preview&pageType=${route.query.pageType}&id=${route.query.id}`
                            );
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        };

        return {
            pageName,
            scale,
            isPreview,
            isMobile,
            topBackgroundImage,
            curConfig,
            baseComponentShow,
            handleBaseComponentShow,
            BaseComponentList,
            viewComponentList,
            handelTopBackgroundImage,
            handelViewComponent,
            cloneComponent,
            changeViewComponent,
            handleDeleteComponent,
            saveDisabled,
            handleSave,
            configShow,
            handleconfigShow,
            handlePreview
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
@import "@/assets/css/variables.scss";

.store-design-layout {
    display: block;
    position: relative;
    min-width: 100%;
    min-height: 100%;
    height: 100%;
    .store-design-layout-top {
        position: fixed;
        left: 0px;
        top: 0px;
        right: 0px;
        width: 100%;
        height: 64px;
        background: #ffffff;
        box-shadow: 2px 0px 8px 0px #bcc3ce;
        z-index: 1003;
    }
    .store-design-layout-left {
        position: fixed;
        left: 0;
        top: 64px;
        bottom: 0px;
        width: 130px;
        background: #ffffff;
        padding: 16px;
        box-sizing: border-box;
        z-index: 1002;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;
        transform: translateX(-130px);
        &.show {
            transform: translateX(0px);
        }
        > i {
            position: absolute;
            right: -36px;
            top: 10px;
            padding: 8px;
            border-radius: 0 20px 20px 0;
            z-index: 9;
            font-size: 20px;
            color: #6b7075;
            background-color: #ffffff;
            cursor: pointer;
            box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
        }
    }
    .base-componen-item {
        display: inline-block;
        transition: all 0.25s;
        width: 80px;
        height: 80px;
        margin: 10px;
        padding-top: 15px;
        border-radius: 4px;
        text-align: center;
        border: solid 1px #e8e8e8;
        cursor: move;
        &:hover {
            border-color: #b3e2df;
            background-color: #b3e2df;
        }
        i {
            font-size: 26px;
        }
    }
    .store-design-layout-center {
        position: relative;
        width: 100%;
        min-height: 100%;
        padding: 100px 0px 100px 0px;
        overflow-y: auto;
        transition: padding 0.3s;
        &.config-show {
            padding-right: 400px;
        }
        &.base-componen-show {
            padding-left: 250px;
        }
        &.is-preview {
            padding-top: 0px;
        }
        .store-design-layout-view {
            .base-componen-item {
                width: 100%;
                margin: 10px 0;
                border-color: #b3e2df;
                background-color: #b3e2df;
                border-radius: 0px;
            }
            position: relative;
            margin: 0 auto;
            background: #fff;
            box-shadow: -10px 20px 30px 0px rgba(0, 0, 0, 0.2);
            &.store-design-mobile {
                position: relative;
                padding-bottom: 50px;
                width: 375px;
                min-height: 667px;
                .component-header {
                    height: 100px;
                    background-size: cover;
                }
                &.is-preview {
                    height: 667px;
                    overflow-y: auto;
                    overflow-x: hidden;
                }
            }
            &.store-design-pc {
                position: relative;
                width: 1280px;
                min-height: 780px;
                padding-bottom: 425px;
                .store-design-pcfooter {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }
            }
        }
        .component-view {
            margin: 0 auto;
            position: relative;
            line-height: 1;
            .component-name {
                position: absolute;
                right: 100%;
                top: 0px;
                height: 32px;
                line-height: 32px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 16px;
                padding: 0 16px;
                word-break: keep-all;
                white-space: nowrap;
                font-size: 14px;
                transform: translateX(-8px);
                color: #6b7075;
            }
            .delete {
                transition: opacity 0.25s;
                position: absolute;
                top: 0;
                opacity: 0;
                right: -35px;
            }
            &.isnot-preview {
                &::before {
                    transition: opacity 0.25s;
                    opacity: 0;
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: dashed 2px transparent;
                    z-index: 9;
                }
                &:hover {
                    &::before {
                        opacity: 1;
                        border-color: $baseColor;
                    }
                    .delete {
                        opacity: 1;
                    }
                }
                &.is-active {
                    &::before {
                        opacity: 1;
                        border-style: solid;
                        border-color: $baseColor;
                    }
                }
            }
        }
    }
    .store-design-scale {
        position: fixed;
        bottom: 20px;
        left: 250px;
        width: 120px;
    }
    .store-design-layout-right {
        position: relative;
        background: #fff;
        width: 360px;
        position: fixed;
        right: 0px;
        top: 64px;
        bottom: 0px;
        z-index: 99;
        transition: transform 0.3s;
        transform: translateX(360px);
        box-sizing: border-box;
        &.config-show {
            transform: translateX(-0px);
        }
        > i {
            position: absolute;
            left: -36px;
            top: 10px;
            padding: 8px;
            border-radius: 20px 0 0 20px;
            z-index: 9;
            font-size: 20px;
            color: #6b7075;
            background-color: #ffffff;
            cursor: pointer;
            box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.1);
        }
        .content {
            height: 100%;
            padding: 25px;
            overflow: auto;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
    }
}
</style>
