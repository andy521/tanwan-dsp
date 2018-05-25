
<style scoped>
.toutiaonew {
  padding: 10px 10px 10px 210px;
  overflow: auto;
  height: 100%;
  font-size: 14px;
}
.newtt {
  padding: 20px;
}
.title {
  font-size: 22px;
}
.w500 {
  width: 500px;
}
</style>

<template>
    <div class="toutiaonew ad">
        <!-- 导行 -->
        <side-bar :step="1"></side-bar>

        <Card dis-hover>
            <div class="newtt">
                <div class="title">投放目标</div>
                <Form :label-width="80" class="margin-top-20">
                    <FormItem label="投放目标">
                        <RadioGroup v-model="pricing" type="button" size="large">
                            <Radio :label="item.val_type" v-for="item in toutiaoConfig.pricing" :key="item.val_type" v-if="item.val_type!='PRICING_OCPC'">{{item.cname}}</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="计划名称">
                        <Input v-model="adgroup_name" placeholder="请输入广告名称，长度为50字" clearable size="large" class="w500"></Input>
                    </FormItem>
                </Form>
            </div>
        </Card>

        <Card dis-hover class="margin-top-10">
            <div class="newtt">
                <div class="title" v-if="landing_type=='APP'">应用链接</div>
                <div class="title" v-if="landing_type=='LINK'">网页链接</div>
                <Form :label-width="80" class="margin-top-20">
                    <FormItem label="网页链接" v-if="landing_type=='LINK'">
                        <Input v-model="url" placeholder="请输入网址" clearable size="large" class="w500"></Input>
                    </FormItem>
                    <FormItem label="下载链接" v-if="landing_type=='APP'">
                        <Input v-model="url" placeholder="请填写应用下载链接" clearable size="large" class="w500"></Input>
                    </FormItem>
                    <template v-if="pricing=='PRICING_OCPM'">
                        <FormItem label="转化元素">
                            <Select v-model="convert_id" size="large" class="w500" @on-change="changeConvert">
                                <Option :value="item.convert_id" v-for="item in ConvertList" :key="item.convert_id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="应用包名" v-show="app_type=='APP_ANDROID'">
                            <Input v-model="package" readonly placeholder="请输入应用包名" size="large" class="w500"></Input>
                        </FormItem>
                        <FormItem label="下载类型">
                            <RadioGroup v-model="app_type" type="button" size="large" class="w500">
                                <Radio :value="item.val_type" disabled v-for="item in toutiaoConfig.app_type" :key="item.val_type">{{item.name}}</Radio>
                            </RadioGroup>
                        </FormItem>
                    </template>
                </Form>
            </div>
        </Card>

        <!-- 创意 -->
        <targeting-details :apptype="app_type" :pricing="pricing" @on-change="getTargetingid" class="margin-top-10"></targeting-details>

        <Card dis-hover class="margin-top-10" style="position: inherit;">
            <div class="newtt">
                <div class="title">预算与出价</div>
                <Form :label-width="80" class="margin-top-20">
                    <FormItem label="预算">
                        <Input v-model="budget" placeholder="最低预算不能少于100元" clearable size="large" class="w500">
                        <Select v-model="budget_mode" slot="prepend" style="width:80px;">
                            <Option value="BUDGET_MODE_DAY">日预算</Option>
                            <Option value="BUDGET_MODE_TOTAL">总预算</Option>
                        </Select>
                        <span slot="append">元</span>
                        </Input>
                    </FormItem>
                    <FormItem label="投放时间">
                        <RadioGroup v-model="schedule_type" type="button" size="large">
                            <Radio :label="item.val_type" v-for="item in toutiaoConfig.schedule_type" :key="item.val_type">{{item.name}}</Radio>
                        </RadioGroup>
                        <div class="margin-top-20" v-show="schedule_type=='SCHEDULE_START_END'">
                            <DatePicker :value="DateDomain" :options="options" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placement="bottom-start" placeholder="在某日期范围内投放" size="large" @on-change="changedata" style="width:280px;"></DatePicker>
                        </div>
                    </FormItem>
                    <FormItem label="投放时段">
                        <RadioGroup v-model="timetype" type="button" size="large">
                            <Radio label="0">不限</Radio>
                            <Radio label="1">指定时间段</Radio>
                        </RadioGroup>
                    </FormItem>
                    <week-time v-model="schedule_time" v-if="timetype==1" style="margin-left:80px;"></week-time>

                    <FormItem label="付费方式" class="margin-top-20">
                        <ButtonGroup>
                            <Button type="ghost" size="large" v-for="item in toutiaoConfig.pricing" :key="item.val_type" v-if="item.val_type==pricing">按{{item.cname}}付费({{item.name}})</Button>
                        </ButtonGroup>

                        <div class="margin-top-20" v-show="pricing=='PRICING_OCPM'">
                            <Tooltip content="目标转化价格是指您愿意为每次转化支付的目标价格。价格的高低会影响您获得的转化次数。例如，如果设置的目标价格过低，您可能会错失一部分转化。目标转化价格仅作为智能优化投放的成本参考，实际扣费仍按照单次点击计费" placement="top">
                                <Icon type="help-circled" size="14" color="#999"></Icon>
                            </Tooltip>目标转化出价
                            <Input v-model="bid" placeholder="最低预算不能少于100元" clearable size="large" style="width:300px;"></Input>
                            <span class="margin-left-10">元</span> 该方式支持超目标成本赔付，详细
                            <span class="name_text">oCPM赔付规则</span>
                        </div>

                        <div class="margin-top-20" v-show="pricing=='PRICING_CPC'">
                            <Tooltip content="根据实时数据、同类型竞争关系的广告的平均出价参考" placement="top">
                                <Icon type="help-circled" size="14" color="#999"></Icon>
                            </Tooltip>点击出价
                            <Input v-model="bid" placeholder="最低出价不能少于0.2元" clearable size="large" style="width:300px;"></Input>
                            <span class="margin-left-10">元</span>
                        </div>

                        <div class="margin-top-20" v-show="pricing=='PRICING_CPM'">
                            展现出价
                            <Input v-model="bid" placeholder="最低出价不能少于0.2元" clearable size="large" style="width:300px;"></Input>
                            <span class="margin-left-10">元</span>
                        </div>

                        <div class="margin-top-20" v-show="pricing=='PRICING_CPV'">
                            播放出价
                            <Input v-model="bid" placeholder="最低出价不能少于0.2元" clearable size="large" style="width:300px;"></Input>
                            <span class="margin-left-10">元</span>
                        </div>
                    </FormItem>

                    <FormItem>
                        <div slot="label">
                            <Tooltip content="标准投放(推荐)：系统会优化您的投放，让预算在设定的时间段内稳定的消耗完，以尽可能地从更多流量中挑选最优的流量。
加速投放：尽可能的将广告投放出去，可能会在较短的时间内消耗完预算，也会因为竞争环境的变化导致预算消耗出现较大的波动。
在投放周期内，如果预算消耗小于预期，建议通过优化创意、调整受众人群和出价来优化，和投放方式选择无关。" placement="top">
                                <Icon type="help-circled" size="14" color="#999"></Icon>
                            </Tooltip>
                            投放速度
                        </div>
                        <RadioGroup v-model="flow_control_mode" type="button" size="large">
                            <Radio :label="item.val_type" v-for="item in toutiaoConfig.flow_control_mode" :key="item.val_type">{{item.name}}</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </div>
        </Card>

        <Card dis-hover class="margin-top-10">
            <div class="newtt">
                <Button type="primary" size="large" @click="addAdgroup()">保存计划</Button>
            </div>
        </Card>

    </div>
</template>

<script>
import Axios from "@/api/index";
import toutiaoConfig from '@/utils/toutiaoConfig.json';
import { formatDate, changetime, deepClone } from "@/utils/DateShortcuts.js";
import sideBar from "./components/sideBar.vue";
import weekTime from "./components/weekTime.vue";
import targetingDetails from "./components/targetingDetails.vue";
export default {
    components: {
        sideBar,
        weekTime,
        targetingDetails
    },
    data() {
        return {
            toutiaoConfig: toutiaoConfig,
            account_id: this.$route.query.account_id, //账户id
            campaign_id: this.$route.query.campaign_id, //广告组id           
            landing_type: this.$route.query.landing_type,//推广目的
            targeting_id: this.$route.query.targeting_id,//定向id
            adgroup_id: this.$route.query.adgroup_id,//广告计划id

            adgroup_name: "",//计划名称
            pricing: "PRICING_CPC",

            url: "",//下载链接
            ConvertList: "",//转化列表
            convert_id: "",//转化id
            app_type: "",//广告应用下载类型(当推广目的landing_type=APP时,必填)
            package: "",//广告应用下载包名(当应用下载类型app_type=APP_ANDROID时,必填)

            budget_mode: "BUDGET_MODE_DAY",//广告预算类型(创建后不可修改)
            budget: "",//广告预算
            DateDomain: [
                formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
                formatDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd hh:mm:ss"),
            ], //投放时间段
            timetype: "0",//投放时段类别
            options: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            schedule_time: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", //投放时间段
            schedule_time1: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
            bid: "",//广告出价取值范围: ≥ 0
            schedule_type: "SCHEDULE_FROM_NOW",//广告投放时间类型
            flow_control_mode: "FLOW_CONTROL_MODE_SMOOTH",//广告投放速度类型
        };
    },
    mounted() {
        if (this.adgroup_id) {
            this.getAdgroups()
        }
        this.getConvertList();
    },
    methods: {
        //返回定向id
        getTargetingid(id) {
            this.targeting_id = id;
        },
        //广告计划详情
        getAdgroups() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getAdgroups',
                adgroup_id: this.adgroup_id,
            }).then(res => {
                if (res.ret == 1) {
                    console.log(res.data)
                    this.adgroups(res.data);
                }
            }).catch(err => {
                console.log('广告计划详情' + err);
            })

        },
        //填兖广告计划数据
        adgroups(data) {
            this.pricing = data.pricing;
            this.adgroup_name = data.adgroup_name;
            if (data.landing_type == "APP") {
                this.url = download_url;
                this.app_type = data.app_type;
            }
            if (this.landing_type == "LINK") {
                this.url = data.external_url;
            }


            if (data.pricing == 'PRICING_OCPM') {
                this.convert_id = data.convert_id;
                this.package = data.package;
            }




            this.budget_mode = data.budget_mode;
            this.budget = data.budget;
            this.schedule_type = data.schedule_type;
            this.DateDomain = [data.start_time, data.end_time]
            if (data.schedule_time == "SCHEDULE_TIME_ALL_DAY") {
                this.timetype = "0";
                this.schedule_time = this.schedule_time1;
            } else {
                this.timetype = "1";
                this.schedule_time = data.schedule_time;
            }
            if (data.pricing == "PRICING_OCPC" || data.pricing == "PRICING_OCPM") {
                this.bid = data.cpa_bid
            } else {
                this.bid = data.bid
            }
            this.flow_control_mode = data.flow_control_mode;

        },
        //创建计划
        addAdgroup() {
            let param = {
                action: 'ttAdPut',
                opt: 'addAdgroup',
                account_id: this.account_id,//账户id
                campaign_id: this.campaign_id,//广告组id
                adgroup_name: this.adgroup_name,//广告计划名称
                budget_mode: this.budget_mode,//广告预算类型(创建后不可修改)
                budget: this.budget,//广告预算
                start_time: "",
                end_time: "",
                bid: this.bid,
                targeting_id: this.targeting_id,
                pricing: this.pricing,
                schedule_type: this.schedule_type,//广告投放时间类型
                flow_control_mode: this.flow_control_mode,//广告投放速度类型
                start_time: this.DateDomain[0],
                end_time: this.DateDomain[1],
            }

            if (this.adgroup_name == "") {
                this.$Message.info("请输入计划名");
                return;
            }
            if (this.url == "") {
                this.$Message.info("请输入链接");
                return;
            }
            if (this.landing_type == "APP") {
                param.download_url = this.url;
                param.app_type = this.app_type;
            }
            if (this.landing_type == "LINK") {
                param.external_url = this.url;
            }
            if (this.pricing == 'PRICING_OCPM') {//pricing == 'PRICING_OCPM'转换量convert_id必填
                if (this.convert_id == "") {
                    this.$Message.info("请选择转化元素");
                    return;
                }
                param.convert_id = this.convert_id;
                if (this.app_type == 'APP_ANDROID') {
                    param.package = this.package;
                }
            }
            if (!this.targeting_id) {
                this.$Message.info("请保存定向");
                return;
            };
            if (this.budget < 100) {
                this.$Message.info("最低预算100元,");
                return;
            }
            if (this.timetype == "1") {
                param.schedule_time = this.schedule_time;
            } else {
                param.schedule_time = this.schedule_time1;
            }
            if (this.pricing == "PRICING_OCPC" || this.pricing == "PRICING_OCPM") {
                param.cpa_bid = this.bid;
                param.bid = "";
                if (this.bid < 100) {
                    this.$Message.info("出价能少于100");
                    return;
                }
            } else {
                if (this.bid < 0.2) {
                    this.$Message.info("出价不能少于0.2");
                    return;
                }
            }

            Axios.post('api.php', param).then(res => {
                if (res.ret == 1) {
                    console.log(res)
                    this.$router.push({
                        name: 'ttcreative',
                        query: {
                            account_id: this.account_id,
                            adgroup_id: res.data.adgroup_id
                        }
                    })
                }
            }).catch(err => {
                console.log('创建计划' + err);
            })
        },
        //转化列表
        getConvertList() {
            let convert_source_type;
            if (this.landing_type == "LINK") {
                convert_source_type = "AD_CONVERT_SOURCE_TYPE_API";
            }
            if (this.landing_type == "APP") {
                convert_source_type = "AD_CONVERT_SOURCE_TYPE_APP_DOWNLOAD";
            }
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getConvertList',
                account_id: this.account_id,//账户id
                convert_source_type: convert_source_type
            }).then(res => {
                if (res.ret == 1) {
                    this.ConvertList = res.data;
                }
            }).catch(err => {
                console.log('获取转化列表失败' + err);
            })
        },
        //选择转华列表
        changeConvert(id) {
            this.ConvertList.forEach(v => {
                if (v.convert_id == id) {
                    this.package = v.game_package;
                    this.app_type = v.game_type;
                }
            })
        },
        //日期变化
        changedata(e) {
            this.DateDomain = e;
        }

    }
};
</script>
