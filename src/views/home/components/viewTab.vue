<style>
	.ivu-tag-border,
	.ivu-tag-border.ivu-tag-red {
		border: none!important;
		background: transparent!important;
	}
	
	.tab {
		border-bottom: 1px solid #dddee1;
		margin-bottom: 16px;
		height: 38px;
		line-height: 38px;
		position: relative;
	}
	
	.tab-item li {
		float: left;
		padding: 0 15px;
		margin-right: 16px;
		position: relative;
		cursor: pointer;
	}
	
	.tab-item li::after {
		content: "";
		position: absolute;
		bottom: 0;
		display: block;
		height: 2px;
		width: 100%;
		left: 0;
		background-color: transparent;
	}
	
	.tab-item li.cur {
		color: #2d8cf0;
	}
	
	.tab-item li.cur::after {
		background-color: #2d8cf0;
	}
	
	.tr {
		float: right;
		margin-top: -5px;
	}
		.sel_state1{
		text-align: left;
		width: 200px;
	}
	

	.sel_state1.ivu-select-multiple .ivu-select-selection{
		overflow: auto;
		height: 32px;
	}
</style>
<template>
	<Card dis-hover shadow class="margin-top-10">
		<div class="tab">
			<ul class="tab-item">
				<li v-for="(item,index) in tab" :class="{cur:index == num }" @click="tabsChange(index)">{{item}}</li>
			</ul>
			<div class="tr">
				<Select v-model="author_model" :value="author_model" class="sel_state1"  multiple filterable  @on-change="tableData()" placeholder="请选择负责人">
					<Option v-for="item in author" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>

				<Select @on-change="mediaChange" v-model="selectState" placeholder="按媒体筛选" style="width:120px" class="margin-right-10">
					<Option v-for="item in mediaList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>

				<DatePicker type="date" placeholder="自定义时间" @on-change="changeTime" style="width: 190px" class="margin-right-10"></DatePicker>
				<Button icon="document-text" @click="exportData()">下载报表</Button>
			</div>
		</div>

		<Table :size="tableSize" :columns="tcolumns" :data="tdata.list" ref="TableExport" @on-sort-change="sortChange"></Table>
		<Row class="margin-top-10">
			<Col span="10">
			<Radio-group v-model="tableSize" type="button">
				<Radio label="large">大</Radio>
				<Radio label="default">中</Radio>
				<Radio label="small">小</Radio>
			</Radio-group>
			<Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="tableData()">
				<Option v-for="item in 50" :value="item" :key="item" v-if="item%5==0">{{ item }}</Option>
			</Select>
			</Col>
			<Col span="14" style="text-align: right;">
			<Page :total="tdata.total_number" :page-size="tdata.page_size" ref="pages" @on-change="tableData" show-elevator show-total></Page>
			</Col>
		</Row>

	</Card>
</template>
<script>
	import util from '@/utils/index';

	export default {
		name: 'viewTab',
		props: {
			media: Array,
			tdata: Object
		},
		data() {
			return {
				tab: ['按账户查看', '按负责人查看'],
				num: 0,
				selectState: [],
				mediaList: [],
				//每页数量 
				page: 1,
				page_size: 10,
				total_number: 1, //总数量
				total_page: 1, //总页数
				tableSize: 'small',
				//负责人
				group: '',
				//媒体型
				media_type: '',
				//按时间
				time: '',
				//排序
				orderField: '',
				orderDirection: 'SORT_ASC',
				//负责人
				author_model: [],
				tcolumns: [{
						title: '媒体',
						key: 'media_name',
					},
					{
						title: '账户名',
						key: 'account_name'
					},
					{
						title: '展现(暴光)',
						key: 'impression',
						sortable: 'custom',
					},
					{
						title: '点击数',
						key: 'click',
						sortable: 'custom',
					},

					{
						title: '推广余额',
						key: 'balance',
						sortable: 'custom',
						render: (h, params) => {
							const text = params.row.balance;
							const color = text < 2000 ? 'red' : 'default';
							return h('Tag', {
								props: {
									type: 'border',
									color: color
								}
							}, text)
						}
					},
					{
						title: '消耗',
						key: 'cost',
						sortable: 'custom',
					},
					{
						title: '注册',
						key: 'activation',
						sortable: 'custom',
					},
					{
						title: '注册成本',
						key: 'reg_cost',
						sortable: 'custom',
					},
					{
						title: '账户ID',
						key: 'id'
					},
					{
						title: '备注',
						key: 'date'
					},
				],
			}
		},
		watch: {
			media(data) {
				this.mediaList = util.mediaSelect(data);
			}
		},
		methods: {
			//这里的排序没有做哈哈哈
			tableData(page) {
				if(page === undefined) {
					this.$refs['pages'].currentPage = 1;
					this.page = 1;
				} else {
					this.page = page;
				};
				let param = {
					group_by: this.group,
					media_type: this.media_type,
					time: this.time,
					page: this.page,
					page_size: this.page_size,
					orderField: this.orderField,
					orderDirection: this.orderDirection, //排序的方向值SORT_ASC顺序 SORT_DESC倒序
					author:this.author_model
				};
				this.$store.dispatch('getOverview', param);
			},
			//Tab
			tabsChange(index) {
				this.num = index;
				if(!!index) {
					this.group = 'author';
					this.tableData();
				} else {
					this.$store.dispatch('getOverview');
				}
			},
			//分页
			changePage(val) {
				this.page = val;
				this.tableData();
			},
			//按时间
			changeTime(val) {
				this.time = val;
				this.tableData();
			},
			//导出表单
			exportData() {
				if(!this.tab) {
					this.$refs.TableExport.exportCsv({
						filename: '按账户查看'
					});
				} else {
					this.$refs.TableExport.exportCsv({
						filename: '按负责人查看'
					});
				}
			},
			//按媒体筛选
			mediaChange(val) {
				this.media_type = val;
				this.tableData();
			},
			//获取筛选媒体
			getMedia() {
				this.$store.dispatch('getMedia');
			},
			//排序
			sortChange(column) {
				this.orderField = column.key;
				if(column.order == "asc") {
					this.orderDirection = "SORT_ASC";
				} else if(column.order == "desc") {
					this.orderDirection = "SORT_DESC";
				} else {
					this.orderField = '';
					this.orderDirection = "";
				}
				this.tableData();
			},
			//获取负责人
			getAuthor() {
				this.$store.dispatch('getAuthor');
			},
		},
		computed: {
			//获取负责人
			author() {
				return this.$store.state.channel.author;
			},
		},
		mounted() {
			this.getMedia();
			this.getAuthor();
		}
	}
</script>