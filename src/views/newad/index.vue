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
			<!-- <step-one :callback="steponecallback" v-show="setp[0]==0"></step-one> -->
			<!--步骤2-->
			<!-- <step-two :callback="steptowcallback" v-show="setp[0]==1&&setp[1]==0"></step-two> -->
			<!--步骤3-->
			<!-- <step-three :edition="adcreative" @tostep="tostep" @on-edition="getEditionData" @on-click="threeInfo" v-show="setp[0]==1&&setp[1]==1||setp[1]==2"></step-three> -->

			<!--上传创意-->
			<!-- <up-creative v-show="setp[0]==2" :account="account_id" :template="creativeTemplate"></up-creative> -->
            <up-creative :account="account_id" :template="creativeTemplate"></up-creative>
		</Content>

	</div>
</template>

<script>
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
                //account_id: this.$route.params.account_id,
                account_id: 3495067,
				campaign_id: '',
				targeting_id: '',
				//导行定位
				setp: [0, 0],

				//广告版位数据
				adcreative: adcreative_template,

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
                            "amount": [1,8],
							"required": 1,
							"des": "字数：1~8"
						}
					}
				},
			}
		},
		mounted() {
			//判断有没有id
			if(!this.account_id) {
				this.$router.push({
					name: 'user_accounts'
				});
			};
			//获取所有状态
            this.$store.dispatch('get_ads_config');
            
            //console.log('返回account_id' + this.$route.params.account_id)
		},
		methods: {            
			//第一步数据返回
			steponecallback(campaign_id, data) {
				this.campaign_id = campaign_id;
				this.setp = [1, 0];
			},

			//第二步数据返回
			steptowcallback(targeting_id, data) {
				this.targeting_id = targeting_id;
				this.setp = [1, 1];
			},

			//第三步提交过来的信息
			threeInfo(data) {

				this.setp = [2, 0];
			},

			tostep(step) {
				this.setp = step;
			},
			//获取广告版位信息
			getEditionData(data) {
				this.creativeTemplate = data;
			},
		},
		computed: {

		}
	};
</script>

<style>

</style>