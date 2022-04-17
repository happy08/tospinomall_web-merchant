<template>
    <div class="p-25 mb-25 bg-white round-4 wrap-content">
        <div class="header flex vcenter between mb-40">
            <div class="flex vcenter"><span class="title">发/补货帮助</span><span class="ml-15">共1000封,未读信件</span><span class="mlr-15 red">800</span>封</div>
            <div class="flex vcenter">
                <span>信件状态</span>
                <span class="mlr-15">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </span>
                <span><el-button plain>标为已读</el-button></span>
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
        <div class="flex between vcenter item">
            <div class="flex vcenter"><span class="green">●</span><span class="ml-15">重磅消息 | 跨境电商选品，最高返利8%个点！</span></div>
            <div class="flex vcenter">
                更新时间：18:30:45
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
export default {
    name: "help",
    setup(props) {
        let options = ref([
            {
                value: "选项1",
                label: "黄金糕"
            },
            {
                value: "选项2",
                label: "双皮奶"
            },
            {
                value: "选项3",
                label: "蚵仔煎"
            },
            {
                value: "选项4",
                label: "龙须面"
            },
            {
                value: "选项5",
                label: "北京烤鸭"
            }
        ]);

        let value = ref();

        return {
            options,
            value
        };
    }
};
</script>

<style lang="scss" scoped>
.wrap-content {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    .header {
        padding-right: 100px;
    }
    .title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }

    .item {
        padding-left: 44px;
        margin-bottom: 32px;
        padding-right: 100px;
    }
}
.wrap-content::-webkit-scrollbar {
    display: none;
}
</style>
