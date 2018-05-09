<template>
    <div>
        <span>时间范围</span>
        <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
        <span>汇总方式</span>
        <Select v-model="type" class="sel_state" placeholder="汇总方式" @on-change="getHourReporting()">
            <Option value="province">省级地域</Option>
            <Option value="city">地级市</Option>
            <Option value="gender">性别</Option>
            <Option value="tag">兴趣分类</Option>
            <Option value="age">年龄</Option>
        </Select>
        <line-chart :datas="echart" title="数据趋势" class="margin-top-20"></line-chart>

        <Table :data="list" :loading="loading" :columns="tableColumns" :size="tableSize" class="margin-top-10" ref="Vtable" @on-sort-change="sortchange" stripe></Table>
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
import echarts from "echarts";
import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
import lineChart from "./lineChart.vue";
export default {
    name: 'advertiser',
    props: ["account"],
    components: {
        lineChart
    },
    data() {
        return {
            adgroupIds: [],
            options: DateShortcuts,
            //筛选时间
            DateDomain: [formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"), formatDate(new Date(), "yyyy-MM-dd")],
            loading: false,
            type: "province",//汇总方式,
            orderField: "", //排序参数名
            orderDirection: "SORT_DESC", //排序方向
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
            list: [],
            echart: [],
            tableColumns: [
                { title: "日期", key: "date", },
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
    watch: {
        account() {
            this.getHourReporting();
        }
    },
    methods: {
        //获取列表
        getHourReporting(page) {
            if (page === undefined) {
                this.page = 1;
            } else {
                this.page = page;
            }
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "audienceAccountReporting",
                account_id: this.account,
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
                        console.log(res);
                        this.list = res.data.list;
                        // this.echart = res.data.echart;
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
    }
};
</script>