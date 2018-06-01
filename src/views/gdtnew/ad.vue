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
.fl {
  float: left;
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
                    <Select filterable size="large" placeholder="请选择标的物id" v-model="product_refs_id" @on-change="change_product_refs_id">
                        <Option v-for="item in product_refs_ids" :value="item.product_refs_id" :key="item.product_refs_id">{{item.product_name}}</Option>
                    </Select>
                    </Col>
                </Row>
            </div>
        </Card>

        <Card dis-hover class="margin-top-10" style="position: inherit;">
            <div class="padding-20">
                <div class="title">排期与出价</div>
                <Row class="margin-top-20" style="position: inherit;">
                    <Col span="16" style="position: inherit;">
                    <Form :model="adgroup" :label-width="90" style="position: inherit;">
                        <FormItem label="投放日期：">
                            <div>
                                <RadioGroup v-model="datetype">
                                    <Radio label="1">长期投放</Radio>
                                    <Radio label="2">在某日期范围内投放</Radio>
                                </RadioGroup>
                            </div>
                            <DatePicker v-if="datetype==1" v-model="adgroup.begin_date" :options="options" type="date" format="yyyy-MM-dd" placeholder="长期投放"></DatePicker>
                            <DatePicker v-if="datetype==2" v-model="DateDomain" :options="options" type="daterange" format="yyyy-MM-dd" placement="bottom-start" placeholder="在某日期范围内投放"></DatePicker>
                        </FormItem>
                        <FormItem label="投放时间：">
                            <div class="fl">
                                <Checkbox v-model="allDay">
                                    <span>全天</span>
                                </Checkbox>
                                <span style="margin:0 20px; color:#999">/</span>
                            </div>
                            <div class="fl" v-if="allDay" @click="period">特定时间段</div>
                            <div class="fl" v-else>
                                <TimePicker :value="timeState" format="HH:mm" type="timerange" placeholder="请选择时间段" :steps="[1, 30]" style="width: 168px"></TimePicker>
                                <Button @click="showWeek" type="dashed">{{isWeekText}}</Button>
                            </div>
                        </FormItem>
                        <div class="week" v-if="isWeek">
                            <week-time v-model="adgroup.time_series"></week-time>
                        </div>
                        <FormItem label="出价方式：">
                            <Select @on-change="getStyle" v-model="adgroup.optimization_goal" style="width:180px;margin-right:15px;" placeholder="请选择优化目标">
                                <Option v-for="item in gdtConfig.optimization_goal" :value="item.val_type" :key="this">{{ item.name }}</Option>
                            </Select>
                            <RadioGroup v-model="adgroup.billing_event" type="button">
                                <Radio label="BILLINGEVENT_CLICK" :disabled="disabled_cpc">按CPC扣费</Radio>
                                <Radio label="BILLINGEVENT_IMPRESSION" :disabled="disabled_cpm">按CPM扣费</Radio>
                            </RadioGroup>
                            <span style="color:#ccc;">（请先选优化目录，然后才可选择出价方式）</span>
                        </FormItem>
                        <FormItem label="出价：">
                            <Input v-model="adgroup.bid_amount" placeholder="输入价格" number style="width:180px" @on-blur="getPrice" icon=""></Input>
                            <span class="input-ts">元/点击</span>
                        </FormItem>
                        <FormItem label="日限额：" v-if="campaign_type=='CAMPAIGN_TYPE_WECHAT_MOMENTS'">
                            <Input v-model="adgroup.daily_budget" placeholder="输入日限额" number style="width:180px" icon=""></Input>
                            <span class="input-ts">分</span>
                        </FormItem>

                        <FormItem label="广告组名称">
                            <Input v-model="adgroup.adgroup_name" :maxlength="40" style="width: 450px"></Input>
                            <span class="input-ts">{{adgroup.adgroup_name.length}}/40</span>
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
                    <span v-else>下一步</span>
                </Button>
            </div>
        </Card>

    </div>
</template>
<script>
import Axios from "@/api/index";
import gdtConfig from "@/utils/gdtConfig.json";
import { formatDate, changetime, deepClone, toHourMinute } from "@/utils/DateShortcuts.js";
import sideBar from "./components/sideBar.vue";
import targetingDetails from "./components/targetingDetails.vue";
import weekTime from "./components/weekTime.vue";

export default {
    components: {
        sideBar,
        targetingDetails,
        weekTime
    },
    data() {
        return {
            gdtConfig: gdtConfig,
            account_id: this.$route.query.account_id,
            product_type: this.$route.query.product_type,
            campaign_type: this.$route.query.campaign_type,
            targeting_id: this.$route.query.targeting_id,
            adgroup_id: this.$route.query.adgroup_id,

            product_refs_id: "",
            destination_url: "",
            product_refs_ids: [],
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
                time_series: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                billing_event: "",
                //出价
                bid_amount: "",
                adgroup_name: "",
                daily_budget: ""
            },
            time_series: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
            //投放时间
            allDay: true,
            //特定时间段-开始时间
            timeStateList: [],
            //特定时间段-结束时间
            timeEndList: [],
            //特定时段间
            timeState: ["00:00", "10:00"],
            //出价方式
            disabled_cpc: true,
            disabled_cpm: true,
            //是否显示高级设置
            isWeek: false,
            isWeekText: "高级设置",
        };
    },
    mounted() {
        this.products_info_get();
    },
    methods: {
        //返回定向id
        getTargetingid(id) {
            this.targeting_id = id;
        },
        //获取标的物id
        products_info_get() {
            Axios.post("api.php", {
                action: "gdtAdput",
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
        //选择标的物
        change_product_refs_id(val) {
            this.product_refs_ids.forEach(element => {
                if (val == element.product_refs_id) {
                    this.destination_url = JSON.parse(element.product_info).product_type_app_android_open_platform.app_property_pkg_url;
                }
            });
        },
        //出价 正则过滤非数字
        getPrice() {
            let patrn = /^\d+(\.\d+)?$/;
            if (!patrn.exec(this.adgroup.bid_amount)) {
                //this.$Message.error('请输入正确价格！');
                this.adgroup.bid_amount = "";
            }
        },
        //特定时间段
        period() {
            this.allDay = false;
        },
        //显示高级设置
        showWeek() {
            if (!this.isWeek) {
                this.isWeek = true;
                this.isWeekText = "退出高级设置";
            } else {
                this.isWeek = false;
                this.isWeekText = "高级设置";
            }
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
                adgroup_id: this.adgroup_id,
                adgroup_name: this.adgroup.adgroup_name,
                product_type: this.product_type,
            }

            if (this.datetype == "2") {
                param.begin_date = this.DateDomain[0];
                param.end_date = this.DateDomain[1];
            } else {
                param.begin_date = this.adgroup.begin_date;
                param.end_date = "";
            }

            if (this.adgroup.time_series) {
                param.time_series = this.adgroup.time_series;
            } else {
                param.time_series = this.time_series;
            }





            // site_set	string	是	投放站点集合



            // billing_event	string	是	计费类型
            // bid_amount	string	是	广告出价，单位为分
            // optimization_goal	string	是	广告优化目标类型
            // daily_budget	string	是	日限额，单位为分
            // product_refs_id	string	是	标的物 id
            // sub_product_refs_id	string	是	子标的物 id
            // targeting_id	string	是	定向 id
            // time_series	string	是	投放时间段
            // configured_status	string	是	客户设置的状态
            // customized_category  自定义分类，




            if (this.adgroup.begin_date == "") {
                this.$Message.info("请设置投放日期");
                return;
            }

            if (
                this.adgroup.bid_amount < 0.1 ||
                this.adgroup.bid_amount > 1000
            ) {
                this.$Message.info("出价需介于10分-100,000分之间");
                return;
            }
            if (this.plandata.campaign_type == "CAMPAIGN_TYPE_WECHAT_MOMENTS") {
                if (
                    this.adgroup.daily_budget < 100000 ||
                    this.adgroup.daily_budget > 1000000000
                ) {
                    this.$Message.info(
                        "日预算要求介于 100,000 – 1,000,000,000 分之间"
                    );
                    return;
                }
            } else {
                this.adgroup.daily_budget == "";
            }
            // if (this.adgroup.destination_url == "") {
            //     this.$Message.info("请填写落地页 url");
            //     return;
            // }
            if (this.adgroup.adcreative_name == "") {
                this.$Message.info("请填写广告名称");
                return;
            }
            if (this.adgroup.adgroup_name == "") {
                this.$Message.info("请填写广告组名称");
                return;
            }


        }

    }
};
          // if (this.product_refs_id == "") {
            //     this.$Message.info("请输入标的物id");
            //     return;
            // }
            // if (this.product_refs_id.length > 15) {
            //     this.$Message.info("请输入标的物id超出字数限制");
            //     return;
            // }
</script>

