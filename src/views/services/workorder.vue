<template>
    <div class="top-search-form">
        <BmBreadcrumb />
        <BmAlert :title="$t('workReturn.tips')" icon="warning" class="mb-15" />

        <div class="flex p-20 mb-20 border tc">
            <div class="flex1">
                <!-- 工单量 -->
                <div>{{ $t("workReturn.repairOrderQuantity") }}</div>
                <div>{{ workCount.workCount }}{{ $t("workReturn.order") }}</div>
            </div>
            <div class="flex1 border-left">
                <!-- 违规处理量 -->
                <div>{{ $t("workReturn.IllegalHandling") }}</div>
                <div>{{ workCount.violateDealCount }}{{ $t("workReturn.order") }}</div>
            </div>
            <div class="flex1 border-left">
                <!-- 违规处理率 -->
                <div>{{ $t("workReturn.ViolationHandlingRate") }}</div>
                <div>{{ workCount.violateDealRate }}%</div>
            </div>
            <div class="flex1 border-left">
                <!-- 完结率 -->
                <div>{{ $t("workReturn.WanJieLv") }}</div>
                <div>{{ workCount.completeRate }}%</div>
            </div>
            <div class="flex1 border-left">
                <!-- 平均完结时长 -->
                <div>{{ $t("workReturn.MeanCompletionTime") }}</div>
                <div>{{ workCount.averageDealTime }}h</div>
            </div>
        </div>
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <!-- 工单编号 -->
                    <el-form-item :label="$t('workReturn.workOrderNumber')" prop="workSn">
                        <el-input v-model="searchForm.workSn" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 创建时间 -->
                    <el-form-item prop="_tempTime" :label="$t('workReturn.createTime')">
                        <el-date-picker
                            v-model="searchForm._tempTime"
                            @change="changeDate"
                            type="datetimerange"
                            :start-placeholder="$t('startDate')"
                            range-separator="-"
                            :end-placeholder="$t('endDate')"
                            :shortcuts="shortcuts"
                            :disabled-date="disabledDate"
                            clearable
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 工单状态 -->
                    <el-form-item prop="status" :label="$t('workReturn.workStatus')">
                        <el-select v-model="searchForm.status" :placeholder="$t('pleaseSelect')" clearable>
                            <el-option v-for="(item, i) in workStatus" :key="i" :label="item.name" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <!-- 订单号 -->
                    <el-form-item :label="$t('workReturn.orderNumber')" prop="orderSn">
                        <el-input v-model="searchForm.orderSn" :placeholder="$t('pleaseEnter')" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- <div id="elCollapse" class="h-0 hidden">
                <el-row :gutter="24">
                </el-row>
            </div> -->

            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
                <!-- 展开  -->
                <!-- <BmCollapse el="#elCollapse" :isShow="false" /> -->
            </div>
        </el-form>
    </div>

    <div class="p-25 bg-white round-4">
        <div class="flex between vcenter mb-20">
            <div class="flex vcenter">
                <!-- 待举证 -->
                <el-button @click="workStatusChange(1)" plain>{{ $t("workReturn.waitPoof") }}({{ tableData.waitProofCount }})</el-button>
                <!-- 24小时内逾期 -->
                <el-button @click="expireChange(1)" plain>{{ $t("workReturn.overdue24") }}({{ tableData.beExpireCount }})</el-button>
                <!-- 等待平台处理 -->
                <el-button @click="workStatusChange(2)" plain>{{ $t("workReturn.waitPlatformProcess") }}({{ tableData.waitMallHandleCount }})</el-button>
            </div>
            <div class="flex vcenter">
                <el-button v-permission="'return_workOrder_exportExcel'" plain @click="handleExportExcel">{{ $t("table.exportExcel") }}</el-button>
            </div>
        </div>

        <BmTable :data="tableData.omsOrderReturnWorks" ref="multipleTable" @selection-change="handleSelectionChange" tooltip-effect="dark" border style="width: 100%">
            <BmTableColumn type="selection" width="55"></BmTableColumn>
            <!-- 工单ID -->
            <BmTableColumn prop="workSn" :label="$t('workReturn.workId')" min-width="180"></BmTableColumn>
            <!-- 申请时间 -->
            <BmTableColumn prop="createTime" :label="$t('workReturn.timeApplication')" width="150"> </BmTableColumn>
            <!-- 工单状态 -->
            <BmTableColumn prop="status" :label="$t('workReturn.workStatus')">
                <template #default="scope">
                    <!-- "待举证" "平台处理中" "工单关闭" "工单已完结" -->
                    {{
                        scope.row.status == 1
                            ? $t("workReturn.waitPoof")
                            : scope.row.status == 2
                            ? $t("workReturn.waitPlatformProcess")
                            : scope.row.status == 3
                            ? $t("workReturn.workClose")
                            : scope.row.status == 4
                            ? $t("workReturn.workEnd")
                            : ""
                    }}
                </template>
            </BmTableColumn>
            <!-- 问题名称 -->
            <BmTableColumn prop="workName" :label="$t('workReturn.NameProblem')" min-width="200" show-overflow-tooltip></BmTableColumn>
            <!-- 问题描述 -->
            <BmTableColumn prop="workDesc" :label="$t('workReturn.problemDescription')" min-width="300">
                <template #default="scope">
                    <div>{{ scope.row.workDesc }}</div>
                    <div>
                        <span v-for="(item, i) in scope.row.workMustVouchers" :key="i"><BmImage v-if="item" class="tableImg ml-5" :src="item" :preview-src-list="[item]"/></span>
                    </div>
                    <div>
                        <span v-for="(item, i) in scope.row.workOptionalVouchers" :key="i"><BmImage v-if="item" class="tableImg ml-5" :src="item" :preview-src-list="[item]"/></span>
                    </div>
                </template>
            </BmTableColumn>
            <!-- 责任判定 -->
            <BmTableColumn prop="responsJudage" :label="$t('workReturn.liabilityJudgment')" align="center">
                <template #default="scope">
                    <div>
                        {{
                            scope.row.responsJudage === 0
                                ? $t("workReturn.NoResponsibility") //"均无责任"
                                : scope.row.responsJudage === 1
                                ? $t("workReturn.BusinessResponsibility") //"商家责任"
                                : scope.row.responsJudage === 2
                                ? $t("workReturn.BuyersResponsibility") //"买家责任"
                                : scope.row.responsJudage === 3
                                ? $t("workReturn.RepairOrderViolations") //"工单违规"
                                : "-"
                        }}
                    </div>
                    <div v-if="scope.row.refundJudage >= 0" class="light-grey">
                        <!--退款判定0表示无需退款 1退款给买家  -->
                        {{ scope.row.refundJudage === 0 ? $t("workReturn.DontRefund") : scope.row.refundJudage === 1 ? $t("workReturn.RefundBuyer") : "-" }}
                    </div>
                </template>
            </BmTableColumn>
            <!-- 截止日期 -->
            <BmTableColumn prop="expirationDate" :label="$t('workReturn.expirationDate')" min-width="150"></BmTableColumn>
            <!-- 订单号 -->
            <BmTableColumn prop="orderSn" :label="$t('workReturn.orderNumber')" min-width="250" show-overflow-tooltip></BmTableColumn>
            <!-- 操作 -->
            <BmTableColumn prop="" :label="$t('workReturn.operation')" min-width="100">
                <template #default="scope">
                    <div class="green cp">
                        <!-- 查看详情 -->
                        <div class="mb-15">
                            <el-button type="text" v-permission="'return_workOrder_detail'" @click="checkDetail(scope.row)">{{ $t("workReturn.SeeDetails") }}</el-button>
                        </div>
                        <!-- 举证/追加举证 -->
                        <div v-if="scope.row.status == 1">
                            <el-button type="text" v-permission="'return_workOrder_EvidenceAdd'" @click="takePoof(scope.row)">{{ $t("workReturn.EvidenceAdditional") }}</el-button>
                        </div>
                    </div>
                </template>
            </BmTableColumn>
        </BmTable>

        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </div>

    <!-- 添加凭证 -->
    <el-dialog :title="$t('workReturn.AddCredentials')" v-model="dialogFormVisible" @close="closeDialog">
        <div class="dialog_warning mb-25">
            <i class="el-icon-warning"></i><span class="ml-20">{{ $t("workReturn.proofWarningTips") }}</span>
        </div>
        <el-form :model="ruleForm" :label-position="labelPosition" :rules="rules" ref="ruleFormR">
            <!-- 申诉原因 -->
            <el-form-item :label="$t('workReturn.AppealReason')" v-if="ruleForm.workName" :label-width="formLabelWidth" prop="workName">
                <el-input v-model="ruleForm.workName" :rows="5" type="textarea" maxlength="500" show-word-limit autocomplete="off"></el-input>
            </el-form-item>
            <!-- 补充描述 -->
            <el-form-item :label="$t('workReturn.supplDescription')" :label-width="formLabelWidth" prop="workDesc">
                <el-input v-model="ruleForm.workDesc" :rows="5" type="textarea" maxlength="500" show-word-limit autocomplete="off"></el-input>
            </el-form-item>
            <!-- 图片 -->
            <el-form-item :label="$t('workReturn.picture')" :label-width="formLabelWidth" prop="img_1">
                <div>
                    <BmUpload @change="onChangeUploadImg_1($event)" :multiple="true" :fileList="ruleForm.img_1" :limit="8" size="xl" />
                </div>
                <div>1. {{ $t("workReturn.mustPoof") }}</div>
                <div>
                    <BmUpload @change="onChangeUploadImg_2($event)" :multiple="true" :fileList="ruleForm.img_2" :limit="8" size="xl" />
                </div>
                <div>2. {{ $t("workReturn.optionalPoof") }}</div>
            </el-form-item>
        </el-form>
        <div class="dialog_btn" v-if="ruleForm.workName == ''">
            <!-- 取 消 确 定-->
            <el-button @click="resetFormDialgo">{{ $t("cancel") }}</el-button>
            <el-button type="primary" @click="submitForm">{{ $t("confirm") }}</el-button>
        </div>
    </el-dialog>
    <!-- 工单详情 -->
    <BmDialog v-model:visible="visible" :title="$t('workReturn.detail')" :width="1000" :showFooter="false">
        <el-form :model="detailForm" :label-position="right" label-width="200px;">
            <div class="flex mb-15">
                <!-- 买家问题描述及举证: -->
                <div style="width: 200px;">{{ $t("workReturn.BuyerDescriptionProof") }}</div>
                <div>
                    <div class="mb-5">{{ detailForm.workDesc }}</div>
                    <div class="flex">
                        <div v-for="(item, index) in detailForm.workMustVoucher" :key="index">
                            <BmImage v-if="item" style="width: 40px;height: 40px;" class="mr-5" :src="item" :preview-src-list="[item]" />
                        </div>
                    </div>
                    <div class="flex">
                        <div v-for="(item2, index) in detailForm.workOptionalVoucher">
                            <BmImage v-if="item" style="width: 40px;height: 40px;" class="mr-5" :key="index" :src="item2" :preview-src-list="[item2]" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex mb-15">
                <!-- 商家举证详情: -->
                <div style="width: 200px;">{{ $t("workReturn.MerchantProofDetails") }}</div>
                <div v-if="detailForm.sellerReturnWorkAlleges && detailForm.sellerReturnWorkAlleges.length > 0">
                    <div class="mb-5">{{ detailForm.sellerReturnWorkAlleges[0].workDesc }}</div>
                    <div class="flex">
                        <div v-for="(item, index) in detailForm.sellerReturnWorkAlleges[0].workMustVoucher" :key="index">
                            <BmImage v-if="item" style="width: 40px;height: 40px;" class="mr-5" :src="item" :preview-src-list="[item]" />
                        </div>
                    </div>
                    <div class="flex">
                        <div v-for="(item, index) in detailForm.sellerReturnWorkAlleges[0].workOptionalVoucher" :key="index" class="flex">
                            <BmImage v-if="item" style="width: 40px;height: 40px;" class="mr-5" :src="item" :preview-src-list="[item]" />
                        </div>
                    </div>
                </div>
            </div>
            <el-form-item :label="$t('workReturn.repairOrderDetermine') + ':'" class="mb-15">
                <div style="padding-left: 200px;">
                    <!--均无责任 商家责任 买家责任 工单违规  -->
                    <el-radio v-model="radio" label="1" v-if="detailForm.responsJudage && detailForm.responsJudage == 0">{{ $t("workReturn.NoResponsibility") }}</el-radio>
                    <el-radio v-model="radio" label="1" v-if="detailForm.responsJudage && detailForm.responsJudage == 1">{{ $t("workReturn.BusinessResponsibility") }}</el-radio>
                    <el-radio v-model="radio" label="1" v-if="detailForm.responsJudage && detailForm.responsJudage == 2">{{ $t("workReturn.BuyersResponsibility") }}</el-radio>
                    <el-radio v-model="radio" label="1" v-if="detailForm.responsJudage && detailForm.responsJudage == 3">{{ $t("workReturn.RepairOrderViolations") }}</el-radio>
                </div>
            </el-form-item>
            <!-- 资金处理: -->
            <el-form-item :label="$t('workReturn.dispositionFunds')" class="mb-15">
                <div style="padding-left: 200px;">
                    <!--"无需退款" "退款给买家" -->
                    {{ detailForm.refundJudage === 0 ? $t("workReturn.DontRefund") : detailForm.refundJudage === 1 ? $t("workReturn.RefundBuyer") : "" }}
                </div>
            </el-form-item>
            <!-- 补充描述: -->
            <el-form-item :label="$t('workReturn.supplDescription')" class="mb-15">
                <div style="padding-left: 200px;">
                    <!-- 注: 买卖双方都可见 -->
                    <div v-if="detailForm.mallDesc">{{ $t("workReturn.infuse") }}</div>
                    {{ detailForm.mallDesc }}
                </div>
            </el-form-item>
            <!-- 图片: -->
            <el-form-item :label="$t('workReturn.picture')">
                <div style="padding-left: 200px;">
                    <div class="flex mb-15">
                        <div v-for="(item, index) in detailForm.mallMustVoucher" class="flex">
                            <BmImage v-if="item" style="width: 40px;height: 40px;" class="mr-5" :key="index" :src="item" :preview-src-list="[item]" />
                        </div>
                    </div>
                    <div class="flex">
                        <div v-for="(item, index) in detailForm.mallOptionalVoucher" class="flex">
                            <BmImage v-if="item" style="width: 40px;height: 40px;" class="mr-5" :key="index" :src="item" :preview-src-list="[item]" />
                        </div>
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </BmDialog>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
import { orderReturnWorkSellerList, orderReturnWorkSellerCount, orderReturnAddToProof, orderReturnWorkInfoDetail, orderReturnWorkSellerListExport } from "@/api/goods";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { exportExcel } from "@/utils/";
export default {
    name: "wordOrder",
    setup(props) {
        let { proxy } = getCurrentInstance();
        const router = useRouter();

        let radio = ref("1");

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        // 表格数据
        const tableData = ref([]);

        let searchFormRef = ref("");

        let dialogImageUrl = ref("");
        let dialogVisible = ref(false);
        let disabled = ref(false);

        let labelPosition = ref("left");
        let dialogFormVisible = ref(false);

        let formLabelWidth = ref("120px");

        let searchForm = reactive({
            _tempTime: [],
            beginTime: null, // 开始时间
            buyerKeyword: null, //	会员信息
            endTime: null, //	结束时间
            orderSn: null, //	订单号
            refundJudage: null, //	退款判定0表示无需退款 1退款给买家
            responsJudage: null, //	责任判定0->均无责任 1->商家责任 2->买家责任
            sellerKeyword: null, //	卖家信息
            status: "", //	工单状态1->待举证 2->等平台处理中 3->工单关闭 4->工单已完毕5->工单违规
            timeType: null, //	时间类型0默认创建时间
            workSn: null, //	工单编号
            pageNum: pageNum,
            pageSize: pageSize,
            isBeExpire: 0
        });

        let rules = ref({
            img_1: [{ required: true, message: proxy.$t("workReturn.pleaseEnterPicture"), trigger: "blur" }],
            workDesc: [{ required: true, message: proxy.$t("pleaseEnter"), trigger: "blur" }],
            date1: [{ type: "date", required: true, message: proxy.$t("workReturn.pleaseEnterDate"), trigger: "change" }],
            type: [{ type: "array", required: true, message: proxy.$t("workReturn.activityProperty"), trigger: "change" }]
        });

        let ruleFormR = ref("");
        let ruleForm = reactive({
            workDesc: "",
            orderWorkId: "",
            img_1: [],
            img_2: [],
            workName: ""
        });

        //全选
        let checkedAll = ref(false);
        let isIndeterminate = ref(false);
        let multipleSelection = ref([]);

        const multipleTable = ref(null);

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            // return time.getTime() > Date.now();
        };

        // 工单状态
        const workStatus = computed(() => [
            {
                name: proxy.$t("all"), // 待举证
                value: ""
            },
            {
                name: proxy.$t("workReturn.forProof"), // 待举证
                value: 1
            },
            {
                name: proxy.$t("workReturn.waitingPlatformProcessing"), // 等待平台处理中
                value: 2
            },
            {
                name: proxy.$t("workReturn.workOrderClose"), // 工单关闭
                value: 3
            },
            {
                name: proxy.$t("workReturn.theWorkOrderFinished"), // 工单已完毕
                value: 4
            }
            // {
            //     name: proxy.$t("workReturn.theRepairOrderViolations"), // 工单违规
            //     value: 5
            // }
        ]);

        //创建时间
        let timeTypeValue = "createTime";
        let timeTypeName = ref(proxy.$t("createTime"));
        const timeType = computed(() => [
            {
                name: proxy.$t("createTime"), //创建时间
                value: "createTime"
            },
            {
                name: proxy.$t("updateTime"), //更新时间
                value: "updateTime"
            },
            {
                name: proxy.$t("auditTime"), //审核时间
                value: "auditTime"
            },
            {
                name: proxy.$t("putawayTime"), //上架时间
                value: "putawayTime"
            },
            {
                name: proxy.$t("soldoutTime"), //下架时间
                value: "soldoutTime"
            }
        ]);

        const handleCommandTimeType = (item) => {
            console.log("val", item);
            timeTypeValue = item.value;
            timeTypeName.value = item.name;
        };

        // 时间
        const changeDate = (val) => {
            console.log("val", val);
        };

        // table 多选
        const handleSelectionChange = (val) => {
            multipleSelection = val;
        };

        // dialog 图片
        const handleRemove = (file) => {
            console.log(file);
        };
        const handlePictureCardPreview = (file) => {
            console.log("33333333", file);
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        };
        const handleDownload = (file) => {
            console.log(file);
        };

        const onChangeUploadImg_1 = (fileList) => {
            ruleForm.img_1 = fileList; // fileList.map((item) => item.url)
            console.log("formPane3.detailsPics", ruleForm.img_1);
        };

        const onChangeUploadImg_2 = (fileList) => {
            ruleForm.img_2 = fileList; // fileList.map((item) => item.url)
            console.log("formPane3.detailsPics", ruleForm.img_2);
        };

        // 举证dialog
        let orderWorkId = "";
        const takePoof = (val) => {
            dialogFormVisible.value = true;
            orderWorkId = val.id;
        };

        const submitForm = () => {
            let form = {
                workDesc: ruleForm.workDesc,
                orderWorkId: orderWorkId,
                workMustVoucher: "",
                workOptionalVoucher: ""
            };
            form.workMustVoucher = ruleForm.img_1.map((item) => item.url).join(",");
            form.workOptionalVoucher = ruleForm.img_2.map((item) => item.url).join(",");
            ruleFormR.value.validate((valid) => {
                if (valid) {
                    orderReturnAddToProof(form).then((res) => {
                        dialogFormVisible.value = false;
                        proxy.$message.success(res.msg);
                        getData();
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        const resetFormDialgo = () => {
            ruleFormR.value.resetFields();
            dialogFormVisible.value = false;
        };

        // 工单列表
        const getData = () => {
            orderReturnWorkSellerList(searchForm)
                .then((res) => {
                    res.data.records.omsOrderReturnWorks.forEach((v) => {
                        v.workMustVouchers = v.workMustVoucher.split(",");
                        v.workOptionalVouchers = v.workOptionalVoucher.split(",");
                    });
                    tableData.value = res.data.records;
                    pageTotal.value = res.data.total;
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getData();

        // 搜索
        const handelSearch = () => {
            console.log("searchForm", searchForm);

            if (searchForm._tempTime.length > 0) {
                searchForm.beginTime = dayjs(searchForm._tempTime && searchForm._tempTime[0]).format("YYYY-MM-DD HH:mm:ss");
                searchForm.endTime = dayjs(searchForm._tempTime && searchForm._tempTime[1]).format("YYYY-MM-DD HH:mm:ss");
                //searchForm.beginTime = proxy.utils.formatStandardDate(searchForm._tempTime && searchForm._tempTime[0]);
                //searchForm.endTime = proxy.utils.formatStandardDate(searchForm._tempTime && searchForm._tempTime[1]);
            }
            // setTimeout(() => {
            //     delete searchForm[timeTypeValue];
            // }, 2000);
            getData();
        };

        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            getData();
        };

        // 工单数据统计
        let workCount = ref({});
        const getorderReturnWorkListCount = () => {
            orderReturnWorkSellerCount()
                .then((res) => {
                    if (res.data) {
                        workCount.value = res.data;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getorderReturnWorkListCount();

        // 筛选
        const workStatusChange = (val) => {
            searchForm.status = val;
            searchForm.isBeExpire = 0;
            getData();
        };

        // 是否超过期限
        const expireChange = () => {
            pageNum.value = 1;
            searchForm.isBeExpire = 1;
            searchForm.status = "";
            // if (searchForm.isBeExpire == 1) {
            //     searchForm.isBeExpire = 0;
            // } else {
            //     searchForm.isBeExpire = 1;
            // }
            getData();
        };

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            getData();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            getData();
        };

        const closeDialog = () => {
            ruleForm.img_1 = [];
            ruleForm.img_2 = [];
            resetFormDialgo();
        };

        let detailForm = ref({});
        let visible = ref(false);

        // 详情
        const checkDetail = (val) => {
            orderReturnWorkInfoDetail({ workId: val.id })
                .then((res) => {
                    detailForm.value = res.data;
                    detailForm.value.mallMustVoucher = res.data.mallMustVoucher.split(","); // 平台 主要
                    detailForm.value.mallOptionalVoucher = res.data.mallOptionalVoucher.split(","); // 平台 次要
                    detailForm.value.workMustVoucher = res.data.workMustVoucher.split(","); // 用户 必须
                    detailForm.value.workOptionalVoucher = res.data.workOptionalVoucher.split(","); // 用户 次要
                    if (detailForm.value.sellerReturnWorkAlleges.length > 0) {
                        detailForm.value.sellerReturnWorkAlleges.forEach((v) => {
                            v.workMustVoucher = v.workMustVoucher.split(",");
                            v.workOptionalVoucher = v.workOptionalVoucher.split(",");
                        }); // 卖家 主要
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            visible.value = true;
        };

        //导出Excel
        const handleExportExcel = (val) => {
            const loading = proxy.$loading();
            orderReturnWorkSellerListExport(searchForm)
                .then((res) => {
                    exportExcel("Work order management", res);
                    proxy.$message.success(proxy.$t("table.exportSuccess"));
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        };

        return {
            searchFormRef,
            searchForm,
            timeTypeValue,
            handleCommandTimeType,
            timeType,
            handelSearch,
            resetForm,
            changeDate,
            disabledDate,
            shortcuts,
            timeTypeName,
            tableData,
            handleSelectionChange,
            isIndeterminate,
            checkedAll,
            multipleSelection,
            handleCurrentChange,
            handleSizeChange,
            dialogFormVisible,
            ruleForm,
            ruleFormR,
            formLabelWidth,
            labelPosition,
            dialogImageUrl,
            dialogVisible,
            disabled,
            handleRemove,
            handlePictureCardPreview,
            handleDownload,
            rules,
            resetFormDialgo,
            submitForm,
            workStatus,
            workStatusChange,
            multipleTable,
            pageNum,
            pageTotal,
            workCount,
            takePoof,
            onChangeUploadImg_1,
            onChangeUploadImg_2,
            expireChange,
            checkDetail,
            closeDialog,
            detailForm,
            radio,
            visible,
            handleExportExcel
        };
    }
};
</script>

<style lang="scss" scoped>
.dialog_warning {
    height: 31px;
    line-height: 31px;
    background: #fffbe6;
    border-radius: 2px;
    border: 1px solid #ffe58f;
    padding-left: 20px;
}
.el-icon-warning:before {
    color: #faad14;
}
.dialog_btn {
    position: relative;
    bottom: 0px;
    text-align: center;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 59px;
    height: 59px;
}
.tableImg {
    width: 42px;
    height: 42px;
}
</style>
