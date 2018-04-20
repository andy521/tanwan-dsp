<style scoped>
.pt{font-size: 14px; margin-bottom: 5px;}
.list{max-height: 400px; overflow-y: auto; border: 1px solid #eee;  padding: 0 10px;}
.ivu-checkbox-group-item{display: block; margin-top: 10px;}
.btn_name{min-width: 120px; text-align: center; max-width: 300px; overflow: hidden;text-overflow: ellipsis; white-space: nowrap; word-wrap: normal;word-wrap: break-word;word-break: break-all;}
.search{margin-bottom: 10px;}
</style>
<template>
    <div class="account">
        <Button :loading="loading" @click="getAccountStart" class="btn_name">{{ts}}</Button>
        <Modal v-model="isModal" title="选择账户" @on-ok="modalOk">
            <div class="search">
                <Input v-model="search" placeholder="请输入要搜索的账户..." @on-enter="getSearch">
                    <Button slot="append" icon="ios-search"  @click="getSearch"></Button>
                </Input>
            </div>
            <div class="pt">
                全部账户
                <Checkbox style="float:right" @on-change="seleAll">全选</Checkbox>
            </div>
            <div class="list">
                <Checkbox-group v-model="seleAccount">
                    <Checkbox v-for="(item,index) in accountList" :label="item.account_id" :key="index">{{ item.account_name }}</Checkbox>
                </Checkbox-group>
            </div>
        </Modal>
    </div>
</template>
<script>
    import  Axios  from "@/api/index"
	export default {
        name: 'getAccount',
        props:{ 
            visible:{
                type: Boolean,
                default: false
            }
        },   
		data() {
			return {
                isModal:false,
                search:'',
                loading:false,
                allAccount:[],
                accountList:[],
                seleAccount:[],
                ts:'请选择用户',
			}
        },
		methods: {
            //获取关联账号列表            
            getAccount(){
                this.loading= true;
                Axios.get('api.php',{'action':'api','opt':'getAccount'})
                .then( 
                    res=>{ 
                        if(res.ret == '1'){
                            this.loading= false;
                            this.isModal = true;
                            this.allAccount = this.accountList = res.data;
                        }
                    }
                ).catch( 
                    err=>{ console.log(err) }
                );
            },
            seleAll(val){
                if(val){
                    let s = [];
                    this.allAccount.forEach(val=>{
                        s.push(val.account_id)
                    })
                    this.seleAccount = s;
                }else{
                    this.seleAccount = [];
                }``
            },
            getAccountStart(){
                this.getAccount()
            },
            getSearch(){
                if(this.search ==''){
                    this.accountList = this.allAccount;
                    return;
                }
                let list = this.allAccount,
                    filter = [],
                    text = new RegExp("" + this.search + "", "gmi");
                list.forEach( (v,i) =>{     
                    if(v.account_name.search(text) != -1){
                        filter.push(v)
                    } 
                });
                this.accountList = filter;
            },
            modalOk(){
                if(!this.seleAccount.length){
                    this.$Message.info('没有选择任何账户!');
                    return
                }                
                let ids = this.seleAccount,
                    all = this.allAccount,
                    name = '';
                ids.forEach(v=>{
                    for(let x in all){
                        if(all[x].account_id == v){
                            name += all[x].account_name + '-'
                            return
                        }
                    }
                });
                this.ts = name;
                this.$emit('on-change', ids);   
            }
        },
        beforeMount(){
            if(this.visible){
                this.isModal = true;
                this.getAccount()
            };
        }
	}
</script>