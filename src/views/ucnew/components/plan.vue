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
</style>

<template>
  <div class="uc-plan">
    <Card dis-hover bordered>

      <Button slot="title" type="text" @click="goBack" class="padding-left-0">
        <Icon type="chevron-left"></Icon>
        返回计划列表
      </Button>

      <Form :label-width="126" label-position="left">
        <FormItem>
          <h3 slot="label" class="sub-title">导入推广计划</h3>
          <Select @on-change="changeAdPlan" style="width:200px">
            <Option v-for="(plan, index) in AdPlan" :value="plan" :key="index">{{plan}}</Option>
          </Select>
          <Button type="text" @click="clearPlanInfo">重置</Button>
        </FormItem>
      </Form>

      <h3 class="sub-title border-top">推广计划设置</h3>

      <Form ref="adCustomPlan" :model="adCustomPlan" :label-width="126" label-position="left">
        <FormItem label="推广计划名称">
          <Input v-model="adCustomPlan.campaign_name" :maxlength="30" placeholder="推广计划名称" class="item-width"></Input>
          <span class="text-tip">最多30个字符，且不能包含特殊字符</span>
        </FormItem>
        <FormItem label="推广资源">
          <RadioGroup v-model="adCustomPlan.adResourceId">
            <Radio :label="adResourceId[0]">
              <span>UC头条</span>
              <Tooltip placement="top" content="广告展示在UC头条信息流内容中">
                <Icon type="help-circled"></Icon>
              </Tooltip>
            </Radio>
            <Radio :label="adResourceId[1]">
              <span>UC精准</span>
              <Tooltip placement="top">
                <Icon type="help-circled"></Icon>
                <div slot="content">
                  <p>广告展示在阿里移动各优质媒体中，</p>
                  <p>如UC订阅号、UC看图等</p>
                </div>
              </Tooltip>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="日预算">
          <RadioGroup v-model="adCustomPlan.budget">
            <Radio :label="budgetUnlimited">
              <span>不限</span>
            </Radio>
            <Radio :label="budgetCustom" v-model="budgetCustom" :true-value="budgetCustom">
              <InputNumber @on-change="getbudget" v-model="budgetCustom" :min="100" :max="100000" :step="100" placeholder="100" :disabled="getBudgetStatus" class="item-width"></InputNumber>元
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker :value="adCustomPlan.startDate" type="date" :placeholder="adCustomPlan.startDate" class="item-width"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <RadioGroup v-model="adCustomPlan.endDate">
            <Radio :label="dateUnlimited">
              <span>不限</span>
            </Radio>
            <Radio :label="endDate" v-model="endDate" :true-value="endDate">
              <DatePicker @on-change="getEndDate" type="date" placeholder="请选择结束日期" :disabled="getEndDateStatus" class="item-width"></DatePicker>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="投放时段">
          <span class="text-primary">全部时段</span>
          <Button @click="handlerWeekTime" type="text" class="color-theme">修改</Button>
        </FormItem>
      </Form>
      <Row>
        <Col>
        <Button @click="handleSumbit('adCustomPlan')" type="primary">确认</Button>
        <Button @click="goBack" type="ghost">取消</Button>
        </Col>
      </Row>
      {{this.adCustomPlan}}
    </Card>
    <!-- weekTime modal -->
    <Modal @on-ok="handleWeekTime" title="修改推广时段" v-model="weekTimeModal" :width="900" :styles="{top: '20px'}">
      <week-date :value="period"></week-date>
      {{period}}
    </Modal>
  </div>
</template>

<script>
import Axios from "@/api/index";
import { ERR_OK } from "@/api/config";
import { deepClone } from "@/utils/DateShortcuts";
import weekDate from "@/components/week-date/index";

const SET_END_DATE_UNLIMITED = "2099-01-01";
export default {
  data() {
    return {
      AdPlan: [], // 推广计划名称（campaign_name）
      adPlanList: [], // 推广计划数据
      adPlanListCopy: [],
      importPlanName: "",
      adResourceId: [1, 2], // 默认推广资源
      budgetUnlimited: "-1", // 默认日预算
      budgetCustom: 100, // 客户设置的日预算
      dateUnlimited: SET_END_DATE_UNLIMITED, // 不限时结束时间
      endDate: this._getStartDate(), // 客户设置的结束时间
      adCustomPlan: {
        // 新建推广计划参数
        campaign_name: "",
        adResourceId: 1,
        budget: "-1",
        startDate: this._getStartDate(),
        endDate: SET_END_DATE_UNLIMITED,
        monday: "111111111111111111111111",
        tuesday: "111111111111111111111111",
        wednesday: "111111111111111111111111",
        thursday: "111111111111111111111111",
        friday: "111111111111111111111111",
        saturday: "111111111111111111111111",
        sunday: "111111111111111111111111"
      },
      weekTimeModal: false, // 控制weekTIme 弹窗
      // 推广时间段
      period: [
        "111111111111111111111111",
        "111111111111111111111111",
        "111111111111111111111111",
        "111111111111111111111111",
        "111111111111111111111111",
        "111111111111111111111111",
        "111111111111111111111111"
      ],
      campaignId: 0, // 获取新建推广计划id
      accountId: "207326436"
    };
  },
  methods: {
    // 获取推广计划数据
    getAdPlan() {
      let ret = [];
      this.adPlanListCopy.forEach(plan => {
        ret.push(plan.campaign_name);
      });
      this.AdPlan = ret;
    },
    // 投放时间弹窗的on-ok事件，获取同步的推广时间段
    handleWeekTime() {
      this.adCustomPlan.monday = this.period[0];
      this.adCustomPlan.tuesday = this.period[1];
      this.adCustomPlan.wednesday = this.period[2];
      this.adCustomPlan.thursday = this.period[3];
      this.adCustomPlan.friday = this.period[4];
      this.adCustomPlan.saturday = this.period[5];
      this.adCustomPlan.sunday = this.period[6];
      console.log("this.period change", this.adCustomPlan, this.period);
    },
    // 提交推广计划
    handleSumbit(name) {
      let update = Object.assign(this.adCustomPlan, {
        action: "ucAdPut",
        opt: "addCampaign",
        do: "edit",
        account_id: this.accountId,
        appId: "",
        platform: ""
      });
      Axios.post("api.php", update)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.$Message.success("提交成功");
            this.campaignId = res.data.campaign_id;
            this.$emit("save-plan", this.campaignId);
          }
        })
        .catch(err => {
          console.log("新建推广计划" + err);
        });
    },
    // 弹窗控制
    handlerWeekTime() {
      this.weekTimeModal = true;
    },
    // 获取当前计划结束时间
    getEndDate(date) {
      this.endDate = date;
      this.adCustomPlan.endDate = date;
    },
    // 获取当前计划日预算
    getbudget(budget) {
      this.budgetCustom = budget;
      this.adCustomPlan.budget = budget;
    },
    // "导入推广计划"的重置计划事件按钮
    clearPlanInfo() {
      this.adCustomPlan.campaign_name = "";
      this.adCustomPlan.adResourceId = 1;
      this.adCustomPlan.budget = "-1";
      this.adCustomPlan.startDate = this._getStartDate();
      this.adCustomPlan.endDate = SET_END_DATE_UNLIMITED;
      this.adPlanListCopy = deepClone(this.adPlanList);
    },
    // 获取推广计划的同步数据
    campaignPlan() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getCampaignsList"
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.adPlanList = res.data;
            console.log(this.adPlanList)
            this.adPlanListCopy = deepClone(this.adPlanList);
            this.getAdPlan();
          }
        })
        .catch(err => {
          console.log("获取推广计划错误：" + err);
        });
    },
    // "导入推广计划" select组件的change事件
    changeAdPlan(campaignName) {
      this.adPlanList.forEach(plan => {
        if (campaignName === plan.campaign_name) {
          let budget = plan.budget;
          console.log("plan", plan);
          this.adCustomPlan.campaign_name = plan.campaign_name;
          this.adCustomPlan.adResourceId = parseInt(plan.adResourceId);
          this.budgetCustom = typeof budget === "-1" ? 100 : parseInt(budget);
          this.adCustomPlan.budget = budget;
          this.adCustomPlan.startDate = plan.startDate;
          this.adCustomPlan.endDate = plan.endDate;
          this._norimalizeWeekDayStatus(JSON.parse(plan.schedule));
          this.handleWeekTime();
        }
      });
    },
    // 返回计划列表按钮
    goBack() {
      this.$router.go(-1);
    },
    // 获取account id
    getAccountId() {
      const query = this.$route.query;
      if (query.account_id) {
        this.accoundId = query.account_id;
      }
    },
    // 获取
    _norimalizeWeekDayStatus(list) {
      const week = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      ];
      let ret = [];
      for (let i = 0; i < week.length; i++) {
        for (let k in list) {
          if (week[i] === k) {
            this.period.splice(i, 1, list[k]);
            break;
          }
        }
      }
    },
    _getStartDate() {
      let m = new Date().getMonth() + 1;
      let d = new Date().getUTCDate();
      if (m < 10) m = "0" + m;
      if (d < 10) d = "0" + d;
      return `${new Date().getFullYear()}-${m}-${d}`;
    }
  },
  mounted() {
    this.getAccountId();
  },
  computed: {
    getEndDateStatus() {
      if (this.dateUnlimited === this.adCustomPlan.endDate) {
        return true;
      } else if (this.budgetUnlimited !== this.adCustomPlan.endDate) {
        return false;
      }
    },
    getBudgetStatus() {
      if (this.budgetUnlimited === this.adCustomPlan.budget) {
        return true;
      } else if (this.budgetUnlimited !== this.adCustomPlan.budget) {
        return false;
      }
    }
  },
  created() {
    this.campaignPlan();
  },
  components: {
    weekDate
  }
};
</script>
