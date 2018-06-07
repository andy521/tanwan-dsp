import Axios from "@/api/index";
import util from '@/utils/index';

const user = {
    state: {
        // username: '',
        // isLogin: 0,
        userindex: [], //用户自定义指标
        report_account_id: "",
        cache_gdt_plan: "", //缓存广点通投放计划
        cache_toutiao_campaign: "", //缓存头条广告组
        cache_toutiao_ad: "", //缓存头条广告计划
    },
    mutations: {
        REPORT_ACCOUNT_ID(state, id) {
            state.report_account_id = id;
        },
        // USER_LOGINOUT(state) {
        //     state.username = ''
        //     state.isLogin = 0
        // },
        // USER_LOGIN(state, user) {
        //     state.username = user
        //     state.isLogin = 1
        //     //console.log('用户登录 -----' + user)
        // },
        USER_INDEX(state, data) {
            let val = data ? data.split(',') : [];
            state.userindex = val
        },
        CACHE_GDT_PLAN(state, data) {
            state.cache_gdt_plan = data;
        },
        CACHE_TOUTIAO_CAMPAING(state, data) {
            state.cache_toutiao_campaign = data;
        },
        CACHE_TOUTIAO_AD(state, data) {
            state.cache_toutiao_ad = data;
        },
    },
    actions: {
        //用户登录
        // UserLogin({
        //     commit
        // }, u) {
        //     commit('USER_LOGIN', u.user)
        // },
        //退出登录
        // LoginOut({
        //     commit
        // }) {
        //     // let theme = '';
        //     // if (localStorage.theme) {
        //     //     theme = localStorage.theme;
        //     // }
        //     // if (theme) {
        //     //     localStorage.theme = theme;
        //     // }
        //     Axios.get('api.php', {
        //         action: 'sys',
        //         opt: 'logout',
        //         sessionid: util.getItem('sessionid')
        //     }).then(function (res) {
        //         //清除信息
        //         //localStorage.clear();
        //         util.removeItem('sessionid');
        //         util.removeItem('access');
        //         console.log('退出登录');
        //     }).catch(function (err) {
        //         console.log('退出登录错误--' + err);
        //     });
        // },
        //获取用户自定义指标
        DiyIndex({
            commit
        }, opt) {
            let param = opt;
            param.action = 'sys';
            param.opt = 'get_user_memo';
            Axios.get('api.php', param)
                .then(
                    res => {
                        commit('USER_INDEX', res.data)
                    }
                ).catch(
                    err => {
                        console.log(err)
                    }
                );
        },
        //保存用户自定义指标
        SaveIndex({
            commit
        }, opt) {
            let param = opt;
            param.action = 'sys';
            param.opt = 'set_user_memo';
            Axios.get('api.php', param)
                .then(
                    res => {
                        console.log(res)
                    }
                ).catch(
                    err => {
                        console.log(err)
                    }
                );
        }
    }
};

export default user;