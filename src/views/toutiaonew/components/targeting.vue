
<style scoped>
.newtt {
  padding: 20px;
}
.title {
  font-size: 22px;
}
.sub-title {
  margin-left: 24px;
  font-size: 14px;
  color: #598fe6;
  cursor: pointer;
}
.txt-grey {
  color: #999;
}
</style>

<template>
    <Card dis-hover>
        <div class="newtt">
            <div class="title">用户定向
                <span class="sub-title">复制已有定向</span>
            </div>
            <Form :label-width="100" class="margin-top-20" onsubmit="return false;">
                <FormItem label="地域">
                    <RadioGroup @on-change="handleDistrict" v-model="targeting.district" size="large" type="button">
                        <Radio label="">不限</Radio>
                        <Radio v-for="item in toutiaoConfig.district" :label="item.val_type" :key="this">{{item.name}}</Radio>
                    </RadioGroup>
                    <div class="margin-top-10">
                        <city-tree v-model="targeting.city" v-if="targeting.district=='CITY'"></city-tree>
                        <county-tree v-model="targeting.city" v-if="targeting.district=='COUNTY'"></county-tree>
                    </div>
                </FormItem>

                <FormItem label="性别">
                    <RadioGroup v-model="targeting.gender" size="large" type="button">
                        <Radio v-for="item in toutiaoConfig.gender" :label="item.val_type" :key="this">{{item.name}}</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="年龄">
                    <CheckboxGroup v-model="targeting.age" size="large">
                        <Checkbox v-for="item in toutiaoConfig.age" :label="item.val_type" :key="this">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>

                <FormItem label="兴趣分类">
                    <RadioGroup v-model="ad_tag_model" size="large" type="button">
                        <Radio label="0">不限</Radio>
                        <Radio label="1">添加兴趣分类</Radio>
                    </RadioGroup>
                    <div class="margin-top-10">
                        <tag-tree v-model="targeting.ad_tag" v-if="ad_tag_model=='1'"></tag-tree>
                    </div>

                </FormItem>

                <FormItem label="兴趣关键词">
                    <RadioGroup v-model="interest_tags_model" size="large" type="button">
                        <Radio label="0">不限</Radio>
                        <Radio label="1">使用关健词</Radio>
                    </RadioGroup>
                    <div class="margin-top-10">
                        <interest-tree v-model="targeting.interest_tags" v-if="interest_tags_model=='1'"></interest-tree>
                    </div>
                </FormItem>
                <FormItem label="平台">
                    <CheckboxGroup @on-change="handlePlatform" v-model="targeting.platform" size="large">
                        <Checkbox v-for="item in toutiaoConfig.platform" :label="item.val_type" :key="this">
                            {{item.name}}
                            <Poptip v-if="item.val_type === 'PC'" trigger="hover" placement="top">
                                <Icon type="help-circled" size="14" color="#999"></Icon>
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
                    <CheckboxGroup v-model="targeting.ac" size="large">
                        <Checkbox v-for="item in toutiaoConfig.ac" :label="item.val_type" :key="this">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>

                <FormItem label="运营商">
                    <CheckboxGroup v-model="targeting.carrier" size="large">
                        <Checkbox v-for="item in toutiaoConfig.carrier" :label="item.val_type" :key="this">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
        </div>
    </Card>
</template>

<script>
import Axios from '@/api/index';
import getProvince from '../temp/getProvince.json';
import toutiaoConfig from '@/utils/toutiaoConfig.json';
import cityTree from './cityTree.vue';
import countyTree from './countyTree.vue';
import tagTree from './tagTree.vue';
import interestTree from './interestTree.vue';

export default {
    components: {
        cityTree,
        countyTree,
        tagTree,
        interestTree
    },
    data() {
        return {
            toutiaoConfig: toutiaoConfig, // 定向配置参数
            id: this.$route.query.id, //行id
            campaign_id: this.$route.query.campaign_id, //广告组id
            // 定向参数
            targeting: {
                district: '', // 地域类型
                city: ["130100", "11"], // 地域id
                gender: 'GENDER_UNLIMITED', // 性别
                age: [], // 年龄
                ad_tag: ["10201", "10202"], // 兴趣分类
                interest_tags: ["你好"], // 兴趣关键词
                platform: [], // 平台
                ac: [], // 网络类型
                carrier: [], // 运营商
            },
            ad_tag_model: "0",
            interest_tags_model: "0",

            adTagStatus: '', // 兴趣分类状态
            interestTagsStatus: '', // 兴趣关键词状态
            provinceList: [],
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
        handleCarrier() { },
        handleAc() { },
        handlePlatform() { },
        handleAge() { },
        handleDistrict(val) {
            if (val !== '' && this.provinceList.length <= 0) {
                this.getProvince()
            }
        },
        // 监听所选广告组
        handleSeleCampaign(campaign) {
            this.$router.push({
                name: 'ttad',
                query: campaign
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
                if (province.cityList) {
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
            console.log(ret, 'ret')
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
                            query: res.data.campaign_id
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
