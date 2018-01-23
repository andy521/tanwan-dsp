<template>
    <Card dis-hover shadow class="margin-top-10"> 
        <Tabs :animated="false">
            <TabPane label="按账户查看">            
                <Table height="390" :columns="tcolumns" :data="tdata" size="small"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page size="small" :total="total" :page-size="pageSize" :current="page" @on-change="changePage"></Page>
                    </div>
                </div>

            </TabPane>
            <TabPane label="按产品查看">按产品查看</TabPane>
        </Tabs>
    </Card>    
</template>
<script>
    export default {
        name: 'viewTab',
        props: {
            tableData:{},
            page : Number,
            pageSize : Number,
            total : Number,
        },
        data () {
            return {
                tcolumns: [
                    {title: '媒体',key: 'media_name'},
                    {title: '账户名', key: 'account_name'},
                    {title: '展现(暴光)', key: 'impression',sortable: true},
                    {title: '点击数', key: 'click',sortable: true},
                    {
                        title: '推广余额', 
                        key: 'balance',
                                          
                    },
                    {title: '消耗', key: 'reg_cost',sortable: true},
                    {title: '注册', key: 'activation',sortable: true},
                    {title: '注册成本', key: 'date',sortable: true},
                    {title: '账户ID', key: 'id'},
                    //{title: '备注', key: 'date '},
                ],
                tdata: []
            }
        },
        watch: {
            tableData (val) {                
                this.tdata = val
            }
        },
        methods : {
            changePage(val){
                console.log(val)
                this.$store.dispatch('getNextPage',val);
            }
        }
    }
</script>