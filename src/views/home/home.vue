<style lang="less">
    @import "../../styles/common.less";
    @import '../../styles/table.less';
    .ivu-card-body{padding: 10px;}
    .ivu-card-head-inner, .ivu-card-head p{height: auto}
    .line-chart-con{height: 300px;}
</style>
<style scoped>
    
</style>
<template>
    <div id="home">

        <Row class-name="home-page-row1" class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-paper"></Icon>
                    所选账户在所选时段数据汇总

                    <ButtonGroup size="small" :style="{ float: 'right'}">
                        <Button type="primary">新增绑定账户</Button>
                        <Button type="primary">查看账户报告</Button>
                    </ButtonGroup>
                </p>
                <div class="map-con">
                    <Row :gutter="5">

                        <Col :xs="12" :sm="6" :md="4" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="2"
                                iconType="ios-eye"
                                color="#2d8cf0"
                                intro-text="展示"
                            ></infor-card>
                        </Col>

                        <Col :xs="12" :sm="6" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="2"
                                iconType="mouse"
                                color="#64d572"
                                intro-text="点击"
                            ></infor-card>
                        </Col>

                        <Col :xs="12" :sm="6" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="1500"
                                iconType="volume-high"
                                color="#f90"
                                intro-text="推广奖金余额"
                            ></infor-card>
                        </Col>

                        <Col :xs="12" :sm="6" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="1500"
                                iconType="ios-pie"
                                color="#f25e43"
                                intro-text="广告奖金池余额"
                            ></infor-card>
                        </Col>

                        <Col :xs="12" :sm="6" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="1500"
                                iconType="social-yen"
                                color="#19be6b"
                                intro-text="原生奖金池余额"
                            ></infor-card>
                        </Col>
                        
                    </Row>

                </div>
            </Card>
        </Row>

        <Row class-name="home-page-row1" class="margin-top-10">
            <Card>              
                <p slot="title" class="card-title">                   
                    <Select v-model="chakang" style="width:200px">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </p>
                
                <Table :columns="excelColumns" height="390px" :data="table2excelData" size="small" ref="tableExcel"></Table>
                

                <!-- <div class="map-con">                    
                    <Table :columns="columnsCsv" :data="csvData" size="small" ref="tableCsv"></Table>
                </div> -->

            </Card>
        </Row>


        <Row class-name="home-page-row1" class="margin-top-10">
            <Card :padding="0">              
                <p slot="title" class="card-title">                   
                    <Select v-model="baoguan" style="width:200px">
                        <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="diangji" style="width:200px;float:right;">
                        <Option v-for="item in cityList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </p>
                <div class="line-chart-con">
                    <service-requests></service-requests>
                </div>
            </Card>
        </Row>

    </div>
</template>


<script>
import inforCard from './components/inforCard.vue';
import serviceRequests from './components/serviceRequests.vue';

import {table2csvData, csvColumns} from './data/table2csv.js';
import {table2excelData, excelColumns} from './data/table2excel.js';
import table2excel from '@/utils/table2excel.js';


export default {
    name: 'exportable-table',
    components :{
        inforCard,
        serviceRequests
    },
    data () {
        return {
            columnsCsv: csvColumns,
            csvData: table2csvData,
            table2excelData: table2excelData,
            excelColumns: excelColumns,
            rowNum: table2csvData.length,
            colNum: csvColumns.length,
            selectMinRow: 1,
            selectMaxRow: table2csvData.length,
            selectMinCol: 1,
            selectMaxCol: csvColumns.length,
            maxRow: 0,
            minRow: 1,
            maxCol: 0,
            minCol: 1,
            csvFileName: '',
            excelFileName: '',
            tableExcel: {},
            fontSize: 16,
            
            chakang :'按账户查看',
            baoguan :'暴光量',
            diangji :'点击量',
            cityList : [{value: '按产品查看',label: '按产品查看'}],
            cityList1 : [{value: '暴光量',label: '暴光量'}],
            cityList2 : [{value: '点击量',label: '点击量'}]
        };
    },
    methods: {
        exportData (type) {
            if (type === 1) {
                this.$refs.tableCsv.exportCsv({
                    filename: '原始数据'
                });
            } else if (type === 2) {
                this.$refs.tableCsv.exportCsv({
                    filename: '排序和过滤后的数据',
                    original: false
                });
            } else if (type === 3) {
                this.$refs.tableCsv.exportCsv({
                    filename: this.csvFileName,
                    columns: this.columnsCsv.filter((col, index) => index >= this.selectMinCol - 1 && index <= this.selectMaxCol - 1),
                    data: this.csvData.filter((data, index) => index >= this.selectMinRow - 1 && index <= this.selectMaxRow - 1)
                });
            }
        },
        exportExcel () {
            table2excel.transform(this.$refs.tableExcel, 'hrefToExportTable', this.excelFileName);
        }
    }
};
</script>