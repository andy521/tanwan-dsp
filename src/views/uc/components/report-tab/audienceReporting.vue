<style lang="less">
@import "../../index.less";
</style>
<style scoped>
.pt{font-size: 14px; margin-bottom: 5px;}
.plan_box{height: 200px; overflow-y: auto; border: 1px solid #eee;  padding: 0 10px;}
.ivu-checkbox-group-item{display: block; margin-top: 10px;}
.name{max-width: 300px; overflow: hidden;text-overflow: ellipsis; white-space: nowrap; word-wrap: normal;word-wrap: break-word;word-break: break-all;}
#map{height: 500px; width: 100%;}
#lineEchart{width: 100%; height: 300px; margin-top: 10px;}
</style>
<template>
	<div class="resources">
        <Form :label-width="80" inline>
            <Form-item label="时间范围：">
                <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
            </Form-item> 
            <Form-item label="选择计划：">
                <get-campaign style="display:inline-block" @on-change="campaignChange"></get-campaign>
                <adgroup-list :adgroup="adgroupList" @on-change="adgroupChange" style="display:inline-block;margin-left:5px;"></adgroup-list>
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
        
        <div class="chart">
            <div class="ec_tit">
                受众分析报告
                <span class="view" @click="es = !es"><Icon type="stats-bars"></Icon> 查看趋势图</span>
            </div>            
            <div v-show="es" class="echart_area">
                <div id="map"></div>
                <div id="lineEchart"></div>
            </div>
        </div>
       
        <div class="margin-top-10">
            受众报表定制下载
            <Tooltip  placement="top-start">
                <Icon type="help-circled"></Icon>
                <div slot="content"><p>基于统计校验及调整原因</p><p>受众报表与实时报告可能会有差异</p></div>
            </Tooltip>
            <Form :label-width="80">
                <Form-item label="统计维度：">
                    <Radio-group v-model="retype">
                        <Radio label="province">省级地域 </Radio>
                        <Radio label="city">地级市</Radio>
                        <Radio label="platform">操作系统</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="时间单位：">
                    <Radio-group v-model="type2">
                        <Radio label="1">分日 </Radio>
                        <Radio label="2">分月</Radio>
                        <Radio label="3">汇总</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item >
                    <Button type="primary" @click="getAudienceReporting()">查询</Button>
                </Form-item>
            </Form>            
        </div>
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
    import 'echarts/map/js/china.js';
    import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
    import getCampaign from "../getCampaign.vue";
    import adgroupList from "../adgroupList.vue";
	export default {
        name: 'appReporting',
        components: {
            getCampaign,
            adgroupList
        },   
        props:{
            account:{
                type:String,
                default:''
            }
        },  
		data() {
			return {
                es:true,
                loading:false,
                options: null,
                //获取单元
                adgroupList:[],
                adgroupIds:[],
                //账户
                accountIds:'',
                //统计维度
                retype:'province',
                //时间单位
                type2:'1',
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
                    {title: "账户",key: "account_name",width: 200},
                    {title: "省份",key: "province",width: 200},
                    {title: "展现量",sortable: "custom",key: "impression"},
                    {title: "消费",sortable: "cost",key: "cost"},
                    {title: "点击",sortable: "cost",key: "click"},
                    {title: "点击率",sortable: "cost",key: "ctr"},
                    {title: "平均点击价格",sortable: "cost",key: "cpc"},
                    {title: "千次展现价格",sortable: "cost",key: "cpm"},
                ],
                tableSize: "small",
                //chart数据
                echarts:{}
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
			getReporting(){
                let param = {
                    action:'ucAdPut',
                    opt:'getProvinceReporting',
                    accountIds:this.accountIds,
                    adgroupIds:this.adgroupIds,
                    startDate: this.DateDomain[0], //开始时间
                    endDate: this.DateDomain[1], //结速时间                
                    type:this.type,
                    page: this.page,
                    page_size: this.page_size,
                    orderField:this.orderField,
                    orderDirection: this.orderDirection
                };
                console.log(param)
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            this.echarts = res.data;
                            console.log(res)
                            this.mapEcharts();
                            this.cityChart();
						}
					}
                ).catch(err => {console.log(err)});
            },
            //受众分析报告表格
            getAudienceReporting(page){
                if (page === undefined) {
                    this.page = 1;
                } else {
                    this.page = page;
                }
                this.loading = true;
                let param = {
                    action:'ucAdPut',
                    opt:'getAudienceReporting',
                    accountIds:this.accountIds,
                    adgroupIds:this.adgroupIds,
                    startDate: this.DateDomain[0], //开始时间
                    endDate: this.DateDomain[1], //结速时间   
                    retype:this.retype,             
                    type:this.type2,
                    page: this.page, //页码
                    page_size: this.page_size, //每页数量
                    orderField:this.orderField,
                    orderDirection: this.orderDirection //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                };
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            //console.log(res);  
                            this.loading = false;
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
                this.getAudienceReporting();
            },  
            //选择计划
            campaignChange(campaign){
                Axios.post('api.php',{action:'ucAdPut',opt:'getAdgroupNameList',campaign_id:campaign}).then(
					res => {
						if(res.ret == 1) {
                            let list = this.adgroupList =  res.data,
                                ids = '';
                            list.forEach(e=>{
                                ids += e.adgroup_id + ',';
                            });
                            this.adgroupIds = ids;
						}
					}
                ).catch(err => {console.log(err)});            
            },            
            //选择单元
            adgroupChange(val){
                this.adgroupids = val;
            },
            convertData(data){
                let geoCoordMap = {'新疆维吾尔自治区':[84.9023,42.148],'西藏自治区':[87.8695,31.6846],'内蒙古自治区':[112.5977,46.3408],"青海":[95.2402,35.4199],"四川":[101.9199,30.1904],"黑龙江":[126.1445,48.7156],"甘肃":[99.7129,38.166],"云南":[101.0652,25.1807],"广西壮族自治区":[107.7813,23.6426], "湖南":[111.5332,27.3779],"陕西":[109.5996,35.7396],"广东":[113.4668,22.8076],"吉林":[125.7746,43.5938],"河北":[115.4004,39.4688],"湖北":[112.2363,31.1572],"贵州":[106.6113,26.9385],"山东":[118.7402,36.4307],"江西":[116.0156,27.29],"河南":[113.0668,33.8818],"辽宁":[122.0438,41.0889],"山西":[112.4121,37.6611],"安徽":[117.2461,32.0361],"福建":[118.3008,25.9277],"浙江":[120.498,29.0918],"江苏":[118.8586,32.915],"重庆市":[107.7539,30.1904],"宁夏回族自治区":[105.9961,37.3096],"海南省":[109.9512,19.2041],"台湾":[120.0254,23.5986],"北京":[116.4551,40.2539],"天津市":[117.4219,39.4189],"上海市":[121.4648,31.2891],"香港特别行政区":[114.1178,22.3242],"澳门特别行政区":[111.5547,22.1484]};
                let res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            },
            //地图
            mapEcharts(){
                let impression =  this.echarts.province[0],
                    precent =   this.echarts.province[1],
                    max = parseInt(this.echarts.max) || 0,
                    min = parseInt(this.echarts.min) || 0;
                let option = {
                    title: {text: '省级地域分布', left: 'center'},     
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {  
                            var res = params.name+'<br/>';  
                            var myseries = option.series;
                            for (var i = 0; i < myseries.length; i++) {  
                                for(var j=0;j<myseries[i].data.length;j++){  
                                    if(myseries[i].data[j].name==params.name){
                                        if( myseries[i].eng == 'precent'){
                                            res+=myseries[i].name +' : '+ myseries[i].data[j].value[2]*100 +'%</br>';
                                        }else{
                                            res+=myseries[i].name +' : '+ myseries[i].data[j].value[2] +'</br>'; 
                                        } 
                                    }  
                                }  
                            }  
                            return res;  
                        }  
                    },
                    legend: {orient: 'vertical',left: 'left', data:['impression','precent']},
                    visualMap: { min: min, max: max,left: 'left',top: 'bottom',text: ['高','低'],calculable: true},
                    toolbox: {show: true,orient: 'vertical',left: 'right', top: 'center',feature: {dataView: {readOnly: false},restore: {},saveAsImage: {}}},
                    series:[
                        {
                            name: impression.name,
                            eng : impression.eng,
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            label: {normal: {show: true},emphasis: {show: true}},
                            data:this.convertData(impression.data)
                        },
                        {
                            name: precent.name,
                            eng : precent.eng,
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            label: {normal: {show: true},emphasis: {show: true}},
                            data:this.convertData(precent.data)
                        }
                    ]
                }; 
                const mapCharts = echarts.init(document.getElementById('map'));
                mapCharts.setOption(option);
                window.addEventListener('resize', function () {
                    mapCharts.resize();
                });
            },
            cityChart(){
                let list = this.echarts.city,
                    xAxisData = list.xAxis.data;
                let option = {
                    color: ['#3398DB','#000000'],
                    title: {text: '地级市分布',left: 'left'},
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {type: 'cross',crossStyle: {color: '#999'}},
                        formatter: function(params) {
                            let res = params[0].name  + '<br/>';
                            params.forEach(e=>{
                                e.componentSubType == 'line' ?  res +=  e.seriesName + ':' + e.data*100 +'%<br/>' : res +=  e.seriesName + ':' + e.data +'<br/>' ;
                            }); 
                            return res;
                        } 
                    },
                    grid: {top: '15%',left: '1.2%',right: '1%',bottom: '3%',containLabel: true},
                    toolbox: {feature: {saveAsImage: {}} },
                    legend: {data:['展现','占比']},
                    xAxis: [{type: 'category',data: xAxisData}],
                    yAxis: [{type:'value'}],
                    series: list.series
                };
                const charts = echarts.init(document.getElementById('lineEchart'));
                charts.setOption(option);
                window.addEventListener('resize',function (){ charts.resize();});
            }
        },
        beforeMount(){
            let setDate = DateShortcuts;
            setDate.disabledDate = (date) =>{return date && date.valueOf() > Date.now() - 86400000}
            this.options = setDate;  
            this.accountIds = this.account;         
            this.getReporting(); 
            this.getAudienceReporting();
        }
	};
</script>