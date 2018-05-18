
<style lang="less">
@import "../index.less";
.newtt{
  position: relative;
}
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
.newtt-ad .nav-statistics{
  position: absolute;
  right: 20px;
  top: 100px;
  width: 250px;
  line-height: 22px;
  font-size: 12px;
  text-align: left;
  color: #333;
  background-color: #fff;
  z-index: 1000;
  // display: none;
}
.nav-statistics>.content{
  padding: 16px;
  border: 1px solid #dee4f5;
}
.nav-statistics>.content>.title{
  font-size: 14px;
  margin-bottom: 12px;
}
.nav-statistics>.content>.box{
  margin-bottom: 12px;
}
.nav-statistics .statistics-board{
  background-color: #fafbfe;
}
.nav-statistics .statistics-info{
  border-top: none;
}
.color-blue{
  color: #598fe6;
}
.color-999{
  color: #999;
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
          <div v-if="targetSetting.district === 'CITY'" class="tree-content">
            <transfer-tree :data="provinceList" :col-title="provinceTitle" :can-search="true" :search-placeholder="provincePlaceHolder"></transfer-tree>
          </div>
          <div v-if="targetSetting.district === 'COUNTY'" class="tree-content">
            <transfer-tree :data="provinceList" :col-title="provinceTitle" :deep="3"></transfer-tree>
          </div>
        </FormItem>

        <FormItem label="性别">
          <RadioGroup @on-change="handleGender" v-model="targetSetting.gender" type="button" size="large">
            <Radio label="GENDER_UNLIMITED">不限</Radio>
            <Radio label="GENDER_MALE">男</Radio>
            <Radio label="GENDER_FEMALE">女</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="年龄" :model="targetSetting">
          <CheckboxGroup @on-change="handleAge" v-model="targetSetting.age">
            <Checkbox label="">不限</Checkbox>
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

    <div class="nav-statistics">
      <div class="content statistics-board">
        <div class="title">预估可覆盖</div>
        <p>今日头条<span class="color-blue">500</span>万月活用户</p>
        <p>西瓜视频<span class="color-blue">500</span>万月活用户</p>
        <p>火山小视频<span class="color-blue">500</span>万月活用户</p>
      </div>
      <div class="content statistics-info">
        <div class="title">受众信息</div>
        <p v-if="statistics.areaTxt.length !== 0">地域：
          <span class="color-999">{{statistics.areaTxt}}</span>
        </p>
        <p v-if="statistics.genderTxt.length !== 0">性别：
          <span class="color-999">{{statistics.genderTxt}}</span>
        </p>
        <p v-if="statistics.ageTxt.length !== 0">年龄：
          <span class="color-999">{{statistics.ageTxt}}</span>
        </p>
        <p v-if="statistics.platfromTxt.length !== 0">平台：
          <span class="color-999">{{statistics.platfromTxt}}</span>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import getProvince from '../temp/getProvince.json'
import getTargetingList from '../temp/getTargetingList.json'
import getTargetingById from '../temp/getTargetingById.json'
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
        district: '', // 地域类型
        city: [], // 地域id
        location_type: '', // 受众位置类型
        gender: 'GENDER_UNLIMITED', // 性别
        age: [''], // 年龄
        ad_tag: [], // 兴趣分类
        interest_tags: [], // 兴趣关键词
        platform: ['PC'], // 平台
        ac: [], // 网络类型
        carrier: [], // 运营商
      },
      targetingConf: targetingConf, // 定向配置参数
      customActionsStatus: '', // 人群包状态
      adTagStatus: '', // 兴趣分类状态
      interestTagsStatus: '', // 兴趣关键词状态
      // 地域 - 省市数据 与 参数
      provinceList: [],
      provinceTitle: {
        col1: '省份',
        col2: '城市',
        col3: '区县'
      },
      provincePlaceHolder: '省市搜索，不支持按拼音、拼音首字母',
      // 获取定向列表
      targetingList: [],
      // 统计展示文本
      statistics: {
        areaTxt: '', // 地域
        genderTxt: '不限', // 性别
        ageTxt: '不限', // 年龄
        platfromTxt: 'PC', // 平台
      }
    }
  },
  mounted() {
    if (this.id) {
      this.getTargetingList()
    }
      this.getTargetingList()
    this.getTag()
    this.getAppType()
  },
methods: {
  initTargeting(res) {
    const targeting = res.data.targeting
    console.log(targeting)
    // 年龄
    if (targeting.age) {
      const age = targeting.age
      this.targetSetting.age = age
      this.statistics.ageTxt = age && (age.length === 0 || age.length === 1 && age[0] === '') ? '不限' : this.normalizeTxtShow(this.targetSetting.age)
    }
    // 性别
    if (targeting.gender) {
      const gender = targeting.gender
      this.targetSetting.gender = gender
      this.handleGender(this.targetSetting.gender)
    }
    // 地域
    // 平台
    if (targeting.platform) {
      const platform = targeting.platform
      this.targetSetting.platform = platform
      this.handlePlatform(this.targetSetting.platform)
    }
  },
  normalizeTxtShow(list, length) {
    if (!Array.isArray(list)) {
      return
    }
    const len = list.len
    let retTxt = ''
    if (len === 0) {
      return retTxt
    }
    if (len < length) {
      retTxt = list.slice().join('、')
    } else if (typeof length == 'undefined') {
      retTxt = list.slice().join('、')
    } else {
      retTxt = `${list.slice(0, length).join('、')}等${list.length}个`
    }
    return retTxt
  },  
  handleGender(val) {
    const config = targetingConf.gender
    config.forEach(v => {
      if (val === v.type) {
        this.statistics.genderTxt = v.name
      }
    })
  },
  handleCarrier() {},
  handleAc() {},
  handlePlatform(val) {
    if (val && val.length === 0) {
      return
    }
    const single = new Set(val)
    const config = targetingConf.platform
    let txtList = []
    for (let k of single) {
      if (k === '') {
        this.targetSetting.platform = ['']
        this.statistics.platfromTxt = '不限'
        single.delete(k)
      } else if (k === 'PC') {
        this.targetSetting.platform = ['PC'],
        this.statistics.platfromTxt = 'PC'
        single.delete(k)
      } else{
        this.targetSetting.platform = [...single]
        config.forEach(v => {
          if (k === v.type) {
            txtList.push(v.name)
          }
        })
        this.statistics.platfromTxt = this.normalizeTxtShow(txtList)
      }
    }
    console.log(this.targetSetting.platform)
  },
  handleAge(val) {
    const single = new Set(val)
    const config = targetingConf.age
    let txtList = []
    for (let k of single) {
      if (k === '') {
        this.targetSetting.age = ['']
        this.statistics.ageTxt = '不限'
        single.delete(k)
      } else {
        this.targetSetting.age = [...single]
        config.forEach(v => {
          if (k === v.type) {
            txtList.push(v.name)
          }
        })
        this.statistics.ageTxt = this.normalizeTxtShow(txtList)
      }
    }
  },
  handleDistrict(val) {
    if (val !== '' && this.provinceList.length <= 0) {
      this.getProvince()
    }
    const type = ['', 'CITY', 'COUNTY']
    type.forEach(v => {
      if (v === type[1]) {

      } else if (v === type[2]) {

      } else {
        this.targetSetting.city = []
        this.statistics.areaTxt = ''
      }

    })
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
    // Axios.post('api.php', {
    // action: 'ttAdPut',
    // opt: 'getTargetingList',
    // targeting_id: '1'
    // })
    //   .then(res => {
    //     if (res.ret == 1) {
    //       let data = res.data[0]
    //     }
    //   })
    //   .catch(err => {
    //     console.log('获取APP分类列表失败' + err);
    //   })
    this.targetingList = getTargetingById
    this.initTargeting(this.targetingList)
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
    // this.account_id = '93949559469'

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
