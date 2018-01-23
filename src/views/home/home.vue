<style lang="less">
    @import "../../styles/common.less";
    @import '../../styles/table.less';
    .ivu-card-body{padding: 10px;}
    .ivu-card-head-inner, .ivu-card-head p{height: auto}    
</style>
<style scoped>
    
</style>
<template>
    <div id="home">

        <Row class-name="home-page-row1" class="margin-top-10">
            <Card dis-hover shadow>
                <p slot="title" class="card-title">
                    <Icon type="ios-paper"></Icon>
                    所选账户在所选时段数据汇总
                    <ButtonGroup size="small" :style="{ float: 'right'}">
                        <Button type="primary" @click="addBindId = true">新增绑定账户</Button>
                        <Button type="primary">下载报表</Button>
                    </ButtonGroup>
                </p>
                <div class="map-con">
                    <Row :gutter="10">

                        <Col :xs="24" :sm="12" :md="4" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="total.impression"
                                iconType="ios-eye"
                                color="#2d8cf0"
                                intro-text="展示"
                            ></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="total.click"
                                iconType="mouse"
                                color="#64d572"
                                intro-text="点击"
                            ></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="total.balance_1"
                                iconType="social-yen"
                                color="#f90"
                                intro-text="现金账户"
                            ></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="total.balance_2"
                                iconType="social-buffer-outline"
                                color="#f25e43"
                                intro-text="虚拟账户"
                            ></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="user_created_count"
                                :end-val="total.balance_4"
                                iconType="card"
                                color="#19be6b"
                                intro-text="信用账户"
                            ></infor-card>
                        </Col>
                        
                    </Row>

                </div>
            </Card>
        </Row>

        <!-- 按账户查看 - 按产品查看 -->
        <view-tab :table-data="table.list" :total="table.total" :page ="table.page" :page-size="table.page_size"></view-tab>      

        <!-- 线性表格 -->
        <linear-tabel :data-echart="echart" ></linear-tabel>


        <Modal
            v-model="addBindId"
            title="新增绑定账号"
            @on-ok="addBindOk"
            :mask-closable="false"
            :closable="false"
            :loading="loading"
            >
            <div class="padding-10">
                <Form :model="formItem" label-position="right" :label-width="80" >                    
                    <Row :gutter="10">
                        <Col span="12">
                            <FormItem label="账号平台">
                                <Select v-model="formItem.select">
                                    <Option value="baidu">baidu</Option>
                                    <Option value="google">google</Option>
                                    <Option value="sogou">sogou</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="推广方式">
                                <Select v-model="formItem.select">
                                    <Option value="1">竞价推广</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>                    
                    <FormItem label="账号名字">
                        <Input v-model="formItem.input1"></Input>
                    </FormItem>
                    <FormItem label="账户密码">
                        <Input v-model="formItem.input2"></Input>
                    </FormItem>
                    <FormItem label="账号口令">
                        <Input v-model="formItem.input3"></Input>
                    </FormItem>
                </Form>
            </div>           
        </Modal>

    </div>    
</template>


<script>
import inforCard from './components/inforCard.vue';
import linearTabel from './components/linearTabel.vue';
import viewTab from './components/viewTab.vue';


// import {table2csvData, csvColumns} from './data/table2csv.js';
// import {table2excelData, excelColumns} from './data/table2excel.js';
// import table2excel from '@/utils/table2excel.js';


export default {
    name: 'overview',
    components :{
        inforCard,
        linearTabel,
        viewTab
    },
    data () {
        return {
            addBindId :false,
            loading: true,
            formItem: {                
                input1: '',
                input2: '',
                input3: '',
                select : ''
            }
        };
    },
    computed :{
        total () {
            return this.$store.state.home.total;
        },
        echart(){
            return this.$store.state.home.echart;
        },
        table(){
            return this.$store.state.home.table;
        }
    },
    methods: {
        getData(){
            //获取home总数据      
            this.$store.dispatch('getMenuList');
        },
        addBindOk(){            
            setTimeout(() => {
                this.addBindId = false;
            }, 2000);
        }
    },
    mounted(){
        this.getData()
    }
};
</script>