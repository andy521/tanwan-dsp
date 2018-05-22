
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
  width: 400px;
}
</style>

<template>
    <div class="toutiaonew ad">
        <!-- 导行 -->
        <side-bar :step="2"></side-bar>
       

        <Card dis-hover class="margin-top-20">
            <div class="newtt">
                <div class="title">投放目标</div>
                <Form :label-width="80" class="margin-top-20">
                    <FormItem label="投放目标">
                        <RadioGroup v-model="pricing" type="button" size="large">
                            <Radio :label="item.val_type" v-for="item in toutiaoConfig.pricing" :key="this">{{item.cname}}</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem>
                        <div slot="label">
                            <Tooltip content="对接激活数据后，系统支持激活转化；未对接的情况，安卓应用默认的转化类型为下载完成" placement="top">
                                <Icon type="help-circled" size="14" color="#999"></Icon>
                            </Tooltip>
                            转化类型
                        </div>
                        <RadioGroup v-model="pricing" type="button" size="large">
                            <Radio :label="item.val_type" v-for="item in toutiaoConfig.pricing" :key="this">{{item.name}}</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="计划名称">
                        <Input v-model="adgroup_name" placeholder="请输入广告名称，长度为50字" size="large" class="w500"></Input>
                    </FormItem>
                </Form>
            </div>
        </Card>

        <Card dis-hover class="margin-top-20">
            <div class="newtt">
                <div class="title">网页链接</div>
                <Form :label-width="80" class="margin-top-20">
                    <FormItem label="下载链接">
                        <Input v-model="download_url" placeholder="请输入网址" size="large" class="w500"></Input>
                    </FormItem>
                    <FormItem label="转化元素">
                        <Select size="large" class="w500">
                            <Option value="0">4545</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="应用包名">
                        <Input placeholder="请输入应用包名" size="large" class="w500"></Input>
                    </FormItem>
                </Form>
            </div>
        </Card>

        <Card dis-hover class="margin-top-20" style="position: inherit;">
            <div class="newtt">
                <div class="title">预算与出价</div>
                <Form :label-width="80" class="margin-top-20">
                    <FormItem label="预算">
                        <Input v-model="budget" placeholder="最低预算不能少于100元" size="large" class="w500">
                        <Select v-model="budget_mode" slot="prepend" style="width:80px;">
                            <Option value="BUDGET_MODE_DAY">日预算</Option>
                            <Option value="BUDGET_MODE_TOTAL">总预算</Option>
                        </Select>
                        <span slot="append">元</span>
                        </Input>
                    </FormItem>
                    <FormItem label="投放时间">
                        <RadioGroup v-model="datetype" type="button" size="large">
                            <Radio label="0">长期投放</Radio>
                            <Radio label="1">设置开始和结束日期</Radio>
                        </RadioGroup>
                        <div class="margin-top-20">
                            <DatePicker v-if="datetype==0" v-model="start_time" :options="options" type="date" format="yyyy-MM-dd" placeholder="长期投放" size="large"></DatePicker>
                            <DatePicker v-if="datetype==1" v-model="DateDomain" :options="options" type="daterange" format="yyyy-MM-dd" placement="bottom-start" placeholder="在某日期范围内投放" size="large"></DatePicker>
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
                            <Button type="ghost" size="large" v-for="item in toutiaoConfig.pricing" :key="this" v-if="item.val_type==pricing">按{{item.cname}}付费({{item.name}})</Button>
                        </ButtonGroup>

                        <div class="margin-top-20" v-if="pricing=='PRICING_OCPC'">
                            <Tooltip content="目标转化价格是指您愿意为每次转化支付的目标价格。价格的高低会影响您获得的转化次数。例如，如果设置的目标价格过低，您可能会错失一部分转化。目标转化价格仅作为智能优化投放的成本参考，实际扣费仍按照单次点击计费" placement="top">
                                <Icon type="help-circled" size="14" color="#999"></Icon>
                            </Tooltip>目标转化出价
                            <Input v-model="bid" placeholder="最低预算不能少于100元" size="large" style="width:300px;"></Input>
                            <span class="margin-left-10">元</span> 该方式支持超目标成本赔付，详细
                            <span class="name_text">oCPM赔付规则</span>
                        </div>

                        <div class="margin-top-20" v-if="pricing=='PRICING_CPC'">
                            <Tooltip content="根据实时数据、同类型竞争关系的广告的平均出价参考" placement="top">
                                <Icon type="help-circled" size="14" color="#999"></Icon>
                            </Tooltip>点击出价
                            <Input v-model="bid" placeholder="最低出价不能少于0.2元" size="large" style="width:300px;"></Input>
                            <span class="margin-left-10">元</span>
                        </div>

                        <div class="margin-top-20" v-if="pricing=='PRICING_CPM'">
                            展现出价
                            <Input v-model="bid" placeholder="最低出价不能少于0.2元" size="large" style="width:300px;"></Input>
                            <span class="margin-left-10">元</span>
                        </div>

                        <div class="margin-top-20" v-if="pricing=='PRICING_CPV'">
                            播放出价
                            <Input v-model="bid" placeholder="最低出价不能少于0.2元" size="large" style="width:300px;"></Input>
                            <span class="margin-left-10">元</span>
                        </div>

                    </FormItem>

                </Form>
            </div>
        </Card>

        <Card dis-hover class="margin-top-20">
            <div class="newtt">
                <Button type="primary" size="large" @click="submitad()">保存到下一步</Button>
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
export default {
    components: {
        sideBar,
        weekTime
    },
    data() {
        return {
            account_id: this.$route.query.account_id, //账户id
            campaign_id: "", //广告组id
            id: this.$route.query.id, //
            toutiaoConfig: toutiaoConfig,
            landing_type: this.$route.query.landing_type,//推广目的


            adgroup_name: "",//计划名称
            pricing: "PRICING_CPC",


            download_url: "",//广告应用下载链接(当推广目的landing_type=APP时必填,landing_type=LINK时不填)
            package: "",//广告应用下载包名(当应用下载类型app_type=APP_ANDROID时,必填)


            budget_mode: "BUDGET_MODE_DAY",//广告预算类型
            budget: "",//广告预算
            start_time: formatDate(new Date(), "yyyy-MM-dd"),//长期投放时间
            DateDomain: [
                formatDate(new Date(), "yyyy-MM-dd"),
                formatDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"),
            ], //投放时间段
            datetype: "0",//投放时间类别
            timetype: "0",//投放时段类别
            options: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            schedule_time:
                "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", //投放时间段
            bid: "",//广告出价取值范围: ≥ 0








        };
    },
    mounted() {
        if (this.id) {
        }
    },
    methods: {
        //保存计划
        submitad() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'addAdgroups',
                account_id:this.account_id,//账户id
                campaign_id:this.campaign_id,//广告组id
                adgroup_name:this.adgroup_name,//广告计划名称
                budget_mode:this.budget_mode,//广告预算类型
                budget:this.budget,//广告预算
                start_time:"",
                end_time:"",
            }).then(res => {
                if (res.ret == 1) {
                    this.ad_province(res.data);
                }
            }).catch(err => {
                console.log('获取省市列表失败' + err);
            })
        }
    }
};
</script>
