<style scoped>
.padding-tb-20 {
  padding-top: 20px;
  padding-bottom: 20px;
}
.account-table .ivu-table td,
.account-table .ivu-table th {
  text-align: center;
}

.g-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart-content {
  margin-top: 20px;
}
.tip-txt {
  color: #777;
  font-size: 12px;
  font-weight: normal;
}
</style>
<template>
    <div class="ad">
        <Card dis-hover class="tip-txt">
            <p slot="title" class="card-title">
                <Icon type="ios-paper"></Icon>
                账户数据汇总
                <span class="tip-txt"> 数据说明：1. 账户余额实时更新，数据仅供参考。账户消耗每10分钟更新一次。2. “今日账户消耗”和“账户消耗”，仅包含竞价广告和品牌广告数据，不包含开屏联播数据。</span>
            </p>

            <Row :gutter="10">

                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <info-card eleId="cost" :count-num="count.cost" :count-use-num="count.costUse" iconType="social-buffer" color="#4768f3" desc-text="今日账号消耗"></info-card>
                </Col>

                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <info-card eleId="total" :count-num="count.total" :count-use-num="count.totalUse" iconType="social-yen" color="#02cf80" desc-text="账户总余额"></info-card>
                </Col>

                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <info-card eleId="crash" :count-num="count.crash" :count-use-num="count.crashUse" iconType="calculator" color="#9859e8" desc-text="现金余额"></info-card>
                </Col>

                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <info-card eleId="donate" :count-num="count.donate" :count-use-num="count.donateUse" iconType="android-people" color="#ff6122" desc-text="赠款"></info-card>
                </Col>

            </Row>

        </Card>

        <Card dis-hover class="tip-txt margin-top-10">
            <p slot="title" class="card-title">
                <Icon type="ios-paper"></Icon>
                广告统计
                <span class="tip-txt"> 不包含已删除及旧平台的广告计划</span>
            </p>

            <Row :gutter="10">

                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <info-card @click.native="handleStatistics('check')" eleId="cost" :count-num="statistics.check" iconType="eye-disabled" color="#968f8f" desc-text="待审核"></info-card>
                </Col>

                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <info-card @click.native="handleStatistics('fail')" eleId="total" :count-num="statistics.fail" iconType="close" color="#c7c6c6" desc-text="未通过"></info-card>
                </Col>

                <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                <info-card @click.native="handleStatistics('budget')" eleId="crash" :count-num="statistics.budget" iconType="alert" color="#d0b2b2" desc-text="预算不足"></info-card>
                </Col>

            </Row>
        </Card>

        <Card dis-hover class="tip-txt margin-top-10">
            <div slot="title" class="card-title .ivu-card-head-inner, .ivu-card-head g-flex">
                <p>
                    <Icon type="ios-paper"></Icon>
                    账户消耗
                </p>
                <div class="rt">
                    <Select v-model="period" style="width:100px">
                        <Option :value="7">过去7天</Option>
                        <Option :value="30">过去30天</Option>
                        <Option :value="1">昨天</Option>
                        <Option :value="0">今天</Option>
                    </Select>
                </div>
            </div>

            <div class="account-table">
                <Table border :columns="costColumns" :data="costData"></Table>
            </div>
            <div class="chart-content">
                <linear-chart :datas="chartData"></linear-chart>
            </div>
        </Card>

    </div>
</template>
<script>
import echartDataList from './temp/echartDataList.json'
import Axios from '@/api/index'
import { DateShortcuts, formatDate } from '@/utils/DateShortcuts.js'
import infoCard from './components/infoCard'
import linearChart from './components/linearChart'
export default {
    components: {
        infoCard,
        linearChart
    },
    data() {
        return {
            height: document.body.clientHeight - 200,
            // 账号数据
            count: {
                cost: 1000000, // 今日账号消耗
                costUse: 0, // 今日账号消耗 可用
                total: 1000000, // 账户总余额
                totalUse: 0, // 账户总余额 可用
                crash: 1000000, // 账户总余额
                crashUse: 0, // 账户总余额 可用
                donate: 100000, // 赠款
                donateUse: 0, // 赠款可用
            },
            // 广告统计 数据
            statistics: {
                check: 0, // 未审核
                fail: 2, // 未通过
                budget: 100 // 预算不足
            },
            // 账号消耗 表头
            costColumns: [
                {
                    title: '总花费(元)',
                    key: 'total'
                },
                {
                    title: '展示数',
                    key: 'impression'
                },
                {
                    title: '点击数',
                    key: 'click'
                },
                {
                    title: '点击率',
                    key: 'ctr'
                },
                {
                    title: '平均点击单价(元)',
                    key: 'cpc'
                },
                {
                    title: '平均千次展现费用(元)',
                    key: 'cpm'
                },
            ],
            // 账号消耗 表单数据
            costData: [{
                total: 0,
                impression: 0,
                click: 0,
                ctr: '0.01%',
                cpc: '0.00',
                cpm: '0.00'
            }],
            // 账号消耗数据 时差。 状态：0=>今天，1=>昨天，7=>7天前，30=>30天前
            period: 7,
            chartData: []
        }
    },
    mounted() {
        this.getTopData()
    },
    methods: {
        // 广告统计 跳转路由
        handleStatistics(key) {
        },
        getTopData() {
            this.chartData = echartDataList.data.echart
        }
    }
}
</script>