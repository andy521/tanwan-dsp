<style scoped>
.inp {
  display: inline-block;
  width: 150px;
}
</style>
<template>
    <Card shadow>
        <Row>
            <Col span="14">
            <!--选择负责人-->
            <select-author :is-linkage="true" :media-type="mediaType" @on-change="authorChange"></select-author>
            <!--选择代理商-->
            <select-agent @on-change="agentChange"></select-agent>
            <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
            <Input v-model="account_name" class="inp" placeholder="请输入帐户名" clearable @on-enter="getfund()"></Input>
            <Button type="primary" icon="search" @click="getfund()">搜索</Button>
            </Col>
            <Col span="10" style="text-align: right;">

            <Poptip confirm title="选中内容通过审核？" placement="bottom-end" @on-ok="audit()" style="text-align: left;">
                <Button type="ghost" icon="checkmark">审核</Button>
            </Poptip>

            <Poptip confirm title="您确认删除选中内容吗？" placement="bottom-end" @on-ok="removeRecharge()" style="text-align: left;">
                <Button type="ghost" icon="trash-a">删除</Button>
            </Poptip>
            <Button type="ghost" icon="document-text" @click="exportData()">下载报表</Button>
            </Col>
        </Row>

        <Table :columns="fundcolumns" :data="funddata" :loading="loading" :size="tableSize" class="margin-top-10" ref="rechargetable" @on-selection-change="taCheck"></Table>

        <Row class="margin-top-10">
            <Col span="10"> 表格尺寸
            <Radio-group v-model="tableSize" type="button">
                <Radio label="large">大</Radio>
                <Radio label="default">中</Radio>
                <Radio label="small">小</Radio>
            </Radio-group>
            每页显示
            <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getfund()">
                <Option v-for="item in 500" :value="item" :key="item" v-if="item%50==0">{{ item }}</Option>
            </Select>
            </Col>
            <Col span="14" style="text-align: right;">
            <Page :total="total_number" :page-size="page_size" ref="fundpage" @on-change="getfund" show-elevator show-total></Page>
            </Col>
        </Row>
        <Modal v-model="win_modal" title="充值记录" @on-ok="changeConfirm">
            <Form :model="row" :label-width="80" :rules="ruleValidate" ref="formValidate">
                <FormItem label="负责人" prop="author">
                    <Select v-model="row.author">
                        <Option v-for="item in thour_list" :value="item.uName" :key="this">{{ item.uName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="代理商" prop="agent">
                    <Select v-model="row.agent">
                        <Option v-for="item in agent_list" :value="item.agent" :key="this">{{ item.agent }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="充值金额" prop="money">
                    <Input v-model="row.money" placeholder="请输入充值金额（元）" clearable></Input>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="row.mark" placeholder="请输入备注" clearable></Input>
                </FormItem>
            </Form>

        </Modal>
    </Card>
</template>
<script>
import Axios from "@/api/index";
import {
    DateShortcuts,
    formatDate,
    changetime,
    deepClone
} from "@/utils/DateShortcuts.js";
import selectAuthor from "@/components/select-author/index.vue";
import selectAgent from "@/components/select-agent/index.vue";
export default {
    components: {
        selectAuthor,
        selectAgent
    },
    data() {
        return {
            win_modal: false,
            row: {
                id: "",
                account_id: "",
                money: "",
                mark: "",
                author: "",
                agent: ""
            },
            ruleValidate: {
                author: [
                    { required: true, message: '请选择负责人', trigger: 'change' }
                ],
                agent: [
                    { required: true, message: '请选择代理商', trigger: 'change' }
                ],
                money: [
                    { required: true, message: '请输入充值金额', trigger: 'blur' }
                ]
            },
            thour_list: [],
            agent_list: [],
            loading: false,
            options: DateShortcuts, //日期辅助功能
            agent: "",
            mediaType: 4,
            edit_status: "",
            author: [],
            account_name: "",
            DateDomain: [
                formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd")
            ], //筛选时间
            taCheckids: [], //选中ids
            fundcolumns: [
                {
                    type: "selection",
                    width: 58,
                    key: ""
                },
                {
                    title: "帐户名",
                    key: "account_name"
                },
                {
                    title: "代理简称",
                    key: "agent"
                },
                 {
                    title: "代理全称",
                    key: "agent_detail"
                },
                {
                    title: "当前账户余额",
                    width: 140,
                    key: "balance"
                },
                {
                    title: "过去三天日均消耗",
                    width: 140,
                    key: "cost"
                },
                {
                    title: "充值返点比例",
                    width: 140,
                    key: "rebate"
                },
                {
                    title: "充值账户币",
                    key: "recharge_money"
                },
                {
                    title: "充值人民币（元）",
                    width: 140,
                    key: "money",
                    render: (h, params) => {
                        var re = /^[0-9]+.?[0-9]*$/;
                        if (re.test(params.row.money)) {
                            //三位数加逗号
                            let newvalue = String(params.row.money).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            return [h("span", newvalue)];
                        } else {
                            return [h("span", params.row.recharge_money)];
                        }
                    }
                },
                {
                    title: "充值时间",
                    key: 'date',
                    width: 100
                },
                {
                    title: "负责人",
                    key: "author"
                },
                {
                    title: "备注",
                    key: "mark"
                },
                {
                    title: "状态",
                    key: "status",
                    render: (h, params) => {
                        if (params.row.status == 0) {
                            return h("span", {
                                style: {
                                    color: "#f30"
                                },
                            }, "待审核");
                        } else {
                            return h("span", {
                                style: {
                                    color: "#0c6"
                                },
                            }, "已处理");
                        }
                    }
                },
                {
                    title: "操作",
                    width: 100,
                    key: "",
                    render: (h, params) => {
                        return [
                            h(
                                "span",
                                {
                                    class: "edit_link",
                                    on: {
                                        click: () => {
                                            if (params.row.status == 1) {
                                                this.$Message.info("已处理状态不能编辑");
                                                return;
                                            }
                                            if (this.thour_list.length == 0) {
                                                this.getAdsAthour();
                                            }
                                            if (this.agent_list.length == 0) {
                                                this.getAgent();
                                            }
                                            this.win_modal = true;
                                            this.row.id = params.row.id;
                                            this.row.account_id = params.row.account_id;
                                            this.row.money = params.row.money;
                                            this.row.mark = params.row.mark;
                                            this.row.author = params.row.author;
                                            this.row.agent = params.row.agent;
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            h(
                                "span",
                                {
                                    class: "del_link",
                                    on: {
                                        click: value => {
                                            if (params.row.status == 1) {
                                                this.$Message.info("已处理状态不能删除");
                                                return;
                                            }
                                            this.$Modal.confirm({
                                                title: "操作提示",
                                                content: "<p>确认删除</p>",
                                                onOk: () => {
                                                    Axios.post("api.php", {
                                                        action: "sys",
                                                        opt: "accountRechargeDel",
                                                        ids: params.row.id.split(",")
                                                    }).then(res => {
                                                        if (res.ret == 1) {
                                                            this.$Message.info(res.msg);
                                                            this.getfund();
                                                        }
                                                    }).catch(err => {
                                                        this.loading = false;
                                                        console.log("删除充值记录" + err);
                                                    });
                                                }
                                            });

                                        }
                                    }
                                },
                                "删除"
                            )
                        ];
                    }
                }
            ],
            funddata: [],
            tableSize: "small",
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1 //总页数
        };
    },
    mounted() {
        this.getfund();
    },
    methods: {
        //获取充值列表
        getfund(page) {
            if (page === undefined) {
                this.$refs["fundpage"].currentPage = 1;
                this.page = 1;
            } else {
                this.page = page;
            }
            this.loading = true;
            Axios.post("api.php", {
                action: "sys",
                opt: "accountRechargeData",
                media_type: this.mediaType,
                agent: this.agent,
                author: this.author,
                account_name: this.account_name,
                start_date: this.DateDomain[0], //开始时间
                end_date: this.DateDomain[1], //结速时间
            }).then(res => {
                this.loading = false;
                if (res.ret == 1) {
                    this.funddata = res.data.list;
                    this.total_number = res.data.total_number;
                    this.total_page = res.data.total_page;
                }
            }).catch(err => {
                this.loading = false;
                console.log("获取充值列表" + err);
            });
        },
        //审核
        audit() {
            if (this.taCheckids.length == 0) {
                this.$Message.info("请勾选内容");
                return;
            }
            Axios.post("api.php", {
                action: "sys",
                opt: "accountRechargeChange",
                ids: this.taCheckids
            }).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.getfund();
                }
            }).catch(err => {
                this.loading = false;
                console.log("审核充值" + err);
            });
        },
        //删除
        removeRecharge() {
            if (this.taCheckids.length == 0) {
                this.$Message.info("请勾选内容");
                return;
            }
            Axios.post("api.php", {
                action: "sys",
                opt: "accountRechargeDel",
                ids: this.taCheckids
            }).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.getfund();
                }
            }).catch(err => {
                this.loading = false;
                console.log("删除充值记录" + err);
            });
        },
        //改变日期
        changeDate(e) {
            this.DateDomain = e;
            this.getfund();
        },
        //按媒体筛选
        mediaChange(val) {
            this.media_type = val;
            this.getfund();
        },
        //选择负责人
        authorChange(data) {
            this.author = data;
            this.getfund();
        },
        //选择代理商
        agentChange(data) {
            this.agent = data;
            this.getfund();
        },
        //获取选中的id
        taCheck(row) {
            let ids = [];
            row.forEach(item => {
                ids.push(item.id);
            });
            this.taCheckids = ids;
        },
        //导出报表
        exportData(type) {
            this.$refs["rechargetable"].exportCsv({
                filename: "充值记录",
                original: false
            });
        },
        //获取管理员
        getAdsAthour() {
            Axios.post('api.php', {
                action: 'sys',
                opt: 'getAdsAthour'
            }).then(res => {
                if (res.ret == 1) {
                    this.thour_list = res.data;
                }
            }).catch(err => {
                console.log('获取管理员' + err)
            })
        },
        //获取代理商
        getAgent() {
            Axios.post("api.php", {
                action: "sys",
                opt: "getAgent",
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.agent_list = res.data;
                    }
                }
            ).catch(err => { console.log(err) });
        },
        //修改
        changeConfirm() {
            this.$refs["formValidate"].validate((valid) => {
                if (valid) {
                    Axios.post('api.php', {
                        action: 'sys',
                        opt: 'updateAccountRecharge',
                        id: this.row.id,
                        account_id: this.row.account_id,
                        money: this.row.money,
                        mark: this.row.mark,
                        author: this.row.author,
                        agent: this.row.agent
                    }).then(
                        res => {
                            if (res.ret == 1) {
                                this.$Message.info(res.msg);
                                this.getfund();
                            }
                        }
                    ).catch(
                        err => {
                            console.log('修改帐户失败' + err)
                        }
                    )
                } else {
                    this.$Message.info('请填写正确信息');
                }
            })
        }
    }
};
</script>
