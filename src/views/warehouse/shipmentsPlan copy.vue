<template>
    <!-- 发补货计划 -->
    <div class="p-25 mb-25 bg-white round-4">
        <BmBreadcrumb />
        <el-form :model="searchForm" ref="searchFormRef" labelPosition="top" class="table-search-form mb-25">
            <el-row :gutter="24">
                <el-col :md="12" :lg="6">
                    <el-form-item prop="type">
                        <template #label>
                            <el-dropdown @command="handleCommand">
                                <span class="green">
                                    {{ typeName }}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item v-for="item in typeList" :key="item.value" :command="item">{{ item.name }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </template>
                        <el-select v-model="searchForm.type" :placeholder="$t('pleaseSelect')">
                            <el-option key="yes" :label="$t('yes')" :value="$t('yes')"> </el-option>
                            <el-option key="no" :label="$t('no')" :value="$t('no')"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item label="品牌" prop="user">
                        <el-input v-model="searchForm.user" :placeholder="$t('pleaseEnter')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :md="12" :lg="6">
                    <el-form-item prop="_tpmTime" label="入账时间">
                        <template #label>
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
                        </template>
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

                <el-col :md="12" :lg="6">
                    <el-form-item prop="type" label="商品信息">
                        <el-select v-model="searchForm.type" :placeholder="$t('pleaseSelect')">
                            <el-option key="yes" :label="$t('yes')" :value="$t('yes')"> </el-option>
                            <el-option key="no" :label="$t('no')" :value="$t('no')"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <div class="table-search-btns">
                <!-- 查询 -->
                <el-button @click="handelSearch" type="primary">{{ $t("search") }}</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm">{{ $t("reset") }}</el-button>
            </div>
        </el-form>
    </div>
    <div class="p-25 bg-white round-4">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="custom-tabs-green">
            <el-tab-pane label="近3个月" name="近3个月">
                <div class="flex between vcenter table_header">
                    <div class="flex vcenter">
                        <!-- 全选 -->
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" @change="handleCheckAllChange" class="mr-15">{{ $t("checkAll") }}</el-checkbox>
                        <span class="ml-15">快速筛选:</span>
                        <el-radio-group v-model="radio" class="ml-15">
                            <el-radio>审核中</el-radio>
                            <el-radio>待发货</el-radio>
                            <el-radio>待收货</el-radio>
                            <el-radio>在运营中心</el-radio>
                            <el-radio>入仓完成</el-radio>
                        </el-radio-group>
                        <div class="ml-30">
                            其他筛选:
                            <el-button plain>草稿</el-button>
                            <el-button plain>驳回</el-button>
                            <el-button plain>已拒签</el-button>
                        </div>
                    </div>
                    <div class="flex"><el-button plain class="ml-15">+添加/发/补货计划</el-button><el-button plain class="ml-15">立即发货</el-button></div>
                </div>
                <div v-for="(item, i) in tableList" :key="i">
                    <div class="flex between table_title vcenter">
                        <div>
                            FBM(2个商品/共6件) <span class="ml-15">订单编号:</span><span class="ml-15"><text>2000334989489384939</text><text class="green ml-15">复制</text></span
                            ><span class="ml-78">下单时间：(GH)07/06/2020 15:30:20</span><span class="ml-25">付款时间：(GH)07/06/2020 15:20:20</span>
                        </div>
                        <div>
                            <span>即将超时发货：03:00:00</span><span style="margin-left: 297px;"><i class="el-icon-monitor"></i></span>
                        </div>
                    </div>
                    <BmTable :data="item.tableData" @selection-change="handleSelectionChange($event, i)" :default-sort="{ prop: 'creatTime', order: 'descending' }" class="mb-20">
                        <BmTableColumn type="selection"> </BmTableColumn>
                        <BmTableColumn prop="date" :label="$t('data')" width="155">
                            <template #default="scope"> {{ scope.row.date }} </template>
                        </BmTableColumn>
                        <BmTableColumn :prop="columnTime" label="姓名"> </BmTableColumn>
                        <BmTableColumn prop="address" label="地址"> </BmTableColumn>
                        <BmTableColumn prop="tag" label="标签"> </BmTableColumn>
                    </BmTable>
                </div>
                <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :total="400"> </BmPagination>
            </el-tab-pane>
            <el-tab-pane label="3个月前" name="3个月前"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
export default {
    setup(props) {
        let { proxy } = getCurrentInstance();
        let searchFormRef = ref("");
        let searchForm = reactive({
            category: "",
            type: "是",
            _tpmTime: [],
            user: ""
        });

        let radio = ref("");

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

        const tableData_2 = ref([
            {
                date: "2016-05-03",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
            },
            {
                date: "2016-05-02",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
            },
            {
                date: "2016-05-04",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
            },
            {
                date: "2016-05-01",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
            },
            {
                date: "2016-05-08",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
            },
            {
                date: "2016-05-06",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
            },
            {
                date: "2016-05-07",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
            }
        ]);

        const typeList = [
            {
                name: "是否带电",
                value: "1"
            },
            {
                name: "是否带电2",
                value: "2"
            }
        ];

        let activeName = ref("近3个月");

        const handleClick = (tab, event) => {
            console.log(tab, event, event.props.target.target.name);
        };

        let tableList = reactive([
            {
                name: "FBM1",
                tableData: [
                    {
                        createTime: "2016-05-02",
                        updateTime: "2016-05-06",
                        date: "2016-05-02",
                        name: "王小虎1",
                        address: "上海市普陀区金沙江路 1518 弄",
                        tag: "家"
                    },
                    {
                        createTime: "2016-05-02",
                        updateTime: "2016-05-06",
                        date: "2016-05-02",
                        name: "王小虎2",
                        address: "上海市普陀区金沙江路 1518 弄",
                        tag: "家"
                    }
                ]
            },
            {
                name: "FBM2",
                tableData: [
                    {
                        createTime: "2016-05-02",
                        updateTime: "2016-05-06",
                        date: "2016-05-02",
                        name: "王小虎1",
                        address: "上海市普陀区金沙江路 1518 弄",
                        tag: "家"
                    },
                    {
                        createTime: "2016-05-02",
                        updateTime: "2016-05-06",
                        date: "2016-05-02",
                        name: "王小虎2",
                        address: "上海市普陀区金沙江路 1518 弄",
                        tag: "家"
                    }
                ]
            }
        ]);

        //全选
        let checkedAll = ref(false);
        let isIndeterminate = ref(false);

        //全选表行
        const multipleTable = ref([]);
        let tableRowsArr = new Array(tableList.length).fill(0);
        const tableRowsList = () =>
            tableList.reduce((total, item) => {
                return total + item.tableData.length;
            }, 0);
        const tableRowsLength = tableRowsList();
        const handleCheckAllChange = (val) => {
            for (let i = 0, len = multipleTable.value.length; i < len; i++) {
                multipleTable.value[i].toggleAllSelection();
            }
        };

        // 表格内全选
        const handleSelectionChange = (rows, index) => {
            console.log("rows", rows);
            tableRowsArr.splice(index, 1, rows.length);
            const checkedCount = tableRowsArr.reduce((total, num) => {
                return total + num;
            }, 0);
            checkedAll.value = checkedCount === tableRowsLength;
            isIndeterminate.value = checkedCount > 0 && checkedCount < tableRowsLength;
        };

        // 表格时间切换
        let columnTime = ref("createTime");
        let columnTimeName = ref(proxy.$t("createTime"));
        const handleCommandColumnTime = (item) => {
            columnTime.value = item.value;
            columnTimeName.value = item.name;
        };

        let typeName = ref("是否带电");
        const handleCommand = (item) => {
            typeName.value = item.name;
        };

        //创建时间
        let timeTypeValue = "createTime";
        let timeTypeName = ref(proxy.$t("createTime"));

        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);
        //禁用今日以后日期
        const disabledDate = (time) => {
            return time.getTime() > Date.now();
        };

        const handleCommandTimeType = (item) => {
            console.log("val", item);
            timeTypeValue = item.value;
            timeTypeName.value = item.name;
        };

        //搜索
        const handelSearch = () => {
            searchForm[timeTypeValue] = [proxy.utils.formatStandardDate(searchForm._tpmTime[0]), proxy.utils.formatStandardDate(searchForm._tpmTime[1])];
            console.log("searchForm", searchForm);
            setTimeout(() => {
                delete searchForm[timeTypeValue];
            }, 2000);
        };

        //重置
        const resetForm = () => {
            searchFormRef.value.resetFields();
            initData();
        };

        const changeDate = (val) => {
            console.log("val", val);
        };

        let currentPage = ref(1);
        const handleCurrentChange = (val) => {
            console.log(`当前页: ${val}`);
        };
        const handleSizeChange = (val) => {
            console.log(`每页 ${val} 条`);
        };

        return {
            searchFormRef,
            searchForm,
            typeList,
            handleCommand,
            disabledDate,
            shortcuts,
            handleCommandTimeType,
            handelSearch,
            resetForm,
            typeName,
            changeDate,
            timeTypeName,
            timeType,
            tableData_2,
            handleSelectionChange,
            currentPage,
            handleCurrentChange,
            handleSizeChange,
            radio,
            activeName,
            handleClick,
            isIndeterminate,
            checkedAll,
            tableList,
            handleCheckAllChange,
            handleCommandColumnTime,
            columnTime,
            columnTimeName
        };
    }
};
</script>

<style lang="scss" scoped>
// .table_header {
//     border: 1px solid #e8e8e8;
//     border-bottom: none;
//     padding: 20px 25px 20px 25px;
// }
// .table_title {
//     border: 1px solid #edebed;
//     border-bottom: none;
//     height: 54px;
//     padding: 20px 25px 20px 25px;
// }
</style>
