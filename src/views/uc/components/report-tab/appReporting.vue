<template>
	<div class="resources">
        <Form :label-width="80" inline>
            <Form-item label="时间范围：">
                <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
            </Form-item>
            <Form-item label="操作系统：">
                <Select v-model="platform" style="width:200px">
                    <Option value="">全部操作系统传空值</Option>
                    <Option value="ios">ios</Option>
                    <Option value="android">android</Option>
                    <Option value="其他">其他</Option>
                </Select>
            </Form-item>
            <!-- <Form-item label="数据维度：">
                <Radio-group v-model="type">
                    <Radio label="1">按APPID</Radio>
                    <Radio label="2">按搜索关键词</Radio>
                </Radio-group>
            </Form-item> -->
            <Form-item label="时间单位：">
                <Radio-group v-model="type">
                    <Radio label="1">分日</Radio>
                    <Radio label="2">分月</Radio>
                    <Radio label="3">汇总</Radio>
                </Radio-group>
            </Form-item>
            <Button type="primary" @click="getReporting()">查询</Button>
        </Form>    
        <line-chart :datas="echart" title="APP报告"></line-chart>

        <Table :data="list" :loading="loading" :columns="tableColumns" :size="tableSize" class="margin-top-10" ref="Vtable"  @on-sort-change="sortchange" stripe></Table>
        <Row class="margin-top-10">
            <Col span="10"> 表格尺寸
            <Radio-group v-model="tableSize" type="button">
                <Radio label="large">大</Radio>
                <Radio label="default">中</Radio>
                <Radio label="small">小</Radio>
            </Radio-group>
            每页显示
            <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getReporting()">
                <Option v-for="item in 500" :value="item" :key="item" v-if="item%50==0">{{ item }}</Option>
            </Select>
            </Col>
            <Col span="14" style="text-align: right;">
                <Page :total="total_number" :current="page" :page-size="page_size" ref="pages" @on-change="getReporting" show-elevator show-total></Page>
            </Col>
        </Row>
	</div>
</template>

<script>
    import Axios from "@/api/index";
    import echarts from 'echarts';
    import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
    import lineChart from "../lineChart.vue";
	export default {
        name: 'appReporting',
        components: {
            lineChart
        },  
        props:{
            account:{
                type:String,
                default:''
            }
        },       
		data() {
			return {
                loading:false,
                options: null,
                //筛选时间
                DateDomain: [formatDate(new Date(new Date().getTime()-1000*60*60*24*7), "yyyy-MM-dd"),formatDate(new Date(), "yyyy-MM-dd")],   
                //操作系统
                platform:'',
                //时间单位
                type:'1',
                //账户
                accountIds:'',
                //排序
                orderField:'',
                orderDirection: '',
                page: 1, //第N页
                page_size: 50, //每页数量
                total_number: 1, //总数量
                total_page: 1, //总页数
                list:[],
                tableColumns:[
                    {title: "日期",key: "date",width: 200},
                    {title: "用户名",key: "account_name",width: 300},
                    {title: "操作系统",key: "platform"},
                    {title: "APPID",key: "app_id"},
                    {title: "APP名称",key: "app_name",width: 300},                    
                    {title: "点击",sortable: "cost",key: "click"},
                    {title: "消费",sortable: "cost",key: "cost"},
                    {title: "点击",sortable: "cost",key: "click"},
                    {title: "点击率",sortable: "cost",key: "ctr"},
                    {title: "平均点击价格",sortable: "cost",key: "cpc",width: 130},
                    {title: "千次展现价格",sortable: "cost",key: "cpm",width: 130},
                ],
                tableSize: "small",
                echart:[]
			};
        },
        watch:{
            account(data){
                this.accountIds = data;
                this.getReporting();
            }
        },
		methods: {	
            //改变日期
            changeDate(e) {
                this.DateDomain = e;
            },	
			getReporting(page){
                if (page === undefined) {
                    this.page = 1;
                } else {
                    this.page = page;
                }
                this.loading = true;
                let param = {
                    action:'ucAdPut',
                    opt:'getAppReporting',
                    accountIds:this.accountIds,
                    platform:this.platform,
                    startDate: this.DateDomain[0], //开始时间
                    endDate: this.DateDomain[1], //结速时间                    
                    type:this.type,
                    page: this.page, //页码
                    page_size: this.page_size, //每页数量
                    orderField:this.orderField,
                    orderDirection: this.orderDirection //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                };
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            console.log(res);  
                            this.loading = false;                      
                            this.echart = res.data.echart; 
                            this.list = res.data.list;
                            this.page = parseInt(res.data.page);
                            this.page_size = parseInt(res.data.page_size);
                            this.total_number = res.data.total_number;
                            this.total_page = res.data.total_page;
						}
					}
                ).catch(err => {console.log(err)});
            },
            //排序
            sortchange(column) {
                this.orderField = column.key;
                this.orderDirection =  column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
                this.getReporting();
            },       
        },
        beforeMount(){
            let setDate = DateShortcuts;
            setDate.disabledDate = (date) =>{return date && date.valueOf() > Date.now() - 86400000}
            this.options = setDate;   
            this.accountIds = this.account;          
            this.getReporting(); 
        }
	};
</script>