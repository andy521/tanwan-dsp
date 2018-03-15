<style lang="less">
	@import "../../styles/common.less";
	@import '../../styles/table.less';
	.sel {
		width: 220px;
	}
	
	.time .ivu-poptip {
		display: inline-block;
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
		width: 110px;
	}
	
	.sel_state1 {
		text-align: left;
		width: 300px;
	}
	
	.sel_state1.ivu-select-multiple .ivu-select-selection {
		overflow: auto;
		height: 32px;
	}
	
	.namediv {
		cursor: pointer;
	}
	
	.namediv:hover {
		color: #57a3f3;
	}
	
	.table-statistics {
		color: #2b7ed1;
		font-weight: bold;
	}
	
	.campaign_name {
		font-size: 18px;
		margin-left: 20px;
	}
</style>

<template>
	<div class="time">
		<Card shadow>
			<Row>
				<Col span="19">
				<div v-if="params.campaign_name">
					<Button type="primary" @click="back">返回</Button>
					<span class="campaign_name">{{params.campaign_name}}</span>
				</div>
				<!--搜索游戏列表-->
				<div v-else>
					<search-tree :callback="getids"></search-tree>
					<Select v-model="MediaListModel" :value="MediaListModel" filterable class="sel" placeholder="请选择媒体账号" @on-change="getCampaigns">
						<Option value="0">全部媒体账号</Option>
						<Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
					</Select>
					<Select v-model="CampaignsListModel" :value="CampaignsListModel" multiple filterable class="sel_state1" placeholder="请选择广告" v-if="campaignslist.length>1">
						<Option v-for="item in campaignslist" :value="item.campaign_id" :key="this">{{ item.campaign_name }}</Option>
					</Select>
					<Input v-model="campaign_name" class="inp" placeholder="请输入关键字"></Input>
					<Button type="primary" icon="search" @click="getCampaignsList()">搜索</Button>
				</div>
				</Col>
				<Col span="5" style="text-align: right;">
				<Button type="ghost" @click="copyAd">复制</Button>

				<!--自定义指标-->
				<view-tip v-model="checkAllGroup" :uncheck="getuncheck" action="gdtAdPut" opt="adgroups"></view-tip>
				<Button type="primary" @click="tonewadd">新建广告</Button>
				</Col>
			</Row>
		</Card>

		<Card shadow class="margin-top-10">
			<Row>
				<Col span="8">
				<div class="btn-group clear">
					<Poptip confirm title="您确认删除选中内容吗？" placement="bottom-start" @on-ok="AmendCampaignsList(3)">
						<Button type="ghost">删除</Button>
					</Poptip>
					<Poptip placement="bottom-start" v-model="visible">
						<Button type="ghost">修改状态</Button>
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
					<Button type="ghost" @click="exportData()">下载报表</Button>
				</div>
				</Col>
				<Col span="16" style="text-align: right;">

				<Select v-model="author_model" :value="author_model" multiple class="sel_state1" @on-change="getCampaignsList()" placeholder="请选择负责人">
					<Option v-for="item in author" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>

				<Select v-model="configured_status" :value="configured_status" class="sel_state" @on-change="getCampaignsList()">
					<Option value="0">所有未册除</Option>
					<Option value="AD_STATUS_NORMAL">有效</Option>
					<Option value="AD_STATUS_SUSPEND">暂停</Option>
				</Select>

				<DatePicker type="daterange" :options="options" placement="bottom-end" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>

				<Checkbox v-model="check_value" @on-change="getCampaignsList()">过滤无数据的广告</Checkbox>
				</Col>
			</Row>
			<div>
				<Table :data="newAdList" height="600" :loading="loading" :columns="taColumns" :size="tableSize" class="margin-top-10" ref="adtable" @on-selection-change="taCheck" @on-sort-change="sortchange" :row-class-name="rowClassName" stripe>

				</Table>
				<Row class="margin-top-10">
					<Col span="10"> 表格尺寸
					<Radio-group v-model="tableSize" type="button">
						<Radio label="large">大</Radio>
						<Radio label="default">中</Radio>
						<Radio label="small">小</Radio>
					</Radio-group>
					每页显示
					<Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getCampaignsList()">
						<Option v-for="item in 100" :value="item" :key="item" v-if="item%25==0">{{ item }}</Option>
					</Select>
					</Col>
					<Col span="14" style="text-align: right;">
					<Page :total="total_number" :page-size="page_size" ref="pages" @on-change="getCampaignsList" show-elevator show-total></Page>
					</Col>
				</Row>
			</div>
		</Card>
		<!--复制广告-->
		<Modal v-model="copyAdwin" title="复制广告" @on-ok="submitCopy">
			<div class="margin-top-10">
				<Form :model="formItem" :label-width="100">
					<FormItem label="选择复制的帐户">
						<Select v-model="formItem.account_id" :value="formItem.account_id" filterable placeholder="请选择媒体账号" @on-change="getCampaignsform">
							<Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
						</Select>
					</FormItem>
					<FormItem label="选择复制的计划" v-if="campaignslistform.length>1">
						<Select v-model="formItem.campaign_id" :value="formItem.campaign_id" filterable placeholder="请选择广告">
							<Option v-for="item in campaignslistform" :value="item.campaign_id" :key="this">{{ item.campaign_name }}</Option>
						</Select>
					</FormItem>
				</Form>
			</div>
		</Modal>
		<!--详情-->
		<adgroup-detail v-model="details_id"></adgroup-detail>

	</div>
</template>

<script>
	import Axios from '@/api/index';
	import { DateShortcuts, formatDate, changetime, deepClone } from '@/utils/DateShortcuts.js';
	import viewTip from './components/viewPopti.vue';
	import searchTree from './components/searchTree.vue';
	import adgroupDetail from './components/adgroupDetail.vue';

	export default {
		components: {
			viewTip,
			searchTree,
			adgroupDetail
		},
		data() {
			return {
				params: this.$route.query,
				mediaList: [], //媒体账号列表
				campaignslist: [], //推广计划列表
				campaignslistform: [], //复制推广计划列表
				loading: false,
				adList: [], //数据列表
				GameListIds: [], //搜索返回ids
				MediaListModel: '0',
				CampaignsListModel: [],
				taCheckids: [], //选中ids
				page: 1, //第N页
				page_size: 50, //每页数量
				total_number: 1, //总数量
				total_page: 1, //总页数
				indeterminate: true,
				checkAllGroup: ['account_name', 'adgroup_name', 'campaign_id', 'impression', 'click', 'click_per', 'click_cost', 'cost', 'configured_status', 'daily_budget', 'game_name'], //默认选中
				uncheck: [], //没选中的
				visible: false,
				visible1: false,
				startdate: false,
				date1: '2016-01-01',
				date2: ['2016-01-01', '2018-02-02'],
				DateDomain: [formatDate(new Date(), "yyyy-MM-dd"), formatDate(new Date(), "yyyy-MM-dd")], //筛选时间
				options: DateShortcuts, //日期辅助功能
				configured_status: "0", //过滤无数据的广告
				campaign_name: '', //关键字
				check_value: false,
				edit_status: "AD_STATUS_NORMAL", //批量状态
				orderField: 'daily_budget', //排序参数名
				orderDirection: 'SORT_DESC', //排序方向
				author_model: [],
				tableSize: 'small',
				copyAdwin: false,
				formItem: {
					account_id: '',
					campaign_id: ''
				},
				detailswin: false,
				details_id: { //详情参数
					account_id: '',
					adgroup_id: ''
				},
				taColumns: [], //表头设置
				tableColumns: [{
						type: 'selection',
						fixed: "left",
						width: 60,
						key: ''
					},
					{
						title: '媒体账户',
						key: 'account_name',
						width: 160,
						render: (h, params) => {
							if(params.row.account_name) {
								return [h('span', params.row.account_name), h('Button', {
									props: {
										type: 'ghost',
										size: 'small'
									},
									style: {
										marginLeft: '10px'
									},
									on: {
										click: () => {
											window.open("http://e.qq.com/ads/");
										}
									}
								}, '登陆')]
							} else {
								return h('span', '本页统计')
							}
						}
					},
					{
						title: '广告名称',
						key: 'adgroup_name',
						width: 400,
						render: (h, params) => {
							let value = params.row.adgroup_name;
							return [h('span', {
								class: 'namediv',
								on: {
									click: () => {
										this.details_id = {
											account_id: params.row.account_id,
											adgroup_id: params.row.adgroup_id
										}
									}
								}
							}, params.row.adgroup_name), h('i-button', {
								props: {
									icon: "edit",
									type: "text",
									size: "small"
								},
								class: ['edit'],
								on: {
									click: () => {
										this.$Modal.confirm({
											render: (h) => {
												return h('Input', {
													props: {
														value: params.row.adgroup_name,
														autofocus: true,
														placeholder: '请输入广告名称'
													},
													on: {
														input: (val) => {
															value = val;
														}
													}
												})
											},
											onOk: () => {
												if(value == '') {
													this.$Message.info('请输入修改信息');
													return;
												}
												Axios.post('api.php', {
													action: 'gdtAdPut',
													opt: 'adgroups_add',
													do: 'edit',
													account_id: params.row.account_id, //*必传*
													adgroup_id: params.row.adgroup_id, //传这个值就是修改当前计划 不传就是添加新的计划
													adgroup_name: value
												}).then(
													res => {
														if(res.ret == 1) {
															this.$Message.info(res.msg);
															this.getCampaignsList(this.page);
														}
													}
												).catch(
													err => {
														console.log('修改删除广告计划失败' + err)
													}
												)
											},
										})
									}
								}
							})]
						}
					},
					{
						title: '计划',
						key: 'campaign_id',
						width: 150
					},

					{
						title: '曝光',
						sortable: 'custom',
						key: 'impression',
						width: 100
					},
					{
						title: '点击量',
						sortable: 'custom',
						key: 'click',
						width: 150
					},
					{
						title: '点击率',
						sortable: 'custom',
						key: 'click_per',
						width: 150
					},
					{
						title: '点击均价',
						sortable: 'custom',
						key: 'click_cost',
						width: 150
					},

					{
						title: '花费',
						sortable: 'custom',
						key: 'cost',
						width: 150
					},
					{
						title: '广告开关/状态',
						key: 'configured_status',
						width: 150,
						render: (h, params) => {
							if(!params.row.configured_status) {
								return
							} else {
								return h('div', [
									h('i-switch', {
										props: {
											size: "small",
											value: params.row.configured_status == "AD_STATUS_NORMAL" ? true : false
										},
										style: {
											marginRight: '10px'
										},
										on: {
											'on-change': (value) => {
												params.row.configured_status = value == true ? "AD_STATUS_NORMAL" : "AD_STATUS_SUSPEND";
												Axios.post('api.php', {
													action: 'gdtAdPut',
													opt: 'adgroups_add',
													do: 'edit',
													account_id: params.row.account_id, //*必传*
													adgroup_id: params.row.adgroup_id, //传这个值就是修改当前计划 不传就是添加新的计划
													configured_status: params.row.configured_status, //AD_STATUS_NORMAL有效AD_STATUS_SUSPEND暂停 
												}).then(
													res => {
														if(res.ret == 1) {
															this.$Message.info(res.msg);
															this.getCampaignsList(this.page);
														}
													}
												).catch(
													err => {
														console.log('修改删除投放计划失败' + err)
													}
												)
											}
										}
									}), h('span', params.row.configured_status == "AD_STATUS_NORMAL" ? '开启' : '关闭')
								]);
							}
						}
					},
					{
						title: '日消耗限额',
						sortable: 'custom',
						key: 'daily_budget',
						width: 150,
						render: (h, params) => {
							let value = params.row.daily_budget;
							return [h('Tooltip', {
								props: {
									placement: 'top',
									content: '最低额度是该推广计划的今日消耗加上50元'
								}
							}, [h('span', params.row.daily_budget / 100 + '元'), h('i-button', {
								props: {
									icon: "edit",
									type: "text",
									size: "small"
								},
								class: ['edit'],
								on: {
									click: () => {
										this.$Modal.confirm({
											render: (h) => {
												return h('Input', {
													props: {
														value: params.row.daily_budget,
														autofocus: true,
														placeholder: '日消耗限额'
													},
													on: {
														input: (val) => {
															value = val;
														}
													}
												})
											},
											onOk: () => {
												if(value == '') {
													this.$Message.info('请输入修改信息');
													return;
												}
												Axios.post('api.php', {
													action: 'gdtAdPut',
													opt: 'adgroups_add',
													do: 'edit',
													account_id: params.row.account_id, //*必传*
													adgroup_id: params.row.adgroup_id,
													daily_budget: value * 100, //日消耗限额	
												}).then(
													res => {
														if(res.ret == 1) {
															this.$Message.info(res.msg);
															this.getCampaignsList(this.page);
														}
													}
												).catch(
													err => {
														console.log('修改删除投放计划失败' + err)
													}
												)
											},
										})
									}
								}
							})])]
						}
					}, {
						title: '产品名称',
						key: 'game_name',
						width: 200
					}, {
						title: '展示PV',
						sortable: 'custom',
						key: 'show_pv',
						width: 150
					},
					{
						title: '展示IP',
						sortable: 'custom',
						key: 'show_ip',
						width: 150
					},
					{
						title: '下载IP',
						sortable: 'custom',
						key: 'down_ip',
						width: 150
					},

					{
						title: '到达数',
						sortable: 'custom',
						key: 'fetch',
						width: 150
					},
					{
						title: '到达率',
						sortable: 'custom',
						key: 'fetch_per',
						width: 150
					},

					{
						title: '下载数',
						sortable: 'custom',
						key: 'download',
						width: 150
					},
					{
						title: '下载率',
						sortable: 'custom',
						key: 'down_ins_per',
						width: 150
					},
					{
						title: '激活总量',
						sortable: 'custom',
						key: 'install',
						width: 150
					},
					{
						title: '点击激活率',
						sortable: 'custom',
						key: 'click_install',
						width: 150
					},
					{
						title: '激活安装率',
						sortable: 'custom',
						key: 'install_per',
						width: 150
					},
					{
						title: '下载激活率',
						sortable: 'custom',
						key: 'download_per',
						width: 150
					},

					{
						title: '出价',
						key: 'bid_amount',
						width: 150,

					},
					{
						title: '注册',
						sortable: 'custom',
						key: 'reg_imei',
						width: 150
					},
					{
						title: '注册设备数',
						sortable: 'custom',
						key: 'activation',
						width: 150
					},
					{
						title: '注册设备成本',
						sortable: 'custom',
						key: 'reg_imei_cost',
						width: 150,						
					},
					{
						title: '注册成本',
						sortable: 'custom',
						key: 'reg_cost',
						width: 150
					},
					{
						title: '注册率',
						sortable: 'custom',
						key: 'reg_per',
						width: 150
					},
					{
						title: '注册ARPU',
						sortable: 'custom',
						key: 'reg_arpu',
						width: 150
					},
					{
						title: '活跃数',
						sortable: 'custom',
						key: 'login',
						width: 150
					},
					{
						title: '活跃率',
						sortable: 'custom',
						key: 'act_per',
						width: 150
					},
					{
						title: '付费人数',
						sortable: 'custom',
						key: 'pay_num',
						width: 150
					},
					{
						title: '付费金额',
						sortable: 'custom',
						key: 'pay_total',
						width: 150
					},
					{
						title: '付费率',
						sortable: 'custom',
						key: 'pay_per',
						width: 150
					},
					{
						title: '回本率',
						sortable: 'custom',
						key: 'income_per',
						width: 150
					}
				],
			}
		},
		mounted() {
			if(this.params.campaign_id) {
				let id = [];
				id.push(this.params.campaign_id)
				this.CampaignsListModel = id;
			}
			this.getMedia();
			this.getCampaignsList();
			this.getAuthor();
		},
		methods: {
			//新建广告
			tonewadd() {
				this.$router.push({
					name: 'user_accounts'
				});
			},
			//获取选中游戏id
			getids(ids) {
				this.GameListIds = ids;
			},
			//获取媒体账号
			getMedia() {
				Axios.get('api.php', {
					action: 'api',
					opt: 'getAccount',
					MeidaType: 'Gdt'
				}).then(res => {
					if(res.ret == 1) {
						this.mediaList = res.data;
					}
				}).catch(
					err => {
						console.log('获取媒体账号' + err)
					}
				)
			},
			//获取推广计划
			getCampaigns(id) {
				Axios.get('api.php', {
					action: 'api',
					opt: 'getcampaigns',
					MeidaType: 'Gdt',
					account_id: id
				}).then(
					res => {
						if(res.ret == 1) {
							this.campaignslist = res.data;
						}
					}
				).catch(
					err => {
						console.log('获取推广计划' + err)
					}
				)
			},
			//获取复制推广计划
			getCampaignsform(id) {
				Axios.get('api.php', {
					action: 'api',
					opt: 'getcampaigns',
					MeidaType: 'Gdt',
					account_id: id
				}).then(
					res => {
						if(res.ret == 1) {
							this.campaignslistform = res.data;
						}
					}
				).catch(
					err => {
						console.log('获取推广计划' + err)
					}
				)
			},
			//提交复制
			submitCopy() {
				Axios.post('api.php', {
					action: 'adData',
					opt: 'tasck_add',
					act: 'cp_campaigns',
					type: 'gdt',
					account_id: this.formItem.account_id,
					campaign_id: this.formItem.campaign_id,
					idArr: this.taCheckids.join(',')
				}).then(
					res => {
						if(res.ret == 1) {
							this.$Message.info('提交成功');
						}
					}
				).catch(
					err => {
						console.log('提交计划' + err)
					}
				)
			},

			//获取负责人
			getAuthor() {
				this.$store.dispatch('getAuthor');
			},
			//获取实时投放计划
			getCampaignsList(page) {
				if(page === undefined) {
					this.$refs['pages'].currentPage = 1;
					this.page = 1;
				} else {
					this.page = page;
				}
				this.loading = true;
				Axios.post('api.php', {
					action: 'gdtAdPut',
					opt: 'adgroups',
					tdate: this.DateDomain[0], //开始时间
					edate: this.DateDomain[1], //结速时间
					page: this.page, //页码
					page_size: this.page_size, //每页数量
					game_id: this.GameListIds.join(','), //游戏id
					account_id: this.MediaListModel == '0' ? '' : this.MediaListModel, //媒体账号
					configured_status: this.configured_status, //过滤无数据的广告
					campaign_id: this.CampaignsListModel, //广告
					adgroup_name: this.campaign_name, //关键字
					check_value: this.check_value == false ? 0 : 1, //状态
					orderField: this.orderField, //排序的orderField参数名
					orderDirection: this.orderDirection, //排序的方向值SORT_ASC顺序 SORT_DESC倒序
					author: this.author_model //负责人
				}).then(
					res => {
						this.loading = false;
						if(res.ret == 1) {
							//添加统计
							res.data.curr_page_total._disabled = true;
							res.data.list.push(res.data.curr_page_total);
							this.total_number = res.data.total_number;
							this.total_page = res.data.total_page;
							this.adList = res.data.list;
						}
					}
				).catch(
					err => {
						this.loading = false;
						console.log('获取实时投放广告' + err);
					}
				)
			},
			//批量修改删除投放计划 
			AmendCampaignsList(type) {
				this.visible = false;
				if(this.taCheckids.length == 0) {
					this.$Message.info('请勾选需要修改的数据');
					return;
				}
				Axios.get('api.php', {
					action: 'gdtAdPut',
					opt: 'campaigns_add',
					do: 'edits',
					id: this.taCheckids, //必传[13,12,12]
					type: type, //1 修改状态  3 删除 type
					configured_status: this.edit_status, //AD_STATUS_NORMAL  有效  AD_STATUS_SUSPEND暂停 默认不传
				}).then(
					res => {
						if(res.ret == 1) {
							this.$Message.info(res.msg);
							this.getCampaignsList(this.page);
						}
					}
				).catch(
					err => {
						console.log('批量修改删除投放计划' + err)
					}
				)
			},
			//获取选中的id
			taCheck(row) {
				let ids = [];
				row.forEach(item => {
					ids.push(item.id)
				});
				this.taCheckids = ids;
			},
			//排序
			sortchange(column) {
				this.orderField = column.key;
				this.orderDirection = column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
				this.getCampaignsList();
			},
			//改变日期
			changeDate(e) {
				this.DateDomain = e;
				this.getCampaignsList();
			},
			//导出报表
			exportData(type) {
				this.$refs['adtable'].exportCsv({
					filename: '实时投放广告',
					original: false
				});
			},
			//返回没有选中的
			getuncheck(val) {
				this.uncheck = val;
			},
			//表格高亮calss
			rowClassName(row, index) {
				if(row._disabled) {
					return 'table-statistics';
				}
			},
			//返回
			back() {
				this.$router.go(-1)
			},
			//复制
			copyAd() {
				if(this.taCheckids.length > 0) {
					this.copyAdwin = true;
				} else {
					this.$Message.info('请勾选要复制的广告');
				}
			}
		},
		computed: {
			//获取负责人
			author() {
				return this.$store.state.channel.author;
			},
			//获取实时投放计划
			newAdList() {
				//深层复制
				let arr = deepClone(this.tableColumns)
				this.uncheck.forEach(item => {
					arr.forEach((col, i) => {
						if(col.key == item) {
							arr.splice(i, 1);
						}
					});
				});
				this.taColumns = arr;
				return this.adList;
			}
		}
	};
</script>