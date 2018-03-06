<style lang="less">
    @import "../../styles/common.less";
    @import '../../styles/table.less';
    .head{border-bottom: 1px solid #e9eaec; margin-bottom: 10px; padding: 0;} 
     .sel_state1{
		text-align: left;

	}
	.sel_state1.ivu-select-multiple .ivu-select-selection{
		overflow: auto;
		height: 32px;
	} 
</style>
<template>
    <Card dis-hover shadow>
        <div class="head">
            <Row :gutter="10">
                <Col :xs="12" :md="3">
                    <!-- 媒体选择: -->
                    <Select @on-change="setMedia" placeholder="--媒体选择--" style="width:100%"  class="margin-bottom-10">
                        <Option v-for="item in media" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>

                <Col :xs="12" :md="3">
                    <!-- 账户选择: -->
                    <Select @on-change="setAccount" :disabled="account_disabled" placeholder="--账户选择--" style="width:100%"  class="margin-bottom-10">
                        <Option v-for="(item,index) in account" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </Col>

                <Col :xs="12" :md="2">
                    <!-- 版本: -->
                    <Select  @on-change="setVersion" placeholder="--全部版本--"  class="margin-bottom-10">
                        <Option v-for="item in versionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>                                      
                </Col> 

                <Col :xs="1" :md="2">
                    <diy-index @on-change="getIndex" :check="checkAllGroup" class="margin-bottom-10"></diy-index> 
                </Col>               

                <Col :xs="8" :md="3" offset="4">
                    <DatePicker  @on-change="changeDate" type="daterange" placement="bottom-end" placeholder="自定义时间" style="width: 100%"></DatePicker>
                </Col>
                <Col :xs="12" :md="5">                    
                    
                     <Select  @on-change="setPrincipal" v-model="current_author" :value="current_author" placeholder="--负责人--"  class="margin-bottom-10 sel_state1" multiple filterable >
                        <Option v-for="item in author" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>  
                </Col>
                <Col :xs="12" :md="2">
                    <Button icon="document-text"  @click="exportData()" style="float:right" class="margin-bottom-10">下载报表</Button>
                </Col>

            </Row>
        </div>    
        
        <Table :size="tableSize" :loading="loading" :columns="tableColumns" :data="list"  ref="tableCsv"  @on-sort-change="sortChange"></Table>

        <Row class="margin-top-10">
            <Col span="10">
            <Radio-group v-model="tableSize" type="button">
                <Radio label="large">大</Radio>
                <Radio label="default">中</Radio>
                <Radio label="small">小</Radio>
            </Radio-group>
              每页显示
            <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getTableData()">
                <Option v-for="item in 50" :value="item" :key="item" v-if="item%5==0">{{ item }}</Option>
            </Select>
            </Col>
            <Col span="14" style="text-align: right;">
                <Page :total="total_number" :page-size="page_size" ref="pages" @on-change="getTableData" show-elevator show-total></Page>
            </Col>
        </Row>
      
    </Card>
</template>
<script>
import diyIndex from './components/diyIndex.vue';

export default {
    components: {
        diyIndex
    },
    data () {
        return {
            height:700,
            loading : true,
            //每页数量 
            page: 1,
            page_size: 15, 
            total_number: 1, //总数量
            total_page: 1, //总页数
            tableSize: 'small',
            //searchTree 组件清除属性
            account_disabled:true,
            sclear:false,
            versionList:[
                {value: '', label:'全部'},
                {value: '2', label:'iOS'},
                {value: '3', label:'安卓'},
            ],
            tableColumns: [],
            //排序
            orderField:'',
            orderDirection: 'SORT_ASC',
            //默认选项目
            checkAllGroup:['cost','impression','click','install','install_per','reg_imei','activation','reg_per','reg_imei_cost','reg_cost','login','act_per','act_cost','pay_num','pay_total','pay_per','reg_arpu','pay_arpu','income_per','ltv'],
            current_account:'',
            current_media:'',
            current_version:'',
            current_time:[],
            current_author:[]
        }
    },
    computed :{ 
        list(){
            let channel = this.$store.state.channel;
            this.total_number = channel.total_number;
            this.total_page = channel.total_page;
            return channel.list;
        },
        //媒体
        media(){
            return this.$store.state.channel.media;
        },
        //账号
        account(){
            return this.$store.state.channel.account
        },
        //负责人
        author(){
            return this.$store.state.channel.author;
        }
    },
    watch: {
        list(data){
            //这里监听list变化了 把表格里loading隐藏  后期要考虑这样做是否妥当
            if(data.length == 0){
                this.$Message.info('没有查找到数据');
            }
            this.loading = false;
        },
        account(data){
            
        }
    },
    methods : {
        //获取所以媒体
        mediaItem(){            
            this.$store.dispatch('getMedia');
        },
        //获取负责人
        getAuthor(){
            this.$store.dispatch('getAuthor');
        },
        //导出表单
        exportData(){
            this.$refs.tableCsv.exportCsv({
                filename: '渠道媒体总览'
            });
        },
        //获取产品总览表格数据
        getTableData(page){
            if(page === undefined) {
                this.$refs['pages'].currentPage = 1;
                this.page = 1;
            } else {
                this.page = page;
            };
            let param = { 
                    do : 'accountOverview',
                    media_type : this.current_media,
                    os : this.current_version,
                    page : this.page,
                    page_size: this.page_size, 
                    account_id : this.current_account,
                    author : this.current_author,
                    orderField: this.orderField, 
					orderDirection: this.orderDirection //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                };
            if(this.current_time.length > 0){
                param.tdate = this.current_time[0];
                param.tdate2 = this.current_time[1];
            }
            this.loading = true;
            this.$store.dispatch('getChannelData',param);
        },
        //排序
        sortChange(column) {
            this.orderField = column.key;
            if(column.order == "asc"){
                this.orderDirection = "SORT_ASC";
            }else if(column.order == "desc"){
                this.orderDirection = "SORT_DESC";
            }else{
                this.orderField = '';
                this.orderDirection = "";
            }           
            this.getTableData();        
        }, 
        //自定义时间
        changeDate(date){
            this.current_time = date;
            this.getTableData();
        },   
        //选择账户
        setAccount(data){
            this.current_account = data;
            this.getTableData();
        },
        //选择媒体
        setMedia(data){            
            this.current_media = data;
            this.getTableData();
            //这里再获取账户
            this.$store.dispatch('getAccount',data);
            this.account_disabled = false;
        },
        //选择版本
        setVersion(data){
            this.current_version = data;
            this.getTableData();
        },
        //选择负责人
        setPrincipal(data){
            //this.current_author = data;
            this.getTableData();
        },
        //获取 自定义指标
        getIndex(data){
            this.checkAllGroup = data;           
            this.tableColumns = this.getTableColumns();
        },
        //设置表格头部
        getTableColumns(){
            //这里差一个账户
            const tableColumnList = {
                data : {title: '日期', key: 'date', "fixed": "left", sortable: 'custom', "width": 120 }, 
                media_name : {title: '媒体', key: 'media_name', sortable: 'custom',"width": 150 ,},   
                account_name : {
                    title: '账户', key: 'account_name', sortable: 'custom',"width": 150 ,
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    let query = {account_id: params.row.account_id};
                                    //跳转到计划总览
                                    this.$router.push({
                                        name: 'channel_plan',
                                        query: query
                                    });
                                }
                            }
                        }, params.row.account_name)
                    }
                },                             
                cost : {title: '投入', key: 'cost', sortable: 'custom', "width": 100 },
                impression : {title: '展示IP', key: 'impression', sortable: 'custom', "width": 100 },
                click : {title: '点击IP', key: 'click', sortable: 'custom', "width": 150 },
                click_per : {title: '点击率', key: 'click_per', sortable: 'custom', "width": 100 },
                install : {title: '激活安装', key: 'install', sortable: 'custom', "width": 120 },
                install_per : {title: '激活安装率', key: 'install_per', sortable: 'custom', "width": 120 },
                reg_imei : {title: '注册设备数', key: 'reg_imei', sortable: 'custom', "width": 120 },
                activation : {title: '注册', key: 'activation', sortable: 'custom', "width": 100 },
                reg_per : {title: '注册率', key: 'reg_per', sortable: 'custom', "width": 100 },
                reg_imei_cost : {title: '注册设备成本', key: 'reg_imei_cost', sortable: 'custom', "width": 130 },
                reg_cost : {title: '注册成本', key: 'reg_cost', sortable: 'custom', "width": 130 },
                login : {title: '次日活跃', key: 'login', sortable: 'custom', "width": 120 },
                act_per : {title: '活跃率', key: 'act_per', sortable: 'custom', "width": 120 },
                act_cost : {title: '活跃成本', key: 'act_cost', sortable: 'custom', "width": 120 },
                pay_num : {title: '付费人数', key: 'pay_num', sortable: 'custom', "width": 120 },
                pay_total : {title: '付费金额', key: 'pay_total', sortable: 'custom', "width": 120 },
                pay_per : {title: '付费率', key: 'pay_per', sortable: 'custom', "width": 100 },
                reg_arpu : {title: '注册ARPU', key: 'reg_arpu', sortable: 'custom', "width": 120 },
                pay_arpu : {title: '付费ARPU', key: 'pay_arpu', sortable: 'custom', "width": 120 },
                income_per : {title: '回本率', key: 'income_per', sortable: 'custom', "width": 100 },
                ltv : {title: 'LTV', key: 'ltv', sortable: 'custom', "width": 80 }, 
            };            
            //固定选项
            let data = [
                tableColumnList.media_name,
                tableColumnList.data,               
                tableColumnList.account_name
            ];
            this.checkAllGroup.forEach( col => data.push(tableColumnList[col]) );            
            return data;
        },
        changeTableColumns(){
            this.tableColumns = this.getTableColumns();
        },
    },
    mounted(){
        this.changeTableColumns();
        this.height = document.body.clientHeight - 225;
        this.getTableData(); 
        this.mediaItem();
        this.getAuthor();
    }
}
</script>