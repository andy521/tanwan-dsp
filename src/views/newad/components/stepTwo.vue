<style lang="less">
	.ivu-tag-dot-inner {
		display: none;
	}
	
	.tit {
		font-size: 34px;
	}
	
	.subtit {
		font-size: 18px;
		font-weight: 900;
		line-height: 1;
		color: #404246;
		margin-top: 50px;
	}
	
	.ritht_fixed {
		position: fixed;
		top: 50%;
		right: 40px;
		width: 200px;
		background: #f2f2f2;
		padding: 20px;
		z-index: 999;
		transform: translateY(-50%);
		-webkit-transform: translateY(-50%);
	}
	
	.fi_tit {
		font-size: 12px;
		color: #999;
		font-weight: normal;
		margin-bottom: 5px;
	}
	
	.fi_main {
		max-height: 500px;
		overflow: auto;
		margin-bottom: 25px;
		font-size: 14px;
	}
	
	.fi_main p {
		margin-bottom: 10px;
	}
	
	.fi_main span {
		font-weight: bold;
		color: #333;
	}
	
	.fi_main em,
	.fi_main var {
		font-style: normal;
	}
	
	.fi_user_count {
		font-size: 19px;
	}
	
	.ds_items {
		border-top: 1px solid #eee;
	}
	
	.ds_item {
		border-bottom: 1px solid #eee;
	}
	
	.ds_items .ds_tit .grey {
		display: none;
	}
	
	.ds_items .ds_tit:hover .grey {
		display: inline-block;
	}
	
	.ds_item_on .ds_tit .grey {
		display: inline-block;
	}
	
	.ds_item_on {
		background-color: #f8f9fa;
		box-shadow: 0 0 3px rgba(57, 73, 103, .05) inset;
	}
	
	.ds_tit {
		padding: 10px 15px;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		font-size: 14px;
	}
	
	.ds_item_hd {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		font-size: 16px;
	}
	
	.ds_item_hd em {
		font-size: 12px;
		font-style: normal;
		margin-left: 10px;
	}
	
	.ds_box {
		padding: 20px 30px;
	}
	
	.ds_tag {
		overflow: auto;
		max-height: 200px;
		margin-bottom: 20px;
	}
	
	.ds_tag p {
		font-weight: bold;
	}
	
	.citytree {
		background: #fff;
		border: solid 1px #eee;
		padding: 15px;
		max-height: 200px;
		overflow: auto;
	}
	
	.grey {
		color: #999;
	}
	
	.subtt {
		font-size: 17px;
	}
	
	.c-link {
		position: relative;
		color: #5cadff;
		cursor: pointer;
	}
	
	.c-link input {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
	}
	
	.win_tit {
		color: #404246;
		font-size: 16px;
		padding-bottom: 10px;
		font-weight: bold;
		padding-top: 20px;
		border-bottom: solid 1px #eee;
	}
	
	.win_tit:first-child {
		border-top: none;
	}
	
	.verify {
		background: #fff7f7;
	}
	
	.red {
		color: #ed3b3b;
	}
	
	.next_btn {
		width: 300px;
		margin-top: 40px;
	}
	
	.next_btn .ivu-btn-large {
		padding: 10px 15px;
		font-size: 16px;
		width: 100%;
	}
</style>

<template>

	<div>
		<div class="tit">广告</div>
		<h3 class="subtit">目标详情</h3>
		<Input v-model="product_refs_id" size="large" placeholder="请输入标的物ID" class="margin-top-20">
		<span slot="prepend">标的物ID</span>
		<span slot="append">{{product_refs_id.length}}/15</span>
		</Input>
		<h3 class="subtit">定向</h3>
		<div class="margin-top-20">
			<Select filterable size="large" placeholder="请选择定向" v-model="targeting_id" style="width:400px" @on-change="changetargetings">
				<Option v-for="item in targetings" :value="item.targeting_id" :key="this">{{item.targeting_name}}</Option>
			</Select>
			<span class="grey">下拉选择已有定向包</span>
		</div>
		<div class="ds_items margin-top-10">
			<div class="ds_item" v-bind:class="{ ds_item_on: city_modeal }">
				<div v-bind:class="{ verify: !verify_geo_location }">
					<div class="ds_tit">
						<span class="ds_item_hd">地域<em class="red" v-if="!verify_geo_location">请选择地区及地点类型</em></span>
						<i-switch class="ds_item_bd" v-model="city_modeal"></i-switch>
					</div>
					<div class="ds_box" v-if="city_modeal">
						<div v-if="regionsname.length>0">
							<p>已选择{{regionsname.length}}/{{citylistlength}}</p>
							<div class="ds_tag margin-top-10">
								<Tag class="margin-top-10" v-for="(item,index) in regionsname" :key="this" closable type="dot" color="default" @on-close="removecity(index)">{{item}}</Tag>
								<p>
									<Button type="text" @click="targeting_item.targeting.geo_location.regions=[]">清空</Button>
								</p>
							</div>
						</div>
						<!--城市选择-->
						<city-tree v-model="targeting_item.targeting.geo_location.regions"></city-tree>
						<CheckboxGroup class="margin-top-20" v-model="targeting_item.targeting.geo_location.location_types" v-if="plandata.campaign_type=='CAMPAIGN _TYPE_WECHAT_OFFICIAL_ ACCOUNTS'||plandata.campaign_type=='CAMPAIGN_TYPE_ WECHAT_MOMENTS'">
							<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.location_types" :key="this" v-if="item.val_type=='LIVE_IN'">{{item.name}}</Checkbox>
						</CheckboxGroup>
						<CheckboxGroup class="margin-top-20" v-model="targeting_item.targeting.geo_location.location_types" v-else-if="plandata.campaign_type=='CAMPAIGN _TYPE_NORMAL'">
							<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.location_types" :key="this" v-if="item.val_type=='VISITED_IN'">{{item.name}}</Checkbox>
						</CheckboxGroup>
						<CheckboxGroup class="margin-top-20" v-model="targeting_item.targeting.geo_location.location_types" v-else>
							<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.location_types" :key="this">{{item.name}}</Checkbox>
						</CheckboxGroup>
					</div>
				</div>
			</div>

			<div class="ds_item" v-bind:class="{ ds_item_on: age_modeal }">
				<div class="ds_tit">
					<span class="ds_item_hd">年龄</span>
					<i-switch class="ds_item_bd" v-model="age_modeal"></i-switch>
				</div>
				<div class="ds_box" v-if="age_modeal">
					<Row :gutter="15">
						<Col span="12">
						<Select v-model="age[0]">
							<Option v-for="item in 66" :value="item" v-if="item>=5" :disabled="item>age[1]" :key="this">
								<span v-if="item=='66'">{{ item }}岁以上</span>
								<span v-else>{{ item }}岁</span>
							</Option>
						</Select>
						</Col>
						<Col span="12">
						<Select v-model="age[1]">
							<Option v-for="item in 66" :value="item" v-if="item>=5" :disabled="age[0]>item" :key="this">
								<span v-if="item=='66'">{{ item }}岁以上</span>
								<span v-else>{{ item }}岁</span>
							</Option>
						</Select>
						</Col>
					</Row>
					<p class="margin-top-10 grey">由于国家政策，若投放酒类广告，系统只会向18岁以上受众展示</p>
				</div>
			</div>

			<div class="ds_item" v-bind:class="{ ds_item_on: gender_modeal }">
				<div class="ds_tit">
					<span class="ds_item_hd">性别</span>
					<i-switch class="ds_item_bd" v-model="gender_modeal"></i-switch>
				</div>
				<div class="ds_box" v-if="gender_modeal">
					<RadioGroup v-model="targeting_item.targeting.gender[0]">
						<Radio :label="item.val_type" size="large" v-for="item in ads_config.gender" :key="this">{{item.name}}</Radio>
					</RadioGroup>
				</div>
			</div>

			<div class="ds_item" v-bind:class="{ ds_item_on: business_modeal }">
				<div v-bind:class="{ verify: !verify_business_interest }">
					<div class="ds_tit">
						<span class="ds_item_hd">商业兴趣<em class="red" v-if="!verify_business_interest">请选择商业兴趣</em></span>
						<i-switch class="ds_item_bd" v-model="business_modeal"></i-switch>
					</div>
					<div class="ds_box" v-if="business_modeal">
						<div v-if="businessname.length>0">
							<p>已选择{{businessname.length}}/{{businesslength}}</p>
							<div class="ds_tag margin-top-10">
								<Tag class="margin-top-10" v-for="(item,index) in businessname" :key="this" closable type="dot" color="default" @on-close="removebusiness(index)">{{item}}</Tag>
								<p>
									<Button type="text" @click="targeting_item.targeting.business_interest=[]">清空</Button>
								</p>
							</div>
						</div>
						<Tree class="margin-top-10 citytree" :data="business" show-checkbox @on-check-change="businessidsCallback"></Tree>
					</div>
				</div>
			</div>

			<div class="ds_item" v-bind:class="{ ds_item_on: appCategory_modeal }">
				<div v-bind:class="{ verify: !verify_app_behavior }">
					<div class="ds_tit">
						<span class="ds_item_hd">App行为<em class="grey">特定类型App的活跃或付费用户</em><em class="red" v-if="!verify_app_behavior">请正确设置APP分类(最多10个)、用户类型、距今天数(1~365)
</em></span>
						<i-switch class="ds_item_bd" v-model="appCategory_modeal"></i-switch>
					</div>
					<div class="ds_box" v-if="appCategory_modeal">
						<RadioGroup v-model="targeting_item.targeting.app_behavior.object_type" class="ds_tag margin-bottom-10">
							<Radio size="large" label="APP_CLASS">按分类</Radio>
							<!--<Radio label="按App" size="large">按App</Radio>-->
						</RadioGroup>
						<div v-if="appCategoryname.length>0">
							<p>已选择</p>
							<div class="ds_tag margin-top-10">
								<Tag class="margin-top-10" v-for="(item,index) in appCategoryname" :key="this" closable type="dot" color="default" @on-close="removeappCategoryids(index)">{{item}}</Tag>
								<p>
									<Button type="text" @click="targeting_item.targeting.app_behavior.object_id_list=[]">清空</Button>
								</p>
							</div>
						</div>

						<Tree class="citytree" :data="appCategory" show-checkbox @on-check-change="CategoryidsCallback"></Tree>
						<div class="margin-top-10">
							<CheckboxGroup v-model="targeting_item.targeting.app_behavior.act_id_list">
								距离今天
								<Input v-model="targeting_item.targeting.app_behavior.time_window" style="width: 50px;"></Input>天内，该类APP的
								<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.act_id_list" :key="this">{{item.name}}</Checkbox>
								类型
							</CheckboxGroup>
						</div>
					</div>
				</div>
			</div>
			<div class="ds_item" v-bind:class="{ ds_item_on: app_install_status_modeal }">
				<div v-bind:class="{ verify: !verify_app_install_status }">
					<div class="ds_tit">
						<span class="ds_item_hd">App安装<em class="grey">已安装或未安装所推广App的用户</em></span>
						<i-switch class="ds_item_bd" v-model="app_install_status_modeal"></i-switch>
					</div>
					<div class="ds_box" v-if="app_install_status_modeal">
						<RadioGroup v-model="targeting_item.targeting.app_install_status[0]">
							<Radio :label="item.val_type" size="large" v-for="item in ads_config.app_install_status" :key="this">{{item.name}}</Radio>
						</RadioGroup>
					</div>
				</div>
			</div>

			<div class="ds_item" v-bind:class="{ ds_item_on: network_modeal }">
				<div v-bind:class="{ verify: !verify_network_type }">
					<div class="ds_tit">
						<span class="ds_item_hd">联网方式</span>
						<i-switch class="ds_item_bd" v-model="network_modeal"></i-switch>
					</div>
					<div class="ds_box" v-if="network_modeal">
						<CheckboxGroup v-model="targeting_item.targeting.network_type">
							<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.network_type" :key="this">{{item.name}}</Checkbox>
						</CheckboxGroup>
					</div>
				</div>
			</div>

			<div class="ds_item" v-bind:class="{ ds_item_on: Audiences_modeal }">
				<div v-bind:class="{ verify: !verify_Audiences }">
					<div class="ds_tit">
						<span class="ds_item_hd">自定义人群<em class="grey">选择特定人群用于投放</em></span>
						<i-switch class="ds_item_bd" v-model="Audiences_modeal"></i-switch>
					</div>
					<div class="ds_box" v-if="Audiences_modeal">
						<div class="subtt"><span>定向用户群</span>
							<Tooltip placement="top">
								<Icon type="help-circled" color="#999"></Icon>
								<div slot="content" style="white-space: normal">
									您的广告将仅投放到选定的人或目标场景中
								</div>
							</Tooltip>
						</div>
						<div class="margin-top-10" v-if="targeting_item.targeting.custom_audience.length>0">
							<p>已选择</p>
							<div class="ds_tag margin-top-10">
								<Tag class="margin-top-10" v-for="(item ,index) in targeting_item.targeting.custom_audience" :key="this" closable type="dot" color="default" @on-close="removeAudiencesids(index)">{{ item.name }}</Tag>
								<p>
									<Button type="text" @click="targeting_item.targeting.custom_audience=[]">清空</Button>
								</p>
							</div>
						</div>
						<Row>
							<Col span="12">
							<Input class="margin-top-10" icon="ios-search-strong" v-model="Audiencesname" @on-keyup="getAudiences()" placeholder="搜索用户群"></Input>
							</Col>
						</Row>
						<Table class="margin-top-10" height="200" :columns="Audiencescolumns" :data="custom_audience" size="small" @on-selection-change="taCheck" ref="selection"></Table>
						<div class="subtt margin-top-20"><span>排除用户群</span>
							<Tooltip placement="top">
								<Icon type="help-circled" color="#999"></Icon>
								<div slot="content" style="white-space: normal">
									您的广告将不会投放到选定的人或目标场景中
								</div>
							</Tooltip>
						</div>
						<div class="ds_tag margin-top-10" v-if="targeting_item.targeting.excluded_custom_audience.length>0">
							<p>已选择</p>
							<Tag class="margin-top-10" v-for="(item ,index) in targeting_item.targeting.excluded_custom_audience" :key="this" closable type="dot" color="default" @on-close="removeAudiencesids_ex(index)">{{ item.name }}</Tag>
							<p>
								<Button type="text" @click="targeting_item.targeting.excluded_custom_audience=[]">清空</Button>
							</p>
						</div>
						<Row>
							<Col span="12">
							<Input class="margin-top-10" icon="ios-search-strong" v-model="Audiencesname_ex" @on-keyup="getAudiences_ex()" placeholder="搜索用户群"></Input>
							</Col>
						</Row>
						<Table class="margin-top-10" height="200" :columns="Audiencescolumns" :data="excluded_custom_audience" size="small" @on-selection-change="taCheck_ex"></Table>
					</div>
				</div>
			</div>
			<div class="ds_item" v-bind:class="{ ds_item_on: paying_user_type_modeal }">
				<div v-bind:class="{ verify: !verify_paying_user_type }">
					<div class="ds_tit">
						<span class="ds_item_hd">付费用户<em class="grey">有网上付费行为的用户</em></span>
						<i-switch class="ds_item_bd" v-model="paying_user_type_modeal"></i-switch>
					</div>
					<div class="ds_box" v-if="paying_user_type_modeal">
						<CheckboxGroup v-model="targeting_item.targeting.paying_user_type">
							<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.paying_user_type" :key="this">{{item.name}}</Checkbox>
						</CheckboxGroup>
					</div>
				</div>
			</div>
			<Button class="margin-top-10" long icon="compose" size="large" @click="winshow=true">全部定向</Button>
			<p class="margin-top-10" style="color: #e88e00;">推广iOS应用，广告只会在iOS操作系统上展现</p>
			<!--<div>
				<Checkbox size="large" class="margin-top-10 grey">保存为定向包，下次创建广告直接使用</Checkbox>
			</div>-->

			<Input v-model="targeting_item.targeting_name" size="large" placeholder="请输入定向包名称" class="margin-top-10">
			<span slot="prepend">定向包名称</span>
			<span slot="append">{{targeting_item.targeting_name.length}}/15</span>
			</Input>

			<div class="margin-top-10 next_btn">
				<Button type="primary" size="large" @click="submitStepTwo">下一步</Button>
			</div>
		</div>

		<div class="ritht_fixed">
			<h3 class="fi_tit">所选定向</h3>
			<div class="fi_main">
				<p v-if="city_modeal">
					<span>地域：</span>
					<em v-for="item in regionsname">{{item}},</em>
				</p>
				<p v-if="city_modeal">
					<span>地点类型：</span>
					<em v-for="item in ads_config.location_types">
						<var v-for="subitem in targeting_item.targeting.geo_location.location_types">
							<var v-if="subitem==item.val_type">{{item.name}},</var>
						</var>
					</em>
				</p>
				<p v-if="age_modeal">
					<span>年龄：</span>
					<em v-if="age[1]=='66'">
						{{age[1]}}岁以上
					</em>
					<em v-else>
						{{age[0]}}至{{age[1]}}岁
					</em>;
				</p>
				<p v-if="gender_modeal">
					<span>性别：</span>
					<em v-for="item in ads_config.gender">
						<var v-if="targeting_item.targeting.gender[0]==item.val_type">{{item.name}}</var>
					</em>;
				</p>
				<p v-if="business_modeal">
					<span>商业兴趣：</span>
					<em v-for="item in businessname">{{item}},</em>
				</p>
				<p v-if="appCategory_modeal">
					<span>App行为：</span>
					<em v-for="item in appCategoryname">{{item}},</em>
					<em>距离今天{{targeting_item.targeting.app_behavior.time_window}}天内，该类APP的</em>
					<em v-for="item in ads_config.act_id_list">
						<var v-for="subitem in targeting_item.targeting.app_behavior.act_id_list">
							<var v-if="subitem==item.val_type">{{item.name}},</var>
						</var>
					</em>
				</p>
				<p v-if="app_install_status_modeal">
					<span>App安装：</span>
					<em v-for="item in ads_config.app_install_status">
						<var v-if="targeting_item.targeting.app_install_status[0]==item.val_type">{{item.name}}</var>
					</em>;
				</p>
				<p v-if="network_modeal">
					<span>联网方式：</span>
					<em v-for="item in ads_config.network_type">
						<var v-for="subitem in targeting_item.targeting.network_type">
							<var v-if="subitem==item.val_type">{{item.name}},</var>
						</var>
					</em>
				</p>
				<p v-if="Audiences_modeal">
					<span>定向用户群：</span>
					<em v-for="item in targeting_item.targeting.custom_audience">{{item.name}},</em>
				</p>
				<p v-if="Audiences_modeal">
					<span>排除用户群 ：</span>
					<em v-for="item in targeting_item.targeting.excluded_custom_audience">{{item.name}},</em>
				</p>
				<p v-if="education_modeal">
					<span>婚恋状态：</span>
					<em v-for="item in ads_config.education">
						<var v-for="subitem in targeting_item.targeting.education">
							<var v-if="subitem==item.val_type">{{item.name}},</var>
						</var>						
					</em>
				</p>
				<p v-if="living_status_modeal">
					<span>工作状态：</span>
					<em v-for="item in ads_config.living_status">
						<var v-for="subitem in targeting_item.targeting.living_status">
							<var v-if="subitem==item.val_type">{{item.name}},</var>
						</var>						
					</em>
				</p>
				<p v-if="word_modeal">
					<span>关键词 ：</span>
					<em v-for="item in targeting_item.targeting.keyword.words">{{item}},</em>
				</p>

				<p v-if="paying_user_type_modeal">
					<span>付费用户：</span>
					<em v-for="item in ads_config.paying_user_type">
						<var v-for="subitem in targeting_item.targeting.paying_user_type">
							<var v-if="subitem==item.val_type">{{item.name}},</var>
						</var>						
					</em>
				</p>
				<p v-if="shopping_capability_modeal">
					<span>消费状态：</span>
					<em v-for="item in ads_config.shopping_capability">
						<var v-for="subitem in targeting_item.targeting.shopping_capability">
							<var v-if="subitem==item.val_type">{{item.name}},</var>
						</var>						
					</em>
				</p>
				<p v-if="network_operator_modeal">
					<span>移动运营商：</span>
					<em v-for="item in ads_config.network_operator">
						<var v-for="subitem in targeting_item.targeting.network_operator">
							<var v-if="subitem==item.val_type">{{item.name}},</var>
						</var>						
					</em>
				</p>
				<p v-if="device_price_modeal">
					<span>设备价格：</span>
					<em v-for="item in ads_config.device_price">
						<var v-for="subitem in targeting_item.targeting.device_price">
							<var v-if="subitem==item.val_type">{{item.name}},</var>
						</var>						
					</em>
				</p>
			</div>

			<h3 class="fi_tit">预计最大覆盖用户</h3>
			<p><span class="fi_user_count">279,603,200</span>人</p>
			<h3 class="fi_tit margin-top-20">预计最大日曝光量</h3>
			<p><span class="fi_user_count">2,035,865,600</span>次</p>
		</div>

		<!--弹出层-->
		<Modal v-model="winshow" title="全部定向" width="900">
			<div class="ds_items">
				<div class="win_tit">人口属性</div>
				<div class="ds_item" v-bind:class="{ ds_item_on: city_modeal }">
					<div v-bind:class="{ verify: !verify_geo_location }">
						<div class="ds_tit">
							<span class="ds_item_hd">地域<em class="red" v-if="!verify_geo_location">请选择地区及地点类型</em></span>
							<i-switch class="ds_item_bd" v-model="city_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="city_modeal">
							<div v-if="regionsname.length>0">
								<p>已选择{{regionsname.length}}/{{citylistlength}}</p>
								<div class="ds_tag margin-top-10">
									<Tag class="margin-top-10" v-for="(item,index) in regionsname" :key="this" closable type="dot" color="default" @on-close="removecity(index)">{{item}}</Tag>
									<p>
										<Button type="text" @click="targeting_item.targeting.geo_location.regions=[]">清空</Button>
									</p>
								</div>
							</div>
							<!--城市选择-->
							<city-tree v-model="targeting_item.targeting.geo_location.regions"></city-tree>

							<CheckboxGroup class="margin-top-20" v-model="targeting_item.targeting.geo_location.location_types">
								<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.location_types" :key="this">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</div>
					</div>
				</div>

				<div class="ds_item" v-bind:class="{ ds_item_on: age_modeal }">
					<div class="ds_tit">
						<span class="ds_item_hd">年龄</span>
						<i-switch class="ds_item_bd" v-model="age_modeal"></i-switch>
					</div>
					<div class="ds_box" v-if="age_modeal">
						<Row :gutter="15">
							<Col span="12">
							<Select v-model="age[0]">
								<Option v-for="item in 66" :value="item" v-if="item>=5" :disabled="item>age[1]" :key="this">
									<span v-if="item=='66'">{{ item }}岁以上</span>
									<span v-else>{{ item }}岁</span>
								</Option>
							</Select>
							</Col>
							<Col span="12">
							<Select v-model="age[1]">
								<Option v-for="item in 66" :value="item" v-if="item>=5" :disabled="age[0]>item" :key="this">
									<span v-if="item=='66'">{{ item }}岁以上</span>
									<span v-else>{{ item }}岁</span>
								</Option>
							</Select>
							</Col>
						</Row>
						<p class="margin-top-10 grey">由于国家政策，若投放酒类广告，系统只会向18岁以上受众展示</p>
					</div>
				</div>

				<div class="ds_item" v-bind:class="{ ds_item_on: gender_modeal }">
					<div class="ds_tit">
						<span class="ds_item_hd">性别</span>
						<i-switch class="ds_item_bd" v-model="gender_modeal"></i-switch>
					</div>
					<div class="ds_box" v-if="gender_modeal">
						<RadioGroup v-model="targeting_item.targeting.gender[0]">
							<Radio :label="item.val_type" size="large" v-for="item in ads_config.gender" :key="this">{{item.name}}</Radio>
						</RadioGroup>
					</div>
				</div>

				<div class="ds_item" v-bind:class="{ ds_item_on: education_modeal }">
					<div v-bind:class="{ verify: !verify_education }">
						<div class="ds_tit">
							<span class="ds_item_hd">婚恋状态</span>
							<i-switch class="ds_item_bd" v-model="education_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="education_modeal">
							<CheckboxGroup v-model="targeting_item.targeting.education">
								<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.education" :key="this">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</div>
					</div>
				</div>

				<div class="ds_item" v-bind:class="{ ds_item_on: living_status_modeal }">
					<div v-bind:class="{ verify: !verify_living_status }">
						<div class="ds_tit">
							<span class="ds_item_hd">工作状态</span>
							<i-switch class="ds_item_bd" v-model="living_status_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="living_status_modeal">
							<CheckboxGroup v-model="targeting_item.targeting.living_status">
								<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.living_status" :key="this">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</div>
					</div>
				</div>

				<div class="win_tit">用户兴趣</div>
				<div class="ds_item" v-bind:class="{ ds_item_on: business_modeal }">
					<div v-bind:class="{ verify: !verify_business_interest }">
						<div class="ds_tit">
							<span class="ds_item_hd">商业兴趣<em class="red" v-if="!verify_business_interest">请选择商业兴趣</em></span>
							<i-switch class="ds_item_bd" v-model="business_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="business_modeal">
							<div v-if="businessname.length>0">
								<p>已选择{{businessname.length}}/{{businesslength}}</p>
								<div class="ds_tag margin-top-10">
									<Tag class="margin-top-10" v-for="(item,index) in businessname" :key="this" closable type="dot" color="default" @on-close="removebusiness(index)">{{item}}</Tag>
									<p>
										<Button type="text" @click="targeting_item.targeting.business_interest=[]">清空</Button>
									</p>
								</div>
							</div>
							<Tree class="margin-top-10 citytree" :data="business" show-checkbox @on-check-change="businessidsCallback"></Tree>
						</div>
					</div>
				</div>

				<div class="ds_item" v-bind:class="{ ds_item_on: word_modeal }">
					<div v-bind:class="{ verify: !verify_words }">
						<div class="ds_tit">
							<span class="ds_item_hd">关键词<em class="grey">对指定关键词感兴趣的用户</em><em class="red" v-if="!verify_words">请输入关键字,最大长度 500,字段长度最大 30 字节</em></span>
							<i-switch class="ds_item_bd" v-model="word_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="word_modeal">
							<div v-if="targeting_item.targeting.keyword.words.length>0">
								<p>已输入{{targeting_item.targeting.keyword.words.length}}</p>
								<div class="ds_tag">
									<Tag class="margin-top-10" v-for="(item,index) in targeting_item.targeting.keyword.words" :key="this" closable type="dot" color="default" @on-close="removeword(index)">{{item}}</Tag>
									<p>
										<Button type="text" @click="targeting_item.targeting.keyword.words=[]">清空</Button>
									</p>
								</div>
							</div>
							<Input class="margin-top-10" placeholder="输入关键词，回车键(enter)提交" clearable v-model="newword" @on-enter="addword" :maxlength="30"></Input>

							<div class="margin-top-10">
								<Tooltip placement="top">
									<span class="c-link">上传关键词<input type="file" accept="txt" capture="camera" @change="readFileword" multiple="multiple"> </span>

									<div slot="content" style="white-space: normal">一行一个关键词，不支持标点符号隔开，最多2000个关键词</div>
								</Tooltip>
								(.TXT文件)</div>
						</div>
					</div>
				</div>

				<div class="win_tit">用户行为</div>

				<div class="ds_item" v-bind:class="{ ds_item_on: appCategory_modeal }">
					<div v-bind:class="{ verify: !verify_app_behavior }">
						<div class="ds_tit">
							<span class="ds_item_hd">App行为<em class="grey">特定类型App的活跃或付费用户</em><em class="red" v-if="!verify_app_behavior">请正确设置APP分类(最多10个)、用户类型、距今天数(1~365)
</em></span>
							<i-switch class="ds_item_bd" v-model="appCategory_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="appCategory_modeal">
							<RadioGroup v-model="targeting_item.targeting.app_behavior.object_type" class="ds_tag margin-bottom-10">
								<Radio size="large" label="APP_CLASS">按分类</Radio>
								<!--<Radio label="按App" size="large">按App</Radio>-->
							</RadioGroup>
							<div v-if="appCategoryname.length>0">
								<p>已选择</p>
								<div class="ds_tag margin-top-10">
									<Tag class="margin-top-10" v-for="(item,index) in appCategoryname" :key="this" closable type="dot" color="default" @on-close="removeappCategoryids(index)">{{item}}</Tag>
									<p>
										<Button type="text" @click="targeting_item.targeting.app_behavior.object_id_list=[]">清空</Button>
									</p>
								</div>
							</div>

							<Tree class="citytree" :data="appCategory" show-checkbox @on-check-change="CategoryidsCallback"></Tree>
							<div class="margin-top-10">
								<CheckboxGroup v-model="targeting_item.targeting.app_behavior.act_id_list">
									距离今天
									<Input v-model="targeting_item.targeting.app_behavior.time_window" style="width: 50px;"></Input>天内，该类APP的
									<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.act_id_list" :key="this">{{item.name}}</Checkbox>
									类型
								</CheckboxGroup>
							</div>
						</div>
					</div>
				</div>
				<div class="ds_item" v-bind:class="{ ds_item_on: app_install_status_modeal }">
					<div v-bind:class="{ verify: !verify_app_install_status }">
						<div class="ds_tit">
							<span class="ds_item_hd">App安装<em class="grey">已安装或未安装所推广App的用户</em></span>
							<i-switch class="ds_item_bd" v-model="app_install_status_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="app_install_status_modeal">
							<RadioGroup v-model="targeting_item.targeting.app_install_status[0]">
								<Radio :label="item.val_type" size="large" v-for="item in ads_config.app_install_status" :key="this">{{item.name}}</Radio>
							</RadioGroup>
						</div>
					</div>
				</div>

				<div class="win_tit">自定义人群</div>
				<div class="ds_item" v-bind:class="{ ds_item_on: Audiences_modeal }">
					<div v-bind:class="{ verify: !verify_Audiences }">
						<div class="ds_tit">
							<span class="ds_item_hd">自定义人群<em class="grey">选择特定人群用于投放</em></span>
							<i-switch class="ds_item_bd" v-model="Audiences_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="Audiences_modeal">
							<div class="subtt"><span>定向用户群</span>
								<Tooltip placement="top">
									<Icon type="help-circled" color="#999"></Icon>
									<div slot="content" style="white-space: normal">
										您的广告将仅投放到选定的人或目标场景中
									</div>
								</Tooltip>
							</div>
							<div class="margin-top-10" v-if="targeting_item.targeting.custom_audience.length>0">
								<p>已选择</p>
								<div class="ds_tag margin-top-10">
									<Tag class="margin-top-10" v-for="(item ,index) in targeting_item.targeting.custom_audience" :key="this" closable type="dot" color="default" @on-close="removeAudiencesids(index)">{{ item.name }}</Tag>
									<p>
										<Button type="text" @click="targeting_item.targeting.custom_audience=[]">清空</Button>
									</p>
								</div>
							</div>
							<Row>
								<Col span="12">
								<Input class="margin-top-10" icon="ios-search-strong" v-model="Audiencesname" @on-keyup="getAudiences()" placeholder="搜索用户群"></Input>
								</Col>
							</Row>
							<Table class="margin-top-10" height="200" :columns="Audiencescolumns" :data="custom_audience" size="small" @on-selection-change="taCheck"></Table>
							<div class="subtt margin-top-20"><span>排除用户群</span>
								<Tooltip placement="top">
									<Icon type="help-circled" color="#999"></Icon>
									<div slot="content" style="white-space: normal">
										您的广告将不会投放到选定的人或目标场景中
									</div>
								</Tooltip>
							</div>
							<div class="ds_tag margin-top-10" v-if="targeting_item.targeting.excluded_custom_audience.length>0">
								<p>已选择</p>
								<Tag class="margin-top-10" v-for="(item ,index) in targeting_item.targeting.excluded_custom_audience" :key="this" closable type="dot" color="default" @on-close="removeAudiencesids_ex(index)">{{ item.name }}</Tag>
								<p>
									<Button type="text" @click="targeting_item.targeting.excluded_custom_audience=[]">清空</Button>
								</p>
							</div>
							<Row>
								<Col span="12">
								<Input class="margin-top-10" icon="ios-search-strong" v-model="Audiencesname_ex" @on-keyup="getAudiences_ex()" placeholder="搜索用户群"></Input>
								</Col>
							</Row>
							<Table class="margin-top-10" height="200" :columns="Audiencescolumns" :data="excluded_custom_audience" size="small" @on-selection-change="taCheck_ex"></Table>
						</div>
					</div>
				</div>

				<div class="win_tit">消费能力</div>
				<div class="ds_item" v-bind:class="{ ds_item_on: paying_user_type_modeal }">
					<div v-bind:class="{ verify: !verify_paying_user_type }">
						<div class="ds_tit">
							<span class="ds_item_hd">付费用户<em class="grey">有网上付费行为的用户</em></span>
							<i-switch class="ds_item_bd" v-model="paying_user_type_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="paying_user_type_modeal">
							<CheckboxGroup v-model="targeting_item.targeting.paying_user_type">
								<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.paying_user_type" :key="this">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</div>
					</div>
				</div>
				<div class="ds_item" v-bind:class="{ ds_item_on: shopping_capability_modeal }">
					<div v-bind:class="{ verify: !verify_shopping_capability }">
						<div class="ds_tit">
							<span class="ds_item_hd">消费状态</span>
							<i-switch class="ds_item_bd" v-model="shopping_capability_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="shopping_capability_modeal">
							<CheckboxGroup v-model="targeting_item.targeting.shopping_capability">
								<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.shopping_capability" :key="this">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</div>
					</div>
				</div>
				<div class="win_tit">设备定向</div>
				<div class="ds_item" v-bind:class="{ ds_item_on: network_modeal }">
					<div v-bind:class="{ verify: !verify_network_type }">
						<div class="ds_tit">
							<span class="ds_item_hd">联网方式</span>
							<i-switch class="ds_item_bd" v-model="network_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="network_modeal">
							<CheckboxGroup v-model="targeting_item.targeting.network_type">
								<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.network_type" :key="this">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</div>
					</div>
				</div>

				<div class="ds_item " v-bind:class="{ ds_item_on: network_operator_modeal }">
					<div v-bind:class="{ verify: !verify_network_operator }">
						<div class="ds_tit">
							<span class="ds_item_hd">移动运营商</span>
							<i-switch class="ds_item_bd" v-model="network_operator_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="network_operator_modeal">
							<CheckboxGroup v-model="targeting_item.targeting.network_operator">
								<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.network_operator" :key="this">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</div>
					</div>
				</div>

				<div class="ds_item" v-bind:class="{ ds_item_on: device_price_modeal }">
					<div v-bind:class="{ verify: !verify_device_price }">
						<div class="ds_tit">
							<span class="ds_item_hd">设备价格</span>
							<i-switch class="ds_item_bd" v-model="device_price_modeal"></i-switch>
						</div>
						<div class="ds_box" v-if="device_price_modeal">
							<CheckboxGroup v-model="targeting_item.targeting.device_price">
								<Checkbox :label="item.val_type" size="large" v-for="item in ads_config.device_price" :key="this">{{item.name}}</Checkbox>
							</CheckboxGroup>
						</div>
					</div>
				</div>
			</div>
		</Modal>

	</div>
</template>

<script>
	import Axios from '@/api/index';
	import cityTree from './cityTree.vue';
	export default {
		name: 'stepTwo',
		props: ['plandata', 'callback'],
		components: {
			cityTree
		},
		data() {
			return {
				account_id: this.$route.params.account_id,
				targeting_id: '0',
				product_refs_id: '',
				targeting_item: {
					"account_id": "",
					"id": "",
					"targeting_id": "", //定向id 
					"targeting_name": "", //定向名称
					"targeting": {
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
				citylistlength: 0,
				city_modeal: false, //城市switch
				age: [5, 60], //年龄
				age_modeal: false, //年龄switch
				gender: [],
				gender_modeal: false, //性别switch
				businesslength: 0,
				business_modeal: false, //商业兴趣switch
				network_modeal: false, //联网方式switch
				app_install_status_modeal: false, //App安装switch
				network_operator_modeal: false, //移动运营商switch
				education_modeal: false, //婚恋状态switch
				living_status_modeal: false, //工作状态switch
				device_price_modeal: false, //设备价格switch
				shopping_capability_modeal: false, //消费状态switch
				paying_user_type_modeal: false, //付费用户switch								
				word_modeal: false, //关健词switch
				newword: '', //新增关健词
				winshow: false,
				Audiences_modeal: false, //自定义人群switch
				Audiencescolumns: [{ //自定义人群表格
						type: 'selection',
						width: 60,
						align: 'center'
					}, {
						title: '用户群名称',
						key: 'name'
					},
					{
						title: 'ID',
						key: 'id'
					},
					{
						title: '覆盖数量',
						key: 'user_count'
					}
				],
				Audiencesname: '', //自定义人群搜索关键词
				Audiencesname_ex: '', //自定义人群搜索关键词排除
				appCategory_modeal: false, //app行为switch			
			}
		},
		mounted() {
			if(this.targeting_id) {
				this.targeting_id = this.$route.params.targeting_id;
			};
			//请求定向
			this.$store.dispatch('get_targetings',this.account_id);
			//请求定向标签(地域)
			this.$store.dispatch('get_targeting_tags');
			//获取商业兴趣
			this.$store.dispatch('get_business_interest');
			//app行为按分类
			this.$store.dispatch('get_appCategory');
			//获取自定义人群
			this.getAudiences();
			this.getAudiences_ex();
		},
		methods: {
			getAudiences() {
				//获取自定义人群
				let data = {
					account_id: this.account_id,
					name: this.Audiencesname
				}
				this.$store.dispatch('get_CustomAudiences', data);
			},
			getAudiences_ex() {
				//获取自定义人群排除
				let data = {
					account_id: this.account_id,
					name: this.Audiencesname_ex
				}
				this.$store.dispatch('get_CustomAudiences_ex', data);
			},
			//选择定向
			changetargetings(targeting_id) {			
				this.targetings.forEach(item => {
					console.log(this.targeting_id,item.targeting_id)
					if(item.targeting_id == targeting_id) {						
						this.targeting_item = item;
						var result = item.targeting.age[0].split("~");
						this.age = [parseInt(result[0]), parseInt(result[1])];
						//地域
						if(item.targeting.geo_location.regions.length > 0 || item.targeting.geo_location.location_types.length > 0) {
							this.city_modeal = true;
						} else {
							this.city_modeal = false;
						}
						//年龄
						if(item.targeting.age[0]) {
							this.age_modeal = true;
						} else {
							this.age_modeal = false;
						}
						//性别
						if(item.targeting.gender[0]) {
							this.gender_modeal = true;
						} else {
							this.gender_modeal = false;
						}
						//商业兴趣
						if(item.targeting.business_interest.length > 0) {
							this.business_modeal = true;
						} else {
							this.business_modeal = false;
						}
						//App行为
						if(item.targeting.app_behavior.object_id_list.length > 0) {
							this.appCategory_modeal = true;
						} else {
							this.appCategory_modeal = false;
						}
						//app安装
						if(item.targeting.app_install_status[0]) {
							this.app_install_status_modeal = true;
						} else {
							this.app_install_status_modeal = false;
						}
						//联网方式
						if(item.targeting.network_type.length > 0) {
							this.network_modeal = true;
						} else {
							this.network_modeal = false;
						}
						//付费用户
						if(item.targeting.paying_user_type.length > 0) {
							this.paying_user_type_modeal = true;
						} else {
							this.paying_user_type_modeal = false;
						}
						//自定义人群
						if(item.targeting.custom_audience.length > 0 || item.targeting.excluded_custom_audience.length > 0) {
							this.Audiences_modeal = true;
						} else {
							this.Audiences_modeal = false;
						}
						//婚恋状态
						if(item.targeting.education.length > 0) {
							this.education_modeal = true;
						} else {
							this.education_modeal = false;
						}
						//工作状态
						if(item.targeting.living_status.length > 0) {
							this.living_status_modeal = true;
						} else {
							this.living_status_modeal = false;
						}
						//关键字
						if(item.targeting.keyword.words.length > 0) {
							this.word_modeal = true;
						} else {
							this.word_modeal = false;
						}
						//消费状态
						if(item.targeting.shopping_capability.length > 0) {
							this.shopping_capability_modeal = true;
						} else {
							this.shopping_capability_modeal = false;
						}
						//移动运营商
						if(item.targeting.network_operator.length > 0) {
							this.network_operator_modeal = true;
						} else {
							this.network_operator_modeal = false;
						}
						//设备价格
						if(item.targeting.device_price.length > 0) {
							this.device_price_modeal = true;
						} else {
							this.device_price_modeal = false;
						}
					}
				});
			},
			//删除城市
			removecity(index) {
				this.targeting_item.targeting.geo_location.regions.splice(index, 1);
			},
			//商业兴趣返回ids			
			businessidsCallback(data) {
				var ids = [],
					name = '';
				data.forEach(item => {
					if(!item.children) {
						ids.push(item.label);
					}
				})
				this.targeting_item.targeting.business_interest = ids;
			},
			//删除商业兴趣
			removebusiness(index) {
				this.targeting_item.targeting.business_interest.splice(index, 1);
			},
			//删除app行为
			removeappCategoryids(index) {
				this.targeting_item.targeting.app_behavior.object_id_list.splice(index, 1);
			},
			//app行为返回ids			
			CategoryidsCallback(data) {
				var ids = [],
					name = '';
				data.forEach(item => {
					if(!item.children) {
						ids.push(item.label);
					}
				})
				this.targeting_item.targeting.app_behavior.object_id_list = ids;
			},
			//删除关健词
			removeword(index) {
				this.targeting_item.targeting.keyword.words.splice(index, 1);
			},
			//添加关健词
			addword() {
				let has = false;
				//关健词是否已有
				this.targeting_item.targeting.keyword.words.forEach(item => {
					if(item == this.newword) {
						has = true;
					}
				})
				if(!has && this.newword != "" && this.newword.length <= 30) {
					this.targeting_item.targeting.keyword.words.push(this.newword);
					this.newword = "";
				}
			},
			//上传关健词
			readFileword(e) {
				var that = this;
				var tmpFile = e.target.files;
				for(var i = 0; i < tmpFile.length; i++) {
					var file = tmpFile[i];
					if(!/text\/\w+/.test(file.type)) { //判断是否是txt类型					
						that.$Message.info('格式不对');
						return false;
					}
					var reader = new FileReader();
					reader.readAsText(file, "gb2312");
					reader.onload = function(e) {
						var fileText = e.target.result.split("\n");
						for(var j = 0; j < fileText.length; j++) {
							if(fileText[j].length <= 30) {
								that.targeting_item.targeting.keyword.words.push(fileText[j]);
							}
						}
					}
				}
			},
			//获取自定义人群选中的id
			taCheck(row) {
				let ids = [];
				row.forEach(item => {
					ids.push(item)
				});
				this.targeting_item.targeting.custom_audience = ids;
			},
			//删除自定义人群选中的id
			removeAudiencesids(index) {
				this.targeting_item.targeting.custom_audience.splice(index, 1);
			},
			//获取自定义人群选中的id排除
			taCheck_ex(row) {
				let ids = [];
				row.forEach(item => {
					ids.push(item)
				});
				this.targeting_item.targeting.excluded_custom_audience = ids;
			},

			//删除自定义人群选中的id排除
			removeAudiencesids_ex(index) {
				this.targeting_item.targeting.excluded_custom_audience.splice(index, 1);
			},
			//下一步
			submitStepTwo() {
				if(this.targeting_item.targeting_name == '') {
					this.$Message.info('请输入定向包名称');
					return;
				}
				if(this.targeting_item.targeting_name.length > 15) {
					this.$Message.info('定向包名称超出字数限制');
					return;
				}

				if(this.product_refs_id == '') {
					this.$Message.info('请输入标的物id');
					return;
				}
				if(this.product_refs_id.length > 15) {
					this.$Message.info('请输入标的物id超出字数限制');
					return;
				}

				let targeting = {};

				//验证地理位置
				if(this.city_modeal) {
					if(this.verify_geo_location) {
						targeting.geo_location = this.targeting_item.targeting.geo_location;
					} else {
						return;
					}
				}
				//验证商业兴趣
				if(this.business_modeal) {
					if(this.verify_business_interest) {
						targeting.business_interest = this.targeting_item.targeting.business_interest;
					} else {
						return;
					}
				}
				//验证app行为
				if(this.appCategory_modeal) {
					if(this.verify_app_behavior) {
						targeting.app_behavior = this.targeting_item.targeting.app_behavior;
					} else {
						return;
					}
				}
				//验证app安装
				if(this.app_install_status_modeal) {
					if(this.verify_app_install_status) {
						targeting.app_install_status = this.targeting_item.targeting.app_install_status;
					} else {
						return;
					}
				}
				//验证联网方式
				if(this.network_modeal) {
					if(this.verify_network_type) {
						targeting.network_type = this.targeting_item.targeting.network_type;
					} else {
						return;
					}
				}
				//验证付费用户
				if(this.paying_user_type_modeal) {
					if(this.verify_paying_user_type) {
						targeting.paying_user_type = this.targeting_item.targeting.paying_user_type;
					} else {
						return;
					}
				}
				//验证自定义人群
				if(this.Audiences_modeal) {
					if(this.verify_Audiences) {
						targeting.custom_audience = this.targeting_item.targeting.custom_audience;
						targeting.excluded_custom_audience = this.targeting_item.targeting.excluded_custom_audience;
					} else {
						return;
					}
				}
				//验证婚恋状态
				if(this.education_modeal) {
					if(this.verify_education) {
						targeting.education = this.targeting_item.targeting.education;
					} else {
						return;
					}
				}
				//验证工作状态
				if(this.living_status_modeal) {
					if(this.verify_living_status) {
						targeting.living_status = this.targeting_item.targeting.living_status;
					} else {
						return;
					}
				}
				//验证关键字
				if(this.word_modeal) {
					if(this.verify_words) {
						targeting.keyword = this.targeting_item.targeting.keyword;
					} else {
						return;
					}
				}
				//验证消费状态
				if(this.shopping_capability_modeal) {
					if(this.verify_shopping_capability) {
						targeting.shopping_capability = this.targeting_item.targeting.shopping_capability;
					} else {
						return;
					}
				}
				//验证移动运营商
				if(this.network_operator_modeal) {
					if(this.verify_network_operator) {
						targeting.network_operator = this.targeting_item.targeting.network_operator;
					} else {
						return;
					}
				}
				//验证设备价格
				if(this.device_price_modeal) {
					if(this.verify_device_price) {
						targeting.device_price = this.targeting_item.targeting.device_price;
					} else {
						return;
					}
				}

				Axios.post('api.php', {
					action: 'gdtAdPut',
					opt: 'targetings_add',
					do: 'edit',
					account_id: this.account_id,
					id: this.targeting_item.id,
					targeting_name: this.targeting_item.targeting_name,
					targeting: JSON.stringify(targeting)
				}).then(res => {
					if(res.ret == 1) {
						this.callback(res.data.targeting_id, this.targeting_item, this.product_refs_id);
						this.$Message.info(res.msg);
					}
				}).catch(err => console.log('添加/修改定向' + err))
			}
		},
		watch: {
			age(val) {
				let age = [];
				age.push(val[0] + '~' + val[1]);
				this.targeting_item.targeting.age = age;
			},
			targeting_tags() {},
		},
		computed: {

			//获取自定义人群
			custom_audience() {
				return this.$store.state.newad.CustomAudiences.list;
			},
			//获取自定义人群排除
			excluded_custom_audience() {
				return this.$store.state.newad.CustomAudiences_ex.list;
			},

			//获取所有状态
			ads_config() {
				return this.$store.state.newad.ads_config;
			},

			//获取定向
			targetings() {
				let list = this.$store.state.newad.targetings.list;
				list.unshift({
					"account_id": "",
					"id": "",
					"targeting_id": 0, //定向id 
					"targeting_name": "新建定向", //定向名称
					"targeting": {
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
				});
				return list;
			},
			//商业兴趣转码
			businessname() {
				var name = [];
				let ids = this.targeting_item.targeting.business_interest;
				ids.forEach(id => {
					for(var i in this.business) {
						var e = this.business[i].children;
						for(var j in e) {
							var f = e[j];
							if(f.label == id) {
								name.push(f.title)
							}
							for(var k in f.children) {
								var n = f.children[k];
								if(n.label == id) {
									name.push(n.title)
								}
							}
						}
					}
				});
				return name;
			},
			//获取商业兴趣
			business() {
				let list = this.$store.state.newad.business_interest;
				let ids = this.targeting_item.targeting.business_interest;
				let n = 0;
				let newlist = [];
				list.forEach((item, i) => {
					let children = [];
					var expand = false;
					item.list.forEach(item => {
						n++
						let children2 = [];
						var check = false;
						if(ids) {
							ids.forEach(v => {
								if(v == item.id) {
									expand = true
									check = true;
								}
							})
						}
						if(item.list) {
							item.list.forEach(item => {
								var check1 = false;
								if(ids) {
									ids.forEach(v => {
										if(v == item.id) {
											expand = true
											check1 = true;
										}
									})
								}
								let newitem = {
									title: item.name,
									label: item.id,
									expand: true,
									checked: check1
								}
								children2.push(newitem)
							})
						}
						if(children2.length == 0) {
							let newitem = {
								title: item.name,
								label: item.id,
								expand: expand,
								checked: check,
							}
							children.push(newitem)
						} else {
							let newitem = {
								title: item.name,
								label: item.id,
								expand: expand,
								checked: check,
								children: children2
							}
							children.push(newitem)
						}
					});
					let newitem = {
						title: item.name,
						label: item.id,
						expand: expand,
						children: children
					}
					newlist.push(newitem)
				});
				this.businesslength = n;
				return newlist;
			},
			//省市区转码(地域)
			regionsname() {
				let name = [];
				let ids = this.targeting_item.targeting.geo_location.regions;
				ids.forEach(id => {
					for(var i in this.targeting_tags) {
						var e = this.targeting_tags[i].children;
						for(var j in e) {
							var f = e[j];
							if(f.label == id) {
								name.push(f.title)
							}
						}
					}
				});
				return name;
			},
			//获取定向标签(地域)
			targeting_tags() {
				let list = this.$store.state.newad.targeting_tags;
				let ids = this.targeting_item.targeting.geo_location.regions;
				let n = 0;
				let newlist = [];
				list.forEach((item, i) => {
					let children = [];
					let expand = false;
					item.list.forEach(item => {
						n++
						var check = false;
						if(ids) {
							ids.forEach(v => {
								if(v == item.id) {
									expand = true
									check = true;
								}
							})
						}
						let newitem = {
							title: item.name,
							label: item.id,
							expand: true,
							checked: check
						}
						children.push(newitem)
					});
					let newitem = {
						title: item.name,
						label: item.id,
						expand: expand,
						children: children
					}
					newlist.push(newitem)
				});
				this.citylistlength = n;
				return newlist;
			},
			//app定向转码
			appCategoryname() {
				var name = [];
				let ids = this.targeting_item.targeting.app_behavior.object_id_list;
				ids.forEach(id => {
					for(var i in this.appCategory) {
						var e = this.appCategory[i].children;
						for(var j in e) {
							var f = e[j];
							if(f.label == id) {
								name.push(f.title)
							}
							for(var k in f.children) {
								var n = f.children[k];
								if(n.label == id) {
									name.push(n.title)
								}
							}
						}
					}
				});
				return name;
			},
			//app行为按分类
			appCategory() {
				let list = this.$store.state.newad.appCategory;
				let ids = this.targeting_item.targeting.app_behavior.object_id_list
				let newlist = [];
				list.forEach((item, i) => {
					let children = [];
					var expand = false;
					item.list.forEach(item => {
						let children2 = [];
						var check = false;
						if(ids) {
							ids.forEach(v => {
								if(v == item.id) {
									expand = true
									check = true;
								}
							})
						}
						if(item.list) {
							item.list.forEach(item => {
								var check1 = false;
								if(ids) {
									ids.forEach(v => {
										if(v == item.id) {
											expand = true
											check1 = true;
										}
									})
								}
								let newitem = {
									title: item.name,
									label: item.id,
									expand: true,
									checked: check1
								}
								children2.push(newitem)
							})
						}
						if(children2.length == 0) {
							let newitem = {
								title: item.name,
								label: item.id,
								expand: expand,
								checked: check,
							}
							children.push(newitem)
						} else {
							let newitem = {
								title: item.name,
								label: item.id,
								expand: expand,
								checked: check,
								children: children2
							}
							children.push(newitem)
						}
					});
					let newitem = {
						title: item.name,
						label: item.id,
						expand: expand,
						children: children
					}
					newlist.push(newitem)
				});
				return newlist;
			},

			//验证地理位置
			verify_geo_location() {
				let geo_location = this.targeting_item.targeting.geo_location;
				if(!this.city_modeal) {
					return true;
				} else if(geo_location.regions.length <= 0 || geo_location.location_types.length <= 0) {
					return false;
				} else {
					return true;
				}
			},
			//验证商业兴趣
			verify_business_interest() {
				if(!this.business_modeal) {
					return true;
				} else if(this.businessname.length <= 0) {
					return false;
				} else {
					return true;
				}
			},
			//验证app行为
			verify_app_behavior() {
				let app_behavior = this.targeting_item.targeting.app_behavior;
				if(!this.appCategory_modeal) {
					return true;
				} else if(app_behavior.time_window == '' || app_behavior.act_id_list.length <= 0 || app_behavior.object_id_list.length <= 0 || app_behavior.object_id_list.length > 10) {
					return false;
				} else {
					return true;
				}
			},
			//验证app安装
			verify_app_install_status() {
				let app_install_status = this.targeting_item.targeting.app_install_status;
				if(!this.app_install_status_modeal) {
					return true;
				} else if(!app_install_status[0]) {
					return false;
				} else {
					return true;
				}
			},
			//验证联网方式
			verify_network_type() {
				let network_type = this.targeting_item.targeting.network_type;
				if(!this.network_modeal) {
					return true;
				} else if(network_type.length <= 0) {
					return false;
				} else {
					return true;
				}
			},
			//验证付费用户
			verify_paying_user_type() {
				let paying_user_type = this.targeting_item.targeting.paying_user_type;
				if(!this.paying_user_type_modeal) {
					return true;
				} else if(paying_user_type.length <= 0) {
					return false;
				} else {
					return true;
				}
			},
			//验证自定义人群
			verify_Audiences() {
				let custom_audience = this.targeting_item.targeting.custom_audience;
				let excluded_custom_audience = this.targeting_item.targeting.excluded_custom_audience;
				if(!this.Audiences_modeal) {
					return true;
				} else if(custom_audience.length <= 0 && excluded_custom_audience.length <= 0) {
					return false;
				} else {
					return true;
				}
			},

			//验证婚恋状态
			verify_education() {
				let education = this.targeting_item.targeting.education;
				if(!this.education_modeal) {
					return true;
				} else if(education.length <= 0) {
					return false;
				} else {
					return true;
				}
			},
			//验证工作状态
			verify_living_status() {
				let living_status = this.targeting_item.targeting.living_status;
				if(!this.living_status_modeal) {
					return true;
				} else if(living_status.length <= 0) {
					return false;
				} else {
					return true;
				}
			},
			//验证关键字
			verify_words() {
				let words = this.targeting_item.targeting.keyword.words;
				if(!this.word_modeal) {
					return true;
				} else if(words.length <= 0 || words.length >= 500) {
					return false;
				} else {
					return true;
				}
			},
			//验证消费状态
			verify_shopping_capability() {
				let shopping_capability = this.targeting_item.targeting.shopping_capability;
				if(!this.shopping_capability_modeal) {
					return true;
				} else if(shopping_capability.length <= 0) {
					return false;
				} else {
					return true;
				}
			},
			//验证移动运营商
			verify_network_operator() {
				let network_operator = this.targeting_item.targeting.network_operator;
				if(!this.network_operator_modeal) {
					return true;
				} else if(network_operator.length <= 0) {
					return false;
				} else {
					return true;
				}
			},
			//验证设备价格
			verify_device_price() {
				let device_price = this.targeting_item.targeting.device_price;
				if(!this.device_price_modeal) {
					return true;
				} else if(device_price.length <= 0) {
					return false;
				} else {
					return true;
				}
			}
		}
	}
</script>