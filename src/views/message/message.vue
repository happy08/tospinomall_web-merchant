<template>
    <div class="login-wrap">
        <el-container>
            <el-header class="bg-white">
                <MyHeader />
            </el-header>
            <el-container class="index-container">
                <!-- 左侧栏 -->
                <el-aside width="auto" style="min-width: 240px">
                    <el-menu @open="handleOpen" @close="handleClose" style="min-height: 300px" class="round-4" :uniqueOpened="true">
                        <el-menu-item @click="getPageListAll" class="fw">
                            {{
                                type == 1
                                    ? $t("sellerCenter.videoList")
                                    : type == 2
                                    ? $t("sellerCenter.ruleList")
                                    : type == 3
                                    ? $t("sellerCenter.helpList")
                                    : type == 4
                                    ? $t("sellerCenter.message")
                                    : ""
                            }}
                        </el-menu-item>
                        <template v-for="(items, i) in dataList" :key="i">
                            <el-menu-item v-if="items.children == undefined || items.children.length === 0" @click="getHelpPageList(items.id)">
                                {{ items.categoryName }} ({{ items.msgCount ? items.msgCount : items.count }})
                            </el-menu-item>

                            <el-submenu v-else v-for="(item, index) in items.children" :key="index" :index="item.id">
                                <template #title>
                                    <span>{{ items.categoryName }} ({{ items.msgCount ? items.msgCount : items.count }})</span>
                                </template>
                                <el-menu-item @click="getHelpPageList(item.id)" :index="item.id"> {{ item.categoryName }} ({{ items.msgCount ? items.msgCount : items.count }}) </el-menu-item>
                            </el-submenu>
                        </template>
                    </el-menu>
                </el-aside>

                <el-main>
                    <div class="main-right p-25 bg-white round-4" v-if="!visible">
                        <!--1"视频列表" 2"规则列表" 3"帮助中心" -->
                        <div v-if="type == 2 || type == 3 || type == 1">
                            <div class="header flex vcenter between mb-40">
                                <div class="flex vcenter">
                                    <span class="title">{{ type == 1 ? $t("sellerCenter.videoList") : type == 2 ? $t("sellerCenter.ruleList") : type == 3 ? $t("sellerCenter.helpList") : "" }}</span>
                                    <span class="mlr-15 red">{{ count }}</span>
                                </div>
                                <div class="flex vcenter">
                                    <el-input :placeholder="$t('pleaseEnter')" suffix-icon="el-icon-search" v-model="title" style="width: 300px" @keyup.enter.native="onSearch"> </el-input>
                                </div>
                            </div>
                            <div class="wrap-content">
                                <div @click="checkDetail(item)" class="flex between vcenter item cp" v-for="(item, i) in categoryList" :key="i">
                                    <div class="flex vcenter">
                                        <span class="green">●</span><span class="ml-15">{{ item.title }}</span>
                                    </div>
                                    <div class="flex vcenter">{{ $t("sellerCenter.UpdateTime") }}{{ item.updateTime }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 站内信 -->
                        <div v-else>
                            <div class="header flex vcenter between mb-40">
                                <div class="flex vcenter">
                                    <!-- 站内信 -->
                                    <span class="title">{{ $t("sellerCenter.message") }}</span>
                                    <span class="ml-15">{{ $t("sellerCenter.common", { num: msgAllTotal }) }} </span>，
                                    <span>{{ $t("sellerCenter.UnreadMail") }}</span>
                                    <span class="red">{{ unReadMsgTotal }}</span>
                                </div>
                                <div class="flex vcenter">
                                    <!-- 信件状态 -->
                                    <span>{{ $t("sellerCenter.mailStatus") }}</span>
                                    <span class="mlr-15">
                                        <el-select @change="emilStatusChange" v-model="isRead" :placeholder="$t('pleaseSelect')">
                                            <el-option :label="$t('sellerCenter.all')" value=""></el-option>
                                            <el-option :label="$t('sellerCenter.yes')" value="1"></el-option>
                                            <el-option :label="$t('sellerCenter.no')" value="0"></el-option>
                                        </el-select>
                                    </span>
                                    <!-- 标为已读 -->
                                    <el-button @click="flagisRead" plain>{{ $t("sellerCenter.MarkedRead") }}</el-button>
                                </div>
                            </div>
                            <BmTable ref="multipleTable" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
                                <BmTableColumn type="selection"> </BmTableColumn>
                                <BmTableColumn prop="isRead" :label="$t('sellerCenter.readNoRead')" align="center" width="100">
                                    <template #header>
                                        <img class="table-image" src="../../assets/img/activeEmail.png" />
                                    </template>
                                    <template #default="scope">
                                        <img v-if="scope.row.isRead == 1" class="table-image" src="../../assets/img/hiddenEmail.png" />
                                        <img v-if="scope.row.isRead == 0" class="table-image" src="../../assets/img/activeEmail.png" />
                                    </template>
                                </BmTableColumn>
                                <BmTableColumn prop="title" :label="$t('sellerCenter.theme')">
                                    <template #default="scope">
                                        <!-- 查看信件 -->
                                        <div class="cp" @click="checkEmail(scope.row)">{{ scope.row.title }}</div>
                                    </template>
                                </BmTableColumn>
                                <BmTableColumn prop="sendTime" :label="$t('sellerCenter.time')" align="center" width="150"></BmTableColumn>
                            </BmTable>
                        </div>
                        <div class=" ptb-15">
                            <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :total="pageTotal"> </BmPagination>
                        </div>
                    </div>
                    <div class="content-detail bg-white round-4" v-if="visible">
                        <div v-if="type == 2 || type == 3 || type == 4" v-html="content"></div>
                        <div v-else>
                            <div class="mb-30 pl-20 fzw">{{ categoryName }}</div>
                            <div class="mb-20 pl-20">{{ videoTitle }}</div>
                            <video style="width: 500px;height: 500px;" :src="videoUrl" controls></video>
                        </div>

                        <el-button @click="visible = !visible" class="mt-20">Back></el-button>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import { mapGetters } from "vuex";
import MyHeader from "../layout/myHeader/";
import {
    basicsFindRuleList,
    basicsFindMmsSellerRulesHelpPage,
    basicsFindVideoList,
    basicsFindHelpList,
    sockMessageFindMsgCategoryList,
    sockMessageFindMsgPage,
    sockMessageFindById,
    sockMarkedAsRead
} from "@/api/user";

export default {
    name: "message",
    components: { MyHeader },
    computed: {
        ...mapGetters({
            getRouters: "router/getRouters",
            getSidebarOpened: "app/getSidebarOpened"
        })
    },
    setup(props) {
        const route = useRoute();
        const { proxy } = getCurrentInstance();

        let type = ref("");

        type.value = route.query.type;

        const handleOpen = (key, keyPath) => {
            console.log(key, keyPath);
        };
        const handleClose = (key, keyPath) => {
            console.log(key, keyPath);
        };

        //分页
        let pageNum = ref(1),
            pageSize = "10",
            pageTotal = ref(0);

        // 详情
        let visible = ref(false);

        // 消息内容
        let content = ref();

        // 视频内容
        let videoUrl = ref();
        let title = ref(); // 视频标题
        let categoryName = ref(); // 分类名称

        // 搜索关键字
        let videoTitle = ref();

        // 消息统计
        let count = ref("0");

        let msgAllTotal = ref(0); // 总的站内信
        let unReadMsgTotal = ref(0); // 站内信未读数
        let isRead = ref(); // 是否已读

        let dataList = ref([]); // 规则 视频 帮助 站内信

        // 获得分类
        const getRulesList = () => {
            const loading = proxy.$loading();
            //debugger;
            if (route.query.type == 1) {
                // 视频
                basicsFindVideoList()
                    .then((res) => {
                        dataList.value = res.data;
                        loading.close();
                    })
                    .catch(() => {
                        loading.close();
                    });
            } else if (route.query.type == 2) {
                // 规则
                basicsFindRuleList()
                    .then((res) => {
                        dataList.value = res.data;
                        loading.close();
                    })
                    .catch(() => {
                        loading.close();
                    });
            } else if (route.query.type == 3) {
                // 帮助
                basicsFindHelpList()
                    .then((res) => {
                        dataList.value = res.data;
                        loading.close();
                    })
                    .catch(() => {
                        loading.close();
                    });
            } else {
                // 站内信
                sockMessageFindMsgCategoryList()
                    .then((res) => {
                        dataList.value = res.data.messageCategoryList;
                        msgAllTotal.value = res.data.msgAllTotal;
                        unReadMsgTotal.value = res.data.unReadMsgTotal;
                        loading.close();
                    })
                    .catch(() => {
                        loading.close();
                    });
            }
        };
        getRulesList();

        let categoryList = ref([]);
        let tableData = ref([]);

        let categoryid = ""; // 分类id
        // 获得分类列表
        const getHelpPageList = (id) => {
            if (id) {
                categoryid = id;
            }

            visible.value = false;
            pageNum.value = 1;
            let form = {
                categoryId: categoryid,
                startTime: "",
                endTime: "",
                pageNum: pageNum.value,
                pageSize: pageSize,
                status: "1", // 状态：1：启用，0：禁用
                title: title.value, // 搜索
                type: type.value // 类型: 1视频分类 2规则中心 3帮助中心
            };

            if (route.query.type == 4) {
                let form2 = {
                    categoryId: categoryid,
                    isRead: isRead.value,
                    pageNum: pageNum.value,
                    pageSize: pageSize
                };
                sockMessageFindMsgPage(form2).then((res) => {
                    tableData.value = res.data.records;
                    pageTotal.value = res.data.total;
                });
            } else {
                basicsFindMmsSellerRulesHelpPage(form).then((res) => {
                    categoryList.value = res.data.records;
                    pageTotal.value = res.data.total;
                    count.value = res.data.total;
                });
            }
        };
        getHelpPageList();

        // 获得全部分类列表
        const getPageListAll = () => {
            title.value = "";
            visible.value = false;
            categoryid = "";
            pageNum.value = 1;
            getHelpPageList();
        };

        //当前页
        const handleCurrentChange = (val) => {
            pageNum.value = val;
            getHelpPageList();
        };
        //每页n条
        const handleSizeChange = (val) => {
            pageNum.value = 1;
            pageSize = val;
            getHelpPageList();
        };

        // 搜索
        const onSearch = (e) => {
            pageNum.value = 1;
            getHelpPageList();
        };

        // 查看消息详情
        const checkDetail = (val) => {
            visible.value = true;

            if (route.query.type == 2 || route.query.type == 3) {
                content.value = val.content;
            } else {
                videoUrl.value = val.url;
                videoTitle.value = val.title;
                categoryName.value = val.categoryName;
            }
        };

        //选中的行
        let tableSelectionRows = [];
        const handleSelectionChange = (rows) => {
            tableSelectionRows = rows;
        };

        // 查看站内信
        const checkEmail = (row) => {
            let id = row.msgId;
            sockMessageFindById(id).then((res) => {
                visible.value = true;
                content.value = res.data.content;

                // 标为已读
                if (row.isRead == 1) {
                    return;
                }
                row.isRead = 1;
                sockMarkedAsRead({ msgIds: id })
                    .then((res) => {})
                    .catch(() => {});
            });
        };

        // 信件状态
        const emilStatusChange = () => {
            pageNum.value = 1;
            getHelpPageList();
        };

        // 标为已读
        const flagisRead = () => {
            if (tableSelectionRows.length == 0) {
                proxy.$message.error(proxy.$t("table.selectLeastOne"));
                return;
            }
            let Ids = tableSelectionRows.map((v) => v.msgId).join(",");
            sockMarkedAsRead({ msgIds: Ids }).then((res) => {
                proxy.$message.success(res.msg);
                getHelpPageList();
            });
        };

        return {
            handleOpen,
            handleClose,
            dataList,
            getHelpPageList,
            pageTotal,
            pageNum,
            categoryList,
            handleCurrentChange,
            handleSizeChange,
            title,
            onSearch,
            count,
            visible,
            checkDetail,
            content,
            type,
            videoUrl,
            videoTitle,
            categoryName,
            handleSelectionChange,
            msgAllTotal,
            unReadMsgTotal,
            isRead,
            checkEmail,
            tableData,
            emilStatusChange,
            flagisRead,
            getPageListAll
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
<style lang="scss" scoped>
.login-wrap {
    position: relative;
    background-color: #f2f2f2;
    min-height: 100vh;
}
.index-container {
    width: 1200px;
    margin: 0 auto;
    padding-top: 20px;
}
.el-main {
    padding-top: 0;
}

.el-main::-webkit-scrollbar {
    display: none;
}

.el-menu--collapse {
    min-width: 200px;
}

/deep/.el-menu--collapse > .el-menu-item span,
.el-menu--collapse > .el-submenu > .el-submenu__title span {
    visibility: inherit;
    display: inline;
}

.wrap-content::-webkit-scrollbar {
    display: none;
}

.main-right {
    overflow: hidden;
    min-width: 900px;
    // height: 800px;
    .header {
        // padding-right: 100px;
        .title {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 22px;
        }
    }

    .wrap-content {
        overflow-x: hidden;

        .item {
            padding-left: 44px;
            margin-bottom: 32px;
            padding-right: 100px;
        }
    }
}

.layout-wrapper {
    min-height: 100vh;
    transition: margin-left 0.28s;
    margin-left: 210px;
    position: relative;
}
.content-detail {
    min-height: 200px;
    padding: 20px;
}

.table-image {
    width: 16px;
    height: 16px;
}
</style>
<style>
.content-detail img {
    max-width: 100%;
}
</style>
