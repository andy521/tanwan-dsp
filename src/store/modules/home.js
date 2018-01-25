import  Axios  from "@/api/index"
import util from '@/utils/index';
const home = {
    state: {
        userNmae : '',
        //数据汇总
        total: {},
        //曝光率
        echart:{},
        media:[],
        //按账户查看
        account:{
            page:0,
            page_size:0,
            total_number:0,
            list:[],
        },
        //按负责人查看
        principal:{
            page:0,
            page_size:0,
            total_number:0,
            total :0,
            list:[],
        },
    },
    mutations: {       
        GETOVERIEW ( state , data){
            state.total = data.total;
            state.account = { page: data.page, page_size : data.page_size, total_number : data.total_number, total : data.total_page, list: data.list };
            state.echart = data.echart;
        },
        GETPRINCIPAL (state, data){
            state.principal = { page: data.page, page_size : data.page_size, total_number : data.total_number, total : data.total_page, list: data.list };
        },
        SETMEDIA (state , data){ 
            state.media = data
        },
        ACCOUNTVIEW(state , data){
            console.log('按账户查看')
            console.log(data)
            state.account = { page:data.page, page_size:data.page, total_number:data.page, list:data.list}
        },
        PRINCIPALVIEW(state , data){
            console.log('按负责人查看')
            state.principal = { page:data.page, page_size:data.page, total_number:data.page, list:data.list }
        },
        GETMEDIA(state,data){
            state.principal = state.account = { page: data.page, page_size : data.page_size, total_number : data.total_number, total : data.total_page, list: data.list };
        }
    },
    actions : {
        //账户总览
        getOverview({commit},param){
            let opt = param || {};
            //console.log(opt)
            Axios.get('api.php', opt)
            .then( 
                res=>{ commit('GETOVERIEW',res.data) }
            ).catch( 
                err=>{ console.log('账户总览' + err) }
            );           
        },
        getPrincipal({ commit },param){
            let opt = param ||{};
                opt.group_by = 'author';
            Axios.get('api.php',opt)
            .then( 
                res=>{ commit('GETPRINCIPAL',res.data) }
            )
        },
        //筛选时间
        filterTime({ commit }, param){
            let opt = param;
            if(!!opt.tab){
                opt.group_by = 'author';
            }
            Axios.get('api.php', opt )
            .then( 
                res=>{  
                    if(!!opt.tab){
                        commit('PRINCIPALVIEW', res.data )  
                    }else{
                        commit('ACCOUNTVIEW', res.data )  
                    }                    
                }
            ).catch( 
                err=>{ console.log('筛选时间失败' + err) }
            );

        },
        //按媒体筛选
        filterMedia({ commit }, val){
            Axios.get('api.php',{'media_type':val})
            .then( 
                res=>{  commit('GETMEDIA', res.data ) }
            )
        },
        //获取媒体
        getMedia({ commit }){
            Axios.get('api.php',{'action':'api','opt':'getMedia'})
            .then( 
                res=>{ commit('SETMEDIA',res.data) }
            ).catch( 
                err=>{ console.log('获取媒体失败' + err) }
            ); 
        }
    }
};

export default home;