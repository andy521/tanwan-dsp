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
.interesting {
  .interest-item {
    float: left;
    width: 260px;
  }
  .interest-word-content {
    position: relative;
    width: 240px;
    height: 270px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    .interest-tip {
      position: absolute;
      padding: 0 10px;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 32px;
      background-color: #e6e6e6;
    }
  }
}
.g-card {
  border-color: transparent;
}
.g-card .ivu-card-body {
  padding: 0 16px;
}
.new-unit-panel{
  flex: 1;
}
.new-unit-statistics{
  flex: 0 0 240px;
  width: 240px;
  z-index: 100;
}
</style>

<template>
  <div class="uc-unit">
    <Row type="flex" justify="start">
      <Col class-name="new-unit-panel">
      <Card dis-hover bordered>

        <Button slot="title" type="text" @click="handleGoBack" class="padding-left-0 color-green">
          <Icon type="chevron-left"></Icon>
          返回单元列表
        </Button>
        <!-- 导入推广单元 -->
        <Form v-if="!isEdit" :label-width="126" label-position="left">
          <FormItem class="border-import">
            <h3 slot="label" class="sub-title">导入推广单元</h3>
            <Select @on-change="handlePlanChange" v-model="campaignId" class="item-width">
              <Option v-if="!isEdit && plan.campaign_name.length" v-for="(plan, index) in importDate.planNameList" :value="plan.campaign_id" :key="index">{{plan.campaign_name}}</Option>
            </Select>
            <Select @on-change="handleUnitChange" v-model="adgroupId" :loading="loading" loading-text="加载中，请稍后..." class="item-width">
              <Option v-if="!isEdit && unit.adgroup_name.length" v-for="(unit, index) in importDate.unitNameList" :value="unit.adgroup_id" :key="index">{{unit.adgroup_name}}</Option>
            </Select>
            <Button type="text" @click="handleClearImport">重置</Button>
          </FormItem>
        </Form>
        <!-- 推广单元设置 -->
        <h3 class="sub-title title-padding color-green">推广单元设置</h3>

        <Form ref="unitSetting" :model="unitSetting" :label-width="126" label-position="left">
          <FormItem label="所属推广计划">
            <p>{{ campaign_name }}</p>
          </FormItem>
          <FormItem label="推广单元名称">
            <Input @on-change="handleUnitName" v-model="unitSetting.adgroup_name" :maxlength="30" placeholder="推广单元名称" class="item-width"></Input>
            <span class="color-red">最多30个字符，且不能包含特殊字符</span>
          </FormItem>
          <FormItem label="推广方式">
            <RadioGroup @on-change="handleGeneralizeType" v-model="unitSetting.generalizeType">
              <Radio :disabled="isEdit" label="1">打开页面</Radio>
              <Radio :disabled="isEdit" label="2">APP下载</Radio>
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
          <Select v-if="!isEdit" @on-change="handleChangeTargeting" :loading="loading" loading-text="加载中，请稍后..." v-model="currTargetName" class="item-width">
            <Option v-if="targetingList && targetingList.length > 0 && targeting.targeting_name !== null" v-for="(targeting, index) in targetingList" :value="targeting.targeting_name" :key="index">{{targeting.targeting_name}}</Option>
          </Select>
          </Col>
        </Row>
        <Form ref="targetingSetting" :model="targetingSetting" :label-width="126" label-position="left">
          <!-- <FormItem label="自定义人群定向">
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
          </FormItem> -->
          <FormItem label="定向名称">
            <Input @on-blur="handleTargetingName" v-model="targetingSetting.targeting_name" :maxlength="30" placeholder="请输入定向名称" class="item-width"></Input>
            <span class="color-red">最多30个字符，且不能包含特殊字符</span>
          </FormItem>
          <FormItem label="投放地域">
            <RadioGroup @on-change="handleAllRegion" v-model="targetingSetting.all_region">
              <Radio label="1">不限</Radio>
              <Radio label="0">省市</Radio>
              <Radio label="2">
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
            <Tabs v-if="targetingSetting.user_targeting === '1'" @on-click="handleInterestTab" v-model="interestTab" :animated="false">
              <TabPane label="兴趣定向" name="interestTargeting">
                <div class="interesting">
                  <div class="interest-item">
                    <type-tree @on-change="handleInterestCat" tree-title="兴趣分类" :tree-data="interestTreeList" :tips-text="interestCat"></type-tree>
                  </div>
                  <div class="interest-item">
                    <h4 class="title">
                      <Checkbox v-model="isInterestWord" :disabled="true">
                        兴趣关键词
                        <Tooltip placement="bottom" :transfer="true">
                          <Icon type="help-circled"></Icon>
                          <div slot="content">
                            <p>请填写定向关键词，这些关键词可以</p>
                            <p>与您的产品或业务相关，或者与您的</p>
                            <p>目标用户相关。</p>
                            <p>广告将定向展现给与所填关键词相关</p>
                            <p>联的用户，比如用户曾经搜索过这些</p>
                            <p>关键词或者浏览过与这些关键词有关</p>
                            <p>的文章。</p>
                            <p>每个单元中最多填写200个关键词，</p>
                            <p>每个关键词长度不超过15个汉字或</p>
                            <p>30个英文字符；填写时请注意，每</p>
                            <p>个关键词占一行。</p>
                          </div>
                        </Tooltip>
                      </Checkbox>
                    </h4>
                    <div class="interest-word-content">
                      <Input @on-enter="handlerInterestWord" v-model="interestWord" type="textarea" :rows="11"></Input>
                      <div class="interest-tip">已添加{{targetingSetting.word.length}}个，还可以添加{{200 -targetingSetting.word.length}}个。</div>
                    </div>
                  </div>
                  <div class="interest-item">
                    <h4 class="title">
                      <Checkbox v-model="isInterestURL" :disabled="true">
                        兴趣站点
                        <Tooltip placement="bottom" :transfer="true">
                          <Icon type="help-circled"></Icon>
                          <div slot="content" style="max-width:580px">
                            <p>填写定向URL，这些URL可以与您的产品或业务相关，或者与您的目标用户相关。</p>
                            <p>广告将定向展现给与所填URL相关联的用户，比如用户曾经浏览这些网站。</p>
                            <p>每个单元最多填写200个URL，填写时请注意，每个URL占一行，不要连同</p>
                            <p>http://或https:// 一起填写。</p>
                            <p>正确的URL示例：www.example.com 或者 site.example.com </p>
                            <p>不正确的URL示例：http://www.example.com 或者</p>
                            <p>https://www.example.com?id123456&p=123&PMTI4NTE0ODQ5NDU1OTM2NDBfOTIyMzM3MDU1M</p>
                          </div>
                        </Tooltip>
                      </Checkbox>
                    </h4>
                    <div class="interest-word-content">
                      <Input @on-enter="handlerInterestURL" v-model="interestURL" type="textarea" :rows="11"></Input>
                      <div class="interest-tip">已添加{{targetingSetting.url.length}}个，还可以添加{{200 - targetingSetting.url.length}}个。</div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane label="APP定向" name="APPTargeting">
                <div class="interesting">
                  <div class="interest-item">
                    <type-tree @on-change="handleInterestAPP" tree-title="游戏类" :tree-data="interestAPPGameTreeList" :interest-value="2"></type-tree>
                  </div>
                  <div class="interest-item">
                    <type-tree @on-change="handleInterestAPP" tree-title="软件类" :tree-data="interestAPPSFTreeList" :interest-value="1"></type-tree>
                  </div>
                  <div class="interest-item">
                    <h4 class="title">
                      <Checkbox v-model="isInterestURL" :disabled="true">
                        APP名称
                      </Checkbox>

                    </h4>
                    <div class="text-left">
                      <Input v-model="interestSearch" clearable style="width: 200px"></Input>
                      <Button @click="handleSearchApp" type="ghost">搜索</Button>
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs>

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
            <RadioGroup @on-change="handleNewWorkEnv" v-model="targetingSetting.network_env">
              <Radio label="11">不限</Radio>
              <Radio label="01">WiFi</Radio>
              <Radio label="10">数据网络</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
     
        <Row class="btn-submit">
          <Col>
          <Button @click="handleTargetingSumbit" type="primary">确认</Button>
          </Col>
        </Row>
        <!-- 出价设置 -->
        <h3 class="sub-title title-padding color-green">出价设置</h3>

        <Form ref="priceSetting" :model="unitSetting" :label-width="126" label-position="left">

          <FormItem label="转化类型">
            <Select @on-change="handleChangeConvertMonitorTypes" :loading="loading" loading-text="加载中，请稍后..." v-model="convert.convertMonitorTypeName" :disabled="isconvertTypeStatus" class="item-width">
              <Option v-if="convert.convertMonitorTypesList.length > 0" v-for="(convertName, index) in convert.convertMonitorTypesList" :value="convertName.name" :key="index">{{convertName.name}}</Option>
            </Select>
            <span v-if="JSON.stringify(convert.currConvertMonitorTypes) !== '{}' && convert.currConvertMonitorTypes.name === '下载'" class="color-red">目前仅提供Android下载完成数据</span>
          </FormItem>

          <FormItem v-if="JSON.stringify(convert.currConvertMonitorTypes) !== '{}' && convert.currConvertMonitorTypes.name !== '下载'" label="转化名称">
            <Select @on-change="handleChangeConvertMonitorName" :loading="loading" loading-text="加载中，请稍后..." class="item-width">
              <Option v-if="convert.convertList.length > 0" v-for="(convertName, index) in convert.convertList" :value="convertName.name" :key="index">{{convertName.name}}</Option>
            </Select>
            <span v-if="convert.convertMonitorTypeName !== '下载' && convert.convertMonitorTypeName !== '激活'" class="color-red">该账户的转化目标暂不可用,请跳转到
              <a href="#">推广工具</a> 配置转化跟踪。</span>
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
            <RadioGroup @on-change="handleChangeOptimizationTarget" v-model="unitSetting.optimizationTarget">
              <Radio :disabled="isOptTarConvertStatus" label="1">点击</Radio>
              <Radio :disabled="isOptTarConvertZXStatus" label="2">展现</Radio>
              <Radio :disabled="isOptTarConvertStatus" v-if="(convert.currConvertMonitorTypes && convert.currConvertMonitorTypes.name === '下载') || (convert.currConvertMonitorTypes && convert.currConvertMonitorTypes.name === '激活')" label="3">转化</Radio>
            </RadioGroup>
            <span v-if="unitSetting.optimizationTarget === '3'" class="color-red">优化目标转化仅支持Android；IOS和其他操作系统将采用第一阶段出价进行出价</span>
          </FormItem>
          <FormItem label="计费方式">
            <RadioGroup v-model="unitSetting.chargeType">
              <Radio label="1" disabled>CPC</Radio>
              <Radio label="2" disabled>CPM</Radio>
            </RadioGroup>
            <span class="color-red">计费方式保存后不可修改</span>
          </FormItem>
          <FormItem v-if="unitSetting.optimizationTarget !== '3'" label="出价">
            <InputNumber @on-change="handleBid" :max="101" :min="0.50" :step="10" v-model="unitSetting.bid" :precision="2" class="item-width"></InputNumber>
            <span v-if="unitSetting.optimizationTarget === '1'">元/点击</span>
            <span v-if="unitSetting.optimizationTarget === '1'" class="color-red">请输入0.50-101之间的数字，精确到小数点后2位，单元出价需小于预算。</span>
            <span v-if="unitSetting.optimizationTarget === '2'">元/千次展现</span>
            <span v-if="unitSetting.optimizationTarget === '2'" class="color-red">请输入8-101之间的数字，精确到小数点后2位，单元出价需小于预算。</span>
          </FormItem>
          <FormItem v-if="unitSetting.optimizationTarget === '3'">
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
            <InputNumber @on-change="handleBid" :max="101" :min="0.50" :step="10" v-model="unitSetting.bid" :precision="2" class="item-width"></InputNumber>元/点击
            <span class="color-red">请输入0.50-101之间的数字，精确到小数点后2位，单元出价需小于预算。</span>
          </FormItem>
          <FormItem v-if="unitSetting.optimizationTarget === '3'">
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
            <InputNumber @on-change="handleSecondBid" :max="999.99" :min="1" :step="10" v-model="unitSetting.secondBid" :precision="2" class="item-width"></InputNumber>元/转化
            <span class="color-red">请输入1-999.99之间的数字，精确到小数点后2位</span>
          </FormItem>
        </Form>
        <!-- 出价设置 -->
        <!-- <h3 class="sub-title title-padding color-green">高级设置</h3>
        <Form ref="priceSetting" :model="unitSetting" :label-width="126" label-position="left">
          <RadioGroup v-model="unitSetting.unitType">
            <Radio label="0">拨打电话样式</Radio>
            <Radio label="2">填写表单样式</Radio>
          </RadioGroup>
        </Form> -->

        <Row class="btn-submit">
          <Col>
          <Button @click="handleUnitSumbit" type="primary">确认</Button>
          <Button @click="handleGoBack" type="ghost">取消</Button>
          </Col>
        </Row>

      </Card>
      </Col>
      <Col class-name="new-unit-statistics">
      <Card style="background-color:#f0f0f0;" class="g-card" dis-hover>
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
          <div class="evaluate-num color-green">{{evaluate.activeTxt}}</div>
        </div>
        <div v-if="evaluate.platform" class="evaluate-content">
          <h4 class="evaluate-subtitle">操作系统：</h4>
          <div class="evaluate-text">{{evaluate.platform}}</div>
        </div>
        <div v-if="targetingSetting.all_region !== '1' && evaluate.provinceTxt.length > 0" class="evaluate-content">
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
        <div v-if="this.evaluate.interestCatTxt.length > 0" class="evaluate-content">
          <h4 class="evaluate-subtitle">兴趣定向-分类：</h4>
          <div class="evaluate-text">
            {{evaluate.interestCatTxt}}
          </div>
        </div>
        <div v-if="this.evaluate.interestWordTxt.length > 0" class="evaluate-content">
          <h4 class="evaluate-subtitle">兴趣定向-关键词：</h4>
          <div class="evaluate-text">
            {{evaluate.interestWordTxt}}
          </div>
        </div>
        <div v-if="this.evaluate.interestURLTxt.length > 0" class="evaluate-content">
          <h4 class="evaluate-subtitle">兴趣定向-站点：</h4>
          <div class="evaluate-text">
            {{evaluate.interestURLTxt}}
          </div>
        </div>
        <div v-if="this.evaluate.interestAPPGameTxt.length > 0" class="evaluate-content">
          <h4 class="evaluate-subtitle">APP定向-游戏类：</h4>
          <div class="evaluate-text">
            {{evaluate.interestAPPGameTxt}}
          </div>
        </div>
        <div v-if="this.evaluate.interestAPPSFTxt.length > 0" class="evaluate-content">
          <h4 class="evaluate-subtitle">APP定向-软件类：</h4>
          <div class="evaluate-text">
            {{evaluate.interestAPPSFTxt}}
          </div>
        </div>
        <div v-if="this.evaluate.interestAPPNameTxt.length > 0" class="evaluate-content">
          <h4 class="evaluate-subtitle">APP定向-APP名称：</h4>
          <div class="evaluate-text">
            {{evaluate.interestAPPNameTxt}}
          </div>
        </div>

        <div v-if="this.evaluate.netWorkEnvTxt.length > 0" class="evaluate-content">
          <h4 class="evaluate-subtitle">网络环境:</h4>
          <div class="evaluate-text">
            {{evaluate.netWorkEnvTxt}}
          </div>
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
// 本地测试代码
// import unitNameList from '../simple/getAdgroupNameList.json'
// import unitbyid from '../simple/getAdgroupById.json'
// import targetingList from '../simple/targeting.json'
// import provincesList from '../simple/province.json'
// import interestList from '../simple/interest.json'
// import getAppCategory from '../simple/getAppCategory.json'
// import convertTypeList from '../simple/convertType.json'
// import getAdConvert from '../simple/getAdConvert.json'
// import getCampaignNameList from '../simple/getCampaignNameList.json'
import typeTree from './typeTree'
import Axios from '@/api/index'
const ERR_OK = 1
export default {
  data() {
    return {
      loading: false, // 加载中
      isEdit: false, // 推广单页状态：true为编辑状态，false为新建状态
      isOptTarConvertZXStatus: false, // 编辑状态下,优化目标为展现是，则不可编辑
      isOptTarConvertStatus: false, // 编辑状态下，优化目标为点击时，则可更改为转化, 其他状态下都为不可编辑。状态：true为不可编辑，false为可编辑
      isconvertTypeStatus: false, // converType已经选择的状态下，convertMonitorType默认值为0时不可编辑。状态：true为不可编辑，false为可编辑
      isTargetingSubmit: false, // 判断定向设置是否提交了。提交为true
      isUnitSubmitStatus: false, // 单元提交按钮（新建与编辑下都有效）。状态：true为可以提交，false为不可提交
      isEditTargetingChange: 0, // 判断在编辑状态下定向内容是否更改，若更改定向则需要重新提交。isEditTargetingChange数字大于0则更改
      // 获取同步的 导入推广数据
      importDate: {
        planNameList: [], // 推广计划数据
        unitNameList: [] // 推广单元数据
      },
      currId: 0, // 在编辑状态下的id
      campaignId: '', // 导入计划的id
      adgroupId: '', // 编辑时的推广单元id
      targetingId: '', // 编辑时的定向id
      paused: -1, // 编辑时的开启状态
      campaign_name: '', // 推广计划名称
      // 自定义推广单元数据
      unitSetting: {
        account_id: '',
        adgroup_name: '', // 推广单元名称
        campaign_id: '', // 推广方式的id
        generalizeType: '1', // 推广方式
        adResourceId: 1, // 推广计划推广资源
        platform: '', // 操作系统
        chargeType: '1', // 计费方式
        bid: 0, // 出价
        secondBid: 0, // 第二阶段出价
        adconvertId: 0, // 转化id
        convertMonitorType: 0, // 转化监测类型
        optimizationTarget: '1', // 优化目标
        unitType: 0, // pp应用推广类型,
        targeting_id: '' // 新建定向时返回的id
      },
      // 获取同步的 定向数据
      targetingList: [],
      // 当前所选的 定向名称
      currTargetName: '',
      // 自定义定向设置数据
      targetingSetting: {
        account_id: this.$route.query.account, // 账户id
        targeting_name: '', // 定向名称
        audience: [], // 人群包定向id集合
        audience_targeting: '', // 自定义人群定向
        all_region: '1', // 投放地域定向
        region: [], // 地域id集合
        gender: '-1', // 性别定向
        age: '-1', // 年龄定向
        user_targeting: '-1', // 兴趣与行为自定义
        interest: [], // 兴趣定向
        word: [], // 关键关键词定向
        url: [], // 兴趣站点定向
        app: [], // app名称定向
        appcategory: [], // app分类定向
        network_env: '11', // 网络环境定向
        intelli_targeting: true, // 开启用户智能定向
        search_word: [], // 应用搜索关键词定向
        auto_search_word: false // 开启智能关键词
      },
      isGeneralizePage: true, // 推广方式状态： true 为 打开页面， false 为 APP下载
      pagePlatform: [], // 推广方式为打开页面时的数据
      // 右侧数据统计
      evaluate: {
        activeNum: 100, // 流量估计活跃量
        activeTxt: '',
        platform: '', // 操作系统数据
        provinceTxt: '', // 省市名称集合
        genderTxt: '', // 性别
        ageTxt: '', // 年龄
        interestCatTxt: '', //  兴趣定向 兴趣分类
        interestWordTxt: '', //  兴趣定向 兴趣关键词
        interestURLTxt: '', //  兴趣定向  兴趣站点
        interestAPPGameTxt: '', // APP定向 游戏类
        interestAPPSFTxt: '', // APP定向 软件类
        interestAPPNameTxt: '', // APP定向 APP名称
        netWorkEnvTxt: '' // 网络环境
      },
      // seleinterestAPPGameName: [], // 选中的app定向游戏类
      // seleinterestAPPSFName: [], // 选中的app定向软件类
      provinceList: [], // 获取同步的 省市地域列表
      provinceTreeList: [], // 省市Tree组件数据
      targetingAgeStatus: '-1', // 定向设置的年龄数据状态：-1为不限，1为自定义
      targetingCustomAgeList: [], // 自定义定向设置的年龄数据
      interestTab: 'interestTargeting', // 兴趣选项卡
      interestTypesList: [], // 获取同步的 兴趣列表
      interestTreeList: [], // 省市Tree组件数据
      interestCat: [
        '请选择定向兴趣，这些兴趣',
        '要与您的目标用户相关。广',
        '告将定向展现给与所选兴趣',
        '相关联的用户。'
      ], // 省市Tree组件数据 中 兴趣分类tip
      interestAPPList: [], // 获取同步的 APP定向列表
      interestAPPGameTreeList: [], // APP定向游戏Tree组件数据
      interestAPPSFTreeList: [], // APP定向软件Tree组件数据
      isInterestWord: false, // APP定向关键词状态
      isInterestURL: false, // APP定向站点状态
      interestWord: '', // APP定向关键词内容
      interestURL: '', // APP定向URL内容
      interestSearch: '', // APP定向search内容
      // 转化对象
      convert: {
        convertMonitorTypesList: [], // 获取同步的 转化类型列表
        convertMonitorTypesListCopy: [], // 获取同步的 转化类型列表 副本
        currConvertMonitorTypes: {}, // 当前操作的转化类型对象数据
        convertMonitorTypeName: '', // 当前操作的转化类型名称
        convertList: [] // 获取同步的 转化列表
      }
    }
  },
  mounted() {
    this.getAccountInfo()
    this.getTargetingList()
    this.getConvertMonitorTypes()
    this.$nextTick(() => {
    // 是否编辑状态下 获取 对应的数据
    if (this.isEdit) {
      const params = {id: this.currId}
      this.getAdgroupById(params)
    } else {
      this.getAdResourceId()
    }

      this.getProvince()
      this.getInterestTypes()
      this.getInterestAPP()
    })
  },
  created() {
    this.getCampaignNameList()
  },
  methods: {
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
    // 获取操作系统数据
    getPlatform(data) {
      const env = ['IOS', 'Android', '其他系统']
      let retStr = ''
      if (data && data.length > 0) {
        if (typeof data === 'string') {
          let arr = data.split('').reverse()
          for (let i = 0; i < data.length; i++) {
            if (arr[i] === '1') {
              retStr += env[i] + '、'
            }
          }
        } else if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            switch (data[i]) {
              case '001':
                retStr += env[i] + '、'
                break
              case '010':
                retStr += env[i] + '、'
                break
              case '100':
                retStr += env[i] + '、'
                break
            }
          }
        }
      } else {
        console.warn('请选择操作系统正确数据')
      }
      return retStr.substring(0, retStr.length - 1)
    },
    //  定向设置中自定义年龄的字符串转数组
    ageStrToArray(str) {
      let retArr = []
      if (typeof str === 'string') {
        if (str === '') {
          return retArr
        }
        const ageList = ['>=50', '40-49', '30-39', '25-29', '19-24', '<=18']
        let currStr = ''
        ageList.forEach((age, index) => {
          currStr = str.charAt(index)
          if (currStr === '1') {
            retArr.push(age)
          }
        })
      } else {
        return []
      }
      return retArr
    },
    //  定向设置中自定义年龄的数组转字符串
    ageArrToString(list) {
      if (!list && !Array.isArray(list) && list.length < 1) {
        return
      }
      const ageList = ['>=50', '40-49', '30-39', '25-29', '19-24', '<=18']
      let retTxt = ['0', '0', '0', '0', '0', '0']
      list.forEach((c, ci) => {
        ageList.forEach((s, si) => {
          if (c === s) {
            retTxt[si] = '1'
          }
        })
      })
      return retTxt.join('')
    },
    //  对比两数组，符合条件则按照numList累加结果，返回字符串格式如： 111（推广单元中操作系统的选项转换）
    platformArrToString(list) {
      const refer = ['001', '010', '100']
      const referNum = [1, 10, 100]
      let total = 0
      for (let c = 0; c <= list.length - 1; c++) {
        for (let s = 0; s <= refer.length - 1; s++) {
          if (refer[s] === list[c]) {
            total += referNum[s]
          }
        }
      }
      let retStr = total.toString()
      switch (retStr) {
        case '0':
          retStr = '000'
          break
        case '1':
          retStr = '001'
          break
        case '10':
          retStr = '010'
          break
        case '11':
          retStr = '011'
          break
      }
      return retStr
    },
    // 将字符串按照形式分割为数组（推广单元中操作系统的选项转换）
    platformStrToArray(str) {
      let ret = []
      switch (str) {
        case '000':
          ret = ['000']
          break
        case '001':
          ret = ['001']
          break
        case '010':
          ret = ['010']
          break
        case '100':
          ret = ['100']
          break
        case '011':
          ret = ['010', '001']
          break
        case '110':
          ret = ['010', '100']
          break
        case '111':
          ret = ['100', '010', '001']
          break
      }
      return ret
    },
    // 事件：监听app定向的app定向， 2为游戏，1为软件
    handleInterestAPP(list) {
      console.log(
        '事件：监听兴趣APPSF',
        list
      )
      let app = []
      let seleinterestAPPSFName = []
      let seleinterestAPPGameName = []
      list.list.forEach(inter => {
        app.push(inter.value)
        if (list.value === 1) {
          seleinterestAPPSFName.push(inter.title)
          this.evaluate.interestAPPSFTxt = this.normalizeTxtShow(seleinterestAPPSFName, 12)
        } else if (list.value === 2) {
          seleinterestAPPGameName.push(inter.title)
          this.evaluate.interestAPPGameTxt = this.normalizeTxtShow(seleinterestAPPGameName, 12)
        }
      })
      this.targetingSetting.app = app
      // 判断编辑状态下，定向更改
      if (this.isEdit) {
        this.isEditTargetingChange += 1
      }
    },
    /**
     * 序列化统计输出文本
     * @augments list {Array}
     * @augments length {Number}
     * @returns {String}
     */
    normalizeTxtShow(list, length) {
      if (!Array.isArray(list)) {
        return
      }
      const len = list.length
      let retTxt = ''
      if (len === 0) {
        return retTxt
      }
      if (len <= length) {
        retTxt = list.slice().join('、')
      } else if (typeof length == 'undefined') {
        retTxt = list.slice().join('、')
      } else {
        retTxt = `${list.slice(0, length).join('、')}等${list.length}个`
      }
      return retTxt
    },
    // 事件：监听兴趣word
    handlerInterestWord(e) {
      let word = e.target.value
      if (!word && this.targetingSetting.word.length >= 200) {
        this.interestWord = ths.targetingSetting.word.join()
        return
      }

      let wordList = word.split('\n')
      let val = wordList.filter(v => v.length > 0)
      let ret = val.length <= 200 ? val : val.slice(0, 200)
      this.targetingSetting.word =  ret
      this.evaluate.interestURLTxt = this.normalizeTxtShow(
        this.targetingSetting.word,
        8
      )

      // 判断编辑状态下，定向更改
      if (this.isEdit) {
        this.isEditTargetingChange += 1
      }
    },
    // 事件：监听兴趣url
    handlerInterestURL(e) {
      let url = e.target.value
      if (!url && this.targetingSetting.url.length >= 200) {
        this.isInterestURL = ths.targetingSetting.url.join()
        return
      }

      let urlList = url.split('\n')
      let val = urlList.filter(v => v.length > 0)
      let ret = val.length <= 200 ? val : val.slice(0, 200)
      this.targetingSetting.url =  ret
      this.evaluate.interestURLTxt = this.normalizeTxtShow(
        this.targetingSetting.url,
        8
      )
      // 判断编辑状态下，定向更改
      if (this.isEdit) {
        this.isEditTargetingChange += 1
      }
    },
    // 事件：监听兴趣分类
    handleInterestCat(list) {
      console.log("handleInterestCat", list)
      let interest = []
      let interestTitle = []
      list.list.forEach(inter => {
        if (inter.value) {
          interest.push(inter.value)
          interestTitle.push(inter.title)
        }
      })
      this.targetingSetting.interest = interest
      this.evaluate.interestWordTxt = this.normalizeTxtShow(interestTitle, 12)
      // 判断编辑状态下，定向更改
      if (this.isEdit) {
        this.isEditTargetingChange += 1
      }
    },
    // 事件：监听第一出价
    handleBid(bid) {
      const range = [0.5, 101]
      if (bid < range[0]) {
        this.isUnitSubmitStatus = false
        this.$Message.warning({
          title: '温馨提示',
          desc: '出价不能低于' + range[0]
        })
      } else if (bid > range[101]) {
        this.isUnitSubmitStatus = false
        this.$Message.warning({
          title: '温馨提示',
          desc: '出价不能高于' + range[1]
        })
      }
    },
    // 事件：监听第二出价
    handleSecondBid(secbid) {
      const range = [1, 999.99]
      if (secbid < range[0]) {
        this.isUnitSubmitStatus = false
        this.$Message.warning({
          title: '温馨提示',
          desc: '出价不能低于' + range[0]
        })
      } else if (secbid > range[101]) {
        this.isUnitSubmitStatus = false
        this.$Message.warning({
          title: '温馨提示',
          desc: '出价不能高于' + range[1]
        })
      }
    },
    // 事件：监听优化目标
    handleChangeOptimizationTarget(optimizationTarget) {
      const chargeType = ['1', '2']
      switch (optimizationTarget) {
        case '1':
          this.unitSetting.optimizationTarget = optimizationTarget
          this.unitSetting.chargeType = chargeType[0]
          break
        case '2':
          this.unitSetting.optimizationTarget = optimizationTarget
          this.unitSetting.chargeType = chargeType[1]
          break
        case '3':
          this.unitSetting.optimizationTarget = optimizationTarget
          this.unitSetting.chargeType = chargeType[1]
          break
      }
    },
    // 事件：监听转化名称
    handleChangeConvertMonitorName(convertName) {
      let currConvertObj = this._getcurrList(
        this.convert.convertList,
        'name',
        convertName
      )
      this.unitSetting.adconvertId = currConvertObj.convertId
    },
    // 事件：监听转化类型
    handleChangeConvertMonitorTypes(convertType) {
      if (!convertType) {
        return
      }
      // 下载监测类型只有投放uc头条，推广方式为打开页面的单元可以设置
      // 如果 推广计划推广资源adResourceId 不为 1uc头条， 转化类型 为 下载类型，同时 推广方式adResourceId   不为 1打开页面 则报错
      if (convertType === '下载') {
        if (
          this.unitSetting.generalizeType !== '1' &&
          this.unitSetting.adResourceId !== 1
        ) {
          this.isUnitSubmitStatus = false
          this.$Message.warning({
            title: '温馨提示：',
            desc: '只有计划中推广资源选择了UC头条，并且推广方式为打开页面时,才能选择下载类型'})
        } else {
          this.isUnitSubmitStatus = true
        }
      }
      // converType已经选择的状态下
      let currConvertObj = {}
      if (this.isconvertTypeStatus) {
        currConvertObj = this.convert.currConvertMonitorTypes
      } else {
        currConvertObj = this._getcurrList(this.convert.convertMonitorTypesList, 'name', convertType)
      }
      this.unitSetting.convertMonitorType = currConvertObj.objType
      this.convert.currConvertMonitorTypes = currConvertObj
      this.convert.convertMonitorTypeName = convertType
      this.getAdConvert(currConvertObj.objType)
      console.log('convertType', convertType, currConvertObj)
    },
    // 事件：监听自定义年龄数据
    handleChangeCustomAge(ageList) {
      let currStr = this.ageArrToString(ageList)
      this.targetingSetting.age = currStr
      // 处理右侧evaluate.ageTxt 的输出
      if (Array.isArray(ageList) && ageList.length > 0) {
        let ageTxt = ageList.slice().join('、')
        this.evaluate.ageTxt = ageTxt
      }
      // 判断编辑状态下，定向更改
      if (this.isEdit) {
        this.isEditTargetingChange += 1
      }
    },
    // 事件：监听年龄数据
    handleAge(ageType) {
      if (ageType === '-1') {
        this.targetingSetting.age = '-1'
      } else if (ageType === '1') {
        if (this.targetingCustomAgeList.length > 0) {
          this.targetingSetting.age = this.ageArrToString(
            this.targetingCustomAgeList
          )
        } else {
          this.targetingSetting.age = '000000'
        }
      }
      // 判断编辑状态下，定向更改
      if (this.isEdit) {
        this.isEditTargetingChange += 1
      }
    },
    // 事件：监听性别数据
    handleGender(gender) {
      if (gender === '1') {
        this.evaluate.genderTxt = '男'
      } else if (gender === '0') {
        this.evaluate.genderTxt = '女'
      }
      // 判断编辑状态下，定向更改
      if (this.isEdit) {
        this.isEditTargetingChange += 1
      }
    },
    // 事件：监听省市数据
    handleChangeProvinceTree(provinceList) {
      if (provinceList.length < 1) {
        return
      }
      let retName = []
      let retValue = []
      let retTxt = ''
      provinceList.forEach((city, index) => {
        retName.push(city.title)
        retValue.push(city.value)
        console.log('region', typeof city.value, city.value)
      })
      this.targetingSetting.region = retValue
      if (retName === '') {
        retTxt = ''
        return
      } else if (retName.length > 3) {
        retTxt = `${retName[0]}、${retName[1]}、${retName[2]}...等${
          retName.length
        }个地域`
      } else {
        retName.forEach(name => {
          retTxt += name + '、'
        })
        retTxt = retTxt.substring(0, retTxt.length - 1)
      }
      this.evaluate.provinceTxt = retTxt

      // 判断编辑状态下，定向更改
      if (this.isEdit) {
        this.isEditTargetingChange += 1
      }
    },
    handleSearchApp() {
      this.getRecommend({type: 'app', seeds: [this.interestSearch]})
    },
    // 事件：兴趣选项卡
    handleInterestTab(name) {},
    // 事件：监听投放地段状态
    handleAllRegion(region) {
      switch (region) {
        case '1':
          this.targetingSetting.all_region = region
          break
        case '0':
          this.targetingSetting.all_region = region
          break
        case "2":
          this.targetingSetting.all_region = region
          break
      }
      // 判断编辑状态下，定向更改
      if (this.isEdit) {
        this.isEditTargetingChange += 1
      }
    },
    // 事件：监听当前APP推广方式状态
    handleAPPPlatform(statusList) {
      this.unitSetting.platform = statusList
      this.evaluate.platform = this.getPlatform(statusList)
    },
    // 事件：监听当前打开页面推广方式状态
    handlePagePlatform(statusList) {
      let platformStr = this.platformArrToString(statusList)
      this.unitSetting.platform = platformStr
      this.evaluate.platform = this.getPlatform(platformStr)
    },
    // 事件：监听推广方式状态
    handleGeneralizeType(status) {
      // 更换推广方式状态时 清除缓存
      this.convert.convertMonitorTypeName = ''
      this.convert.currConvertMonitorTypes = {}

      // 当generalizeType为2APP下载时，只支持 下载 转化
      const convertMonitorTypesList = this.convert.convertMonitorTypesListCopy.slice()
      if (status === '1') {
        this.convert.convertMonitorTypesList = convertMonitorTypesList
        this.isGeneralizePage = true
      } else if (status === '2') {
        convertMonitorTypesList.forEach(conv => {
          if (conv.name === '激活') {
            this.convert.convertMonitorTypesList = [conv]
          }
        })
        this.isGeneralizePage = false
      }
    },
    // 事件：监听网络环境
    handleNewWorkEnv(env) {
      const enName = ['', 'WIFI', '数据网络']
      const enKey = ['11', '01', '10']
      enKey.forEach((k, i) => {
        if (k === env) {
          this.evaluate.netWorkEnvTxt = enName[i]
        }
      })
    },
    // 编辑状态下， 更新定向
    updateTargeting() {
      console.log('定向params', this.targetingSetting)
      let params = {
        action: 'ucAdPut',
        opt: 'updateTargeting',
        account_id: this.targetingSetting.account_id,
        adgroup_id: this.adgroupId,
        targeting_name: this.targetingSetting.targeting_name,
        audience: this.targetingSetting.audience,
        audience_targeting: this.targetingSetting.audience_targeting,
        all_region: this.targetingSetting.all_region,
        region: this.targetingSetting.region,
        gender: this.targetingSetting.gender,
        age: this.targetingSetting.age,
        user_targeting: this.targetingSetting.user_targeting,
        interest: this.targetingSetting.interest,
        word: this.targetingSetting.word,
        url: this.targetingSetting.url,
        app: this.targetingSetting.app,
        appcategory: this.targetingSetting.appcategory,
        network_env: this.targetingSetting.network_env,
        intelli_targeting: this.targetingSetting.intelli_targeting,
        search_word: this.targetingSetting.search_word,
        auto_search_word: this.targetingSetting.auto_search_word
      }
      console.log('定向params', params)
      Axios.post('api.php', params)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.isTargetingSubmit = true
            this.unitSetting.targeting_id = res.data.targeting_id
            this.isEditTargetingChange = 0
            console.log('更新定向设置' + this.unitSetting.targeting_id)
            this.$Message.success('更新定向成功')
          }
        })
        .catch(err => {
          console.log('更新定向失败' + err)
        })
    },
    // 新建定向
    addTargeting() {
      let params = Object.assign({}, this.targetingSetting, {
        action: 'ucAdPut',
        opt: 'addTargeting',
        account_id: this.$route.query.account
      })
      console.log('定向params', params)
      Axios.post('api.php', params)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.isTargetingSubmit = true
            this.unitSetting.targeting_id = res.data.targeting_id
            console.log('新建定向设置' + this.unitSetting.targeting_id)
            this.$Message.success('新建定向成功')
          }
        })
        .catch(err => {
          console.log('新建定向失败' + err)
        })
    },
    // 事件：新建定向设置
    handleTargetingSumbit() {
      // 判断状态，在编辑状态下 或 在新建状态下 ， 若已经提交则更新定向
      if (this.isEdit) {
        this.updateTargeting()
      } else {
        if (!this.isTargetingSubmit) {
          this.$Message.warning({
            title: '温馨提示：',
            desc: '请填写正确数据再提交定向！'
          })
          return
        }
        this.addTargeting()
      }
    },
    handleTargetingName(val) {
      const range = [30]
      const str = this.targetingSetting.targeting_name
      const strLen = this.getByteLen(str)
      // 判断长度
      if (strLen > range[0]) {
        this.$Message.warning({
          title: '温馨提示',
          desc: `定向名称不能超过${range[0]}个字符`
        })
      }
      // 如果没有输入则不能提交单元和提交定向
      if (strLen > 0) {
        this.isUnitSubmitStatus = true
        this.isTargetingSubmit = true
      } else {
        this.isUnitSubmitStatus = false
        this.isTargetingSubmit = false
        this.$Message.warning({
          title: '温馨提示',
          desc: '定向名称不能为空'
        })
      }
      // 判断编辑状态下，定向更改
      if (this.isEdit) {
        this.isEditTargetingChange += 1
      }
    },
    handleUnitName(e) {
      const range = [30]
      let str = e.target.value
      let strLen = this.getByteLen(str)
      // 判断长度
      if (strLen > range[0]) {
        this.$Message.warning({
          title: '温馨提示',
          desc: `单元名称不能超过${range[0]}个字符`
        })
      }
      // 如果没有输入则不能提交单元
      if (str.length > 0) {
        this.isUnitSubmitStatus = true
      } else {
        this.isUnitSubmitStatus = false
        this.$Message.warning({
          title: '温馨提示',
          desc: '单元名称不能为空'
        })
      }
    },
    // 事件：选择targeting
    handleChangeTargeting(target) {
      if (!target) {
        return
      }
      this.currTargetName = target
      let currTarget = this._getcurrList(
        this.targetingList,
        'targeting_name',
        target
      )
      const targeting = JSON.parse(currTarget.targeting)
      this.isTargetingSubmit = true
      this._assignMethod(this.targetingSetting, targeting)
      this.targetingSetting.account_id = currTarget.account_id
      this.targetingSetting.targeting_name = currTarget.targeting_name + '-复制'
      // 推广单元 单选和复选操作的年龄数据
      this.targetingSetting.age = targeting.age
      this.targetingAgeStatus = targeting.age === '-1' ? '-1' : '1'
      this.targetingCustomAgeList = this.ageStrToArray(
        targeting.age === '-1' ? '000000' : targeting.age
      )
      // 右侧 年龄数据
      let ageTxt = this.ageStrToArray(targeting.age).join('、')
      this.evaluate.ageTxt =
        targeting.age === '-1' ? '' : ageTxt.substring(0, ageTxt.length)
      console.log(
        'tar after',
        targeting.age,
        typeof targeting.age,
        targeting.age === '-1',
        this.targetingAgeStatus,
        this.targetingSetting
      )
      // 投放地域
      if (this.targetingSetting.region.length > 0) {
        const provinceList = []
        this.targetingSetting.region.forEach(region => {
          this.provinceTreeList.forEach((vp, ip) => {
            if (region === vp.value) {
              vp.checked = true
              vp.expand = true
              provinceList.push(vp)
            }
            vp.children.forEach((vc, ic) => {
              if (region === vc.value) {
                vc.checked = true
                vc.expand = true
                provinceList.push(vc)
              }
            })
          })
        })
        this.handleChangeProvinceTree(provinceList)
      } else {
        this.evaluate.provinceTxt = ''
      }
      // 兴趣与行为定向
      let interestCatSelectedList = this.normalizeInterestTreeList(
        this.targetingSetting.interest,
        this.interestTreeList
      )
      let catNameList = []
      interestCatSelectedList.forEach(val => {
        catNameList.push(val.title)
        this.evaluate.activeNum += val.value
      })
      this.evaluate.interestCatTxt = this.normalizeTxtShow(catNameList, 3)
      this.evaluate.interestWordTxt = this.normalizeTxtShow(targeting.word, 3)
      this.evaluate.interestURLTxt = this.normalizeTxtShow(targeting.url, 3)
      this.interestWord =
        targeting.word.length > 0 ? targeting.word.join('、') : ''
      this.interestURL =
        targeting.url.length > 0 ? targeting.url.join('、') : ''
      // APP定向

      // 活跃数
      this.evaluate.activeTxt = this.normalizeActiveTxt(
        this.evaluate.activeNum
      )
      // 网络环境
      this.handleNewWorkEnv(this.targetingSetting.network_env)
    },
    // 初始化活跃用户数,传参为Number类型
    normalizeActiveTxt(activeNum) {
      console.log(activeNum)
      let len = activeNum.toString().length
      let retTxt = ''
      if (len < 5) {
        retTxt = activeNum
        return `${activeNum}`
      } else if (len < 8) {
        retTxt = Math.round(activeNum / 10000)
        return `${retTxt} 万 +`
      } else {
        retTxt = Math.round(activeNum / 1000000000)
        return `${retTxt} 亿 +`
      }
    },
    // 初始化导入的兴趣数组，并返回匹配数组
    normalizeInterestTreeList(arrList, srcList) {
      this.evaluate.activeNum = 0
      const ret = []
      arrList.forEach(tar => {
        srcList.forEach((vp, ip) => {
          if (tar === vp.value) {
            vp.checked = true
            vp.expand = true
            ret.push(vp)
          }
          vp.children.forEach((vc, ic) => {
            if (tar === vc.value) {
              vc.checked = true
              vc.expand = true
              ret.push(vc)
              this.evaluate.activeNum += vc.value
            }
          })
        })
      })
      return ret
    },
    // 更新推广单元数据
    updateUnit() {
      let update = {
        action: 'ucAdPut',
        opt: 'updateAdgroup',
        // do: 'edit',
        account_id: this.unitSetting.account_id,
        adgroup_id: this.adgroupId,
        adgroup_name: this.unitSetting.adgroup_name,
        campaign_id: parseInt(this.unitSetting.campaign_id),
        generalizeType: parseInt(this.unitSetting.generalizeType),
        adResourceId: parseInt(this.unitSetting.adResourceId),
        platform: this.unitSetting.platform,
        chargeType: parseInt(this.unitSetting.chargeType),
        paused: +this.paused,
        bid: this.unitSetting.bid.toString(),
        secondBid: this.unitSetting.secondBid.toString(),
        adconvertId: parseInt(this.unitSetting.adconvertId),
        convertMonitorType: parseInt(this.unitSetting.convertMonitorType),
        optimizationTarget: parseInt(this.unitSetting.optimizationTarget),
        unitType: parseInt(this.unitSetting.unitType)
      }
      console.log('edit this.unitSetting', update)
      Axios.post('api.php', update)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.adgroupId = res.adgroup_id
            this.$Message.success('更新推广单元数据成功')
            this.handleGoBack()
          }
        })
        .catch(err => {
          console.log('新建推广单元失败' + err)
        })
    },
    // 新建推广单元数据
    addUnit() {
      let update = Object.assign({}, this.unitSetting, {
        action: 'ucAdPut',
        opt: 'addAdgroup',
        campaign_id: parseInt(this.unitSetting.campaign_id),
        generalizeType: parseInt(this.unitSetting.generalizeType),
        adResourceId: parseInt(this.unitSetting.adResourceId),
        chargeType: parseInt(this.unitSetting.chargeType),
        adconvertId: parseInt(this.unitSetting.adconvertId),
        convertMonitorType: parseInt(this.unitSetting.convertMonitorType),
        optimizationTarget: parseInt(this.unitSetting.optimizationTarget),
        unitType: parseInt(this.unitSetting.unitType),
        targeting_id: + this.unitSetting.targeting_id,
        bid: this.unitSetting.bid.toString(),
        secondBid: this.unitSetting.secondBid.toString()
      })
      Axios.post('api.php', update)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.$Message.success('新建推广单元成功')
            this.$router.push({
              name: 'ucidea',
              query: {
                account: this.unitSetting.account_id,
                campaign_id: this.unitSetting.campaign_id,
                adgroup_id: res.data.adgroup_id
              }
            })
          }
        })
        .catch(err => {
          console.log('新建推广单元失败' + err)
        })
    },
    // 事件：新建推广单元
    handleUnitSumbit() {
      // 判断新建单元状态
      if (!this.isTargetingSubmit && !this.unitSetting.targeting_id) {
        this.handleTargetingSumbit()
      }
      if (this.isEdit && this.isEditTargetingChange > 0) {
        this.$Message.warning({
          title: '温馨提示：',
          desc: '定向内容已更改，请按确认按钮重新保存定向！'
        })
        return
      }
      // 判断编辑时状态
      if (this.isEdit) {
        this.updateUnit()
      } else {
        if (!this.isUnitSubmitStatus) {
          this.$Message.warning({
            title: '温馨提示：',
            desc: '请填写正确数据在提交单元！'
          })
          return
        }
        this.addUnit()
      }
    },
    // 事件：返回计划列表
    handleGoBack() {
      this.$router.go(-1)
    },
    // 事件：重置导入推广单元的数据与显示
    handleClearImport() {
      // 重置单元
      this.unitAdgroupName = ''
      this.unitSetting.adgroup_name = ''
      this.campaignId =  ''
      this.adgroupId =  ''

      this.pagePlatform = []
      this.evaluate.platform = ''
      this.unitSetting.platform = ''

      this.unitSetting.generalizeType = '1'
      this.unitSetting.adResourceId = 1
      this.unitSetting.adconvertId = 0

      this.unitSetting.convertMonitorType = -1
      this.convert.convertMonitorTypeName = ''
      this.convert.currConvertMonitorTypes = {}

      this.unitSetting.optimizationTarget = '1'
      this.handleChangeOptimizationTarget(this.unitSetting.optimizationTarget)

      this.unitSetting.bid = 0
      this.unitSetting.secondBid = 0

      this.unitSetting.unitType = 0
      this.unitSetting.targeting_id = ''

      // 重置定向
      this.currTargetName = ''

      this.targetingSetting.targeting_name = ''
      this.targetingSetting.audience = []
      this.targetingSetting.audience_targeting = []
      this.targetingSetting.all_region = '1'
      this.targetingSetting.region = []
      this.targetingSetting.gender = '-1'
      this.targetingSetting.age = '-1'
      this.targetingSetting.user_targeting = '-1'
      this.targetingSetting.interest = []
      this.targetingSetting.word = []
      this.targetingSetting.url = []
      this.targetingSetting.app = []
      this.targetingSetting.appcategory = []
      this.targetingSetting.network_env = '11'
      this.targetingSetting.intelli_targeting = true
      this.targetingSetting.search_word = []
      this.targetingSetting.auto_search_word = false

      // 重置数据统计
      this.evaluate.platform = ''
      this.evaluate.provinceTxt = ''
      this.evaluate.genderTxt = ''
      this.evaluate.ageTxt = ''
      this.evaluate.interestCatTxt = ''
      this.evaluate.interestWordTxt = ''
      this.evaluate.interestURLTxt = ''
      this.evaluate.interestAPPGameTxt = ''
      this.evaluate.interestAPPSFTxt = ''
      this.evaluate.interestAPPNameTxt = ''
      this.evaluate.netWorkEnvTxt = ''

      console.log(this.unitSetting,this.targetingSetting)
    },
    // 事件：处理导入推广单元的计划数据
    handlePlanChange(campaignId) {
      if (campaignId === '') {
        return
      }
      this.getAdgroupNameList(campaignId)
    },
    // 事件：处理导入推广单元的单元数据
    handleUnitChange(adgroupId) {
      if (adgroupId === '') {
        return
      }
      const params = {adgroupId: adgroupId}
      this.getAdgroupById(params)
    },
    // 初始化APP定向列表
    normalizeAPPList(appList, key) {
      const ret = []
      if (appList[0].children.length < 1) {
        return
      }
      appList.forEach((app, i) => {
        if (app.value === key) {
          app.children.forEach((appp, ip) => {
            ret.push({
              title: appp.name,
              expand: false,
              value: appp.value
            })
            appp.children.forEach((appc, ic) => {
              ret[ip].children.push({
                title: appc.name,
                expland: false,
                value: appc.value
              })
            })
          })
          if (this.targetingSetting.appcategory.length > 0) {
            this.targetingSetting.appcategory.forEach((value, iv) => {
              ret.forEach((reti, ir) => {
                if (value === ret.value) {
                  reti[ir].checked = true
                }
              })
            })
          }
        }
      })
      return ret
    },
    // 初始化兴趣列表
    normalizeInterestList(interestList) {
      this.evaluate.activeNum = 0
      const ret = []
      interestList.forEach((interp, ip) => {
        ret.push({
          title: interp.name,
          expand: false,
          value: interp.value,
          children: []
        })
        interp.children.forEach((interc, ic) => {
          ret[ip].children.push({
            title: interc.name,
            expand: false,
            value: interc.value
          })
          this.evaluate.activeNum += interc.value
        })
      })
      if (this.targetingSetting.interest.length > 0) {
        this.targetingSetting.interest.forEach((value, iv) => {
          ret.forEach((reti, ir) => {
            if (value === ret.value) {
              reti[ir].selected = true
            }
          })
        })
      }
      return ret
    },
    // 初始化省市地域列表
    normalizeProvinceList(provinceList) {
      this.evaluate.activeNum = 0
      const ret = []
      provinceList.forEach((province, pi) => {
        ret.push({
          title: province.name,
          expand: false,
          value: province.value,
          children: []
        })
        province.cityList.forEach((city, ci) => {
          ret[pi].children.push({
            title: city.name,
            expand: false,
            value: city.value
          })
          this.evaluate.activeNum += city.value
        })
      })
      return ret
    },
    // 获取转化列表
    getAdConvert(objType) {
      console.log(objType)
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getAdConvert',
        account_id: this.$route.query.account,
        convertMonitorType: objType
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.convert.convertList = res.data
          }
        })
        .catch(err => {
          console.log('获取转化列表错误：' + err)
        })
      // 本地测试代码
      // this.convert.convertList = getAdConvert.data
    },
    // 获取转化类型列表
    getConvertMonitorTypes() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getConvertType',
        account_id: this.$route.query.account
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.convert.convertMonitorTypesList = res.data
            this.convert.convertMonitorTypesListCopy = this.convert.convertMonitorTypesList.slice()

            // converType已经选择的状态下
            if (this.isconvertTypeStatus) {
              this.convert.convertMonitorTypesList.forEach(c => {
                if (c && c.id === this.unitSetting.convertMonitorType) {
                  this.convert.convertMonitorTypeName = c.name
                  this.convert.currConvertMonitorTypes = c
                }
              })
            }
          }
        })
        .catch(err => {
          console.log('获取转化类型列表错误：' + err)
        })
      // 本地测试代码
      // this.convert.convertMonitorTypesList = convertTypeList.data
      // this.convert.convertMonitorTypesListCopy = this.convert.convertMonitorTypesList.slice()
      // this.convert.convertMonitorTypesList = res.data
      // this.convert.convertMonitorTypesListCopy = this.convert.convertMonitorTypesList.slice()

      // converType已经选择的状态下
      // if (this.isconvertTypeStatus) {
      //   this.convert.convertMonitorTypesList.forEach(c => {
      //     if (c && c.id === this.unitSetting.convertMonitorType) {
      //       this.convert.convertMonitorTypeName = c.name
      //       this.convert.currConvertMonitorTypes = c
      //     }
      //   })
      // }
    },
    // 获取APP列表
    getInterestAPP() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getAppCategory',
        account_id: this.$route.query.account
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.interestAPPList = res.data.appCategories
            const key = [1, 2] // appCategories值，"1"为软件，"2"为游戏
            this.interestAPPSFTreeList = this.normalizeAPPList(
              this.interestAPPList,
              key[0]
            )
            this.interestAPPGameTreeList = this.normalizeAPPList(
              this.interestAPPList,
              key[1]
            )
          }
        })
        .catch(err => {
          console.log('获取APP列表错误：' + err)
        })
      // 本地测试代码
      // this.interestAPPList = getAppCategory.data.appCategories
      // const key = [1, 2] // appCategories值，"1"为软件，"2"为游戏
      // this.interestAPPSFTreeList = this.normalizeAPPList(
      //   this.interestAPPList,
      //   key[0]
      // )
      // this.interestAPPGameTreeList = this.normalizeAPPList(
      //   this.interestAPPList,
      //   key[1]
      // )
    },
    // 获取兴趣列表
    getInterestTypes() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getInterest',
        account_id: this.$route.query.account
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.interestTypesList = res.data.interestTypes;
            this.interestTreeList = this.normalizeInterestList(
              this.interestTypesList
            )
            this.evaluate.activeTxt = this.normalizeActiveTxt(
              this.evaluate.activeNum
            )
            // console.log("获取兴趣列表", this.interestTypesList)
          }
        })
        .catch(err => {
          console.log('获取兴趣列表错误：' + err)
        })
      // 本地测试代码
      // this.interestTypesList = interestList.data.interestTypes
      // this.interestTreeList = this.normalizeInterestList(this.interestTypesList)
      // this.evaluate.activeTxt = this.normalizeActiveTxt(this.evaluate.activeNum)
      // console.log("获取兴趣列表", this.interestTypesList);
    },
    // 获取省市地域列表
    getProvince() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getProvince',
        account_id: this.$route.query.account
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.provinceList = res.data.provinces;
            this.provinceTreeList = this.normalizeProvinceList(
              this.provinceList
            )
            this.evaluate.activeTxt = this.normalizeActiveTxt(
              this.evaluate.activeNum
            )
            // console.log("获取省市地域列表", this.provinceList)
          }
        })
        .catch(err => {
          console.log('获取省市地域列表错误：' + err)
        })
      // 本地测试代码
      // this.provinceList = provincesList.data.provinces
      // this.provinceTreeList = this.normalizeProvinceList(this.provinceList)
      // this.evaluate.activeTxt = this.normalizeActiveTxt(this.evaluate.activeNum)
    },
    // 获取关键词推荐、站点推荐、APP 推荐结果. params包括：maxNum，excludes，seeds，type
    // type包含：app ： app推荐 ，word ： 关键词推荐 ，url ： 站点推荐
    getRecommend(params) {
      console.log(params)
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getRecommend',
        account_id: this.$route.query.account,
        type: params.type,
        maxNum: 200,
        seeds: params.seeds
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            console.log('获取关键词推荐、站点推荐、APP 推荐结果', res.data)
          }
        })
        .catch(err => {
          console.log('获取省市地域列表错误：' + err)
        })
    },
    // 初始化单元状态
    initUnitEditStatus(unit) {
      this.isUnitSubmitStatus = true
      this._assignMethod(this.unitSetting, unit)

      // 编辑 与 导入单元 状态时 的公用参数
      // 单元名称
      this.unitSetting.adgroup_name = this.unitSetting.adgroup_name + '-复制'
      // 推广方式
      this.unitSetting.generalizeType = this.unitSetting.generalizeType
      this.handleGeneralizeType(this.unitSetting.generalizeType)
      
      // 出价
      this.unitSetting.bid = +this.unitSetting.bid
      this.unitSetting.secondBid = +this.unitSetting.secondBid
      
      // 操作系统 - platform
      this.pagePlatform = this.platformStrToArray(this.unitSetting.platform)
      this.evaluate.platform = this.getPlatform(this.unitSetting.platform)
      
      // 计费方式 - chargeType

      // 编辑 时 单元参数
      if (this.isEdit) {
        // 开启状态
        this.paused = unit.paused
        
        // 定向id
        this.targetingId = unit.targeting_id
        
        // 优化目标  - optimizationTarget 状态
        this.isOptTarConvertZXStatus = true
        this.isOptTarConvertStatus = this.unitSetting.optimizationTarget !== '1'
        
        // 转化监测类型 - convertMonitorType 状态
        const convertMonitorType = this.unitSetting.convertMonitorType = +this.unitSetting.convertMonitorType
        this.isconvertTypeStatus = convertMonitorType !== 0
        // this.unitSetting.generalizeType = this.unitSetting.generalizeType
        this.getConvertMonitorTypes()
      }
    },
    // 根据id获取单元内容接口,在编辑状态下调用
    getAdgroupById(params) {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getAdgroupById',
        id: params.id,
        adgroup_id: params.adgroupId
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            const data = res.data[0];
            console.log("编辑时根据id获取单元内容接口getAdgroupById", data);
            this.initUnitEditStatus(data);
          }
        })
        .catch(err => {
          console.log('获取推广单元数据错误：' + err);
        })
      // 本地测试代码
      // this.initUnitEditStatus(getAdgroupById.data[0])
    },
    // 根据计划id获取单元名称列表
    getAdgroupNameList(id) {
      this.loading = true
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getAdgroupNameList',
        campaignids: [id]
      }).then(res => {
        if (ERR_OK === res.ret) {
          this.importDate.unitNameList = res.data
          this.loading = false
        }
      })
    },
    // 获取计划名称列表
    getCampaignNameList() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getCampaignNameList'
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            const data = res.data.length > 0 ? res.data : []
            this.importDate.planNameList = data
            data.forEach(campaign => {
              if (campaign.campaign_id === this.unitSetting.campaign_id) {
                this.campaign_name = campaign.campaign_name
              }
            })
          }
        })
        .catch(err => {
          console.log('获取计划名称列表错误：' + err)
        })
      // 本地测试
      // this.importDate.planNameList = getCampaignNameList.data
      // const data = res.data.length > 0 ? res.data : []
      // this.importDate.planNameList = data
      // data.forEach(campaign => {
      //   if (campaign.campaign_id === this.unitSetting.campaign_id) {
      //     this.campaign_name = campaign.campaign_name
      //   }
      // })
    },
    // 获取定向设置数据
    getTargetingList() {
      this.loading = true
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getTargetingList'
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            const data = res.data
            this.targetingList = data
            this.loading = false
            if (this.isEdit) {
              this.initEditTargeting()
            }
            // console.log('获取定向设置数据', this.targetingList)
          }
        })
        .catch(err => {
          console.log('获取定向设置数据错误：' + err)
        })
      // 本地测试代码
      // this.targetingList = targetingList.data
      // if (this.isEdit) {
      //   this.initEditTargeting()
      // }
    },
    // 获取推广计划推广资源
    getAdResourceId() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'searchCampaigns',
        keyword: this.$route.query.campaign_id
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            const data = res.data.list[0]['adResourceId']
            this.unitSetting.adResourceId = data
          }
        })
        .catch(err => {
          console.log('获取推广计划推广资源错误：' + err)
        })
    },
    // 获取account信息
    getAccountInfo() {
      const query = this.$route.query
      this.unitSetting.account_id = query.account
      this.unitSetting.campaign_id = query.campaign_id
      this.targetingSetting.account_id = query.account

      if (query.id) {
        this.currId = query.id
        this.adgroupId = query.adgroup_id
        this.targetingId = query.targeting_id
        this.isEdit = true
      } else {
        this.isEdit = false
      }
    },
    // 编辑时的定向设置数据
    initEditTargeting() {
      this.targetingList.forEach(targ => {
        if (targ.targeting_id === this.targetingId) {
          this._assignMethod(this.targetingSetting, targ)
        }
      })
    },
    /**
     * 赋值函数
     * @augments tar data变量里面的自定义对象
     * @argument src 将要获取值的对象
     */
    _assignMethod(tar, src) {
      for (let k in tar) {
        if (src[k] && src.hasOwnProperty(k)) {
          tar[k] = src[k]
        }
      }
    },
    /**
     * 返回匹配的数组
     * @augments list 将要对比的数组集合
     * @argument type 将要对比的对象的键
     * @argument name 将要对比的对象的值
     * @returns ret 返回匹配的对象集合
     */
    _getcurrList(list, type, name) {
      if (list.length < 1) {
        return
      }
      const ret = []
      list.forEach(item => {
        if (item[type] === name) {
          ret.push(item)
        }
      })
      return ret[0]
    }
  },
  components: {
    typeTree
  }
}
</script>
