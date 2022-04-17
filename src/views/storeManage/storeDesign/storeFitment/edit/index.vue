<template>
    <div v-if="config">
        <h1 class="mb-10 fs-16 fw-600">{{ config.name }}</h1>
        <component :is="config.component" :config="config"></component>
    </div>
</template>

<script>
import imageHot from "./imageHot";
import topBackgroundImage from "./topBackgroundImage";

export default {
    name: "StoreDesignEditIndex",
    components: {
        imageHot,
        topBackgroundImage
    },
    props: {
        config: {
            type: Object,
            default: () => {}
        }
    }
};
</script>

<style scoped lang="scss"></style>
