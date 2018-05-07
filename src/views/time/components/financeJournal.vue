<style>
.mt20 {
    margin-top: 20px;
}
.table-statistics {
    color: #2b7ed1;
    font-weight: bold;
}
</style>

<template>
    <div>

        <Row>
            <Col span="18">
            <Select v-model="account_id" placeholder="请选择帐号" style="width:250px;" @on-change="getfund()">
                <Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
            </Select>
            <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
            <RadioGroup v-model="fundType" @on-change="getfund">
                <Radio label="1">现金</Radio>
                <Radio label="2">虚拟金额</Radio>
                <Radio label="3">分成账户</Radio>
                <Radio label="4">信用</Radio>
            </RadioGroup>
            </Col>
            <Col span="6" style=" text-align: right;">
            <Button type="ghost" icon="document-text" @click="exportData()">下载当前数据</Button>
            <Button type="ghost" icon="document-text" @click="downmodal=true">下载所有数据</Button>
            </Col>
        </Row>
        <Table :columns="fundcolumns" :data="funddata" height="650" :loading="loading" :size="tableSize" class="mt20" :row-class-name="rowClassName" ref="journaltable"></Table>
        <Row class="margin-top-10">
            <Col span="10"> 表格尺寸
            <Radio-group v-model="tableSize" type="button">
                <Radio label="large">大</Radio>
                <Radio label="default">中</Radio>
                <Radio label="small">小</Radio>
            </Radio-group>
            每页显示
            <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getfund()">
                <Option v-for="item in 100" :value="item" :key="item" v-if="item%25==0">{{ item }}</Option>
            </Select>
            </Col>
            <Col span="14" style="text-align: right;">
            <Page :total="total_number" :page-size="page_size" ref="pages" @on-change="getfund" show-elevator show-total></Page>
            </Col>
        </Row>

        <Modal v-model="downmodal" title="选择时间" @on-ok="exportDatas" loading>
            <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="downDateDomain" @on-change="changeDownDate"></DatePicker>
        </Modal>
    </div>
</template>
<script>
import Axios from "@/api/index";
import { DateShortcuts } from "@/utils/DateShortcuts.js";
export default {
    name: "financeJournal",
    data() {
        return {
            account_id: "",
            fundType: "1",
            options: DateShortcuts, //日期辅助功能
            //筛选时间
            DateDomain: [],
            downDateDomain: [],
            loading: false,
            mediaList: [],
            downmodal: false,
            fundcolumns: [
                {
                    title: "日期",
                    key: "date",
                    render: (h, params) => {
                        if (params.row.date) {
                            return h("span", params.row.date);
                        } else {
                            return h("span", "本页统计");
                        }
                    }
                },
                {
                    title: "帐户id",
                    key: "account_id"
                },
                {
                    title: "存入（元）",
                    key: "save",
                    render: (h, params) => {
                        var re = /^[0-9]+.?[0-9]*$/;
                        if (re.test(params.row.save)) {
                            //三位数加逗号
                            let newvalue = (params.row.save / 100)
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
                            return [h("span", params.row.save)];
                        }
                    }
                },
                {
                    title: "支出（元）",
                    key: "pay",
                    render: (h, params) => {
                        var re = /^[0-9]+.?[0-9]*$/;
                        if (re.test(params.row.pay)) {
                            //三位数加逗号
                            let newvalue = (params.row.pay / 100)
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
                            return [h("span", params.row.pay)];
                        }
                    }
                },
                {
                    title: "备注",
                    key: "description",
                    width: 400
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
        this.setDateDomain();
        this.getMedia();
        this.getfund();
    },
    methods: {
        //导出所有报表
        exportDatas() {
            Axios.get("api.php", {
                action: "gdtaccount",
                opt: "fund_statements_detailed_download",
                startDate: this.downDateDomain[0],
                endDate: this.downDateDomain[1]
            })
                .then(res => {
                    this.downmodal = false;
                    if (res.ret == 1) {
                        this.$refs["journaltable"].exportCsv({
                            filename: "资金流水-1现金",
                            columns: this.fundcolumns,
                            data: res.data[0]
                        });
                        this.$refs["journaltable"].exportCsv({
                            filename: "资金流水-2虚拟金额",
                            columns: this.fundcolumns,
                            data: res.data[1]
                        });
                        this.$refs["journaltable"].exportCsv({
                            filename: "资金流水-3分成帐户",
                            columns: this.fundcolumns,
                            data: res.data[2]
                        });
                        this.$refs["journaltable"].exportCsv({
                            filename: "资金流水-信用",
                            columns: this.fundcolumns,
                            data: res.data[3]
                        });
                    }
                })
                .catch(err => {
                    this.downmodal = false;
                    console.log("获取所有资金流水" + err);
                });
        },
        //导出报表
        exportData(type) {
            this.$refs["journaltable"].exportCsv({
                filename: "资金流水",
                original: false
            });
        },
        //表格高亮calss
        rowClassName(row, index) {
            if (row._disabled) {
                return "table-statistics";
            }
        },
        //设置筛选时间
        setDateDomain() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            this.DateDomain = [start, end];
            this.downDateDomain = [start, end];
        },
        //改变日期
        changeDate(e) {
            this.DateDomain = e;
            this.getfund();
        },
        //改变更下载日期
        changeDownDate(e) {
            this.downDateDomain = e;
        },
        //获取资金流水
        getfund(page) {
            if (page === undefined) {
                this.$refs["pages"].currentPage = 1;
                this.page = 1;
            } else {
                this.page = page;
            }
            this.loading = true;
            Axios.get("api.php", {
                action: "gdtaccount",
                opt: "fund_statements_detailed",
                account_id: this.account_id,
                fundType: this.fundType,
                startDate: this.DateDomain[0],
                endDate: this.DateDomain[1],
                page: this.page, //页码
                page_size: this.page_size //每页数量
            })
                .then(res => {
                    this.loading = false;
                    if (res.ret == 1) {
                        //添加统计
                        res.data.curr_page_total._disabled = true;
                        res.data.list.push(res.data.curr_page_total);
                        this.funddata = res.data.list;
                        this.total_number = res.data.total_number;
                        this.total_page = res.data.total_page;
                    }
                })
                .catch(err => {
                    this.loading = false;
                    console.log("获取资金流水" + err);
                });
        },
        //获取媒体账号
        getMedia() {
            Axios.get("api.php", {
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
