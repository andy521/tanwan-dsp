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
        <Modal v-model="isModal" title="选择创意" @on-ok="modalOk">
            <div class="search">
                <Input v-model="search" placeholder="请输入要搜索的创意..." @on-enter="getSearch">
                    <Button slot="append" icon="ios-search"  @click="getSearch"></Button>
                </Input>
            </div>
            <div class="pt">
                选择创意
            </div>
            <div class="plan_box">
                <RadioGroup v-model="seleCreative" vertical>
                    <Radio v-for="(item, index) in creativeList" :label="item.creative_id" :key="index">{{ JSON.parse(item.content).title }}</Radio>
                </RadioGroup>
            </div>
        </Modal>
	</div>
</template>

<script>  
    import Axios from "@/api/index";  
	export default {
        props:{            
            creative: {
                type:Array,
                default: []
            }
        },
		data() {
			return {
                isModal:false,
                search:'',
                //全部推广创意
                creativeList:[],
                seleCreative: '',
                ts:'选择推广创意'
			};
        },
        watch:{
            creative(val){
                this.creativeList = val;
                this.seleCreative = '';
                this.ts = '全部推广创意';
            }
        },
        mounted() {
            this.creativeList = this.creative;
        },
		methods: {		
			adgroupFun(){
                if(!this.creative.length){
                    this.$Message.info('请先选择单元');
                    return
                }
                this.isModal = true;
            },
            modalOk(){
                if(!this.seleCreative.length){
                    this.$Message.info('没有选择任何');
                    return
                }
                let id = this.seleCreative;
                let creativeList = this.creativeList;
                creativeList.forEach(v=>{
                    if (id === v.creative_id) {
                        let content = JSON.parse(v.content);
                        this.ts = content.title
                    }
                });
                this.$emit('on-change', id);
            },
            getSearch(){
                if(this.search ==''){
                    return;
                }
                let list = this.creativeList,
                    currName = '',
                    filter = [],
                    text = new RegExp("" + this.search + "", "gmi");
                list.forEach( (v,i) =>{
                    currName = JSON.parse(v.content).title
                    if(currName.search(text) != -1){
                        filter.push(v)
                    } 
                });
                this.creativeList = filter;
            }            
		}
	};
</script>