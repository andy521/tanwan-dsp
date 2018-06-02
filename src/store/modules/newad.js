import Axios from "@/api/index";

const newad = {
    state: {
        //step: [0, 0], //导行定位
        // adgroup_detail: "", //定向详情

        ads_config: [], //所有状态
        product_type: [], //标的物类型       
        targeting_tags: [], //定向标签(地域)
        business_interest: [], //商业兴趣
        CustomAudiences: '', //获取自定义人群
        CustomAudiences_ex: '', //获取自定义人群排除
        appCategory: [], //app行为按分类
      
    },
    mutations: {
        save_step(state, step) {
            state.step = step;
        },
        // save_adgroup_detail(state, adgroup_detail) {
        //     state.adgroup_detail = adgroup_detail;
        // },
        GET_ADS_CONFIG(state, data) {
            state.ads_config = data;
        },
        GET_PRODUCT_TYPE(state, data) {
            state.product_type = data;
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

     
    }
};

export default newad;