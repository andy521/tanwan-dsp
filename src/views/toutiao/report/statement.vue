<style scoped></style>
.sel {
  width: 220px;
}
.inp {
  display: inline-block;
  width: 150px;
}
.ad .ivu-poptip {
  display: inline-block;
}
.sel_state {
  text-align: left;
  width: 110px;
}
.select_account {
  float: right;
}
</style>
<template>
    <div>
        <!-- 获取帐号 -->
        <account-id></account-id>
        <Card dis-hover class="margin-top-10" v-if="get_account_id">
            <span>时间范围</span>
            <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
            <span class="margin-left-10">汇总方式</span>
            <RadioGroup v-model="type" @on-change="getHourReporting()">
                <Radio label="Day">分日</Radio>
                <Radio label="Hour">分时</Radio>
            </RadioGroup>

            <report-echarts :datas="echart" title="数据趋势" class="margin-top-10"></report-echarts>

            <Row class="margin-top-20">
                <Col style="text-align: right;">
                <Button type="ghost" icon="document-text" @click="exportData()">下载当前数据</Button>
                </Col>
            </Row>
            <Table :data="list" :loading="loading" :columns="tableColumns" :size="tableSize" class="margin-top-10" ref="statementtable" @on-sort-change="sortchange" stripe :row-class-name="rowClassName"></Table>
            <Row class="margin-top-10">
                <Col span="10"> 表格尺寸
                <Radio-group v-model="tableSize" type="button">
                    <Radio label="large">大</Radio>
                    <Radio label="default">中</Radio>
                    <Radio label="small">小</Radio>
                </Radio-group>
                每页显示
                <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getHourReporting()">
                    <Option v-for="item in 500" :value="item" :key="item" v-if="item%50==0">{{ item }}</Option>
                </Select>
                </Col>
                <Col span="14" style="text-align: right;">
                <Page :total="total_number" :current="page" :page-size="page_size" ref="pages" @on-change="getHourReporting" show-elevator show-total></Page>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import Axios from "@/api/index";
import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
import accountId from "../components/accountId.vue";
import reportEcharts from "../components/reportEcharts.vue";
export default {
    components: {
        accountId,
        reportEcharts
    },
    data() {
        return {
            options: DateShortcuts,
            //筛选时间
            DateDomain: [formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"), formatDate(new Date(), "yyyy-MM-dd")],
            loading: false,
            type: "Day",//汇总方式,
            orderField: "", //排序参数名
            orderDirection: "SORT_DESC", //排序方向
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
            list: [],
            echart: [],
            tableColumns: [
                {
                    title: "日期",
                    sortable: "custom",
                    key: "date",
                    render: (h, params) => {
                        if (params.row._disabled) {
                            return h("span", "本页统计");
                        } else {
                            return h("span", params.row.date);
                        }
                    }
                },
                { title: "展现量", sortable: "custom", key: "impression" },
                { title: "消费", sortable: "custom", key: "cost" },
                { title: "点击", sortable: "custom", key: "click" },
                { title: "点击率", sortable: "custom", key: "ctr" },
                { title: "平均点击价格", sortable: "custom", key: "cpc" },
                { title: "千次展现价格", sortable: "custom", key: "cpm" },
            ],
            tableSize: "small",
        }
    },
    mounted() {
        this.getHourReporting();
    },
    methods: {
        //获取列表
        getHourReporting(page) {
            if (page === undefined) {
                this.page = 1;
            } else {
                this.page = page;
            }
            if (this.get_account_id == "") return;
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "accountReporting",
                account_id: this.get_account_id,
                startDate: this.DateDomain[0], //开始时间
                endDate: this.DateDomain[1], //结速时间
                orderField: this.orderField,
                orderDirection: this.orderDirection, //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                type: this.type,
                page: this.page, //页码
                page_size: this.page_size, //每页数量

            }).then(
                res => {
                    if (res.ret == 1) {
                        // console.log(res);
                        //添加统计
                        res.data.curr_page_total._disabled = true;
                        res.data.list.unshift(res.data.curr_page_total);
                        this.list = res.data.list;
                        this.echart = res.data.echart;
                        this.total_number = res.data.total_number;
                        this.total_page = res.data.total_page;
                    }
                }
                ).catch(err => { console.log(err) });
        },
        //改变日期
        changeDate(e) {
            this.DateDomain = e;
            this.getHourReporting();
        },
        //排序
        sortchange(column) {
            this.orderField = column.key;
            this.orderDirection = column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
            this.getHourReporting();
        },
        //导出报表
        exportData(type) {
            this.$refs["statementtable"].exportCsv({
                filename: "帐户报表",
                original: false
            });
        },
        //表格高亮calss
        rowClassName(row, index) {
            if (row._disabled) {
                return "table-statistics";
            }
        }
    },
    watch: {
        get_account_id() {
            this.getHourReporting();
        }
    },
    computed: {
        get_account_id() {
            return this.$store.state.user.report_account_id;
        }
    },
};
</script>