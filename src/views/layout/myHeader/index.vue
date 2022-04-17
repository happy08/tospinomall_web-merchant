<template>
    <el-header class="layout-header flex between vcenter">
        <div class="flex vcenter">
            <router-link v-if="['/message/message', '/message/agreement'].includes($route.path)" to="/" class="flex vcenter">
                <img :src="require('@/assets/img/logo.png')" style="height:30px" />
                <span class="ml-15 mr-40 fs-14">Seller Center</span>
            </router-link>
            <i v-else :class="[getSidebarOpened ? 'el-icon-s-unfold' : 'el-icon-s-fold', 'icon']" class="fs-16" @click="toggleSideBar"></i>
            <el-button type="primary" class="ml-25" @click="handleLink">{{ $t("Tools.backOldVersion") }}</el-button>
        </div>

        <ul class="flex vcenter">
            <!-- 功能 -->
            <li class="mr-20 cp">
                <!-- <div @mouseover="mouseOver" @mouseleave="mouseLeave">功能</div> -->
                <el-popover placement="bottom" :width="344" trigger="hover">
                    <template #reference>
                        <div><i class="el-icon-menu" style="font-size: 16px;"></i></div>
                    </template>
                    <div class="tools">
                        <!-- 消息盒子 -->
                        <div v-if="user_info" @click="messageBox" class="item">
                            <div><img src="../../../assets/img/messageBox.png" /></div>
                            <div class="tc">{{ $t("Tools.messageBox") }}</div>
                        </div>
                        <!-- 站内信 -->
                        <div v-if="user_info" @click="openTab(4)" class="item">
                            <div><img src="../../../assets/img/insideLetter.png" /></div>
                            <div class="tc">{{ $t("Tools.message") }}</div>
                        </div>
                        <!-- 帮助中心 -->
                        <div class="item" @click="openTab(3)">
                            <div><img src="../../../assets/img/help.png" /></div>
                            <div class="tc">{{ $t("Tools.helpCenter") }}</div>
                        </div>
                        <!-- 规则中心 -->
                        <div class="item" @click="openTab(2)">
                            <div><img src="../../../assets/img/help.png" /></div>
                            <div class="tc">{{ $t("Tools.ruleCenter") }}</div>
                        </div>
                        <!-- 视频教程 -->
                        <div class="item" @click="openTab(1)">
                            <div><img src="../../../assets/img/videocourse.png" /></div>
                            <div class="tc">{{ $t("Tools.videoCourse") }}</div>
                        </div>
                        <!-- 账户密码 -->
                        <div v-if="user_info" class="item" @click="account">
                            <div><img src="../../../assets/img/userPassword.png" /></div>
                            <div class="tc">{{ $t("Tools.accountPass") }}</div>
                        </div>
                        <!-- 留言反馈 -->
                        <div v-if="user_info" class="item" @click="feedback">
                            <div><img src="../../../assets/img/feedback.png" /></div>
                            <div class="tc">{{ $t("Tools.feedBack") }}</div>
                        </div>
                        <!-- 退出 -->
                        <div v-if="user_info" class="item" @click="logout">
                            <div><img src="../../../assets/img/loginout.png" /></div>
                            <div class="tc">{{ $t("Tools.quit") }}</div>
                        </div>
                    </div>
                </el-popover>
            </li>

            <!-- 消息 -->
            <li v-if="user_info" class="ml-15 mr-30 cp">
                <el-popover placement="bottom" :width="400" trigger="hover" v-model:visible="visible_message">
                    <template #reference>
                        <div @click="closeVisible_message">
                            <el-badge :is-dot="messageTipsList.length > 0" class="badge-item">
                                <i class="el-icon-bell" style="font-size: 16px;"></i>
                            </el-badge>
                        </div>
                    </template>
                    <div>
                        <div class="flex between">
                            <!-- 新消息 -->
                            <span>{{ $t("Tools.NewMessage") }} ({{ messageTipsList.length }})</span>
                        </div>
                        <div class="mt-10 border-top">
                            <div v-for="(item, i) in messageTipsList" :key="i">
                                <div class="mb-5">
                                    <span class="green" style="font-size: 20px;">●</span><span class="ml-10">{{ item.title }}</span>
                                </div>
                                <div class="pl-30" style="color:#999999;">{{ item.content }}</div>
                            </div>
                            <!-- 暂无数据 -->
                            <BmNoData v-if="messageTipsList.length == 0" />
                        </div>
                        <div class="flex between p-10 border-top">
                            <!-- 查看全部 联系客服-->
                            <div>
                                <div v-if="messageTipsList.length > 0" class="item-left cp" @click="messageBox">{{ $t("Tools.checkAll") }}</div>
                            </div>
                            <el-popover placement="bottom" trigger="hover">
                                <template #reference>
                                    <div class="item-right cp">{{ $t("Tools.contactCustomerService") }}</div>
                                </template>
                                Tel:{{ $store.state.app.platform.storeHotline }}
                            </el-popover>
                        </div>
                    </div>
                </el-popover>
            </li>

            <li>
                <el-select v-model="site" @change="handleChangeSite" style="width:180px">
                    <el-option v-for="item in websiteList" :key="item.key" :value="item.key" :label="item.name"> </el-option>
                </el-select>
            </li>
            <!-- 语言 $i18n.availableLocales $i18n.locale-->
            <li class="ml-20">
                <el-select v-model="$i18n.locale" :placeholder="$t('pleaseSelect')">
                    <el-option v-for="item in $store.state.app.langList" :key="`locale-${item}`" :value="item.value" :label="item.label"> </el-option>
                </el-select>
            </li>

            <!-- 用户头像 -->
            <li v-if="user_info" class="flex center ml-20">
                <BmImage :src="$store.state.user.storeInfo.storeLogoUrl || require('@/assets/img/store-default.png')" fit="cover" style="width:25px;height:25px" class="round-999" />
            </li>

            <!-- 用户中心下拉菜单 退出登录 -->
            <li v-if="user_info">
                <el-dropdown>
                    <span class="ml-10 cp">
                        {{ $store.state.user.storeInfo.sellerUser.account }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="logout">{{ $t("Tools.logout") }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </li>
        </ul>
    </el-header>

    <!-- 消息盒子 -->
    <div v-if="user_info" class="dialog_custom">
        <BmDialog v-model:visible="visible" :title="$t('Tools.messageBox')" :width="706" :showFooter="false">
            <div class="flex" style="height: 550px">
                <div class="pt-15 message_left">
                    <el-badge class="message-item"
                        ><div @click="changeCategoryAll" :class="index == 999 ? 'mb-10 cp active' : 'mb-10 cp'">{{ $t("Tools.all") }}</div></el-badge
                    >
                    <el-badge :value="item.msgCount" class="message-item" v-for="(item, i) in category" :key="i">
                        <div :class="index == i ? 'mb-10 cp active' : 'mb-10 cp'" @click="changeCategory(item.id, i)">{{ item.categoryName }}</div>
                    </el-badge>
                </div>
                <div class="pt-15 pl-30 message_right" v-infinite-scroll="load" :infinite-scroll-disabled="flagTotal">
                    <template v-if="messageList.length > 0">
                        <div v-for="(item, i) in messageList" :key="i" class="message_right_item mb-5">
                            <div class="flex between mb-10 pr-30">
                                <div>
                                    <span class="green" style="font-size: 25px;" v-if="item.isRead == 0">●</span>
                                    <span class="ml-20">{{ item.title }}</span>
                                </div>
                                <span>{{ item.sendTime }}</span>
                            </div>
                            <div class="mb-15 pl-30">{{ item.content }}</div>
                            <div class="pl-30">
                                <!-- 标记为已读 查看详情-->
                                <span class="mr-15" v-if="item.isRead == 0"
                                    ><el-button @click="markReaded(item.msgId)">{{ $t("Tools.MarkedRead") }}</el-button></span
                                ><span
                                    ><el-button @click="checkDetail(item.msgId)" v-if="item.type == 2" type="primary">{{ $t("Tools.checkDetail") }}</el-button></span
                                >
                            </div>
                        </div>
                    </template>
                    <div v-else class="message_null">
                        {{ $t("Tools.noData") }}
                    </div>
                </div>
            </div>
        </BmDialog>
    </div>

    <!-- 客服入口 -->
    <div class="layout-fixed-container bg-white">
        <el-popover class="popover" placement="left-start" trigger="hover" :width="250">
            <template #reference>
                <div class="cp flex center p-10 lh-1">
                    <BmIcon name="kefu" color="#3eb5ae" width="30px" height="30px" />
                </div>
            </template>
            <div class="p-20 tc">
                <h2 class="fs-18 black tl">{{ $t("Tools.onlineCustomerService") }}</h2>

                <div class="mt-10 tl pr-20">
                    <span class="light-grey">{{ $t("Tools.onlineCustomerServiceTel") }} </span> <br />{{ $store.state.app.platform.storeHotline }}
                </div>
                <div class="mt-10 tl pr-20">
                    <span class="light-grey">{{ $t("Tools.onlineCustomerServiceEmail") }}</span> <br />{{ $store.state.app.platform.kefuEmail }}
                </div>
                <el-button type="primary" class="mt-20 w-100" @click="handleQimoChat">{{ $t("Tools.contactService") }}</el-button>
            </div>
        </el-popover>
    </div>

    <BmDialog v-model:visible="visible_detail" :title="$t('Tools.detailInfo')" :width="1000" :showFooter="false">
        <div v-html="content"></div>
    </BmDialog>
</template>

<script>
import { useI18n } from "vue-i18n";
import { ref, reactive, computed, onMounted, onUnmounted, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { checkIspc } from "@/utils/";
import storage from "@/utils/storage";
import { sockFindMessageBoxCategoryList, sockFindMsgPage, sockMarkedAsRead, sockMessageFindById } from "@/api/user";

import * as SockJS from "sockjs-client";
import Stomp from "stomp-websocket";
import { config } from "@/utils/axios.js";
export default {
    setup() {
        const { locale } = useI18n();
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        // 用户信息
        const user_info = storage.get("userInfo");

        // 监听语言
        watch(locale, (val) => {
            store.commit("app/CHANGE_LANG", val);
        });

        // 站点
        const site = computed(() => store.state.app.site);
        const websiteList = computed(() => store.state.app.website);
        const handleChangeSite = (key) => {
            websiteList.value.forEach((element) => {
                if (element.key === key) {
                    element.websiteDetails.forEach((item) => {
                        //1:运营后台;2:卖家后台;3:PC商城;4:H5商城
                        if (item.type == 2) {
                            window.open(item.websiteAddress, item.openMode || "_blank");
                        }
                    });
                }
            });
        };

        // socketjs 相关
        let timer = ref(""); // 计时器
        let stompClient = null;
        let socket = null;

        // 铃铛 消息提示面板
        let visible_message = ref(false);

        let messageTipsList = ref([]);

        onMounted(() => {
            //设置icon小图标
            if (store.state.app.platform.salerIcon) {
                let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
                link.type = "image/x-icon";
                link.rel = "shortcut icon";
                link.href = store.state.app.platform.salerIcon;
                document.getElementsByTagName("head")[0].appendChild(link);
            }

            // 客服js
            let customer_service = document.createElement("script");
            let language = locale == "zh-CN" ? "ZHCN" : "EN";
            customer_service.src = `https://ykf-webchat.7moor.com/javascripts/7moorInit.js?accessId=901e5ab0-a659-11ea-a8f2-551f72a1b4b2&autoShow=false&language=${language}`;
            document.head.appendChild(customer_service);

            //如果不是pc端，那就收缩菜单
            if (!checkIspc()) {
                this.toggleSideBar();
            }
            if (user_info && user_info.passUrl) {
                //initWebSocket();
            }
        });

        // 客服js
        const handleQimoChat = () => {
            qimoChatClick();
        };

        onUnmounted(() => {
            disconnect();
        });

        const initWebSocket = () => {
            connection();
            // 断开重连机制,尝试发送消息,捕获异常发生时重连
            timer.value = setInterval(() => {
                try {
                    stompClient.send("test");
                    console.log("test===============");
                } catch (err) {
                    console.log("断线了: " + err);
                    connection();
                }
            }, 5000);
        };

        const connection = () => {
            const token = storage.get("token");
            //const TENANT_ID = "1" //getStore({name: 'tenantId'}) ? getStore({name: 'tenantId'}) : '1'
            const headers = {
                "TENANT-ID": "1",
                Authorization: token
            };
            // 建立连接对象 '/sock/ws'
            let socketUrl = user_info.passUrl.webSocketUrl;
            socket = new SockJS(config.DOMAIN_BASE + config.DOMAIN_API + socketUrl); // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
            // 获取STOMP子协议的客户端对象
            stompClient = Stomp.over(socket);
            stompClient.debug = null;
            // 向服务器发起websocket连接
            stompClient.connect(
                headers,
                () => {
                    // 订阅通道  /task/租户ID/用户名称/remind
                    // let target = `/topic/user/${TENANT_ID}/remind`
                    // let target = "/topic/web"
                    // let target = `/topic/android`
                    let target = user_info.passUrl.clientListenUrl;
                    stompClient.subscribe(target, (msg) => {
                        // 订阅服务端提供的某个topic;
                        proxy.$notify.info({
                            title: "协同提醒",
                            type: "warning",
                            dangerouslyUseHTMLString: true,
                            message: msg.body + "任务，请及时处理",
                            offset: 60
                        });
                        console.log(msg, "1=====================");
                        let info = JSON.parse(JSON.stringify(msg.body));
                        console.log(info, "11111=============================");
                    });
                    let target_2 = user_info.passUrl.subscribeUrl;
                    stompClient.subscribe(target_2, (msg) => {
                        // 订阅服务端提供的某个topic;
                        proxy.$notify.info({
                            title: "协同提醒2",
                            type: "warning",
                            dangerouslyUseHTMLString: true,
                            message: msg.body + "任务，请及时处理",
                            offset: 60
                        });
                        console.log(msg, "2=====================");
                        let info = JSON.parse(JSON.stringify(msg.body));
                        console.log(info, "222222=============================");
                    });
                },
                (err) => {
                    console.log(err);
                }
            );
        };

        const disconnect = () => {
            if (stompClient != null) {
                stompClient.disconnect();
                console.log("Disconnected");
            }
        };

        // 消息盒子
        let visible = ref(false);
        let category = ref([]); // 消息分类

        let visible_detail = ref(false); // 站内信消息内容
        let content = ref("");

        const getSidebarOpened = computed(() => {
            return store.state.app.sidebarOpened;
        });

        //展开或缩小菜单
        const toggleSideBar = () => {
            store.commit("app/TOGGLE_SIDEBAR");
        };

        //退出登录
        const logout = async () => {
            const loading = proxy.$loading();
            try {
                await store.dispatch("user/LogOut");
            } catch (error) {}
            loading.close();
            router.push(`/login`);
        };

        // 获得消息盒子分类
        const getMessageCategere = () => {
            sockFindMessageBoxCategoryList().then((res) => {
                category.value = res.data;
            });
        };
        console.log("user_info", user_info);
        if (user_info) {
            getMessageCategere();
        }

        // class高亮
        let index = ref(999);

        //分页
        let pageNum = ref(0);

        // 分类id
        let categoryId = "";

        // 消息盒子列表
        let messageList = ref([]);

        let flag = false; // 上拉加载

        // 获得消息列表
        let flagTotal = ref(false);

        const getMessage = () => {
            let form = {
                categoryId: categoryId,
                // isRead: "0",
                type: "1",
                pageNum: pageNum.value,
                pageSize: "10"
            };
            sockFindMsgPage(form).then((res) => {
                if (flag) {
                    messageList.value = [...messageList.value, ...res.data.records];
                } else {
                    messageList.value = res.data.records;
                }
                if (res.data.records.length == 0) {
                    flagTotal.value = true;
                }
            });
        };

        // 初始获取
        // const initgetMessage = () => {
        //     console.log(category.value, "=======================");
        //     categoryId = category.value[0].id;
        // }

        // 消息分类选择
        const changeCategory = (id, i) => {
            index.value = i;
            categoryId = id;
            flag = false;
            pageNum.value = 1;
            getMessage();
        };

        // 消息分类 全部 项
        const changeCategoryAll = () => {
            categoryId = "";
            index.value = 999;
            flag = false;
            pageNum.value = 1;
            getMessage();
        };

        // 上拉加载更多
        const load = () => {
            flag = true;
            pageNum.value = pageNum.value + 1;
            getMessage();
        };

        // 标为已读
        const markReaded = (valmsgId) => {
            sockMarkedAsRead({ msgIds: valmsgId }).then((res) => {
                if (res.code == 0) {
                    proxy.$message.success(res.msg);
                    getMessage();
                }
            });
        };

        let visibleTool = ref(false);
        // 工具 显示关闭
        const mouseOver = () => {
            visibleTool.value = true;
        };

        const mouseLeave = () => {
            visibleTool.value = false;
        };

        // 消息 提示面板
        const closeVisible_message = () => {
            visible_message.value = !visible_message.value;
        };

        // 消息盒子 查看全部
        const messageBox = () => {
            visible.value = true;
            messageTipsList.value = [];
        };

        // 消息中心 新tab
        const openTab = (val) => {
            //类型: 1视频分类 2规则中心 3帮助中心
            window.open(window.location.origin + window.location.pathname + `#/message/message?type=${val}`);
        };

        // 查看详情内容
        const checkDetail = (msgId) => {
            let id = msgId;
            sockMessageFindById(id).then((res) => {
                visible_detail.value = true;
                content.value = res.data.content;
            });
        };

        // 留言反馈
        const feedback = () => {
            window.open(window.location.origin + window.location.pathname + `#/message/feedback`);
        };

        const account = () => {
            router.push({ path: "/system/account" });
            //window.open(window.location.origin + window.location.pathname + `#/system/account`);
        };

        //返回旧版
        const handleLink = () => {
            window.open("https://osellers.tospinomall.com.gh");
        };

        return {
            site,
            websiteList,
            handleChangeSite,
            getSidebarOpened,
            toggleSideBar,
            user_info,
            logout,
            visible,
            category,
            changeCategory,
            index,
            load,
            messageList,
            markReaded,
            mouseOver,
            mouseLeave,
            visibleTool,
            visible_message,
            closeVisible_message,
            messageBox,
            openTab,
            timer,
            visible_detail,
            content,
            feedback,
            checkDetail,
            messageTipsList,
            flagTotal,
            changeCategoryAll,
            account,
            handleQimoChat,
            handleLink
        };
    }
};
</script>

<style lang="scss" scoped>
.layout-header {
    position: relative;
    height: 64px;
    line-height: 64px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    background: #ffffff;
}
.dialog_custom {
    /deep/ .el-dialog__body {
        padding: 0px 0px;
    }
}
.active {
    background: #f7f7f7;
    color: #42b7ae;
}
.message_left {
    text-align: center;
    min-width: 150px;
    border-right: 1px solid #e8e8e8;
}

.el-badge {
    display: block;
}
.message-item {
    padding-bottom: 1px;
    height: 42px;
    line-height: 42px;
}
/deep/ .el-badge__content.is-fixed {
    top: 20px;
    background: #ff6666;
    right: 38px;
}
.message_right {
    overflow: auto;
    flex: 1;
    height: 500px;
    // overflow-y:hidden;

    .message_right_item {
        border-bottom: 1px solid #e8e8e8;
        padding-bottom: 5px;
    }

    .message_null {
        text-align: center;
        margin-top: 50px;
        color: #42b7ae;
    }
}
.tools {
    .item {
        float: left;
        margin: 15px 22px;
        width: 60px;
        height: 80px;
        cursor: pointer;
    }
    img {
        width: 60px;
        height: 60px;
    }
}
.tools_display {
    display: none;
}

.badge-item /deep/.el-badge__content.is-fixed {
    right: 5px;
}
.layout-fixed-container {
    position: fixed;
    bottom: 80px;
    right: 0px;
    transform: translateY(-50%);
    height: 50px;
    z-index: 99;
    border: solid 2px rgba(66, 183, 174, 0.1);
}
</style>
