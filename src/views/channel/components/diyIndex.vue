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
	<div>
		<Poptip ref="poptip" trigger="click" placement="bottom-start" width="500" class="Poptiptap">
			<Button type="ghost" icon="ios-navigate-outline" @click="handleShow">自定义指标</Button>
			<div class="api" slot="content">
				<div class="bottom_line">
					<Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
				</div>
				<div class="checklist">落地页</div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="impression">展示IP</Checkbox>
                    <Checkbox label="click">点击IP</Checkbox>
				</CheckboxGroup>
                <div class="checklist">激活注册</div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="install">激活安装</Checkbox>
                    <Checkbox label="install_per">激活安装率</Checkbox>
                    <Checkbox label="reg_imei">注册设备数</Checkbox>
                    <Checkbox label="activation">注册</Checkbox>
                    <Checkbox label="reg_per">注册率</Checkbox>
                    <Checkbox label="reg_imei_cost">注册设备成本</Checkbox>
                    <Checkbox label="reg_arpu">注册ARPU</Checkbox>
                    <Checkbox label="reg_cost">注册成本</Checkbox>
				</CheckboxGroup>
                <div class="checklist">活跃</div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="login">次日活跃</Checkbox>
                    <Checkbox label="act_per">活跃率</Checkbox>
                    <Checkbox label="act_cost">活跃成本</Checkbox>
				</CheckboxGroup>
                <div class="checklist">付费</div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="pay_num">付费人数</Checkbox>
                    <Checkbox label="pay_total">付费金额</Checkbox>
                    <Checkbox label="pay_per">付费率</Checkbox>                    
                    <Checkbox label="pay_arpu">付费ARPU</Checkbox>
                    <Checkbox label="income_per">回本率</Checkbox>
                    <Checkbox label="ltv">LTV</Checkbox>
				</CheckboxGroup>  
                <div class="foot">
                    <Button type="success" @click="saveIndex">保存自定义指标</Button>   
                </div>
			</div>            
		</Poptip>
	</div>
</template>

<script>
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
                checkAllGroup: this.userindex,
                action:'api',
                opt:'getGameTotalDay'
			}
        },
        computed: {
			//获取自定义指标
			userindex() {
                let memo = this.$store.state.user.userindex;
				//this.checkAllGroup = memo;
				return memo;
			},
		},
        watch:{
            check(data){
                this.checkAllGroup = data
            },
            userindex(data){
                this.checkAllGroup = data;
                this.$emit('on-change', this.checkAllGroup);
            }
        },
        mounted(){
            //传过来的默认选项
            this.checkAllGroup = this.check;
            let param = {
				taction: this.action,
				topt: this.opt
			};
			this.$store.dispatch('DiyIndex', param);
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
					this.checkAllGroup = ['impression','click','install','install_per','reg_imei','activation','reg_per','reg_imei_cost','reg_cost','login','act_per','act_cost','pay_num','pay_total','pay_per','reg_arpu','pay_arpu','income_per','ltv'];
				} else {
					this.checkAllGroup = [];
				}
				this.$emit('on-change', this.checkAllGroup);
            },
            //保存自定义指标
            saveIndex(){                
                let param = {
					taction: this.action,
					topt: this.opt,
					memo: this.checkAllGroup.join(',')
				};
				const poptip = this.getPoptip().querySelector('.ivu-poptip-popper')
				poptip.style.display = 'none'
                this.$store.dispatch('SaveIndex', param);
                console.log('保存')
            },
			//自定义指标
			checkAllGroupChange(data) {
                this.$emit('on-change', this.checkAllGroup);
				if(data.length === 33) {
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
