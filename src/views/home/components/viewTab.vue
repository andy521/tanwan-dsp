<template>
    <Card dis-hover shadow class="margin-top-10"> 
        <Tabs @on-click="tabChange" :animated="false">
            <TabPane label="按账户查看">
                <Table height="390" :columns="tcolumns" :data="accountTable" ref="tableAccount" ></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page size="small" :total="aPage.total_number" :page-size="aPage.page_size" :current="aPage.page" @on-change="changePage"></Page>
                    </div>
                </div>
            </TabPane>
            <TabPane label="按负责人查看">
                <Table height="390" :columns="tcolumns" :data="principalTable" ref="tablePrincipal" ></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page size="small" :total="pPage.total_number" :page-size="pPage.page_size" :current="pPage.page" @on-change="changePage"></Page>
                    </div>
                </div>
            </TabPane>                        
            <Select placeholder="按媒体筛选" :clearable="true" @on-change="mediaChange" v-model="selectState" style="width:120px" slot="extra" class="margin-right-10">
                <Option v-for="item in mediaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <DatePicker slot="extra" type="date" placeholder="自定义时间" @on-change="changeTime" v-model="dateState" style="width: 190px"  class="margin-right-10"></DatePicker>
            <Button icon="document-text" @click="exportData()" slot="extra">下载报表</Button>
        </Tabs>      
    </Card>    
</template>
<script>
    import util from '@/utils/index';
    
    export default {
        name: 'viewTab',
        props: {
            account :{
                page : Number,
                total:Number,
                page_size : Number,
                total_number : Number,
                list : Object,
            },
            principal:{
                page : Number,
                total:Number,
                page_size : Number,
                total_number : Number,
                list : Object
            },
            media : Array,
            // tableData:{},
            // page : Number, //当前页码，支持 .sync 修饰符
            // pageSize : Number, //每页条数
            // total : Number, //数据总数
        },
        data () {
            return {
                mediaList :[],
                tab:0,
                selectState:'',
                dateState:'',
                isTab:true,
                aPage:{
                    page:0,
                    total:0,
                    page_size:0,
                    total_number:0
                },
                pPage:{
                    page:0,
                    total:0,
                    page_size:0,
                    total_number:0
                },
                tcolumns: [
                    //{type: 'selection',width: 60,align: 'center'},
                    {
                        title: '媒体',
                        key: 'media_name',
                    },
                    {title: '账户名', key: 'account_name'},
                    {title: '展现(暴光)', key: 'impression',sortable: true},
                    {title: '点击数', key: 'click',sortable: true},
                    {
                        title: '推广余额', 
                        key: 'balance',
                        sortable: true,
                        render: (h, params) => {
                            const text = params.row.balance;
                            const color = text <2000 ? 'red' : 'default';      
                            return h('Tag', {
                                props: {
                                    type : 'border',
                                    color: color
                                }
                            }, text)
                        }
                    },
                    {title: '消耗', key: 'cost',sortable: true},
                    {title: '注册', key: 'activation',sortable: true},
                    {title: '注册成本', key: 'reg_cost',sortable: true},
                    {title: '账户ID', key: 'id'},
                    {title: '备注', key: 'date'},
                ],
                accountTable : [],
                principalTable : [],
            }
        },
        watch: {  
            account (data) {     
                //console.log(data)
                this.aPage = { page:data.page,  page_size:data.page_size, total:data.total, total_number : data.total_number}
                this.accountTable = data.list;
            },
            principal(data){
                this.pPage = { page:data.page,  page_size:data.page_size, total:data.total, total_number : data.total_number}
                this.principalTable = data.list   
            },
            media(data){
                this.mediaList = util.mediaSelect(data);
                // console.log(typeof this.mediaList)
            }
        },
        methods : {
            //导出表单
            exportData(){
                if(!this.tab){
                    this.$refs.tableAccount.exportCsv({filename: '按账户查看'});
                }else{
                    this.$refs.tablePrincipal.exportCsv({filename: '按负责人查看'});
                }                
            }, 
            //分页
            changePage(val){
                let param = {page:val};
                if(!!this.tab){
                    this.$store.dispatch('getPrincipal', param);
                }else{
                    this.$store.dispatch('getOverview', param);
                }
            },            
            //筛选时间      
            changeTime(val){
                let param = {
                    'teme' : val,
                    'tab' : this.tab
                }
                this.$store.dispatch('filterTime',param);
            },
            //按媒体筛选
            mediaChange(val){
                this.$store.dispatch('filterMedia', val );
            },
            //按账户查看 - 按负责人查看
            tabChange(val){
                this.selectState = '';
                this.dateState = '';
                this.tab = val;
                if(!!this.tab){
                    this.$store.dispatch('getPrincipal');
                }else{
                    this.$store.dispatch('getOverview');
                }
            },
            //获取筛选媒体
            getMedia(){
                this.$store.dispatch('getMedia');
            }
        },
        mounted () {
            this.getMedia();
	    }
    }
</script>
<style>
    .ivu-tag-border,.ivu-tag-border.ivu-tag-red{border: none!important;background:transparent!important;}
</style>