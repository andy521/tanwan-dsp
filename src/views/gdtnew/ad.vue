<style scoped>
.gdtnew {
  padding: 10px 10px 10px 210px;
  overflow: auto;
  height: 100%;
  font-size: 14px;
}
</style>
<template>
    <div class="gdtnew">
        <!-- 导行 -->
        <side-bar :step="1"></side-bar>

        <Card dis-hover>
            <div class="padding-20">

            </div>
        </Card>

    </div>
</template>
<script>
import Axios from "@/api/index";
import gdtConfig from "@/utils/gdtConfig.json";
import sideBar from "./components/sideBar.vue";
export default {
    components: {
        sideBar,
    },
    data() {
        return {

        };
    },
    mounted() {

    },
    methods: {

    }
};
</script>