<template>
    <div class="mb-15">{{ $t("storeDesign.recommendedSize") }}: {{ isMobile ? "750px * 228px" : "1920px * 110px" }}</div>
    <div class="manager-imgs">
        <BmUpload @change="onChangeUpload($event, config)" :fileUrl="config.imageUrl" :showFileList="false" />
    </div>
</template>

<script>
import { inject } from "vue";

export default {
    name: "StoreDesignEditTopBackgroundImage",
    components: {},
    props: {
        config: {
            type: Object,
            default: () => {}
        }
    },
    setup() {
        const isMobile = inject("isMobile");

        //上传图片
        const onChangeUpload = (file, element) => {
            element.imageUrl = file;
        };

        return {
            isMobile,
            onChangeUpload
        };
    }
};
</script>

<style lang="scss" scoped>
.manager-imgs {
    position: relative;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: #f2f2f2;
}
::v-deep(.el-upload--picture-card) {
    width: 100%;
    height: auto;
    min-height: 120px;
    line-height: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
