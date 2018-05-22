<style scoped>
@import url("./index.less");
.uc-plan-wrapper {
  margin: 10px;
  height: 100%;
  overflow-y: scroll;
  /* background-color: #fff */
}
</style>

<template>
  <div class="uc-plan-wrapper">
    <router-view></router-view>
    <!-- 步骤1 新建推广计划 -->
    <!-- <plan @save-plan="handlePlanInfo"></plan> -->
    <!-- 步骤2 新建推广单元 -->
    <!-- <unit :plan-info="planInfo"></unit> -->
    <!-- 步骤3 新建创意 -->
    <!-- <idea></idea> -->
  </div>
</template>

<script>
// import plan from "./components/plan.vue";
// import unit from "./components/unit.vue";
// import idea from "./components/idea.vue";
// import Axios from "@/api/index";
export default {
  data() {
    return {
      // 从plan组件创建推广计划时传回的数据
      // planInfo: {
      //   campaignId: "",
      //   campaignName: ""
      // }
    };
  },
  methods: {
    // 事件：获取从plan组件创建推广计划时传回的数据
    // handlePlanInfo(data) {
    //   this.planInfo.campaignId = data.campaign_id;
    //   this.planInfo.campaignName = data.campaign_name;
    // },
    // getAccountId() {
      // Axios.post('api.php', {
      //   action: 'ucAdPut',
      //   opt: 'getAccount',
      //   "account_id": 207326436
      // }).then((res) => {
      //   console.log('xxx', res)
      // })
    // }
  },
  created() {
    // this.getAccountId();
  },
  components: {
    // plan,
    // unit,
    // idea
  }
};
</script>