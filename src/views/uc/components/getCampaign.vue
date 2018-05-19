<style lang="less" scoped>
.plan{
    position: relative;
    display: inline-block;
    .choose {
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
        padding: 10px;
        min-width: 250px;
        border-left: 1px solid #eee; 
        border-right: 1px solid #eee; 
        z-index: 11000;
    }
    .content{
        display: inherit;
        position: absolute;
        left: 0;
        top: 50px;
        padding: 0 10px;
        max-width: 300px;
        min-width: 250px;
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid #eee;
        font-size: 14px; 
        background-color: #fff;
        z-index: 10000;
        .select{z-index: 10001;}
    }
}
.poptip{padding:10px}
.plan_name{width: 120px; text-align: center; max-width: 190px; overflow: hidden;text-overflow: ellipsis; white-space: nowrap; word-wrap: normal;word-wrap: break-word;word-break: break-all;}
.ivu-checkbox-group-item{display: block; margin-top: 10px;}
</style>
<template>
	<div class="plan">
        <Button :loading="loading" @click="setPlan" class="plan_name">{{ts}}</Button>
        <div ref="poptip" class="poptip">
            <div v-if="planModel"  class="choose">
                <Checkbox @on-change="planAll">全选</Checkbox>
                <Button @click="handleOk" type="primary">确定</Button>
            </div>
            <div ref="plane" v-if="planModel" class="content">
                <Checkbox-group v-model="selePlan" class="select">
                    <Checkbox v-for="(item, index) in planList" :label="item.campaign_id" :key="index">{{ item.campaign_name }}</Checkbox>
                </Checkbox-group>
            </div>
        </div>
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
                            this.getPoptip().addEventListener('mouseleave', this.handleHide)
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
            handleOk(){
                if(!this.selePlan.length){
                    this.$Message.info('没有选择任何');
                    return
                }  
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
                this.ts = name.length > 0 ? name.substring(0, name.length - 1) : this.ts
                this.planModel = false;
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
            },
            getPoptip() {
                return this.$refs.poptip
            },
            handleHide() {
                this.planModel = false
            },
        },
        beforeDestroy() {
            this.getPoptip().removeEventListener('mouseleave', this.handleHide)
        }
	};
</script>