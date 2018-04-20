<style scoped>
.pt{font-size: 14px; margin-bottom: 5px;}
.plan_box{max-height: 400px; overflow-y: auto; border: 1px solid #eee;  padding: 0 10px;}
.ivu-checkbox-group-item{display: block; margin-top: 10px;}
.plan_name{width: 120px; text-align: center; max-width: 190px; overflow: hidden;text-overflow: ellipsis; white-space: nowrap; word-wrap: normal;word-wrap: break-word;word-break: break-all;}
.search{margin-bottom: 10px;}
</style>
<template>
	<div class="plan">
        <Button :loading="loading" @click="setPlan" class="plan_name">{{ts}}</Button>
        <Modal v-model="planModel" title="选择计划" @on-ok="setPlanOK">
            <div class="search">
                <Input v-model="search" placeholder="请输入要搜索的计划..." @on-enter="getSearch">
                    <Button slot="append" icon="ios-search"  @click="getSearch"></Button>
                </Input>
            </div>
            <div class="pt">
                全部计划
                <Checkbox style="float:right" @on-change="planAll">全选</Checkbox>
            </div>
            <div class="plan_box">
                <Checkbox-group v-model="selePlan">
                    <Checkbox v-for="item in planList" :label="item.campaign_id" :key="item.campaign_id">{{ item.campaign_name }}</Checkbox>
                </Checkbox-group>
            </div>
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
                search:'',
                allPlan:[],
                //获取全部计划
                planList:[],
                selePlan:[],
                ts:'全部推广计划'
			};
		},
		methods: {		
			setPlan(){
                this.loading = true;
                //获取计划名称
                Axios.post('api.php',{action:'ucAdPut',opt:'getCampaignNameList'}).then(
					res => {
						if(res.ret == 1) {
                            console.log(res)
                            this.loading = false;
                            this.planModel = true;
                            this.planList = this.allPlan = res.data;
						}
					}
                ).catch(err => {console.log(err)});
            },
            planAll(val){                
                if(val){
                    let s = [];
                    this.allPlan.forEach(val=>{
                        s.push(val.campaign_id)
                    })
                    this.selePlan = s;
                }else{
                    this.selePlan = [];
                }
            },
            setPlanOK(){
                let name = '',
                    all = this.allPlan,
                    selePlan = this.selePlan;
                selePlan.forEach(v=>{
                    for(let x in all){
                        if(all[x].campaign_id == v){
                            name += all[x].campaign_name + ','
                            return
                        }
                    }
                });
                this.ts = name;
                this.$emit('on-change', this.selePlan);
            },
            //搜索
            getSearch(){
                if(this.search ==''){
                    return;
                }
                let list = this.allPlan,
                    filter = [],
                    text = new RegExp("" + this.search + "", "gmi");
                list.forEach( (v,i) =>{     
                    if(v.campaign_name.search(text) != -1){
                        filter.push(v)
                    } 
                });
                this.planList = filter;
            }
		}
	};
</script>