<style scoped>
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
    <div shadow class="margin-top-10">
        <span>时间范围</span>
        <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
        <span class="margin-left-10">汇总方式</span>
        <Select v-model="type" class="sel" placeholder="汇总方式" @on-change="getHourReporting()">
            <Option value="">合计</Option>
            <Option value="Day">分日</Option>
            <Option value="Hour">分时</Option>
        </Select>
        <span class="margin-left-10">投放目的</span>
        <Select placeholder="投放目的" v-model="landing_type" class="sel_state" @on-change="getHourReporting()">
            <Option value="">不限</Option>
            <Option value="LINK">推广落地页</Option>
            <Option value="APP">推广应用下载</Option>
            <Option value="DPA">产品目录</Option>
        </Select>
        <!-- <span class="margin-left-10">选择广告组</span>
        <Select v-model="campaign_ids" style="width:300px;" filterable multiple @on-change="getHourReporting()">
            <Option v-for="item in campaign_list" :value="item.campaign_id" :key="this">{{ item.campaign_name }}</Option>
        </Select> -->

        <campaign-id @on-change="get_campaign_id"></campaign-id>

        <report-echarts :datas="echart" title="数据趋势" class="margin-top-10"></report-echarts>

        <Row class="margin-top-20">
            <Col style="text-align: right;">
            <Button type="ghost" icon="document-text" @click="exportData()">下载当前数据</Button>
            </Col>
        </Row>
        <Table :data="list" :loading="loading" :columns="tableColumns" :size="tableSize" class="margin-top-10" ref="campaingtable" @on-sort-change="sortchange" stripe :row-class-name="rowClassName"></Table>
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
    </div>
</template>
<script>
import Axios from "@/api/index";
import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
import campaignId from "../components/campaignId.vue";
import reportEcharts from "../components/reportEcharts.vue";
export default {
    name: "bidcampaign",
    components: {
        campaignId,
        reportEcharts
    },
    data() {
        return {
            campaign_ids: [],
            campaign_list: [],
            options: DateShortcuts,
            //筛选时间
            DateDomain: [formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"), formatDate(new Date(), "yyyy-MM-dd")],
            loading: false,
            type: "",//汇总方式,
            landing_type: "",
            orderField: "", //排序参数名
            orderDirection: "SORT_DESC", //排序方向
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
            list: [],
            echart: [],
            tableColumns: [
                {                    title: "日期", sortable: "custom", key: "date",
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
        this.getCampaigns();
    },
    methods: {
        //获取广告组
        getCampaigns() {
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "getCampaigns"
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.campaign_list = res.data;
                    }
                }
                ).catch(err => { console.log(err) });
        },
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
                opt: "effectCampaignReporting",
                account_id: this.get_account_id,
                landing_type: this.landing_type,
                campaign_ids: this.campaign_ids.length == 0 ? "" : this.campaign_ids,
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
                        // console.log(res.data);
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
        //回调campaign_ids
        get_campaign_id(ids) {
            this.campaign_ids = ids;
            this.getHourReporting();
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
            this.$refs["campaingtable"].exportCsv({
                filename: "广告组",
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