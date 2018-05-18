<style scoped>
.sel {
  width: 220px;
}
.inp {
  display: inline-block;
  width: 150px;
}
.cascader {
  display: inline-block;
  width: 400px;
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
        <span>选择计划</span>
        <Cascader :data="campaign_list" :load-data="getAdgroups" class="cascader" @on-change="changeCascader"></Cascader>
        <div v-show="adgroup_id!=''" class="margin-top-10">
            <span>时间范围</span>
            <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
            <RadioGroup v-model="type_echart" @on-change="getaudienceReportingChart()">
                <Radio label="impression">展现</Radio>
                <Radio label="click">点击</Radio>
                <Radio label="ctr">点击率</Radio>
                <Radio label="conversion">转化数</Radio>
                <Radio label="cvr">转化率</Radio>
            </RadioGroup>
            <Row class="margin-top-10">
                <Col span="12">
                <china-echarts :datas="echart.province" title="省级地分布"></china-echarts>
                </Col>
                <Col span="6">
                <pie-echarts :datas="echart.gender" title="性别分布" class="margin-left-10"></pie-echarts>
                </Col>
                <Col span="6">
                <pie-echarts :datas="echart.age" title="年龄分布" class="margin-left-10"></pie-echarts>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Col span="12">
                <bar-echarts :datas="echart.city" title="地级市分布"></bar-echarts>
                </Col>
                </Col>
                <Col span="12">
                <bar-echarts :datas="echart.tag" title="兴趣分布" class="margin-left-10"></bar-echarts>
                </Col>
            </Row>
            <Row class="margin-top-20">
                <Col span="18">
                <span>汇总方式</span>
                <RadioGroup v-model="type" @on-change="getHourReporting()">
                    <Radio label="province">省级地域</Radio>
                    <Radio label="city">地级市</Radio>
                    <Radio label="gender">性别</Radio>
                    <Radio label="tag">兴趣分类</Radio>
                    <Radio label="age">年龄</Radio>
                </RadioGroup>
                </Col>
                <Col span="6" style="text-align: right;">
                <Button type="ghost" icon="document-text" @click="exportData()">下载当前数据</Button>
                </Col>
            </Row>
            <Table :data="list" :loading="loading" :columns="tableColumns" :size="tableSize" class="margin-top-10" ref="campaingtable" @on-sort-change="sortchange" stripe></Table>
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
    </div>
</template>
<script>
import Axios from "@/api/index";
import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
import pieEcharts from "../components/pieEcharts.vue";
import chinaEcharts from "../components/chinaEcharts.vue";
import barEcharts from "../components/barEcharts.vue";
export default {
    name: "audienceAccount",
    components: {
        pieEcharts,
        chinaEcharts,
        barEcharts
    },
    data() {
        return {
            campaign_id: "",
            campaign_list: [],
            adgroup_id: "",
            options: DateShortcuts,
            //筛选时间
            DateDomain: [formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"), formatDate(new Date(), "yyyy-MM-dd")],
            loading: false,
            type_echart: "impression",//汇总方式图表
            type: "province",//汇总方式,
            orderField: "", //排序参数名
            orderDirection: "SORT_DESC", //排序方向
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
            list: [],
            echart: {
                age: "",
                city: "",
                gender: "",
                province: "",
                tag: ""
            },
            tableSize: "small",
        }
    },
    mounted() {
        this.getCampaigns();
    },
    methods: {
        //获取广告组
        getCampaigns() {
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "getCampaigns",
                account_id: this.get_account_id
            }).then(
                res => {
                    if (res.ret == 1) {
                        let campaign_list = [];
                        res.data.forEach(v => {
                            campaign_list.push({
                                value: v.campaign_id,
                                label: v.campaign_name,
                                children: [],
                                loading: false
                            })
                        });
                        this.campaign_list = campaign_list;
                    }
                }
            ).catch(err => { console.log(err) });
        },
        //获取计划
        getAdgroups(item, callback) {
            item.loading = true;
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "getAdgroups",
                campaign_id: item.value
            }).then(
                res => {
                    if (res.ret == 1) {
                        res.data.forEach(v => {
                            item.children.push({
                                value: v.adgroup_id,
                                label: v.adgroup_name
                            })
                        });
                        item.loading = false;
                        callback();
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
            if (this.get_account_id == "" || this.adgroup_id == "") return;
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "audienceAdgroupReporting",
                adgroup_id: this.adgroup_id,
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
                        this.list = res.data.list;
                        this.total_number = res.data.total_number;
                        this.total_page = res.data.total_page;
                    }
                }
            ).catch(err => { console.log(err) });
        },
        //获取图表列表
        getaudienceReportingChart() {
            if (this.get_account_id == "" || this.adgroup_id == "") return;
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "audienceAdgroupReportingChart",
                adgroup_id: this.adgroup_id,
                account_id: this.get_account_id,
                // account_id:93377688534,
                // campaign_id: 1599344793322526,
                startDate: this.DateDomain[0], //开始时间
                endDate: this.DateDomain[1], //结速时间
                type: this.type_echart,
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.echart = res.data;
                    }
                }
            ).catch(err => { console.log(err) });
        },
        //修改级联返回
        changeCascader(labels, selectedData) {
            const index = labels.length - 1;
            const data = selectedData[index] || false;
            if (data && data.value) {
                this.adgroup_id = data.value;
                this.getHourReporting();
                this.getaudienceReportingChart();
            }
        },
        //改变日期
        changeDate(e) {
            this.DateDomain = e;
            this.getHourReporting();
            this.getaudienceReportingChart();
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
                filename: "广告计划",
                original: false
            });
        }
    },
    watch: {
        get_account_id() {
            this.getCampaigns();
        }
    },
    computed: {
        get_account_id() {
            return this.$store.state.user.report_account_id;
        },
        tableColumns() {
            let Columns = [
                { title: "展现量", sortable: "custom", key: "impression" },
                { title: "消费(元)", sortable: "custom", key: "cost" },
                { title: "点击", sortable: "custom", key: "click" },
                { title: "点击率", sortable: "custom", key: "ctr" },
                { title: "平均点击价格(元)", sortable: "custom", key: "cpc" },
                { title: "千次展现价格(元)", sortable: "custom", key: "cpm" },
            ]
            let Columns2 = {
                province: { title: "省级地域", sortable: "custom", key: "province" },
                city: { title: "地级市", sortable: "custom", key: "city" },
                gender: { title: "性别", sortable: "custom", key: "gender" },
                tag: { title: "兴趣分类", sortable: "custom", key: "tag" },
                age: { title: "年龄", sortable: "custom", key: "age" }
            }
            Columns.unshift(Columns2[this.type]);
            return Columns;
        }
    },
};
</script>