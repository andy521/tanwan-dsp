<template>
    <Card shadow>
        <div>
            <Select v-model="account_id" placeholder="请选择帐号" style="width:250px;" @on-change="getfund()">
                <Option value="">全部帐号</Option>
                <Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
            </Select>
            <RadioGroup v-model="fundType" @on-change="getfund()">
                <Radio label="1">现金</Radio>
                <Radio label="2">虚拟金额</Radio>
                <Radio label="3">分成账户</Radio>
                <Radio label="4">信用</Radio>
            </RadioGroup>
        </div>
        <Table :columns="fundcolumns" :data="funddata" :loading="loading" :size="tableSize" class="margin-top-10"></Table>
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
    </Card>
</template>
<script>
import Axios from "@/api/index";
export default {
    data() {
        return {
            account_id: "",
            loading: false,
            mediaList: [],
            fundcolumns: [
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
                    title: "用户",
                    key: "author"
                },
                {
                    title: "账户类型",
                    key: "fund_type",
                    render: (h, params) => {
                        let fund_type;
                        if (params.row.fund_type == 1) {
                            fund_type = "现金";
                        }
                        if (params.row.fund_type == 2) {
                            fund_type = "虚拟金额";
                        }
                        if (params.row.fund_type == 3) {
                            fund_type = "分成账户";
                        }
                        if (params.row.fund_type == 4) {
                            fund_type = "信用";
                        }
                        return h("span", fund_type);
                    }
                },
                {
                    title: "余额（元）",
                    key: "balance",
                    render: (h, params) => {
                        var re = /^[0-9]+.?[0-9]*$/;
                        if (re.test(params.row.balance)) {
                            //三位数加逗号
                            let newvalue = String(params.row.balance).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            return [h("span", newvalue)];
                        } else {
                            return [h("span", params.row.balance)];
                        }
                    }
                },
                {
                    title: "当日花费（元）",
                    key: "realtime_cost",
                    render: (h, params) => {
                        var re = /^[0-9]+.?[0-9]*$/;
                        if (re.test(params.row.realtime_cost)) {
                            //三位数加逗号
                            let newvalue = String(params.row.realtime_cost).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            return [h("span", newvalue)];
                        } else {
                            return [h("span", params.row.realtime_cost)];
                        }
                    }
                }
            ],
            funddata: [],
            fundType: '1',
            tableSize: "small",
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1 //总页数
        };
    },
    mounted() {
        this.getMedia();
        this.getfund();
    },
    methods: {
        //获取财务信息
        getfund(page) {
            if (page === undefined) {
                this.$refs["fundpage"].currentPage = 1;
                this.page = 1;
            } else {
                this.page = page;
            }
            this.loading = true;
            Axios.post("api.php", {
                action: "gdtaccount",
                opt: "funds_get",
                account_id: this.account_id,
                fundType: this.fundType
            })
                .then(res => {
                    this.loading = false;
                    if (res.ret == 1) {
                        this.funddata = res.data.list;
                        this.total_number = res.data.total_number;
                        this.total_page = res.data.total_page;
                    }
                })
                .catch(err => {
                    this.loading = false;
                    console.log("获取财务信息" + err);
                });
        },
        //获取媒体账号
        getMedia() {
            Axios.post("api.php", {
                action: "api",
                opt: "getAccount",
                media_type: 1
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.mediaList = res.data;
                    }
                })
                .catch(err => {
                    console.log("获取媒体账号" + err);
                });
        }
    }
};
</script>
