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
	<div style="display: inline-block;">
		<Poptip placement="bottom-end" width="500" class="Poptiptap" trigger="hover">
			<Button type="primary">自定义指标</Button>
			<div class="api" slot="content">
				<div class="bottom_line">
					<Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
				</div>
				<div class="checklist">
					媒体列
				</div>

				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="configured_status">广告开关</Checkbox>
					<Checkbox label="configured_status1">广告状态，花费</Checkbox>
					<Checkbox label="click_cost">点击均价（cpc）</Checkbox>
					<Checkbox label="click">点击量</Checkbox>
					<Checkbox label="click_per">点击率(CTR)</Checkbox>
				</CheckboxGroup>
				<div class="checklist">
					落地页
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="fetch">到达数</Checkbox>
					<Checkbox label="fetch_per">到达率</Checkbox>
					<Checkbox label="down_ins_per">下载率</Checkbox>
					<Checkbox label="download">下载数</Checkbox>
				</CheckboxGroup>
				<div class="checklist">
					激活注册
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="install">激活总量</Checkbox>
					<Checkbox label="click_install">点击激活率</Checkbox>
					<Checkbox label="reg_imei">注册设备数</Checkbox>
					<Checkbox label="reg_total">注册数</Checkbox>
					<Checkbox label="reg_per">点击注册率</Checkbox>
					<Checkbox label="reg_cost">注册成本</Checkbox>
					<Checkbox label="reg_imei_cost">注册设备成本</Checkbox>
					<Checkbox label="install_per">激活安装率</Checkbox>
					<Checkbox label="download_per">下载激活率</Checkbox>
				</CheckboxGroup>
				<div class="checklist">
					活跃付费
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="login">活跃数</Checkbox>
					<Checkbox label="act_per">活跃率</Checkbox>
					<Checkbox label="pay_num">付费人数</Checkbox>
					<Checkbox label="pay_total">付费金额</Checkbox>
					<Checkbox label="pay_per">付费率</Checkbox>
					<Checkbox label="reg_arpu">付费ARPU</Checkbox>
					<Checkbox label="income_per">回本率</Checkbox>
				</CheckboxGroup>
				<div class="checklist">
					其他
				</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="show_pv">展示PV</Checkbox>
					<Checkbox label="show_ip">展示IP</Checkbox>
					<Checkbox label="down_ip">下载IP</Checkbox>
				</CheckboxGroup>
			</div>
		</Poptip>
	</div>
</template>
<script>
	export default {
		name: 'viewTab',
		props: ['value'],
		data() {
			return {
				indeterminate: true,
				checkAll: false,
				checkAllGroup: this.value
			}
		},
		watch: {
			value(val) {
				this.checkAllGroup = val;
			},
			checkAllGroup(val) {
				this.$emit('input', val)
			},
		},
		methods: {
			//自定义指标全选
			handleCheckAll() {
				if(this.indeterminate) {
					this.checkAll = false;
				} else {
					this.checkAll = !this.checkAll;
				}
				this.indeterminate = false;
				if(this.checkAll) {
					this.checkAllGroup = ['configured_status', 'configured_status1', 'click_cost', 'click', 'click_per',
						'fetch', 'fetch_per', 'down_ins_per', 'download',
						'install', 'click_install', 'reg_imei', 'reg_total', 'reg_per', 'reg_cost', 'reg_imei_cost', 'install_per', 'download_per',
						'login', 'act_per', 'pay_num', 'pay_total', 'pay_per', 'reg_arpu', 'income_per',
						'show_pv', 'show_ip', 'down_ip'
					];
				} else {
					this.checkAllGroup = [];
				}
			},
			//自定义指标
			checkAllGroupChange(data) {
				if(data.length === 28) {
					this.indeterminate = false;
					this.checkAll = true;
				} else if(data.length > 0) {
					this.indeterminate = true;
					this.checkAll = false;
				} else {
					this.indeterminate = false;
					this.checkAll = false;
				}
			}
		}
	}
</script>

<style>

</style>