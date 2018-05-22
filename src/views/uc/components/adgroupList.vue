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
.ivu-checkbox-group-item{display: block; margin-top: 10px;}
.plan_name{width: 120px; text-align: center; max-width: 190px; overflow: hidden;text-overflow: ellipsis; white-space: nowrap; word-wrap: normal;word-wrap: break-word;word-break: break-all;}
</style>
<template>
	<div class="plan">
        <Button  @click="adgroupFun" class="plan_name">{{ts}}</Button>
        <div ref="poptip" class="poptip">
            <div v-if="isModal"  class="choose">
                <Checkbox @on-change="seleAll">全选</Checkbox>
                <Button @click="handleOk" type="primary">确定</Button>
            </div>
            <div ref="plane" v-if="isModal" class="content">
                <Checkbox-group v-model="seleAdgroup" class="select">
                    <Checkbox v-for="(item, index) in adgroupList" :label="item.adgroup_id" :key="index">{{ item.adgroup_name }}</Checkbox>
                </Checkbox-group>
            </div>
        </div>
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
                this.getPoptip().addEventListener('mouseleave', this.handleHide)
                this.isModal = true;
            },
            handleOk(){
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
                this.isModal = false
                this.ts = name.length > 0 ? name.substring(0, name.length - 1) : this.ts
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
            },
            getPoptip() {
                return this.$refs.poptip
            },
            handleHide() {
                this.isModal = false
            },
        },
        beforeDestroy() {
            this.getPoptip().removeEventListener('mouseleave', this.handleHide)
		}
	};
</script>