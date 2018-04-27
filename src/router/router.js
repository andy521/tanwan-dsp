import Main from '@/views/Main.vue';
// Main 框架的外层
export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录贪玩DSP后台'
    },
    component: () => import('@/views/login.vue')
};

//新建广告
export const newAd = {
    path: '/newad',
    name: 'newad',
    meta: {
        title: '新建广告'
    },
    component: () => import('@/views/newad/index.vue')
};

export const ucNew = {
    path: '/ucnew',
    name: 'ucnew',
    meta: {
        title: '新建UC推广'
    },    
    component: () => import('@/views/ucnew/index.vue'),
    children: [
        { path: 'plan', title: '新建UC推广计划', name: 'ucplan', component: () => import('@/views/ucnew/components/plan.vue') },
        { path: 'unit', title: '新建UC推广计划', name: 'ucunit', component: () => import('@/views/ucnew/components/unit.vue') },
        { path: 'idea', title: '新建UC推广计划', name: 'ucidea', component: () => import('@/views/ucnew/components/idea.vue') },
    ]
};

export const otherRouter = {
    path: '/user',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'useraccounts', title: '获取用户帐号', name: 'user_accounts', component: () => import('@/views/time/userAccounts.vue') },
        { path: 'msgdetails', title: '系统消息详情', name: 'system_msg_details', component: () => import('@/views/setid/systemMsgDetails.vue') },
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
            { path: 'index', title: '账户总览', name: 'home_index', component: () => import('@/views/home/home.vue') }
        ]
    },
    {
        path: '/time',
        icon: 'social-tux',
        title: '广点通实时投放',
        name: 'time',
        access: 0,
        component: Main,
        children: [
            { path: 'plan', title: '实时投放计划', name: 'time_plan', meta: { keepAlive: false}, icon: 'android-radio-button-off', component: () => import('@/views/time/plan.vue')},
            { path: 'ad', title: '实时投放广告', name: 'time_ad', icon: 'android-radio-button-off', component: () => import('@/views/time/ad.vue') },
            { path: 'finance', title: '财务', name: 'time_finance', icon: 'android-radio-button-off', component: () => import('@/views/time/finance.vue') },
        ]
    },
    {
        path: '/uc',
        icon: 'ios-flower-outline',
        name: 'uc',
        title: 'UC实时投放',  
        access: 0,      
        component: Main,
        children: [
            { path: 'plan', title: '推广计划', name: 'uc_plan', icon: 'android-radio-button-off', component: () => import('@/views/uc/index.vue') },
            { path: 'unit', title: '推广单元', name: 'uc_unit', icon: 'android-radio-button-off', component: () => import('@/views/uc/unit.vue') },
            { path: 'idea', title: '创意', name: 'uc_idea', icon: 'android-radio-button-off', component: () => import('@/views/uc/idea.vue') },
            { path: 'report', title: '数据报告', name: 'uc_report', icon: 'android-radio-button-off', component: () => import('@/views/uc/report.vue') },
        ]
    },
    {
        path: '/toutiao',
        icon: 'ios-paper',
        name: 'tt',
        title: '今日头条投放',  
        access: 0,      
        component: Main,
        children: [
            
            { path: 'index', title: '头条总览', name: 'tt_main', icon: 'android-radio-button-off', component: () => import('@/views/toutiao/index.vue') },   
            { path: 'ad', title: '广告组', name: 'tt_ad', icon: 'android-radio-button-off', component: () => import('@/views/toutiao/ad.vue') },   
            { path: 'plan', title: '广告计划', name: 'tt_plan', icon: 'android-radio-button-off', component: () => import('@/views/toutiao/plan.vue') },  
            { path: 'idea', title: '创意', name: 'tt_idea', icon: 'android-radio-button-off', component: () => import('@/views/toutiao/idea.vue') },        
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
            { path: 'product', title: '产品总览', name: 'channel_product', icon: 'android-radio-button-off', component: () => import('@/views/channel/product.vue') },
            { path: 'media', title: '媒体总览', name: 'channel_media', icon: 'android-radio-button-off', component: () => import('@/views/channel/media.vue') },
            { path: 'account', title: '账户总览', name: 'channel_account', icon: 'android-radio-button-off', component: () => import('@/views/channel/account.vue') },
            { path: 'plan', title: '计划总览', name: 'channel_plan', icon: 'android-radio-button-off', component: () => import('@/views/channel/plan.vue') },
            { path: 'ad', title: '广告总览', name: 'channel_ad', icon: 'android-radio-button-off', component: () => import('@/views/channel/ad.vue') }
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
            { path: 'modprfpsw', title: '修改个人信息', name: 'setid_modprfpsw', icon: 'android-radio-button-off', component: () => import('@/views/setid/modPrfPsw.vue') },
            { path: 'adduser', title: '添加账号', name: 'setid_adduser', icon: 'android-radio-button-off', component: () => import('@/views/setid/addUser.vue') },
            { path: 'userlist', title: '账号管理', name: 'setid_userlist', icon: 'android-radio-button-off', component: () => import('@/views/setid/userList.vue') },
            { path: 'addgroup', title: '添加权限组', name: 'setid_addgroup', icon: 'android-radio-button-off', component: () => import('@/views/setid/addGroup.vue') },
            { path: 'grouplist', title: '权限组管理', name: 'setid_grouplist', icon: 'android-radio-button-off', component: () => import('@/views/setid/groupList.vue') },
            { path: 'userlog', title: '账户日志', name: 'setid_userlog', icon: 'android-radio-button-off', component: () => import('@/views/setid/userLog.vue') },
            { path: 'principal', title: '负责人管理', name: 'setid_principal', icon: 'android-radio-button-off', component: () => import('@/views/setid/setid.vue') },
            { path: 'systemsetid', title: '系统账号管理', name: 'setid_systemsetid', icon: 'android-radio-button-off', component: () => import('@/views/setid/systemSetid.vue') },
            { path: 'systemmsg', title: '系统消息', name: 'setid_systemmsg', icon: 'android-radio-button-off', component: () => import('@/views/setid/systemMsg.vue') }
        ]
    }
];
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    newAd,
    ucNew,
    otherRouter,
    ...appRouter,
    page403,
    page404
];
