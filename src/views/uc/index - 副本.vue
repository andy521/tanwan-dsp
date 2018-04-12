<style lang="less">
@import "../../styles/common.less";
@import './index.less';
</style>
<template>
	<div class="spread">
        <!-- 查询账户信息 -->
        <!-- <account-info></account-info> -->
		<Card shadow class="margin-top-10">
            <Row>
                <Col span="4">
                    <search-tree @on-change="getids"></search-tree>
                </Col>
                <Col span="10">
                    <Button type="ghost" icon="funnel" class="margin-left-5" @click=" filterModal = true">筛选</Button>
                    <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
                    <Input v-model="keyword" class="inp" placeholder="请输入关键字" ></Input>
                    <Button icon="search" @click="getSpread()">搜索</Button>
                    <new-edit  class="margin-left-5"></new-edit>
                </Col>
                <Col span="10" style="text-align: right;">
                    <Button type="ghost" :loading="copyPlanLoading" icon="ios-copy" @click="copyPlan">复制计划</Button>
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
                    <plan-index @on-change="getIndex" :check="checkAllGroup"  action="gdtAdPut" opt="campaigns"></plan-index>                    
                </Col>
            </Row>

            <div class="condition" v-show="filterShow">
                <a href="javascript:;" @click="deleteFilterAll" style="margin-right:10px;">清空所有条件</a>
                <Tag v-for="item in filterItem" type="border" :name="item.id" :key="item.id" closable @on-close="deleteFilter">{{item.text}}</Tag>
            </div>

            <Table :data="list" :height="height" :loading="loading" :columns="tableColumns" :size="tableSize" class="margin-top-10" ref="Vtable" @on-selection-change="taCheck" @on-sort-change="sortchange" :row-class-name="rowClassName" stripe></Table>

            <Row class="margin-top-10">
                <Col span="10"> 表格尺寸
                <Radio-group v-model="tableSize" type="button">
                    <Radio label="large">大</Radio>
                    <Radio label="default">中</Radio>
                    <Radio label="small">小</Radio>
                </Radio-group>
                每页显示
                <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getSpread()">
                    <Option v-for="item in 100" :value="item" :key="item" v-if="item%25==0">{{ item }}</Option>
                </Select>
                </Col>
                <Col span="14" style="text-align: right;">
                    <Page :total="total_number" :current="page" :page-size="page_size" ref="pages" @on-change="getSpread" show-elevator show-total></Page>
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
            <p class="mt margin-top-20">推广资源</p>
            <Radio-group v-model="adResourceId">
                <Radio label="">不限</Radio>
                <Radio label="1">UC头条</Radio>
                <Radio label="2">UC精准</Radio>
                <Radio label="4">应用商店</Radio>
            </Radio-group>
        </Modal>


        <Modal v-model="budgetModal" title="修改预算" @on-ok="setBudgetOk" @on-cancel=" budgetModal = false">
            <div class="budgetModal">
                <Radio-group v-model="setbudget" vertical>
                    <Radio label="0">
                        <Input-number :max="100000" :min="100" :step="100" v-model="setbudgetNumber" style="width:300px;" :disabled="setbudget == '-1'"></Input-number>
                    </Radio>
                    <Radio label="-1">不限</Radio>
                </Radio-group>
            </div>
        </Modal>

        <Modal v-model="dateModal" title="修改日期和时间" @on-ok="setDateOk" @on-cancel=" dateModal = false" width="1000">
            <div class="dateModal">
                <Form label-position="right" :label-width="100">
                    <Form-item label="开始日期：">
                        <Date-picker :options="formDisabledDate" @on-change="formStartDateFun" type="date" placeholder="选择开始日期"></Date-picker>
                    </Form-item>
                    <Form-item label="结束日期：">
                        <Radio-group v-model="formEndDate">
                            <Radio label="-1">不限</Radio>
                            <Radio label="0"><Date-picker :options="formDisabledDate" @on-change="formEndDateFun" :disabled="formEndDate == -1" type="date" placeholder="选择开始日期"></Date-picker></Radio>
                        </Radio-group>    
                    </Form-item>
                    <Form-item label="投放时段：">
                        <div class="week_period">
                            <week-date :value="interval"></week-date>
                        </div>
                    </Form-item>
                </Form>
            </div>
        </Modal>

        <Modal v-model="copyPlanMmdal" title="复制计划" @on-ok="submitCopy">
            <div class="margin-top-10">
                <Form :label-width="100">
                    <FormItem label="选择复制的帐户">
                        <Select v-model="seleId" filterable placeholder="请选择媒体账号">
                            <Option v-for="item in accountList" :value="item.account_id" :key="item.account_id">{{ item.account_name }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
        </Modal>

	</div>
</template>
<script>
	import Axios from "@/api/index";
    import { DateShortcuts, formatDate, deepClone } from "@/utils/DateShortcuts.js";
    //import accountInfo from "./components/accountInfo.vue";
    import planIndex from "./components/planIndex.vue";
    import newEdit from "./components/newEdit.vue";
    import weekDate from "@/components/week-date/index.vue";
    import searchTree from '@/components/select-tree/searchTree.vue';
	export default {
        components: {
            //accountInfo,
            newEdit,
            searchTree,
            weekDate,
            planIndex
        },
		data() {
			return {
                height:document.body.clientHeight - 200,
                loading: true,
                filterModal:false,
                budgetModal:false,
                dateModal:false,
                copyPlanMmdal:false,
                copyPlanLoading:false,
                setbudgetNumber:100,
                //设置预算
                setbudget:'-1',
                //修改日期和时间
                formDisabledDate:{
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
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
                options: null,
                tableSize: "small",
                //选中id
                cid:[],
                //选中账户id
                checkId: [], 
                //选中计划id
                checkCampaign:[],
                //默认自定义指标选项
                checkAllGroup:['paused','state','impression','click','ctr','cost','adResourceId','budget'],
                //表格头部
                tableColumns: [],
                //数据
                list:[],
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
                //排序
                orderField:'',
                orderDirection: '',
                //投放时段
                interval:['111111111111111111111111','111111111111111111111111','111111111111111111111111','111111111111111111111111','111111111111111111111111','111111111111111111111111','111111111111111111111111'],
                //根据游戏ID
                game_id:'',
                //账号列表
                accountList:[],
                //选择账号ID
                seleId:''
            };
        },
		methods: {	
            //获取选中的游戏id
            getids(gid){
                this.game_id = '[' + gid.join(',') + ']';
                this.getSpread();
            },  
            //筛选弹出框验证数字
            setNum(name){
                let patrn = /^\d+(\.\d+)?$/;               
                if (!patrn.exec(this.impression_value) && name == 'impression' && this.impression_value != ''){
                    this.impression_value = '';
                    this.$Message.error('请输非数字');
                };
                if (!patrn.exec(this.cost_value) && name == 'cost' && this.cost_value != ''){
                    this.cost_value = '';
                    this.$Message.error('请输非数字');
                };
                if (!patrn.exec(this.click_value) && name == 'click' && this.click_value != ''){
                    this.click_value = '';
                    this.$Message.error('请输非数字');
                };
                if (!patrn.exec(this.ctr_value) && name == 'ctr' && this.ctr_value != ''){
                    this.ctr_value = '';
                    this.$Message.error('请输非数字');
                };
            },
            //全部计划	
            getPlan(id){
                console.log(id);
            },
			//改变日期
            changeDate(e) {
                this.DateDomain = e;
                this.getSpread();
            },
            //获取选中的id
            taCheck(row) {
                if(row.length>0){
                    this.operating = false;
                };
                let id=[],ids = [],campaigns=[];
                row.forEach(item => {
                    id.push(item.id)
                    ids.push(item.account_id);
                    campaigns.push(item.campaign_id);
                });
                this.cid = id;
                this.checkId = ids;
                this.checkCampaign = campaigns;
            },
            //排序
            sortchange(column) {
                this.orderField = column.key;
                this.orderDirection =  column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
                this.getSpread();
            },
            getSpread(page){
                if (page === undefined) {
                    //this.$refs["pages"].currentPage = 1;
                    this.page = 1;
                } else {
                    this.page = page;
                }
                let param={
                    action : 'ucAdPut',
                    opt : 'searchCampaigns',
                    startDate: this.DateDomain[0], //开始时间
                    endDate: this.DateDomain[1], //结速时间
                    keyword : this.keyword, //模糊搜索关键词(针对计划名称、后台用户名称)
                    state : this.state,
                    game_ids:this.game_id, //游戏ID
                    'impression[relation]':this.impression_relation,
                    'impression[value]':this.impression_value,
                    'cost[relation]':this.cost_relation,
                    'cost[value]':this.cost_value,
                    'click[relation]':this.click_relation,
                    'click[value]':this.click_value,
                    'ctr[relation]':this.ctr_relation,
                    'ctr[value]':this.ctr_value,
                    adResourceId:this.adResourceId,
                    orderField:this.orderField,
                    page: this.page, //页码
                    page_size: this.page_size, //每页数量
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
            modalCancel(){
                this.filterModal = false;
            },
            //获取自定义指标
            getIndex(data){
                //console.log(data);
                this.checkAllGroup = data;                 
                this.tableColumns = this.getTableColumns();
            },
            //修改状态
            setPausedFun(){
                if(this.checkId.length =='0'){
                    this.$Message.info('请勾选需要修改的数据');
                    return
                }; 
                let param = {
                    account_id:this.checkId[0],
                    campaignids:'[' + this.checkCampaign.join(',') + ']',
                    paused : this.setpaused
                };
                this.updatePaused(param);
            },
            //投放开关
            updatePaused(data){
                let param = data;
                    param.action = 'ucAdPut';
                    param.opt = 'updateCampaignPaused';     
                console.log(param)           
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            this.$Message.info(res.data);
                            this.getSpread();
						}
					}
                ).catch(err => {console.log(err)});                
            },
            //删除
            deleteFun(){
                if(this.checkId.length =='0'){
                    this.$Message.info('请勾选需要修改的数据');
                    return
                }; 
                let account= this.checkId[0],campaign= '[' + this.checkCampaign.join(',') + ']';
                this.deleteData(account,campaign);
            },
            deleteData(account,campaign){
                let param = {
                    action:'ucAdPut',
                    opt:'deleteCampaign',
                    do:'del',
                    account_id:account,
                    campaignids:campaign
                }
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            this.$Message.info(res.msg);
                            this.getSpread();
						}
					}
                ).catch(err => {console.log(err)});
            },
            //修改日期
            modifyDate(){
                if(this.checkId.length =='0'){
                    this.$Message.info('请勾选需要修改的数据');
                    return
                }; 
                this.dateModal = true;
            },
            setDateOk(){
                let param = {
                    action:'ucAdPut',
                    opt:'updateCampaignDate',
                    account_id:this.checkId[0],
                    campaignids:'[' + this.checkCampaign.join(',') + ']',
                    startDate:this.formStartDate,
                    endDate:this.formEndDate,
                    monday:this.interval[0],
                    tuesday:this.interval[1],
                    wednesday:this.interval[2],
                    thursday:this.interval[3],
                    friday:this.interval[4],
                    saturday:this.interval[5],
                    sunday:this.interval[6],
                };
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            console.log(res)
						}
					}
                ).catch(err => {console.log(err)});
            },
            //修改开始日期
            formStartDateFun(val){
                this.formStartDate = val;
            },
            formEndDateFun(val){
                this.formEndDate = val;
            },
            //修改预算
            setBudget(data){
                if(this.checkId.length =='0'){
                    this.$Message.info('请勾选需要修改的数据');
                    return
                };     
                this.budgetModal = true;
            },
            setBudgetOk(){                
                let setbuget = this.setbudget;
                if(setbuget == 0){
                    setbuget = this.setbudgetNumber;
                };
                let param = {
                    action:'ucAdPut',
                    opt:'updateCampaignBudget',
                    account_id:this.checkId[0],
                    campaignids:'[' + this.checkCampaign.join(',') + ']',
                    budget:setbuget
                }
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            //console.log(res)
							this.$Message.info(res.data);
						}
					}
                ).catch(err => {console.log(err)});
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
            deleteFilter(event, name){ 
                switch (name) {
                    case 'state': this.state=''; break;
                    case 'impression': this.impression_value=''; break;
                    case 'cost': this.cost_value=''; break;
                    case 'click': this.click_value=''; break;
                    case 'ctr': this.ctr_value=''; break;
                    case 'adResourceId': this.adResourceId=''; break;
                }
                let fitem = [];
                this.filterItem.forEach(item=>{
                    if(item.id != name){
                        fitem.push(item)
                    }
                });
                this.filterItem = fitem;
                if(fitem.length == 0){
                    this.filterShow=false;
                }
                this.getSpread();
            },
            deleteFilterAll(){
                this.state = this.adResourceId=this.impression_value=this.cost_value=this.click_value=this.ctr_value='';
                this.filterShow=false;
                this.getSpread();
            },
            //设置表格头部
            getTableColumns(){
                const tableColumnList = {
                    selection : {type: 'selection',width: 60,align: 'center' },
                    campaign_name:{
                        title: "计划名称",     
                        key: "campaign_name",
                        width: 300,
                        render: (h, params) => {
                            return h("span",{
                                class: "name",
                                on: {
                                    'click': () => {
                                        let query = {
                                            //account_id:params.row.account_id,
                                            id:params.row.campaign_id
                                        };
                                        this.$router.push({
                                            name: "uc_unit",
                                            query: query
                                        });
                                    }
                                }
                            },params.row.campaign_name)
                        }
                    },
                    paused:{
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
                    state:{
                        title: "推广状态",
                        key: "state",
                        align: 'center',
                        width: 200,
                        render : (h, params) => {
                            let text = '', color ='border';
                            switch (params.row.state) {
                                case '0': text = "推广中"; break;
                                case '1': text = "推广暂停"; break;
                                case '2': text = "推广计划预算不足"; break;
                                case '3': text = "不在推广周期"; break;
                            }
                            return h('span', text);
                        }
                    },                    
                    impression:{
                        title: "展现量",
                        sortable: "custom",
                        key: "impression",
                        width: 100
                    },
                    click:{
                        title: "点击量",
                        sortable: "custom",
                        key: "click",
                        width: 100
                    },
                    ctr:{
                        title: "点击率",
                        sortable: "custom",
                        key: "ctr",
                        width: 100
                    },
                    cost:{
                        title: "消费",
                        sortable: "custom",
                        key: "cost",
                        width: 100
                    },                    
                    adResourceId:{
                        title: "推广资源",
                        key: "adResourceId",
                        width: 120,
                        render : (h, params) => {
                            let text = '', color ='border';
                            switch (params.row.adResourceId) {
                                case '1': text = "UC头条"; break;
                                case '2': text = "UC精准"; break;
                                case '4': text = "应用商店"; break;
                            }
                            return h('span', text);
                        }
                    },
                    budget:{
                        title: "日预算",
                        key: "budget",
                        width: 100
                    },
                    campaign_id:{
                        title: "计划id",
                        key: "campaign_id",
                        width: 100
                    },
                    cpc:{
                        title: "平均点击价格",
                        key: "cpc",
                        width: 120
                    },
                    cpm:{
                        title: "千次展现价格",
                        key: "cpm",
                        width: 120
                    },
                    invalidReasonList:{
                        title: "推广计划非启动状态原因",
                        key: "invalidReasonList",
                        width: 300
                    },
                    platform:{
                        title: "操作系统",
                        key: "platform",
                        width: 100
                    },
                    download_start:{
                        title: "下载开始数",
                        key: "download_start",
                        width: 100
                    },
                    download_complete:{
                        title: "下载完成数",
                        key: "download_complete",
                        width: 100
                    },
                    download_complete_rate:{
                        title: "下载完成率",
                        key: "download_complete_rate",
                        width: 100
                    },
                    conversion:{
                        title: "激活总量",
                        key: "conversion",
                        width: 100
                    },
                    cvr:{
                        title: "点击激活率",
                        key: "cvr",
                        width: 100
                    },
                    conversion_cost:{
                        title: "转换成本",
                        key: "conversion_cost",
                        width:100
                    },
                    active:{
                        title: "活跃数",
                        key: "active",
                        width: 100
                    },
                    active_per:{
                        title: "活跃率",
                        key: "active_per",
                        width: 100
                    },
                    reg_total:{
                        title: "注册数",
                        key: "reg_total",
                        width: 100
                    },
                    install_per:{
                        title: "激活安装率",
                        key: "install_per",
                        width: 100
                    },
                    reg_per:{
                        title: "注册率",
                        key: "reg_per",
                        width: 100
                    },
                    reg_cost:{
                        title: "注册成本",
                        key: "reg_cost",
                        width: 100
                    },
                    pay_num:{
                        title: "付费人数",
                        key: "pay_num",
                        width: 100
                    },
                    pay_total:{
                        title: "付费金额",
                        key: "pay_total",
                        width: 100
                    },
                    pay_per:{
                        title: "付费率",
                        key: "pay_per",
                        width: 100
                    },
                    reg_arpu:{
                        title: "注册ARPU",
                        key: "reg_arpu",
                        width: 100
                    },
                    income_per:{
                        title: "回本率",
                        key: "income_per",
                        width: 100
                    },
                    click_installr:{
                        title: "点击激活率",
                        key: "click_installr",
                        width: 100
                    },
                    app_reg:{
                        title: "注册设备数",
                        key: "app_reg",
                        width: 100
                    },
                    app_reg_cost:{
                        title: "注册设备成本",
                        key: "app_reg_cost",
                        width: 120
                    },
                    operate:{
                        title: '操作',
                        align: 'center',
                        key: 'id',
                        width:200,
                        render : (h, params) => {
                            return [
                                h("span",{
                                    class: "edit_link",
                                    on: {
                                        'click': () => {
                                            let query = { account:params.row.account_id};
                                            this.$router.push({
                                                name: "ucnew_pack",
                                                query: query
                                            });
                                        }
                                    }
                                },'编辑'),
                                h("span",{
                                    class: "del_link",
                                    on: {
                                        'click': (value) => {
                                            let account= params.row.account_id,campaign= '[' + params.row.campaign_id + ']';
                                            this.$Modal.confirm({
                                                title: '操作提示',
                                                content: '<p>确认删除</p>',
                                                onOk: () => {
                                                    this.deleteData(account,campaign)
                                                },
                                                onCancel: () => {}
                                            });
                                        }
                                    }
                                },'删除')
                            ]
                        }
                    }
                };            
                //固定选项
                let data = [
                    tableColumnList.selection,
                    tableColumnList.campaign_name
                ];                
                this.checkAllGroup.forEach( col => data.push(tableColumnList[col]) ); 
                data.push(tableColumnList.operate)
                return data;
            },
            changeTableColumns(){
                //console.log(this.getTableColumns())
                this.tableColumns = this.getTableColumns();
            },
            //复制计划
            copyPlan(){
                if(this.checkId.length =='0'){
                    this.$Message.info('请勾选需要复制的数据');
                    return
                };   
                this.copyPlanLoading = true;
                //获取账号列表
                Axios.post('api.php',{action:'ucAdPut',opt:'getAccountList'}).then(
					res => {
						if(res.ret == 1) {
                            this.copyPlanMmdal = true;
                            this.copyPlanLoading = false;
                            this.accountList = res.data;
						}
					}
                ).catch(err => {console.log(err)});
            },
            submitCopy(){
                if(this.seleId == ''){
                    this.$Message.info('请选择复制的帐户');
                    return false;
                };
                let param = {
                    action:'adData',
                    opt:'tasck_add',
                    type:'uc',
                    act:'cp_campaigns',
                    account_id:this.seleId,
                    idArr:this.cid.join(",")
                }
                Axios.post('api.php',param).then(
					res => {
						if(res.ret == 1) {
                            this.$Message.info(res.msg);
						}
					}
                ).catch(err => {console.log(err)});
            }
        },
        beforeMount(){
            let setDate = DateShortcuts;
            setDate.disabledDate = (date) =>{return date && date.valueOf() > Date.now() - 86400000}
            this.options = setDate;
            this.changeTableColumns();
            this.getSpread();
        }
	};
</script>