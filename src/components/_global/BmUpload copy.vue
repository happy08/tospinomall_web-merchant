<template>
    <el-upload
        v-bind="$attrs"
        :class="size"
        action="#"
        list-type="picture-card"
        :show-file-list="showFileList"
        :accept="accept"
        :before-upload="beforeUpload"
        :http-request="uploadHttp"
        :file-list="fileList"
        :limit="limit"
        :on-exceed="onExceed"
        :disabled="disabled"
    >
        <template #default>
            <!-- 单个文件 -->
            <video v-if="fileType === 'video' && !showFileList && fileUrl" :src="fileUrl" width="148" height="148" controls></video>
            <BmImage v-else-if="fileType === 'image' && !showFileList && fileUrl" :src="fileUrl" @click.stop="handlePreview(fileUrl)" fill="contain" style="width:100%;height:100%" />
            <i v-else class="el-icon-plus"></i>

            <div v-if="!showFileList && fileUrl && (fileType === 'video' || fileType === 'image')" class="el-upload-list--picture-card">
                <span class="el-upload-list__item-actions">
                    <span v-if="isPreview && fileType === 'image'" class="el-upload-list__item-preview" @click.stop="handlePreview(fileUrl)">
                        <i class="el-icon-zoom-in"></i>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click.stop="fileRemove(fileUrl)">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
        </template>
        <template #file="{file}">
            <!-- 多个文件 -->
            <BmImage v-if="fileType === 'image'" class="el-upload-list__item-thumbnail" :src="file.url" fill="contain" style="width:100%;height:100%" />
            <video v-else-if="fileType === 'video'" :src="file.url" width="148" height="148" controls></video>

            <!-- 预览/删除 -->
            <span class="el-upload-list__item-actions">
                <span v-if="fileType === 'image' && file.url" class="el-upload-list__item-preview" @click.stop="handlePreview(file.url)">
                    <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete" @click.stop="fileRemove(file)">
                    <i class="el-icon-delete"></i>
                </span>
            </span>

            <!-- 设为主图 -->
            <div v-if="showMainPicture || mainPicture">
                <div v-if="file.url !== mainPicture" @click.stop="handleMainPicture(file)" class="main-picture">{{ $t("setMainPicture") }}</div>
            </div>
        </template>
    </el-upload>

    <!-- 预览图片 -->
    <teleport to="body">
        <BmImage ref="previewImageRef" :src="previewImageUrl" :preview-src-list="showFileList ? fileList.map((item) => item.url) : [fileUrl]" :z-index="3000" style="width:0px;height:0px" />
    </teleport>
</template>

<script>
import { getCurrentInstance, ref, watch } from "vue";
import { upLoad } from "@/api/goods";

export default {
    name: "BmUploadOld",
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: "lg" //lg,xs,xl
        },
        //单文件url
        fileUrl: {
            type: String,
            default: ""
        },
        fileType: {
            type: String,
            default: "image" //image,video
        },
        accept: {
            type: String,
            default: "image/png,image/jpg,image/jpeg"
        },
        //多个文件
        showFileList: {
            type: Boolean,
            default: true
        },
        //多个文件list
        fileList: {
            type: Array,
            default: []
        },
        //是否预览
        isPreview: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number,
            default: 10
        },
        //限制大小 单位M
        limitSize: {
            type: [Number, String],
            default: ""
        },
        //是否显示设置主图
        showMainPicture: {
            type: Boolean,
            default: false
        },
        //主图
        mainPicture: {
            type: String,
            default: ""
        }
    },
    emits: ["change"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        let fileUrl = ref(props.fileUrl);
        let fileList = ref(props.fileList);

        watch(
            () => props.fileUrl,
            (nVal) => {
                fileUrl.value = nVal;
            }
        );

        watch(
            () => props.fileList,
            (nFile) => {
                fileList.value = nFile;
            }
        );

        // 上传
        const uploadHttp = (options) => {
            let formDate = new FormData();
            formDate.append("object", options.file);
            upLoad(formDate)
                .then((res) => {
                    //单个文件
                    if (!props.showFileList) {
                        fileUrl.value = res.data;
                        emit("change", fileUrl.value);
                    } else {
                        //多个文件
                        fileList.value.push({ url: res.data });
                        emit("change", fileList.value);
                    }
                })
                .catch((err) => {
                    proxy.$message.error(proxy.$t("uploadFail")); //上传失败
                    fileList.value.push({ url: "" });
                    setTimeout(() => {
                        fileList.value.pop();
                        emit("change", fileList.value);
                    }, 1000);
                });
        };

        const beforeUpload = (file) => {
            //文件格式
            let accept = proxy.accept.split(",");
            if (accept.indexOf(file.type) === -1) {
                const acceptType = accept.map((item) => item.split("/")[1]);
                proxy.$message.error(proxy.$t("updateType", { type: acceptType.join(",") }));
                return false;
            }
            //文件大小
            if (proxy.limitSize <= 0) return true;
            const isLtM = file.size / 1024 / 1024 < proxy.limitSize;
            if (!isLtM) {
                proxy.$message.error(proxy.$t("updateSize", { size: proxy.limitSize })); //文件大小不能超过 2MB!
                return false;
            }
            return true;
        };

        //删除
        const fileRemove = (file) => {
            // 单个文件
            if (props.showFileList === false) {
                emit("change", "");
                return;
            }
            const index = fileList.value.findIndex((item) => item.url === file.url);
            fileList.value.splice(index, 1);
            emit("change", fileList.value);
        };

        const onExceed = (file, fileList) => {
            proxy.$message.error(proxy.$t("limitUpload", { limit: props.limit })); //最多只能上传{limit}个文件
        };

        //图片预览
        let previewImageUrl = ref("");
        let previewImageRef = ref(null);
        const handlePreview = (url) => {
            previewImageUrl.value = url;
            previewImageRef.value.clickHandler();
        };

        //设为主图
        const handleMainPicture = (file) => {
            emit("change", { mainPicture: file.url });
        };

        return {
            fileUrl,
            fileList,
            uploadHttp,
            beforeUpload,
            fileRemove,
            onExceed,
            previewImageUrl,
            previewImageRef,
            handlePreview,
            handleMainPicture
        };
    }
};
</script>
<style lang="scss" scoped>
.xs {
    ::v-deep(.el-upload) {
        width: 31px;
        height: 31px;
        line-height: 29px;
        border: solid 1px #dcdfe6;
        border-radius: 3px;
        .el-icon-plus {
            font-size: 12px;
        }
    }
}
.xl {
    ::v-deep(.el-upload) {
        width: 59px;
        height: 59px;
        line-height: 59px;
        border: solid 1px #dcdfe6;
        border-radius: 3px;
        .el-icon-plus {
            font-size: 12px;
        }
    }
}
::v-deep(.el-upload-list__item) {
    transition: all 0s;
}
::v-deep(.el-upload--picture-card) {
    position: relative;
}
.el-upload-list--picture-card {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    i {
        font-size: 20px;
        color: #ffffff;
    }
}
.main-picture {
    position: absolute;
    width: 100%;
    height: 22px;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
}
</style>
