<template>
    <!-- 留言反馈 -->
    <div class="mb-25 bg-white round-4 wrap-content">
        <div class="content">
            <BmBaseTitle :title="$t('feedBack.feedbackProduct')"> </BmBaseTitle>
            <el-form :model="feedbackForm" ref="feedbackFormRef" label-position="left" :rules="feedbackRuels" label-width="80px" class=" mb-30">
                <!-- 标题 -->
                <el-form-item :label="$t('feedBack.title')" prop="feedbackCategoryName">
                    <el-input v-model="feedbackForm.feedbackCategoryName" maxlength="30" show-word-limit :placeholder="$t('feedBack.pleaseDescribeSentence')"></el-input>
                </el-form-item>
                <!-- 描述 -->
                <el-form-item :label="$t('feedBack.describe')" prop="content">
                    <el-input type="textarea" :rows="5" v-model="feedbackForm.content" maxlength="500" show-word-limit :placeholder="$t('feedBack.DescribeCommentsProblems')"></el-input>
                    <div class="font">
                        {{ $t("feedBack.giveTypicalExample") }}
                    </div>
                </el-form-item>

                <el-form-item :label="$t('feedBack.phone')" prop="phone">
                    <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="feedbackForm.phone" :placeholder="$t('feedBack.EnterPhone')" minlength="20" min="6"></el-input>
                    <div class="font">{{ $t("feedBack.leavePhone") }}</div>
                </el-form-item>
                <!-- 邮箱账户 -->
                <el-form-item :label="$t('feedBack.emailAccount')" prop="mailbox">
                    <el-input v-model="feedbackForm.mailbox" :placeholder="$t('feedBack.leaveEmail')" maxlength="255"></el-input>
                    <div class="font">{{ $t("feedBack.leaveEmailTip") }}</div>
                </el-form-item>

                <el-form-item label="" prop="">
                    <BmUpload @change="onChangeUploadHolderIdentity($event)" :multiple="true" :fileList="feedbackForm.imgUrls" :limit="5" />
                    <div>{{ $t("feedBack.imgUpload5") }}</div>
                </el-form-item>
            </el-form>
            <div style="margin: 0 auto;width: 200px;">
                <el-button style="width: 150px;" type="primary" @click="submit">{{ $t("feedBack.sub") }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { basicsOperateFeedbackMsgSellerSave } from "@/api/user";
export default {
    name: "feedback",
    setup(props) {
        const { proxy } = getCurrentInstance();
        let feedbackFormRef = ref(null);
        let feedbackForm = reactive({
            content: "", //	反馈内容
            createTime: "", //	创建时间
            createUser: "", //	创建人
            feedbackCategoryId: "", //	反馈分类id
            feedbackCategoryName: "", //	反馈分类名
            id: "", //	主键
            imgUrls: [], //	反馈图片 多张用逗号分割
            mailbox: "", //邮箱
            pageHref: "", //	页面链接
            phone: "", //	手机号
            source: "", //	来源 1:Android，2:IOS，3:H5，4:PC
            status: "", //	状态：0：未读 1：已读
            type: "", //	类型 1会员反馈消息 2卖家反馈消息
            updateTime: "", //	更新时间
            updateUser: "", //	更新人
            userId: "", //	用户id
            userInfo: "" //	用户信息
        });

        const onChangeUploadHolderIdentity = (fileList) => {
            feedbackForm.imgUrls = fileList; // fileList.map((item) => item.url)
            console.log("formPane3.detailsPics", feedbackForm.imgUrls);
        };

        const feedbackRuels = ref({
            feedbackCategoryName: [{ required: true, message: proxy.$t("feedBack.enterTitle"), trigger: "blur" }],
            content: [{ required: true, message: proxy.$t("feedBack.enterDescribeCenter"), trigger: "blur" }],
            phone: [
                { required: true, message: proxy.$t("feedBack.EnterPhone"), trigger: "blur" },
                { min: 6, max: 20, message: proxy.$t("feedBack.stringLength"), trigger: "blur" }
            ],
            mailbox: [{ required: true, message: proxy.$t("feedBack.enterEmail"), trigger: "blur" }]
        });

        const submit = () => {
            let form = {
                phone: feedbackForm.phone,
                content: feedbackForm.content,
                mailbox: feedbackForm.mailbox,
                feedbackCategoryName: feedbackForm.mailbox,
                imgUrls: ""
            };
            form.imgUrls = feedbackForm.imgUrls.map((v) => v.url).join(",");

            feedbackFormRef.value.validate((valid) => {
                if (valid) {
                    basicsOperateFeedbackMsgSellerSave(form)
                        .then((res) => {
                            proxy.$message.success(res.msg);
                            window.close();
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        return {
            onChangeUploadHolderIdentity,
            feedbackFormRef,
            feedbackForm,
            submit,
            feedbackRuels
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
<style lang="scss" scope>
.wrap-content {
    height: calc(100vh - 64px);
    padding-top: 50px;
    padding-bottom: 100px;

    .content {
        margin: 0 auto;
        width: 800px;
        // background-color: pink;
    }
    .font {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 17px;
    }
}
</style>
