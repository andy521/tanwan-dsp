<style>
	@import "../../styles/common.less";
	.unread {
		font-weight: bold;
	}
</style>
<template>
	<div class="ad">
		<Card shadow>
			<Table :columns="columns1" :row-class-name="rowClassName" :data="getMessages.message" :size="tableSize" highlight-row @on-current-change="details"></Table>
			<Row class="margin-top-10">
				<Col span="10"> 表格尺寸
				<Radio-group v-model="tableSize" type="button">
					<Radio label="large">大</Radio>
					<Radio label="default">中</Radio>
					<Radio label="small">小</Radio>
				</Radio-group>
				每页显示
				<Select v-model="page_size" style="width:80px" placement="top" transfer>
					<Option v-for="item in 50" :value="item" :key="item" v-if="item%5==0">{{ item }}</Option>
				</Select>
				</Col>
				<Col span="14" style="text-align: right;">
				<Page :total="total_number" :page-size="page_size" ref="pages" show-elevator show-total></Page>
				</Col>
			</Row>

		</Card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableSize: 'small',
				page: 1, //第N页
				page_size: 15, //每页数量
				total_number: 1, //总数量
				total_page: 1, //总页数
				columns1: [{
						type: 'selection',
						width: 60,
						key: ''
					}, {
						title: '消息内容',
						key: 'uName',
						render: (h, params) => {
							if(params.row.have_read == 0) {
								return h('div', [
									h('Icon', {
										props: {
											type: 'email-unread',
											size: '16',
											color: '#e33244'
										},
										style: {
											marginRight: '5px'
										},
									}), params.row.uName
								]);
							} else {
								return h('div', [
									h('Icon', {
										props: {
											type: 'email',
											size: '16',
											color: '#999'
										},
										style: {
											marginRight: '5px'
										},
									}), params.row.uName
								]);
							}
						}
					},
					{
						title: '日期',
						width: 150,
						key: 'message_time'
					}
				]
			}
		},
		mounted() {
			this.$store.dispatch('getMessages');
		},
		methods: {
			//查看消息详情
			details(row) {
				this.$router.push({
					name: 'system_msg_details'
				});
				this.$store.dispatch('getSingleMessages', row.id);
			},
			//添加未读列表class
			rowClassName(row) {
				if(row.have_read == 0) {
					return 'unread';
				}
				return '';
			}
		},
		computed: {
			//获取消息
			getMessages() {
				return this.$store.state.setid.MessagesData;
			}
		}
	};
</script>