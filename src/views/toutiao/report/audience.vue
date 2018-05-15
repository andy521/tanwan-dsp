<style scoped>
.sel {
  width: 220px;
}
.inp {
  display: inline-block;
  width: 150px;
}
.ad .ivu-poptip {
  display: inline-block;
}
.sel_state {
  text-align: left;
  width: 110px;
}
.select_account {
  float: right;
}
</style>
<template>
    <div>
        <!-- 获取帐号 -->
        <account-id></account-id>
        <Card shadow class="margin-top-10">
            <Menu mode="horizontal" active-name="audienceAccount" @on-select="totab">
                <MenuItem name="audienceAccount">帐户</MenuItem>
                <MenuItem name="audienceAd">广告组</MenuItem>
                <MenuItem name="audienceCampaign">广告计划</MenuItem>
            </Menu>
            <!-- 能在组件切换过程中将状态保留在内存中，防止重复渲染DOM。 -->
            <!-- <keep-alive> -->
                <component :is="curent" class="margin-top-20"></component>
            <!-- </keep-alive> -->
        </Card>
    </div>
</template>
<script>

import audienceAccount from "./audienceAccount.vue";
import audienceAd from "./audienceAd.vue";
import audienceCampaign from "./audienceCampaign.vue";
import accountId from "../components/accountId.vue";
export default {
    components: {
        audienceAccount,
        audienceAd,
        audienceCampaign,
        accountId
    },
    data() {
        return {
            curent: "audienceAccount",
            account: ""
        }
    },
    methods: {
        totab(val) {
            this.curent = val;
        }
    },

};
</script>