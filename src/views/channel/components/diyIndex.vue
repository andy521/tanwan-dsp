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
	}
	
	.Poptiptap .ivu-poptip-body-content {
		overflow: inherit;
	}
</style>

<template>
	<div>
		<Poptip placement="bottom-start" width="500" class="Poptiptap">
			<Button type="primary">自定义指标</Button>
			<div class="api" slot="content">
				<div class="bottom_line">
					<Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
				</div>
				<div class="checklist">
					媒体列
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="game_name">广告开关</Checkbox>
					<Checkbox label="account_name">广告状态，花费</Checkbox>
					<Checkbox label="campaign_id">点击均价（cpc）</Checkbox>
					<Checkbox label="configured_status">点击量</Checkbox>
					<Checkbox label="site_id">点击率(CTR)</Checkbox>
				</CheckboxGroup>
				<div class="checklist">
					落地页
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="impression">到达数</Checkbox>
					<Checkbox label="click">到达率</Checkbox>
					<Checkbox label="click">下载率</Checkbox>
					<Checkbox label="click">下载数</Checkbox>
				</CheckboxGroup>
				<div class="checklist">
					激活注册
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="cost">激活总量</Checkbox>
					<Checkbox label="click_cost">点击激活率</Checkbox>
					<Checkbox label="active">注册设备数</Checkbox>
					<Checkbox label="reg_total">注册数</Checkbox>
					<Checkbox label="reg_per">点击注册率</Checkbox>
					<Checkbox label="reg_cost">注册成本</Checkbox>
					<Checkbox label="active">注册设备成本</Checkbox>
				</CheckboxGroup>
				<div class="checklist">
					活跃付费
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="active">活跃数</Checkbox>
					<Checkbox label="reg_total">活跃率</Checkbox>
					<Checkbox label="reg_per">付费人数</Checkbox>
					<Checkbox label="reg_cost">付费金额</Checkbox>
					<Checkbox label="reg_imei_cost">付费率</Checkbox>
					<Checkbox label="login_cost">付费ARPU</Checkbox>
					<Checkbox label="pay_num">回本率</Checkbox>
				</CheckboxGroup>
				<div class="checklist">
					其他
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="pay_total">展示PV</Checkbox>
					<Checkbox label="pay_per">展示IP</Checkbox>
					<Checkbox label="reg_arpu">下载IP</Checkbox>
					<Checkbox label="income_per">激活安装率</Checkbox>
				</CheckboxGroup>
			</div>
		</Poptip>
	</div>
</template>

<script>
	export default {
		data() {
			return {
                indeterminate: true,
                checkAll: false,
                checkAllGroup: [],
			}
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
					this.checkAllGroup = [ 
                        'game_name', 
                        'account_name', 
                        'campaign_id', 
                        'configured_status', 
                        'site_id', 'impression', 
                        'click', 
                        'cost', 
                        'click_cost', 
                        'active', 
                        'reg_total', 
                        'reg_per', 
                        'reg_cost', 
                        'reg_imei_cost', 
                        'login_cost', 
                        'pay_num', 
                        'pay_total', 
                        'pay_per', 
                        'reg_arpu', 
                        'income_per'
                    ];
                    this.$emit('on-change', this.checkAllGroup);
				} else {
					this.checkAllGroup = [];
				}
				
			},
			//自定义指标
			checkAllGroupChange(data) {
                this.$emit('on-change', this.checkAllGroup);
				if(data.length === 27) {
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
			close() {
				this.visible = false;
			},
			close1() {
				this.visible1 = false;
			}
		}
	}
</script>
