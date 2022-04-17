<template>
    <div class="error500">
        500
    </div>
</template>

<script>
export default {
    name: "Error500",
    methods: {
        backPage() {
            this.$router.go(-1);
        },
        goHome() {
            this.$router.push({
                path: "/"
            });
        }
    }
};
</script>
