<style scoped>
.info{padding-left: 5px;}
.info span{display: inline-block; margin-right: 25px;}
.budget{display: inline-block; color: #666;}
.budget:hover{color:#2d8cf0}
</style>
<template>
	<Card shadow>
        <Row>
            <Col span="19">
                <div class="info">
                    <span><b>账户ID:</b> {{id}}</span>
                    <span><b>账户状态:</b> {{state}}</span>
                    <span><b>余额:</b> {{balance}}元</span>
                    <span><b>每日预算:</b><a href="javascript:;" class="budget" @click="setBudget"> {{budget}}元 <Icon type="edit"></Icon></a></span>
                </div>
            </Col>
            <Col span="5" style="text-align: right;">
                
            </Col>
        </Row>
    </Card>
</template>
<script>
    import  Axios  from "@/api/index"
	export default {
        name: 'searchTree',        
		data() {
			return {
                account_id: '207326436',
                id:'',
                state:'',
                balance:0,
                budget:0,
			}
        },
		methods: {
            getInfo(){
                Axios.post('api.php',{'action':'ucAdPut','opt':'getAccount','account_id':this.account_id})
                .then( 
                    res=>{ 
                        if(res.ret == '1'){
                            console.log(res)
                            let data = res.data,
                                state = '';
                            switch (data.financeState) {
                                case '0': state = '正常状态'; break;
                                case '1': state = '预算撞线'; break;
                                case '2': state = '余额为0'; break;
                                case '3': state = '预算撞线/余额为0'; break;
                            };
                            this.id= data.account_id;
                            this.state= state;
                            this.balance = data.balance;
                            this.budget = data.budget;
                        }
                    }
                ).catch( 
                    err=>{ console.log(err) }
                );
            }, 
            //修改每日预算
            setBudget(){
                console.log('longs')
            }
        },
        beforeMount(){   
            this.getInfo();
        }
	}
</script>