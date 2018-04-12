<style scoped>

</style>
<template>
	<div class="plan">
        <Button :loading="loading" @click="setPlan" icon="navicon">全部推广计划</Button>

        <Modal v-model="planModel" title="选择计划" @on-ok="setPlanOK" @on-cancel=" planModel = false">
            城标
        </Modal>

	</div>
</template>

<script>  
    import Axios from "@/api/index";  
	export default {
		data() {
			return {
                planModel:false,
                loading:false,
				planList:[],
			};
		},
		methods: {		
			setPlan(){
                this.loading = true;
                //获取计划名称
                Axios.post('api.php',{action:'ucAdPut',opt:'getCampaignNameList'}).then(
					res => {
						if(res.ret == 1) {
                            this.loading = false;
                            this.planModel = true;
                            this.planList = res.data;
                            console.log(res.data)
						}
					}
                ).catch(err => {console.log(err)});
            },
            setPlanOK(){

            }
		}
	};
</script>