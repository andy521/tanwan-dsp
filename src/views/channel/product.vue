<style lang="less">
    @import "../../styles/common.less";
    @import '../../styles/table.less';
    .head{border-bottom: 1px solid #e9eaec; margin-bottom: 10px; padding: 0;}  
</style>
<template>
    <Card dis-hover shadow>
        <div class="head">
            <Row :gutter="10">

                <Col :xs="12" :md="5">
                   <search-tree :game="game" @on-change="getids"></search-tree>
                </Col>

                <Col :xs="12" :md="4">
                    <!-- 媒体选择: -->
                    <Select @on-change="setMedia" placeholder="--全部媒体--" style="width:100%"  class="margin-bottom-10">
                        <Option v-for="item in media" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>

                <Col :xs="12" :md="2">
                    <!-- 版本: -->
                    <Select  @on-change="setVersion" placeholder="--全部版本--"  class="margin-bottom-10">
                        <Option v-for="item in versionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>                                      
                </Col> 

                <Col :xs="1" :md="2">
                    <diy-index @on-change="getIndex"  class="margin-bottom-10"></diy-index> 
                </Col>               

                <Col :xs="8" :md="3" offset="6">
                    <DatePicker  @on-change="changeDate" type="daterange" placement="bottom-end" placeholder="自定义时间" style="width: 100%"  class="margin-bottom-10"></DatePicker>
                </Col>
                
                <Col :xs="12" :md="2">
                    <Button icon="document-text"  @click="exportData()" style="float:right" class="margin-bottom-10">下载报表</Button>
                </Col>

            </Row>
        </div>    
        
        <Table :columns="tableColumns" :data="list"  ref="tableCsv" size="small" :height="height"></Table>
        <div style="margin:10px 10px 0;overflow: hidden">
            <div style="float: right;">
                <Page size="small" :total="total_page" :page-size="page_size" :current="page" @on-change="changePage"></Page>
            </div>
        </div>       
    </Card>
</template>
<script>
import searchTree from '@/components/select-tree/searchTree.vue';
import diyIndex from './components/diyIndex.vue';

export default {
    components: {
        searchTree,
        diyIndex
    },
    data () {
        return {
            height:700,
            versionList:[
                {value: ' ', label:'全部'},
                {value: 'ios', label:'iOS'},
                {value: 'andrio', label:'安卓'},
            ],
            tableColumns: [],
            //默认选项目
            checkAllGroup:['media_type','account_name','campaign_id','click_cost','site_id','impression','click',]
        }
    },
    computed :{ 
        list(){
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
        //所有游戏
        game(){
            return this.$store.state.channel.game;
        },
        //媒体
        media(){
            return this.$store.state.channel.media;
        }
    },
    methods : {
        //获取产品总览
        init(){
            let param = {'do':'adsOverview'}
            this.$store.dispatch('getProduct',param);
        },
        //获取所有游戏
        gameItem(){
            this.$store.dispatch('getGame');
        },
        //获取所以媒体
        mediaItem(){
            this.$store.dispatch('getMedia');
        },

        //导出表单
        exportData(){
            this.$refs.tableCsv.exportCsv({
                filename: '渠道产品总览'
            });
        },
        //跳转到第N页
        changePage(val){
            console.log(val)
        },
        //自定义时间
        changeDate(date){
            let param = {'do':'adsOverview','tdate':date[0],'tdate2':date[2]}
            this.$store.dispatch('getProduct',param);            
        },
        //获取选中的游戏id
        getids(gid){
            let id = gid.join(',').split(',');
            let param = {'game_id':id}
            this.$store.dispatch('getFilterProduct',param);
        },        
        //选择媒体
        setMedia(data){
            console.log(data)
        },
        //选择版本
        setVersion(data){
            console.log(data)
        },
        //获取 自定义指标
        getIndex(data){
            this.checkAllGroup = data;           
            this.tableColumns = this.getTableColumns();
        },
        //设置表格头部
        getTableColumns(){
            const tableColumnList = {
                data : {title: '日期', key: 'date', "fixed": "left", "width": 120 },
                media_type : {title: '媒体类型', key: 'media_type', "width": 100 },
                account_name : {title: '广告状态', key: 'account_name', "width": 150 },
                campaign_id : {title: '点击均价（cpc）', key: 'campaign_id', "width": 150 },
                click_cost : {title: '点击量', key: 'click_cost', "width": 100 },
                site_id : {title: '点击率(CTR)', key: 'site_id', "width": 150 },
                impression : {title: '到达数', key: 'impression', "width": 100 },
                click : {title: '点击率', key: 'click', "width": 100 },
                download : {title: '下载数', key: 'download', "width": 100 },
                cost : {title: '激活总量', key: 'cost', "width": 100 },
                reg_imei_cost : {title: '点击激活率', key: 'reg_imei_cost', "width": 100 },
                active : {title: '注册设备数', key: 'active', "width": 100 },
                reg_total : {title: '注册数', key: 'reg_total', "width": 100 },
                reg_per : {title: '点击注册率', key: 'reg_per', "width": 100 },
                reg_cost : {title: '注册成本', key: 'reg_cost', "width": 100 },
            };            
            //默认先项
            let data = [
                tableColumnList.data,
            ];

            this.checkAllGroup.forEach( col => data.push(tableColumnList[col]) )
            return data;
        },
        changeTableColumns(){
            this.tableColumns = this.getTableColumns();
        },
    },
    mounted(){
        this.changeTableColumns();
        this.height = document.body.clientHeight - 225;
        this.init();  
        this.gameItem();
        this.mediaItem();
    }
}

/*


http://ads.tanwan.com/api.php?do=adsOverview&action=api&opt=getGameTotalDay

//参数说明

id":"29",
"date":"2018-01-23",
"media_type":null,
"account_id":"3415636",
"account_name":"1517466390",
"author":"张建邦",
"game_id":"294",
"product_refs_id":"1303502887",
"agent_id":"100554",
"site_id":"147881",
"campaign_id":"9043944",
"adgroup_id":"44394835",
"impression":"50935",
"click":"136",
"cost":"960.73",
"download":"0",
"conversion":"0",
"activation":"4",
"campaign_name":"蓝月争霸-新闻组图-IOS-2",
"adgroup_name":"腾讯新闻2-230×152多图(文)-20180122",
"configured_status":"AD_STATUS_NORMAL",
"daily_budget":"4000000",
"media_name":"-张建邦",
"click_cost":0,
"active":0,
"reg_total":0,
"reg_per":"0%",
"reg_cost":0,
"reg_imei_cost":0,
"login":0,
"login_cost":0,
"pay_num":0,
"pay_total":0,
"pay_per":"0%",
"reg_arpu":0,
"income_per":0
*/

</script>