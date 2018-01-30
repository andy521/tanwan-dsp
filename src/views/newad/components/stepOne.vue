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
		<Tabs v-model="tabsid" :animated="false" type="card">
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
					<div class="camitem"><span>计划类型</span>{{campaign_type}}</div>
					<div class="camitem"><span>标的物类型</span>{{product_type}}</div>
					<div class="camitem"><span>开启状态</span>{{campaign.configured_status='AD_STATUS_NORMAL'?'有效':'无效'}}</div>
					<div class="camitem"><span>投放速度模式</span>{{campaign.speed_mode='SPEED_MODE_FAST'?'加速投放':'标准投放'}}</div>
				</div>
			</div>
			<br />
			<Button type="primary" size="large" style="width: 150px;" @click="campaignsAdd">下一步</Button>
		</div>
		<div v-if="tabsid==1">
			<h3 class="subtit">计划设置</h3>
			<Row>
				<Col span="12">
				<Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100" class="margin-top-20">
					<FormItem label="推广计划名称" prop="campaign_name">
						<Input v-model="formCustom.campaign_name" placeholder="请输入推广计划名称"></Input>
					</FormItem>
					<FormItem label="日消耗限额" prop="daily_budget">
						<Input v-model="formCustom.daily_budget" placeholder="请输入消耗限额"></Input>
					</FormItem>
					<FormItem label="计划类型">
						<Select v-model="formCustom.campaign_type" placeholder="请选择计划类型">
							<Option v-for="item in campaign_type_list" :key="this" :value="item.name">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem label="标的物类型">
						<Select v-model="formCustom.product_type" placeholder="请选择标的物类型">
							<Option v-for="item in product_type_list" :key="this" :value="item.name">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem label="开启状态">
						<Select v-model="formCustom.configured_status" placeholder="请选择开启状态">
							<Option v-for="item in configured_status_list" :key="this" :value="item.name">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem label="投放速度模式">
						<Select v-model="formCustom.speed_mode" placeholder="请选择投放速度模式">
							<Option value="beijing">New York</Option>
							<Option value="shanghai">London</Option>
							<Option value="shenzhen">Sydney</Option>
						</Select>
					</FormItem>
				</Form>
				</Col>
			</Row>
			<br />
			<Button type="primary" size="large" style="width: 150px;" @click="handleSubmit('formCustom')">下一步</Button>
		</div>

	</div>
</template>

<script>
	export default {
		name: 'stepOne',
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
				account_id: 3415636, // this.$route.params.account_id,
				tabsid: 0,
				campaign_id: '', //推广计划id
				campaign: {}
			}
		},
		mounted() {
			//判断是否有推广计划id,没有返回选择
			if(this.account_id) {
				this.$store.dispatch('getCampaigns', this.account_id);
			} else {
				this.$router.push({
					name: 'user_accounts'
				});
			}
			//请求计划类型
			this.$store.dispatch('get_campaign_type');
			//请求标的物类型
			this.$store.dispatch('get_product_type');
			//请求状态类型
			this.$store.dispatch('get_configured_status');
		},
		methods: {
			//提交第一步填写数据
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if(valid) {
						//this.$Message.success('下一步');
						let data = {
							do: 'edit',
							account_id: this.account_id,
							campaign_type: this.formCustom.product_type,
							campaign_name: this.formCustom.campaign_name,
							daily_budget: this.formCustom.daily_budget,
							product_type: this.formCustom.product_type,
							configured_status: this.formCustom.configured_status,
							speed_mode: this.formCustom.speed_mode
						}
						this.$store.dispatch('campaignsAdd', data);
					} else {
						this.$Message.error('请填写完整资料');
					}
				})
			},
			//提交第一步默认数据
			campaignsAdd() {
				if(this.campaign_id == '') {
					this.$Message.error('请填选择推广计划');
				} else {
					let data = {
						do: 'edit',
						account_id: this.account_id,
						campaign_type: this.campaign.product_type,
						campaign_name: this.campaign.campaign_name,
						daily_budget: this.campaign.daily_budget,
						product_type: this.campaign.product_type,
						configured_status: this.campaign.configured_status,
						speed_mode: this.campaign.speed_mode
					}
					this.$store.dispatch('campaignsAdd', data);
				}
			},
			//选择推广计划
			changcampaigns(e) {
				this.campaignslist.forEach(item => {
					if(item.campaign_id == e)
						this.campaign = item;
				});
			}
		},
		computed: {
			//获取标的物类型
			product_type_list() {
				return this.$store.state.newad.product_type;
			},
			//获取状态类型
			configured_status_list() {
				return this.$store.state.newad.configured_status;
			},
			//获取计划类型
			campaign_type_list() {
				return this.$store.state.newad.campaign_type;
			},
			//获取推广计划
			campaignslist() {
				return this.$store.state.plan.campaignslist;
			},
			//计划类型转换
			campaign_type() {
				console.log(this.campaign.campaign_type)
				if(this.campaign.campaign_type == 'CAMPAIGN_TYPE_NORMAL') {
					return "普通展示广告";
				} else if(this.campaign.campaign_type == 'CAMPAIGN_TYPE_WECHAT_OFFICIAL_ACCOUNTS') {
					return "微信公众号广告";
				} else if(this.campaign.campaign_type == 'CAMPAIGN_TYPE_WECHAT_MOMENTS') {
					return "微信朋友圈广告";
				} else {
					return "未知类型";
				}
			},
			//标的物类型
			product_type() {
				if(this.campaign.product_type == 'PRODUCT_TYPE_APP_ANDROID_OPEN_PLATFORM') {
					return "腾讯开放平台移动应用";
				} else if(this.campaign.product_type == 'PRODUCT_TYPE_APP_IOS') {
					return "苹果应用";
				} else if(this.campaign.product_type == 'PRODUCT_TYPE_ECOMMERCE') {
					return "电商推广";
				} else if(this.campaign.product_type == 'PRODUCT_TYPE_LINK_WECHAT') {
					return "微信品牌页";
				} else if(this.campaign.product_type == 'PRODUCT_TYPE_LBS_WECHAT') {
					return "\t微信本地门店推广";
				} else if(this.campaign.product_type == 'PRODUCT_TYPE_LINK') {
					return "\t普通链接";
				} else if(this.campaign.product_type == 'UNKNOWN') {
					return "未知类型";
				}
			}
		}
	}
</script>

<style>

</style>