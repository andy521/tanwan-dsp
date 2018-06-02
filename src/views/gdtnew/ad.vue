
<style scoped>
.gdtnew {
  padding: 10px 10px 10px 210px;
  overflow: auto;
  height: 100%;
  font-size: 14px;
}
.title {
  font-size: 22px;
}
.week {
  margin: 0 0 20px 90px;
}
</style>
<template>
    <div class="gdtnew ad">

        <!-- 导行 -->
        <side-bar :step="1"></side-bar>
        <!-- 定向 -->
        <targetingDetails @on-change="getTargetingid"></targetingDetails>

        <Card dis-hover class="margin-top-10">
            <div class="padding-20">
                <div class="title">目标详情</div>

                <Row class="margin-top-20">
                    <Col span="16">
                    <Select filterable size="large" placeholder="请选择标的物id" v-model="product_refs_id" v-if="product_refs_ids.length>0" @on-change="get_destination_url">
                        <Option v-for="item in product_refs_ids" :value="item.product_refs_id" :key="item.product_refs_id">{{item.product_name}}</Option>
                    </Select>
                    <Form :label-width="90" v-else>
                        <FormItem label="标的物名称">
                            <Input v-model="product.product_name" :maxlength="15" style="width: 450px" size="large"></Input>
                            <span class="input-ts">{{product.product_name.length}}/15</span>
                        </FormItem>
                        <FormItem label="标的物id">
                            <Input v-model="product.product_refs_id" :maxlength="15" style="width: 450px" size="large"></Input>
                            <span class="input-ts">{{product.product_refs_id.length}}/15</span>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" size="large" @click="products_add()">添加标的物</Button>
                        </FormItem>
                    </Form>
                    </Col>
                </Row>
            </div>
        </Card>

        <advertisingPosition :id="adcreative_template_id" @on-change="getPosition" class="margin-top-10"></advertisingPosition>

        <Card dis-hover class="margin-top-10" style="position: inherit;">
            <div class="padding-20">
                <div class="title">排期与出价</div>
                <Row class="margin-top-20" style="position: inherit;">
                    <Col span="16" style="position: inherit;">
                    <Form :model="adgroup" :label-width="90" style="position: inherit;">
                        <FormItem label="广告组名称">
                            <Input v-model="adgroup.adgroup_name" :maxlength="40" style="width: 450px" size="large"></Input>
                            <span class="input-ts">{{adgroup.adgroup_name.length}}/40</span>
                        </FormItem>
                        <FormItem label="投放日期：">
                            <div>
                                <RadioGroup v-model="datetype" type="button" size="large">
                                    <Radio label="1">长期投放</Radio>
                                    <Radio label="0">日期范围内投放</Radio>
                                </RadioGroup>
                            </div>
                            <div class="margin-top-20">
                                <DatePicker v-if="datetype==1" :value="adgroup.begin_date" :options="options" type="date" format="yyyy-MM-dd" placeholder="长期投放" size="large" @on-change="changeDate"></DatePicker>
                                <DatePicker v-if="datetype==0" :value="DateDomain" :options="options" type="daterange" format="yyyy-MM-dd" placement="bottom-start" placeholder="日期范围内投放" size="large" @on-change="changeDates"></DatePicker>
                            </div>
                        </FormItem>
                        <FormItem label="投放时间：">
                            <RadioGroup v-model="allDay" type="button" size="large">
                                <Radio label="1">全天</Radio>
                                <Radio label="0">时间段投放</Radio>
                            </RadioGroup>
                        </FormItem>
                        <div class="week" v-if="allDay==0">
                            <week-time v-model="adgroup.time_series"></week-time>
                        </div>
                        <FormItem label="出价方式：">
                            <Select @on-change="getStyle" v-model="adgroup.optimization_goal" style="width:200px;margin-right:15px;" placeholder="请选择优化目标" size="large">
                                <Option v-for="item in gdtConfig.optimization_goal" :value="item.val_type" :key="this">{{ item.name }}</Option>
                            </Select>
                            <RadioGroup v-model="adgroup.billing_event" type="button" size="large">
                                <Radio label="BILLINGEVENT_CLICK" :disabled="disabled_cpc">按CPC扣费</Radio>
                                <Radio label="BILLINGEVENT_IMPRESSION" :disabled="disabled_cpm">按CPM扣费</Radio>
                            </RadioGroup>
                            <span style="color:#ccc;">（请先选优化目录，然后才可选择出价方式）</span>
                        </FormItem>
                        <FormItem label="出价：">
                            <InputNumber :max="100000" :min="10" :step="100" v-model="adgroup.bid_amount" placeholder="输入价格" style="width:200px;" size="large"></InputNumber>
                            <span>元/点击</span>
                            <span style="color:#ccc;">单位为分</span>
                        </FormItem>
                        <FormItem label="日限额：" v-if="campaign_type=='CAMPAIGN_TYPE_WECHAT_MOMENTS'">
                            <InputNumber :max="1000000000" :min="100000" :step="10000" v-model="adgroup.daily_budget" placeholder="输入日限额" style="width:200px;"></InputNumber>
                            <span style="color:#ccc;">分</span>
                        </FormItem>
                    </Form>
                    </Col>
                </Row>
            </div>
        </Card>

        <Card dis-hover class="margin-top-10">
            <div class="padding-20">
                <Button type="primary" size="large" @click="adgroups_add()">
                    <span v-if="adgroup_id">修改广告</span>
                    <span v-else>保存下一步</span>
                </Button>
            </div>
        </Card>

    </div>
</template>
<script>
import Axios from "@/api/index";
import gdtConfig from "@/utils/gdtConfig.json";
import { formatDate, changetime } from "@/utils/DateShortcuts.js";
import sideBar from "./components/sideBar.vue";
import targetingDetails from "./components/targetingDetails.vue";
import weekTime from "./components/weekTime.vue";
import advertisingPosition from "./components/advertisingPosition.vue";

export default {
    components: {
        sideBar,
        targetingDetails,
        weekTime,
        advertisingPosition
    },
    data() {
        return {
            gdtConfig: gdtConfig,
            account_id: this.$route.query.account_id,
            campaign_id: this.$route.query.campaign_id,
            product_type: this.$route.query.product_type,
            campaign_type: this.$route.query.campaign_type,
            targeting_id: this.$route.query.targeting_id,
            adgroup_id: this.$route.query.adgroup_id,

            product: {//添加标的物 
                product_name: "",
                product_refs_id: ""
            },
            product_refs_id: "",//标物物id
            sub_product_refs_id: "",//子标的物 id
            product_refs_ids: [],
            destination_url: "",//落地页 url

            options: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            datetype: "1",
            DateDomain: [
                formatDate(new Date(), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd")
            ], //筛选时间
            adgroup: {
                //广告优化目标类型
                optimization_goal: "",
                //开始投放日期
                begin_date: formatDate(new Date(), "yyyy-MM-dd"),
                //结束投放日期
                end_date: "",
                //投放时间段
                time_series: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                time_series1: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                billing_event: "",
                bid_amount: 10,//出价
                adgroup_name: "",
                daily_budget: 100000//出价方式
            },
            allDay: "1",//特定时间段
            disabled_cpc: true,
            disabled_cpm: true,

            adcreative_template_id: 65,
            site_set: ["SITE_SET_MOBILE_INNER"],//投放站点集合
            adgroup_detail: ""
        };
    },
    mounted() {
        this.products_info_get();
        if (this.adgroup_id) {
            this.get_adgroup_detail();
        }
    },
    methods: {
        //获取详情
        get_adgroup_detail() {
            Axios.post("api.php", {
                action: "api",
                opt: "getAdgroups",
                account_id: this.account_id,
                media_type: 1,
                adgroup_id: this.adgroup_id
            }).then(res => {
                if (res.ret == 1) {
                    console.log(res.data)
                    this.adgroup_detail = res.data;
                    this.fill_adgroup_detail(res.data);
                }
            }).catch(err => {
                console.log("获取详情失败" + err);
            });
        },
        //详情传过来的参数
        fill_adgroup_detail(adgroup_detail) {
            this.site_set = adgroup_detail.site_set;
            this.adcreative_template_id = adgroup_detail.adcreative_template_id;

            this.adgroup.adgroup_name = adgroup_detail.adgroup_name; //广告组名称
            this.adgroup.time_series = adgroup_detail.time_series; //投放时间
            if (changetime(adgroup_detail.time_series) != "全部时间点") {
                this.allDay = "0";
            }
            this.adgroup.begin_date = adgroup_detail.begin_date; //投放日期开始
            this.adgroup.end_date = adgroup_detail.end_date; //投放日期始束
            this.DateDomain = [adgroup_detail.begin_date, adgroup_detail.end_date];
            if (this.adgroup.end_date == "1970-01-01") {
                //是否是长期投放
                this.datetype = "0";
            }
            this.adgroup.bid_amount = Number(adgroup_detail.bid_amount); //出价
            this.adgroup.optimization_goal = adgroup_detail.optimization_goal; //优化目标
            this.adgroup.billing_event = adgroup_detail.billing_event; //付费方式
            this.adgroup.daily_budget = Number(adgroup_detail.daily_budget);

            this.product_refs_id = adgroup_detail.product_refs_id;//标的物
            this.sub_product_refs_id = adgroup_detail.sub_product_refs_id;
            this.destination_url = adgroup_detail.destination_url;
        },
        //返回定向id
        getTargetingid(id) {
            this.targeting_id = id;
        },
        //获取标的物id
        products_info_get() {
            Axios.post("api.php", {
                action: "gdtAdPut",
                opt: "products_info_get",
                account_id: this.account_id,
                product_type: this.product_type
            }).then(res => {
                if (res.ret == 1) {
                    this.product_refs_ids = res.data;
                }
            }).catch(err => {
                console.log("获取标的物id" + err);
            });
        },
        //添加标的物
        products_add() {
            if (this.product.product_name.length == "") {
                this.$Message.info("请填写标的物名");
                return;
            }
            if (this.product.product_name.length > 15) {
                this.$Message.info("标的物名超出字数限制");
                return;
            }
            if (this.product.product_refs_id.length == "") {
                this.$Message.info("请填写标的物id");
                return;
            }
            if (this.product.product_refs_id.length > 15) {
                this.$Message.info("标的物id超出字数限制");
                return;
            }
            Axios.post("api.php", {
                action: "gdtAdPut",
                opt: "products_add",
                account_id: this.account_id,
                product_type: this.product_type,
                product_name: this.product.product_name,
                product_refs_id: this.product.product_refs_id
            }).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.product_refs_ids.push(res.data);
                    this.product_refs_id = res.data.product_refs_id;
                    this.destination_url = res.data.product_info.product_type_app_android_open_platform.app_property_pkg_url;
                }
            }).catch(err => {
                console.log("添加标的物id" + err);
            });
        },
        //选择时间
        changeDate(e) {
            this.adgroup.begin_date = e;
        },
        //选择时间段
        changeDates(e) {
            this.DateDomain = e;
        },
        //选择优化目标
        getStyle(val) {
            if (
                val == "OPTIMIZATIONGOAL_CLICK" ||
                val == "OPTIMIZATIONGOAL_APP_ACTIVATE" ||
                val == "OPTIMIZATIONGOAL_APP_REGISTER" ||
                val == "OPTIMIZATIONGOAL_PROMOTION_CLICK_KEY_PAGE" ||
                val == "OPTIMIZATIONGOAL_ECOMMERCE_ORDER" ||
                val == "OPTIMIZATIONGOAL_APP_PURCHASE" ||
                val == "OPTIMIZATIONGOAL_ECOMMERCE_CHECKOUT" ||
                val == "OPTIMIZATIONGOAL_PAGE_RESERVATION"
            ) {
                this.disabled_cpc = false;
                this.disabled_cpm = true;
                this.adgroup.billing_event = "BILLINGEVENT_CLICK";
            } else if (val == "OPTIMIZATIONGOAL_IMPRESSION") {
                this.disabled_cpc = true;
                this.disabled_cpm = false;
                this.adgroup.billing_event = "BILLINGEVENT_IMPRESSION";
            } else {
                this.disabled_cpm = false;
                this.disabled_cpc = false;
            }
        },
        //提交
        adgroups_add() {
            //提交数据
            let param = {
                action: "gdtAdPut",
                opt: "adgroups_add",
                do: "edit",
                account_id: this.account_id,
                campaign_id: this.campaign_id,
                product_type: this.product_type,
                targeting_id: this.targeting_id,
                adgroup_name: this.adgroup.adgroup_name,
                optimization_goal: this.adgroup.optimization_goal,
                billing_event: this.adgroup.billing_event,
                bid_amount: this.adgroup.bid_amount,
                configured_status: this.configured_status,
                product_refs_id: this.product_refs_id,
                sub_product_refs_id: this.sub_product_refs_id,//为空
                adcreative_template_id: this.adcreative_template_id,
                site_set: this.site_set//投放站点集合
            }
            if (this.datetype == 0) {
                param.begin_date = this.DateDomain[0];
                param.end_date = this.DateDomain[1];
            } else {
                param.begin_date = this.adgroup.begin_date;
                param.end_date = "";
            }
            if (this.allDay == 1) {
                param.time_series = this.adgroup.time_series1;
            } else {
                param.time_series = this.adgroup.time_series;
            }
            if (this.campaign_type == "CAMPAIGN_TYPE_WECHAT_MOMENTS") {
                param.daily_budget = this.adgroup.daily_budget;
            }
            if (this.targeting_id == undefined || this.targeting_id == "") {
                this.$Message.info("请先保存定向");
                return;
            }
            if (this.product_refs_id == "") {
                this.$Message.info("请输入标的物id");
                return;
            }
            if (param.adgroup_name == "") {
                this.$Message.info("请填写广告组名称");
                return;
            }
            if (param.begin_date == "") {
                this.$Message.info("请设置投放日期");
                return;
            }
            if (param.optimization_goal == "") {
                this.$Message.info("选择广告优化类型");
                return;
            }
            if (param.bid_amount < 10 || param.bid_amount > 100000) {
                this.$Message.info("出价需介于10分-100,000分之间");
                return;
            }
            if (param.daily_budget < 100000 || param.daily_budget > 1000000000) {
                this.$Message.info("日预算要求介于 100,000 – 1,000,000,000 分之间");
                return;
            }

            //判断是否修改广告组
            if (this.adgroup_id) {
                param.adgroup_id = this.adgroup_id;
            }

            Axios.post("api.php", param).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.$router.push({
                        name: 'gdtcreative',
                        query: {
                            account_id: this.account_id,
                            product_type: this.product_type,
                            site_set: this.site_set,
                            adcreative_template_id: this.adcreative_template_id,
                            destination_url:this.destination_url
                        }
                    })
                }
            }).catch(err => console.log("广告组" + err));
        },
        //落地页 url
        get_destination_url(val) {
            this.product_refs_ids.forEach(e => {
                if (val == e.product_refs_id) {
                    this.destination_url = e.product_info.product_type_app_android_open_platform.app_property_pkg_url;
                }
            });
        },
        //选择广告版位
        getPosition(id, site_set) {
            this.adcreative_template_id = id;
            this.site_set = site_set;
        }
    }
};
</script>

