<style lang="less">
    @import "../../styles/common.less";
    @import '../../styles/table.less';
    .ivu-card-body{padding: 10px;}
    .ivu-card-head-inner, .ivu-card-head p{height: 25px;}
</style>
<style scoped>
    
</style>
<template>
    <div id="home">

        <Card shadow>
            <template>
                <Button size="large" type="primary">Primary</Button>
            </template>
        </Card>

        <Row class-name="home-page-row1" class="margin-top-10">
            <Card :padding="0">
                <p slot="title" class="card-title">
                    <Icon type="map"></Icon>
                    fdsfds
                </p>
                <div class="map-con">
                    fdsfdsfds
                </div>
            </Card>
        </Row>

        <Row class-name="home-page-row1" class="margin-top-10">
            <Card :padding="0">              
                <p slot="title" class="card-title">                   
    
                    <ButtonGroup size="small" shape="circle">
                        <Button type="ghost">删除</Button>
                        <Button type="ghost">修改状态</Button>
                        <Button type="ghost">修改日期</Button>
                        <Button type="ghost">修改时间</Button>
                    </ButtonGroup>
                </p>
                <Row style="padding:10px;">
                    <Table :columns="excelColumns" height="390px" :data="table2excelData" size="small" ref="tableExcel"></Table>
                </Row>

                <!-- <div class="map-con">                    
                    <Table :columns="columnsCsv" :data="csvData" size="small" ref="tableCsv"></Table>
                </div> -->

            </Card>
        </Row>

 


    </div>
</template>


<script>
import {table2csvData, csvColumns} from './data/table2csv.js';
import {table2excelData, excelColumns} from './data/table2excel.js';
import table2excel from '@/utils/table2excel.js';
export default {
    name: 'exportable-table',
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
            fontSize: 16
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