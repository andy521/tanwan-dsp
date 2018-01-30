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
            tableColumns: [
                {title: '日期', key: 'date', "fixed": "left", "width": 120 },
                {title: '广告位', key: 'site_id', "width": 100 },
                {title: '计划', key: 'campaign_id', "width": 100 },
                {title: '账号', key: 'account_name', "width": 140 },
                {title: '花费', key: 'cost', "width": 140 },
                {title: '点击IP', key: 'click', "width": 140 },
                {title: '点击率', key: 'click_cost', "width": 80 },
                {title: '激活安装', key: 'active', "width": 120 },
                {title: '注册', key: 'reg_total', "width": 120 },
                {title: '注册率', key: 'reg_per', "width": 120 },
                {title: '注册成本', key: 'reg_cost', "width": 120 },
                {title: '次日活跃', key: 'login', "width": 120 },
                {title: '活跃成本', key: 'login_cost', "width": 120 },
                {title: '付费人数', key: 'pay_num', "width": 120 },
            ],
            checkAllGroup:[]
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
        getIndex(index){
            console.log(index)
        }
    },
    mounted(){
        this.height = document.body.clientHeight - 225;
        this.init();  
        this.gameItem();
        this.mediaItem();
    }
}
</script>