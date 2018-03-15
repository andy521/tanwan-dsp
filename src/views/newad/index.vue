<style>
	@import "../../styles/common.less";
	.ad {
		padding-left: 200px;
		background: #fff;
		padding-right: 240px;
		overflow: auto;
		height: 100%;
		font-size: 14px;
	}
</style>
<template>
	<div class="ad">
		<side-bar v-model="setp"></side-bar>
		<Content :style="{padding: '40px', minHeight: '280px', background: '#fff'}">
			<!--步骤1-->
			<step-one :callback="steponecallback" v-show="setp[0]==0"></step-one>
			<!--步骤2-->
			<step-two :plandata="plandata" :callback="steptowcallback" v-show="setp[0]==1&&setp[1]==0"></step-two>
			<!--步骤3-->
			<step-three :plandata="plandata" :edition="adcreative" @tostep="tostep" @on-edition="getEditionData" @on-click="threeInfo" v-show="setp[0]==1&&setp[1]==1||setp[1]==2"></step-three>

			<!--上传创意-->
			<up-creative v-show="setp[0]==2" :account="account_id" :template="creativeTemplate" @on-change="upCreativeCallback"></up-creative>
		</Content>
	</div>
</template>

<script>
	import Axios from '@/api/index';
	import sideBar from './components/sideBar.vue';
	import stepOne from './components/stepOne.vue';
	import stepTwo from './components/stepTwo.vue';
	import stepThree from './components/stepThree.vue';
	import upCreative from './components/upCreative.vue';
	//广告版位数量
	import adcreative_template from './components/adcreative_template.js';

	export default {
		components: {
			sideBar,
			stepOne,
			stepTwo,
			stepThree,
			upCreative
		},
		data() {
			return {
				account_id: '',
				campaign_id: '',
				targeting_id: '',
				product_refs_id: '',
				//导行定位
				setp: [0, 0],
				//推广计划数据
				plandata: {},
				//定向数据
				targetingdata: '',
				//
				adgroup: '',
				//广告版位数据
				adcreative: adcreative_template,
				//广告创意数据
				adcreative_elements: '',

				//广告创意模板
				creativeTemplate: {
					"image": {
						"name": "图片",
						"type": "string",
						"required": 1,
						"size": "960*540",
						"quality": "200",
						"format": "*.jpg|*.jpeg|*.png",
						"des": "尺寸：960*540，大小：不超过200 KB，格式：*.jpg|*.jpeg|*.png"
					},
					"title": {
						"name": "广告文案",
						"type": "string",
						"required": 1,
						"amount": [1, 14],
						"des": "字数：1~14"
					},
					"corporate": {
						"name": "商标",
						"type": "struct",
						"required": 1,
						"length": [1, 1],
						"child": {
							"style": "corporate_name",
							"name": "广告主名称",
							"type": "string",
							"required": 1,
							"des": "字数：1~8"
						}
					},
					"deep_link": {
						"name": "应用直达",
						"type": "string",
						"required": 0,
						"des": "(可选)"
					},
					"impression_tracking_url": {
						"name": "请输入曝光监测URL",
						"type": "string",
						"required": 0,
						"des": "(可选)"
					},
					"click_tracking_url": {
						"name": "请输入点击监测URL",
						"type": "string",
						"required": 0,
						"des": "(可选)"
					}
				},
			}
		},
		mounted() {
			this.account_id = this.$route.query.account_id;

			if(this.$route.query.adgroup_detail) {
				console.log(this.$route.query.adgroup_detail)
				this.campaign_id = this.$route.query.adgroup_detail.campaign_id;
				this.targeting_id = this.$route.query.adgroup_detail.targeting_id;
			}
			//判断有没有id
			if(!this.account_id) {
				this.$router.go(-1);
			};

			if(this.campaign_id) {
				this.setp = [1, 0];
			};

			//获取所有状态
			this.$store.dispatch('get_ads_config');
		},
		methods: {
			//第一步数据返回
			steponecallback(campaign_id, data) {
				this.campaign_id = campaign_id;
				this.plandata = data;
				this.setp = [1, 0];
			},
			//第二步数据返回
			steptowcallback(targeting_id, data, product_refs_id) {
				this.targeting_id = targeting_id;
				this.targetingdata = data;
				this.product_refs_id = product_refs_id;
				this.setp = [1, 1];
			},
			//第三步提交过来的信息
			threeInfo(data) {
				this.adgroup = data;
				this.setp = [2, 0];
			},
			//广告版位/排期和出价步骤
			tostep(step) {
				this.setp = step;
			},
			//获取广告版位信息
			getEditionData(data) {
				this.creativeTemplate = data;
			},
			upCreativeCallback(data) {
				this.adcreative_elements = data;
				this.submit_adgroups();
			},
			//提交广告组
			submit_adgroups() {
				let data = {
					'action': 'gdtAdPut',
					'opt': 'ads_cre_add',
					'do': 'add',
					'account_id': this.account_id, //广告主帐号 id
					'campaign_id': this.campaign_id, //推广计划 id
					'adgroup_name': this.adgroup.adgroup_name, //广告组名称
					'site_set': JSON.stringify(this.adgroup.site_set), //投放站点集合
					'product_type': this.plandata.product_type, //标的物类型
					'begin_date': this.adgroup.begin_date, //开始投放日期
					'end_date': this.adgroup.end_date, //结束投放日期
					'billing_event': this.adgroup.billing_event, //计费类型
					'bid_amount': this.adgroup.bid_amount, //广告出价，单位为分
					'optimization_goal': this.adgroup.optimization_goal, //广告优化目标类型
					'daily_budget': this.adgroup.daily_budget*100, //日限额，单位为分
					'product_refs_id': this.product_refs_id, //标的物 id
					'sub_product_refs_id': '', //子标的物 id
					'targeting_id': this.targeting_id, //定向 id
					//'targeting': JSON.stringify(this.targetingdata.targeting), //定向详细设置
					'time_series': this.adgroup.time_series, //投放时间段,格式为 48 * 7 位字符串
					'configured_status': this.plandata.configured_status, //客户设置的状态
					'adcreative_name': this.adgroup.adcreative_name, //广告创意名称
					'adcreative_template_id': this.adgroup.adcreative_template_id, //创意规格 id
					'adcreative_elements': JSON.stringify(this.adcreative_elements), //创意元素
					'destination_url': this.adgroup.destination_url, //落地页 url
					//'deep_link': '', //应用直达页 URL
					//'share_info': '', //分享信息
				};

				Axios.post('api.php', data).then(res => {
					if(res.ret == 1) {
						this.$Message.info(res.msg);
						console.log(res.msg)
						this.$router.go(-1);
					}
				}).catch(err => console.log('广告组' + err))
			}
		}
	};
</script>

<style>

</style>