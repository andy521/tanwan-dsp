<style scoped>
.account{height: 32px; position: relative;}
.account_btn{
    background-color: #fff; 
    border-radius: 4px; 
    border: 1px solid #dddee1; 
    cursor: pointer; 
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 32px;
    z-index: 999;
}
</style>
<template>
    <div class="account">
        <Button v-show="show" :loading="loading" type="ghost" class="account_btn" @click="getAccountStart">请选择用户</Button>
        <Select @on-change="accountChange">
            <Option v-for="(item,index) in accountList" :value="item.account_id" :key="index">{{ item.account_name }}</Option>
        </Select> 
    </div>
</template>
<script>
    import  Axios  from "@/api/index"
	export default {
        name: 'getAccount',
        props:{
            title:{
                type:String,
                default:''
            }
        },   
		data() {
			return {
                show:true,
                loading:false,
				accountList: [],
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
                            this.show = false;
                            this.accountList = res.data;
                            console.log(res)
                        }
                    }
                ).catch( 
                    err=>{ console.log(err) }
                );
            },
            accountChange(val){
                //this.$store.dispatch("setAccount", val);
                if(val == ''){
                    return
                };                
                let data = {
                    id:val
                }
                this.accountList.forEach(e=>{
                    if(e.account_id == val){
                        data.name = e.account_name;
                    }
                })
                this.$emit('on-change', data);
            },
            getAccountStart(){
                this.getAccount()
            }
        },
	}
</script>