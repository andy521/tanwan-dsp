<style lang="less">
	.tit {
		font-size: 34px;
	}
	
	.stepone {
		padding-bottom: 50px;
	}
	
	.subtit {
		font-size: 18px;
		font-weight: 900;
		line-height: 1;
		color: #404246;
		margin-top: 50px;
	}
	
	.camitem {
		line-height: 50px;
		border-bottom: solid 1px #eee;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
	}
	
	.camitem>div {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
	}
	
	.camitem>span {
		display: inline-block;
		width: 100px;
		color: #999;
	}
	
	.next_btn {
		width: 300px;
		margin-top: 40px;
	}
	
	em,
	var {
		font-style: normal;
	}
	
	.next_btn .ivu-btn-large {
		padding: 10px 15px;
		font-size: 16px;
		width: 100%;
	}
</style>

<template>
	<div class="stepone">
		<div class="tit">
			<Tooltip placement="right-start">
				<span>推广计划</span>
				<div slot="content" style="white-space: normal">
					推广计划是广告的集合，您可以对同一个推广计划下的多个广告，统一控制限额和投放方式等。
				</div>
			</Tooltip>
		</div>
		<Tabs v-model="tabsid" :animated="false" type="card" class="margin-top-20">
			<TabPane label="选择已有推广计划" name="0"></TabPane>
			<TabPane label="新建推广计划" name="1"></TabPane>
		</Tabs>
		<div v-if="tabsid==0">
			<h3 class="subtit">推广计划</h3>
			<Select class="margin-top-20" filterable size="large" placeholder="请选择推广计划" v-model="campaign_id" @on-change="changcampaigns">
				<Option v-for="item in campaignslist" :value="item.campaign_id" :key="this">{{item.campaign_name}}</Option>
			</Select>
			<div class="tabpane">
				<div v-if="campaign_id!=''">
					<div class="camitem"><span>日消耗限额</span>{{campaign.daily_budget}}元/天</div>
					<div class="camitem"><span>计划类型</span><em v-for="item in ads_config.campaign_type" v-if="campaign.campaign_type==item.val_type">{{item.name}}</em></div>
					<div class="camitem"><span>标的物类型</span><em v-if="campaign.product_type=='UNKNOWN'">未知类型</em>
						<em v-for="item in ads_config.product_type" v-if="campaign.product_type==item.val_type">{{item.name}}</em>
					</div>
					<div class="camitem"><span>开启状态</span><em v-for="item in ads_config.configured_status" v-if="campaign.configured_status==item.val_type">{{item.name}}</em></div>
					<div class="camitem"><span>投放速度模式</span><em v-for="item in ads_config.speed_mode" v-if="campaign.speed_mode==item.val_type">{{item.name}}</em></div>
				</div>
			</div>
			<div class="next_btn">
				<Button type="primary" size="large" @click="campaignsAdd">下一步</Button>
			</div>
		</div>
		<div v-if="tabsid==1">
			<h3 class="subtit">计划设置</h3>
			<Row>
				<Col span="12">
				<Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100" class="margin-top-20">
					<FormItem label="推广计划名称" prop="campaign_name">
						<Input v-model="formCustom.campaign_name" placeholder="请输入推广计划名称"></Input>
					</FormItem>
					<FormItem label="计划类型">
						<Select v-model="formCustom.campaign_type" placeholder="请选择计划类型" @on-change="campaign_type_change">
							<Option v-for="item in ads_config.campaign_type" :key="item.val_type" :value="item.val_type">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem label="日消耗限额" prop="daily_budget" v-if="formCustom.campaign_type!='CAMPAIGN_TYPE_WECHAT_MOMENTS'">
						<Input v-model="formCustom.daily_budget" placeholder="请输入消耗限额"></Input>
					</FormItem>
					<FormItem label="标的物类型">
						<Select v-model="formCustom.product_type" placeholder="请选择标的物类型">
							<Option v-for="item in ads_config.product_type" :key="item.val_type" :value="item.val_type">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem label="开启状态">
						<Select v-model="formCustom.configured_status" placeholder="请选择开启状态">
							<Option v-for="item in ads_config.configured_status" :key="item.val_type" :value="item.val_type">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem label="投放速度模式">
						<Select v-model="formCustom.speed_mode" placeholder="请选择投放速度模式">
							<Option v-for="item in ads_config.speed_mode" :key="item.val_type" :value="item.val_type">{{item.name}}</Option>
						</Select>
					</FormItem>
				</Form>
				</Col>
			</Row>
			<div class="next_btn">
				<Button type="primary" size="large" @click="handleSubmit('formCustom')">下一步</Button>
			</div>
		</div>
	</div>
</template>

<script>
	import Axios from "@/api/index"
	export default {
		name: 'stepOne',
		props: ['callback'],
		data() {
			const validatecampaign_name = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入推广计划名称'));
				} else {
					callback();
				}
			};
			const validatedaily_budget = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入消耗限额'));
				} else if(value < 50 || value > 4000000) {
					callback(new Error('50 元-4,000,000 元，单位为人民币'));
				} else {
					callback();
				}
			};
			return {
				formCustom: {
					campaign_name: '',
					daily_budget: '',
					campaign_type: '',
					product_type: '',
					configured_status: '',
					speed_mode: ''
				},
				ruleCustom: {
					campaign_name: [{
						validator: validatecampaign_name,
						trigger: 'blur'
					}],
					daily_budget: [{
						validator: validatedaily_budget,
						trigger: 'blur'
					}],
				},
				account_id: this.$route.params.account_id, //3415636
				campaign_id: '', //推广计划id
				tabsid: 0,
				campaign: {}
			}
		},
		mounted() {
			if(this.$route.params.adgroup_detail) {
				this.campaign_id = this.$route.params.adgroup_detail.campaign_id;
			}
			//请求推广计划
			this.$store.dispatch('getCampaigns', this.account_id);
		},
		methods: {
			campaign_type_change(campaign_type) {
				if(campaign_type == 'CAMPAIGN_TYPE_WECHAT_MOMENTS') {
					this.daily_budget == '';
				}
			},
			//提交第一步填写数据
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if(valid) {
						Axios.get('api.php', {
							action: 'gdtAdPut',
							opt: 'campaigns_add',
							do: 'edit',
							account_id: this.account_id,
							campaign_type: this.formCustom.campaign_type,
							campaign_name: this.formCustom.campaign_name,
							daily_budget: this.formCustom.daily_budget * 100,
							product_type: this.formCustom.product_type,
							configured_status: this.formCustom.configured_status,
							speed_mode: this.formCustom.speed_mode
						}).then(res => {
							if(res.ret == 1) {
								this.$Message.success('提交成功');
								this.callback(res.data.campaign_id, this.formCustom);
							}
						}).catch(
							err => {
								console.log('新建广告计划' + err)
							}
						)
					} else {
						this.$Message.info('请填写完整资料');
					}
				})
			},
			//提交第一步默认数据
			campaignsAdd() {
				if(this.campaign_id == '') {
					this.$Message.info('请填选择推广计划');
				} else {
					this.callback(this.campaign_id, this.campaign);
				}
			},
			//选择推广计划
			changcampaigns(campaign_id) {
				this.campaignslist.forEach(item => {
					if(item.campaign_id == campaign_id) {
						this.campaign = item;
					}
				});
			}
		},
		computed: {
			//获取所有状态
			ads_config() {
				let list = this.$store.state.newad.ads_config;
				this.formCustom.speed_mode = list.speed_mode[0].val_type;
				this.formCustom.product_type = list.product_type[0].val_type;
				this.formCustom.configured_status = list.configured_status[0].val_type;
				this.formCustom.campaign_type = list.campaign_type[0].val_type;
				return list;
			},
			//获取推广计划
			campaignslist() {
				let list = this.$store.state.plan.campaignslist;
				list.forEach(item => {
					if(item.campaign_id == this.campaign_id) {
						this.campaign = item;
					}
				});
				return list;
			}
		}
	}
</script>

<style>

</style>