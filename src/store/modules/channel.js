import  Axios  from "@/api/index"
import  util  from "@/utils/index"
const channel = {
    state: {
        list:[],
        total_number:0,
        total_page:0,
        game:[],
        media:{},
        account:[],
        plan:[],
        author:[],
        adgroups:[],
    },    
    mutations: {        
        GETCHANNELDATA (state , data){
            console.log(data)
            state.list = data.list;
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
            //console.log(a)
            state.account = a;
        },
        CAMPAIGNS(state,data){
            let c = []
            for(let i in data){
                c.push({ 'value': data[i].campaign_id, 'label' : data[i].campaign_name })
            }
            state.plan = c;
        },
        AUTHOR(state,data){
            let a = [{'value':'','label':'全部'}];
            for(let i in data){
                a.push({ 'label': data[i].author, 'value' : encodeURIComponent(data[i].author) })
            };
            state.author = a;
        },
        ADGROUPS(state,data){
            let a = [];
            for(let i in data){
                a.push({ 'value': data[i].adgroup_id, 'label' : data[i].adgroup_name })
            };
            state.adgroups = a;
        }
    },    
    actions : {
        //获取 渠道信息 表格信息
        getChannelData({ commit }, param){
            let opt = param;
                opt.action = 'api';
                opt.opt = 'getGameTotalDay';
            console.log(opt)
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

        //获取账号        
        getAccount({commit},opt){            
            Axios.get('api.php',{'action':'api','opt':'getAccount','MeidaType': opt })
            .then( 
                res=>{ commit('ACCOUNT',res.data) }
            ).catch( 
                err=>{ console.log('获取媒体账号' + err) }
            ); 
        },

        //获取计划
        planCampaigns({commit}, opt){
            let param = Object.assign({'action':'api','opt':'getcampaigns'}, opt);
            Axios.get('api.php',param)
            .then( 
                res=>{ commit('CAMPAIGNS', res.data) }
            ).catch( 
                err=>{ console.log('获取媒体账号' + err) }
            ); 
        },

        //获取负责人
        getAuthor({commit}){
            Axios.get('api.php',{'action':'api','opt':'getAuthor'})
            .then( 
                res=>{ commit('AUTHOR',res.data) }
            ).catch( 
                err=>{ console.log('获取负责人' + err) }
            ); 
        },

        //广告选择
        Adgroups({commit}, opt){
            console.log('广告选择');
            // MeidaType
            // account_id
            let param = Object.assign({'action':'api','opt':'getAdgroups'}, opt);            
            Axios.get('api.php',param)
            .then( 
                res=>{ commit('ADGROUPS', res.data) }
            ).catch( 
                err=>{ console.log('获取负责人' + err) }
            ); 
        }
    }
};

export default channel;
