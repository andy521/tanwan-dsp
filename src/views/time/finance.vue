<style scoped>
.ivu-tabs {
    overflow: inherit;
}
.typediv {
    line-height: 32px;
    display: inline-block;
    margin-right: 10px;
}
.mt20 {
    margin-top: 20px;
}
</style>
<template>
    <Card :bordered="false" shadow>
        <p>
            <Row>
                <Col>
                <Tabs value="name1" :animated="false">
                    <TabPane label="资金流水" name="name1">
                        <div>
                            <Select v-model="account_id" placeholder="请选择帐号" style="width:250px;" @on-change="getfund">
                                <Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                            </Select>
                            <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
                            <span class="typediv">账户类型:</span>
                            <RadioGroup v-model="fundType" @on-change="getfund">
                                <Radio label="1">现金</Radio>
                                <Radio label="2">虚拟金额</Radio>
                                <Radio label="3">分成账户</Radio>
                                <Radio label="4">信用</Radio>
                            </RadioGroup>
                        </div>
                        <Table :columns="fundcolumns" :data="funddata" class="mt20"></Table>
                    </TabPane>
                    <TabPane label="财务信息" name="name2">
                        <div>
                            <Select v-model="account_id2" placeholder="请选择帐号" style="width:250px;" @on-change="funds_get">
                                <Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                            </Select> 
                        </div>
                        <Table :columns="fundscolumns" :data="fundsdata" class="mt20"></Table>
                    </TabPane>
                </Tabs>

                </Col>
            </Row>
        </p>
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
export default {
    data() {
        return {
            account_id: "",
            account_id2:"",
            fundType: "1",
            options: DateShortcuts, //日期辅助功能
            DateDomain: [
                formatDate(new Date(), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd")
            ], //筛选时间
            account_id: "",
            mediaList: [],
            fundcolumns: [
                {
                    title: "日期",
                    key: "date"
                },
                {
                    title: "帐户id",
                    key: "account_id"
                },
                {
                    title: "存入（元）",
                    key: "save"
                },
                {
                    title: "支出（元）",
                    key: "pay"
                },
                {
                    title: "备注",
                    key: "description"
                }
            ],
            funddata: [],
            fundscolumns: [
                {
                    title: "帐户名",
                    key: "account_name"
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
                    title: "余额",
                    key: "balance"
                },
                {
                    title: "当日花费",
                    key: "realtime_cost"
                }
            ],
            fundsdata: []
        };
    },
    mounted() {
        this.getMedia();
        this.getfund();
    },
    methods: {
        //改变日期
        changeDate(e) {
            this.DateDomain = e;
            this.getfund();
            this.funds_get();
        },
        //获取资金流水
        getfund() {
            Axios.get("api.php", {
                action: "gdtaccount",
                opt: "fund_statements_detailed",
                account_id: this.account_id,
                fundType: this.fundType,
                startDate: this.DateDomain[0],
                endDate: this.DateDomain[1]
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.funddata = res.data.list;
                    }
                })
                .catch(err => {
                    console.log("获取资金流水" + err);
                });
        },
        //获取财务信息
        funds_get() {
            Axios.get("api.php", {
                action: "gdtaccount",
                opt: "funds_get",
                account_id: this.account_id2
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.fundsdata = res.data.list;
                    }
                })
                .catch(err => {
                    console.log("获取财务信息" + err);
                });
        },
        //获取媒体账号
        getMedia() {
            Axios.get("api.php", {
                action: "api",
                opt: "getAccount",
                MeidaType: "Gdt"
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
