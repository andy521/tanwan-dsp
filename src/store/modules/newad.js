import Axios from "@/api/index"

const newad = {
	state: {
		authorlist: [],
		campaign_type: {},
		product_type: {},
        configured_status: {},

        adcreative_template:[],
	},
	mutations: {
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
        
        //广告版位
        GET_AD_SPACE(state,data){
            //console.log(data)        
            state.adcreative_template = data;
        }
	},
	actions: {
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

		//新建提交第一步数据
		campaignsAdd({
			commit
		}, data) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'campaigns_add',
				do: data.do,
				account_id: data.account_id,
				campaign_type: data.campaign_type,
				campaign_name: data.campaign_name,
				daily_budget: data.daily_budget,
				product_type: data.product_type,
				configured_status: data.configured_status,
				speed_mode: data.speed_mode
			}).then(res => {
                console.log(res)
				console.log('新建广告计划成功')
			}).catch(
				err => {
					console.log('新建广告计划' + err)
				}
			)
        },
        

        //获取广告版位
        getAdSpace( {commit}, data ){
            Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'ret_ads_config'
			}).then(res => {
                //console.log( res.data.adcreative_template )
                commit('GET_AD_SPACE', res.data.adcreative_template )
            }).catch( err => console.log('获取广告版位' + err ))
        }

	}
};

export default newad;