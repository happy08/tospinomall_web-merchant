<template>
    <div class="bg-white">
        <div>
            <el-dialog :title="state.title" v-model="state.centerDialogVisible" width="30%">
                <div class="flex hcenter vcenter">
                    <span>{{ state.content }} 需要注意的是内容是默认不居中的</span>
                </div>
                <template #footer>
                    <div style="display: flex;justify-content: center;align-items: center;" class="flex hcenter vcenter">
                        <span class="dialog-footer">
                            <el-button @click="cancelClose">取 消</el-button>
                            <el-button type="primary" @click="submitConfirm">确 定</el-button>
                        </span>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { ref, reactive, onMounted, watch, toRef } from "vue";

export default {
    name: "componentDialog",
    props: {
        stateProps: Object
    },
    setup(props, context) {
        watch(props.stateProps, () => {
            state.centerDialogVisible = props.stateProps.centerDialogVisible;
            state.title = props.stateProps.title;
            state.content = props.stateProps.content;
        });

        const state = reactive({
            title: "张三",
            content: "内容",
            centerDialogVisible: false
        });

        const submitConfirm = () => {
            state.centerDialogVisible = !state.centerDialogVisible;
            context.emit("sub", state);
        };

        const cancelClose = () => {
            state.centerDialogVisible = !state.centerDialogVisible;
            context.emit("sub", state);
        };

        return {
            state,
            submitConfirm,
            cancelClose
        };
    }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__header {
    background: #f7f7f7;
    font-size: 16px;
}
/deep/ .el-dialog__headerbtn .el-dialog__close {
    font-weight: 800;
    font-size: 30px;
}
/deep/ .el-step__title.is-success {
    color: #42b7ae;
}
/deep/ .el-step__title.is-process {
    color: #c4c4d6;
}
/deep/ .el-step__icon.is-text {
    border-color: #42b7ae;
}
/deep/ .el-step__icon-inner.is-status {
    color: #42b7ae;
}
/deep/ .el-step__icon-inner {
    color: #b4b4b4;
}
</style>
