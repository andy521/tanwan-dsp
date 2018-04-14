<style scoped>
.pt{font-size: 14px; margin-bottom: 5px;}
.plan_box{height: 200px; overflow-y: auto; border: 1px solid #eee;  padding: 0 10px;}
.ivu-checkbox-group-item{display: block; margin-top: 10px;}
.plan_main{display: flex;}
.clist{width: 50%; padding: 0 10px;}
.name{max-width: 190px; overflow: hidden;text-overflow: ellipsis; white-space: nowrap; word-wrap: normal;word-wrap: break-word;word-break: break-all;}
</style>
<template>
	<div class="plan">
        <Button :loading="loading" @click="setPlan" class="name">{{ts}}</Button>
        <Modal v-model="planModel" title="选择计划" @on-ok="setPlanOK" @on-cancel=" planModel = false">
            <div class="plan_main">
                <div class="clist">
                    <div class="pt">
                        全部计划
                        <Checkbox style="float:right" @on-change="planAll">全选</Checkbox>
                    </div>
                    <div class="plan_box">
                        <Checkbox-group v-model="selePlan" @on-change="setUnite">
                            <Checkbox v-for="item in planList" :label="item.campaign_id" :key="item.campaign_id">{{ item.campaign_name }}</Checkbox>
                        </Checkbox-group>
                    </div>
                </div>
                <div class="clist">
                    <div class="pt">
                        全部单元
                        <Checkbox style="float:right" @on-change="unitAll">全选</Checkbox>
                    </div>
                    <div class="plan_box">
                        <Checkbox-group v-model="seleUnit">
                            <Checkbox v-for="(item,index) in adgroupList" :label="item.adgroup_id" :key="item.index">{{ item.adgroup_name }}</Checkbox>
                        </Checkbox-group>
                    </div>
                </div>
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
                planList:[],
                adgroupList:[],
                selePlan:[],
                seleUnit:[],
                ts:'请选择计划'
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
                            this.planList = res.data;
						}
					}
                ).catch(err => {console.log(err)});
                this.setUnite();
            },
            setUnite(){
                console.log('aaa')
                Axios.post('api.php',{action:'ucAdPut',opt:'getAdgroupNameList',campaign_id:'['+this.selePlan+']'}).then(
					res => {
						if(res.ret == 1) {
                            console.log(res)
                            this.adgroupList = res.data;
						}
					}
                ).catch(err => {console.log(err)});
            },
            setPlanOK(){
                if(this.seleUnit.length == '0'){
                    this.$Message.info('请勾选推广单元');
                    this.ts = '全部推广计划';
                    return;
                }
                let name = '',list = this.adgroupList;
                this.seleUnit.forEach(item=>{   
                    for(let x in list){
                        if(list[x].adgroup_id == item){
                            name += list[x].adgroup_name + ','
                            return
                        }
                    }
                })
                this.ts = name;
                this.$emit('on-change', this.seleUnit);
            },
            planAll(val){                
                if(val){
                    let s = [];
                    this.planList.forEach(val=>{
                        s.push(val.campaign_id)
                    })
                    this.selePlan = s;
                }else{
                    this.selePlan = [];
                }
            },
            unitAll(val){
                if(val){
                    let s = [];
                    this.adgroupList.forEach(val=>{
                        s.push(val.adgroup_id)
                    })
                    this.seleUnit = s;
                }else{
                    this.seleUnit = [];
                }
            }
		}
	};
</script>