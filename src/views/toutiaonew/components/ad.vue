
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
</style>

<template>
    <div class="newtt newtt-ad">

         <targeting-tab></targeting-tab>

         <Card>
             <div class="title-ad">投放目标</div>
              <Form :label-width="100">
                <FormItem label="投放目标">
                    <span class="required-item"></span>
                </FormItem>
                <FormItem label="计划名称">
                    <span class="required-item"></span>
                    <Row>
                        <Col>
                            <Input v-model="campaign_name" placeholder="请输入广告组名称"></Input>
                            <span class="color-red">广告名称长度为1-100个字符，中文占2个字符</span>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        </Card>

    </div>
</template>

<script>
import Axios from "@/api/index";
import targetingTab from './targeting'
export default {
    components: {
        targetingTab
    },
    data() {
        return {
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
            this.getAdgroups();
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
        //广告获取详情
        getAdgroups() {
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "getAdgroups",
                id: this.id
            })
                .then(res => {
                    if (res.ret == 1) {
                        let data = res.data[0];
                    }
                })
                .catch(err => {
                    console.log("广告获取详情" + err);
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
