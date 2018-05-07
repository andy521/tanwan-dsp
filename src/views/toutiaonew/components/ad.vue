
<template>
    <div class="formitem">
        <Row>
            <Col span="12">
            <Form :label-width="100">
                <FormItem label="选择推广目的">
                    <RadioGroup v-model="landing_type" type="button" size="large">
                        <Radio :label="item.val_type" v-for="item in toutiaoConfig.landing_type" :key="this">{{item.name}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="预算">
                    <RadioGroup v-model="budget_mode" key="*this" type="button" size="large">
                        <Radio :label="item.val_type" v-for="item in toutiaoConfig.budget_mode" :key="this" :disabled="item.val_type=='BUDGET_MODE_TOTAL'?true:false">{{item.name}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem v-show="budget_mode!='BUDGET_MODE_INFINITE'">
                    <Input v-model="budget" placeholder="RMB"></Input>
                </FormItem>
                <Row>
                </Row>
                <FormItem label="广告组名称">
                    <Input v-model="campaign_name" placeholder="请输入广告组名称"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submitCampaign()">保存并继续</Button>
                </FormItem>
            </Form>
            </Col>
        </Row>
    </div>
</template>

<script>
import Axios from "@/api/index";
import toutiaoConfig from "@/utils/toutiaoConfig.json";
export default {
    data() {
        return {
            toutiaoConfig: toutiaoConfig,
            account_id: this.$route.query.account_id, //账户id
            id: this.$route.query.id, //
            campaign_id: "", //广告组id
            landing_type: "LINK", //广告组推广目的
            budget_mode: "BUDGET_MODE_INFINITE", //广告组预算类型
            budget: "", //广告组预算
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
                        this.budget = data.budget;
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
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "updateCampaign",
                account_id: this.account_id,
                campaign_id: this.campaign_id,
                modify_time: this.modify_time,
                campaign_name: this.campaign_name,
                landing_type: this.landing_type,
                budget_mode: this.budget_mode,
                budget: this.budget
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.$Message.info(res.msg);
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
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "addCampaign",
                account_id: this.account_id,
                campaign_name: this.campaign_name,
                landing_type: this.landing_type,
                budget_mode: this.budget_mode,
                budget:this.formItem.budget_mode=="BUDGET_MODE_INFINITE"?"": this.formItem.budget,
          
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.$Message.info(res.msg);
                    }
                })
                .catch(err => {
                    console.log("提交广告组" + err);
                });
        }
    }
};
</script>