import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';  //框架样式
import user from './modules/user'; //用户信息
import newad from './modules/newad';  //新建广告
import setid from './modules/setid';  //帐号管理
import uc from './modules/uc';    // 新建uc广告
import bd from './modules/baidu';    // 百度
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {

    },
    mutations: {
    },
    actions: {

    },
    modules: {
        app, 
        user,
        newad,
        setid,
        uc,
        bd
    }
});

export default store;
