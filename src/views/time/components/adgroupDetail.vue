<style>
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
	.grey{
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
			<div class="w_flex_bd">{{adgroup_detail.begin_date|time_date}}~{{adgroup_detail.end_date|time_date}}</div>
		</div>
		<div class="w_flex">
			<div class="w_flex_hd">投放时间</div>
			<div class="w_flex_bd">{{adgroup_detail.time_series|weektime}}</div>
		</div>
		<div class="w_flex">
			<div class="w_flex_hd">优化目标</div>
			<div class="w_flex_bd">
				<span v-if="item.val_type==adgroup_detail.optimization_goal" size="large" v-for="item in ads_config.optimization_goal" :key="this">{{item.name}}</span>
			</div>
		</div>
		<div class="w_flex">
			<div class="w_flex_hd">付费类型</div>
			<div class="w_flex_bd">{{adgroup_detail.billing_event|billing_event}}</div>
		</div>
		<div class="w_flex">
			<div class="w_flex_hd">广告出价</div>
			<div class="w_flex_bd">{{adgroup_detail.bid_amount}}元</div>
		</div>

		<div class="w_flex">
			<div class="w_flex_hd">定向条件</div>
			<div class="w_flex_bd">
				<div v-if="adgroup_detail.targeting.geo_location">
					<span class="grey">地理位置：</span>{{new_regions}}
				</div>
				<div v-if="adgroup_detail.targeting.age">
					<span class="grey">年龄：</span>
					{{adgroup_detail.targeting.age.toString()}}
				</div>
				<div v-if="adgroup_detail.targeting.gender">
					<span class="grey">性别：</span>
					<span v-if="item.val_type==adgroup_detail.targeting.gender" size="large" v-for="item in ads_config.gender" :key="this">{{item.name}}</span>
				</div>
				<div v-if="adgroup_detail.targeting.network_type">
					<span class="grey">联网方式：</span>
					<span v-for="item in adgroup_detail.targeting.network_type">
					<span v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.network_type" :key="this">{{subitem.name}}</span>
					</span>
				</div>
				<div v-if="adgroup_detail.targeting.app_install_status">
					<span class="grey">App安装：</span>
					<span v-if="item.val_type==adgroup_detail.targeting.app_install_status" size="large" v-for="item in ads_config.app_install_status" :key="this">{{item.name}}</span>
				</div>
				<div v-if="adgroup_detail.targeting.business_interest">
					<span class="grey">商业兴趣：</span>
					{{businessids}}
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
	import { changetime } from '../data/DateShortcuts.js';
	export default {
		name: 'adgroupDetail',
		props: ['value'],
		data() {
			return {
				detailswin: false,
				value1: 0,
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
						"gender": ["FEMALE"],
						"age": ["5~60"],
						"geo_location": {
							"regions": [],
							"location_types": ""
						},
						"app_install_status": [],
						"customized_audience": [],
						"network_type": [],
						"business_interest": [],
						"app_install_status": [],
						"network_operator": [],
						"education": [],
						"living_status": [],
						"device_price": [],
						"shopping_capability": [],
						"paying_user_type": [],
						"act_id_list": [],
						"keyword": {
							"words": []
						}
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
		},
		methods: {

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
							console.log(res.data.targeting)
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
		},
		filters: {
			//投放时间过滤
			weektime: function(val) {
				return changetime(val);
			},
			//付费类型过滤
			billing_event: function(val) {
				let newval = '';
				if(val == 'BILLINGEVENT_CLICK') {
					newval = '按点击扣费';
				} else if(val == 'BILLINGEVENT_IMPRESSION') {
					newval = '按曝光扣费';
				}
				return newval;
			},
			//投放日期过滤
			time_date: function(val) {
				if(val) return val.substring(0, 10);
			}
		}
	}
</script>