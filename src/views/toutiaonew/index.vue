<style scoped>
.toutiaonew {
    padding: 40px 40px 40px 240px;
    overflow: auto;
    height: 100%;
    font-size: 14px;
}
</style>

<template>
    <div class="toutiaonew">
        <side-bar></side-bar>
        <router-view></router-view>
    </div>
</template>

<script>
import sideBar from "./components/sideBar.vue";

export default {
    components: {
        sideBar
    },
    data() {
        return {};
    },
    methods: {}
};
</script>