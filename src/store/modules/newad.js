import Axios from "@/api/index"

const newad = {
	state: {
		ads_config: [], //所有状态
		authorlist: [], //负责人
		campaign_type: [], //计划类型
		product_type: [], //标的物类型
		configured_status: [], //状态类型
		speed_mode: [], //投放速度模式
		targetings: {
			list:[]
		}, //定向
		targeting_tags: [], //定向标签(地域)
		business_interest: [], //商业兴趣
		CustomAudiences: '', //获取自定义人群
		CustomAudiences_ex: '', //获取自定义人群排除
        appCategory: [], ////app行为按分类
        gallery:{} //图库

	},
	mutations: {
		GET_ADS_CONFIG(state, data) {
			state.ads_config = data;
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
		GET_CUSTOMAUDIENCES(state, data) {
			state.CustomAudiences = data;
		},
		GET_CUSTOMAUDIENCESEX(state, data) {
			state.CustomAudiences_ex = data;
		},
		GET_APPCATEGORY(state, data) {
			state.appCategory = data;
        },
        GET_GALLERY(state, data){
            state.gallery = data;
        }
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

		//获取广告版位
		getAdSpace({
			commit
		}, data) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'ret_ads_config'
			}).then(res => {
				commit('GET_AD_SPACE', res.data.adcreative_template)
			}).catch(err => console.log('获取广告版位' + err))
		},

		//获取自定义人群
		get_CustomAudiences({
			commit
		}, data) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'custom_audiences_get',
				account_id: data.account_id,
				name: data.name
			}).then(res => {
				commit('GET_CUSTOMAUDIENCES', res.data)
			}).catch(err => console.log('获取自定义人群' + err))
		},

		//获取自定义人群排除
		get_CustomAudiences_ex({
			commit
		}, data) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'custom_audiences_get',
				account_id: data.account_id,
				name: data.name
			}).then(res => {
				commit('GET_CUSTOMAUDIENCESEX', res.data)
			}).catch(err => console.log('获取自定义人群' + err))
		},

		//app行为按分类
		get_appCategory({
			commit
		}) {
			Axios.get('api.php', {
				action: 'gdtAdPut',
				opt: 'targeting_tags',
				type: 'app_category'
			}).then(res => {
				commit('GET_APPCATEGORY', res.data)
			}).catch(err => console.log('app行为按分类' + err))
        },
        
        //获取图库
        get_gallery({commit},param){
            console.log(param)
            Axios.get('api.php',{'action':'gdtAdPut','opt':'adsimg','account_id':param.account_id,'width':param.width,'height':param.height})
            .then( 
                res=>{ commit('GET_GALLERY', res.data) }
            ).catch( 
                err=>{ console.log('获取图库失败' + err) }
            ); 
        }
	}
};

export default newad;