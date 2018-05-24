
<style scoped>
.toutiaonew {
  padding: 10px 10px 10px 210px;
  overflow: auto;
  height: 100%;
  font-size: 14px;
}
.newtt {
  padding: 20px;
}
</style>
<template>
    <div class="toutiaonew">
        <!-- 导行 -->
        <side-bar :step="3"></side-bar>
        <Card dis-hover>
            <div class="newtt">
                创意
            </div>
        </Card>
    </div>
</template>

<script>
import Axios from "@/api/index";
import sideBar from "./components/sideBar.vue";
export default {
    components: {
        sideBar,
    },
    data() {
        return {
            toutiaoConfig: toutiaoConfig,
            account_id: this.$route.query.account_id, //账户id
            id: this.$route.query.id, //行id
            campaign_id: "", //广告组id

        };
    },
    mounted() {
       
    },
    methods: {

    }
};
</script>
