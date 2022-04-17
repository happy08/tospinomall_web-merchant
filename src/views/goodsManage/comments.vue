<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <el-form :model="searchForm" labelPosition="left" ref="searchFormRef" class="table-search-form">
            <!-- <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <el-form-item prop="_tpmTime" style="width: 500px;">
                        <el-dropdown @command="handleCommandTimeType">
                            <span class="green">
                                {{ timeTypeName }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="item in timeType" :key="item.value" :command="item">{{ item.name }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-date-picker
                            v-model="searchForm._tpmTime"
                            @change="changeDate"
                            type="daterange"
                            :start-placeholder="$t('startDate')"
                            range-separator="-"
                            :end-placeholder="$t('endDate')"
                            :shortcuts="shortcuts"
                            :disabled-date="disabledDate"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row> -->

            <div class="flex vcenter">
                <div>
                    <el-form-item prop="tmpTime">
                        <div class="flex lh-12">
                            <div style="min-width: 150px;">
                                <span>{{ $t("comments.commentsTime") }}:</span>
                            </div>
                            <div class="flex vcenter">
                                <el-checkbox-group v-model="searchForm.tmpTime" @change="timeChange" :max="Number(1)">
                                    <!--近30天 60 180  -->
                                    <el-checkbox label="30">{{ $t("comments.NearlyDays30") }}</el-checkbox>
                                    <el-checkbox label="60">{{ $t("comments.NearlyDays60") }}</el-checkbox>
                                    <el-checkbox label="180">{{ $t("comments.NearlyDays180") }}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item prop="_tpmTime" style="width: 500px;">
                        <div class="flex ml-30 pl-30">
                            <div>
                                <el-dropdown @command="handleCommandTimeType">
                                    <span class="flex green">
                                        {{ timeTypeName }}
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item v-for="item in timeType" :key="item.value" :command="item">{{ item.name }}</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                                <!-- <el-select v-model="searchForm.timeType">
                                    <el-option v-for="item in timeType" :key="item.value" :label="item.name" :value="item.value"> </el-option>
                                </el-select> -->
                            </div>
                            <div class="ml-15">
                                <el-date-picker
                                    v-model="searchForm._tpmTime"
                                    @change="changeDate"
                                    type="daterange"
                                    :start-placeholder="$t('startDate')"
                                    range-separator="-"
                                    :end-placeholder="$t('endDate')"
                                    :shortcuts="shortcuts"
                                    :disabled-date="disabledDate"
                                >
                                </el-date-picker>
                            </div>
                        </div>
                    </el-form-item>
                </div>
            </div>
            <el-form-item prop="goodsScoresList">
                <div class="flex lh-12">
                    <div style="min-width: 150px;">{{ $t("comments.UserRatingsMore") }}:</div>
                    <div>
                        <el-checkbox-group v-model="searchForm.goodsScoresList">
                            <!-- 12345星 -->
                            <el-checkbox label="1">{{ $t("comments.onestar") }}</el-checkbox>
                            <el-checkbox label="2">{{ $t("comments.twostar") }}</el-checkbox>
                            <el-checkbox label="3">{{ $t("comments.threestar") }}</el-checkbox>
                            <el-checkbox label="4">{{ $t("comments.fourstar") }}</el-checkbox>
                            <el-checkbox label="5">{{ $t("comments.fivestar") }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-form-item>
            <el-form-item prop="hasTypeList">
                <div class="flex lh-12">
                    <div style="min-width: 150px;">{{ $t("comments.Filter") }}:</div>
                    <div>
                        <el-checkbox-group v-model="searchForm.hasTypeList">
                            <!--1有图片  2有视频  3未回复 4已回复 5有追评 6已举报 7主评有文字-->
                            <el-checkbox label="1" name="type">{{ $t("comments.HavePicture") }}</el-checkbox>
                            <el-checkbox label="2" name="type">{{ $t("comments.HaveVideo") }}</el-checkbox>
                            <el-checkbox label="3" name="type">{{ $t("comments.noResponse") }}</el-checkbox>
                            <el-checkbox label="4" name="type">{{ $t("comments.replied") }}</el-checkbox>
                            <el-checkbox label="5" name="type">{{ $t("comments.EvaluationChase") }}</el-checkbox>
                            <el-checkbox label="6" name="type">{{ $t("comments.HasBeenReported") }}</el-checkbox>
                            <el-checkbox label="7" name="type">{{ $t("comments.mainReviewHasText") }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-form-item>

            <el-row :gutter="24">
                <!--订单信息 商品信息 关键词-->
                <el-col :md="12" :lg="6">
                    <el-form-item prop="orderKeyword">
                        <div>{{ $t("comments.orderInfo") }}</div>
                        <div><el-input v-model="searchForm.orderKeyword" placeholder="Order No / trackingNumber No." /></div>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <el-form-item prop="goodKeyword">
                        <div>{{ $t("comments.goodsInfo") }}</div>
                        <div><el-input v-model="searchForm.goodKeyword" placeholder="Title/TSIN/FNSKU/Batch No./EAN/NPU" /></div>
                    </el-form-item>
                </el-col>
                <el-col :md="12" :lg="6">
                    <el-form-item prop="userKeyword">
                        <div>{{ $t("comments.keyword") }}</div>
                        <div><el-input v-model="searchForm.userKeyword" :placeholder="$t('pleaseEnter')" /></div>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- SKU商品信息 -->
                    <el-form-item :label="`SKU${$t('goodsListTable.goodsInfo')}`" prop="skeyword">
                        <template #label>
                            <el-select v-model="searchForm.sIndex" :placeholder="$t('pleaseSelect')">
                                <el-option v-for="(item, index) in goodsMultiList" :key="index" :label="item.name" :value="item.value"> </el-option>
                            </el-select>
                        </template>
                        <el-input v-model="searchForm.skeyword" oninput="value=value.replace(/^\s+|\s+$/g,'')" :placeholder="$t('pleaseSelect')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row id="elCollapse" class="h-0 hidden" :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 商品标题 -->
                    <el-form-item :label="$t('goodsList.keyword')" prop="titleKeyword">
                        <el-input v-model="searchForm.titleKeyword" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                <!-- 展开  -->
                <BmCollapse el="#elCollapse" :isShow="false" />
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <BmTable ref="multipleTable" :data="tableData" border @selection-change="handleSelectionChange" @row-click="handleRowClick" tooltip-effect="dark" style="width: 100%">
            <!--评价详情  -->
            <BmTableColumn prop="name" :label="$t('comments.CommentDetail')" width="600" header-align="center">
                <template #default="scope">
                    <div class="flex vcenter user mb-10">
                        <!-- 被点赞数 -->
                        <span>{{ $t("comments.UserRatings") }}</span
                        ><el-rate disabled v-model="scope.row.goodsScores" class="ml-10"></el-rate><span class="ml-25">{{ $t("comments.ByThumbUp") }}({{ scope.row.glike }})</span>
                    </div>
                    <!-- <div class="flex vcenter comments mb-20"></div> -->
                    <div>
                        {{
                            scope.row.complaintStatus == 0
                                ? $t("comments.normal") //"正常"
                                : scope.row.complaintStatus == 1
                                ? $t("comments.pending") //"待处理"
                                : scope.row.complaintStatus == 2
                                ? $t("comments.fail") //"已驳回"
                                : scope.row.complaintStatus == 3
                                ? $t("comments.processed") //"已处理"
                                : ""
                        }}
                    </div>
                    <div class="mb-10">{{ scope.row.content }}</div>
                    <div class="mb-10">
                        <!-- 1 图片 2视频 -->
                        <template v-for="(item, i) in scope.row.pictures" :key="i">
                            <BmImage v-if="item.fileType == 1" class="infoImg" :src="item.imgUrl" :preview-src-list="[item.imgUrl]" />
                            <div v-else>
                                <video :src="item.imgUrl" controls="controls" class="mr-5 mb-5" :height="160">your browser does not support the video tag</video>
                            </div>
                        </template>
                    </div>
                    <div>
                        <span>{{ scope.row.createTime }}</span>
                    </div>
                </template>
            </BmTableColumn>

            <!-- 商品信息 -->
            <BmTableColumn prop="" :label="$t('comments.goodsInfo')" align="center">
                <template #default="scope">
                    <div>
                        <div class="flex">
                            <div class="imgInfo">
                                <BmImage class="img_info" :src="scope.row.goodPicture" :preview-src-list="[scope.row.goodPicture]" />
                            </div>
                            <div class="ml-30 pr-10" style="text-align: left;">
                                <div>{{ $t("comments.orderNum") }}: {{ scope.row.orderSn }}</div>
                                <div>{{ $t("comments.sellerNickName") }}: {{ scope.row.buyerName }}</div>
                                <div>{{ scope.row.goodTitle }}</div>
                                <div>TSIN: {{ scope.row.tsin }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 评价标签 -->
            <BmTableColumn prop="" :label="$t('comments.commentsTag')" header-align="center" align="center" width="200px"></BmTableColumn>
            <BmTableColumn prop="" :label="$t('comments.operation')" header-align="center" align="center" width="120px" fixed="right">
                <template #default="scope">
                    <div class="green p-10">
                        <!-- 回复/互动 -->
                        <div class="cp">
                            <el-button type="text" v-permission="'goodsManage_comments_replyInteract'" @click="repay(scope.row)">{{ $t("comments.replyInteract") }}</el-button>
                        </div>
                        <!-- 查看订单 -->
                        <div class="mb-15 cp">
                            <el-button type="text" v-permission="'goodsManage_comments_detail'" @click="checkOrder(scope.row)">{{ $t("comments.checkOrder") }}</el-button>
                        </div>
                        <!-- 举报 -->
                        <div class="cp">
                            <el-button type="text" v-permission="'goodsManage_comments_report'" @click="report(scope.row)">{{ $t("comments.report") }}</el-button>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
        </BmTable>
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrent" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>
    <div class="dialog">
        <!-- 评价/互动 -->
        <el-dialog @close="closeReply" :title="$t('comments.commentsInteract')" v-model="centerDialogVisible" width="60%">
            <div class="order mb-20">
                <!-- 订单编号 -->
                <div class="mb-10">{{ $t("comments.orderNum") }}: {{ repayForm.orderSn }}</div>
                <div class="flex">
                    <div class="order_img"><img class="order_img" v-if="repayForm.goodPicture" :src="repayForm.goodPicture" /></div>
                    <div class="ml-20">
                        <div>{{ repayForm.goodTitle }}</div>
                        <div>TSIN：{{ repayForm.tsin }}</div>
                        <div>{{ repayForm.saleAttr }}</div>
                    </div>
                </div>
            </div>
            <!-- 主评/追评 -->
            <div class="title">{{ $t("comments.sellerReply") }}</div>
            <div class="commentsInfo mb-20">
                <!-- 主评论 -->
                <div class="item">
                    <div class="flex vcenter mb-5">
                        <span v-if="repayForm.buyerPortrait"><img class="ava_img" :src="repayForm.buyerPortrait"/></span><span class="ml-15">{{ repayForm.buyerName }}</span
                        ><span class="ml-15 tag_buyer">{{ $t("comments.buyer") }}</span>
                    </div>
                    <div class="mb-15">{{ repayForm.content }}</div>
                    <div class="mb-15">
                        <template v-for="(item, i) in repayForm.pictures" :key="i">
                            <span v-if="item.fileType == 1">
                                <BmImage style="width:50px;height: 50px;border-radius: 2px;" class="ml-10" v-if="item.imgUrl" :src="item.imgUrl" :preview-src-list="[item.imgUrl]" />
                            </span>
                            <div v-else>
                                <video :src="item.imgUrl" controls="controls" class="mr-5 mb-5" :height="160">your browser does not support the video tag</video>
                            </div>
                        </template>
                    </div>
                    <div>
                        <span>{{ repayForm.createTime }}</span>
                    </div>
                </div>
                <!-- 回复 -->
                <div class="item" v-for="(item, i) in repayForm.sellerReplyList" :key="i">
                    <div class="flex vcenter mb-5">
                        <span v-if="item.replyPicture"><img :src="item.replyPicture" class="ava_img"/></span><span class="ml-15">{{ item.replyName }}</span
                        ><span class="ml-15 tag_seller">{{ $t("comments.seller") }}</span>
                    </div>
                    <div>
                        <!-- 主评回复 -->
                        <span class="seller_font">{{ $t("comments.hostReply") }}:</span> <span class="replyContent ml-10">{{ repayForm.content }}</span>
                    </div>
                    <div style="padding-left: 72px;">{{ item.replyContent }}</div>
                </div>
                <!-- 追加 -->
                <div class="item" v-if="repayForm.additionalEvaluates.length > 0">
                    <div class="flex vcenter mb-5">
                        <span v-if="repayForm.buyerPortrait"><img class="ava_img" :src="repayForm.buyerPortrait"/></span><span class="ml-15">{{ repayForm.additionalEvaluates[0].buyerName }}</span
                        ><span class="ml-15 tag_buyer">{{ $t("comments.buyer") }}</span>
                    </div>
                    <!-- 追评 -->
                    <div class="mb-5">{{ $t("comments.sellerReply") }}: {{ repayForm.additionalEvaluates[0].content }}</div>
                    <div class="mb-15">
                        <template v-for="(item, i) in repayForm.additionalEvaluates[0].pictures" :key="i">
                            <BmImage style="width:50px;height: 50px;border-radius: 2px;" class="mr-10" v-if="item.imgUrl" :src="item.imgUrl" :preview-src-list="[item.imgUrl]" />
                        </template>
                    </div>
                    <div>
                        <span>{{ repayForm.additionalEvaluates[0].createTime }}</span>
                    </div>
                    <!-- <span @click="replyNow(repayForm.additionalEvaluates[0].id)" class="ml-30 cp">回复</span> -->
                </div>
                <!-- 追加评论的回复 -->
                <template v-if="repayForm.additionalEvaluates.length > 0">
                    <div class="item" v-for="(item, i) in repayForm.additionalEvaluates[0].sellerReplyList" :key="i">
                        <div class="flex vcenter mb-5">
                            <!-- 卖家 -->
                            <span><img src="#" class="ava_img"/></span><span class="ml-15">{{ item.replyName }}</span
                            ><span class="ml-15 tag_seller">{{ $t("comments.sellerReply") }}</span>
                        </div>
                        <div>
                            <!-- 追评回复 -->
                            <span class="seller_font">{{ $t("comments.addCommentsReply") }}:</span> <span class="replyContent ml-10">{{ repayForm.additionalEvaluates[0].content }}</span>
                        </div>
                        <div style="padding-left: 72px;">{{ item.replyContent }}</div>
                    </div>
                </template>
            </div>
            <!-- 追加评论 -->
            <div class="commentsInfo mb-20" v-if="false">
                <!-- 主评论 -->
                <!-- <div class="item">
                    <div class="flex vcenter mb-5"><span><img class="ava_img" :src="repayForm.buyerPortrait"/></span><span class="ml-15">{{ repayForm.buyerName }}</span><span class="ml-15 tag_buyer">买家</span></div>
                    <div class="mb-15">{{ repayForm.content }}</div>
                    <div class="mb-15"><BmImage style="width:50px;height: 50px;border-radius: 2px;" class="ml-10" v-for="(item, i) in repayForm.pictures" :key="i" :src="item.imgUrl" :preview-src-list="[item.imgUrl]"/></div>
                    <div><span>{{ repayForm.createTime }}</span></div>
                </div> -->
                <!-- 回复 -->
                <!-- <div class="item" v-for="(item, i) in repayForm.additionalEvaluates[0].sellerReplyList">
                    <div class="flex vcenter mb-5"><span><img src="#" class="ava_img" /></span><span class="ml-15">{{ item.replyName }}</span><span class="ml-15 tag_seller">卖家</span></div>
                    <div><span class="seller_font">追评回复:</span>  <span class="replyContent ml-10">{{repayForm.additionalEvaluates[0].content}}</span></div>
                    <div style="padding-left: 72px;">{{ item.replyContent }}</div>
                </div> -->
                <!-- 追加 -->
                <!-- <div class="item">
                    <div class="flex vcenter mb-5"><span><img src="#" class="ava_img" /></span><span class="ml-15">{{ repayForm.additionalEvaluates[0].buyerName }}</span><span class="ml-15 tag_buyer">卖家</span></div>
                    <div class="mb-5">追评: {{ repayForm.additionalEvaluates[0].content }}</div>
                    <div class="mb-15"><BmImage style="width:50px;height: 50px;border-radius: 2px;" class="mr-10" v-for="(item, i) in  repayForm.additionalEvaluates[0].pictures" :key="i" :src="item.imgUrl" :preview-src-list="[item.imgUrl]"/></div>
                    <div><span>{{ repayForm.additionalEvaluates[0].createTime }}</span><span class="ml-30">回复</span></div>
                </div> -->
            </div>
            <div class="flex pt-10">
                <el-input ref="replyRef" v-model="reply" :placeholder="$t('comments.enterReply')" maxlength="200" /><el-button @click="replySub" type="primary" class="ml-20">{{
                    $t("comments.reply")
                }}</el-button>
            </div>
            <!-- <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
                </span>
            </template> -->
        </el-dialog>
    </div>
    <BmDialog v-model:visible="visible" :title="$t('comments.reportComments')" :confirm="confirm" :cancel="cancel" :width="800">
        <div style="background: #FFFBE6;border: 1px solid #FFE58F" class="p-15">
            <div>1.{{ $t("comments.oneReport") }}</div>
            <div>2.{{ $t("comments.reportTip") }}</div>
        </div>
        <el-form :model="reportForm" :rules="rules" ref="reportFormRef" destroy-on-close label-width="180px" label-position="right">
            <!-- 举报场景 -->
            <el-form-item :label="$t('comments.ReportScene')" prop="reportingScene">
                <el-select v-model="reportForm.reportingScene" style="background: white;height: 44px;">
                    <el-option v-for="(item, i) in dictList" :label="item.label" :key="i" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('remark')" prop="reportingContent">
                <el-input :placeholder="$t('pleaseEnter')" v-model="reportForm.reportingContent" type="textarea" maxlength="500" style="width: 500px;" :rows="5" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('comments.UploadDocuments')">
                <div class="mb-15">
                    <BmUpload @change="onChangeUpload($event)" :multiple="true" :fileList="reportForm.picture" :limit="9" size="xl" />
                </div>
                <div v-html="$t('comments.imgTip')"></div>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, getCurrentInstance, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
// import { useStore } from "vuex";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { evaluatesSellerList, adminDictType, productEvaluateReports, productEvaluateInfo, productEvaluateReply } from "@/api/goods";
import storage from "@/utils/storage";

export default {
    name: "comments",
    setup(props) {
        const { proxy } = getCurrentInstance();
        // const store = useStore();
        const router = useRouter();

        // const userInfo = computed(() => store.state.user.userInfo);
        const userInfo = storage.get("userInfo");

        // table数据
        const tableData = ref([]);
        let tableLoading = ref(true);
        let dataList = ref({});

        let searchFormRef = ref(null);

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        // 时间筛选
        let tmpTime = ref([]);

        // 多选
        let multipleTable = ref();

        // dialog相关
        let reply = ref();
        let centerDialogVisible = ref(false);

        // 举报评论dailog相关
        let reportFormRef = ref(null);
        let visible = ref(false);

        const reportForm = reactive({
            picture: [],
            reportingScene: "", // 举报场景
            reportingContent: "" // 原因
        });

        let rules = ref({
            amount: [{ required: true, message: proxy.$t("comments.enterSum"), trigger: "blur" }],
            reportingScene: [{ required: true, message: proxy.$t("comments.selectReportScene"), trigger: "blur" }],
            reportingContent: [{ required: true, message: proxy.$t("comments.enterRemark"), trigger: "blur" }]
        });

        // 快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        // 禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        //创建时间
        let timeTypeValue = "createTime";
        let timeTypeName = ref(proxy.$t("EvaluationTime"));

        const timeType = computed(() => [
            {
                name: proxy.$t("EvaluationTime"), //评价时间
                value: "1"
            },
            {
                name: proxy.$t("afterTime"), //追评时间
                value: "2"
            }
        ]);

        // 0tsin  1fnsku 2upc 3商品编码 4 商品标题 搜索
        const goodsMultiList = computed(() => [
            {
                name: "Tsin", //tsin
                value: 0
            },
            {
                name: "Fnsku", //fnsku
                value: 1
            },
            {
                name: "UPC", //upc
                value: 2
            },
            {
                name: proxy.$t("releaseGoods.goodsCode"), //商品编码
                value: 3
            }
            // {
            //     name: proxy.$t("goodsList.keyword"), //商品标题
            //     value: 4
            // }
        ]);

        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
            console.log(rows);
        };

        //点击单行-选择
        const handleRowClick = (row) => {
            const index = tableSelectionRows.findIndex((item) => item.id === row.id);
            if (index > -1) {
                tableSelectionRows.push(row);
            } else {
                tableSelectionRows.splice(index, 1);
            }
            multipleTable.value.toggleRowSelection(row);
        };

        let searchForm = reactive({
            _tpmTime: [],
            beginTime: null, //	开始时间
            //complaintStatus: "", //	投诉状态: 0->正常 1->待处理 2->已驳回 3->已处理
            endTime: null, //	结束时间
            goodKeyword: "", //	商品关键字，商品名称/商品tsin
            goodsScoresList: [], // 商品评分
            hasTypeList: [], //	筛选: 1->有图片 2->有视频 3->未回复 4->已回复 5->有追评 6->已举报 7->主评有文字
            orderKeyword: "", //	订单号
            pageNum: pageNum.value, //	pageNum,示例值(1)
            pageSize: pageSize, //	pageSize,示例值(10)
            userKeyword: "", //	会员关键字,
            timeType: "1", // 时间类型
            tmpTime: [],
            sIndex: 0, // fnsku upc等搜索
            skeyword: "", // fnsku upc等搜索 搜索关键字
            titleKeyword: "" // 商品标题
        });

        // 时间
        const changeDate = (val) => {
            console.log("val", val);
        };

        // 下拉时间选择
        const handleCommandTimeType = (item) => {
            console.log("val", item);
            searchForm.timeType = item.value;
            timeTypeName.value = item.name;
        };

        // 获取table分页数据
        const getListData = () => {
            tableLoading.value = true;
            evaluatesSellerList(searchForm)
                .then((res) => {
                    console.log(res);
                    tableData.value = res.data.records;
                    dataList.value = res.data;
                    pageTotal.value = res.data.total;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getListData();

        // 搜索
        const handelSearch = () => {
            searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[0]);
            searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tpmTime && searchForm._tpmTime[1]);
            searchForm.skeyword = searchForm.skeyword ? searchForm.skeyword.replace(/^\s+|\s+$/g, "") : "";
            searchForm.titleKeyword = searchForm.titleKeyword ? searchForm.titleKeyword.replace(/^\s+|\s+$/g, "") : "";
            getListData();
            console.log("searchForm", searchForm);
        };

        // 重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            getListData();
        };

        //当前页
        const handleCurrent = (val) => {
            searchForm.pageNum = val;
            getListData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            getListData();
        };

        // 时间选择
        const timeChange = (val) => {
            if (val.join(",") == 30) {
                var date = new Date();
                let nowDate = new Date();
                date.setMonth(date.getMonth() - 1, 1);
                date.setDate(date.getDate() - 1);
                searchForm.beginTime = proxy.utils.formatStandardDate(date);
                searchForm.endTime = proxy.utils.formatStandardDate(nowDate);
            } else if (val.join(",") == 60) {
                var date = new Date();
                let nowDate = new Date();
                date.setMonth(date.getMonth() - 3, 1);
                date.setDate(date.getDate() - 1);
                searchForm.beginTime = proxy.utils.formatStandardDate(date);
                searchForm.endTime = proxy.utils.formatStandardDate(nowDate);
            } else {
                var date = new Date();
                let nowDate = new Date();
                date.setMonth(date.getMonth() - 6, 1);
                date.setDate(date.getDate() - 1);
                searchForm.beginTime = proxy.utils.formatStandardDate(date);
                searchForm.endTime = proxy.utils.formatStandardDate(nowDate);
            }
        };

        // 举报
        let id = "";
        const report = (row) => {
            visible.value = true;
            id = row.id;
        };

        // 活动举报评论数据字典
        let dictList = ref([]);
        const getDict = () => {
            adminDictType("product_goods_evaluate_scene")
                .then((res) => {
                    dictList.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getDict();

        // 举报图片
        const onChangeUpload = (fileList) => {
            reportForm.picture = fileList;
        };

        // 举报
        const confirm = () => {
            let form = {
                evaluateId: id,
                reportingScene: reportForm.reportingScene,
                reportingContent: reportForm.reportingContent,
                pictures: []
            };
            reportForm.picture.forEach((v) => {
                form.pictures.push({ fileType: 1, imgUrl: v.url });
            });

            reportFormRef.value.validate((valid) => {
                if (valid) {
                    const loading = proxy.$loading();
                    productEvaluateReports(form)
                        .then((res) => {
                            visible.value = false;
                            reportFormRef.value.resetFields();
                            proxy.$message.success(res.msg);
                            reportFormRef.value.resetFields();
                            loading.close();
                        })
                        .catch((err) => {
                            console.log(err);
                            loading.close();
                        });
                } else {
                    console.log("error submit");
                    return false;
                }
            });
        };

        const cancel = () => {
            reportForm.picture = [];
            reportForm.reportingScene = ""; // 举报场景
            reportForm.reportingContent = ""; // 原因
            visible.value = false;
        };

        // 回复dialog form
        let repayForm = ref({});

        // 评论id
        let replyId = "";
        // 评论后通过主评论id刷新评论内容
        let addreplyId = "";

        // 获取评论内容
        const getEvaluateInfo = (id, userid) => {
            productEvaluateInfo({ id: id, userId: userid })
                .then((res) => {
                    repayForm.value = res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        // 回复dialog
        const repay = (row) => {
            centerDialogVisible.value = true;
            // repayForm.value = row;
            replyId = row.id;
            addreplyId = row.id;
            getEvaluateInfo(row.id, userInfo.id);
        };

        let replyRef = ref("");

        // 追评回复 获得焦点
        const replyNow = (id) => {
            reply.value = "";
            replyRef.value.focus();
            replyId = id;
        };

        // 提交回复
        const replySub = () => {
            if (reply.value == "") {
                proxy.$message.success(proxy.$t("comments.enterReply")); //"请输入回复内容"
                return;
            }
            let form = {
                evaluateId: replyId,
                replyContent: reply.value,
                utype: "1"
            };
            const loading = proxy.$loading();
            productEvaluateReply(form)
                .then((res) => {
                    if (res.code == 0) {
                        proxy.$message.success(res.msg);
                        getEvaluateInfo(addreplyId, userInfo.id);
                        loading.close();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    loading.close();
                });
        };

        // 评论关闭
        const closeReply = () => {
            reply.value = "";
            centerDialogVisible.value = false;
        };

        // 查看订单
        const checkOrder = (row) => {
            router.push({ path: "/commodity/orderDetail", query: { id: row.orderId } });
        };

        return {
            searchForm,
            shortcuts,
            disabledDate,
            timeTypeValue,
            timeTypeName,
            timeType,
            resetForm,
            handleCommandTimeType,
            changeDate,
            handleCurrent,
            handleSizeChange,
            handelSearch,
            handleSelectionChange,
            tableData,
            centerDialogVisible,
            reply,
            handleRowClick,
            pageNum,
            pageSize,
            pageTotal,
            tableLoading,
            dataList,
            multipleTable,
            timeChange,
            tmpTime,
            searchFormRef,
            onChangeUpload,
            reportFormRef,
            reportForm,
            rules,
            confirm,
            cancel,
            dictList,
            visible,
            report,
            repay,
            checkOrder,
            repayForm,
            replyNow,
            replyRef,
            replySub,
            closeReply,
            goodsMultiList
        };
    }
};
</script>

<style lang="scss" scoped>
.imgInfo {
    width: 50px;
    height: 50px;
    margin-left: 20px;
}
.user {
    height: 54px;
    line-height: 54px;
    border-bottom: 1px solid #e8e8e8;
}
.comments {
    height: 54px;
    line-height: 54px;
}
.infoImg {
    width: 59px;
    height: 59px;
    margin-left: 5px;
    border-radius: 2px;
}
.order {
    border: 1px solid #e8e8e8;
    padding: 10px;
}
.dialog {
    /deep/.el-dialog__body {
        padding: 20px 20px;
    }
    .order_img {
        width: 50px;
        height: 50px;
    }
    .title {
        height: 40px;
        line-height: 40px;
        background-color: #f2f2f2;
        padding-left: 10px;
    }
    .commentsInfo {
        border: 1px solid #e8e8e8;
        padding: 10px;

        .item {
            border-bottom: 1px solid #f2f2f2;
            margin-bottom: 10px;
            padding-bottom: 10px;
        }
        .tag_buyer {
            padding-left: 2px;
            padding-right: 2px;
            background-color: #ff8248;
            border-radius: 2px;
            color: #ffffff;
        }
        .tag_seller {
            padding-left: 2px;
            padding-right: 2px;
            background-color: #42b7ae;
            border-radius: 2px;
            color: #ffffff;
        }

        .seller_font {
            color: #c9c9c9;
        }
    }
}
.img_info {
    width: 59px;
    height: 59px;
    border-radius: 2px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 59px;
    height: 59px;
}
.replyContent {
    background: #f2f2f2;
}
.ava_img {
    width: 30px;
    height: 30px;
    border-radius: 15px;
}
</style>
