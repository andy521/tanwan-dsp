<style scoped lang="less">
@import url("../index.less");
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
.uc-idea-content{
  margin: 0 10px;
  padding: 0 20px;
}
</style>

<template>
  <div class="uc-idea">
    <Card dis-hover bordered>

      <Button slot="title" type="text" @click="handleGoBack" class="padding-left-0">
        <Icon type="chevron-left"></Icon>
        返回计划列表
      </Button>
      <div class="uc-idea-content">
        <div class="g-belong">
          <span>所属计划：</span>
          <span>所属单元：</span>
        </div>
      </div>

    </Card>
  </div>
</template>

<script>
import Axios from "@/api/index";
const ERR_OK = 1;

// 本地测试代码
// import planList from "../simple/plan";
// import { deepClone } from "@/common/js/DateShortcuts";

export default {
  data() {
    return {
      isEdit: false, // 判断当前推广计划状态：true为编辑状态，false为新建状态
      creativeTemplates: [], // creativeTemplates
      accountId: this.$route.query.account,
      campaignId: this.$route.query.campaign_id,
      adgroupId: this.$route.query.adgroup_id,
    };
  },
  methods: {
    // 获取广告样式列表
    getCreativeTemplates() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getCreativeTemplates",
        adgroup_id: this.adgroupId
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.creativeTemplates = res.data;
            console.log(this.creativeTemplates, "creativeTemplates")
            this.$Message.success("获取广告样式列表数据更新成功");
          }
        })
        .catch(err => {
          console.log("获取广告样式列表错误：" + err);
        });
    },
    // 返回计划列表按钮
    handleGoBack() {
      this.$router.go(-1);
    },
    // 获取account信息
    getAccountInfo() {
      const query = this.$route.query;
      const params = this.$route.params;
      console.log("idea router query", query, params);

      this.adCustomPlan.account_id = query.account;
      if (
        typeof query === "object" &&
        query.account &&
        query.edit &&
        query.edit === "1"
      ) {
        if (params && params.account_id) {
          this.isEdit = true;
        } else {
          this.handleGoBack();
        }
      } else {
        this.isEdit = false;
      }
    }
  },
  mounted() {},
  created() {
    this.getCreativeTemplates();
  },
  components: {}
};
</script>