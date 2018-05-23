import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';  //框架样式
import user from './modules/user'; //用户信息
import newad from './modules/newad';  //新建广告
import setid from './modules/setid';  //帐号管理
import ucnew from './modules/ucnew';    // 新建uc广告
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
        ucnew
    }
});

export default store;
