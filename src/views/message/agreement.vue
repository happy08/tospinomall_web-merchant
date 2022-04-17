<template>
    <div class="p-25 mb-25">
        <div class="flex center mb-25 fs-18">{{ agreement.name }}</div>
        <div v-html="agreement.content" class="content"></div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { basicsOperateSinglePageFindByQuery } from "@/api/user";
export default {
    setup() {
        const route = useRoute();

        let agreement = ref({});
        const getagreement = () => {
            basicsOperateSinglePageFindByQuery({ platform: 3, type: route.query.type })
                .then((res) => {
                    agreement.value = res.data;
                })
                .catch(() => {});
        };
        getagreement();
        return {
            agreement
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
.content {
    max-width: 1200px;
    margin: 0 auto;
}
</style>
