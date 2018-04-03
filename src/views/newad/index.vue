<style>
@import "../../styles/common.less";
.ad {
    padding-left: 200px;
    background: #fff;
    padding-right: 240px;
    overflow: auto;
    height: 100%;
    font-size: 14px;
}
</style>
<template>
    <div class="ad">
        <side-bar></side-bar>
        <Content :style="{padding: '40px', minHeight: '280px', background: '#fff'}">
            <!--步骤1-->
            <step-one :callback="steponecallback" v-show="step[0]==0"></step-one>
            <!--步骤2-->
            <step-two :plandata="plandata" :callback="steptowcallback" v-show="step[0]==1&&step[1]==0"></step-two>
            <!--步骤3-->
            <step-three :plandata="plandata" @on-click="threeInfo" v-show="step[0]==1&&step[1]==1||step[1]==2"></step-three>

            <!--上传创意-->
            <up-creative v-show="step[0]==2" :id="adcreative_template_id" @on-change="upCreativeCallback"></up-creative>
        </Content>
    </div>
</template>

<script>
import Axios from "@/api/index";
import sideBar from "./components/sideBar.vue";
import stepOne from "./components/stepOne.vue";
import stepTwo from "./components/stepTwo.vue";
import stepThree from "./components/stepThree.vue";
import upCreative from "./components/upCreative.vue";

export default {
    components: {
        sideBar,
        stepOne,
        stepTwo,
        stepThree,
        upCreative
    },
    data() {
        return {
            account_id: "",
            campaign_id: "",
            targeting_id: "",
            product_refs_id: "",
            adcreative_template_id: "",
            product_type: "", //标的物类型
            configured_status: "", //客户设置的状态
            adgroup_name: "", //广告组名称
            adgroup_id: "",
            site_set: "", //投放站点集合
            begin_date: "", //开始投放日期
            end_date: "", //结束投放日期
            billing_event: "", //计费类型
            bid_amount: "", //广告出价，单位为分
            optimization_goal: "", //广告优化目标类型
            daily_budget: "", //日限额，单位为分
            time_series: "", //投放时间段,格式为 48 * 7 位字符串
            destination_url: "", //落地页 url
            adcreative: "",
            do: "add",
            //导行定位
            //推广计划数据
            plandata: {},
            //
            adgroup: ""
        };
    },
    mounted() {
        //判断有没有account_id
        let query = this.$route.query;
        if (query.account_id) {
            this.account_id = query.account_id;
        } else {
            this.$router.go(-1);
            return;
        }
        if (query.campaign_id) {
            this.campaign_id = query.campaign_id;
        }
        if (query.targeting_id) {
            this.targeting_id = query.targeting_id;
        }
        if (query.product_refs_id) {
            this.product_refs_id = query.product_refs_id;
        }
        if (query.product_type) {
            this.product_type = query.product_type;
        }
        if (query.adgroup_id && this.$store.state.newad.adgroup_detail == "") {
            this.adgroup_id = query.adgroup_id;
            this.do = "edit";
            this.$store.commit("save_step", [2, 0]);
            this.get_adgroup_detail();
        }
        //获取所有状态
        this.$store.dispatch("get_ads_config");
    },
    methods: {
        get_adgroup_detail() {
            Axios.post("api.php", {
                action: "gdtAdPut",
                opt: "get_adgroup_detail",
                account_id: this.account_id,
                adgroup_id: this.adgroup_id
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.$store.commit("save_adgroup_detail", res.data);
                    }
                })
                .catch(err => {
                    console.log("获取详情失败" + err);
                });
        },
        //第一步数据返回
        steponecallback(data) {
            this.plandata = data;

            this.product_type = data.product_type;
            this.configured_status = data.configured_status;
        },
        //第二步数据返回
        steptowcallback(targeting_id, product_refs_id, destination_url) {
            this.targeting_id = targeting_id;
            this.product_refs_id = product_refs_id;
            this.destination_url = destination_url; //落地页 url
        },
        //第三步提交过来的信息
        threeInfo(data) {
            this.adgroup = data;
            this.adcreative_template_id = data.adcreative_template_id; //创意规格id
            this.adgroup_name = data.adgroup_name; //广告组名称
            this.adgroup_id = data.adgroup_id;
            this.site_set = data.site_set; //投放站点集合
            this.begin_date = data.begin_date; //开始投放日期
            this.end_date = data.end_date; //结束投放日期
            this.billing_event = data.billing_event; //计费类型
            this.bid_amount = data.bid_amount; //广告出价，单位为分
            this.optimization_goal = data.optimization_goal; //广告优化目标类型
            this.daily_budget = data.daily_budget * 100; //日限额，单位为分
            this.time_series = data.time_series; //投放时间段,格式为 48 * 7 位字符串
        },

        upCreativeCallback(data) {
            this.adcreative = data;
            this.submit_adgroups();
        },
        //提交广告组
        submit_adgroups() {
            let data = {
                action: "gdtAdPut",
                opt: "ads_cre_add",
                do: this.do, // "edit", //add
                account_id: this.account_id, //广告主帐号 id
                campaign_id: this.campaign_id, //推广计划 id
                targeting_id: this.targeting_id, //定向 id
                product_refs_id: this.product_refs_id, //标的物 id
                adcreative_template_id: "", //创意规格id
                product_type: this.product_type, //标的物类型
                sub_product_refs_id: "", //子标的物 id
                configured_status: this.configured_status, //客户设置的状态
                adgroup_name: this.adgroup_name, //广告组名称
                adgroup_id: this.adgroup_id,
                site_set: JSON.stringify(this.site_set), //投放站点集合
                begin_date: this.begin_date, //开始投放日期
                end_date: this.end_date, //结束投放日期
                billing_event: this.billing_event, //计费类型
                bid_amount: this.bid_amount, //广告出价，单位为分
                optimization_goal: this.optimization_goal, //广告优化目标类型
                daily_budget: this.daily_budget, //日限额，单位为分
                time_series: this.time_series, //投放时间段,格式为 48 * 7 位字符串
                destination_url: this.destination_url, //落地页 url
                adcreative: this.adcreative
                //'deep_link': '', //应用直达页 URL
                //'share_info': '', //分享信息
            };
            console.log(data);
            Axios.post("api.php", data)
                .then(res => {
                    if (res.ret == 1) {
                        this.$Message.info(res.msg);
                        this.$router.go(-1);
                    }
                })
                .catch(err => console.log("广告组" + err));
        }
    },
    watch: {
        adgroup_detail(val) {}
    },
    computed: {
        //步骤
        step() {
            return this.$store.state.newad.step;
        },
        //详情传过来的参数
        adgroup_detail() {
            let adgroup_detail = this.$store.state.newad.adgroup_detail;
            if (adgroup_detail.configured_status) {
                this.configured_status = adgroup_detail.configured_status; //客户设置的状态
            }
            if (adgroup_detail.adgroup_name) {
                this.adgroup_name = adgroup_detail.adgroup_name; //广告组名称
            }
            if (adgroup_detail.adcreative_template_id) {
                this.adcreative_template_id =
                    adgroup_detail.adcreative_template_id; //广告创意id
            }
            if (adgroup_detail.site_set) {
                this.site_set = adgroup_detail.site_set; //投放站点集合
            }
            if (adgroup_detail.begin_date) {
                this.begin_date = adgroup_detail.begin_date; //开始投放日期
            }
            if (adgroup_detail.end_date) {
                this.end_date = adgroup_detail.end_date; //结束投放日期
            }
            if (adgroup_detail.billing_event) {
                this.billing_event = adgroup_detail.billing_event; //计费类型
            }
            if (adgroup_detail.bid_amount) {
                this.bid_amount = adgroup_detail.bid_amount; //广告出价，单位为分
            }
            if (adgroup_detail.optimization_goal) {
                this.optimization_goal = adgroup_detail.optimization_goal; //广告优化目标类型
            }
            if (adgroup_detail.daily_budget) {
                this.daily_budget = adgroup_detail.daily_budget; //日限额，单位为分
            }
            if (adgroup_detail.time_series) {
                this.time_series = adgroup_detail.time_series; //投放时间段,格式为 48 * 7 位字符串
            }
            if (adgroup_detail.destination_url) {
                this.destination_url = adgroup_detail.destination_url; //落地页 url
            }
            if (adgroup_detail.adcreative) {
                this.adcreative = adgroup_detail.adcreative;
            }
            return adgroup_detail;
        }
    }
};
</script>
