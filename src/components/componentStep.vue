<template>
    <div class="bg-white">
        <div class="step">
            <el-steps :active="active" finish-status="success" align-center>
                <el-step :title="item" v-for="(item, i) in steplist.list" :key="i"></el-step>
            </el-steps>
        </div>
    </div>
</template>
<script>
import { ref, reactive, watch, toRef } from "vue";

export default {
    name: "component1",
    props: {
        steplist: Object
    },
    setup(props, context) {
        let active = ref(3);
        const step = reactive({ list: [] });

        watch(
            () => props.steplist,
            () => {
                console.log(props.steplist);
                active.value = props.steplist.active;
                step.list = props.steplist.list;
            },
            { immediate: true, deep: true }
        );

        // console.log(props.stateProps);
        // active.value = props.steplist.active
        // step.list = props.steplist.list

        return {
            active,
            step
        };
    }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__header {
    background: #f7f7f7;
    font-size: 16px;
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
