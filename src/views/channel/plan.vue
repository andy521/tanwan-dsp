<style lang="less">
    @import "../../styles/common.less";
    @import '../../styles/table.less';
    .head{border-bottom: 1px solid #e9eaec; margin-bottom: 10px; padding: 0;}  
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
                    <Select @on-change="setAccount" placeholder="--账户选择--" style="width:100%"  class="margin-bottom-10">
                        <Option v-for="item in account" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>

                <Col :xs="12" :md="5">
                    <!-- 计划选择: -->
                    <Select @on-change="setPlan" placeholder="--计划选择--" style="width:100%"  class="margin-bottom-10">
                        <Option v-for="item in plan" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                              
                <Col :xs="12" :md="2">
                    <Button icon="document-text"  @click="exportData()" style="float:right" class="margin-bottom-10">下载报表</Button>
                </Col>

            </Row>
        </div>    
        
        <Table :loading="loading" :columns="tableColumns" :data="list"  ref="tableCsv" size="small" :height="height"></Table>
        <div style="margin:10px 10px 0;overflow: hidden">
            <div style="float: right;">
                <Page size="small" :total="total_number" :page-size="page_size" :current="page" @on-change="changePage"></Page>
            </div>
        </div>       
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
            //searchTree 组件清除属性
            sclear:false,
            versionList:[
                {value: '', label:'全部'},
                {value: '2', label:'iOS'},
                {value: '3', label:'安卓'},
            ],
            tableColumns: [],
            //默认选项目
            checkAllGroup:['impression','click','install','install_per','reg_imei','reg_total','reg_per','reg_imei_cost','reg_cost','login','act_per','act_cost','pay_num','pay_total','pay_per','reg_arpu','pay_arpu','income_per','ltv'],
            current_account:'',
            current_version:'',
            current_time:[],
            current_page:'',
            current_campaigns:''
        }
    },
    computed :{ 
        list(){
            //this.loading = false;
            return this.$store.state.channel.list;
        },
        page(){
            return this.$store.state.channel.page;
        },
        page_size(){
            return this.$store.state.channel.page_size;
        },
        total_number(){
            return this.$store.state.channel.total_number;
        },
        total_page(){
            return this.$store.state.channel.total_page;
        },
        //媒体
        media(){
            return this.$store.state.channel.media;
        },
        //账号
        account(){
            return this.$store.state.channel.account
        },
        //计划
        plan(){
            return this.$store.state.channel.plan
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
        //导出表单
        exportData(){
            this.$refs.tableCsv.exportCsv({
                filename: '渠道媒体总览'
            });
        },
        //获取产品总览表格数据
        getTableData(){
            let param = { 
                    do : 'planOverview',
                    media_type : this.current_media,
                    os : this.current_version,
                    page : this.current_page,
                    account_id : this.current_account,
                    campaigns_id: this.current_campaigns
                };
            if(this.current_time.length > 0){
                param.tdate = this.current_time[0];
                param.tdate2 = this.current_time[1];
            }
            this.loading = true;
            this.$store.dispatch('getChannelData',param);
        },
        //下一页
        changePage(val){
            this.current_page = val;
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
            //获取所有计划
            let param = {
                MeidaType : this.current_media,
                account_id : data
            };
            console.log(' 获取所有计划 ')
            this.$store.dispatch('planCampaigns',param);
        },
        //选择媒体
        setMedia(data){            
            this.current_media = data;
            this.getTableData();
            //这里再获取账户
            this.$store.dispatch('getAccount',data);
        },
        //选择版本
        setVersion(data){
            this.current_version = data;
            this.getTableData();
        },
        //选择计划
        setPlan(data){
            this.current_campaigns = date;
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
                data : {title: '日期', key: 'date', "fixed": "left", sortable: true, "width": 120 }, 
                media_name : {title: '媒体', key: 'media_name', sortable: true,"width": 120 },    
                account_name :{title: '账号', key: 'account_name', sortable: true,"width": 150 },  
                campaign_id :{title: '计划', key: 'campaign_id', sortable: true,"width": 150 },                        
                cost : {title: '投入', key: 'cost', sortable: true, "width": 100 },
                impression : {title: '展示IP', key: 'impression', sortable: true, "width": 100 },
                click : {title: '点击IP', key: 'click', sortable: true, "width": 150 },
                click_per : {title: '点击率', key: 'click_per', sortable: true, "width": 100 },
                install : {title: '激活安装', key: 'install', sortable: true, "width": 120 },
                install_per : {title: '激活安装率', key: 'install_per', sortable: true, "width": 120 },
                reg_imei : {title: '注册设备数', key: 'reg_imei', sortable: true, "width": 120 },
                reg_total : {title: '注册', key: 'reg_total', sortable: true, "width": 100 },
                reg_per : {title: '注册率', key: 'reg_per', sortable: true, "width": 100 },
                reg_imei_cost : {title: '注册设备成本', key: 'reg_imei_cost', sortable: true, "width": 130 },
                reg_cost : {title: '注册成本', key: 'reg_cost', sortable: true, "width": 130 },
                login : {title: '次日活跃', key: 'login', sortable: true, "width": 120 },
                act_per : {title: '活跃率', key: 'act_per', sortable: true, "width": 120 },
                act_cost : {title: '活跃成本', key: 'act_cost', sortable: true, "width": 120 },
                pay_num : {title: '付费人数', key: 'pay_num', sortable: true, "width": 120 },
                pay_total : {title: '付费金额', key: 'pay_total', sortable: true, "width": 120 },
                pay_per : {title: '付费率', key: 'pay_per', sortable: true, "width": 100 },
                reg_arpu : {title: '注册ARPU', key: 'reg_arpu', sortable: true, "width": 120 },
                pay_arpu : {title: '付费ARPU', key: 'pay_arpu', sortable: true, "width": 120 },
                income_per : {title: '回本率', key: 'income_per', sortable: true, "width": 100 },
                ltv : {title: 'LTV', key: 'ltv', sortable: true, "width": 80 }, 
            };            
            //固定选项
            let data = [
                tableColumnList.media_name,
                tableColumnList.data,   
                tableColumnList.account_name,
                tableColumnList.campaign_id,          
                tableColumnList.click_per,
                tableColumnList.cost,
            ];
            this.checkAllGroup.forEach( col => data.push(tableColumnList[col]) );            
            return data;
        },
        changeTableColumns(){
            this.tableColumns = this.getTableColumns();
        }
    },
    mounted(){        
        this.changeTableColumns();
        this.height = document.body.clientHeight - 225;
        //是否点击过来的
        let query = this.$route.query.account_id;
        if(!!query){
            this.current_account = query.toString();
        }
        this.getTableData();
        this.mediaItem();    

    }
}
</script>