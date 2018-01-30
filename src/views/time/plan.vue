<style lang="less">
	@import "../../styles/common.less";
	@import '../../styles/table.less';
	.sel {
		width: 220px;
	}
	
	.ivu-card-head-inner,
	.ivu-card-head p {
		height: 25px;
	}
	
	.tipbtn {
		text-align: right;
	}
	
	.clear:after {
		content: '\20';
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}
	
	.ivu-table .ivu-col span {
		line-height: 24px;
	}
	
	.inp {
		display: inline-block;
		width: 150px;
	}
	
	.sel_state {
		text-align: left;
		width: 100px;
	}
</style>

<template>
	<div class="time">
		<Card shadow>
			<Row>
				<Col span="19">
				<!--搜索游戏列表-->
				<search-tree :callback="getids"></search-tree>
				<Select v-model="MediaListModel" :value="MediaListModel" filterable class="sel" placeholder="全部媒体账号" @on-change="getCampaigns">
					<Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
				</Select>
				<Select v-model="CampaignsListModel" :value="CampaignsListModel" filterable class="sel" placeholder="全部广告" v-if="campaignslist.length>1">
					<Option v-for="item in campaignslist" :value="item.campaign_id" :key="this">{{ item.campaign_name }}</Option>
				</Select>
				<Input v-model="campaign_name" class="inp" placeholder="请输入关键字"></Input>
				<Button type="primary" icon="search" @click="getCampaignsList()">搜索</Button>
				</Col>
				<Col span="5" style="text-align: right;">
				<Button type="ghost" @click="copyAdwin=true">复制</Button>
				<!--自定义指标-->
				<view-tip @showbox="toshow" :allgroup="checkAllGroup" :callback="getCampaignsList"></view-tip>
				</Col>
			</Row>
		</Card>

		<Card shadow class="margin-top-10">
			<Row>
				<Col span="8">
				<div class="btn-group clear">
					<Poptip confirm title="您确认删除选中内容吗？" placement="bottom-start" @on-ok="AmendCampaignsList(3)">
						<Button type="ghost" size="small">删除</Button>
					</Poptip>
					<Poptip placement="bottom-start" v-model="visible">
						<Button type="ghost" size="small">修改状态</Button>
						<div class="api" slot="content">
							<div>
								<Select v-model="edit_status" :value="edit_status">
									<Option value="AD_STATUS_NORMAL">启用</Option>
									<Option value="AD_STATUS_SUSPEND">暂停</Option>
								</Select>
							</div>
							<div class="tipbtn margin-top-10">
								<Button type="text" size="small" @click="visible=false">取消</Button>
								<Button type="primary" size="small" @click="AmendCampaignsList(1)">确定</Button>
							</div>
						</div>
					</Poptip>
					<Poptip placement="bottom-start" v-model="visible1">
						<Button type="ghost" size="small">修改日期</Button>
						<div class="api" slot="content">
							<div v-if="!startdate">
								<DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy/MM/dd" :value="date2"></DatePicker>
							</div>
							<div class="tipbtn margin-top-10">
								<Checkbox v-model="startdate">长期投放（仅设置开始时间）</Checkbox>
							</div>
							<div class="tipbtn margin-top-10" v-if="startdate">
								<DatePicker type="date" placement="bottom-start" placeholder="请选择日期" format="yyyy/MM/dd" :value="date1"></DatePicker>
							</div>
							<div class="tipbtn margin-top-10">
								<Button type="text" size="small" @click="visible1 = false">取消</Button>
								<Button type="primary" size="small" @click="visible1 = false">确定</Button>
							</div>
						</div>
					</Poptip>
					<Button type="ghost" size="small" @click="exportData()">下载报表</Button>
				</div>
				</Col>
				<Col span="16" style="text-align: right;">
				<Select v-model="configured_status" :value="configured_status" size="small" class="sel_state" @on-change="getCampaignsList()">
					<Option value="0">所有未册除</Option>
					<Option value="1">有效</Option>
					<Option value="2">暂停</Option>
				</Select>

				<DatePicker type="daterange" :options="options" size="small" placement="bottom-end" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>

				<Checkbox v-model="check_value" @on-change="getCampaignsList()">过滤无数据的广告</Checkbox>
				</Col>
			</Row>
			<div>
				<Table :data="adList" :columns="taColumns" :size="tableSize" class="margin-top-10" ref="table" @on-selection-change="taCheck"></Table>
				<Row class="margin-top-10">
					<Col span="8"> 表格尺寸
					<Radio-group v-model="tableSize" type="button">
						<Radio label="large">大</Radio>
						<Radio label="default">中</Radio>
						<Radio label="small">小</Radio>
					</Radio-group>
					</Col>
					<Col span="16" style="text-align: right;">
					<Page :total="total_number" ref="pages" @on-change="getCampaignsList" show-elevator show-total></Page>
					</Col>
				</Row>
			</div>
		</Card>

		<Modal v-model="copyAdwin" title="复制广告">
			<div class="margin-top-10">
				<Form :model="formItem" :label-width="100">
					<FormItem label="选择复制的帐户">
						<Select v-model="formItem.select">
							<Option value="beijing">New York</Option>
							<Option value="shanghai">London</Option>
							<Option value="shenzhen">Sydney</Option>
						</Select>
					</FormItem>
					<FormItem label="选择复制的计划">
						<Select v-model="formItem.select">
							<Option value="beijing">New York</Option>
							<Option value="shanghai">London</Option>
							<Option value="shenzhen">Sydney</Option>
						</Select>
					</FormItem>

					<FormItem>
						<RadioGroup v-model="formItem.radio">
							<Radio label="male">默认</Radio>
							<Radio label="female">编辑</Radio>
						</RadioGroup>
					</FormItem>
				</Form>
			</div>
		</Modal>

	</div>
</template>

<script>
	import Axios from '@/api/index';
	import tableData from './data/tableexcel.js';
	import { DateShortcuts } from './data/DateShortcuts.js';
	import viewTip from './components/viewPopti.vue';
	import searchTree from './components/searchTree.vue';

	export default {
		components: {
			viewTip,
			searchTree
		},
		data() {
			return {
				GameListIds: [], //搜索返回ids
				MediaListModel: 0,
				CampaignsListModel: 0,
				taColumns: [], //表头设置
				taCheckids: [], //选中ids
				page: 1, //第N页
				page_size: 10, //每页数量
				total_number: 1, //总数量
				total_page: 1, //总页数
				indeterminate: true,
				checkAll: false,
				checkAllGroup: ['game_name'],
				visible: false,
				visible1: false,
				startdate: false,
				date1: '2016-01-01',
				date2: ['2016-01-01', '2016-02-15'],
				DateDomain: ['2016-01-01', '2016-02-15'], //筛选时间
				configured_status: "0", //过滤无数据的广告
				campaign_name: '', //关键字
				check_value: false,
				edit_status: "AD_STATUS_NORMAL", //批量状态
				tableSize: 'small',
				options: DateShortcuts,
				copyAdwin: false,
				formItem: {
					select: '',
					select: '',
					radio: 'male',
				}
			}
		},
		mounted() {
			this.getMedia();
			this.getCampaignsList();
		},
		methods: {
			//获取选中游戏id
			getids(ids) {
				this.GameListIds = ids;
			},
			//监听子组件变化
			toshow(e) {
				this.checkAllGroup = e;
			},
			//获取媒体账号
			getMedia() {
				this.$store.dispatch('getMediaList');
			},
			//获取推广计划
			getCampaigns() {
				this.$store.dispatch('getCampaigns', this.MediaListModel);
			},
			//获取实时投放计划
			getCampaignsList(page) {
				if(!page) {
					this.$refs['pages'].currentPage = 1;
				} else {
					this.page = page;
				}
				let configured_status = '';
				if(this.configured_status == '1') {
					configured_status = 'AD_STATUS_NORMAL';
				} else if(this.configured_status == '2') {
					configured_status = 'AD_STATUS_SUSPEND';
				}
				var data = {
					tdate: this.DateDomain[0],
					edate: this.DateDomain[1],
					page: this.page,
					page_size: this.page_size,
					game_id: this.GameListModel,
					account_id: this.MediaListModel,
					configured_status: configured_status,
					campaign_id: this.CampaignsListModel,
					campaign_name: this.campaign_name,
					check_value: this.check_value == false ? 0 : 1
				}
				this.$store.dispatch('getAdList', data);
			},

			//批量修改删除投放计划   "campaign_name":"ces" id:13
			AmendCampaignsList(type) {
				this.visible = false;
				//TODO
				var data = {
					id: [13], //this.taCheckids
					type: type,
					configured_status: this.edit_status
				}
				this.$store.dispatch('amendCampaigns', data);
			},

			//获取选中的id
			taCheck(row) {
				let ids = [];
				row.forEach(item => {
					ids.push(item.id)
				});
				this.taCheckids = ids;
			},

			//改变日期
			changeDate(e) {
				this.DateDomain = e;
				this.getCampaignsList();
			},

			//导出报表
			exportData(type) {
				this.$refs['table'].exportCsv({
					filename: 'gdtAdPut data',
					original: false
				});
			}
		},

		computed: {
			//获取媒体账号
			mediaList() {
				let mediaList = this.$store.state.plan.mediaList;
				mediaList.unshift({
					account_id: 0,
					account_name: '全部媒体账号'
				});
				return mediaList;
			},
			//获取推广计划
			campaignslist() {
				let campaignslist = this.$store.state.plan.campaignslist;
				campaignslist.unshift({
					campaign_id: 0,
					campaign_name: '全部广告'
				});
				return campaignslist;
			},
			//获取实时投放计划
			adList() {
				let adList = this.$store.state.plan.adList;
				this.page = adList.page;
				this.total_number = adList.total_number;
				this.total_page = adList.total_page;
				let data = [tableData.tableColumns.checks, tableData.tableColumns.game_name, tableData.tableColumns.account_name, tableData.tableColumns.campaign_id, tableData.tableColumns.configured_status, tableData.tableColumns.site_id];
				this.checkAllGroup.forEach(col => {
					data.push(tableData.tableColumns[col])
				});
				this.taColumns = data;
				return adList.list;
			},
		}
	};
</script>

<style>

</style>