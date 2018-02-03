import Axios from "@/api/index"

const plan = {
	state: {
		gameList: [],
		mediaList: [],
		campaignslist: [],
		adList: []
	},
	mutations: {
		GET_GAMELIST(state, data) {
			state.gameList = data;
		},
		GET_MEDIALIST(state, data) {
			state.mediaList = data;
		},
		GET_CAMPAIGNS(state, data) {
			state.campaignslist = data;
		},
		GET_ADLIST(state, data) {
			state.adList = data;
		}
	},
	actions: {
		//游戏列表
		getGameList({
			commit
		}) {
			Axios.get('api.php', {
				action: 'api',
				opt: 'getGameLists'
			}).then(res => {
				commit('GET_GAMELIST', res.data)
			}).catch(
				err => {
					console.log('游戏列表' + err)
				}
			)
		},
		//获取媒体账号
		getMediaList({
			commit
		}) {
			Axios.get('api.php', {
				action: 'api',
				opt: 'getAccount',
				MeidaType: 'Gdt'
			}).then(res => {
				commit('GET_MEDIALIST', res.data)
			}).catch(
				err => {
					console.log('获取媒体账号' + err)
				}
			)
		},
		//获取推广计划
		getCampaigns({
			commit
		}, id) {
			Axios.get('api.php', {
				action: 'api',
				opt: 'getcampaigns',
				MeidaType: 'Gdt',
				account_id: id
			}).then(
				res => {
					commit('GET_CAMPAIGNS', res.data)
				}
			).catch(
				err => {
					console.log('获取推广计划' + err)
				}
			)
		},
		//修改删除投放计划 (批量)
		amendCampaigns({
			commit
		}, data) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'campaigns_add',
				do: 'edits',
				id: data.id, //必传[13,12,12]
				type: data.type, //1 修改状态  3 删除 type
				configured_status: data.status, //AD_STATUS_NORMAL  有效  AD_STATUS_SUSPEND暂停 默认不传
			}).then(
				res => {
					console.log('批量修改删除投放计划' + res)
				}
			).catch(
				err => {
					console.log('批量修改删除投放计划' + err)
				}
			)
		},

		//修改删除投放计划  (单条)
		amendCampaign({
			commit
		}, data) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'campaigns_add',
				do: 'edit',
				account_id: data.account_id, //*必传*
				campaign_id: data.campaign_id, //传这个值就是修改当前计划 不传就是添加新的计划
				campaign_name: data.campaign_name, //计划名称  
				daily_budget: data.daily_budget, //日消耗限额
				configured_status: data.configured_status, //AD_STATUS_NORMAL  有效  AD_STATUS_SUSPEND暂停 默认不传
				speed_mode: data.speed_mode //SPEED_MODE_FAST加速投放 SPEED_MODE_STANDARD标准投放
			}).then(
				res => {
					console.log('修改删除投放计划' + res)
				}
			).catch(
				err => {
					console.log('修改删除投放计划' + err)
				}
			)
		},

		//获取实时投放计划
		getAdList({
			commit
		}, data) {
			Axios.post('api.php', {
				action: 'gdtAdPut',
				opt: 'campaigns',
				tdate: data.tdate, //开始时间
				edate: data.edate, //结速时间
				page: data.page, //页码
				page_size: data.page_size, //每页数量
				game_id: data.game_id, //游戏id
				account_id: data.account_id, //媒体账号
				configured_status: data.configured_status, //过滤无数据的广告
				campaign_id: data.campaign_id, //广告
				campaign_name: data.campaign_name, //关键字
				check_value: data.check_value //状态
			}).then(
				res => {
					commit('GET_ADLIST', res.data)
				}
			).catch(
				err => {
					console.log('获取实时投放计划' + err)
				}
			)
		},

	}
};

export default plan;