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
          <Select @on-change="handleChangeAdPlan" v-model="selPlanName" class="item-width">
            <Option v-for="(plan, index) in planNameList" :value="plan" :key="index">{{plan}}</Option>
          </Select>
          <Button type="text" @click="handleClearPlanInfo">重置</Button>
        </FormItem>
      </Form>

      <h3 class="sub-title title-padding color-green">推广计划设置</h3>

      <Form ref="adCustomPlan" :model="adCustomPlan" :label-width="126" label-position="left">
        <FormItem label="推广计划名称">
          <Input @on-blur="judgeLen" v-model="adCustomPlan.campaign_name" :maxlength="30" placeholder="推广计划名称" class="item-width"></Input>
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
          <RadioGroup @on-change="handleBudgetModel" v-model="budgetStatus">
            <Radio label="0">
              <span>不限</span>
            </Radio>
            <Radio label="1">
              <Input @on-blur="handleBudget" v-model="adCustomPlan.budget" placeholder="100" :disabled="isDisableBudget" class="item-width"></Input>元
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker @on-change="handleStartDate" :value="adCustomPlan.startDate" type="date" format="yyyy-MM-dd" placeholder="请选择开始日期" class="item-width"></DatePicker>
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
          <Button @click="weekTimeModal = true" type="text" class="color-theme">修改</Button>
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
// 本地测试代码
// import planList from '../simple/plan.json'
import Axios from '@/api/index'
import { deepClone } from '@/utils/DateShortcuts'
import weekDate from '@/components/week-date/index'
const SET_END_DATE_UNLIMITED = '2099-01-01'
const ERR_OK = 1
export default {
  data() {
    return {
      isEdit: false, // 判断当前推广计划状态：true为编辑状态，false为新建状态
      currId: 0, // 编辑状态是的 计划id
      selPlanName: '', // 选择的计划名称
      planNameList: [], // 推广计划名称（campaign_name）
      adPlanList: [], // 推广计划数据
      adResourceId: [1, 2], // 默认推广资源
      budgetStatus: '0', // 日预算状态：不限为0，自定义为1
      isDisableBudget: true, // 日预算状态，禁止为true，自定义为false
      endDateStatus: '0', // 结束日期状态：不限为0，自定义为1
      isDisableEndDate: true, // 结束日期状态，禁止为true，自定义为false
      // 新建推广计划参数
      adCustomPlan: {
        account_id: 123456789,
        campaign_name: '',
        adResourceId: 1,
        budget: -1,
        startDate: this._getStartDate(),
        endDate: SET_END_DATE_UNLIMITED,
        monday: '111111111111111111111111',
        tuesday: '111111111111111111111111',
        wednesday: '111111111111111111111111',
        thursday: '111111111111111111111111',
        friday: '111111111111111111111111',
        saturday: '111111111111111111111111',
        sunday: '111111111111111111111111'
      },
      paused: true, // 推广计划开启状态，用于编辑推广计划提交数据
      weekTimeModal: false, // weekTime 弹窗状态
      // 推广时间段
      period: [
        '111111111111111111111111',
        '111111111111111111111111',
        '111111111111111111111111',
        '111111111111111111111111',
        '111111111111111111111111',
        '111111111111111111111111',
        '111111111111111111111111'
      ],
      // 获取新建推广计划id
      planInfo: {
        campaignId: '',
        campaignName: ''
      },
      budgetTip: {
        isSubmit: true,
        range: [100, 100000],
        tip: '日预算范围100~100000元'
      }, // 日预算规则
    }
  },
  methods: {
    // 判断字符长度
    judgeLen() {
      const currStr = this.adCustomPlan.campaign_name
      const isSpecial = this.judgeSpecial(currStr)
      if (isSpecial) {
        this.adCustomPlan.campaign_name = ''
        this.$Message.error('不能输入特殊字符')
      }
      const currLen = this.getByteLen(currStr)
      if (currLen === 30) {
        this.$Message.error('最大输入不能超过30个字符')
        this.adCustomPlan.campaign_name = currStr
      }
      if (!currStr) {
        this.$Notice.warning({
          title: '计划名称不能为空'
        })
      }
    },
    // 匹配特殊字符，含有返回true
    judgeSpecial(str) {
      let pattern = new RegExp(
        '[`~!@#$^&*()=|{}' + ':;,\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“。，、？]'
      )
      if (pattern.exec(str)) {
        return true
      } else {
        return false
      }
    },
    // 获取字符长度
    getByteLen(str) {
      let len = 0
      for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i)
        if (char.match(/[^\x00-\xff]/gi) !== null) {
          len += 2
        } else {
          len += 1
        }
      }
      return len
    },
    // 获取推广计划数据
    getAdPlan() {
      let ret = []
      this.adPlanList.forEach(plan => {
        ret.push(plan.campaign_name)
      })
      this.planNameList = ret
    },
    updateCampaign() {
      let params = Object.assign({}, this.adCustomPlan, {
        paused: this.paused,
        action: 'ucAdPut',
        opt: 'updateCampaign',
        do: 'edit',
        appId: '',
        platform: '',
        campaign_id: this.planInfo.campaignId,
        budget: this.adCustomPlan.budget + ''
      })
      Axios.post('api.php', params)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.planInfo.campaignId = res.data.campaign_id
            this.$Message.success('推广计划数据编辑成功')
            this.goBack()
          }
        })
        .catch(err => {
          console.log('编辑推广计划' + err)
        })
    },
    addCampaign() {
      if (!this.adCustomPlan.campaign_name) {
        this.$Notice.warning({
          title: '计划名称不能为空'
        })
        return
      }
      let update = Object.assign({}, this.adCustomPlan, {
        action: 'ucAdPut',
        opt: 'addCampaign',
        do: 'edit',
        appId: '',
        platform: '',
        budget: this.adCustomPlan.budget.toString()
      })

      Axios.post('api.php', update)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.$Message.success('新建推广计划数据提交成功')
            this.$router.push({
              name: 'ucunit',
              query: {
                account: this.adCustomPlan.account_id,
                campaign_id: res.data.campaign_id
              }
            })
          }
        })
        .catch(err => {
          console.log('新建推广计划错误' + err)
        })
      // 本地测试代码
      // this.planInfo.campaignId = 'this.adCustomPlan.account_id'
      // this.planInfo.campaignName = this.adCustomPlan.campaign_name
      // this.$router.push({
      //   name: 'ucunit',
      //   query: {
      //     account: this.adCustomPlan.account_id,
      //     campaign_id: '30441770'
      //   }
      // })
    },
    // 监听结束时间按钮
    handleChangeEndDate(endDateSwitch) {
      switch (endDateSwitch) {
        case '0':
          this.isDisableEndDate = true
          this.adCustomPlan.endDate = SET_END_DATE_UNLIMITED
          break
        case '1':
          this.isDisableEndDate = false
          this.adCustomPlan.endDate = this._getStartDate()
          break
      }
    },
    // 监听自定义结束时间
    handleEndDate(date) {
      this.adCustomPlan.endDate = date
    },
    handleStartDate(date) {
      this.adCustomPlan.startDate = date
    },
    // 投放时间弹窗的on-ok事件，获取同步的推广时间段
    handleWeekTime() {
      this.adCustomPlan.monday = this.period[0]
      this.adCustomPlan.tuesday = this.period[1]
      this.adCustomPlan.wednesday = this.period[2]
      this.adCustomPlan.thursday = this.period[3]
      this.adCustomPlan.friday = this.period[4]
      this.adCustomPlan.saturday = this.period[5]
      this.adCustomPlan.sunday = this.period[6]
    },
    // 提交推广计划
    handleSumbit() {
      this.handleBudget()
      if (this.isEdit) {
        this.updateCampaign()
      } else {
        this.addCampaign()
      }
    },
    // 监听日预算开关按钮
    handleBudgetModel(flag) {
      switch (flag) {
        case '0':
          this.isDisableBudget = true
          this.adCustomPlan.budget = -1
          break
        case '1':
          this.isDisableBudget = false
          this.adCustomPlan.budget = 100
          break
      }
    },
    // 监听日预算操作。取值范围[100,100000]
    handleBudget() {
      let budget = parseInt(this.adCustomPlan.budget)
      if (isNaN(budget)) {
          this.adCustomPlan.budget = 100
      }
      // 判断日预算大于1000
      if (this.budgetStatus === '1' && (budget < this.budgetTip.range[0] || budget > this.budgetTip.range[1])) {
          this.budgetTip.isSubmit = false
          this.$Message.warning(this.budgetTip.tip)
          return
      } else {
          this.budgetTip.isSubmit = true
      }
    },
    // "导入推广计划"的重置计划事件按钮
    handleClearPlanInfo() {
      this.selPlanName = ''
      this.adCustomPlan.campaign_name = ''
      this.adCustomPlan.adResourceId = 1
      this.adCustomPlan.budget = 100
      this.isDisableBudget = true
      this.budgetStatus = '0'
      this.adCustomPlan.startDate = this._getStartDate()
      this.adCustomPlan.endDate = SET_END_DATE_UNLIMITED
    },
    // "导入推广计划" select组件的change事件
    handleChangeAdPlan(campaignName) {
      if (campaignName === '') {
        return
      }
      this.adCustomPlan.campaign_name = campaignName + '-复制'
      this.adPlanList.forEach(plan => {
        if (campaignName === plan.campaign_name) {
          this.adCustomPlan.adResourceId = parseInt(plan.adResourceId)
          let budget = plan.budget
          this.budgetStatus = budget === '-1' ? '0' : '1'
          this.isDisableBudget = budget === '-1'
          this.adCustomPlan.budget = parseInt(budget)
          this.adCustomPlan.startDate = plan.startDate
          this.isDisableEndDate = plan.endDate === SET_END_DATE_UNLIMITED
          this.endDateStatus = plan.endDate === SET_END_DATE_UNLIMITED ? '0' : '1'
          this.adCustomPlan.endDate = plan.endDate
          this._norimalizeWeekDayStatus(JSON.parse(plan.schedule))
          this.handleWeekTime()
        }
      })
    },
    // 获取推广计划的同步数据
    campaignPlan() {
      // 本地测试代码
      // this.adPlanList = planList.data
      // this.getAdPlan()
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getCampaignsList'
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            const data = res.data
            this.adPlanList = data
            if (this.isEdit) {
              this.initEditData()
            } else {
              this.getAdPlan()
            }
            this.$Message.success('推广计划列表数据更新成功')
          }
        })
        .catch(err => {
          console.log('推广计划列表数据更新失败：' + err)
        })
    },
    // 返回计划列表按钮
    goBack() {
      this.$router.go(-1)
    },
    // 获取account信息
    getAccountInfo() {
      const query = this.$route.query
      this.adCustomPlan.account_id = query.account
      if (query.id) {
        this.isEdit = true
        this.currId = query.id
      } else {
        this.isEdit = false
      }
    },
    // 初始化 编辑转台下的数据
    initEditData() {
      this.adPlanList.forEach(plan => {
        if (plan.id === this.currId) {
          this.adCustomPlan.budget =
            plan.budget === '-1' ? 100 : parseInt(plan.budget)
          this.budgetStatus = plan.budget === '-1' ? '0' : '1'
          this.isDisableBudget = plan.budget === '-1'
          this.paused = plan.paused
          this.planInfo.campaignId = plan.campaign_id
          this.adCustomPlan.adResourceId = parseInt(plan.adResourceId)
          this.adCustomPlan.campaign_name = plan.campaign_name
          this.adCustomPlan.startDate = plan.startDate
          this.adCustomPlan.endDate = plan.endDate
          const schedule = JSON.parse(plan.schedule)
          this.adCustomPlan.monday = schedule.monday
          this.adCustomPlan.tuesday = schedule.tuesday
          this.adCustomPlan.wednesday = schedule.wednesday
          this.adCustomPlan.thursday = schedule.thursday
          this.adCustomPlan.friday = schedule.friday
          this.adCustomPlan.saturday = schedule.saturday
          this.adCustomPlan.sunday = schedule.sunday
        }
      })
    },
    // 获取
    _norimalizeWeekDayStatus(list) {
      const week = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ]
      for (let i = 0; i < week.length; i++) {
        for (let k in list) {
          if (week[i] === k) {
            this.period.splice(i, 1, list[k])
            break
          }
        }
      }
    },
    _getStartDate() {
      let m = new Date().getMonth() + 1
      let d = new Date().getUTCDate()
      if (m < 10) m = '0' + m
      if (d < 10) d = '0' + d
      return `${new Date().getFullYear()}-${m}-${d}`
    }
  },
  mounted() {
    this.getAccountInfo()
  },
  created() {
    this.campaignPlan()
  },
  components: {
    weekDate
  }
}
</script>
