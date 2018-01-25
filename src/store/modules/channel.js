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
    },
    mutations: {        
        GETPRODUCT (state , data){
            //console.log(data);
            state.list = data.list;
            state.page = data.page;
            state.page_size = data.page_size;
            state.total_number = data.total_number;
            state.total_page = data.total_page;
        },
        GAMELIST(state,data){
            state.game = data
        },
        MEDIALIST(state,data){
            let media = util.mediaSelect(data);
            state.media = media
        }
    },
    actions : {
        getProduct({ commit }, param){
            let opt = param;
                opt.action = 'api';
                opt.opt = 'getGameTotalDay';
            Axios.get('api.php',opt)
            .then( 
                res=>{ commit('GETPRODUCT',res.data) }
            ).catch( 
                err=>{ console.log( err) }
            );
        },        
        getGame({ commit }){
            //获取全部游戏            
            Axios.get('api.php',{'action':'api','opt':'getGameLists'})
            .then( 
                res=>{ commit('GAMELIST',res.data) }
            ).catch( 
                err=>{ console.log(err) }
            );
        },
        getMedia({ commit }){
            Axios.get('api.php',{'action':'api','opt':'getMedia'})
            .then( 
                res=>{ commit('MEDIALIST',res.data) }
            ).catch( 
                err=>{ console.log('获取媒体失败' + err) }
            ); 
        },
        getFilterProduct({commit},param){
            let opt = param;
                opt.action = 'api';
                opt.opt = 'products'; 

            Axios.post('api.php',opt)
            .then( 
                res=>{ console.log( res) }
            ).catch( 
                err=>{ console.log(err) }
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
