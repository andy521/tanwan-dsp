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
  <div class="uc-unit">
    <Row>
      <Col span="21">
      <Card dis-hover bordered>

        <Button slot="title" type="text" @click="handleGoBack" class="padding-left-0">
          <Icon type="chevron-left"></Icon>
          返回单元列表
        </Button>
        <!-- 导入推广单元 -->
        <Form :label-width="126" label-position="left">
          <FormItem>
            <h3 slot="label" class="sub-title">导入推广单元</h3>
            <!-- <Select @on-change="handleChangeImportPlan" style="width:200px">
              <Option v-for="(plan, index) in importDate.planlist" :value="plan" :key="index">{{plan}}</Option>
            </Select>
            <Select @on-change="handleChangeImportUnit" style="width:200px">
              <Option v-for="(unit, index) in importDate.unitlist" :value="plan" :key="index">{{unit}}</Option>
            </Select> -->
            <Button type="text" @click="handleClearImport">重置</Button>
          </FormItem>
        </Form>
        <!-- 推广单元设置 -->
        <h3 class="sub-title border-top">推广单元设置</h3>

        <Form ref="unitSetting" :model="unitSetting" :label-width="126" label-position="left">
          <FormItem label="所属推广计划">
            <p>{{ unitSetting.campaign_name }}</p>
          </FormItem>
          <FormItem label="推广单元名称">
            <Input v-model="unitSetting.adgroup_name" :maxlength="30" placeholder="推广单元名称" class="item-width"></Input>
            <span class="color-red">最多30个字符，且不能包含特殊字符</span>
          </FormItem>
          <FormItem label="推广方式">
            <RadioGroup v-model="unitSetting.campaign_id">
              <Radio label="1">打开页面</Radio>
              <Radio label="2">APP下载</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="操作系统">
            <CheckboxGroup v-model="unitSetting.appcategory">
              <Checkbox label="001">IOS</Checkbox>
              <Checkbox label="010">Android</Checkbox>
              <Checkbox label="011">其他系统</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
        <!-- 推广定向设置 -->
        <h3 class="sub-title border-top">定向设置</h3>

        <Form ref="targetingSetting" :model="targetingSetting" :label-width="126" label-position="left">
          <!-- <FormItem label="自定义人群定向">
            <RadioGroup v-model="unitSetting.campaign_id">
              <Radio :label="1">不限</Radio>
              <Radio :label="2">
                <span>定向用户群</span>
                <Tooltip placement="top">
                  <Icon type="help-circled"></Icon>
                  <div slot="content">
                    <p>定向给自定义人群包里的</p>
                    <p>用户群，与其它定向条件</p>
                    <p>取交集，为确保覆盖量，</p>
                    <p>建议选择定向用户群时少</p>
                    <p>设/不设其它定向条件。</p>
                    <p>若同时开启用户智能定</p>
                    <p>向，将智能拓展人群包</p>
                    <p>以外的用户群。</p>
                  </div>
                </Tooltip>
              </Radio>
              <Radio :label="2">
                <span>投放地域</span>
                <Tooltip placement="top">
                  <Icon type="help-circled"></Icon>
                  <div slot="content">
                    <p>投放排除自定义人群包里</p>
                    <p>的用户群，与其它定向条</p>
                    <p>件取余，从其它定向条件</p>
                    <p>圈定的用户群中排除。</p>
                  </div>
                </Tooltip>
              </Radio>
            </RadioGroup>
          </FormItem> -->
          <FormItem label="投放地域">
            <RadioGroup v-model="targetingSetting.all_region">
              <Radio label="">不限</Radio>
              <Radio label="">省市</Radio>
              <Radio label="">
                <span>区县</span>
                <Tooltip placement="top">
                  <Icon type="help-circled"></Icon>
                  <div slot="content">
                    <p>定向给最近30天活跃及实</p>
                    <p>时位于该区县的人群。</p>
                  </div>
                </Tooltip>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="性别">
            <RadioGroup v-model="targetingSetting.gender">
              <Radio label="">不限</Radio>
              <Radio label="">男</Radio>
              <Radio label="">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="年龄">
            <RadioGroup v-model="targetingSetting.age">
              <Radio label="">不限</Radio>
              <Radio label="">自定义</Radio>
            </RadioGroup>
            <!-- <CheckboxGroup v-model="">
              <Checkbox label="18">&lt;=18</Checkbox>
              <Checkbox label="24">19-24</Checkbox>
              <Checkbox label="29">25-29</Checkbox>
              <Checkbox label="39">30-39</Checkbox>
              <Checkbox label="49">40-49</Checkbox>
              <Checkbox label="50">&gt;=50</Checkbox>
            </CheckboxGroup> -->
          </FormItem>
          <FormItem label="兴趣与行为定向">
            <RadioGroup v-model="targetingSetting.user_targeting">
              <Radio label="">不限</Radio>
              <Radio label="">自定义</Radio>
            </RadioGroup>
            <Checkbox v-model="targetingSetting.intelli_targeting">
              <span>同时开启用户智能定向</span>
              <Tooltip placement="top">
                <Icon type="help-circled"></Icon>
                <div slot="content">
                  <p>开启智能定向后，汇川</p>
                  <p>系统将根据您所选的定</p>
                  <p>向条件，您账户中创意</p>
                  <p>的内容以及账户历史积</p>
                  <p>累的互动人群数据，自</p>
                  <p>动拓展更多定向条件，</p>
                  <p>帮助您获得更优质的潜</p>
                  <p>在用户，从而提升推广</p>
                  <p>效果。</p>
                </div>
              </Tooltip>
            </Checkbox>
          </FormItem>
          <FormItem label="网络环境">
            <RadioGroup v-model="targetingSetting.network_env">
              <Radio label="11">不限</Radio>
              <Radio label="01">WiFi</Radio>
              <Radio label="10">数据网络</Radio>
            </RadioGroup>
          </FormItem>
        </Form>

        <!-- 出价设置 -->
        <h3 class="sub-title border-top">出价设置</h3>

        <Form ref="priceSetting" :model="priceSetting" :label-width="126" label-position="left">

          <FormItem label="转化类型">
            <Select @on-change="" style="width:200px">
              <!-- <Option v-for="" :value="" :key="">{{}}</Option> -->
            </Select>
          </FormItem>
          <FormItem>
            <p slot="label">优化目标
              <Tooltip placement="top">
                <Icon type="help-circled"></Icon>
                <div slot="content">
                  <p>广告主设定的推广的目的，</p>
                  <p>会影响计费和出价的方式，</p>
                  <p>该选项为单选，除点击可切</p>
                  <p>换为转化外，其他优化目标</p>
                  <p>不能进行更改，转化为根据</p>
                  <p>转化智能出价，点击为原有</p>
                  <p>CPC计费方式，展现为原有</p>
                  <p>CPM计费方式。</p>
                </div>
              </Tooltip>
            </p>
            <!-- <RadioGroup v-model="">
              <Radio label="">点击</Radio>
              <Radio label="">展现</Radio>
            </RadioGroup> -->
          </FormItem>
          <FormItem label="计费方式">
            <!-- <RadioGroup v-model="">
              <Radio label="">CPC</Radio>
              <Radio label="">CPM</Radio>
            </RadioGroup> -->
            <span class="color-red">计费方式保存后不可修改</span>
          </FormItem>
          <FormItem label="出价">
            <!-- <InputNumber :max="101" :min="0.50" v-model=""></InputNumber>元/点击 -->
            <span class="color-red">请输入0.50-101之间的数字，精确到小数点后2位，单元出价需小于预算。</span>
          </FormItem>
        </Form>
        <!-- 出价设置 -->
        <h3 class="sub-title border-top">高级设置</h3>

        <Form ref="priceSetting" :model="priceSetting" :label-width="126" label-position="left">
          <!-- <RadioGroup v-model="">
            <Radio label="">拨打电话样式</Radio>
            <Radio label="">填写表单样式</Radio>
          </RadioGroup> -->
        </Form>

      </Card> -->
      </Col>
      <Col span="3">col-12</Col>
    </Row>
  </div>
</template>

<script>
import Axios from "@/api/index";
import { ERR_OK } from "@/api/config";

export default {
  data() {
    return {
      accountId: '',
      campaignId: '',
      targetingList: [],
      // 导入推广单元
      importDate: {
        planlist: {}, // 推广计划数据
        unitlist: {}  // 推广单元数据
      },
      // 推广单元数据
      unitSetting: {
        campaign_name: "",  // 推广计划名称
        adgroup_name: "", // 推广单元名称
        campaign_id: 1,  // 推广方式的id
        platform: '001', // 操作系统
      },
      // 定向设置数据
      targetingSetting: {
        audience: 0,  // 人群包定向id集合
        audience_targeting: '', // 自定义人群定向
        all_region: '', // 投放地域定向
        region: [], // 	地域id集合
        gender: '', // 性别定向
        age: '',  // 	年龄定向
        user_targeting: '', // 兴趣与行为自定义
        interest: '', // 兴趣定向
        word: '', // 关键关键词定向
        url: '',   // 	兴趣站点定向
        app: '',  // app名称定向
        appcategory: '',  // app分类定向
        network_env: '',  // 	网络环境定向
        intelli_targeting: true,  // 开启用户智能定向
        search_word: -1,  // 应用搜索关键词定向
        auto_search_word: false // 开启智能关键词
      },
      // 出价设置
      priceSetting: {

      },
      // 新建推广单元参数
      adCustomUnit: {
        adgroup_name: "",
        generalizeType: ""
      }
    };
  },
  mounted() {
  },
  created() {
    this.getCampaignUnit()
    this.getTargetingList()
  },
  methods: {
    // 事件：返回计划列表
    handleGoBack() {
      this.$router.go(-1)
    },
    // 事件：重置导入推广单元的数据与显示
    handleClearImport() {},
    // 事件：处理导入推广单元的计划数据
    handleChangeImportPlan() {},
    // 事件：处理导入推广单元的单元数据
    handleChangeImportUnit() {},
    // 获取推广单元数据
    getCampaignUnit() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getAdgroupsList",
        campaign_id: '30428830'
      }).then(res => {
        if (ERR_OK === res.ret) {
          this.importDate.unitlist = res.data
          console.log(this.importDate)
        }
      })
    },
    getTargetingList() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getTargetingList'
      }).then(res => {
        if (ERR_OK === res.ret) {
          this.targetingList = res.date
          console.log(this.targetingList)
        }
      })
    }
  }
};
</script>

