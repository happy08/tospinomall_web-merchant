<template>
    <div class="error403">
        403
    </div>
</template>

<script>
export default {
    name: "Error403",
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
