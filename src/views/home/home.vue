<style lang="less">
.card-title-small .ivu-card-head {
  padding: 9px 16px 7px;
}
.card-title-small .ivu-card-head .card-title {
  line-height: 32px;
}
</style>
<template>
    <div id="home">
        <Row class-name="home-page-row1" class="margin-top-10">
            <Card dis-hover class="card-title-small">
                <div slot="title" class="card-title">
                    <Icon type="ios-paper"></Icon>
                    所选账户在所选时段数据汇总
                    <!-- 绑定帐定 -->
                    <bind-account style=" float: right"></bind-account>
                </div>
                <div class="map-con">
                    <Row :gutter="10">

                        <Col :xs="24" :sm="12" :md="4" :style="{marginBottom: '10px'}">
                        <infor-card id-name="impression" :end-val="total.impression" iconType="ios-eye" color="#4768f3" intro-text="展示"></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                        <infor-card id-name="click" :end-val="total.click" iconType="mouse" color="#02cf80" intro-text="点击"></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                        <infor-card id-name="balance_1" :end-val="total.balance_1" iconType="social-usd" color="#9859e8" intro-text="现金账户"></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                        <infor-card id-name="balance_2" :end-val="total.balance_2" iconType="social-buffer" color="#ff6122" intro-text="总消耗"></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                        <infor-card id-name="balance_4" :end-val="total.balance_4" iconType="card" color="#15cc9e" intro-text="信用账户"></infor-card>
                        </Col>

                    </Row>

                </div>
            </Card>
        </Row>
        <!-- 按账户查看 - 按产品查看 -->
        <view-tab :tdata="tdata" @on-change="getData"></view-tab>

        <!-- 线性表格 -->
        <linear-tabel :datas="echart"></linear-tabel>
    </div>
</template>

<script>
import Axios from "@/api/index"
import util from '@/utils/index';
import inforCard from './components/inforCard.vue';
import linearTabel from './components/linearTabel.vue';
import viewTab from './components/viewTab.vue';
import selectMedia from '@/components/select-media/index.vue';
import bindAccount from './components/bindAccount.vue';
export default {
    name: 'overview',
    components: {
        inforCard,
        linearTabel,
        viewTab,
        selectMedia,
        bindAccount
    },
    data() {
        return {
            //抽出数据
            total: { impression: 0, click: 0, balance_1: 0, balance_2: 0, balance_4: 0 },
            echart: [],
            tdata: {
                page_size: 0,
                total_number: 0,
                list: []
            }
        };
    },
    methods: {
        //获取账户总览总数据            
        getData(param) {
            Axios.post('api.php', param).then(
                res => {
                    if (res.ret == '1') {
                        let data = res.data;
                        this.echart = data.echart;
                        this.total = {
                            impression: data.total.impression,
                            click: data.total.click,
                            balance_1: data.total.balance_1,
                            balance_2: data.total.cost,
                            balance_4: data.total.balance_4,
                        };

                        //添加统计
                        if (data.list.length > 1) {
                            data.curr_page_total._disabled = true;
                            data.list.push(data.curr_page_total);
                            data.list.unshift(data.curr_page_total);
                        }
                        this.tdata = {
                            page_size: data.page_size,
                            total_number: data.total_number,
                            list: data.list
                        }
                        //console.log(res.data)
                    }
                }
            ).catch(
                err => { console.log('账户总览' + err) }
            );
        },
        //获取媒体类型
        mediaChange(data) {
            this.MeidaType = data;
        }
    },
    mounted() {
        this.getData();
    }
};
</script>