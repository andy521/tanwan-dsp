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
        data:{}
    },
    mutations: {       
        GETOVERIEW ( state , data){
            state.total = data.total;            
            state.echart = data.echart;
            state.data = { 
                page: parseInt(data.page), 
                page_size : parseInt(data.page_size), 
                total_number : parseInt(data.total_number), 
                total : parseInt(data.total_page), 
                list: data.list 
            };
        }, 
        SETMEDIA (state , data){ 
            state.media = data
        },
    },
    actions : {
        //账户总览
        getOverview({commit},param){
            let opt = param || {};
            console.log(opt)
            Axios.get('api.php', opt)
            .then( 
                res=>{ commit('GETOVERIEW',res.data) }
            ).catch( 
                err=>{ console.log('账户总览' + err) }
            );           
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