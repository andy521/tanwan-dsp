<style lang="less">
@import "../../styles/common.less";
@import './index.less';
</style>
<template>
	<div class="unit">        
        <Card shadow class="margin-top-10">
            <Row>
                <Col span="14">
                    <Button type="ghost" icon="ios-copy">新建单元</Button>
                    <Button type="ghost" icon="funnel" class="margin-left-5" @click=" filterModal = true">筛选</Button>
                    <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
                    <Input v-model="keyword" class="inp" placeholder="请输入关键字" ></Input>
                    <Button icon="search" @click="getUnit()">搜索</Button>
                </Col>
                <Col span="10" style="text-align: right;">
                    <Button type="ghost" icon="trash-a" @click="deleteFun">删除</Button>
                    <Button type="ghost" icon="clock" @click="modifyDate">修改日期</Button>
                    <Button type="ghost" icon="social-usd" @click="setBudget">修改预算</Button>
                    <Poptip placement="bottom-start" v-model="visible">
                        <Button type="ghost" icon="toggle-filled">修改状态</Button>
                        <div class="api" slot="content">
                            <div style="text-align: left;">
                                <Select v-model="setpaused" :value="setpaused">
                                    <Option value="0">启用</Option>
                                    <Option value="1">暂停</Option>
                                </Select>
                            </div>
                            <div class="tipbtn margin-top-10">
                                <Button type="text" size="small" @click="visible=false">取消</Button>
                                <Button type="primary" size="small" @click="setPausedFun">确定</Button>
                            </div>
                        </div>
                    </Poptip>
                    <!-- <view-tip @on-change="getuncheck" action="gdtAdPut" opt="campaigns"></view-tip>  -->
                </Col>
            </Row>	
        
            <Table :data="newList" :height="height" :loading="loading" :columns="taColumns" :size="tableSize" class="margin-top-10" ref="Vtable" @on-selection-change="taCheck" @on-sort-change="sortchange" :row-class-name="rowClassName" stripe></Table>

            <Row class="margin-top-10">
                <Col span="10"> 表格尺寸
                <Radio-group v-model="tableSize" type="button">
                    <Radio label="large">大</Radio>
                    <Radio label="default">中</Radio>
                    <Radio label="small">小</Radio>
                </Radio-group>
                每页显示
                <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getUnit()">
                    <Option v-for="item in 100" :value="item" :key="item" v-if="item%25==0">{{ item }}</Option>
                </Select>
                </Col>
                <Col span="14" style="text-align: right;">
                <Page :total="total_number" :current="page" :page-size="page_size" ref="pages" @on-change="getUnit" show-elevator show-total></Page>
                </Col>
            </Row>
        </Card>

        <Modal v-model="filterModal" title="筛选条件" @on-ok="filterOk" @on-cancel="modalCancel">
            <p class="mt">推广状态</p>
            <Radio-group v-model="state">
                <Radio label="">不限</Radio>
                <Radio label="0">推广中</Radio>
                <Radio label="1">推广暂停</Radio>
                <Radio label="2">推广计划预算不足</Radio>
                <Radio label="3">不在推广周期</Radio>
            </Radio-group>
            <p class="mt margin-top-20">投放数据</p>
            <div class="model-col">
                <Row>
                    <Col span="12">
                        展现量:
                        <Select v-model="impression_relation" style="width:50px">
                            <Option value=">=">>=</Option>
                            <Option value="=">=</Option>
                            <Option value="<="><=</Option>
                        </Select>
                        <Input v-model="impression_value" @on-blur="setNum('impression')" placeholder="" style="width:110px"></Input>
                    </Col>
                    <Col span="12">
                        消&nbsp;&nbsp;&nbsp;&nbsp;费:
                        <Select v-model="cost_relation" style="width:50px">
                            <Option value=">=">>=</Option>
                            <Option value="=">=</Option>
                            <Option value="<="><=</Option>
                        </Select>
                        <Input v-model="cost_value" @on-blur="setNum('cost')" placeholder="" style="width:110px"></Input>
                    </Col>
                    <Col span="12">
                        点击量:
                        <Select v-model="click_relation" style="width:50px">
                            <Option value=">=">>=</Option>
                            <Option value="=">=</Option>
                            <Option value="<="><=</Option>
                        </Select>
                        <Input v-model="click_value" @on-blur="setNum('click')" placeholder="" style="width:110px"></Input>
                    </Col>
                    <Col span="12">
                        点击率:
                        <Select v-model="ctr_relation" style="width:50px">
                            <Option value=">=">>=</Option>
                            <Option value="=">=</Option>
                            <Option value="<="><=</Option>
                        </Select>
                        <Input v-model="ctr_value" @on-blur="setNum('ctr')" placeholder="" style="width:110px"></Input>
                    </Col>
                </Row>
            </div>
            <p class="mt margin-top-20">计费方式</p>
            <Radio-group v-model="chargeType">
                <Radio label="">不限</Radio>
                <Radio label="1">CPC</Radio>
                <Radio label="2">CPM</Radio>
            </Radio-group>
            <p class="mt margin-top-20">推广方式</p>
            <Radio-group v-model="generalizeType">
                <Radio label="">不限</Radio>
                <Radio label="1">打开页面</Radio>
                <Radio label="2">APP下载</Radio>
            </Radio-group>
            <p class="mt margin-top-20">推广资源</p>
            <Radio-group v-model="adResourceId">
                <Radio label="">不限</Radio>
                <Radio label="1">UC头条</Radio>
                <Radio label="2">UC精准</Radio>
                <Radio label="4">应用商店</Radio>
            </Radio-group>
        </Modal>
	</div>
</template>
<script>
	import Axios from "@/api/index";
    import { DateShortcuts, formatDate, deepClone } from "@/utils/DateShortcuts.js";
	export default {
		data() {
			return {
                loading: false,
                height:document.body.clientHeight - 200,
                filterModal:false,
                budgetModal:false,
                dateModal:false,
                setbudgetNumber:100,
                //设置预算
                setbudget:'-1',
                //修改日期和时间
                formStartDate:'',
                formEndDate:'-1',
                //操作
                operating:true,
                //修改状态
                setpaused:'',
                visible:false,
                page: 1, //第N页
                page_size: 50, //每页数量
                total_number: 1, //总数量
                total_page: 1, //总页数
                //关键字
                keyword: "", 
                //筛选时间
                DateDomain: [formatDate(new Date(), "yyyy-MM-dd"),formatDate(new Date(), "yyyy-MM-dd")],
                //日期辅助功能
                options: DateShortcuts,
                tableSize: "small",
                //表头设置
                taColumns: [], 
                //选中账户id
                checkId: [], 
                //选中计划id
                checkCampaign:[],
                //表数据            
                tableColumns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: "单元名称",     
                        key: "adgroup_name",
                        width: 250,
                        // render: (h, params) => {
                        //     return h("span",{
                        //         class: "name",
                        //         on: {
                        //             'click': () => {
                        //                 let query = {
                        //                     account_id:params.row.account_id,
                        //                     campaign_id:params.row.campaign_id
                        //                 };
                        //                 this.$router.push({
                        //                     name: "uc_unit",
                        //                     query: query
                        //                 });
                        //             }
                        //         }
                        //     },params.row.campaign_name)
                        // }
                    },
                    {
                        title: "投放开关",
                        align: 'center',     
                        key: "paused",
                        width: 90,
                        render : (h, params) => {
                            if (!params.row.paused) {
                                return;
                            } else {
                                return h("div", [
                                    h("i-switch", {
                                        props: {
                                            size: "small",
                                            value: params.row.paused == "0" ? true : false
                                        },
                                        on: {
                                            "on-change": value => {
                                                let paused = value ? '0' : '1';
                                                let param = {
                                                    account_id:params.row.account_id,
                                                    campaignids:'['+ params.row.campaign_id +']',
                                                    paused : paused
                                                };
                                                this.updatePaused(param)
                                            }
                                        }
                                    })
                                ]);
                            }
                        }
                    },
                    {
                        title: "推广状态",
                        key: "state",
                        align: 'center',
                        width: 120,
                        render : (h, params) => {
                            let text = '';
                            switch (params.row.state) {
                                case '0': text = "推广中"; break;
                                case '1': text = "推广暂停"; break;
                                case '2': text = "推广计划预算不足"; break;
                                case '3': text = "不在推广周期"; break;
                            }
                            return h('span', text);
                        }
                    },
                    {
                        title: "展现量",
                        sortable: "custom",
                        key: "impression",
                        width: 120
                    },
                    {
                        title: "点击量",
                        sortable: "custom",
                        key: "click",
                        width: 120
                    },
                    {
                        title: "点击率",
                        sortable: "custom",
                        key: "ctr",
                        width: 120
                    },
                    {
                        title: "消费",
                        sortable: "custom",
                        key: "cost",
                        width: 120
                    },
                    {
                        title: "计费方式",
                        key: "chargeType",
                        width: 120,
                        render : (h, params) => {
                            let text = '';
                            switch (params.row.chargeType) {
                                case '1': text = "CPC"; break;
                                case '2': text = "CPM"; break;
                            }
                            return h('span', text);
                        }
                    },
                    {
                        title: "优化目标",
                        key: "optimizationTarget",
                        width: 120,
                        render : (h, params) => {
                            let text = '';
                            switch (params.row.optimizationTarget) {
                                case '1': text = "点击"; break;
                                case '2': text = "展现"; break;
                                case '3': text = "转化"; break;
                            }
                            return h('span', text);
                        }
                    },
                    {
                        title: "出价",
                        sortable: "custom",
                        key: "bid",
                        width: 120
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'id',
                        render : (h, params) => {
                            return [
                                h("i-button", {
                                    props: {
                                        icon: "edit",
                                        type: "success",
                                        size: "small"
                                    },
                                    on: {
                                        'click': () => {
                                            console.log('跳转到创建广告')
                                            // this.$router.push({
                                            //     name: "time_ad",
                                            //     query: query
                                            // });
                                        }
                                    }
                                }),
                                h("i-button", {
                                    props: {
                                        icon: "trash-a",
                                        type: "error",
                                        size: "small"
                                    },
                                    class:"margin-left-10",
                                    on: {
                                        'click': value => {
                                            let account= params.row.account_id,campaign= '[' + params.row.campaign_id + ']';
                                            this.deleteData(account,campaign)
                                        }
                                    }
                                })
                            ]
                        }
                    }
                ],
                //数据
                list:[],
                //没选中的
                uncheck: [],
                //筛选条件显示DIV
                filterShow:false,
                filterItem:[],
                //计划状态
                state:'',
                //展现量
                impression_relation:'>=',
                impression_value:'',
                //消费
                cost_relation:'>=',
                cost_value:'',
                //点击量
                click_relation:'>=',
                click_value:'',
                //点击率
                ctr_relation:'>=',
                ctr_value:'',
                //推广资源
                adResourceId:'',
                //计费方式
                chargeType:'',
                //推广方式
                generalizeType:'',
                //排序
                orderField:'',
                orderDirection: '',
			};
		},
		methods: {
            //获取推广单元		
			getUnit(){
                let param={
                    action : 'ucAdPut',
                    opt : 'searchAdgroups',
                    startDate: this.DateDomain[0], //开始时间
                    endDate: this.DateDomain[1], //结速时间                    
                    keyword : this.keyword, //模糊搜索关键词(针对计划名称、后台用户名称)
                    paused:'0', //是否暂停中  0: 否 1: 是
                    state : this.state,
                    chargeType : this.chargeType, //计费方式
                    generalizeType : this.generalizeType,
                    'impression[relation]':this.impression_relation,
                    'impression[value]':this.impression_value,
                    'cost[relation]':this.cost_relation,
                    'cost[value]':this.cost_value,
                    'click[relation]':this.click_relation,
                    'click[value]':this.click_value,
                    'ctr[relation]':this.ctr_relation,
                    'ctr[value]':this.ctr_value,
                    adResourceId:this.adResourceId,                    
                    page: this.page, //页码
                    page_size: this.page_size, //每页数量
                    orderField:this.orderField,
                    orderDirection: this.orderDirection //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                };                
                Axios.post('api.php',param).then( 
                    res=>{
                        if(res.ret == '1'){
                            console.log(res)
                            this.loading = false;
                            this.list = res.data.list;
                            this.page = parseInt(res.data.page);
                            this.page_size = parseInt(res.data.page_size);
                            this.total_number = res.data.total_number;
                            this.total_page = res.data.total_page;
                        }
                    }
                ).catch( 
                    err=>{ console.log( err) }
                ); 
            },
            //表格高亮calss
            rowClassName(row, index) {
                if (row._disabled) {
                    return "table-statistics";
                }
            },
            //获取选中的id
            taCheck(row) {
                if(row.length>0){
                    this.operating = false;
                };
                let ids = [],campaigns=[];
                row.forEach(item => {
                    ids.push(item.account_id);
                    campaigns.push(item.campaign_id);
                });
                this.checkId = ids;
                this.checkCampaign = campaigns;
            },
            //排序
            sortchange(column) {
                this.orderField = column.key;
                this.orderDirection =  column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
                this.getUnit();
            },
            //改变日期
            changeDate(e) {
                this.DateDomain = e;
                this.getUnit();
            },
            deleteFun(){

            },
            modifyDate(){

            },
            setBudget(){

            },
            getuncheck(){

            },
            setPausedFun(){

            },
            modalCancel(){
                this.filterModal = false;
            },
            //筛选条件
            filterOk(){
                let item = [];
                if(this.state != ''){
                    let t = '推广状态:'
                    switch (this.state) {
                        case '0': t += '推广中';break;
                        case '1': t += '推广暂停';break;
                        case '2': t += '推广计划预算不足';break;
                        case '3': t += '不在推广周期';break;
                    }
                    item.push({text:t,id:'state'});
                }
                if(this.impression_value != ''){
                    const t = '展现量:' + this.impression_relation + this.impression_value;
                    item.push({text:t,id:'impression'});
                }
                if(this.cost_value != ''){
                    const t = '消费:' + this.cost_relation + this.cost_value;
                    item.push({text:t,id:'cost'});
                }
                if(this.click_value != ''){
                    const t = '点击量:' + this.click_relation + this.click_value;
                    item.push({text:t,id:'click'});
                }
                if(this.ctr_value != ''){
                    const t = '点击率:' + this.ctr_relation + this.ctr_value;
                    item.push({text:t,id:'ctr'});
                }
                if(this.adResourceId != ''){
                    let t = '推广资源:'
                    switch (this.adResourceId) {
                        case '1': t += 'UC头条';break;
                        case '2': t += 'UC精准';break;
                        case '4': t += '应用商店';break;
                    }
                    item.push({text:t,id:'adResourceId'});
                };
                if(item.length > 0){
                    this.filterItem = item;
                    this.filterShow=true;
                    this.getSpread();
                }
            },
        },
        computed: {
            //获取实时投放计划
            newList() {
                //深层复制
                let arr = deepClone(this.tableColumns);
                this.uncheck.forEach(item => {
                    arr.forEach((col, i) => {
                        if (col.key == item) {
                            arr.splice(i, 1);
                        }
                    });
                });
                this.taColumns = arr;
                return this.list;
            }
        },
        beforeMount(){
            this.getUnit();
        }
	};
</script>