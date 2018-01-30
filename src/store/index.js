import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';  //框架样式
import user from './modules/user'; //用户信息
import home from './modules/home';  //账户总览
import channel from './modules/channel';  //渠道信息
import plan from './modules/plan';  //实时投放
import newad from './modules/newad';  //新建广告

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
        home,
        channel,
        plan,
        newad
    }
});

export default store;
