
<style scoped>
.newtt {
  padding: 20px;
}
</style>
<template>
    <Card dis-hover>
        <div class="newtt">
            <Tabs :animated="false">
                <TabPane label="创建新广告组">
                    <Row>
                        <Col span="12">
                        <Form :label-width="100" class="margin-top-20">
                            <FormItem label="选择推广目的">
                                <RadioGroup v-model="landing_type" type="button" size="large">
                                    <template v-if="id">
                                        <Radio :label="item.val_type" v-for="item in toutiaoConfig.landing_type" :key="this" v-if="item.val_type == landing_type">{{item.name}}</Radio>
                                    </template>
                                    <template v-else>
                                        <Radio :label="item.val_type" v-for="item in toutiaoConfig.landing_type" :key="this">{{item.name}}</Radio>
                                    </template>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="预算">
                                <RadioGroup v-model="budget_mode" type="button" size="large">
                                    <Radio :label="item.val_type" v-for="item in toutiaoConfig.budget_mode" :key="this" v-if="item.val_type!='BUDGET_MODE_TOTAL'">{{item.name}}</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem v-show="budget_mode!='BUDGET_MODE_INFINITE'">
                                <Input v-model="budget" placeholder="RMB"></Input>
                            </FormItem>
                            <FormItem label="广告组名称">
                                <Input v-model="campaign_name" placeholder="请输入广告组名称"></Input>
                            </FormItem>
                            <FormItem v-if="id">
                                <Button type="primary" @click="submitCampaign()">确定修改</Button>
                            </FormItem>
                            <FormItem v-else>
                                <Button type="primary" @click="submitCampaign()">保存并继续</Button>
                            </FormItem>
                        </Form>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="选择已有广告组">
                    <cho-list></cho-list>
                </TabPane>
            </Tabs>
        </div>
    </Card>
</template>

<script>
import Axios from "@/api/index";
import toutiaoConfig from "@/utils/toutiaoConfig.json";
import choList from './choseList.vue'
export default {
    components: {
        choList
    },
    data() {
        return {
            toutiaoConfig: toutiaoConfig,
            account_id: this.$route.query.account_id, //账户id
            id: this.$route.query.id, //行id
            campaign_id: "", //广告组id
            landing_type: "LINK", //广告组推广目的
            budget_mode: "BUDGET_MODE_INFINITE", //广告组预算类型
            budget: '', //广告组预算
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
            }).then(res => {
                if (res.ret == 1) {
                    let data = res.data[0];
                    this.campaign_id = data.campaign_id;
                    this.landing_type = data.landing_type;
                    this.budget_mode = data.budget_mode
                    this.modify_time = data.modify_time;
                    this.campaign_name = data.campaign_name;
                    this.budget = data.budget
                }
            }).catch(err => {
                console.log("广告组获取详情" + err);
            });
        },
        //提交
        submitCampaign() {
            if (this.budget_mode != "BUDGET_MODE_INFINITE" && this.budget < 1000) {
                this.$Message.info("请输入正确日算额");
                return;
            }
            if (this.id) {
                this.updateCampaign();
            } else {
                this.addCampaign();
            }
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
                budget: this.budget_mode == "BUDGET_MODE_INFINITE" ? "" : this.budget
            }).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    //返回
                    this.$router.go(-1);
                }
            }).catch(err => {
                console.log("修改广告组" + err);
            });
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
                budget: this.budget_mode == "BUDGET_MODE_INFINITE" ? "" : this.budget
            }).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.$router.push({
                        name: 'ttad',
                        query: {
                            account_id:this.account_id,
                            campaign_id: res.data.campaign_id
                        }
                    })
                }
            }).catch(err => {
                console.log("提交广告组" + err);
            });
        }
    }
};
</script>
