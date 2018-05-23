import Axios from "@/api/index"

const setid = {
	state: {
		//AdsAccount: [], //帐号列表
		//AdsAthour: [], //管理员
		//AdsAcccountJson: [], //帐号列表json
		//OpAccountUId: [], //已配置管理员
		MessagesData: {
			read_count: {},
			message: []
		}, //系统消息
        SingleMessages: {}, //系统消息详情
        planparam:''
	},
	mutations: {
        saveplan(state, data){
            state.planparam = data;
        },
		// GET_ADSACCOUNT(state, data) {
		// 	state.AdsAccount = data;
		// },
		// GET_ADSATHOUR(state, data) {
		// 	state.AdsAthour = data;
		// },
		// GET_ADSACCCOUNTJSON(state, data) {
		// 	state.AdsAcccountJson = data;
		// },
		// GET_OPACCOUNTUID(state, data) {
		// 	state.OpAccountUId = data;
		// },
		GET_MESSAGES(state, data) {
			state.MessagesData = data;
		},
		GET_SINGLEMESSAGES(state, data) {
			state.SingleMessages = data;
		},
	},
	actions: {
		//帐号列表
		// getAdsAccount({
		// 	commit
		// }, data) {
		// 	Axios.get('api.php', {
		// 		action: 'sys',
		// 		opt: 'getAdsAccount',
		// 		page: data.page,
		// 		page_size: data.page_size
		// 	}).then(res => {
		// 		commit('GET_ADSACCOUNT', res.data)
		// 	}).catch(
		// 		err => {
		// 			console.log('帐号列表' + err)
		// 		}
		// 	)
		// },
		//获取管理员
		// getAdsAthour({
		// 	commit
		// }) {
		// 	Axios.get('api.php', {
		// 		action: 'sys',
		// 		opt: 'getAdsAthour'
		// 	}).then(res => {
		// 		commit('GET_ADSATHOUR', res.data)
		// 	}).catch(
		// 		err => {
		// 			console.log('获取管理员' + err)
		// 		}
		// 	)
		// },

		//帐号列表json
		// getAdsAcccountJson({
		// 	commit
		// }) {
		// 	Axios.get('api.php', {
		// 		action: 'sys',
		// 		opt: 'getAdsAcccountJson'
		// 	}).then(res => {
		// 		commit('GET_ADSACCCOUNTJSON', res.data)
		// 	}).catch(
		// 		err => {
		// 			console.log('帐号列表json' + err)
		// 		}
		// 	)
		// },

		//获取已配置管理员
		// getOpAccountUId({
		// 	commit
		// }, uId) {
		// 	Axios.get('api.php', {
		// 		action: 'sys',
		// 		opt: 'getOpAccount',
		// 		uId: uId
		// 	}).then(res => {
		// 		commit('GET_OPACCOUNTUID', res.data)
		// 	}).catch(
		// 		err => {
		// 			console.log('帐号列表json' + err)
		// 		}
		// 	)
		// },
		//获取系统消息
		getMessages({
			commit
		}) {
			Axios.get('api.php', {
				action: 'sys',
				opt: 'get_messages'
			}).then(res => {
				commit('GET_MESSAGES', res.data)
			}).catch(
				err => {
					console.log('获取系统消息' + err)
				}
			)
		},
		//获取系统消息详情
		getSingleMessages({
			commit
		}, id) {
			Axios.get('api.php', {
				action: 'sys',
				opt: 'get_single_message',
				id: id
			}).then(res => {
				commit('GET_SINGLEMESSAGES', res.data)
			}).catch(
				err => {
					console.log('获取系统消息详情' + err)
				}
			)
		},

	}
};

export default setid;