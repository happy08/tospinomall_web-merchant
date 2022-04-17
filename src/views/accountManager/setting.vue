<template>
    账户设置
    <div class="p-25 mb-25 bg-white round-4">
        <div class="mb-25"><BmBreadcrumb /></div>
        <el-radio-group v-model="radio" class="mb-25">
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="3">禁用</el-radio-button>
            <el-radio-button label="4">回收站</el-radio-button>
        </el-radio-group>
        <BmAlert title="重要提示：店铺名称、店铺简介、店铺logo会直接展示给买家，请认真填写" icon="warning" />
    </div>
    <div class="p-25 bg-white round-4">
        <div class="flex between table_title">
            <div class="flex vcenter">
                <span>账号/用户名</span>
                <span>
                    <el-input v-model="account" placeholder="请输入" class="ml-15" style="width: 321px;">
                        <template #append>
                            <el-button icon="el-icon-search"></el-button>
                        </template>
                    </el-input>
                </span>
            </div>
            <div><el-button type="primary">+添加子账号</el-button></div>
        </div>
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
import { ref, reactive } from "vue";
export default {
    name: "setting",
    setup(props) {
        let radio = "1";
        let account = "";
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

        return {
            multipleSelection,
            tableData,
            radio,
            account,
            handleSelectionChange,
            currentPage,
            handleCurrentChange,
            handleSizeChange
        };
    }
};
</script>

<style lang="scss" scoped>
.table_title {
    padding: 20px 25px 20px 15px;
}
</style>
