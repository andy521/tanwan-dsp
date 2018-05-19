<style scoped>
.toutiaonew {
    padding: 10px 10px 10px 210px;
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