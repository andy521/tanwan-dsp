<style scoped>
.resources .ivu-form-item{margin-bottom: 0;}
</style>
<template>
	<div class="resources">
        <Form :label-width="100" >
            <Form-item label="时间范围：">
                <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
            </Form-item>
            <!-- <Checkbox v-model="compare">比较</Checkbox> -->
            <Form-item label="报告类型：">
                <Radio-group v-model="retype" @on-change="retypeChange">
                    <Radio label="1">账户报告</Radio>
                    <Radio label="2">计划报告</Radio>
                    <Radio label="3">单元报告 </Radio>
                    <Radio label="4">创意报告</Radio>
                </Radio-group>
            </Form-item>

            <Form-item label="选择计划：">
                <!-- <get-account :visible="accountShow" @on-change="accountChange" style="display:inline-block"></get-account> -->
                <get-campaign v-show="retype == '2' || retype == '3' || retype == '4'" style="display:inline-block;margin-left:5px;" @on-change="campaignChange"></get-campaign>
                <div v-show="retype == '3' || retype == '4'" style="display:inline-block;margin-left:5px;">
                    <adgroup-list :adgroup="adgroupList" @on-change="adgroupChange"></adgroup-list>
                </div>
                <idea-list v-show="retype == '4'" :creative="creativeList" @on-change="creativeChange" style="display:inline-block;margin-left:5px;"></idea-list>
            </Form-item>

            <Form-item label="时间单位：">
                <Radio-group v-model="type">
                    <Radio label="0">分小时</Radio>
                    <Radio label="1">分日</Radio>
                    <Radio label="2">分月</Radio>
                    <Radio label="3">汇总</Radio>
                </Radio-group>
            </Form-item>

            <Form-item >
                <Button type="primary" @click="getReporting()">查询</Button>
            </Form-item>
        </Form>  

        <line-chart :datas="echart" :title="title" zoom="true" style="margin-top:15px;"></line-chart>

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
                <Option v-for="item in 100" :value="item" :key="item" v-if="item%25==0">{{ item }}</Option>
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
    import getCampaign from "../getCampaign.vue";
    import adgroupList from "../adgroupList.vue";
    import ideaList from "../ideaList.vue";
    import getAccount from "../getAccount.vue";
	export default {
        name: 'gradationReporting',
        components: {
            getCampaign,
            adgroupList,
            getAccount,
            ideaList,
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
                title:'账户报告', 
                adgroupList:[],
                creativeData: [],
                creativeList:[],
                //账户
                accountIds: [],
                //筛选时间
                DateDomain: [formatDate(new Date(new Date().getTime()-1000*60*60*24*7), "yyyy-MM-dd"),formatDate(new Date(), "yyyy-MM-dd")], 
                //比较
                compare:'',
                //报表类型
                retype:'1',
                //时间单位
                type:'0',
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
                    {title: "账户",key: "account_name",width: 300},
                    {title: "展现量",sortable: "custom",key: "impression"},
                    {title: "消费",sortable: "cost",key: "cost"},
                    {title: "点击",sortable: "cost",key: "click"},
                    {title: "点击率",sortable: "cost",key: "ctr"},
                    {title: "平均点击价格",sortable: "cost",key: "cpc"},
                    {title: "千次展现价格",sortable: "cost",key: "cpm"},
                ],
                tableSize: "small",
                echart:[],
                // 显示选择账号
                accountShow: false,
                accountIds: [],
                creativeId: []
			};
        },
        watch:{
            account(data){
                this.accountIds = data;
                this.getReporting();
            }
        },
        mounted() {
            this.getCreative();
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
                let param = {
                    action:'ucAdPut',
                    opt:'getGradationReporting',
                    period: this.DateDomain.join(','),  
                    retype:this.retype,
                    type:this.type,
                    accountIds:this.accountIds,
                    adgroupIds:this.adgroupIds,
                    page: this.page, //页码
                    page_size: this.page_size, //每页数量
                    orderField:this.orderField,
                    orderDirection: this.orderDirection //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                };
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            console.log('getReporting',res);  
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
            //报告类型
            retypeChange(val){
                switch (val) {
                    case '1': this.title ='账户报告'; this.accountShow = true; break;
                    case '2': this.title ='计划报告'; break;
                    case '3': this.title ='单元报告'; break;
                    case '4': this.title ='创意报告'; break;
                }
            },
            // 选择创意
            creativeChange(creativeId) {
                this.creativeId = creativeId;
            },
            // 获取创意
            getCreative() {
                Axios.post('api.php',{action:'ucAdPut',opt:'getCreativeById'}).then(
					res => {
						if(res.ret == 1) {
                            this.creativeData =  res.data;
						}
					}
                ).catch(err => {console.log(err)});         
            },
            // 选在账号
            accountChange(id) {
                this.accountIds = id;
            },
             //选择计划
            campaignChange(campaign){
                console.log(campaign)
                Axios.post('api.php',{action:'ucAdPut',opt:'getAdgroupNameList',campaign_id:campaign}).then(
					res => {
						if(res.ret == 1) {
                            let list = this.adgroupList =  res.data,
                                ids = '';
                            list.forEach(e=>{
                                ids += e.adgroup_id + ',';
                            });
                            console.log(this.adgroupList)
                            this.adgroupIds = ids;
						}
					}
                ).catch(err => {console.log(err)});            
            },
            //选择单元
            adgroupChange(val){
                this.adgroupids = val;
                this.adgroupids.forEach(adg => {
                     this.creativeData.forEach( item => {
                        if (item.adgroup_id === adg) {
                            console.log("============")
                            this.creativeList.push(item)
                        }
                    })
                })
                
            }      
        },
        beforeMount(){
            let setDate = DateShortcuts;
            setDate.disabledDate = (date) =>{return date && date.valueOf() > Date.now() - 86400000}
            this.options = setDate;
            this.accountIds = this.account;
            this.getReporting(); 
            // this.$Notice.warning({
            //     title: '提示',
            //     desc:'请先选择报类型中的账户，不然无法加载数据'
            // });
        }
    };
</script>

