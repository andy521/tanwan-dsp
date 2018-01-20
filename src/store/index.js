import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        app,   //框架自己的store
        //user //用户状态 store
    }
});

export default store;
