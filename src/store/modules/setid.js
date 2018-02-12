import Axios from "@/api/index"

const setid = {
	state: {
		AdsAccount: [],
		AdsAthour: [],
		AdsAcccountJson: [],
		OpAccountUId: []
	},
	mutations: {
		GET_ADSACCOUNT(state, data) {
			state.AdsAccount = data;
		},
		GET_ADSATHOUR(state, data) {
			state.AdsAthour = data;
		},
		GET_ADSACCCOUNTJSON(state, data) {
			state.AdsAcccountJson = data;
		},
		GET_OPACCOUNTUID(state, data) {
			state.OpAccountUId = data;
		},
	},
	actions: {
		//帐号列表
		getAdsAccount({
			commit
		}, data) {
			Axios.get('api.php', {
				action: 'sys',
				opt: 'getAdsAccount',
				page: data.page,
				page_size: data.page_size
			}).then(res => {
				commit('GET_ADSACCOUNT', res.data)
			}).catch(
				err => {
					console.log('帐号列表' + err)
				}
			)
		},
		//获取管理员
		getAdsAthour({
			commit
		}) {
			Axios.get('api.php', {
				action: 'sys',
				opt: 'getAdsAthour'
			}).then(res => {
				commit('GET_ADSATHOUR', res.data)
			}).catch(
				err => {
					console.log('获取管理员' + err)
				}
			)
		},

	

		//帐号列表json
		getAdsAcccountJson({
			commit
		}) {
			Axios.get('api.php', {
				action: 'sys',
				opt: 'getAdsAcccountJson'
			}).then(res => {
				commit('GET_ADSACCCOUNTJSON', res.data)
			}).catch(
				err => {
					console.log('帐号列表json' + err)
				}
			)
		},

		//获取已配置管理员
		getOpAccountUId({
			commit
		}, uId) {
			Axios.get('api.php', {
				action: 'sys',
				opt: 'getOpAccount',
				uId: uId
			}).then(res => {
				commit('GET_OPACCOUNTUID', res.data)
			}).catch(
				err => {
					console.log('帐号列表json' + err)
				}
			)
		},

	}
};

export default setid;