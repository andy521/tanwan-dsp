import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';  //框架样式
import user from './modules/user'; //用户信息
import home from './modules/home'  //账户总览

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
        home
    }
});

export default store;
