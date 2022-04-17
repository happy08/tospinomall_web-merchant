<template>
    分组权限
    <div class="p-25 mb-25 bg-white round-4">
        <div class="mb-25"><BmBreadcrumb /></div>
    </div>
    <div class="p-25 bg-white round-4">
        <BmBaseTitle title="分组权限" />
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
    setup(props) {
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
            currentPage,
            handleCurrentChange,
            handleSizeChange,
            multipleSelection,
            tableData,
            handleSelectionChange
        };
    }
};
</script>

<style></style>
