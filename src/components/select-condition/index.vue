<style>
.set-account .ivu-poptip-body{
    padding: 10px;    
}
.set-account,.set-account .ivu-poptip,.set-account .ivu-poptip-rel{
    display: block;
}
.set-account .api{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}
.set-account .account-list{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    height: 180px;
    overflow-y: scroll;
    min-width: 120px;
}
.set-account .account-list li{
    margin: 0;
    line-height: normal;
    padding: 7px 25px 7px 15px;
    clear: both;
    color: #495060;
    font-size: 12px!important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    transition: background .2s ease-in-out;
    position: relative;
}
.set-account .account-list li:hover{
    background: #f3f3f3;
}
.set-account .account-list .ivu-icon{
    font-size: 12px;
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -6px;
}
.set-account .account-list li.acitve{
    color: #fff;
    background: rgba(51,153,255,.9);
}
</style>
<template>
<div class="set-account" >
    <Poptip placement="bottom-start">
        <Input v-model="value" placeholder="请选择账户"></Input>
        <div class="api" slot="content">
            <ul class="account-list">
                <li v-for="item in media" @click="getAccount(item.MeidaType)" :key="this">{{ item.name }}<Icon type="ios-arrow-right"></Icon></li>
            </ul>
            <ul v-show="isAccout" class="account-list">
                <li v-for="item in accout" @click="setAccount(item.account_id)" :class="[item.account_id == account_id? 'acitve' : '']" :key="this">{{ item.account_name }}</li>
            </ul>
        </div>
    </Poptip>
</div>
</template>
<script>
    import  Axios  from "@/api/index"
	export default {
        name: 'selectCondition',
        props:{
            level: {
                type: [Number, String]
            },
        },
		data() {
			return {
                value:'',
                media: [],
                accout:[],
                isAccout:false,
                account_id:0,

			}
        },
		methods: { 
            getMedia(){
                Axios.get('api.php',{'action':'api','opt':'getMedia'})
                .then( 
                    res=>{ 
                        if(res.ret == '1'){
                            let list = res.data;     
                            this.media= list;
                        }
                    }
                ).catch( 
                    err=>{ console.log(err) }
                );
            },
            getAccount(data){
                console.log(data)
                Axios.get('api.php',{'action':'api','opt':'getAccount','MeidaType': data }).then( 
                    res=>{
                        if(res.ret == '1'){
                            let list = res.data;     
                            this.accout = list;
                            this.isAccout = true;
                        }
                    }
                ).catch( 
                    err=>{ console.log('获取媒体账号' + err) }
                );
            },
            setAccount(data){
                this.value = '账号：'+data;
                this.account_id = data;
                this.$emit('on-change', data);
            }
        },
        mounted(){       
            this.getMedia();
            console.log(this.level)
        }
	}
</script>