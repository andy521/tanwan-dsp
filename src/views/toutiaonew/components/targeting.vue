
<style lang="less">
@import "../index.less";
.newtt-ad{
    .ivu-card {
        margin-bottom: 10px;
        padding: 20px;
    }
}
.newtt-ad .title-ad{
    font-size: 22px;
    margin-bottom: 36px;
    line-height: 30px;
}
.newtt-ad .tree-content{
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>

<template>
  <div class="newtt newtt-ad">

    <Card>
      <div class="title">用户定向 <span class="sub-title">复制已有定向</span></div>
      <Form :label-width="100">
        <FormItem label="地域">
          <RadioGroup @on-change="handleDistrict" v-model="targetSetting.district" type="button" size="large">
            <Radio label="">不限</Radio>
            <Radio label="CITY">按省市</Radio>
            <Radio label="COUNTY">按区县</Radio>
          </RadioGroup>
          <div class="tree-content">
            <transfer-tree :data="provinceList"></transfer-tree>
          </div>
        </FormItem>

        <FormItem label="性别">
          <RadioGroup v-model="targetSetting.gender" type="button" size="large">
            <Radio label="GENDER_UNLIMITED">不限</Radio>
            <Radio label="GENDER_MALE">男</Radio>
            <Radio label="GENDER_FEMALE">女</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="年龄" :model="targetSetting">
          <RadioGroup v-model="ageStatus">
            <Radio label="">不限</Radio>
            <Radio label="1">自定义</Radio>
          </RadioGroup>
          <CheckboxGroup v-if="ageStatus === '1'" @on-change="handleAge" v-model="targetSetting.age">
            <Checkbox v-for="(a, i) in targetingConf.age" :label="a.type" :key="i">{{a.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem>
          <span slot="label">
            <span>
              <Tooltip placement="top">
                <Icon type="help-circled"></Icon>
                <div slot="content">
                  <p>接入您的应用或网站的数据, 选定或排除特定的用户。</p>
                  <p>您可以在工具箱-头条DMP中管理人群包</p>
                </div>
              </Tooltip>
              人群包
              <br/>
              <span class="txt-grey">(选定/排除)</span>
            </span>
          </span>
          <RadioGroup v-model="customActionsStatus" type="button" size="large">
            <Radio label="GENDER_UNLIMITED">不限</Radio>
            <Radio label="GENDER_MALE">定向人群包</Radio>
            <Radio label="GENDER_FEMALE">排除人群包</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="兴趣分类">
          <RadioGroup v-model="adTagStatus" type="button" size="large">
            <Radio label="GENDER_UNLIMITED">不限</Radio>
            <Radio label="GENDER_MALE">添加兴趣分类</Radio>
            <Radio label="GENDER_FEMALE">系统推荐</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="兴趣关键词">
          <RadioGroup v-model="interestTagsStatus" type="button" size="large">
            <Radio label="GENDER_UNLIMITED">不限</Radio>
            <Radio label="GENDER_MALE">使用关键词</Radio>
            <Radio label="GENDER_FEMALE">使用系统推荐</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="平台">
          <CheckboxGroup @on-change="handlePlatform" v-model="targetSetting.platform">
            <Checkbox v-for="(p, i) in targetingConf.platform" :label="p.type" :key="i">
              {{p.name}}
              <Poptip v-if="p.name === 'PC'" trigger="hover" placement="top">
                <Icon type="help-circled"></Icon>
                <div slot="title">PC设置提示</div>
                <div slot="content">
                  <p>若平台选择PC定向，则其他所有受众</p>
                  <p>定向设置将不生效</p>
                </div>
              </Poptip> 
              </Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem label="网络">
          <CheckboxGroup@on-change="handleAc" v-model="targetSetting.ac">
           <Checkbox v-for="(a, i) in targetingConf.ac" :label="a.type" :key="i">{{a.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem label="运营商">
          <CheckboxGroup @on-change="handleCarrier" v-model="targetSetting.carrier">
           <Checkbox v-for="(c, i) in targetingConf.carrier" :label="c.type" :key="i">{{c.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>

      </Form>
    </Card>

  </div>
</template>

<script>
import getProvince from '../temp/getProvince.json'
import targetingConf from '@/utils/toutiaoConfig.json'
import Axios from '@/api/index'
import transferTree from './transferTree'
export default {
  components: {
    transferTree
  },
  data() {
    return {
    // 定向参数
      targetSetting: {
        district: '', // 地域
        city: [], // 地域id
        gender: 'GENDER_UNLIMITED', // 性别
        age: [], // 年龄
        ad_tag: [], // 兴趣分类
        interest_tags: [], // 兴趣关键词
        platform: [], // 平台
        ac: [], // 网络类型
        carrier: [], // 运营商
      },
      targetingConf: targetingConf, // 定向配置参数
      ageStatus: '', // 年龄状态
      customActionsStatus: '', // 人群包状态
      adTagStatus: '', // 兴趣分类状态
      interestTagsStatus: '', // 兴趣关键词状态
      provinceList: [],
      id: this.$route.query.id, //
      campaign_id: "", //广告组id
      landing_type: "LINK", //广告组推广目的
      budget_mode: "BUDGET_MODE_INFINITE", //广告组预算类型
      budget: '', //广告组预算
      initBudget: '',
      budgetTip: {
        isSubmit: true,
        tip: '日预算不少于1000元'
      }, // 日预算规则
      campaign_name: "", //广告组名称
      modify_time: "" //时间戳
    }
  },
  mounted() {
    if (this.id) {
      // this.getCampaigns();
    }
    this.getTargetingList()
    this.getTag()
    this.getAppType()
  },
methods: {
  handleCarrier() {},
  handleAc() {},
  handlePlatform() {},
  handleAge() {},
  handleDistrict(val) {
    if (val !== '' && this.provinceList.length <= 0) {
      this.getProvince()
    }
  },
  // 监听所选广告组
  handleSeleCampaign(campaign) {
    this.$router.push({
      name: 'ttad',
      query:  campaign
    })
  },
  // 监听日预算
  handleBudget() {
    let budget = this.budget = parseInt(this.budget)
    if (isNaN(budget)) {
      this.budget = 1000
    }
    // 判断日预算大于1000
    if (this.budget_mode === 'BUDGET_MODE_DAY' && this.budget < 1000) {
      this.budgetTip.isSubmit = false
      this.$Notice.warning({
        title: this.budgetTip.tip
      })
      return
    } else {
      this.budgetTip.isSubmit = true
    }
    // 判断每次修改预算大于100
    let isdiff = this.budget == this.initBudget
      console.log('111', isdiff, this.budget, this.initBudget)
    if (this.id && !isdiff && this.budget - this.initBudget < 100) {
      this.budgetTip.isSubmit = false
      this.$Notice.warning({
      title: '单次修改预算不能少于100'
      })
      return
    } else {
      this.budgetTip.isSubmit = true
    }
  },
  normalizeAddProvince(list) {
    if (list.length < 1) {
      return
    }

    const ret = []

    list.forEach((province, ip) => {
      ret.push({
        title: province.name,
        value: province.value,
        expand: false,
        selected: false,
        type: 'province',
        children: []
      })

      // 普通省市
      if (province.cityList){
        province.cityList.forEach((city, ici) => {
          ret[ip].children.push({
            title: city.name,
            value: city.value,
            expand: false,
            selected: false,
            type: 'city',
            children: []
          })

          // 普通省市-县
          if (city.countyList) {
            city.countyList.forEach((country, ico) => {
              ret[ip].children[ici].children.push({
                title: country.name,
                value: country.value,
                expand: false,
                selected: false,
                type: 'country',
                children: []            
              })
            })        
          }
        })
      } else if (province.countyList) {
        ret[ip].children.push({
          title: province.name,
          value: province.value,
          expand: false,
          selected: false,
          type: 'city',
          children: []
        })

        // 特区省市-县
        province.countyList.forEach((country, ic) => {
          ret[ip].children[0].children.push({
            title: country.name,
            value: country.value,
            expand: false,
            selected: false,
            type: 'country',
            children: []            
          })
        })
      }
    })
    const provinceCity = ['北京', '上海', '天津', '重庆', '台湾', '香港', '澳门'] // 备份
    provinceCity.forEach(c => {
      ret.forEach(p => {
        if (c === p.title) {
          p.type = 'city'
        }
      })
    })
    console.log(ret,'ret')
    return ret
  },
  // 获取地域列表
  getProvince() {
    // Axios.post("api.php", {
    //   action: "ttAdPut",
    //   opt: "getProvince"
    // })
    //   .then(res => {
    //     if (res.ret == 1) {
    //       let data = res.data
    //       this.provinceList = this.normalizeAddProvince(data)
    //     }
    //   })
    //   .catch(err => {
    //     console.log("获取地域列表错误" + err);
    //   })
    this.provinceList = this.normalizeAddProvince(getProvince.data)
  },
  // 兴趣分类列表
  getTag() {
    Axios.post('api.php', {
      action: 'ttAdPut',
      opt: 'getTag'
    })
      .then(res => {
        if (res.ret == 1) {
          let data = res.data[0]
        }
      })
      .catch(err => {
        console.log('获取兴趣分类列表失败' + err);
      })
  },
  // APP分类列表
  getAppType() {
    Axios.post('api.php', {
      action: 'ttAdPut',
      opt: 'getAppType'
    })
      .then(res => {
        if (res.ret == 1) {
          let data = res.data[0]
        }
      })
      .catch(err => {
        console.log('获取APP分类列表失败' + err);
      })
  },
  // 定向详情获取
  getTargetingList() {
    Axios.post('api.php', {
    action: 'ttAdPut',
    opt: 'getTargetingList'
    })
      .then(res => {
        if (res.ret == 1) {
          let data = res.data[0]
        }
      })
      .catch(err => {
        console.log('获取APP分类列表失败' + err);
      })  
  },
  // 修改定向
  updateTargeting() {
    this.handleBudget()
    if (!this.budgetTip.isSubmit) {
      return
    }
    Axios.post('api.php', {
      action: 'ttAdPut',
      opt: 'updateTargeting',
      account_id: this.account_id,
      campaign_id: this.campaign_id,
      modify_time: this.modify_time,
      campaign_name: this.campaign_name,
      landing_type: this.landing_type,
      budget_mode: this.budget_mode,
    })
      .then(res => {
        if (res.ret == 1) {
          this.$Message.info(res.msg)
          this.$router.push({
            name: 'tt_campaign'
          })
        }
      })
      .catch(err => {
        console.log('修改定向错误' + err)
      })
  },
  // 提交
  submitTargeting() {
      if (this.id) {
        this.updateTargeting()
      } else {
        this.addTargeting()
      }
  },
  // 添加定向
  addTargeting() {
    // 次account_id 只在开发时使用，上线前删掉
    this.account_id = '93949559469'

    this.handleBudget()
    if (!this.budgetTip.isSubmit) {
      return
    }
    Axios.post('api.php', {
      action: 'ttAdPut',
      opt: 'addTargeting',
      account_id: this.account_id,
      campaign_name: this.campaign_name,
      landing_type: this.landing_type,
      budget_mode: this.budget_mode,

    })
      .then(res => {
        if (res.ret == 1) {
          this.$Message.info(res.msg);
          this.$router.push({
            name: 'ttad',
            query:  res.data.campaign_id
          })
        }
      })
      .catch(err => {
        console.log('提交定向错误' + err)
      })
    }
  }
}
</script>
