import Main from '@/views/Main.vue';
// Main 框架的外层

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录贪玩DSP后台'
    },
    component: () => import('@/views/login.vue')
};

export const newAd = {
    path: '/newad',
    name: 'newad',
    meta: {
        title: '新建广告'
    },
    component: () => import('@/views/newad/index.vue')
};


export const otherRouter = {
    path: '/user',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'useraccounts', title: '获取用户帐号', name: 'user_accounts',  component: () => import('@/views/time/userAccounts.vue') },
        { path: 'msgdetails', title: '系统消息详情', name: 'user_msgdetails',  component: () => import('@/views/setid/systemMsgDetails.vue') }
    ]
};


// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/',
        icon: 'ios-home',
        name: 'overview',
        title: '账户总览',
        component: Main,
        children: [
            { path: 'index', title: '账户总览', name: 'home_index', component: () => import('@/views/home/home.vue')}
        ]
    },
    {
        path: '/time',
        icon: 'clock',
        title: '实时投放',
        name: 'time',
        access: 0,
        component: Main,
        children: [
            { path: 'plan', title: '实时投放计划', name: 'time_plan', icon: 'android-radio-button-off', component: () => import('@/views/time/plan.vue') },
            { path: 'ad', title: '实时投放广告', name: 'time_ad', icon: 'android-radio-button-off', component: () => import('@/views/time/ad.vue') },
        ]
    },
    {
        path: '/channel',
        icon: 'android-apps',
        title: '渠道信息',
        name: 'channel',
        access: 0,
        component: Main,
        children: [
            { path: 'product', title: '产品总览', name: 'channel_product',  icon: 'android-radio-button-off', component: () => import('@/views/channel/product.vue') },
            { path: 'media', title: '媒体总览', name: 'channel_media',  icon: 'android-radio-button-off', component: () => import('@/views/channel/media.vue') },
            { path: 'account', title: '账户总览', name: 'channel_account',  icon: 'android-radio-button-off', component: () => import('@/views/channel/account.vue') },
            { path: 'plan', title: '计划总览', name: 'channel_plan',  icon: 'android-radio-button-off', component: () => import('@/views/channel/plan.vue') },
            { path: 'ad', title: '广告总览', name: 'channel_ad',  icon: 'android-radio-button-off', component: () => import('@/views/channel/ad.vue') }
        ]
    },    
    {
        path: '/setid',
        icon: 'gear-a',
        title: '账号管理',
        name: 'setid',
        access: 0,
        component: Main,
        children: [
            { path: 'principal', title: '负责人管理', name: 'setid_principal', icon: 'android-radio-button-off', component: () => import('@/views/setid/setid.vue')},
            { path: 'systemsetid', title: '系统账号管理', name: 'setid_systemsetid', icon: 'android-radio-button-off', component: () => import('@/views/setid/systemSetid.vue')},
            { path: 'systemmsg', title: '系统消息', name: 'setid_systemmsg', icon: 'android-radio-button-off', component: () => import('@/views/setid/systemMsg.vue')}
        ]
    }
];
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    newAd,
    otherRouter,
    ...appRouter
];
