<style scoped>
@import url("./index.less");
.uc-plan-wrapper{
  margin: 10px;
  height: 100%;
  overflow: scroll;
}
</style>

<template>
  <div class="uc-plan-wrapper">
    <!-- 步骤1 新建推广计划 -->
    <plan></plan>
    <!-- 步骤2 新建推广单元 -->
    <unit></unit>
    <!-- 步骤3 新建创意 -->
    <idea></idea>
  </div>
</template>

<script>
import plan from './components/plan.vue';
import unit from './components/unit.vue';
import idea from './components/idea.vue';
import Axios from '@/api/index'

export default {
  data() {
    return {}
  },
  methods: {
    getAccountId() {
      // Axios.post('api.php', {
      //   action: 'ucAdPut',
      //   opt: 'getAccount',
      //   "account_id": 207326436
      // }).then((res) => {
      //   console.log('xxx', res)
      // })
    }
  },
  created() {
    this.getAccountId()
  },
  components: {
    plan,
    unit,
    idea
  }
}
</script>
