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
				<div class="checklist">媒体列</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="media_type">媒体类型</Checkbox>
					<Checkbox label="account_name">广告状态，花费</Checkbox>
					<Checkbox label="campaign_id">点击均价（cpc）</Checkbox>
					<Checkbox label="click_cost">点击量</Checkbox>
					<Checkbox label="site_id">点击率(CTR)</Checkbox>
				</CheckboxGroup>
                <div class="checklist">落地页</div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="impression">到达数</Checkbox>
					<Checkbox label="click">到达率</Checkbox>
					<Checkbox label="download">下载数</Checkbox>
				</CheckboxGroup>
                <div class="checklist">
					激活注册
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="cost">激活总量</Checkbox>
					<Checkbox label="reg_imei_cost">点击激活率</Checkbox>
					<Checkbox label="active">注册设备数</Checkbox>
					<Checkbox label="reg_total">注册数</Checkbox>
					<Checkbox label="reg_per">点击注册率</Checkbox>
					<Checkbox label="reg_cost">注册成本</Checkbox>
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
                checkAllGroup: ['media_type','account_name','campaign_id','click_cost','site_id','impression','click',],
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
                        'media_type',
                        'account_id',
                        'account_name',
                        'author',
                        'game_id',
                        'product_refs_id',
                        'agent_id',
                        'site_id',
                        'campaign_id',
                        'adgroup_id',
                        'impression',
                        'click',
                        'cost',
                        'download',
                        'conversion',
                        'activation',
                        'campaign_name',
                        'adgroup_name',
                        'daily_budget',
                        'media_name',
                        'click_cost',
                        'active',
                        'reg_total', 
                        'reg_per',                       
                        'reg_cost',
                        'reg_imei_cost',
                        'login',
                        'alogin_cost',
                        'pay_num',
                        'pay_total',
                        'pay_per',
                        'reg_arpu',
                        'income_per',
                    ];
                    this.$emit('on-change', this.checkAllGroup);
				} else {
					this.checkAllGroup = [];
				}
				
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
			close() {
				this.visible = false;
			},
			close1() {
				this.visible1 = false;
			}
		}
	}
</script>
