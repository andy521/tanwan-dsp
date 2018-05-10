<style lang="less">
.bottom_line {
		border-bottom: 1px solid rgb(233, 233, 233);
		padding-bottom: 10px;
	}
	.ivu-poptip-body {
		white-space: normal;
		text-align: left;
		padding: 20px;
	}
	.checklist {
        padding-bottom: 5px;
        padding-top: 20px;
        color: #666;
        font-weight: bold;
	}
	
	.Poptiptap .ivu-poptip-body-content {
		overflow: inherit;
    }
    .foot{
        margin-top: 15px;
        text-align: center;
    }
</style>

<template>
	<div style="display: inline-block;">
		<Poptip ref="poptip" trigger="click" placement="bottom-end" width="500" class="Poptiptap">
			<Button type="primary" @click="handleShow">自定义指标</Button>
			<div class="api" slot="content">
				<div class="bottom_line">
					<Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
				</div>       
                         
				<div class="checklist">媒体列</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="paused">投放开关</Checkbox>
                    <Checkbox label="cpc">平均点击价格</Checkbox>
                    <Checkbox label="cpm">千次展现价格</Checkbox>
                    <Checkbox label="click">点击量</Checkbox>
                    <Checkbox label="ctr">点击率</Checkbox>
				</CheckboxGroup>

                <div class="checklist">落地页</div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="cost">展示PV</Checkbox> 
                    <Checkbox label="download_complete">下载数</Checkbox>
                    <Checkbox label="download_complete_rate">下载率</Checkbox> 
				</CheckboxGroup>
                <div class="checklist">激活注册</div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="cvr">点击激活率</Checkbox>
				</CheckboxGroup>

                <div class="checklist">其他</div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="state">推广状态</Checkbox>                 
                    <Checkbox label="adgroup_id">单元id</Checkbox>
                    <Checkbox label="impression">展现量</Checkbox>
                    <Checkbox label="adgroup_name">单元名称</Checkbox>
                    <Checkbox label="conversion">转化数</Checkbox>
                    <Checkbox label="cost_per_conversion">转化成本</Checkbox>
                   
				</CheckboxGroup>


                <div class="foot">
                    <Button type="success" @click="saveIndex">保存自定义指标</Button>   
                </div>
			</div>            
		</Poptip>
	</div>
</template>

<script>
    import Axios from "@/api/index";
	export default {
        props :{
            check: {
                type: Array,
                default: []
            }
        },
		data() {
			return {
                indeterminate: true,
                checkAll: false,
                checkAllGroup:this.userindex,
                action:'ucAdPut',
                opt:'searchCreatives'
			}
        },
        watch:{
            checkAllGroup(data){
                this.checkAllGroup = data;
                this.$emit('on-change', this.checkAllGroup);
            }
        },
        mounted(){
            let param = {action:'sys',opt:'get_user_memo',taction: this.action,topt: this.opt};            
            Axios.get('api.php',param).then( 
                res=>{
                    if(res.ret == 1) { 
                        if(res.data){
                            console.log(res.data)
                            this.checkAllGroup = res.data.split(',');
                            this.$emit('on-change', this.checkAllGroup);
                        }else{
                            this.checkAllGroup = this.check;
                        };
                    }
                }
            ).catch( 
                err=>{ console.log(err) }
            );
        },
		methods: {           
			//自定义指标全选
			handleCheckAll() {
                //console.log(this.checkAllGroup)
				if(this.indeterminate) {
					this.checkAll = false;
				} else {
					this.checkAll = !this.checkAll;
				}
                this.indeterminate = false;

				if(this.checkAll) {
                    this.checkAllGroup = ['paused','state','impression','click','adgroup_id',"ctr","cost","adgroup_name",'cvr','cost_per_conversion','cpc','cpm','download_complete','download_complete_rate','conversion']
				} else {
					this.checkAllGroup = [];
				}
				this.$emit('on-change', this.checkAllGroup);
            },
            //保存自定义指标
            saveIndex(){
                if(this.checkAllGroup.length == '0'){
                    this.$Message.info('至少您得选择一个自定义指标吧');
                    return;
                }
                let param = {action:'sys',opt:'set_user_memo',taction: this.action,topt: this.opt,memo:this.checkAllGroup.join(',')};            
                Axios.get('api.php',param).then( 
                    res=>{
                        if(res.ret == 1) {
                            const poptip = this.getPoptip().querySelector('.ivu-poptip-popper')
                            poptip.style.display = 'none'
                            this.$Message.info(res.data.data);
                            return;
                        }
                    }
                ).catch( 
                    err=>{ console.log(err) }
                );
            },
			//自定义指标
			checkAllGroupChange(data) {
                this.$emit('on-change', this.checkAllGroup);
				if(data.length === 32) {
					this.indeterminate = false;
					this.checkAll = true;
				} else if(data.length > 0) {
					this.indeterminate = true;
					this.checkAll = false;
				} else {
					this.indeterminate = false;
					this.checkAll = false;
                }                
			},
            getPoptip() {
                return this.$refs.poptip.$el
            },
            handleHide() {
                this.getPoptip().querySelector('.ivu-poptip-popper').style.display = 'none'
            },
            handleShow() {
                const poptip = this.getPoptip().querySelector('.ivu-poptip-popper')
                setTimeout(() => {
                    poptip.style.display = 'block'
                }, 500)
                this.getPoptip().addEventListener('mouseleave', this.handleHide)
            }
        },
        beforeDestroy() {
            this.getPoptip().removeEventListener('mouseleave', this.handleHide)
        }
	}
</script>
