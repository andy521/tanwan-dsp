
<style>
@import "../index.less";
.newtt-campaign {
    background-color: #fff;
    padding: 30px;
}
.newtt-campaign .ivu-tabs-bar {
  border-bottom: none;
  margin-bottom: 38px;
}
</style>

<template>
    <div class="newtt newtt-campaign">

        <Tabs :animated="false">
            <TabPane label="创建新广告组">
                <Row>
                    <Col span="12">
                        <Form :label-width="100">
                            <FormItem label="选择推广目的">
                                <span class="required-item"></span>
                                <RadioGroup v-model="landing_type" type="button" size="large">
                                    <Radio :disabled="id && item.val_type !== landing_type" :label="item.val_type" v-for="item in toutiaoConfig.landing_type" :key="this">{{item.name}}</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="预算">
                                <span class="required-item"></span>
                                <RadioGroup v-model="budget_mode" key="*this" type="button" size="large">
                                    <Radio :label="item.val_type" v-for="item in toutiaoConfig.budget_mode" :key="this" :disabled="item.val_type=='BUDGET_MODE_TOTAL'?true:false">{{item.name}}</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem v-show="budget_mode!='BUDGET_MODE_INFINITE'">
                                <Input @on-blur="handleBudget" v-model="budget" placeholder="RMB"></Input>
                            </FormItem>
                            <FormItem label="广告组名称">
                                <span class="required-item"></span>
                                <Input v-model="campaign_name" placeholder="请输入广告组名称"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="submitCampaign()">保存并继续</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="选择已有广告组">
                <cho-list @on-change="handleSeleCampaign"></cho-list>
            </TabPane>
        </Tabs>

    </div>
</template>

<script>
import Axios from "@/api/index";
import toutiaoConfig from "@/utils/toutiaoConfig.json";
import choList from './choseList'
export default {
    components: {
        choList
    },
    data() {
        return {
            toutiaoConfig: toutiaoConfig,
            account_id: this.$route.query.account_id, //账户id
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
        };
    },
    mounted() {
        if (this.id) {
            this.getCampaigns();
        }
    },
    methods: {
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
                });
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
                });
                return
            } else {
                this.budgetTip.isSubmit = true
            }
        },
        //广告组获取详情
        getCampaigns() {
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "getCampaigns",
                id: this.id
            })
                .then(res => {
                    if (res.ret == 1) {
                        let data = res.data[0];
                        this.account_id = data.account_id;
                        this.campaign_id = data.campaign_id;
                        this.budget_mode = data.budget_mode
                        this.initBudget = this.budget = data.budget;
                        this.modify_time = data.modify_time;
                        this.campaign_name = data.campaign_name;
                        this.landing_type = data.landing_type;
                        this.modify_time = data.modify_time;
                    }
                })
                .catch(err => {
                    console.log("广告组获取详情" + err);
                });
        },
        //广告组修改
        updateCampaign() {
            this.handleBudget()
            if (!this.budgetTip.isSubmit) {
                return
            }
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "updateCampaign",
                account_id: this.account_id,
                campaign_id: this.campaign_id,
                modify_time: this.modify_time,
                campaign_name: this.campaign_name,
                landing_type: this.landing_type,
                budget_mode: this.budget_mode,
                budget: this.budget_mode=="BUDGET_MODE_INFINITE"?"": this.budget
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.$Message.info(res.msg);
                        this.$router.push({
                            name: 'tt_campaign'
                        })
                    }
                })
                .catch(err => {
                    console.log("修改广告组" + err);
                });
        },
        //提交
        submitCampaign() {
            if (this.id) {
                this.updateCampaign();
            } else {
                this.addCampaign();
            }
        },
        //添加广告组
        addCampaign() {
            // 次account_id 只在开发时使用，上线前删掉
            this.account_id = '93949559469'

            this.handleBudget()
            if (!this.budgetTip.isSubmit) {
                return
            }
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "addCampaign",
                account_id: this.account_id,
                campaign_name: this.campaign_name,
                landing_type: this.landing_type,
                budget_mode: this.budget_mode,
                budget:this.budget_mode=="BUDGET_MODE_INFINITE"?"": this.budge
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
                    console.log("提交广告组" + err);
                });
        }
    }
};
</script>
