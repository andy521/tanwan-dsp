import Main from '@/views/Main.vue';
// Main 框架的外层


// 不作为Main组件的子页面,登录
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component : require('@/views/login.vue')
};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在 otherRouter 里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
    ]
};



// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/access',
        icon: 'key',
        name: 'access',
        title: '账户总览',
        component: Main,
        children: [
            { path: 'index', title: '账户总览', name: 'access_index', component : require('@/views/home/home.vue') }
        ]
    },
    {
        path: '/access-test',
        icon: 'lock-combination',
        title: '实时投放',
        name: 'accesstest',
        access: 0,
        component: Main,
        children: [
            { path: 'index', title: '实时投放计划', name: 'ss_index', access: 0, component : require('@/views/home/home.vue') },
            { path: 'index', title: '实时投放广告', name: 'ss_ad', access: 0, component : require('@/views/home/home.vue') },
        ]
    }
    
];


// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter
];