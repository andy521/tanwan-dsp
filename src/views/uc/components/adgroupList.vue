<style scoped>
.pt{font-size: 14px; margin-bottom: 5px;}
.plan_box{max-height: 400px; overflow-y: auto; border: 1px solid #eee;  padding: 0 10px;}
.ivu-checkbox-group-item{display: block; margin-top: 10px;}
.plan_name{width: 120px; text-align: center; max-width: 190px; overflow: hidden;text-overflow: ellipsis; white-space: nowrap; word-wrap: normal;word-wrap: break-word;word-break: break-all;}
.search{margin-bottom: 10px;}
</style>
<template>
	<div class="plan">
        <Button  @click="adgroupFun" class="plan_name">{{ts}}</Button>
        <Modal v-model="isModal" title="选择计划" @on-ok="modalOk">
            <div class="search">
                <Input v-model="search" placeholder="请输入要搜索的计划..." @on-enter="getSearch">
                    <Button slot="append" icon="ios-search"  @click="getSearch"></Button>
                </Input>
            </div>
            <div class="pt">
                全部单元
                <Checkbox style="float:right" @on-change="seleAll">全选</Checkbox>
            </div>
            <div class="plan_box">
                <Checkbox-group v-model="seleAdgroup">
                    <Checkbox v-for="item in adgroupList" :label="item.adgroup_id" :key="item.adgroup_id">{{ item.adgroup_name }}</Checkbox>
                </Checkbox-group>
            </div>
        </Modal>
	</div>
</template>

<script>  
    import Axios from "@/api/index";  
	export default {
        props:{            
            adgroup: {
                type:Array,
                default: []
            }
        },
		data() {
			return {
                isModal:false,
                search:'',
                allAdgroup:[],
                //全部推广单元
                adgroupList:[],
                seleAdgroup:[],
                ts:'全部推广单元'
			};
        },
        watch:{
            adgroup(val){
                this.adgroupList = this.allAdgroup = val;
                this.seleAdgroup = [];
                this.ts = '全部推广单元';
            }
        },
		methods: {		
			adgroupFun(){
                if(!this.adgroup.length){
                    this.$Message.info('请先选择计划');
                    return
                }
                this.isModal = true;
            },
            modalOk(){
                if(!this.seleAdgroup.length){
                    this.$Message.info('没有选择任何');
                    return
                }                
                let ids = this.seleAdgroup,
                    all = this.allAdgroup,
                    name = '';
                ids.forEach(v=>{
                    for(let x in all){
                        if(all[x].adgroup_id == v){
                            name += all[x].adgroup_name + ','
                            return
                        }
                    }
                });
                this.ts = name;
                this.$emit('on-change', ids);
            },
            seleAll(val){
                if(val){
                    let s = [];
                    this.allAdgroup.forEach(val=>{
                        s.push(val.adgroup_id)
                    })
                    this.seleAdgroup = s;
                }else{
                    this.seleAdgroup = [];
                }
            },
            getSearch(){
                if(this.search ==''){
                    return;
                }
                let list = this.allAdgroup,
                    filter = [],
                    text = new RegExp("" + this.search + "", "gmi");
                list.forEach( (v,i) =>{     
                    if(v.adgroup_name.search(text) != -1){
                        filter.push(v)
                    } 
                });
                this.adgroupList = filter;
            }            
		}
	};
</script>