export const tableColumns = {
	checks: {
		type: 'selection',
		width: 60
	},
	game_name: {
		title: '产品名称',
		key: 'game_name',
		width: 200
	},
	account_name: {
		title: '媒体账户',
		key: 'account_name',
		width: 150
	},
	campaign_id: {
		title: '计划',
		key: 'campaign_id',
		width: 150
	},
	configured_status: {
		title: '广告开关',
		key: 'configured_status',
		width: 150,
		render: (h, params) => {
			return h('div', [
				h('i-switch', {
					props: {
						size: "small",
						value: params.row.configured_status == "AD_STATUS_NORMAL" ? true : false
					},
					on: {
						'on-change': (value) => {
							params.row.b = value;
						}
					}
				})
			]);
		}
	},
	//	site_id: {
	//		title: '广告状态',
	//		key: 'configured_status',
	//		width: 150
	//	},

	site_id: {
		title: '广告名称',
		key: 'site_id',
		width: 200,
		editable: true,
		render: (h, params) => {
			if(params.column.editable) {
				return h('Row', [
					h('Col', {
						props: {
							span: '18'
						}
					}, [
						h('span', params.row.e),
					]),
					h('Col', {
						props: {
							span: '6'
						}
					}, [
						h('i-button', {
							props: {
								icon: "edit",
								type: "text",
								size: "small"
							},
							on: {
								click: () => {
									console.log(params)
									alert(params.index)
									params.column.tab = params.index

								}
							}
						}),
					])
				])
			} else {
				h('Row', [
					h('Col', {
						props: {
							span: '18'
						}
					}, [
						h('Input', {
							props: {
								type: "text",
								size: "small",
								value: params.row.e
							},
						}),
					]),
					h('Col', {
						props: {
							span: '6'
						}
					}, [
						h('i-button', {
							props: {
								icon: "android-done",
								type: "text",
								size: "small"
							},
							on: {
								click: (value) => {
									console.log(value)
								}
							}
						})
					])
				])
			}
		},
	},
	impression: {
		title: '曝光',
		sortable: true,
		key: 'impression',
		width: 150,
		editable: true
	},
	//	click: {
	//		title: '点击量',
	//		sortable: true,
	//		key: 'click',
	//		width: 150
	//	},
	//	click: {
	//		title: '点击率',
	//		sortable: true,
	//		key: 'click',
	//		width: 150
	//	},
	//	click: {
	//		title: '点击均价',
	//		sortable: true,
	//		key: 'click',
	//		width: 150
	//	},
	//	click: {
	//		title: '出价',
	//		key: 'click',
	//		width: 150
	//	},
	cost: {
		title: '花费',
		sortable: true,
		key: 'cost',
		width: 150
	},
	//	click_cost: {
	//		title: '到达数',
	//		sortable: true,
	//		key: 'click_cost',
	//		width: 150
	//	},
	//	click_cost: {
	//		title: '到达率',
	//		sortable: true,
	//		key: 'click_cost',
	//		width: 150
	//	},
	//	click_cost: {
	//		title: '激活总量',
	//		sortable: true,
	//		key: 'click_cost',
	//		width: 150
	//	},
	//	click_cost: {
	//		title: '点击激活率',
	//		sortable: true,
	//		key: 'click_cost',
	//		width: 150
	//	},
	active: {
		title: '注册设备数',
		sortable: true,
		key: 'active',
		width: 150
	},
	reg_total: {
		title: '注册',
		sortable: true,
		key: 'reg_total',
		width: 150
	},
	reg_per: {
		title: '注册率',
		sortable: true,
		key: 'reg_per',
		width: 150
	},
	reg_cost: {
		title: '注册设备成本',
		sortable: true,
		key: 'reg_cost',
		width: 150
	},
	reg_imei_cost: {
		title: '注册成本',
		sortable: true,
		key: 'reg_imei_cost',
		width: 150
	},
	//	reg_imei_cost: {
	//		title: '活跃数',
	//		sortable: true,
	//		key: 'reg_imei_cost',
	//		width: 150
	//	},
	login_cost: {
		title: '活跃成本',
		sortable: true,
		key: 'login_cost',
		width: 150
	},
	pay_num: {
		title: '付费人数',
		sortable: true,
		key: 'pay_num',
		width: 150
	},
	pay_total: {
		title: '付费金额',
		sortable: true,
		key: 'pay_total',
		width: 150
	},
	pay_per: {
		title: '付费率',
		sortable: true,
		key: 'pay_per',
		width: 150
	},
	reg_arpu: {
		title: '注册ARPU',
		sortable: true,
		key: 'reg_arpu',
		width: 150
	},
	income_per: {
		title: '回本率',
		sortable: true,
		key: 'income_per',
		width: 150
	}
};

const taData = {
	tableColumns: tableColumns
};

export default taData;