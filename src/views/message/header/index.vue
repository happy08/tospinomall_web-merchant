<template>
    <el-header class="layout-header flex between vcenter" style="padding: 0px;">
        <div class="flex center">
            <img src="../../../assets/img/logo2.png" />
            <span class="ml-15 mr-40 fs-14">Seller Center</span>
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
                        <div v-if="user_info" @click="messageBox" class="item">
                            <div><img src="../../../assets/img/messageBox.png" /></div>
                            <div class="tc">消息盒子</div>
                        </div>
                        <div v-if="user_info" @click="openTab(4)" class="item">
                            <div><img src="../../../assets/img/insideLetter.png" /></div>
                            <div class="tc">站内信</div>
                        </div>
                        <div class="item" @click="openTab(3)">
                            <div><img src="../../../assets/img/help.png" /></div>
                            <div class="tc">帮助中心</div>
                        </div>
                        <div class="item" @click="openTab(2)">
                            <div><img src="../../../assets/img/rules.png" /></div>
                            <div class="tc">规则中心</div>
                        </div>
                        <div class="item" @click="openTab(1)">
                            <div><img src="../../../assets/img/videocourse.png" /></div>
                            <div class="tc">视频教程</div>
                        </div>
                        <div v-if="user_info" class="item">
                            <div><img src="../../../assets/img/userPassword.png" /></div>
                            <div class="tc">账户密码</div>
                        </div>
                        <div v-if="user_info" class="item" @click="feedback">
                            <div><img src="../../../assets/img/feedback.png" /></div>
                            <div class="tc">留言反馈</div>
                        </div>
                        <div v-if="user_info" class="item" @click="logout">
                            <div><img src="../../../assets/img/loginout.png" /></div>
                            <div class="tc">退出</div>
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
                <el-select v-model="location" @change="handleChangeLocation">
                    <el-option v-for="item in locationList" :key="item.value" :value="item.value" :label="item.label"> </el-option>
                </el-select>
            </li>
            <li class="ml-20">
                <el-select v-model="$i18n.locale">
                    <el-option v-for="item in $i18n.availableLocales" :key="`locale-${item}`" :value="item" :label="Language(item)"> </el-option>
                </el-select>
            </li>
        </ul>
    </el-header>

    <!-- 消息盒子 -->
    <div v-if="user_info" class="dialog_custom">
        <BmDialog v-model:visible="visible" title="消息盒子" :width="706" :showFooter="false">
            <div class="flex" style="height: 550px">
                <div class="pt-15 message_left">
                    <el-badge class="message-item"><div @click="changeCategoryAll" :class="index == 999 ? 'mb-10 cp active' : 'mb-10 cp'">全部</div></el-badge>
                    <el-badge :value="item.msgCount" class="message-item" v-for="(item, i) in category" :key="i">
                        <div :class="index == i ? 'mb-10 cp active' : 'mb-10 cp'" @click="changeCategory(item.id, i)">{{ item.categoryName }}</div>
                    </el-badge>
                </div>
                <div class="pt-15 pl-30 message_right" v-infinite-scroll="load" :infinite-scroll-disabled="flagTotal">
                    <div v-if="messageList.length > 0" v-for="(item, i) in messageList" :key="i" class="message_right_item mb-5">
                        <div class="flex between mb-10 pr-30">
                            <div>
                                <span class="green" style="font-size: 25px;" v-if="item.isRead == 0">●</span>
                                <span class="ml-20">{{ item.title }}</span>
                            </div>
                            <span>{{ item.sendTime }}</span>
                        </div>
                        <div class="mb-15 pl-30">{{ item.content }}</div>
                        <div class="pl-30">
                            <span><el-button @click="markReaded(item.msgId)">标记为已读</el-button></span
                            ><span class="ml-15"><el-button @click="checkDetail(item.msgId)" v-if="item.type == 2" type="primary">查看详情</el-button></span>
                        </div>
                    </div>
                    <div v-else class="message_null">
                        空空如也 ~
                    </div>
                </div>
            </div>
        </BmDialog>
    </div>

    <BmDialog v-model:visible="visible_detail" title="详细内容" :width="1000" :showFooter="false">
        <div v-html="content" style="height: 500px;"></div>
    </BmDialog>
</template>

<script>
import { useI18n } from "vue-i18n";
import { ref, reactive, computed, onUnmounted, watch, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

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

        // socketjs 相关
        let timer = ref(""); // 计时器
        let stompClient = null;
        let socket = null;

        // 铃铛 消息提示面板
        let visible_message = ref(false);

        let messageTipsList = ref([]);

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

        // 用户信息
        const user_info = storage.get("userInfo"); //store.state.user.userInfo;

        //登录了
        if (user_info && user_info.passUrl) {
            initWebSocket();
        }

        function connection() {
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
                    let target = user_info.passUrl.clientListenUrl;
                    stompClient.subscribe(target, (msg) => {
                        // 订阅服务端提供的某个topic;
                        proxy.$notify.info({
                            title: "协同提醒",
                            type: "info",
                            dangerouslyUseHTMLString: true,
                            message: msg.body + "任务，请及时处理",
                            offset: 60
                        });
                        console.log(msg, "1=====================");
                    });

                    let target_2 = user_info.passUrl.subscribeUrl;
                    stompClient.subscribe(target_2, (msg) => {
                        // 订阅服务端提供的某个topic;
                        // proxy.$notify({
                        //     title: '协同提醒2',
                        //     type: 'warning',
                        //     dangerouslyUseHTMLString: true,
                        //     message: msg.body + '任务，请及时处理',
                        //     offset: 60
                        // })
                        let info = JSON.parse(msg.body);
                        messageTipsList.value.push(info);
                    });
                },
                (err) => {
                    console.log(err);
                }
            );
        }

        const disconnect = () => {
            if (stompClient != null) {
                stompClient.disconnect();
            }
        };

        // 消息盒子
        let visible = ref(false);
        let category = ref([]); // 消息分类

        let visible_detail = ref(false); // 站内信 消息详细内容
        let content = ref("");

        const location = ref("https://www.baidu.com");
        const locationList = reactive([
            {
                label: "加纳",
                value: "https://www.baidu.com"
            },
            {
                label: "越南",
                value: "https://vue3js.cn/"
            }
        ]);
        const handleChangeLocation = () => {
            window.open(location.value, "_self");
        };

        watch(
            locale,
            (val) => {
                store.commit("app/CHANGE_LANG", val);
                storage.set("language", val);
            },
            {
                immediate: true
            }
        );

        const Language = (val) => {
            switch (val) {
                case "zh-CN":
                    return "中文";
                case "en":
                    return "English";
                default:
                    return "English";
            }
        };

        const getSidebarOpened = computed(() => {
            return store.state.app.sidebarOpened;
        });

        //退出登录
        const logout = async () => {
            await store.dispatch("user/LogOut");
            router.push(`/login`);
        };

        // 获得消息盒子分类
        const getMessageCategere = () => {
            sockFindMessageBoxCategoryList().then((res) => {
                category.value = res.data;
            });
        };
        //getMessageCategere();

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
                isRead: "0",
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
            // flagTotal.value = true;
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
        // 工具面板 显示关闭
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
            window.open(window.location.origin + window.location.pathname + `/#/message/message?type=${val}`);
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
            window.open(window.location.origin + window.location.pathname + `/#/message/feedback`);
        };

        onUnmounted(() => {
            disconnect();
        });

        return {
            user_info,
            locale,
            location,
            locationList,
            handleChangeLocation,
            Language,
            getSidebarOpened,
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
            changeCategoryAll
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
    width: 344px;
    height: 400px;
    padding: 35px 35px 35px 0px;
    display: flex;
    flex-wrap: wrap;

    .item {
        margin-left: 35px;
        width: 59px;
        height: 80px;
        cursor: pointer;
    }
    img {
        width: 59px;
        height: 59px;
    }
}
.tools_display {
    display: none;
}

.badge-item /deep/.el-badge__content.is-fixed {
    right: 5px;
}
</style>
