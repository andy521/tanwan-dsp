<style scoped>
.gdtnew {
  padding: 10px 10px 10px 210px;
  overflow: auto;
  height: 100%;
  font-size: 14px;
}
.padding-20 {
  padding: 20px;
}
</style>
<template>
    <div class="gdtnew">
        <!-- 导行 -->
        <side-bar :step="0"></side-bar>

        <Card dis-hover>
            <div class="padding-20">
                <Tabs :animated="false">
                    <TabPane label="新建推广计划">
                        <Row>
                            <Col span="12">
                            <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100" class="margin-top-20">
                                <FormItem label="推广计划名称" prop="campaign_name">
                                    <Input v-model="formCustom.campaign_name" placeholder="请输入推广计划名称" size="large"></Input>
                                </FormItem>
                                <FormItem label="计划类型" prop="campaign_type">
                                    <Select v-model="formCustom.campaign_type" placeholder="请选择计划类型" @on-change="campaign_type_change" size="large">
                                        <Option v-for="item in gdtConfig.campaign_type" :key="item.val_type" :value="item.val_type">{{item.name}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="日消耗限额" prop="daily_budget" v-if="formCustom.campaign_type!='CAMPAIGN_TYPE_WECHAT_MOMENTS'">
                                    <Input v-model="formCustom.daily_budget" placeholder="请输入消耗限额" size="large"></Input>
                                </FormItem>
                                <FormItem label="标的物类型" prop="product_type">
                                    <Select v-model="formCustom.product_type" placeholder="请选择标的物类型" size="large">
                                        <Option v-for="item in gdtConfig.product_type" :key="item.val_type" :value="item.val_type">{{item.name}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="开启状态" prop="configured_status">
                                    <Select v-model="formCustom.configured_status" placeholder="请选择开启状态" size="large">
                                        <Option v-for="item in gdtConfig.configured_status" :key="item.val_type" :value="item.val_type">{{item.name}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="投放速度模式" prop="speed_mode">
                                    <Select v-model="formCustom.speed_mode" placeholder="请选择投放速度模式" size="large">
                                        <Option v-for="item in gdtConfig.speed_mode" :key="item.val_type" :value="item.val_type">{{item.name}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" size="large" @click="handleSubmit()">下一步</Button>
                                </FormItem>
                            </Form>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="选择已有推广计划">
                        <campaignList></campaignList>
                    </TabPane>
                </Tabs>
            </div>
        </Card>
    </div>
</template>

<script>
import Axios from "@/api/index";
import gdtConfig from "@/utils/gdtConfig.json";
import sideBar from "./components/sideBar.vue";
import campaignList from "./components/campaignList.vue";
export default {
    components: {
        sideBar,
        campaignList
    },
    data() {
        const validatecampaign_name = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入推广计划名称"));
            } else {
                callback();
            }
        };
        const validatedaily_budget = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入消耗限额"));
            } else if (value < 50 || value > 4000000) {
                callback(new Error("50 元-4,000,000 元，单位为人民币"));
            } else {
                callback();
            }
        };
        return {
            gdtConfig: gdtConfig,
            account_id: this.$route.query.account_id, //账户id
            formCustom: {
                campaign_name: "",
                daily_budget: "",
                campaign_type: "",
                product_type: "",
                configured_status: "",
                speed_mode: ""
            },
            ruleCustom: {
                campaign_name: [
                    {
                        required: true,
                        validator: validatecampaign_name,
                        trigger: "blur"
                    }
                ],
                campaign_type: [
                    {
                        required: true,
                        message: "请选择计划类型",
                        trigger: "change"
                    }
                ],
                daily_budget: [
                    {
                        required: true,
                        validator: validatedaily_budget,
                        trigger: "blur"
                    }
                ],
                product_type: [
                    {
                        required: true,
                        message: "请选择标的物类型",
                        trigger: "change"
                    }
                ],
                configured_status: [
                    {
                        required: true,
                        message: "请选择开启状态",
                        trigger: "change"
                    }
                ],
                speed_mode: [
                    {
                        required: true,
                        message: "请选择投放速度模式",
                        trigger: "change"
                    }
                ]
            },
        };
    },
    mounted() {

    },
    methods: {
        campaign_type_change(campaign_type) {
            if (campaign_type == "CAMPAIGN_TYPE_WECHAT_MOMENTS") {
                this.daily_budget == "";
            }
        },
        //提交第一步填写数据
        handleSubmit() {
            this.$refs['formCustom'].validate(valid => {
                if (valid) {
                    Axios.post("api.php", {
                        action: "gdtAdPut",
                        opt: "campaigns_add",
                        do: "edit",
                        account_id: this.account_id,
                        campaign_type: this.formCustom.campaign_type,
                        campaign_name: this.formCustom.campaign_name,
                        daily_budget: this.formCustom.daily_budget * 100,
                        product_type: this.formCustom.product_type,
                        configured_status: this.formCustom.configured_status,
                        speed_mode: this.formCustom.speed_mode
                    }).then(res => {
                        if (res.ret == 1) {
                            this.$Message.success("提交成功");
                            console.log(res.data)
                            this.$router.push({
                                name: 'gdtad',
                                query: {
                                    account_id: this.account_id,
                                    campaign_id: res.data.campaign_id,
                                    product_type: this.formCustom.product_type,
                                    campaign_type:this.formCustom.campaign_type,
                                    configured_status: this.formCustom.configured_status
                                }
                            })
                        }
                    }).catch(err => {
                        console.log("新建广告计划" + err);
                    });
                } else {
                    this.$Message.info("请填写完整资料");
                }
            });
        },
    }
};
</script>
