<style scoped>
.formitem {
    max-width: 800px;
}
</style>

<template>
    <div class="formitem">
        <Form :model="formItem" :label-width="100">
            <FormItem label="选择推广目的">
                <RadioGroup v-model="formItem.landing_type" type="button" size="large">
                    <Radio :label="item.val_type" v-for="item in toutiaoConfig.landing_type" :key="this">{{item.name}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="预算">
                <RadioGroup v-model="formItem.budget_mode" key="*this" type="button" size="large">
                    <Radio :label="item.val_type" v-for="item in toutiaoConfig.budget_mode" :key="this" :disabled="item.val_type=='BUDGET_MODE_TOTAL'?true:false">{{item.name}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem v-show="formItem.budget_mode!='BUDGET_MODE_INFINITE'">
                <Input v-model="formItem.budget" placeholder="RMB"></Input>
            </FormItem>
            <Row>
            </Row>
            <FormItem label="广告组名称">
                <Input v-model="formItem.campaign_name" placeholder="请输入广告组名称"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submitCampaign()">保存并继续</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import Axios from "@/api/index";
import toutiaoConfig from "@/utils/toutiaoConfig.json";
export default {
    data() {
        return {
            toutiaoConfig: toutiaoConfig,
            account_id:this.$route.query.account_id,
            formItem: {
                landing_type: "LINK",
                budget_mode: "BUDGET_MODE_INFINITE",
                budget: "",
                campaign_name: ""
            }
        };
    },
    methods: {
        submitCampaign() {



            Axios.post("api.php", {
                action: "ttAdPut",
                opt:"addCampaign",
                account_id: this.account_id,
                campaign_name: this.formItem.campaign_name,
                landing_type: this.formItem.landing_type,
                budget_mode:this.formItem.budget_mode,
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