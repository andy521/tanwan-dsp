<style scoped>
.smedia {
  display: inline-block;
  width: auto;
  min-width: 150px;
}</style>
<template>
    <Card shadow>
        <div>
            <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
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
import {
    DateShortcuts,
    formatDate,
    changetime,
    deepClone
} from "@/utils/DateShortcuts.js";
export default {
    data() {
        return {
            loading: false,
            options: DateShortcuts, //日期辅助功能
            media_type:"",
            DateDomain: [
                formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd")
            ], //筛选时间
            fundcolumns: [
                {
                    title: "帐户名",
                    key: "account_name"
                },
                {
                    title: "代理商",
                    key: "agent"
                },
                {
                    title: "充值返点比例",
                    key: "rebate"
                },
                {
                    title: "充值账户币",
                    key: "recharge_money"
                },
                {
                    title: "充值人民币（元）",
                    key: "money",
                     render: (h, params) => {
                        var re = /^[0-9]+.?[0-9]*$/;
                        if (re.test(params.row.money)) {
                            //三位数加逗号
                            let newvalue = (params.row.money)
                                .toString()
                                .split("")
                                .reverse()
                                .join("")
                                .replace(/(\d{3})/g, "$1,")
                                .replace(/\,$/, "")
                                .split("")
                                .reverse()
                                .join("");
                            return [h("span", newvalue)];
                        } else {
                            return [h("span", params.row.recharge_money)];
                        }
                    }
                },
                {
                    title: "负责人",
                    key: "author"
                },
                {
                    title: "备注",
                    key: "mark"
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
                media_type: 1,//this.media_type,
                start_date: this.DateDomain[0], //开始时间
                end_date: this.DateDomain[1], //结速时间
            })
                .then(res => {
                    this.loading = false;
                    if (res.ret == 1) {
                        this.funddata = res.data;
                        this.total_number = res.data.total_number;
                        this.total_page = res.data.total_page;
                    }
                })
                .catch(err => {
                    this.loading = false;
                    console.log("获取充值列表" + err);
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
    }
};
</script>
