import Axios from "@/api/index"

const newad = {
	state: {
		ads_config: [], //所有状态
		authorlist: [], //负责人
		campaign_type: [], //计划类型
		product_type: [], //标的物类型
		configured_status: [], //状态类型
		speed_mode: [], //投放速度模式
		targetings: [], //定向
		targeting_tags: [], //定向标签(地域)
        business_interest: [], //商业兴趣
	},
	mutations: {
		GET_ADS_CONFIG(state, data) {
			state.ads_config = data;
		},
		GET_AUTHOR(state, data) {
			state.authorlist = data;
		},
		GET_CAMPAIGN_TYPE(state, data) {
			state.campaign_type = data;
		},
		GET_PRODUCT_TYPE(state, data) {
			state.product_type = data;
		},
		GET_CONFIGURED_TYPE(state, data) {
			state.configured_status = data;
		},
		GET_SPEED_TYPE(state, data) {
			state.speed_mode = data;
		},
		GET_TARGETINGS(state, data) {
			state.targetings = data;
		},
		GET_TARGETING_TAGS(state, data) {
			state.targeting_tags = data;
		},
		GET_BUSINESS_INTEREST(state, data) {
			state.business_interest = data;
        },
	},
	actions: {
		//获取所有状态ret_ads_config
		get_ads_config({
			commit
		}) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'ret_ads_config'
			}).then(res => { 
				commit('GET_ADS_CONFIG', res.data)
			}).catch(
				err => {
					console.log('获取所有状态' + err)
				}
			)
		},

		//获取商业兴趣
		get_business_interest({
			commit
		}) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'targeting_tags',
				type: 'Business_interest'
			}).then(res => {
				commit('GET_BUSINESS_INTEREST', res.data)
			}).catch(
				err => {
					console.log('获取商业兴趣' + err)
				}
			)
		},

		//获取负责人
		getAuthorlist({
			commit
		}) {
			Axios.get('api.php', {
				action: 'api',
				opt: 'getAuthor'
			}).then(res => {
				commit('GET_AUTHOR', res.data)
			}).catch(
				err => {
					console.log('获取负责人' + err)
				}
			)
		},

		//获取计划类型
		get_campaign_type({
			commit
		}) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'get_campaign_type'
			}).then(res => {
				commit('GET_CAMPAIGN_TYPE', res.data)
			}).catch(
				err => {
					console.log('获取计划类型' + err)
				}
			)
		},

		//获取标的物类型
		get_product_type({
			commit
		}) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'get_product_type'
			}).then(res => {
				commit('GET_PRODUCT_TYPE', res.data)
			}).catch(
				err => {
					console.log('获取标的物类型' + err)
				}
			)
		},

		//获取状态类型
		get_configured_status({
			commit
		}) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'get_configured_status'
			}).then(res => {
				commit('GET_CONFIGURED_TYPE', res.data)
			}).catch(
				err => {
					console.log('获取状态类型' + err)
				}
			)
		},
		//获取投放速度模式
		get_speed_mode({
			commit
		}) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'get_speed_mode'
			}).then(res => {
				commit('GET_SPEED_TYPE', res.data)
			}).catch(
				err => {
					console.log('获取投放速度模式' + err)
				}
			)
		},

		//获取定向
		get_targetings({
			commit
		}) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'targetings'
			}).then(res => {
				commit('GET_TARGETINGS', res.data)
			}).catch(
				err => {
					console.log('获取定向' + err)
				}
			)
		},

		//获取定向标签(地域)
		get_targeting_tags({
			commit
		}) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'targeting_tags'
			}).then(res => {
				commit('GET_TARGETING_TAGS', res.data)
			}).catch(
				err => {
					console.log('获取定向标签(地域)' + err)
				}
			)
        },

        
	}
};

export default newad;