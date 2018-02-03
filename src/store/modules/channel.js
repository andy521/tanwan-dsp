import  Axios  from "@/api/index"
import  util  from "@/utils/index"
const channel = {
    state: {
        list:[],
        page:0,
        page_size:0,
        total_number:0,
        total_page:0,
        game:[],
        media:{},
        account:[],
    },    
    mutations: {        
        GETCHANNELDATA (state , data){
            console.log(data);
            state.list = data.list;
            //当前页
            state.page = parseInt(data.page) || 1;
            //每页条数
            state.page_size = parseInt(data.page_size);
            //总条数
            state.total_number = parseInt(data.total_number);
            //总页数
            state.total_page = parseInt(data.total_page);
        },
        GAMELIST(state,data){            
            state.game = data
        },
        MEDIALIST(state,data){
            let media = util.mediaSelect(data);
            state.media = media
        },        
        ACCOUNT(state,data){           
            let a = [];
            for(let i in data){
                a.push({ 'value': data[i].account_id, 'label' : data[i].account_name })
            };
            state.account = a;
        }
    },    
    actions : {
        //获取 渠道信息 表格信息
        getChannelData({ commit }, param){
            let opt = param;
                opt.action = 'api';
                opt.opt = 'getGameTotalDay';
            Axios.get('api.php',opt)
            .then( 
                res=>{ commit('GETCHANNELDATA',res.data) }
            ).catch( 
                err=>{ console.log( err) }
            );
        },

        //获取全部游戏     
        getGame({ commit }){
            Axios.get('api.php',{'action':'api','opt':'getGameLists'})
            .then( 
                res=>{ commit('GAMELIST',res.data) }
            ).catch( 
                err=>{ console.log(err) }
            );
        },

        //获取全部媒体
        getMedia({ commit }){
            Axios.get('api.php',{'action':'api','opt':'getMedia'})
            .then( 
                res=>{ commit('MEDIALIST',res.data) }
            ).catch( 
                err=>{ console.log('获取媒体失败' + err) }
            ); 
        },

        //获取媒体账号        
        getAccount({commit},opt){
            console.log('获取媒体账号');
            Axios.get('api.php',{'action':'api','opt':'getAccount','MeidaType': opt })
            .then( 
                res=>{ commit('ACCOUNT',res.data) }
            ).catch( 
                err=>{ console.log('获取媒体账号' + err) }
            ); 
        }
    }
};


/*
do = products //产品总览
do = mediaOverview//媒体总览
do = accountOverview//账户总览
do = planOverview//计划总览
do = adsOverview//广告位总览

game_id  游戏 
tdate 开始日期
tdate2 结束日期
*/

export default channel;
