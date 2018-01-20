import Vue from 'vue';
import iView from 'iview';
import  router from './router/index';
//import { appRouter } from './router/router';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import util from './utils/index';

Vue.use(iView);
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        console.log('mounted');
    },
    created () {

    }
});

