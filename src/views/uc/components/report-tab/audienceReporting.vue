<style scoped>
.pt{font-size: 14px; margin-bottom: 5px;}
.plan_box{height: 200px; overflow-y: auto; border: 1px solid #eee;  padding: 0 10px;}
.ivu-checkbox-group-item{display: block; margin-top: 10px;}
.name{max-width: 300px; overflow: hidden;text-overflow: ellipsis; white-space: nowrap; word-wrap: normal;word-wrap: break-word;word-break: break-all;}
</style>
<template>
	<div class="resources">
        <Form :label-width="80" inline>
            <Form-item label="时间范围：">
                <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
            </Form-item> 
            <Form-item label="选择计划：">
                <Button :loading="planLoading" @click="getCampaign" class="name">{{planTxt}}</Button>
                <!-- <Select v-model="accountIds" style="width:200px" placeholder="全部推广计划" @on-change="getAdgroup()">
                    <Option v-for="(item,index) in accountList" :value="item.campaign_id" :key="index">{{ item.campaign_name }}</Option>
                </Select> -->
                <Button :loading="unitLoading" @click="getAdgroup" class="name">{{unitTxt}}</Button>
            </Form-item>
            <Form-item label="统计指标：">
                <Radio-group v-model="type">
                    <Radio label="impression">展现</Radio>
                    <Radio label="click">点击</Radio>
                    <Radio label="cost">点击率</Radio>
                </Radio-group>
            </Form-item>
            <Button type="primary" @click="getReporting()">查询</Button>
        </Form>  

       
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

        <Modal v-model="planModel" title="选择计划" @on-ok="setPlanOK">
            <div class="pt">
                全部计划
                <Checkbox style="float:right" @on-change="planAll">全选</Checkbox>
            </div>
            <div class="plan_box">
                <Checkbox-group v-model="accountIds">
                    <Checkbox v-for="item in accountList" :label="item.campaign_id" :key="item.campaign_id">{{ item.campaign_name }}</Checkbox>
                </Checkbox-group>
            </div>            
        </Modal>

        <Modal v-model="unitModel" title="选择计划" @on-ok="setUnitOK">
            <div class="pt">
                全部单元
                <Checkbox style="float:right" @on-change="unitAll">全选</Checkbox>
            </div>
            <div class="plan_box">
                <Checkbox-group v-model="adgroupIds">
                    <Checkbox v-for="item in adgroupList" :label="item.adgroup_id" :key="item.adgroup_id">{{ item.adgroup_name }}</Checkbox>
                </Checkbox-group>
            </div>            
        </Modal>

	</div>
</template>

<script>
    import Axios from "@/api/index";
    import echarts from 'echarts';
    import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
	export default {
        name: 'appReporting',      
		data() {
			return {
                planLoading:false,
                unitLoading:false,
                planModel:false,
                unitModel:false,
                loading:false,
                options: null,
                planTxt:'全部推广计划',
                unitTxt:'全部推广单元',
                //获取单元
                adgroupList:[],
                adgroupIds:[],
                //计划ID
                accountList:{},
                accountIds:[],
                //统计指标 
                type:'impression',
                //排序
                orderField:'',
                orderDirection: '',
                //筛选时间
                DateDomain: [formatDate(new Date(new Date().getTime()-1000*60*60*24*7), "yyyy-MM-dd"),formatDate(new Date(), "yyyy-MM-dd")], 
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
                tableSize: "small"
			};
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
                    opt:'getProvinceReporting',
                    accountIds:this.accountIds.join(','),
                    adgroupIds:this.adgroupIds.join(','),
                    startDate: this.DateDomain[0], //开始时间
                    endDate: this.DateDomain[1], //结速时间                
                    type:this.type,
                    page: this.page, //页码
                    page_size: this.page_size, //每页数量
                    orderField:this.orderField,
                    orderDirection: this.orderDirection //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                };
                console.log(param)
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            console.log('地域图表')
                            console.log(res);  
                            this.loading = false;
                            // this.list = res.data.list;
                            // this.page = parseInt(res.data.page);
                            // this.page_size = parseInt(res.data.page_size);
                            // this.total_number = res.data.total_number;
                            // this.total_page = res.data.total_page;
						}
					}
                ).catch(err => {console.log(err)});
            },
            //排序
            sortchange(column) {
                this.orderField = column.key;
                this.orderDirection =  column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
                this.getSpread();
            },  
            //获取计划
            getCampaign(){
                this.planLoading = true;       
                Axios.post('api.php',{action:'ucAdPut',opt:'getCampaignNameList'}).then(
					res => {
						if(res.ret == 1) {
                            console.log(res)
                            this.planLoading = false;
                            this.planModel = true;
                            this.accountList = res.data;
						}
					}
                ).catch(err => {console.log(err)});
            },
            //全选计划
            planAll(val){                
                if(val){
                    let s = [];
                    this.accountList.forEach(val=>{
                        s.push(val.campaign_id)
                    })
                    this.accountIds = s;
                }else{
                    this.accountIds = [];
                }
            },
            //全选单元
            unitAll(val){
                if(val){
                    let s = [];
                    this.adgroupList.forEach(val=>{
                        s.push(val.adgroup_id)
                    })
                    this.adgroupIds = s;
                }else{
                    this.adgroupIds = [];
                }
            },
            setPlanOK(){
                let list = this.accountList,name='';
                this.accountIds.forEach(item=>{                    
                    for(let x in list){
                        console.log(list[x])
                        if(list[x].campaign_id == item){
                            name += list[x].campaign_name + ','
                            return
                        }
                    }
                });
                this.planTxt = name;
            },
            setUnitOK(){
                let list = this.adgroupList,name='';
                this.adgroupIds.forEach(item=>{                    
                    for(let x in list){
                        console.log(list[x])
                        if(list[x].adgroup_id == item){
                            name += list[x].adgroup_name + ','
                            return
                        }
                    }
                });
                this.unitTxt = name;
            },
            getAdgroup(){
                this.unitLoading = true;
                Axios.post('api.php',{action:'ucAdPut',opt:'getAdgroupNameList',campaign_id:'['+ this.accountIds +']'}).then(
					res => {
						if(res.ret == 1) {
                            console.log(res)
                            this.unitLoading = false;
                            this.unitModel = true;
                            this.adgroupList = res.data;
						}
					}
                ).catch(err => {console.log(err)});
            }  
        },
        beforeMount(){
            let setDate = DateShortcuts;
            setDate.disabledDate = (date) =>{return date && date.valueOf() > Date.now() - 86400000}
            this.options = setDate;           
            this.getReporting(); 
        }
	};
</script>