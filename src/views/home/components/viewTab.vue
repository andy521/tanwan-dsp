<style>
    .ivu-tag-border,.ivu-tag-border.ivu-tag-red{border: none!important;background:transparent!important;}
    .tab{
        border-bottom: 1px solid #dddee1; 
        margin-bottom: 16px;
        height: 38px;
        line-height: 38px;
        position: relative;
    }
    .tab-item li{
        float: left;
        padding: 0 15px;
        margin-right: 16px;
        position: relative;
        cursor: pointer;
    }
    .tab-item li::after{
        content: "";
        position: absolute;
        bottom: 0;
        display: block;
        height: 2px;
        width: 100%;
        left: 0;
        background-color:transparent;
    }   
    .tab-item li.cur{
        color: #2d8cf0;
    }
    .tab-item li.cur::after{
        background-color: #2d8cf0;
    }
    .tr{
        float: right;
        margin-top: -5px;
    }
</style>
<template>
    <Card dis-hover shadow class="margin-top-10"> 
        <div class="tab">
            <ul class="tab-item">
                <li  v-for="(item,index) in tab" :class="{cur:index == num }" @click="tabsChange(index)">{{item}}</li>
            </ul>            
            <div class="tr">

                <Select @on-change="mediaChange" v-model="selectState"  placeholder="按媒体筛选" style="width:120px" class="margin-right-10">
                    <Option v-for="item in mediaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <DatePicker type="date" placeholder="自定义时间" @on-change="changeTime" style="width: 190px"  class="margin-right-10"></DatePicker>
                <Button icon="document-text" @click="exportData()">下载报表</Button>
            </div>
        </div>
        
        <Table height="390" :columns="tcolumns" :data="data.list" ref="TableExport" @on-sort-change="sortChange"></Table>

        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page size="small" :total="data.total_number" :page-size="data.page_size" :current="data.page" @on-change="changePage"></Page>
            </div>
        </div>
    </Card>    
</template>
<script>
    import util from '@/utils/index';
    
    export default {
        name: 'viewTab',
        props: {
            media : Array,
            data:Object,
        },
        data () {
            return {
                tab:['按账户查看','按负责人查看'],
                num:0,
                selectState:[],
                mediaList:[],
                //负责人
                group:'',
                //媒体型
                media_type:'',
                //按时间
                time:'',
                page :'',
                //排序
                orderField:'',
                orderDirection: 'SORT_ASC',
                tcolumns: [
                    {
                        title: '媒体',
                        key: 'media_name',
                    },
                    {title: '账户名', key: 'account_name'},
                    {title: '展现(暴光)', key: 'impression',sortable: 'custom',},
                    {title: '点击数', key: 'click',sortable: 'custom',},
                    {
                        title: '推广余额', 
                        key: 'balance',
                        sortable: 'custom',
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
                    {title: '消耗', key: 'cost',sortable: 'custom',},
                    {title: '注册', key: 'activation',sortable: 'custom',},
                    {title: '注册成本', key: 'reg_cost',sortable: 'custom',},
                    {title: '账户ID', key: 'id'},
                    {title: '备注', key: 'date'},
                ],
            }
        },
        watch: {  
            media(data){
                this.mediaList = util.mediaSelect(data);
            }
        },
        methods : {
            //这里的排序没有做哈哈哈
            tableData(){
                let param = {
                    group_by: this.group,
                    media_type : this.media_type,
                    time:this.time,
                    page:this.page,
                    orderField: this.orderField, 
					orderDirection: this.orderDirection //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                };
                this.$store.dispatch('getOverview', param );
            },
            //Tab
            tabsChange(index){
                this.num = index;
                if(!!index){
                    this.group = 'author';
                    this.tableData(); 
                }else{
                    this.$store.dispatch('getOverview');
                }                
            },
            //分页
            changePage(val){
                this.page = val;
                this.tableData();
            }, 
            //按时间
            changeTime(val){
                this.time = val;
                this.tableData();
            },
            //导出表单
            exportData(){
                if(!this.tab){
                    this.$refs.TableExport.exportCsv({filename: '按账户查看'});
                }else{
                    this.$refs.TableExport.exportCsv({filename: '按负责人查看'});
                }                
            }, 
            //按媒体筛选
            mediaChange(val){
                this.media_type = val;
                this.tableData();
            },            
            //获取筛选媒体
            getMedia(){
                this.$store.dispatch('getMedia');
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
                this.tableData();       
            },
        },
        mounted () {
            this.getMedia();
	    }
    }
</script>
