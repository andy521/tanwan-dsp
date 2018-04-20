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
        <FormItem v-if="!isEdit" class="border-import">
          <h3 slot="label" class="sub-title color-green">导入推广计划</h3>
          <Select @on-change="handleChangeAdPlan" v-model="adCustomPlan.campaign_name" class="item-width">
            <Option v-for="(plan, index) in AdPlan" :value="plan" :key="index">{{plan}}</Option>
          </Select>
          <Button type="text" @click="handleClearPlanInfo">重置</Button>
        </FormItem>
      </Form>

      <h3 class="sub-title title-padding color-green">推广计划设置</h3>

      <Form ref="adCustomPlan" :model="adCustomPlan" :label-width="126" label-position="left">
        <FormItem label="推广计划名称">
          <Input @on-change="judgeLen" v-model="adCustomPlan.campaign_name" :maxlength="30" placeholder="推广计划名称" class="item-width"></Input>
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
          <RadioGroup @on-change="handleChangeBudget" v-model="budgetStatus">
            <Radio label="0">
              <span>不限</span>
            </Radio>
            <Radio label="1">
              <InputNumber @on-blur="handleBudget" v-model="adCustomPlan.budget" :min="100" :max="100000" :precision="2" :step="100" placeholder="100" :disabled="isDisableBudget" class="item-width"></InputNumber>元
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker @on-change="changeStartDate" :value="adCustomPlan.startDate" type="date" placeholder="请选择开始日期" class="item-width"></DatePicker>
          <!-- <DatePicker v-model="adCustomPlan.startDate" type="date" format="yyyy-MM-dd" placeholder="请选择开始日期" class="item-width"></DatePicker> -->
        </FormItem>
        <FormItem label="结束日期">
          <RadioGroup @on-change="handleChangeEndDate" v-model="endDateStatus">
            <Radio label="0">
              <span>不限</span>
            </Radio>
            <Radio label="1">
              <DatePicker @on-change="handleEndDate" :value="adCustomPlan.endDate" type="date" placeholder="请选择结束日期" :disabled="isDisableEndDate" class="item-width"></DatePicker>
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
    </Card>
    <!-- weekTime modal -->
    <Modal @on-ok="handleWeekTime" title="修改推广时段" v-model="weekTimeModal" :width="900" :styles="{top: '20px'}">
      <week-date v-model="period"></week-date>
    </Modal>
  </div>
</template>

<script>
import Axios from "@/api/index";
import { deepClone } from "@/utils/DateShortcuts";
import weekDate from "@/components/week-date/index";
const SET_END_DATE_UNLIMITED = "2099-01-01";
const ERR_OK = 1;

// 本地测试代码
// import planList from "../simple/plan";
// import { deepClone } from "@/common/js/DateShortcuts";

export default {
  data() {
    return {
      isEdit: false, // 判断当前推广计划状态：true为编辑状态，false为新建状态
      currId: 0, // 编辑状态是的 计划id
      AdPlan: [], // 推广计划名称（campaign_name）
      adPlanList: [], // 推广计划数据
      adPlanListCopy: [],
      adResourceId: [1, 2], // 默认推广资源
      budgetStatus: "0", // 日预算状态：不限为0，自定义为1
      isDisableBudget: true, // 日预算状态，禁止为true，自定义为false
      endDateStatus: "0", // 结束日期状态：不限为0，自定义为1
      isDisableEndDate: true, // 结束日期状态，禁止为true，自定义为false
      // 新建推广计划参数
      adCustomPlan: {
        account_id: 123456789,
        campaign_name: "",
        adResourceId: 1,
        budget: 100,
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
      paused: true, // 推广计划开启状态，用于编辑推广计划提交数据
      weekTimeModal: false, // weekTime 弹窗状态
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
      // 获取新建推广计划id
      planInfo: {
        campaignId: "",
        campaignName: ""
      }
    };
  },
  methods: {
    // 判断字符长度
    judgeLen() {
      let currStr = this.adCustomPlan.campaign_name;
      let isSpecial = this.judgeSpecial(currStr);
      if (isSpecial) {
        this.adCustomPlan.campaign_name = "";
        this.$Message.error("不能输入特殊字符");
      }
      console.log(isSpecial);
      let currLen = this.getByteLen(currStr);
      if (currLen === 30) {
        console.log(currLen, currStr);
        this.$Message.error("最大输入不能超过30个字符");
        this.adCustomPlan.campaign_name = currStr;
      }
    },
    // 匹配特殊字符，含有返回true
    judgeSpecial(str) {
      let pattern = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
      );
      if (pattern.exec(str)) {
        return true;
      } else {
        return false;
      }
    },
    // 获取字符长度
    getByteLen(str) {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        if (char.match(/[^\x00-\xff]/gi) !== null) {
          len += 2;
        } else {
          len += 1;
        }
      }
      return len;
    },
    // 获取推广计划数据
    getAdPlan() {
      let ret = [];
      this.adPlanListCopy.forEach(plan => {
        ret.push(plan.campaign_name);
      });
      this.AdPlan = ret;
    },
    updateCampaign() {
      let params = Object.assign({}, this.adCustomPlan, {
        paused: this.paused,
        action: "ucAdPut",
        opt: "updateCampaign",
        do: "edit",
        appId: "",
        platform: "",
        campaign_id: this.planInfo.campaignId,
        budget: this.adCustomPlan.budget + ""
      });
      Axios.post("api.php", params)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.planInfo.campaignId = res.data.campaign_id;
            this.$Message.success("推广计划数据编辑成功");
            this.goBack();
          }
        })
        .catch(err => {
          console.log("编辑推广计划" + err);
        });
    },
    addCampaign() {
      let update = Object.assign({}, this.adCustomPlan, {
        action: "ucAdPut",
        opt: "addCampaign",
        do: "edit",
        appId: "",
        platform: "",
        budget: this.adCustomPlan.budget.toString()
      });
      console.log("add this.adCustomPlan", this.adCustomPlan, update);
      Axios.post("api.php", update)
        .then(res => {
          if (ERR_OK === res.ret) {
            // 广告位单页。不是用路由导航时使用
            // this.planInfo.campaignId = res.data.campaign_id;
            // this.planInfo.campaignName = this.adCustomPlan.campaign_name;
            // this.$emit("save-plan", this.planInfo);
            this.$Message.success("新建推广计划数据提交成功");
            this.$router.push({
              name: "ucunit",
              query: {
                account: this.adCustomPlan.account_id,
                campaign_id: res.data.campaign_id
              }
            });
          }
        })
        .catch(err => {
          console.log("新建推广计划" + err);
        });
      // 本地测试代码
      // this.planInfo.campaignId = "this.adCustomPlan.account_id";
      // this.planInfo.campaignName = this.adCustomPlan.campaign_name;
      // this.$emit("save-plan", this.planInfo);
    },
    // 监听结束时间按钮
    handleChangeEndDate(endDateSwitch) {
      switch (endDateSwitch) {
        case "0":
          this.isDisableEndDate = true;
          this.adCustomPlan.endDate = SET_END_DATE_UNLIMITED;
          break;
        case "1":
          this.isDisableEndDate = false;
          this.adCustomPlan.endDate = this._getStartDate();
          break;
      }
    },
    // 监听自定义结束时间
    handleEndDate(date) {
      this.isDisableEndDate = false;
      this.endDateStatus = "1";
      this.adCustomPlan.endDate = date;
    },
    changeStartDate(date) {
      this.adCustomPlan.startDate = date;
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
    },
    // 提交推广计划
    handleSumbit() {
      if (this.isEdit) {
        this.updateCampaign();
      } else {
        this.addCampaign();
      }
    },
    // 弹窗控制
    handlerWeekTime() {
      this.weekTimeModal = true;
    },
    // 监听日预算开关按钮
    handleChangeBudget(budgetSwitch) {
      switch (budgetSwitch) {
        case "0":
          this.isDisableBudget = true;
          this.adCustomPlan.budget = -1;
          break;
        case "1":
          this.isDisableBudget = false;
          this.adCustomPlan.budget = 0;
          break;
      }
    },
    // 监听日预算操作
    handleBudget(budgetNum) {
      this.isDisableBudget = false;
      this.budgetStatus = "1";
      this.adCustomPlan.budget = budgetNum < 100 ? 100 : budgetNum;
    },
    // "导入推广计划"的重置计划事件按钮
    handleClearPlanInfo() {
      this.adCustomPlan.campaign_name = "";
      this.adCustomPlan.adResourceId = 1;
      this.adCustomPlan.budget = 100;
      this.isDisableBudget = true;
      this.budgetStatus = "0";
      this.adCustomPlan.startDate = this._getStartDate();
      this.adCustomPlan.endDate = SET_END_DATE_UNLIMITED;
      this.adPlanListCopy = deepClone(this.adPlanList);
    },
    // "导入推广计划" select组件的change事件
    handleChangeAdPlan(campaignName) {
      this.adPlanList.forEach(plan => {
        if (campaignName === plan.campaign_name) {
          this.adCustomPlan.campaign_name = plan.campaign_name;
          this.adCustomPlan.adResourceId = parseInt(plan.adResourceId);
          let budget = plan.budget;
          this.budgetStatus = budget === "-1" ? "0" : "1";
          this.isDisableBudget = budget === "-1" ? true : false;
          this.adCustomPlan.budget = parseInt(budget);
          this.adCustomPlan.startDate = plan.startDate;
          this.isDisableEndDate =
            plan.endDate === SET_END_DATE_UNLIMITED ? true : false;
          this.endDateStatus =
            plan.endDate === SET_END_DATE_UNLIMITED ? "0" : "1";
          this.adCustomPlan.endDate = plan.endDate;
          this._norimalizeWeekDayStatus(JSON.parse(plan.schedule));
          this.handleWeekTime();
        }
      });
    },
    // 获取推广计划的同步数据
    campaignPlan() {
      // 本地测试代码
      // this.adPlanList = planList.data;
      // this.adPlanListCopy = deepClone(this.adPlanList);
      // this.getAdPlan();
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getCampaignsList"
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.adPlanList = res.data;
            console.log("xxjihua", this.adPlanList);
            this.adPlanListCopy = deepClone(this.adPlanList);
            if (this.isEdit) {
              this.initEditData();
            } else {
              this.getAdPlan();
            }
            this.$Message.success("推广计划数据更新成功");
          }
        })
        .catch(err => {
          console.log("获取推广计划错误：" + err);
        });
    },
    // 返回计划列表按钮
    goBack() {
      this.$router.go(-1);
    },
    // 获取account信息
    getAccountInfo() {
      const query = this.$route.query;
      this.adCustomPlan.account_id = query.account;
      if (
        typeof query === "object" &&
        query.account &&
        query.edit &&
        query.edit === "1"
      ) {
        this.isEdit = true;
        this.currId = query.id;
      } else {
        this.isEdit = false;
      }
    },
    // 初始化 编辑转台下的数据
    initEditData() {
      this.adPlanList.forEach(plan => {
        if (plan.id === this.currId) {
          this.adCustomPlan.budget =
            plan.budget === "-1" ? 100 : parseInt(plan.budget);
          this.budgetStatus = plan.budget === "-1" ? "0" : "1";
          this.isDisableBudget = plan.budget === "-1" ? true : false;
          this.paused = plan.paused;
          this.planInfo.campaignId = plan.campaign_id;
          this.adCustomPlan.adResourceId = parseInt(plan.adResourceId);
          this.adCustomPlan.campaign_name = plan.campaign_name;
          this.adCustomPlan.startDate = plan.startDate;
          this.adCustomPlan.endDate = plan.endDate;
          const schedule = JSON.parse(plan.schedule);
          this.adCustomPlan.monday = schedule.monday;
          this.adCustomPlan.tuesday = schedule.tuesday;
          this.adCustomPlan.wednesday = schedule.wednesday;
          this.adCustomPlan.thursday = schedule.thursday;
          this.adCustomPlan.friday = schedule.friday;
          this.adCustomPlan.saturday = schedule.saturday;
          this.adCustomPlan.sunday = schedule.sunday;
          return;
        }
      });
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
    this.getAccountInfo();
  },
  created() {
    this.campaignPlan();
  },
  components: {
    weekDate
  }
};
</script>