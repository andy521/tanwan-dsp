import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import {routers, otherRouter, appRouter} from './router';
import Util from '@/utils/index';
Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

const router = new VueRouter(RouterConfig);
// 输出router
export default router;


router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);     
    if ( !Util.getItem('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
        next({
            name: 'login'
        });
    } else if ( Util.getItem('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
        Util.title();
        next({
            name: 'home_index'
        });
    } else {
        const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
        //console.log(curRouterObj);
        if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
            if (curRouterObj.access === parseInt( Util.getItem('access'))) {
                Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
            } else {
                next({
                    replace: true,
                    name: 'error-403'
                });
            }
        } else { //没有配置权限的路由, 直接通过
            Util.toDefaultPage([...routers], to.name, router, next);
        }
    }    
    //console.log("用户名是" +  Util.getItem('user') )
})

router.afterEach((to) => {    
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});