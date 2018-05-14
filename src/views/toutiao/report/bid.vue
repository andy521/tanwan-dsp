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
            <Menu mode="horizontal" active-name="bidcampaign" @on-select="totab">
                <MenuItem name="bidcampaign">广告组</MenuItem>
                <MenuItem name="bidad">广告计划</MenuItem>
                <MenuItem name="bidcreative">创意</MenuItem>
            </Menu>
            <!-- 能在组件切换过程中将状态保留在内存中，防止重复渲染DOM。 -->
            <!-- <keep-alive> -->
                <component :is="curent" class="margin-top-20"></component>
            <!-- </keep-alive> -->
        </Card>
    </div>
</template>
<script>

import bidcampaign from "./bidcampaign.vue";
import bidad from "./bidad.vue";
import bidcreative from "./bidcreative.vue";
import accountId from "../components/accountId.vue";
export default {
    components: {
        bidcampaign,
        bidad,
        bidcreative,
        accountId
    },
    data() {
        return {
            curent: "bidcampaign",
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