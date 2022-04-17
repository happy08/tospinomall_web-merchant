<template>
    <BmDialog v-model:visible="visible" :title="$t('storeDesign.goodsLink')" :confirm="confirm" :cancel="cancel" :width="700">
        <!-- 商品链接 -->

        <el-form :model="searchForm" :inline="true" label-width="auto">
            <el-form-item :label="$t('goodsListTable.goodsInfo')" prop="keyword">
                <el-input v-model="searchForm.keyword" placeholder="Title / TSIN"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleSearch" icon="el-icon-search" type="primary"></el-button>
                <el-button @click="handleReloadData" icon="el-icon-refresh"></el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="goods-content custom-scrollbar">
            <el-col v-for="(item, index) in goodsList" :key="index" :span="12">
                <div @click="handleSelectGoods(item)" class="goods-item flex mb-10 p-5 border round-4 fs-12" :class="{ current: item.current }">
                    <div class="img">
                        <BmImage :src="item.mainPictureUrl" fit="cover" style="width:100%;height:100%" />
                    </div>
                    <div class="ml-10">
                        <div class="hidden-2 lh-12" style="height:28px">{{ item.goodTitle }}</div>
                        <!-- <div>TSIN：{{ item.tsin }}</div> -->
                        <div>{{ $store.state.app.currencySymbol }}{{ item.minPrice }}</div>
                    </div>
                    <i class="el-icon-check"></i>
                </div>
            </el-col>
        </el-row>
        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
    </BmDialog>
</template>

<script>
import { getCurrentInstance, inject, reactive, ref } from "vue";
import { goodsSellerList } from "@/api/storeDesign";

export default {
    name: "selectionLinkUrl",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        config: Object
    },
    emits: ["change", "update:visible"],
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance();
        const isMobile = inject("isMobile");

        //分页
        let pageNum = ref(1),
            pageSize = 10,
            pageTotal = ref(0);

        //搜索
        let searchForm = reactive({
            keyword: "",
            saleStatus: 1, //售卖状态：0->不在售中 1->售卖中
            pageNum,
            pageSize
        });
        const handleSearch = () => {
            getGoodsSellerList();
        };
        const handleReloadData = () => {
            getGoodsSellerList();
        };

        //商品列表
        let goodsList = ref([]);
        const getGoodsSellerList = () => {
            goodsSellerList(searchForm)
                .then((res) => {
                    pageTotal.value = res.data.total;
                    goodsList.value = res.data.records;
                    console.log("props.config", props.config);
                    //选中
                    for (let i = 0, length = goodsList.value.length; i < length; i++) {
                        if (props.config.goodsId === goodsList.value[i].id) {
                            curGoods.value = goodsList.value[i];
                            goodsList.value[i].current = true;
                        }
                    }
                })
                .catch((err) => {});
        };
        getGoodsSellerList();

        //选择商品
        let curGoods = ref({});
        const handleSelectGoods = (item) => {
            if (item.current === true) {
                item.current = false;
                curGoods.value = {};
                return;
            }
            for (let i = 0, length = goodsList.value.length; i < length; i++) {
                goodsList.value[i].current = false;
            }
            curGoods.value = item;
            item.current = true;
        };

        //当前页
        const handleCurrentChange = (val) => {
            searchForm.pageNum = val;
            getGoodsSellerList();
        };
        //每页n条
        const handleSizeChange = (val) => {
            searchForm.pageNum = 1;
            searchForm.pageSize = val;
            getGoodsSellerList();
        };

        const confirm = () => {
            //0=商品链接
            props.config.imageLinkType = 0;
            props.config.goodsId = curGoods.value.id || "";
            props.config.goodsTitle = curGoods.value.goodTitle || "";

            // for (let i = 0, length = goodsList.value.length; i < length; i++) {
            //     goodsList.value[i].current = false;
            // }

            emit("update:visible", false);
        };

        const cancel = () => {
            emit("update:visible", false);
        };
        return {
            searchForm,
            handleSearch,
            handleReloadData,
            goodsList,
            handleSelectGoods,
            pageNum,
            pageSize,
            pageTotal,
            handleCurrentChange,
            handleSizeChange,

            confirm,
            cancel
        };
    }
};
</script>
<style lang="scss" scoped>
.goods-content {
    max-height: 375px;
    overflow: auto;

    .goods-item {
        position: relative;
        .el-icon-check {
            position: absolute;
            bottom: -1px;
            right: -1px;
            padding: 4px 2px 2px;
            font-size: 12px;
            background-color: #42b7ae;
            color: #ffffff;
            border-radius: 20px 0 4px 0;
            opacity: 0;
        }

        &.current {
            border-color: #42b7ae;
            .el-icon-check {
                opacity: 1;
            }
        }
        .img {
            flex: 0 0 50px;
            width: 50px;
            height: 50px;
        }
    }
}
</style>
