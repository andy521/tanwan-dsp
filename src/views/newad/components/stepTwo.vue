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
		top: 40px;
		right: 40px;
		width: 200px;
		background: #f2f2f2;
		padding: 20px;
		z-index: 999;
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
	
	.fi_user_count {
		font-size: 19px;
	}
	
	.ds_item {
		border-top: 1px solid #eee;
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
		color: #5cadff;
		cursor: pointer;
	}
	
	.win_tit {
		color: #404246;
		font-size: 16px;
		padding-bottom: 10px;
	}
</style>

<template>
	<div>
		<div class="tit">广告</div>
		<h3 class="subtit">目标详情 - 应用ID</h3>

		<Form :model="form2" class="margin-top-20" :label-width="70" label-position="left">
			<FormItem label="推广计划">
				<Select filterable size="large" placeholder="请选择推广计划">
					<Option value="beijing">New York</Option>
					<Option value="shanghai">London</Option>
					<Option value="shenzhen">Sydney</Option>
				</Select>
			</FormItem>
		</Form>

		<h3 class="subtit">定向</h3>

		<div class="margin-top-20">
			<Select style="width:200px">
				<Option :key="1" value="1">新建定向</Option>
			</Select>
			<span>下拉选择已有定向包</span>
		</div>

		<div class="ds_items margin-top-10">
			<div class="ds_item ds_item_on">
				<div class="ds_tit">
					<span class="ds_item_hd">地域</span>
					<i-switch class="ds_item_bd" v-model="switch1"></i-switch>
				</div>
				<div class="ds_box">
					<p>已选择35/400</p>
					<div class="ds_tag margin-top-10">
						<p>列表</p>
						<Tag class="margin-top-10" v-for="item in 50" :key="item" :name="item" closable type="dot" color="default">标签{{ item + 1 }}</Tag>
						<p>
							<Button type="text">清空</Button>
						</p>
					</div>
					<Row>
						<Col span="12">
						<Input class="margin-top-20" icon="ios-search-strong" placeholder="搜索国家、省、市、区、商圈">
						<Select slot="append" value="1" style="width: 100px">
							<Option :key="1" value="1">从列表选择</Option>
							<Option :key="2" value="0">从地图选择</Option>
						</Select>
						</Input>
						</Col>
					</Row>

					<Tree class="margin-top-10 citytree" :data="data2" show-checkbox></Tree>
					<CheckboxGroup class="margin-top-20">
						<Checkbox label="香蕉" size="large">近期在这里的人
							<Tooltip placement="top">
								<Icon type="help-circled" color="#999"></Icon>
								<div slot="content" style="white-space: normal">
									当前或最近1~2天位置在该区域的人。
								</div>
							</Tooltip>
						</Checkbox>
						<Checkbox label="苹果" size="large">常住这里的人
							<Tooltip placement="top">
								<Icon type="help-circled" color="#999"></Icon>
								<div slot="content" style="white-space: normal">
									最近一个月居住在该区域的人。
								</div>
							</Tooltip>
						</Checkbox>
						<Checkbox label="苹果" size="large">旅行到这里的人
							<Tooltip placement="top">
								<Icon type="help-circled" color="#999"></Icon>
								<div slot="content" style="white-space: normal">
									旅游或出差来到该区域的人，并且近一个月常住地不在此。
								</div>
							</Tooltip>
						</Checkbox>
						<Checkbox label="西瓜" size="large">去过这里的人
							<Tooltip placement="top">
								<Icon type="help-circled" color="#999"></Icon>
								<div slot="content" style="white-space: normal">
									最近一个月去过这里的人
								</div>
							</Tooltip>
						</Checkbox>
					</CheckboxGroup>
				</div>
			</div>

			<div class="ds_item ds_item_on">
				<div class="ds_tit">
					<span class="ds_item_hd">年龄</span>
					<i-switch class="ds_item_bd"></i-switch>
				</div>
				<div class="ds_box">
					<Row :gutter="15">
						<Col span="12">
						<Select>
							<Option v-for="(item,index) in 5" :value="item" :key="index" >{{ item }}</Option>
						</Select>
						</Col>
						<Col span="12">
						<Select>
							<Option v-for="(item,index) in 5" :value="item" :key="index">{{ item }}</Option>
						</Select>
						</Col>
					</Row>
					<p class="margin-top-10 grey">由于国家政策，若投放酒类广告，系统只会向18岁以上受众展示</p>
				</div>
			</div>

			<div class="ds_item ds_item_on">
				<div class="ds_tit">
					<span class="ds_item_hd">性别</span>
					<i-switch class="ds_item_bd"></i-switch>
				</div>
				<div class="ds_box">
					<RadioGroup value="男">
						<Radio label="男" size="large">
							<Icon type="male"></Icon>男</Radio>
						<Radio label="女" size="large">
							<Icon type="female"></Icon>女</Radio>
					</RadioGroup>
				</div>
			</div>

			<div class="ds_item ds_item_on">
				<div class="ds_tit">
					<span class="ds_item_hd">商业兴趣</span>
					<i-switch class="ds_item_bd"></i-switch>
				</div>
				<div class="ds_box">
					<p>已选择35/400</p>
					<div class="ds_tag margin-top-10">
						<p>列表</p>
						<Tag class="margin-top-10" v-for="item in 50" :key="item" :name="item" closable type="dot" color="default">标签{{ item + 1 }}</Tag>
						<p>
							<Button type="text">清空</Button>
						</p>
					</div>
					<Tree class="margin-top-10 citytree" :data="data2" show-checkbox></Tree>
				</div>
			</div>

			<div class="ds_item ds_item_on">
				<div class="ds_tit">
					<span class="ds_item_hd">App行为</span>
					<i-switch class="ds_item_bd"></i-switch>
				</div>
				<div class="ds_box">
					<RadioGroup value="按分类">
						<Radio label="按分类" size="large">按分类</Radio>
						<Radio label="按App" size="large">按App</Radio>
					</RadioGroup>
					<p class="margin-top-20">已选择35/400</p>
					<div class="ds_tag margin-top-10">
						<p>列表</p>
						<Tag class="margin-top-10" v-for="item in 50" :key="item" :name="item" closable type="dot" color="default">标签{{ item + 1 }}</Tag>
						<p>
							<Button type="text">清空</Button>
						</p>
					</div>

					<Tree class="margin-top-10 citytree" :data="data2" show-checkbox></Tree>
					<div class="margin-top-10">
						<CheckboxGroup>
							距离今天
							<InputNumber :max="10" :min="1" v-model="value1"></InputNumber>天内，该类APP的
							<Checkbox label="活跃用户" size="large"></Checkbox>
							<Checkbox label="付费用户" size="large"></Checkbox>
						</CheckboxGroup>
					</div>
				</div>
			</div>
			<div class="ds_item ds_item_on">
				<div class="ds_tit">
					<span class="ds_item_hd">App安装</span>
					<i-switch class="ds_item_bd"></i-switch>
				</div>
				<div class="ds_box">
					<RadioGroup value="未安装该应用的用户">
						<Radio label="未安装该应用的用户" size="large">未安装该应用的用户</Radio>
						<Radio label="已安装该应用的用户" size="large">已安装该应用的用户</Radio>
					</RadioGroup>
				</div>
			</div>
			<div class="ds_item ds_item_on">
				<div class="ds_tit">
					<span class="ds_item_hd">联网方式</span>
					<i-switch class="ds_item_bd"></i-switch>
				</div>
				<div class="ds_box">
					<RadioGroup value="Wi-Fi">
						<Radio label="Wi-Fi" size="large">Wi-Fi</Radio>
						<Radio label="2G" size="large">2G</Radio>
						<Radio label="3G" size="large">3G</Radio>
						<Radio label="4G" size="large">4G</Radio>
						<Radio label="未知" size="large">未知</Radio>
					</RadioGroup>
				</div>
			</div>
			<div class="ds_item ds_item_on">
				<div class="ds_tit">
					<span class="ds_item_hd">自定义人群</span>
					<i-switch class="ds_item_bd"></i-switch>
				</div>
				<div class="ds_box">
					<div class="subtt"><span>定向用户群</span>
						<Tooltip placement="top">
							<Icon type="help-circled" color="#999"></Icon>
							<div slot="content" style="white-space: normal">
								您的广告将仅投放到选定的人或目标场景中
							</div>
						</Tooltip>
					</div>
					<Row>
						<Col span="12">
						<Input class="margin-top-10" icon="ios-search-strong" placeholder="搜索用户群"></Input>
						</Col>
					</Row>

					<Table class="margin-top-10" height="200" :columns="columns1" :data="data3" size="small"></Table>
					<div class="subtt margin-top-20"><span>排除用户群</span>
						<Tooltip placement="top">
							<Icon type="help-circled" color="#999"></Icon>
							<div slot="content" style="white-space: normal">
								您的广告将不会投放到选定的人或目标场景中
							</div>
						</Tooltip>
					</div>
					<Row>
						<Col span="12">
						<Input class="margin-top-10" icon="ios-search-strong" placeholder="搜索用户群"></Input>
						</Col>
					</Row>
					<Table class="margin-top-10" height="200" :columns="columns1" :data="data3" size="small"></Table>
				</div>
			</div>
			<Button class="margin-top-10" type="ghost" long icon="compose" size="large" @click="modal1=true">全部定向</Button>
			<p class="margin-top-10" style="color: #e88e00;">推广iOS应用，广告只会在iOS操作系统上展现</p>
			<Checkbox size="large" class="margin-top-10 grey">保存为定向包，下次创建广告直接使用</Checkbox>

			<h3 class="subtit">广告版位</h3>
			<Tabs value="name1" :animated="false">
				<TabPane label="移动平台" icon="android-phone-portrait" name="name1">
					<Table border :columns="columns6" :data="data5"></Table>
				</TabPane>
				<TabPane label="PC平台" icon="android-laptop" name="name2">

				</TabPane>
			</Tabs>

			<h3 class="subtit">排期与出价</h3>

			<Input class="margin-top-20">
			<span slot="prepend">投放日期</span>
			<Select slot="append" style="width: 150px">
				<Option value="com">长期投放</Option>
				<Option value="org">在某日期范围内投放</Option>
			</Select>
			</Input>

			<Input class="margin-top-20">
			<span slot="prepend">投放时间</span>
			<Select slot="append" style="width: 150px">
				<Option value="com">全天</Option>
				<Option value="org">特定时间段</Option>
			</Select>
			</Input>

			<Input class="margin-top-20">
			<span slot="prepend">广告名称</span>
			<span slot="append">10/40</span>
			</Input>
			<br />
			<Button type="primary" size="large" style="width: 150px;">下一步</Button>

		</div>

		<div class="ritht_fixed">
			<h3 class="fi_tit">所选定向</h3>
			<div class="fi_main">
				<p><span>dmp人群：</span>使用人群贪玩角色扮演1000W-3、贪玩角色扮演1000W-3、贪玩修仙1000W、贪玩修仙1000W、贪玩策略1000W-3、贪玩策略1000W-3、安卓全、安卓全*10、安卓全*3、安卓全*5、传奇IOS、传奇IOS*100、传奇IOS*200、传奇点击用户、传奇转化用户0718、传奇点击*10、传奇点击*20、传奇转化*50、传奇转化*100、传奇9-10月IOS转化人群、传奇IOS910月转化*10、传奇IOS9-10月转化*50、传奇-IOS-历史点击（10-11）、贪玩传奇竞品词提取-拓展1KW、贪玩ARPGAPP提取QQ1、</p>
				<p><span>性别：</span>男</p>
			</div>

			<h3 class="fi_tit">预计最大覆盖用户</h3>
			<p><span class="fi_user_count">279,603,200</span>人</p>
			<h3 class="fi_tit margin-top-20">预计最大日曝光量</h3>
			<p><span class="fi_user_count">2,035,865,600</span>次</p>
		</div>

		<!--弹出层-->
		<Modal v-model="modal1" title="全部定向" width="900">
			<div class="ds_items">
				<div class="win_tit">人口属性</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">地域</span>
						<i-switch class="ds_item_bd" v-model="switch1"></i-switch>
					</div>
					<div class="ds_box">
						<p>已选择35/400</p>
						<div class="ds_tag margin-top-10">
							<p>列表</p>
							<Tag class="margin-top-10" v-for="(item,index) in 50" :key="index" :name="item" closable type="dot" color="default">标签{{ item + 1 }}</Tag>
							<p>
								<Button type="text">清空</Button>
							</p>
						</div>
						<Input class="margin-top-20" icon="ios-search-strong" placeholder="搜索国家、省、市、区、商圈">
						<Select slot="append" value="1" style="width: 100px">
							<Option value="1">从列表选择</Option>
							<Option value="0">从地图选择</Option>
						</Select>
						</Input>
						<Tree class="margin-top-10 citytree" :data="data2" show-checkbox></Tree>
						<CheckboxGroup class="margin-top-20">
							<Checkbox label="香蕉" size="large">近期在这里的人
								<Tooltip placement="top">
									<Icon type="help-circled" color="#999"></Icon>
									<div slot="content" style="white-space: normal">
										当前或最近1~2天位置在该区域的人。
									</div>
								</Tooltip>
							</Checkbox>
							<Checkbox label="苹果" size="large">常住这里的人
								<Tooltip placement="top">
									<Icon type="help-circled" color="#999"></Icon>
									<div slot="content" style="white-space: normal">
										最近一个月居住在该区域的人。
									</div>
								</Tooltip>
							</Checkbox>
							<Checkbox label="苹果" size="large">旅行到这里的人
								<Tooltip placement="top">
									<Icon type="help-circled" color="#999"></Icon>
									<div slot="content" style="white-space: normal">
										旅游或出差来到该区域的人，并且近一个月常住地不在此。
									</div>
								</Tooltip>
							</Checkbox>
							<Checkbox label="西瓜" size="large">去过这里的人
								<Tooltip placement="top">
									<Icon type="help-circled" color="#999"></Icon>
									<div slot="content" style="white-space: normal">
										最近一个月去过这里的人
									</div>
								</Tooltip>
							</Checkbox>
						</CheckboxGroup>
					</div>
				</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">年龄</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<Row :gutter="15">
							<Col span="12">
							<Select>
								<Option v-for="item in 5" :key="item" :value="item">{{ item }}</Option>
							</Select>
							</Col>
							<Col span="12">
							<Select>
								<Option v-for="item in 5" :key="item" :value="item">{{ item }}</Option>
							</Select>
							</Col>
						</Row>
						<p class="margin-top-10 grey">由于国家政策，若投放酒类广告，系统只会向18岁以上受众展示</p>
					</div>
				</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">性别</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<RadioGroup value="男">
							<Radio label="男" size="large">
								<Icon type="male"></Icon>男</Radio>
							<Radio label="女" size="large">
								<Icon type="female"></Icon>女</Radio>
						</RadioGroup>
					</div>
				</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">婚恋状态</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<RadioGroup value="单身">
							<Radio label="单身" size="large">单身</Radio>
							<Radio label="新婚" size="large">新婚</Radio>
							<Radio label="已婚" size="large">已婚</Radio>
							<Radio label="育儿（全部）" size="large">育儿（全部）</Radio>
						</RadioGroup>
					</div>
				</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">工作状态</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<RadioGroup value="在校大学生">
							<Radio label="在校大学生" size="large">在校大学生</Radio>
						</RadioGroup>
					</div>
				</div>

				<div class="win_tit margin-top-20">用户兴趣</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">商业兴趣</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<p>已选择35/400</p>
						<div class="ds_tag margin-top-10">
							<p>列表</p>
							<Tag class="margin-top-10" v-for="item in 50" :key="item" :name="item" closable type="dot" color="default">标签{{ item + 1 }}</Tag>
							<p>
								<Button type="text">清空</Button>
							</p>
						</div>
						<Tree class="margin-top-10 citytree" :data="data2" show-checkbox></Tree>
					</div>
				</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">关键词<em class="grey">对指定关键词感兴趣的用户</em></span>

						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<p>已选择35/400</p>
						<div class="ds_tag margin-top-10">
							<p>列表</p>
							<Tag class="margin-top-10" v-for="item in 50" :key="item" :name="item" closable type="dot" color="default">标签{{ item + 1 }}</Tag>
							<p>
								<Button type="text">清空</Button>
							</p>
						</div>
						<Input class="margin-top-10" placeholder="输入关键词，回车键(enter)提交"></Input>
						<div class="margin-top-10">
							<Tooltip placement="top">
								<span class="c-link">上传关键词 </span>
								<div slot="content" style="white-space: normal">一行一个关键词，不支持标点符号隔开，最多2000个关键词</div>
							</Tooltip>
							(.TXT文件)</div>
					</div>
				</div>

				<div class="win_tit margin-top-20">用户行为</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">App行为</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<RadioGroup value="按分类">
							<Radio label="按分类" size="large">按分类</Radio>
							<Radio label="按App" size="large">按App</Radio>
						</RadioGroup>
						<p class="margin-top-20">已选择35/400</p>
						<div class="ds_tag margin-top-10">
							<p>列表</p>
							<Tag class="margin-top-10" v-for="item in 50" :key="item" :name="item" closable type="dot" color="default">标签{{ item + 1 }}</Tag>
							<p>
								<Button type="text">清空</Button>
							</p>
						</div>

						<Tree class="margin-top-10 citytree" :data="data2" show-checkbox></Tree>
						<div class="margin-top-10">
							<CheckboxGroup>
								距离今天
								<InputNumber :max="10" :min="1" v-model="value1"></InputNumber>天内，该类APP的
								<Checkbox label="活跃用户" size="large"></Checkbox>
								<Checkbox label="付费用户" size="large"></Checkbox>
							</CheckboxGroup>
						</div>
					</div>
				</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">App安装</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<RadioGroup value="未安装该应用的用户">
							<Radio label="未安装该应用的用户" size="large">未安装该应用的用户</Radio>
							<Radio label="已安装该应用的用户" size="large">已安装该应用的用户</Radio>
						</RadioGroup>
					</div>
				</div>

				<div class="win_tit margin-top-20">自定义人群</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">自定义人群</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<div class="subtt"><span>定向用户群</span>
							<Tooltip placement="top">
								<Icon type="help-circled" color="#999"></Icon>
								<div slot="content" style="white-space: normal">
									您的广告将仅投放到选定的人或目标场景中
								</div>
							</Tooltip>
						</div>
						<Input class="margin-top-10" icon="ios-search-strong" placeholder="搜索用户群"></Input>
						<Table class="margin-top-10" height="200" :columns="columns1" :data="data3" size="small"></Table>
						<div class="subtt margin-top-20"><span>排除用户群</span>
							<Tooltip placement="top">
								<Icon type="help-circled" color="#999"></Icon>
								<div slot="content" style="white-space: normal">
									您的广告将不会投放到选定的人或目标场景中
								</div>
							</Tooltip>
						</div>
						<Input class="margin-top-10" icon="ios-search-strong" placeholder="搜索用户群"></Input>
						<Table class="margin-top-10" height="200" :columns="columns1" :data="data3" size="small"></Table>
					</div>
				</div>

				<div class="win_tit margin-top-20">消费能力</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">付费用户</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<RadioGroup value="App付费">
							<Radio label="App付费" size="large">App付费</Radio>
							<Radio label="电商付费" size="large">电商付费</Radio>
						</RadioGroup>
					</div>
				</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">游戏用户消费能力（元/月）</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<Row :gutter="15">
							<Col span="12">
							<Select>
								<Option v-for="item in 5" :key="item" :value="item">{{ item }}</Option>
							</Select>
							</Col>
							<Col span="12">
							<Select>
								<Option v-for="item in 5" :key="item" :value="item">{{ item }}</Option>
							</Select>
							</Col>
						</Row>
						<p class="margin-top-10 grey">由于国家政策，若投放酒类广告，系统只会向18岁以上受众展示</p>
					</div>
				</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">消费状态</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<RadioGroup value="高消费">
							<Radio label="高消费" size="large">高消费</Radio>
							<Radio label="低消费" size="large">低消费</Radio>
						</RadioGroup>
					</div>
				</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">居住社区价格（元/m²）</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<Row :gutter="15">
							<Col span="12">
							<Select>
								<Option v-for="item in 5" :key="item" :value="item">{{ item }}</Option>
							</Select>
							</Col>
							<Col span="12">
							<Select>
								<Option v-for="item in 5" :key="item" :value="item">{{ item }}</Option>
							</Select>
							</Col>
						</Row>
						<p class="margin-top-10 grey">由于国家政策，若投放酒类广告，系统只会向18岁以上受众展示</p>
					</div>
				</div>

				<div class="win_tit margin-top-20">设备定向</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">上网场景</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<CheckboxGroup>
							<Checkbox label="公共场所"></Checkbox>
							<Checkbox label="家庭"></Checkbox>
							<Checkbox label="学校"></Checkbox>
							<Checkbox label="未知"></Checkbox>
						</CheckboxGroup>
					</div>
				</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">联网方式</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<CheckboxGroup>
							<Checkbox label="Wi-Fi"></Checkbox>
							<Checkbox label="2G"></Checkbox>
							<Checkbox label="4G"></Checkbox>
							<Checkbox label="未知"></Checkbox>
						</CheckboxGroup>
					</div>
				</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">移动运营商</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<CheckboxGroup>
							<Checkbox label="中国移动"></Checkbox>
							<Checkbox label="中国联通"></Checkbox>
							<Checkbox label="中国电信"></Checkbox>
							<Checkbox label="未知"></Checkbox>
						</CheckboxGroup>
					</div>
				</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">设备价格</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<CheckboxGroup>
							<Checkbox label="1500元以下"></Checkbox>
							<Checkbox label="1500~2500元"></Checkbox>
							<Checkbox label="2500~3500元"></Checkbox>
							<Checkbox label="3500~4500元"></Checkbox>
							<Checkbox label="4500元以上"></Checkbox>
						</CheckboxGroup>
					</div>
				</div>
				<div class="win_tit margin-top-20">流量方属性</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">移动媒体类型</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<p>已选择35/400</p>
						<div class="ds_tag margin-top-10">
							<p>列表</p>
							<Tag class="margin-top-10" v-for="item in 50" :key="item" :name="item" closable type="dot" color="default">标签{{ item + 1 }}</Tag>
							<p>
								<Button type="text">清空</Button>
							</p>
						</div>
						<div class="citytree">
							<CheckboxGroup>
								<div>
									<Checkbox size="large" label="1500元以下"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="1500~2500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="2500~3500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="3500~4500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="4500元以上"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="1500元以下"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="1500~2500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="2500~3500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="3500~4500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="4500元以上"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="1500元以下"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="1500~2500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="2500~3500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="3500~4500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="4500元以上"></Checkbox>
								</div>
							</CheckboxGroup>
						</div>
						<p class="margin-top-10 grey">移动媒体平台定向只能用于投放广告版位为移动原生、移动Banner、移动插屏、移动开屏的广告</p>
					</div>
				</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">移动媒体类型</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<p>已选择35/400</p>
						<div class="ds_tag margin-top-10">
							<p>列表</p>
							<Tag class="margin-top-10" v-for="item in 50" :key="item" :name="item" closable type="dot" color="default">标签{{ item + 1 }}</Tag>
							<p>
								<Button type="text">清空</Button>
							</p>
						</div>
						<div class="citytree">
							<CheckboxGroup>
								<div>
									<Checkbox size="large" label="1500元以下"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="1500~2500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="2500~3500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="3500~4500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="4500元以上"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="1500元以下"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="1500~2500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="2500~3500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="3500~4500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="4500元以上"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="1500元以下"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="1500~2500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="2500~3500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="3500~4500元"></Checkbox>
								</div>
								<div>
									<Checkbox size="large" label="4500元以上"></Checkbox>
								</div>
							</CheckboxGroup>
						</div>
						<p class="margin-top-10 grey">微信公众号类型定向只能用于投放广告版位为微信的广告</p>
					</div>
				</div>
				<div class="win_tit margin-top-20">天气定向</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">温度</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<Row :gutter="15">
							<Col span="12">
							<Select>
								<Option v-for="item in 5" :key="item" :value="item">{{ item }}</Option>
							</Select>
							</Col>
							<Col span="12">
							<Select>
								<Option v-for="item in 5"  :key="item" :value="item">{{ item }}</Option>
							</Select>
							</Col>
						</Row>
					</div>
				</div>

				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">紫外线指数</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<CheckboxGroup>
							<Checkbox size="large" label="弱"></Checkbox>
							<Checkbox size="large" label="偏弱"></Checkbox>
							<Checkbox size="large" label="中等"></Checkbox>
							<Checkbox size="large" label="偏强"></Checkbox>
							<Checkbox size="large" label="强"></Checkbox>
						</CheckboxGroup>
					</div>
				</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">穿衣指数<em class="grey">根据气温、湿度、风等气象条件，对人们适宜穿着的服装进行分级 </em></span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<CheckboxGroup>
							<Checkbox size="large" label="炎热"></Checkbox>
							<Checkbox size="large" label="热舒适"></Checkbox>
							<Checkbox size="large" label="舒适"></Checkbox>
							<Checkbox size="large" label="温凉"></Checkbox>
							<Checkbox size="large" label="凉"></Checkbox>
							<Checkbox size="large" label="冷"></Checkbox>
							<Checkbox size="large" label="寒冷"></Checkbox>
						</CheckboxGroup>
					</div>
				</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">化妆指数<em class="grey">根据气象条件对人的皮肤的影响制定出来的指数，主要影响有温度、湿度、风速、紫外线强度</em></span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<CheckboxGroup>
							<Checkbox size="large" label="保湿防龟裂"></Checkbox>
							<Checkbox size="large" label="保湿"></Checkbox>
							<Checkbox size="large" label="控油"></Checkbox>
							<Checkbox size="large" label="防晒"></Checkbox>
						</CheckboxGroup>
					</div>
				</div>
				<div class="ds_item ds_item_on">
					<div class="ds_tit">
						<span class="ds_item_hd">气象</span>
						<i-switch class="ds_item_bd"></i-switch>
					</div>
					<div class="ds_box">
						<CheckboxGroup>
							<Checkbox size="large" label="晴天"></Checkbox>
							<Checkbox size="large" label="阴天"></Checkbox>
							<Checkbox size="large" label="雨天"></Checkbox>
							<Checkbox size="large" label="雾"></Checkbox>
							<Checkbox size="large" label="雪"></Checkbox>
							<Checkbox size="large" label="沙尘"></Checkbox>
						</CheckboxGroup>
					</div>
				</div>
			</div>

		</Modal>

	</div>
</template>

<script>
	export default {
		name: 'stepTwo',
		data() {
			return {
				modal1: false,
				value1: 1,
				switch1: true,
				form2: {},
				columns1: [{
						type: 'selection',
						width: 60,
						align: 'center'
					}, {
						title: 'Name',
						key: 'name'
					},
					{
						title: 'Age',
						key: 'age'
					},
					{
						title: 'Address',
						key: 'address'
					}
				],
				data3: [{
						name: 'John Brown',
						age: 18,
						address: 'New York No. 1 Lake Park',
						date: '2016-10-03'
					},
					{
						name: 'Jim Green',
						age: 24,
						address: 'London No. 1 Lake Park',
						date: '2016-10-01'
					},
					{
						name: 'Joe Black',
						age: 30,
						address: 'Sydney No. 1 Lake Park',
						date: '2016-10-02'
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						date: '2016-10-04'
					},
					{
						name: 'John Brown',
						age: 18,
						address: 'New York No. 1 Lake Park',
						date: '2016-10-03'
					},
					{
						name: 'Jim Green',
						age: 24,
						address: 'London No. 1 Lake Park',
						date: '2016-10-01'
					},
					{
						name: 'Joe Black',
						age: 30,
						address: 'Sydney No. 1 Lake Park',
						date: '2016-10-02'
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						date: '2016-10-04'
					}
				],
				data2: [{
					title: 'parent 1',
					expand: true,
					children: [{
							title: 'parent 1-1',
							expand: true,
							children: [{
									title: 'leaf 1-1-1'
								},
								{
									title: 'leaf 1-1-2'
								}
							]
						},
						{
							title: 'parent 1-2',
							expand: true,
							children: [{
									title: 'leaf 1-2-1'
								},
								{
									title: 'leaf 1-2-1'
								}
							]
						}
					]
				}],
				columns6: [{
						title: '广告版位',
						key: 'date',
						render: (h, params) => {
							return h('div', [
								h('Icon', {
									props: {
										type: 'person'
									}
								}),
								h('strong', params.row.date)
							]);
						}
					},
					{
						title: '创意形式',
						key: 'name',
						filters: [{
								label: '创意形式',
								value: 1
							},
							{
								label: '单图(文)',
								value: 2
							}
						],
						filterMultiple: false,
						filterMethod(value, row) {
							if(value === 1) {
								return row.age > 25;
							} else if(value === 2) {
								return row.age < 25;
							}
						}
					},
					{
						title: '描述',
						key: 'age',
					},
					{
						title: '曝光量',
						key: 'address',
					}
				],
				data5: [{
						name: 'John Brown',
						age: 18,
						address: 'New York No. 1 Lake Park',
						date: '2016-10-03'
					},
					{
						name: 'Jim Green',
						age: 24,
						address: 'London No. 1 Lake Park',
						date: '2016-10-01'
					},
					{
						name: 'Joe Black',
						age: 30,
						address: 'Sydney No. 1 Lake Park',
						date: '2016-10-02'
					},
					{
						name: 'Jon Snow',
						age: 26,
						address: 'Ottawa No. 2 Lake Park',
						date: '2016-10-04'
					}
				],

			}

		},
		methods: {

		}

	}
</script>

<style>

</style>