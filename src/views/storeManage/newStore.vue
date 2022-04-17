<template>
    创建店铺装修
    <div class="p-25 mb-25 bg-white round-4">
        <div class="mb-25"><BmBreadcrumb /></div>
        <el-radio-group v-model="radio" class="mb-25">
            <el-radio-button label="0">移动端</el-radio-button>
            <el-radio-button label="1">PC端</el-radio-button>
        </el-radio-group>
    </div>
    <div class="p-25 bg-white round-4">
        <div class="mb-25"><el-button type="primary">创建新页面</el-button></div>
        <div class="flex between item mb-25">
            <div class="flex vcenter">
                <div class="flex vcenter after">
                    <svg class="icon" aria-hidden="true" style="width: 2em;height: 2em;">
                        <use xlink:href="#icondian"></use>
                    </svg>
                    <span>使用中</span>
                </div>
                <div class="ml-25 account">
                    <div class="mb-25"><span class="name">Tospino-APP店铺</span><i class="el-icon-edit-outline ml-25"></i></div>
                    <div><span>编辑账号: Pig001</span><span class="ml-86">更新时间: 2020-02-02</span></div>
                </div>
            </div>
            <div class="green item_right">
                <div @click="release" class="cp mb-8">立即发布</div>
                <div class="cp mb-8">装修</div>
                <div class="cp mb-8">预览</div>
                <div>删除</div>
            </div>
        </div>
        <div class="flex between item mb-25">
            <div class="flex vcenter">
                <div class="flex vcenter after">
                    <svg class="icon" aria-hidden="true" style="width: 2em;height: 2em;color: #FF8248;">
                        <use xlink:href="#icondian"></use>
                    </svg>
                    <span v-if="false">使用中</span><span v-else>草稿</span>
                </div>
                <div class="ml-25 account">
                    <div class="mb-25"><span class="name">Tospino-APP店铺</span><i class="el-icon-edit-outline ml-25"></i></div>
                    <div><span>编辑账号: Pig001</span><span class="ml-86">更新时间: 2020-02-02</span></div>
                </div>
            </div>
            <div class="green item_right">
                <div @click="release" class="cp mb-8">立即发布</div>
                <div class="cp mb-8">装修</div>
                <div class="cp mb-8">预览</div>
                <div>删除</div>
            </div>
        </div>
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :total="400"> </BmPagination>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
export default {
    name: "newStore",
    setup(props) {
        let radio = ref("0");

        const release = () => {
            console.log("333");
        };

        let currentPage = ref(1);
        const handleCurrentChange = (val) => {
            console.log(`当前页: ${val}`);
        };
        const handleSizeChange = (val) => {
            console.log(`每页 ${val} 条`);
        };

        return {
            radio,
            release,
            currentPage,
            handleCurrentChange,
            handleSizeChange
        };
    }
};
</script>

<style lang="scss" scoped>
.item {
    width: 1210px;
    background: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
}
.after::after {
    content: "";
    display: block;
    width: 2px;
    height: 58px;
    background: #e8e8e8;
    margin-left: 20px;
}
.name {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
}
.account {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 17px;
}
.item_right {
    border-left: 1px solid #e8e8e8;
    width: 90px;
    text-align: center;
    padding: 10px 10px;
}
.el-icon-edit-outline:before {
    color: #42b7ae;
}
</style>
