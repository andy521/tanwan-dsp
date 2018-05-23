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
export const ttNew = {
    path: '/ttnew',
    name: 'ttnew',
    meta: {
        title: '新建头条推广'
    },    
    component: () => import('@/components/childrouter/childrouter.vue'),
    children: [
        { path: 'campaign', title: '新建头条广告组', name: 'ttcampaign', component: () => import('@/views/toutiaonew/campaign.vue') },
        { path: 'ad', title: '新建头条广告计划', name: 'ttad', component: () => import('@/views/toutiaonew/ad.vue') },
        { path: 'targeting', title: '新建头条定向', name: 'tttargeting', component: () => import('@/views/toutiaonew/targeting.vue') },
        { path: 'creative', title: '新建头条创意', name: 'ttcreative', component: () => import('@/views/toutiaonew/creative.vue') },
    ]
};

export const otherRouter = {
    path: '/user',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'msgdetails', title: '系统消息详情', name: 'system_msg_details', component: () => import('@/views/setid/systemMsgDetails.vue') },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/',
        icon: 'ios-home',
        name: 'overview',
        redirect: '/home',
        title: '账户总览',
        component: Main,
        children: [
            { path: '/', title: '账户总览', name: 'home_index', icon: 'ios-home', component: () => import('@/views/home/home.vue') }
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
            { path: 'finance', title: '财务', name: 'time_finance', icon: 'android-radio-button-on', component: () => import('@/components/childrouter/childrouter.vue'),
            children: [ 
                { path: 'journal', title: '资金流水', name: 'time_journal',icon: 'android-radio-button-off',  component: () => import('@/views/time/finance/journal.vue')},
                { path: 'funds', title: '财务信息', name: 'time_funds',icon: 'android-radio-button-off', component: () => import('@/views/time/finance/funds.vue') }, 
                { path: 'rechargerecord', title: '充值记录', name: 'time_rechargerecord',icon: 'android-radio-button-off', component: () => import('@/views/time/finance/rechargerecord.vue') } 
            ]},
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
            { path: 'advertiser', title: '推广管理', name: 'uc_advertiser', icon: 'android-radio-button-on', component: () => import('@/components/childrouter/childrouter.vue'),
            children:[
                { path: 'plan', title: '推广计划', name: 'uc_plan', icon: 'android-radio-button-off', component: () => import('@/views/uc/index.vue') },
                { path: 'unit', title: '推广单元', name: 'uc_unit', icon: 'android-radio-button-off', component: () => import('@/views/uc/unit.vue') },
                { path: 'creativity', title: '创意', name: 'uc_creativity', icon: 'android-radio-button-off', component: () => import('@/views/uc/creativity.vue') },
            ]},
            { path: 'report', title: '数据报告', name: 'uc_report', icon: 'android-radio-button-off', component: () => import('@/views/uc/report.vue') },
            { path: 'finance', title: '财务', name: 'uc_finance', icon: 'android-radio-button-on', component: () => import('@/components/childrouter/childrouter.vue'),
            children: [ 
                { path: 'rechargerecord', title: '充值记录', name: 'uc_rechargerecord',icon: 'android-radio-button-off', component: () => import('@/views/uc/finance/rechargerecord.vue') }, 
            ]},
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
            { path: 'advertiser', title: '推广管理', name: 'tt_advertiser', icon: 'android-radio-button-on', component: () => import('@/components/childrouter/childrouter.vue'),
            children: [ 
                { path: 'campaign', title: '广告组', name: 'tt_campaign', icon: 'android-radio-button-off', component: () => import('@/views/toutiao/advertiser/campaign.vue')},
                { path: 'ad', title: '广告计划', name: 'tt_ad',icon: 'android-radio-button-off', component: () => import('@/views/toutiao/advertiser/ad.vue') },  
                { path: 'creative', title: '创意', name: 'tt_creative',icon: 'android-radio-button-off', component: () => import('@/views/toutiao/advertiser/creative.vue') },    
            ]},
            { path: 'report', title: '数据报告', name: 'tt_report', icon: 'android-radio-button-on', component: () => import('@/components/childrouter/childrouter.vue'),
            children: [ 
                { path: 'statement', title: '账户报表', name: 'tt_statement', icon: 'android-radio-button-off', component: () => import('@/views/toutiao/report/statement.vue')},
                { path: 'audience', title: '受众分析', name: 'tt_audience',icon: 'android-radio-button-off', component: () => import('@/views/toutiao/report/audience.vue') },  
                { path: 'bid', title: '效果广告报表', name: 'tt_bid',icon: 'android-radio-button-off', component: () => import('@/views/toutiao/report/bid.vue') }   
            ]},
            { path: 'finance', title: '财务', name: 'tt_finance', icon: 'android-radio-button-on', component: () => import('@/components/childrouter/childrouter.vue'),
            children: [ 
                { path: 'rechargerecord', title: '充值记录', name: 'tt_rechargerecord',icon: 'android-radio-button-off', component: () => import('@/views/toutiao/finance/rechargerecord.vue') }, 
            ]},
        ]
    },
    {
        path: '/baidu',
        icon: 'ios-paw',
        name: 'bd',
        title: '百度投放',
        access: 0,
        component: Main,
        children: [
            { path: 'index', title: '首页', name: 'bd_main', icon: 'android-radio-button-off', component: () => import('@/views/baidu/index.vue')},
            { path: 'advertiser', title: '推广管理', name: 'bd_advertiser', icon: 'android-radio-button-on', component: () => import('@/components/childrouter/childrouter.vue'),
            children: [
                { path: 'campaign', title: '推广计划', name: 'bd_campaign', icon: 'android-radio-button-off', component: () => import('@/views/baidu/advertiser/campaign.vue') },
                { path: 'adgroup', title: '推广单元', name: 'bd_adgroup', icon: 'android-radio-button-off', component: () => import('@/views/baidu/advertiser/adgroup.vue') },
                { path: 'creative', title: '推广创意', name: 'bd_creative', icon: 'android-radio-button-off', component: () => import('@/views/baidu/advertiser/creative.vue') }
            ]}
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
    ttNew,
    otherRouter,
    ...appRouter,
    page403,
    page404
];
