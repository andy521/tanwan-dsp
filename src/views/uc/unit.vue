<style lang="less">
@import "../../styles/common.less";
@import './index.less';
.citytree{background: #fff;
    border: solid 1px #eee;
    padding: 15px;
    max-height: 200px;
    overflow: auto;
    margin-top: 10px;
}
</style>
<template>
	<div class="unit">        
        <Card shadow class="margin-top-10">
            <Row>
                <Col v-show="isBack" span="1">
                    <Button type="primary" @click="back">返回</Button>
                </Col>
                <Col span="2">
                    <search-tree @on-change="getids"></search-tree>
                </Col>
                <Col span="10">                    
                    <Button type="ghost" icon="funnel" class="margin-left-10" @click=" filterModal = true">筛选</Button>
                    <DatePicker type="daterange" class="margin-left-10" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
                    <Input v-model="keyword" class="inp" placeholder="请输入关键字" ></Input>
                    <Button icon="search" @click="getUnit()">搜索</Button>
                    <new-edit title="新建单元" class="margin-left-5"></new-edit>
                </Col>
                <Col span="11" style="text-align: right;">
                <select-author  @on-change="authorChange"></select-author>
                    <Button :loading="copyUnitLoading" type="ghost" icon="ios-copy" @click="copyUnit">复制单元</Button>
                    <Button type="ghost" icon="trash-a" @click="deleteFun">删除</Button>
                    <Button type="ghost" icon="social-usd" @click="setBidFun">修改出价</Button>
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
                    <Button type="ghost" icon="location" @click="setRegionFun">修改地域</Button>
                    <Button type="ghost" icon="wifi" @click="setWifi">修改网络环境</Button>
                    <unit-index @on-change="getIndex" :check="checkAllGroup"></unit-index>
                </Col>
            </Row>	

            <div class="condition" v-show="filterShow">
                <a href="javascript:;" @click="deleteFilterAll" style="margin-right:10px;">清空所有条件</a>
                <Tag v-for="item in filterItem" type="border" :name="item.id" :key="item.id" closable @on-close="deleteFilter">{{item.text}}</Tag>
            </div>

            <Table :data="list" :height="height" :loading="loading" :columns="tableColumns" :size="tableSize" class="margin-top-10" ref="Vtable" @on-selection-change="taCheck" @on-sort-change="sortchange"  stripe></Table>

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

        <Modal v-model="filterModal" title="筛选条件" @on-ok="filterOk" @on-cancel="filterModal = false">
            <p class="mt">推广状态</p>
            <Radio-group v-model="state">
                <Radio label="">不限</Radio>
                <Radio label="0">启动</Radio>
                <Radio label="1">暂停</Radio>
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
            </Radio-group>
        </Modal>

        <Modal v-model="bidModal" title="修改出价" @on-ok="setBid" @on-cancel=" bidModal = false ">
            <Radio-group v-model="operateNum" @on-change="operateNumFun">
                <Radio label="0">提高</Radio>
                <Radio label="1">降低</Radio>
            </Radio-group>
            <div class="margin-top-10"><Input-number style="width:200px;" :max="percentageMax" :min="1" v-model="percentage"></Input-number> %</div>      
        </Modal>

        <Modal v-model="regionModal" title="修改地域" @on-ok="setRegion" @on-cancel=" regionModal = false ">
            <Radio-group v-model="allRegion">
                <Radio label="1">不限</Radio>
                <Radio label="0">自定义</Radio>
            </Radio-group>
            <div v-show="allRegion == '0'" class="citytree">
                <Tree :data="regionList" show-checkbox @on-check-change="getRegion"></Tree>
            </div>            
        </Modal>

        <Modal v-model="wifiModal" title="修改网络环境" @on-ok="setWifiOk" @on-cancel=" wifiModal = false ">
            <Radio-group v-model="wifi">
                <Radio label="11">不限</Radio>
                <Radio label="01">WIFI</Radio>
                <Radio label="10">数据网络</Radio>
            </Radio-group>          
        </Modal>

        <!--复制广告-->
        <Modal v-model="copyUnitMmdal" title="复制单元" @on-ok="submitCopy">
            <div class="margin-top-10">
                <Form :label-width="100">
                    <FormItem label="选择复制的计划">
                        <Select v-model="selePlanId" filterable placeholder="请选择媒体账号">
                            <Option v-for="item in planList" :value="item.campaign_id" :key="item.campaign_id">{{ item.campaign_name }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
        </Modal>
	</div>
</template>
<script>
    import Axios from "@/api/index";
     import selectAuthor from '@/components/select-author/index.vue';
    import searchTree from '@/components/select-tree/searchTree.vue';
    import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
    import newEdit from "./components/newEdit.vue";
    import unitIndex from "./components/unitIndex.vue";
	export default {
        components: {
            unitIndex,
            newEdit,
            searchTree,
            selectAuthor
        },
		data() {
			return {
                loading: false,
                isBack : true,
                height:document.body.clientHeight - 200,
                filterModal:false,
                dateModal:false,
                regionModal:false,
                bidModal:false,
                wifiModal:false,
                copyUnitMmdal:false,
                copyUnitLoading:false,
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
                //计划id
                campaign_id:'',
                //选中的id
                checkId: [],      
                //默认自定义指标选项
                checkAllGroup:['paused','state','optimizationTarget','cost','impression','ctr','chargeType','bid','click'],
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
                //计费方式
                chargeType:'',
                //推广方式
                generalizeType:'',
                //排序
                orderField:'',
                orderDirection: '',
                //修改地域
                regionList:[],
                allRegion:'1',
                regions:[],
                //修改出价
                operateNum:'0',
                percentage:1,
                percentageMax:1000,
                //修改网络环境
                wifi:'11',
                //根据游戏ID
                game_id:'',
                //账号列表
                planList:[],
                //选择计划ID
                selePlanId:'',
			};
		},
		methods: {
            //选择负责人
			authorChange(data) {
				this.author_model = data;
				this.getUnit();
			},
            //返回
            back() {
                this.$router.go(-1);
            },
            //获取选中的游戏id
            getids(gid){
                this.game_id = '[' + gid.join(',') + ']';
                this.getUnit();
            }, 
            //获取推广单元		
			getUnit(page){
                if (page === undefined) {
                    //this.$refs["pages"].currentPage = 1;
                    this.page = 1;
                } else {
                    this.page = page;
                }
                let param={
                    action : 'ucAdPut',
                    opt : 'searchAdgroups',
                    campaign_id:this.campaign_id,
                    startDate: this.DateDomain[0], //开始时间
                    endDate: this.DateDomain[1], //结速时间                    
                    keyword : this.keyword, //模糊搜索关键词(针对计划名称、后台用户名称)
                    paused:this.state, //是否暂停中  0: 否 1: 是
                    game_ids:this.game_id, //游戏ID     
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
            //获取选中的id
            taCheck(row) {
                if(row.length>0){
                    this.operating = false;
                };
                let ids = [];
                row.forEach(item => {
                    ids.push(item.id);
                });
                this.checkId = ids;
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
            //修改状态
            setPausedFun(){
                if(this.checkId.length =='0'){
                    this.$Message.info('请勾选需要修改的数据');
                    return
                }; 
                let param = {
                    ids:this.checkId,
                    paused : this.setpaused
                };
                this.updatePaused(param);
            },
            //投放开关
            updatePaused(data){
                let param = data;
                    param.action = 'ucAdPut';
                    param.opt = 'updateAdgroupPaused';
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            this.$Message.info(res.data);
                            this.getUnit();
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
                let ids= this.checkId;
                this.deleteData(ids);
            },
            deleteData(id){
                let param = {
                    action:'ucAdPut',
                    opt:'deleteAdgroup',
                    do:'del',
                    ids:id
                }
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            this.$Message.info(res.msg);
                            this.getUnit();
						}
					}
                ).catch(err => {console.log(err)});
            },            
            //修改出价
            setBidFun(){
                if(this.checkId.length =='0'){
                    this.$Message.info('请勾选需要修改的数据');
                    return
                };
                this.bidModal = true;
            },
            setBid(){  
                let param = {
                    action:'ucAdPut',
                    opt:'updateAdgroupBidByPercentage',
                    ids:this.checkId,
                    bidStage:1,
                    operateNum:this.operateNum,
                    percentage:this.percentage
                }
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            console.log(res)
                            this.$Message.info(res.msg);
						}
					}
                ).catch(err => {console.log(err)});
            },
            //修改出价 - 提高/降底
            operateNumFun(val){
                this.percentage = 1;
                if(val == '0'){
                    this.percentageMax = 1000;
                }else{
                    this.percentageMax = 100;
                }
            },
            //修改地域
            setRegionFun(){
                if(this.checkId.length =='0'){
                    this.$Message.info('请勾选需要修改的数据');
                    return
                }; 
                this.regionModal = true;
                Axios.post('api.php', {action:'ucAdPut',opt:'getProvince',account_id:this.checkId[0]}).then(
					res => {
						if(res.ret == 1) {
                            //console.log(res.data.provinces)
                            let list=res.data.provinces,
                                newlist = [];
                            list.forEach((item, i) => {
                                let children = [];
                                item.cityList.forEach(item => {
                                    let newv = {
                                        title: item.name,
                                        id: item.value,
                                        expand: false
                                    }
                                    children.push(newv)
                                });
                                let newitem = {
                                    title: item.name,
                                    id: item.value,
                                    expand: false,
                                    children: children
                                }
                                newlist.push(newitem)
                            }); 
                            this.regionList = newlist;
						}
					}
                ).catch(err => {console.log(err)});
            },
            //修改网络环境
            setWifi(){
                if(this.checkId.length =='0'){
                    this.$Message.info('请勾选需要修改的数据');
                    return
                }; 
                this.wifiModal = true;
            },
            setWifiOk(){
                let param = {
                    action:'ucAdPut',
                    opt:'updateAdgroupNetworkEnv',
                    ids:this.checkId,
                    networkEnv: this.wifi
                }
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            console.log(res)
                            this.$Message.info(res.msg);     
						}
					}
                ).catch(err => {console.log(err)});
            },
            getRegion(data){
                var ids = [];
				data.forEach(item => {
					if(!item.children) {
						ids.push(item.id);
					}
				})
                this.regions = ids;
            },
            setRegion(){
                let param = {
                    action:'ucAdPut',
                    opt:'updateAdgroupRegion',
                    ids:this.checkId,
                    allRegion: this.allRegion,
                    regions:this.regions
                }
                Axios.post('api.php', param).then(
					res => {
						if(res.ret == 1) {
                            this.$Message.info(res.msg);     
						}
					}
                ).catch(err => {console.log(err)});
            },
            //获取自定义指标
            getIndex(data){                
                this.checkAllGroup = data;                 
                this.tableColumns = this.getTableColumns();
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
                if(this.chargeType != ''){
                    let t = '计费方式:'
                    switch (this.chargeType) {
                        case '1': t += 'CPC';break;
                        case '2': t += 'CPM';break;
                    }
                    item.push({text:t,id:'chargeType'});
                };
                if(this.generalizeType != ''){
                    let t = '推广方式:'
                    switch (this.generalizeType) {
                        case '1': t += '打开页面';break;
                        case '2': t += 'APP下载';break;
                    }
                    item.push({text:t,id:'generalizeType'});
                };
                if(item.length > 0){
                    this.filterItem = item;
                    this.filterShow=true;
                    this.getUnit();
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
                    case 'chargeType': this.chargeType=''; break;
                    case 'generalizeType': this.generalizeType=''; break;
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
                this.getUnit();
            },
            deleteFilterAll(){
                this.state = this.adResourceId=this.impression_value=this.cost_value=this.click_value=this.ctr_value=this.chargeType=this.generalizeType='';
                this.filterShow=false;
                this.getUnit();
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
            getTableColumns(){
                const tableColumnList = {
                    selection : {type: 'selection',width: 60,align: 'center' },
                    account_name:{
                        title: "账户",
                        key: "account_name",
                        width: 100
                    },
                    adgroup_name:{
                        title: "单元名称",     
                        key: "adgroup_name",
                        width: 200,
                        render: (h, params) => {
                            return h("span",{
                                class: "name",
                                on: {
                                    'click': () => {
                                        let query = {
                                            adgroup_id:params.row.adgroup_id
                                        };
                                        this.$router.push({
                                            name: "uc_idea",
                                            query: query
                                        });
                                    }
                                }
                            },params.row.adgroup_name)
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
                                                    ids:params.row.id.split(','),
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
                    chargeType:{
                        title: "计费方式",
                        key: "chargeType",
                        width: 100,
                        render : (h, params) => {
                            let text = '';
                            switch (params.row.chargeType) {
                                case '1': text = "CPC"; break;
                                case '2': text = "CPM"; break;
                            }
                            return h('span', text);
                        }
                    },
                    optimizationTarget:{
                        title: "优化目标",
                        key: "optimizationTarget",
                        width: 100,
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
                    bid:{
                        title: "出价",
                        sortable: "custom",
                        key: "bid",
                        width: 100
                    },
                    cpc:{
                        title: "平均点击价格",
                        sortable: "custom",
                        key: "cpc",
                        width: 130
                    },
                    cpm:{
                        title: "千次展现价格",
                        sortable: "custom",
                        key: "cpm",
                        width: 130
                    },
                    download_complete:{
                        title: "下载数",
                        sortable: "custom",
                        key: "download_complete",
                        width: 100
                    },
                    download_complete_rate:{
                        title: "下载率",
                        sortable: "custom",
                        key: "download_complete_rate",
                        width: 100
                    },
                    cvr:{
                        title: "点击激活率",
                        sortable: "custom",
                        key: "cvr",
                        width: 130
                    },
                    install_per:{
                        title: "激活安装率",
                        sortable: "custom",
                        key: "install_per",
                        width: 130
                    },
                    download_convert:{
                        title: "下载激活率",
                        sortable: "custom",
                        key: "download_convert",
                        width: 130
                    },
                    conversion:{
                        title: "注册设备数",
                        sortable: "custom",
                        key: "conversion",
                        width: 120
                    },
                    app_reg_cost:{
                        title: "注册设备成本",
                        sortable: "custom",
                        key: "app_reg_cost",
                        width: 130
                    },
                    reg_total:{
                        title: "注册",
                        sortable: "custom",
                        key: "reg_total",
                        width: 100
                    },
                    reg_cost:{
                        title: "注册成本",
                        sortable: "custom",
                        key: "reg_cost",
                        width: 120
                    },
                    reg_per:{
                        title: "注册率",
                        sortable: "custom",
                        key: "reg_per",
                        width: 100
                    },
                    reg_arpu:{
                        title: "注册ARPU",
                        sortable: "custom",
                        key: "reg_arpu",
                        width: 120
                    },
                    active:{
                        title: "活跃数",
                        sortable: "custom",
                        key: "active",
                        width: 100
                    },
                    active_per:{
                        title: "活跃率",
                        sortable: "custom",
                        key: "active_per",
                        width: 100
                    },
                    pay_num:{
                        title: "付费人数",
                        sortable: "custom",
                        key: "pay_num",
                        width: 120
                    },
                    pay_total:{
                        title: "付费金额",
                        sortable: "custom",
                        key: "pay_total",
                        width: 120
                    },
                    pay_per:{
                        title: "付费率",
                        sortable: "custom",
                        key: "pay_per",
                        width: 100
                    },
                    income_per:{
                        title: "回本率",
                        sortable: "custom",
                        key: "income_per",
                        width: 100
                    },
                    chargeType:{
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
                    generalizeType:{
                        title: "推广方式",
                        key: "generalizeType",
                        width: 120,
                        render : (h, params) => {
                            let text = '';
                            switch (params.row.generalizeType) {
                                case '1': text = "打开页面"; break;
                                case '2': text = "APP下载"; break;
                            }
                            return h('span', text);
                        }
                    },
                    platform:{
                        title: "操作系统",
                        key: "platform",
                        width: 140,
                        render : (h, params) => {
                            let text = '';
                            switch (params.row.platform) {
                                case '001': text = "IOS"; break;
                                case '010': text = "Android"; break;
                                case '100': text = "其他"; break;
                                case '011': text = "Android和IOS"; break;
                                case '110': text = "其他和安卓"; break;                                
                                case '111': text = "不限"; break;
                            }
                            return h('span', text);
                        }
                    },
                    adResourceId:{
                        title: "推广资源",
                        key: "adResourceId",
                        width: 100,
                        render : (h, params) => {
                            let text = '';
                            switch (params.row.adResourceId) {
                                case '1': text = "UC头条"; break;
                                case '2': text = "UC精准"; break;
                                case '4': text = "应用商店"; break;
                            }
                            return h('span', text);
                        }
                    },
                    adgroup_id:{
                        title: "单元ID",
                        key: "adgroup_id",
                        width: 100
                    },
                    budget:{
                        title: "日预算",
                        sortable: "custom",
                        key: "budget",
                        width: 100
                    },
                    impression:{
                        title: "展现量",
                        sortable: "custom",
                        key: "impression",
                        width: 100
                    },
                    author:{
                        title: "负责人",
                        sortable: "custom",
                        key: "author",
                        width: 100
                    },
                    operate:{
                        title: '操作',
                        align: 'center',
                        key: 'id',
                        width: 100,
                        render : (h, params) => {
                            return [
                                h("span",{
                                    class: "edit_link",
                                    on: {
                                        'click': () => {
                                            let query = {
                                                account:params.row.account_id,
                                                campaign_id:params.row.campaign_id,
                                                adgroup_id: params.row.adgroup_id,
                                                id: params.row.id,
                                                targeting_id: params.row.targeting_id,
                                                edit: "1",
                                            };
                                            this.$router.push({
                                                name: "ucunit",
                                                query: query
                                            });
                                        }
                                    }
                                },'编辑'),
                                h("span",{
                                    class: "del_link",
                                    on: {
                                        'click': (value) => {
                                            let ids= params.row.id.split(',');
                                            this.$Modal.confirm({
                                                title: '操作提示',
                                                content: '<p>确认删除</p>',
                                                onOk: () => {
                                                    this.deleteData(ids)
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
                    tableColumnList.account_name,
                    tableColumnList.adgroup_name
                ];
                const normalizeData = ["state", "paused", "optimizationTarget", "cost", "impression", "click", "ctr", "cpc", "cpm", "bid","download_complete", "download_complete_rate", "conversion", "app_reg_cost", "reg_total", "budget", "cvr", "download_convert", "install_per", "reg_cost", "reg_per", "reg_arpu", "active", "active_per", "pay_num", "pay_total", "pay_per", "income_per", "platform", "chargeType", "generalizeType", "adResourceId"];
                // this.checkAllGroup.forEach( col => data.push(tableColumnList[col]) );
                if (this.checkAllGroup.length >= 1) {
                    normalizeData.forEach( k => {
                        this.checkAllGroup.forEach( col => {
                            if (k === col) {
                                data.push(tableColumnList[col]);
                            }
                        });
                    });
                }
                data.push(tableColumnList.adgroup_id,tableColumnList.author,tableColumnList.operate)
                return data;
            },
            changeTableColumns(){
                //console.log(this.getTableColumns())
                this.tableColumns = this.getTableColumns();
            },
            //复制单元
            copyUnit(){
                if(this.checkId.length =='0'){
                    this.$Message.info('请勾选需要复制的数据');
                    return
                }else{
                    let cid = this.checkId[0],
                    same = this.checkId.some(id=>{return id == cid;});
                    if(!same){
                        this.$Message.info("请选择同一帐号");
                        return
                    }                    
                }
                this.copyUnitLoading = true;                
                //获取账号列表
                Axios.post('api.php',{action:'ucAdPut',opt:'getCampaignNameList'}).then(
					res => {
						if(res.ret == 1) {
                            this.copyUnitLoading = false;
                            this.copyUnitMmdal = true;
                            this.planList = res.data;
						}
					}
                ).catch(err => {console.log(err)});
            },
            submitCopy(){
                if(this.selePlanId == ''){
                    this.$Message.info('请选择复制的计划');
                    return false;
                };
                let param = {
                    action:'adData',
                    opt:'tasck_add',
                    type:'uc',
                    act:'cp_campaigns',
                    campaign_id:this.selePlanId,
                    account_id:this.checkId[0],
                    idArr:this.cid.join(",")
                }
                //console.log(param)
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
            let query = this.$route.query.id;
            if(!!query){
                this.campaign_id = query.toString();
                this.isBack = true;
            }
            this.changeTableColumns();
            this.getUnit();
        }
	};
</script>