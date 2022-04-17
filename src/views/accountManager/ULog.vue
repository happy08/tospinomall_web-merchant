<template>
    操作日志
    <div class="p-25 mb-25 bg-white round-4">
        <div class="mb-25"><BmBreadcrumb /></div>
        <div>
            <el-form :model="ruleForm" ref="ruleForm" labelPosition="top" label-width="auto" class="demo-ruleForm">
                <el-row :gutter="24">
                    <el-col :md="12" :lg="6">
                        <el-form-item label="操作" prop="">
                            <el-input v-model="operation" placeholder="操作者/操作记录" />
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <el-form-item label="操作日志" prop="">
                            <el-date-picker
                                v-model="tpmTime"
                                @change="changeDate"
                                type="daterange"
                                :start-placeholder="$t('startDate')"
                                range-separator="-"
                                :end-placeholder="$t('endDate')"
                                :shortcuts="shortcuts"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="6">
                        <el-form-item label="   " prop="" class="pt-8">
                            <div><el-button type="primary">查询</el-button><el-button type="primary">重置</el-button></div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
    <div class="p-25 bg-white round-4">
        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="日期" width="120">
                <template #default="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
        </el-table>
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :total="400"> </BmPagination>
    </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";
import { dateShortcuts } from "@/utils/dateShortcuts";
export default {
    name: "ULog",
    setup(props) {
        let { proxy } = getCurrentInstance();
        let operation = ref("");
        let tpmTime = ref([]);
        //快捷日期选项
        const shortcuts = dateShortcuts(proxy);

        let ruleForm = ref({
            name: "",
            region: "",
            date1: "",
            date2: "",
            delivery: false,
            type: [],
            resource: "",
            desc: ""
        });

        let tableData = ref([
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

        let multipleSelection = ref([]);

        const handleSelectionChange = (val) => {
            this.multipleSelection = val;
        };

        let currentPage = ref(1);
        const handleCurrentChange = (val) => {
            console.log(`当前页: ${val}`);
        };
        const handleSizeChange = (val) => {
            console.log(`每页 ${val} 条`);
        };

        const submitForm = (formName) => {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        };

        const resetForm = (formName) => {
            this.$refs[formName].resetFields();
        };

        const changeDate = (val) => {
            console.log("val", val);
        };

        return {
            currentPage,
            handleCurrentChange,
            handleSizeChange,
            multipleSelection,
            tableData,
            handleSelectionChange,
            ruleForm,
            submitForm,
            resetForm,
            operation,
            changeDate,
            tpmTime,
            shortcuts
        };
    }
};
</script>

<style></style>
