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
.evaluate-title {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
}
.evaluate-content {
  padding: 0 2px;
  margin-bottom: 15px;
  min-width: 90%;
}
.evaluate-num {
  padding-bottom: 10px;
  padding-top: 10px;
  font-size: 20px;
  font-weight: 200;
  line-height: 32px;
  text-align: center;
}
.evaluate-subtitle {
  min-width: 70px;
  font-size: 14px;
  font-weight: normal;
  color: #333;
}
.evaluate-text {
  line-height: 28px;
  // text-indent: 1rem;
  margin-left: 1rem;
  color: #a3a3a3;
}
.regions-box {
  padding: 10px;
  max-width: 800px;
  max-height: 400px;
  overflow-y: scroll;
  border: 1px solid #eee;
}
.evaluate-region {
  padding: 2px;
  letter-spacing: -2px;
}
</style>

<template>
  <div class="uc-unit">
    <Row>
      <Col span="21">
      <Card dis-hover bordered>

        <Button slot="title" type="text" @click="handleGoBack" class="padding-left-0 color-green">
          <Icon type="chevron-left"></Icon>
          返回单元列表
        </Button>
        <!-- 导入推广单元 -->
        <Form :label-width="126" label-position="left">
          <FormItem class="border-import">
            <h3 slot="label" class="sub-title">导入推广单元</h3>
            <Select @on-change="handleChangeImportPlan" v-model="unitSetting.campaign_name" :clearable="true" class="item-width">
              <Option v-for="(plan, index) in importDate.planlist" :value="plan.campaign_name" :key="index.id">{{plan.campaign_name}}</Option>
            </Select>
            <Select @on-change="handleChangeImportUnit" v-model="unitAdgroupName" :clearable="true" class="item-width">
              <Option v-for="(unit, index) in importDate.unitlist" :value="unit.adgroup_name" :key="index.id">{{unit.adgroup_name}}</Option>
            </Select>
            <Button type="text" @click="handleClearImport">重置</Button>
          </FormItem>
        </Form>
        <!-- 推广单元设置 -->
        <h3 class="sub-title title-padding color-green">推广单元设置</h3>

        <Form ref="unitSetting" :model="unitSetting" :label-width="126" label-position="left">
          <FormItem label="所属推广计划">
            <p>{{ unitSetting.campaign_name }}</p>
          </FormItem>
          <FormItem label="推广单元名称">
            <Input v-model="unitSetting.adgroup_name" :maxlength="30" placeholder="推广单元名称" class="item-width"></Input>
            <span class="color-red">最多30个字符，且不能包含特殊字符</span>
          </FormItem>
          <FormItem label="推广方式">
            <RadioGroup @on-change="handleGeneralizeType" v-model="unitSetting.generalizeType">
              <Radio label="1">打开页面</Radio>
              <Radio label="2">APP下载</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-if="!isGeneralizePage" label="操作系统">
            <RadioGroup @on-change="handleAPPPlatform" v-model="unitSetting.platform">
              <Radio label="001">IOS</Radio>
              <Radio label="010">Android</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-if="isGeneralizePage" label="操作系统">
            <CheckboxGroup @on-change="handlePagePlatform" v-model="pagePlatform">
              <Checkbox label="001">IOS</Checkbox>
              <Checkbox label="010">Android</Checkbox>
              <Checkbox label="100">其他系统</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
        <!-- 推广定向设置 -->
        <Row type="flex" justify="start" align="middle" class="title-padding">
          <Col style="width:126px">
          <h3 class="sub-title color-green">定向设置</h3>
          </Col>
          <Col>
          <Select @on-change="handleChangeTargeting" v-model="targetingSetting.targeting_name" :clearable="true" class="item-width">
            <Option v-for="(targeting, index) in targetingList" :value="targeting.targeting_name" :key="targeting.targeting_id">{{targeting.targeting_name}}</Option>
          </Select>
          </Col>
        </Row>
        <Form ref="targetingSetting" :model="targetingSetting" :label-width="126" label-position="left">
          <FormItem label="自定义人群定向">
            <RadioGroup v-model="targetingSetting.audience_targeting">
              <Radio label="-1">不限</Radio>
              <Radio label="1">
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
              <Radio label="0">
                <span>排除用户群</span>
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
          </FormItem>
          <FormItem label="定向名称">
            <Input v-model="targetingSetting.targeting_name" :maxlength="30" placeholder="请输入定向名称" class="item-width"></Input>
            <span class="color-red">最多30个字符，且不能包含特殊字符</span>
          </FormItem>
          <FormItem label="投放地域">
            <RadioGroup @on-change="handleAllRegion" v-model="targetingSetting.all_region">
              <Radio label="-1">不限</Radio>
              <Radio label="0">省市</Radio>
              <!-- <Radio label="1">
                <span>区县</span>
                <Tooltip placement="top">
                  <Icon type="help-circled"></Icon>
                  <div slot="content">
                    <p>定向给最近30天活跃及实</p>
                    <p>时位于该区县的人群。</p>
                  </div>
                </Tooltip>
              </Radio> -->
            </RadioGroup>
            <div v-if="targetingSetting.all_region === '0'" class="regions-box">
              <Tree @on-check-change="handleChangeProvinceTree" :data="provinceTreeList" show-checkbox></Tree>
            </div>
          </FormItem>
          <FormItem label="性别">
            <RadioGroup @on-change="handleGender" v-model="targetingSetting.gender">
              <Radio label="-1">不限</Radio>
              <Radio label="1">男</Radio>
              <Radio label="0">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="年龄">
            <RadioGroup @on-change="handleAge" v-model="targetingAgeStatus">
              <Radio label="-1">不限</Radio>
              <Radio label="1">自定义</Radio>
              <!-- <Radio :label="targetingAge" v-model="targetingAge" :true-value="targetingAge">自定义</Radio> -->
            </RadioGroup>
            <CheckboxGroup v-if="targetingAgeStatus === '1'" @on-change="handleChangeCustomAge" v-model="targetingCustomAgeList">
              <Checkbox label="<=18">&lt;=18</Checkbox>
              <Checkbox label="19-24">19-24</Checkbox>
              <Checkbox label="25-29">25-29</Checkbox>
              <Checkbox label="30-39">30-39</Checkbox>
              <Checkbox label="40-49">40-49</Checkbox>
              <Checkbox label=">=50">&gt;=50</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="兴趣与行为定向">
            <RadioGroup v-model="targetingSetting.user_targeting">
              <Radio label="-1">不限</Radio>
              <Radio label="1">自定义</Radio>
            </RadioGroup>
            <!-- <Tabs value="">
              <TabPane label="标签一" name="name1">
                <div class="interesting">
                  <div class="interest-item">
                    <type-tree tree-title="游戏类" :tree-data=""></type-tree>
                  </div>
                  <div class="interest-item">
                    <type-tree tree-title="软件类" :tree-data=""></type-tree>
                  </div>
                  <div class="interest-item">

                  </div>
                </div>
              </TabPane>
              <TabPane label="标签二" name="name2">
                <div class="interesting">
                  <div class="interest-item">
                    <type-tree tree-title="游戏类" :tree-data=""></type-tree>
                  </div>
                  <div class="interest-item">
                    <type-tree tree-title="软件类" :tree-data=""></type-tree>
                  </div>
                  <div class="interest-item">

                  </div>
                </div>
              </TabPane>
            </Tabs> -->

            <div>
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
            </div>

          </FormItem>
          <FormItem label="网络环境">
            <RadioGroup v-model="targetingSetting.network_env">
              <Radio label="11">不限</Radio>
              <Radio label="01">WiFi</Radio>
              <Radio label="10">数据网络</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        {{this.targetingSetting}}
        <Row class="btn-submit">
          <Col>
          <Button @click="handleTargetingSumbit" type="primary">确认</Button>
          </Col>
        </Row>
        <!-- 出价设置 -->
        <h3 class="sub-title title-padding color-green">出价设置</h3>

        <Form ref="priceSetting" :model="unitSetting" :label-width="126" label-position="left">

          <FormItem label="转化类型">
            <Select @on-change="handleChangeConvertMonitorTypes" class="item-width">
              <Option v-for="(convertName, index) in convert.convertMonitorTypesList" :value="convertName.name" :key="index">{{convertName.name}}</Option>
            </Select>
            <span class="color-red">目前仅提供Android下载完成数据</span>
          </FormItem>

          <FormItem v-if="Array.isArray(convert.convertList) && convert.convertList.length > 0 || convert.convertList === 'object' && convert.convertList.convertId" label="转化名称">
            <Select @on-change="handleChangeConvertMonitorName" class="item-width">
              <Option v-for="(convertName, index) in convert.convertList" :value="convertName.name" :key="index">{{convertName.name}}</Option>
            </Select>
          </FormItem>
          {{this.unitSetting}}
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
            <RadioGroup v-model="unitSetting.optimizationTarget">
              <Radio label="1">点击</Radio>
              <Radio label="2">展现</Radio>
              <Radio label="3">转化</Radio>
            </RadioGroup>
            <span class="color-red">优化目标转化仅支持Android；IOS和其他操作系统将采用第一阶段出价进行出价</span>
          </FormItem>
          <FormItem label="计费方式">
            <RadioGroup v-model="unitSetting.chargeType">
              <Radio label="1">CPC</Radio>
              <Radio label="2">CPM</Radio>
            </RadioGroup>
            <span class="color-red">计费方式保存后不可修改</span>
          </FormItem>
          <FormItem label="出价">
            <InputNumber :max="101" :min="0.50" :step="10" v-model="unitSetting.bid" :precision="2" class="item-width"></InputNumber>元/点击
            <span class="color-red">请输入0.50-101之间的数字，精确到小数点后2位，单元出价需小于预算。</span>
          </FormItem>
          <FormItem>
            <p slot="label">第一阶段出价
              <Tooltip placement="top">
                <Icon type="help-circled"></Icon>
                <div slot="content">
                  <p>点击出价，累计转化数小于100处于该阶段，</p>
                  <p>与原有CPC方式一致，出价和计费方式均按</p>
                  <p>点击。</p>
                </div>
              </Tooltip>
            </p>
            <InputNumber :max="101" :min="0.50" :step="10" v-model="unitSetting.bid" :precision="2" class="item-width"></InputNumber>元/点击
            <span class="color-red">请输入0.50-101之间的数字，精确到小数点后2位，单元出价需小于预算。</span>
          </FormItem>
          <FormItem>
            <p slot="label">第二阶段出价
              <Tooltip placement="top">
                <Icon type="help-circled"></Icon>
                <div slot="content">
                  <p>期望转化成本，累计转化数大于等于100进</p>
                  <p>入该阶段，平台会根据出价智能竞价，计费</p>
                  <p>方式仍按点击计费，请将该出价尽量与实际</p>
                  <p>成本接近，出价高低会影响您获得的转化次</p>
                  <p>数，若设置过低会减少转化次数。</p>
                </div>
              </Tooltip>
            </p>
            <InputNumber :max="999.99" :min="1" :step="10" v-model="unitSetting.secondBid" :precision="2" class="item-width"></InputNumber>元/点击
            <span class="color-red">请输入1-999.99之间的数字，精确到小数点后2位</span>
          </FormItem>
        </Form>
        <!-- 出价设置 -->
        <h3 class="sub-title title-padding color-green">高级设置</h3>

        <Form ref="priceSetting" :model="unitSetting" :label-width="126" label-position="left">
          <!-- <RadioGroup v-model="">
            <Radio label="">拨打电话样式</Radio>
            <Radio label="">填写表单样式</Radio>
          </RadioGroup> -->
        </Form>

        <Row class="btn-submit">
          <Col>
          <Button @click="handleUnitSumbit" type="primary">确认</Button>
          <Button @click="handleGoBack" type="ghost">取消</Button>
          </Col>
        </Row>

      </Card> -->
      </Col>
      <Col span="3">
      <Card style="background-color:#f0f0f0;" dis-hover>
        <h3 class="evaluate-title color-green">
          流量预估
          <Tooltip placement="top">
            <Icon type="help-circled"></Icon>
            <div slot="content">
              <p>基于您当前设定的定向条件，</p>
              <p>预估能覆盖到的最大用户数，</p>
              <p>实际覆盖用户数还会受到竞争</p>
              <p>环境和出价影响</p>
            </div>
          </Tooltip>
        </h3>
        <div class="evaluate-content">
          <h4 class="evaluate-subtitle">预计最大覆盖月活跃用户数：</h4>
          <div class="evaluate-num color-green">{{evaluate.activeNum}}</div>
        </div>
        <div v-if="evaluate.platform" class="evaluate-content">
          <h4 class="evaluate-subtitle">操作系统：</h4>
          <div class="evaluate-text">{{evaluate.platform}}</div>
        </div>
        <div v-if="targetingSetting.all_region !== '-1' && evaluate.provinceTxt.length > 0" class="evaluate-content">
          <h4 class="evaluate-subtitle">地域：</h4>
          <div class="evaluate-text">
            {{evaluate.provinceTxt}}
          </div>
        </div>
        <div v-if="targetingSetting.gender !== '-1' && evaluate.genderTxt.length > 0" class="evaluate-content">
          <h4 class="evaluate-subtitle">性别：</h4>
          <div class="evaluate-text">
            {{evaluate.genderTxt}}
          </div>
        </div>
        <div v-if="targetingSetting.age !== '-1' && evaluate.ageTxt.length > 0" class="evaluate-content">
          <h4 class="evaluate-subtitle">年龄：</h4>
          <div class="evaluate-text">
            {{evaluate.ageTxt}}
          </div>
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
// 本地测试代码
// import planList from "../simple/plan";
// import unitList from "../simple/unit";
// import targetingList from "../simple/targeting";
import typeTree from "./typeTree";
import Axios from "@/api/index";
const ERR_OK = 1;
export default {
  data() {
    return {
      isEdit: false, // 推广单页状态：true为编辑状态，false为新建状态
      // 获取同步的 导入推广数据
      importDate: {
        planlist: {}, // 推广计划数据
        unitlist: {} // 推广单元数据
      },
      adgroupId: "", // 编辑时的推广单元id
      // 自定义推广单元数据
      unitSetting: {
        account_id: "",
        adgroup_name: "", // 推广单元名称
        campaign_id: 123456789, // 推广方式的id
        campaign_name: "", // 推广计划名称
        generalizeType: "1", // 推广方式
        adResourceId: 1, // 推广计划推广资源
        platform: "", // 操作系统
        chargeType: 1, // 计费方式
        bid: 0, // 出价
        secondBid: 0, // 第二阶段出价
        adconvertId: "", // 	转化id
        convertMonitorType: -1, // 转化监测类型
        optimizationTarget: "1", // 优化目标
        unitType: 0 // pp应用推广类型
      },
      unitAdgroupName: "", // 导入的推广单元名称
      // 获取同步的 定向数据
      targetingList: [],
      // 自定义定向设置数据
      targetingSetting: {
        account_id: "", // 账户id
        adgroup_id: "", // 推广单元id
        targeting_name: "", // 	定向名称
        audience: [], // 人群包定向id集合
        audience_targeting: "", // 自定义人群定向
        all_region: "-1", // 投放地域定向
        region: [], // 	地域id集合
        gender: "-1", // 性别定向
        age: "-1", // 	年龄定向
        user_targeting: "-1", // 兴趣与行为自定义
        interest: [], // 兴趣定向
        word: [], // 关键关键词定向
        url: [], // 	兴趣站点定向
        app: [], // app名称定向
        appcategory: 0, // app分类定向
        network_env: "11", // 	网络环境定向
        intelli_targeting: true, // 开启用户智能定向
        search_word: [], // 应用搜索关键词定向
        auto_search_word: false // 开启智能关键词
      },
      isGeneralizePage: true, // 推广方式状态： true 为 打开页面， false 为 APP下载
      pagePlatform: [], // 推广方式为打开页面时的数据
      // 右侧数据统计
      evaluate: {
        activeNum: 100, // 流量估计活跃量
        platform: "", // 操作系统数据
        provinceTxt: "", // 省市名称集合
        genderTxt: "", // 性别
        ageTxt: "" // 年龄
      },
      provinceList: [], // 获取同步的 省市地域列表
      provinceTreeList: [], // 省市Tree组件数据
      targetingAgeStatus: "-1", // 定向设置的年龄数据状态：-1为不限，1为自定义
      targetingCustomAgeList: [], // 自定义定向设置的年龄数据
      interestTypesList: [], // 获取同步的 兴趣列表
      // 转化对象
      convert: {
        convertMonitorTypesList: [], // 获取同步的 转化类型列表
        currConvertMonitorTypes: {}, // 当前操作的转化类型对象数据
        convertList: [] // 获取同步的 转化列表
      }
    };
  },
  mounted() {
    this.UNIT_PLATFORM_ARGUTMENT = ["001", "010", "100"];
    this.UNIT_PLATFORM_NUM = [1, 10, 100];
    this.getAccountInfo();
    this.$nextTick(() => {
      this.getInterestTypes();
      this.getConvertMonitorTypes();
      this.getProvince();
    });
  },
  created() {
    // init DATA
    this.unitSetting.account_id = this.$store.state.ucnew.accountId;
    this.getCampaignPlan();
    this.getCampaignUnit();
    this.getTargetingList();
  },
  methods: {
    // 获取操作系统数据
    getPlatform(data) {
      const env = ["IOS", "Android", "其他系统"];
      let retStr = "";
      if (data && data.length > 0) {
        if (typeof data === "string") {
          let arr = data.split("").reverse();
          for (let i = 0; i < data.length; i++) {
            if ("1" === arr[i]) {
              retStr += env[i] + "、";
            }
          }
        } else if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            switch (data[i]) {
              case "001":
                retStr += env[i] + "、";
                break;
              case "010":
                retStr += env[i] + "、";
                break;
              case "100":
                retStr += env[i] + "、";
                break;
            }
          }
        }
      } else {
        console.warn("请选择操作系统正确数据");
      }
      return retStr.substring(0, retStr.length - 1);
    },
    //  定向设置中自定义年龄的字符串转数组
    ageStrToArray(str) {
      if (!str && str.length < 1) {
        return;
      }
      const ageList = [">=50", "40-49", "30-39", "25-29", "19-24", "<=18"];
      let retArr = [];
      let currStr = "";
      ageList.forEach((age, index) => {
        currStr = str.charAt(index);
        if ("1" === currStr) {
          retArr.push(age);
        }
      });
      return retArr;
    },
    //  定向设置中自定义年龄的数组转字符串
    ageArrToString(list) {
      if (!list && !Array.isArray(list) && list.length < 1) {
        return;
      }
      const ageList = [">=50", "40-49", "30-39", "25-29", "19-24", "<=18"];
      let retTxt = ["0", "0", "0", "0", "0", "0"];
      list.forEach((c, ci) => {
        ageList.forEach((s, si) => {
          if (c === s) {
            retTxt[si] = "1";
          }
        });
      });
      return retTxt.join("");
    },
    //  对比两数组，符合条件则按照numList累加结果，返回字符串格式如： 111（推广单元中操作系统的选项转换）
    platformArrToString(currList, srcList, numList) {
      let total = 0;
      for (let c = 0; c <= currList.length - 1; c++) {
        for (let s = 0; s <= srcList.length - 1; s++) {
          if (srcList[s] === currList[c]) {
            total += numList[s];
          }
        }
      }
      let retStr = total.toString();
      console.log("platformArrToString", retStr, typeof retStr);
      if ("0" === retStr) {
        return "000";
      }
      if ("1" === retStr) {
        return "001";
      }
      if ("11" === retStr) {
        return "011";
      }
      if ("111" === retStr) {
        return "111";
      }
    },
    // 将字符串按照形式分割为数组（推广单元中操作系统的选项转换）
    platformStrToArray(str) {
      let ret = [];
      switch (str) {
        case "000":
          ret = ["000"];
          break;
        case "001":
          ret = ["001"];
          break;
        case "010":
          ret = ["010"];
          break;
        case "100":
          ret = ["100"];
          break;
        case "011":
          ret = ["010", "001"];
          break;
        case "110":
          ret = ["010", "100"];
          break;
        case "111":
          ret = ["100", "010", "001"];
          break;
      }
      console.log("platformStrToArray", ret, typeof ret);
      return ret;
    },
    // 事件：监听转化名称
    handleChangeConvertMonitorName(convertName) {
      let currConvertObj = this._getcurrList(
        this.convert.convertList,
        "name",
        convertName
      );
      this.unitSetting.adconvertId = currConvertObj.convertId;
      console.log("convertName", convertName, currConvertObj);
    },
    // 事件：监听转化类型
    handleChangeConvertMonitorTypes(convertType) {
      let currConvertObj = this._getcurrList(
        this.convert.convertMonitorTypesList,
        "name",
        convertType
      );
      this.unitSetting.convertMonitorType = currConvertObj.objType;
      this.convert.currConvertMonitorTypes = currConvertObj;
      this.getAdConvert(currConvertObj.objType);
      console.log("convertType", convertType, currConvertObj);
    },
    // 事件：监听自定义年龄数据
    handleChangeCustomAge(ageList) {
      let currStr = this.ageArrToString(ageList);
      this.targetingSetting.age = currStr;
      // 处理右侧evaluate.ageTxt 的输出
      if (Array.isArray(ageList) && ageList.length > 0) {
        let ageTxt = ageList.join("、");
        this.evaluate.ageTxt = ageTxt.substring(0, ageTxt.length - 1);
      }
    },
    // 事件：监听年龄数据
    handleAge(ageType) {
      if ("-1" === ageType) {
        this.targetingSetting.age = "-1";
      } else if ("1" === ageType) {
        if (this.targetingCustomAgeList.length > 0) {
          this.targetingSetting.age = this.ageArrToString(
            this.targetingCustomAgeList
          );
        } else {
          this.targetingSetting.age = "000000";
        }
      }
    },
    // 事件：监听性别数据
    handleGender(gender) {
      if ("1" === gender) {
        this.evaluate.genderTxt = "男";
      } else if ("0" === gender) {
        this.evaluate.genderTxt = "女";
      }
    },
    // 事件：监听省市数据
    handleChangeProvinceTree(provinceList) {
      if (!provinceList && provinceList.length < 1) {
        return;
      }
      let retName = [];
      let retValue = [];
      let retTxt = "";
      provinceList.forEach((city, index) => {
        retName.push(city.title);
        retValue.push(city.value);
      });
      this.targetingSetting.region = retValue;
      if (retName.length > 3) {
        retTxt = `${retName[0]}、${retName[1]}、${retName[2]}...等${
          retName.length
        }个地域`;
      } else {
        retName.forEach(name => {
          retTxt += name + "、";
        });
        retTxt = retTxt.substring(0, retTxt.length - 1);
      }
      this.evaluate.provinceTxt = retTxt;
    },
    // 事件：监听投放地段状态
    handleAllRegion(region) {
      switch (region) {
        case "-1":
          this.targetingSetting.all_region = region;
          break;
        case "0":
          this.targetingSetting.all_region = region;
          break;
        // case "1":
        //   this.targetingSetting.all_region = region;
        //   break;
      }
    },
    // 事件：监听当前APP推广方式状态
    handleAPPPlatform(statusList) {
      this.unitSetting.platform = statusList;
      this.evaluate.platform = this.getPlatform(statusList);
      console.log("handleAPPPlatform", statusList, this.unitSetting.platform);
    },
    // 事件：监听当前打开页面推广方式状态
    handlePagePlatform(statusList) {
      let platform = this.platformArrToString(
        statusList,
        this.UNIT_PLATFORM_ARGUTMENT,
        this.UNIT_PLATFORM_NUM
      );
      this.unitSetting.platform = platform;
      this.evaluate.platform = this.getPlatform(platform);
      console.log(
        "handlePagePlatform",
        statusList,
        this.unitSetting.platform,
        platform
      );
    },
    // 事件：监听推广方式状态
    handleGeneralizeType(status) {
      if ("1" === status) {
        this.isGeneralizePage = true;
      } else if ("2" === status) {
        this.isGeneralizePage = false;
      }
    },
    // 事件：新建定向设置
    handleTargetingSumbit() {},
    // 事件：选择targeting
    handleChangeTargeting(target) {
      if (!target) {
        return;
      }
      let currTarget = this._getcurrList(
        this.targetingList,
        "targeting_name",
        target
      );
      const targeting = JSON.parse(currTarget.targeting);
      console.log("select target", target, currTarget);
      console.log("tar before", this.targetingSetting);
      this._assignMethod(this.targetingSetting, targeting);
      this.targetingSetting.account_id = currTarget.account_id;
      this.targetingSetting.targeting_id = currTarget.targeting_id;
      this.targetingSetting.targeting_name = currTarget.targeting_name;
      // 推广单元 单选和复选操作的年龄数据
      this.targetingSetting.age = targeting.age;
      this.targetingAgeStatus = targeting.age === "-1" ? "-1" : "1";
      this.targetingCustomAgeList = this.ageStrToArray(
        targeting.age === "-1" ? "000000" : targeting.age
      );
      // 右侧 年龄数据
      let ageTxt = this.ageStrToArray(targeting.age).join("、");
      this.evaluate.ageTxt =
        targeting.age === "-1" ? "" : ageTxt.substring(0, ageTxt.length);
      console.log(
        "tar after",
        targeting.age,
        typeof targeting.age,
        targeting.age === "-1",
        this.targetingAgeStatus,
        this.targetingSetting
      );
    },
    // 更新推广单元数据
    updateUnit() {},
    // 新建推广单元数据
    addUnit() {},
    // 事件：新建推广单元
    handleUnitSumbit() {
      if (this.isEdit) {
        this.updateUnit();
      } else {
        this.addUnit();
      }
    },
    clearSingleSelect(...arg) {
      console.log(arg);
    },
    // 事件：返回计划列表
    handleGoBack() {
      this.$router.go(-1);
    },
    // 事件：重置导入推广单元的数据与显示
    handleClearImport() {
      this.unitAdgroupName = "";
      this.unitSetting.campaign_name = "";
      this.unitSetting.adgroup_name = "";
      this.pagePlatform = [];
      this.evaluate.platform = "";
    },
    // 事件：处理导入推广单元的计划数据
    handleChangeImportPlan(plan) {
      console.log(plan);
      this.unitSetting.campaign_name = plan;
    },
    // 事件：处理导入推广单元的单元数据
    handleChangeImportUnit(unit) {
      let currUnit = this._getcurrList(
        this.importDate.unitlist,
        "adgroup_name",
        unit
      );
      if (!currUnit) {
        return;
      }
      console.log("select unit", unit, currUnit);
      this._assignMethod(this.unitSetting, currUnit);
      this.unitSetting.bid = parseInt(this.unitSetting.bid);
      this.unitSetting.secondBid = parseInt(this.unitSetting.secondBid);
      this.pagePlatform = this.platformStrToArray(this.unitSetting.platform);
      this.evaluate.platform = this.getPlatform(this.unitSetting.platform);
      this.unitSetting.chargeType = currUnit.chargeType;
    },
    // 初始化省市地域列表
    normalizeProvinceList() {
      const ret = [];
      this.provinceList.forEach((province, pi) => {
        ret.push({
          title: province.name,
          expand: false,
          value: province.value,
          children: []
        });
        province.cityList.forEach((city, ci) => {
          ret[pi].children.push({
            title: city.name,
            expand: false,
            value: city.value
          });
        });
      });
      this.provinceTreeList = ret;
    },
    // 获取转化列表
    getAdConvert(objType) {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getAdConvert",
        account_id: this.$route.query.account,
        convertMonitorType: objType
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.convert.convertList = res.data;
            console.log("获取转化列表", this.convert.convertList);
          }
        })
        .catch(err => {
          console.log("获取转化列表错误：" + err);
        });
    },
    // 获取转化类型列表
    getConvertMonitorTypes() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getConvertType",
        account_id: this.$route.query.account
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.convert.convertMonitorTypesList = res.data;
            console.log(
              "获取转化类型列表",
              this.convert.convertMonitorTypesList
            );
          }
        })
        .catch(err => {
          console.log("获取转化类型列表错误：" + err);
        });
    },
    // 获取兴趣列表
    getInterestTypes() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getInterest",
        account_id: this.$route.query.account
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.interestTypesList = res.data.interestTypes;
            console.log("获取兴趣列表", this.interestTypesList);
          }
        })
        .catch(err => {
          console.log("获取兴趣列表错误：" + err);
        });
    },
    // 获取省市地域列表
    getProvince() {
      // console.log("xxx", this.unitSetting.account_id);
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getProvince",
        account_id: this.$route.query.account
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.provinceList = res.data.provinces;
            this.normalizeProvinceList();
            console.log("获取省市地域列表", this.provinceList);
          }
        })
        .catch(err => {
          console.log("获取省市地域列表错误：" + err);
        });
    },
    // 获取推广单元数据
    getCampaignUnit() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getAdgroupsList",
        campaign_id: "30428830"
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.importDate.unitlist = res.data;
            console.log(
              "单元this.importDate.unitlist",
              this.importDate.unitlist
            );
          }
        })
        .catch(err => {
          console.log("获取推广单元数据错误：" + err);
        });
      // 本地测试代码
      // this.importDate.unitlist = unitList.data;
    },
    // 获取推广计划数据
    getCampaignPlan() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getCampaignsList"
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.importDate.planlist = res.data;
            console.log(
              "单元this.importDate.planlist",
              this.importDate.planlist
            );
          }
        })
        .catch(err => {
          console.log("获取推广计划数据错误：" + err);
        });
      // 本地测试代码
      // this.importDate.planlist = planList.data;
    },
    // 获取定向设置数据
    getTargetingList() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getTargetingList"
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.targetingList = res.data;
            console.log("targetingList", this.targetingList);
          }
        })
        .catch(err => {
          console.log("获取定向设置数据错误：" + err);
        });
      // 本地测试代码
      // this.targetingList = targetingList.data;
    },
    // 获取account信息
    getAccountInfo() {
      const query = this.$route.query;
      const params = this.$route.params;
      console.log("unit router query", query, params);

      this.adgroupId = params.adgroup_id;
      if (
        typeof query === "object" &&
        query.account &&
        query.campaign_id &&
        query.edit &&
        query.edit === "1"
      ) {
        if (params && params.account_id) {
          this._assignMethod(this.unitSetting, params);
          this.unitSetting.bid = parseInt(this.unitSetting.bid);
          this.unitSetting.secondBid = parseInt(this.unitSetting.secondBid);
          this._assignMethod(this.targetingSetting, params);
          this.isEdit = true;
        } else {
          this.handleGoBack();
        }
      } else {
        this.isEdit = false;
      }
    },
    /**
     * 赋值函数
     * @augments tar data变量里面的自定义对象
     * @argument src 将要获取值的对象
     */
    _assignMethod(tar, src) {
      for (let k in tar) {
        if (src[k] && src.hasOwnProperty(k)) {
          tar[k] = src[k];
        }
      }
      console.log("_assignMethod", tar, src);
    },
    /**
     * 返回匹配的数组
     * @augments list 将要对比的数组集合
     * @argument name 将要对比的名称
     * @returns ret 返回匹配的对象集合
     */
    _getcurrList(list, type, name) {
      const ret = [];
      list.forEach(item => {
        if (item[type] === name) {
          ret.push(item);
        }
      });
      return ret[0];
    }
  },
  components: {
    typeTree
  }
};
</script>
