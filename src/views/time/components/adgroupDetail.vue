<style scoped>
	.w_flex {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		padding: 5px 0;
	}
	
	.w_flex_hd {
		width: 5em;
		font-weight: bold;
		text-align: right;
		padding-right: 10px;
	}
	
	.w_flex_bd {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
	}
	
	.w_flex_bd>div {
		padding-bottom: 5px;
	}
	
	.grey {
		color: #999;
	}
	
	.w_box {
		float: left;
	}
	
	.w_imgdiv {
		border: solid 1px #eee;
		width: 142px;
		height: 93px;
		position: relative;
		overflow: hidden;
	}
	
	.w_imgdiv img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	
	.w_img_operation {
		position: absolute;
		bottom: 0;
		right: 0;
		background: rgba(0, 0, 0, .7);
		padding: 0 5px;
		cursor: pointer;
	}
	
	.demo-carousel {
		width: 300px;
	}
	
	em {
		font-style: normal;
	}
</style>
<template>
	<!--详情-->
	<Modal v-model="detailswin" :title="adgroup_detail.adgroup_name">
		<div class="w_flex" v-if="adgroup_detail.adcreative.length>0">
			<div class="w_flex_hd">创意</div>
			<div class="w_flex_bd">
				<div class="w_box" v-for="item in adgroup_detail.adcreative">
					<div>{{item.adcreative_name}}</div>
					<div class="w_imgdiv">
						<img :src="item.adcreative_elements.image_url" />
						<!--<div class="w_img_operation">
							<Icon type="search" size="18" color="#fff"></Icon>
						</div>-->
					</div>
				</div>
			</div>
		</div>
		<div class="w_flex">
			<div class="w_flex_hd">广告名称</div>
			<div class="w_flex_bd">{{adgroup_detail.adgroup_name}}</div>
		</div>
		<div class="w_flex">
			<div class="w_flex_hd">广告ID</div>
			<div class="w_flex_bd">{{adgroup_detail.adgroup_id}}</div>
		</div>
		<div class="w_flex">
			<div class="w_flex_hd">投放日期</div>
			<div class="w_flex_bd">{{adgroup_detail.begin_date}}~{{adgroup_detail.end_date}}</div>
		</div>
		<div class="w_flex" v-if="adgroup_detail.time_series">
			<div class="w_flex_hd">投放时间</div>
			<div class="w_flex_bd" v-html="weektime"></div>
		</div>
		<div class="w_flex" v-if="adgroup_detail.optimization_goal">
			<div class="w_flex_hd">优化目标</div>
			<div class="w_flex_bd">
				<span v-if="item.val_type==adgroup_detail.optimization_goal" size="large" v-for="item in ads_config.optimization_goal" :key="this">{{item.name}}</span>
			</div>
		</div>
		<div class="w_flex" v-if="adgroup_detail.billing_event">
			<div class="w_flex_hd">付费类型</div>
			<div class="w_flex_bd"><span v-if="item.val_type==adgroup_detail.billing_event" size="large" v-for="item in ads_config.billing_event" :key="this">{{item.name}}</span></div>
		</div>
		<div class="w_flex" v-if="adgroup_detail.bid_amount">
			<div class="w_flex_hd">广告出价</div>
			<div class="w_flex_bd">{{adgroup_detail.bid_amount}}元</div>
		</div>

		<div class="w_flex" v-if="adgroup_detail.targeting">
			<div class="w_flex_hd">定向条件</div>
			<div class="w_flex_bd">
				<div v-if="adgroup_detail.targeting.geo_location">
					<div v-if="adgroup_detail.targeting.geo_location.regions">
						<span class="grey">地域：</span>{{new_regions}}
					</div>
					<div v-if="adgroup_detail.targeting.geo_location.location_types">
						<span class="grey">地点类型：</span>
						<span v-for="item in ads_config.location_types">
						<em v-for="subitem in adgroup_detail.targeting.geo_location.location_types" v-if="subitem==item.val_type">{{item.name}}&nbsp;</em>
					</span>
					</div>
				</div>
				<div v-if="adgroup_detail.targeting.age">
					<span class="grey">年龄：</span> {{adgroup_detail.targeting.age.toString()}}
				</div>
				<div v-if="adgroup_detail.targeting.gender">
					<span class="grey">性别：</span>
					<span v-if="item.val_type==adgroup_detail.targeting.gender" size="large" v-for="item in ads_config.gender" :key="this">{{item.name}}</span>
				</div>
				<div v-if="adgroup_detail.targeting.business_interest">
					<span class="grey">商业兴趣：</span> {{businessids}}
				</div>
				<div v-if="adgroup_detail.targeting.app_behavior">
					<span class="grey">App行为：</span>{{app_category}}，距离今天{{adgroup_detail.targeting.app_behavior.time_window}}天内，该类APP的
					<span v-for="item in ads_config.act_id_list">
						<em v-for="subitem in adgroup_detail.targeting.app_behavior.act_id_list" v-if="subitem==item.val_type">{{item.name}},</em>
					</span> 用户
				</div>
				<div v-if="adgroup_detail.targeting.app_install_status">
					<span class="grey">App安装：</span>
					<span size="large" v-for="item in ads_config.app_install_status" :key="this" v-if="item.val_type==adgroup_detail.targeting.app_install_status">{{item.name}}</span>
				</div>
				<div v-if="adgroup_detail.targeting.network_type">
					<span class="grey">联网方式：</span>
					<span v-for="item in adgroup_detail.targeting.network_type">
					<em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.network_type" :key="this">{{subitem.name}}</em>
					</span>
				</div>
				<div v-if="adgroup_detail.targeting.custom_audience">
					<span class="grey">定向用户群：</span>
					<span v-for="item in adgroup_detail.targeting.custom_audience">{{item.name}}</span>
				</div>
				<div v-if="adgroup_detail.targeting.excluded_custom_audience">
					<span class="grey">排除用户群：</span>
					<span v-for="item in adgroup_detail.targeting.excluded_custom_audience">{{item.name}}</span>
				</div>
				<div v-if="adgroup_detail.targeting.education">
					<span class="grey">婚恋状态：</span>
					<span v-for="item in adgroup_detail.targeting.education">
						<em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.education" :key="this">{{subitem.name}}</em>
					</span>
				</div>
				<div v-if="adgroup_detail.targeting.living_status">
					<span class="grey">工作状态：</span>
					<span v-for="item in adgroup_detail.targeting.living_status">
						<em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.living_status" :key="this">{{subitem.name}}</em>
					</span>
				</div>
				<div v-if="adgroup_detail.targeting.keyword">
					<span class="grey">关键词：</span>
					<span v-for="item in adgroup_detail.targeting.keyword.words">{{item}}</span>
				</div>
				<div v-if="adgroup_detail.targeting.paying_user_type">
					<span class="grey">付费用户：</span>
					<span v-for="item in adgroup_detail.targeting.paying_user_type">
						<em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.paying_user_type" :key="this">{{subitem.name}}</em>
					</span>
				</div>
				<div v-if="adgroup_detail.targeting.shopping_capability">
					<span class="grey">消费状态：</span>
					<span v-for="item in adgroup_detail.targeting.shopping_capability">
						<em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.shopping_capability" :key="this">{{subitem.name}}</em>
					</span>
				</div>
				<div v-if="adgroup_detail.targeting.network_operator">
					<span class="grey">消费状态：</span>
					<span v-for="item in adgroup_detail.targeting.network_operator">
						<em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.network_operator" :key="this">{{subitem.name}}</em>
					</span>
				</div>
				<div v-if="adgroup_detail.targeting.device_price">
					<span class="grey">设备价格：</span>
					<span v-for="item in adgroup_detail.targeting.device_price">
						<em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.device_price" :key="this">{{subitem.name}}</em>
					</span>
				</div>
 
			</div>
		</div>
		<div slot="footer">
			<Button size="large" type="text" @click="detailswin=false;">取消</Button>
		</div>
	</Modal>
</template>

<script>
	import Axios from '@/api/index';
	import { changetime } from '@/utils/DateShortcuts.js';
	export default {
		name: 'adgroupDetail',
		props: ['value'],
		data() {
			return {
				detailswin: false,
				value1: 0,
				campaign_id:'',
				adgroup_detail: {
					adcreative: [{
						"adcreative_elements": {
							"corporate": {
								"corporate_img": "",
								"corporate_name": ""
							},
							"image": "",
							"image_url": "",
							"title": ""
						},
						"adcreative_id": "",
						"adcreative_name": "",
					}],
					targeting: {
						"age": ["5~60"],
						"gender": ["FEMALE"],
						"education": [],
						"relationship_status": [],
						"living_status": [],
						"geo_location": {
							"regions": [],
							"location_types": [],
							"business_districts": []
						},
						"app_behavior": {
							"object_type": "APP_CLASS",
							"object_id_list": [],
							"time_window": 1,
							"act_id_list": []
						},
						"app_install_status": [],
						"customized_audience": [],
						"network_type": [],
						"business_interest": [],
						"network_operator": [],
						"device_price": [],
						"shopping_capability": [],
						"paying_user_type": [],
						"keyword": {
							"words": []
						},
						"player_consupt": [],
						"residential_community_price": [],
						"custom_audience": [],
						"excluded_custom_audience": [],
						"description": [],
					}
				},
			}
		},
		mounted() {
			//请求定向标签(地域)
			this.$store.dispatch('get_targeting_tags');
			//获取所有状态
			this.$store.dispatch('get_ads_config');
			//获取商业兴趣
			this.$store.dispatch('get_business_interest');
			//获取App行为
			this.$store.dispatch('get_appCategory');
		},
		methods: {
			//编辑
			editTargeting() {
				let query = {
					account_id: this.adgroup_detail.account_id,
					campaign_id:this.adgroup_detail.campaign_id,
					targeting_id:this.adgroup_detail.targeting_id,
				};
				this.$router.push({
					name: 'newad',
					params: query
				});		
			}
		},
		watch: {
			value(val) {
				Axios.post('api.php', {
					action: 'gdtAdPut',
					opt: 'get_adgroup_detail',
					account_id: val.account_id,
					adgroup_id: val.adgroup_id
				}).then(
					res => {
						if(res.ret == 1) {
							this.detailswin = true;
							this.adgroup_detail = res.data;
						}
					}
				).catch(
					err => {
						console.log('获取详情失败' + err)
					}
				)
			},
		},
		computed: {
			//获取所有状态
			ads_config() {
				return this.$store.state.newad.ads_config;
			},
			//省市区转码
			new_regions() {
				let regions = this.$store.state.newad.targeting_tags;
				let ids = this.adgroup_detail.targeting.geo_location.regions;
				if(!ids) return;
				var name = [];
				ids.forEach(id => {
					for(var i in regions) {
						var e = regions[i].list;
						for(var j in e) {
							var f = e[j];
							if(f.id == id) {
								name.push(f.name)
							}
						}
					}
				});
				return name.toString();
			},
			//商业兴趣转码
			businessids() {
				let business_interest = this.$store.state.newad.business_interest;
				let ids = this.adgroup_detail.targeting.business_interest;
				if(!ids) return;
				var name = [];
				ids.forEach(id => {
					for(var i in business_interest) {
						var item1 = business_interest[i];
						if(item1.id == id) {
							name.push(item1.name)
						}
						var item2 = item1.list;
						for(var j in item2) {
							if(item2[j].id == id) {
								name.push(item2[j].name)
							}
							for(var k in item2[j].list) {
								var n = item2[j].list[k];
								if(n.id == id) {
									name.push(n.name)
								}
							}
						}
					}
				});
				return name.toString();
			},
			//app行为转码
			app_category() {
				let appCategory = this.$store.state.newad.appCategory;
				let ids = this.adgroup_detail.targeting.app_behavior.object_id_list;
				if(!ids) return;
				var name = [];
				ids.forEach(id => {
					for(var i in appCategory) {
						var item1 = appCategory[i];
						if(item1.id == id) {
							name.push(item1.name)
						}
						var item2 = item1.list;
						for(var j in item2) {
							if(item2[j].id == id) {
								name.push(item2[j].name)
							}
							for(var k in item2[j].list) {
								var n = item2[j].list[k];
								if(n.id == id) {
									name.push(n.name)
								}
							}
						}
					}
				});
				return name.toString();
			},
			//投放时间转换
			weektime: function() {
				let time = this.adgroup_detail.time_series;
				return changetime(time);
			},
		}
	}
</script>