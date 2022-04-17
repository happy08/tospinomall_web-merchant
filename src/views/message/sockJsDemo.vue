<template>
    <div>demo</div>
</template>

<script>
import { ref, reactive, unref, getCurrentInstance, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import * as SockJS from "sockjs-client";
import Stomp from "stomp-websocket";
import { config } from "@/utils/axios.js";
import storage from "@/utils/storage";
export default {
    data() {
        return {
            // 刷新token锁
            refreshLock: false,
            // 刷新token的时间
            refreshTime: "",
            // 计时器
            timer: "",
            userInfo: {}
        };
    },
    created() {
        // 实时检测刷新token
        // this.refreshToken()
    },
    // destroyed() {
    //     clearInterval(this.refreshTime)
    //     clearInterval(this.timer)
    //     /*
    //     * 默认关闭websocket，如需工作流通知，则开启
    //     * this.disconnect()
    //     */
    //     this.disconnect()
    // },
    mounted() {
        // this.init()
        /*
         * 默认关闭websocket，如需工作流通知，则开启
         * this.initWebSocket()
         */
        this.initWebSocket();
        this.userInfo = storage.get("user_info");
        // this.disconnect()
    },
    methods: {
        showCollapse() {
            //this.$store.commit('SET_COLLAPSE')
        },
        openMenu(item = {}) {
            // this.$store.dispatch("GetMenu", {type: true, id: item.id}).then(data => {
            //     if (data.length !== 0) {
            //     this.$router.$avueRouter.formatRoutes(data, true);
            //     }
            // });
        },
        // 屏幕检测
        init() {
            // this.$store.commit('SET_SCREEN', admin.getScreen())
            //     window.onresize = () => {
            //         setTimeout(() => {
            //         this.$store.commit('SET_SCREEN', admin.getScreen())
            //         }, 0)
            //     }
        },
        // 实时检测刷新token
        refreshToken() {
            this.refreshTime = setInterval(() => {
                // const token = getStore({
                // name: 'access_token',
                // debug: true
                // })
                // if (this.validatenull(token)) {
                // return
                // }
                // if (this.expires_in <= 1000 && !this.refreshLock) {
                // this.refreshLock = true
                // this.$store
                //     .dispatch('RefreshToken')
                //     .catch(() => {
                //     clearInterval(this.refreshTime)
                //     })
                //     this.refreshLock = false
                // }
                // this.$store.commit('SET_EXPIRES_IN', this.expires_in - 10)
            }, 10000);
        },

        initWebSocket() {
            this.connection();
            const self = this;
            // 断开重连机制,尝试发送消息,捕获异常发生时重连
            this.timer = setInterval(() => {
                try {
                    self.stompClient.send("test");
                    console.log("test===============");
                } catch (err) {
                    console.log("断线了: " + err);
                    self.connection();
                }
            }, 5000);
        },

        connection() {
            const token = storage.get("token");
            const TENANT_ID = "1"; //getStore({name: 'tenantId'}) ? getStore({name: 'tenantId'}) : '1'
            const headers = {
                "TENANT-ID": "1",
                Authorization: token
            };
            // 建立连接对象
            this.socket = new SockJS(config.DOMAIN_BASE + config.DOMAIN_API + "/sock/ws"); // 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
            // 获取STOMP子协议的客户端对象
            this.stompClient = Stomp.over(this.socket);
            this.stompClient.debug = null;
            // 向服务器发起websocket连接
            this.stompClient.connect(
                headers,
                () => {
                    // 订阅通道  /task/租户ID/用户名称/remind
                    // let target = `/topic/user/${TENANT_ID}/remind`
                    let target = "/topic/web";
                    //let target = `/topic/android`
                    this.stompClient.subscribe(target, (msg) => {
                        // 订阅服务端提供的某个topic;
                        this.$notify({
                            title: "协同提醒",
                            type: "warning",
                            dangerouslyUseHTMLString: true,
                            message: msg.body + "任务，请及时处理",
                            offset: 60
                        });
                    });
                },
                (err) => {
                    console.log(err);
                }
            );
        },

        disconnect() {
            if (this.stompClient != null) {
                this.stompClient.disconnect();
                console.log("Disconnected");
            }
        }
    }
};
</script>

<style></style>
