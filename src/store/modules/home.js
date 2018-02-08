import  Axios  from "@/api/index"
import util from '@/utils/index';
const home = {
    state: {
        userNmae : '',
        //数据汇总
        total: {
            impression:0,
            click:0,
            balance_1:0,
            balance_2:0,
            balance_4:0
        },
        //曝光率
        echart:{},
        media:[],
        tdata:{},
    },
    mutations: {       
        GETOVERIEW ( state , data){
            state.total = data.total;            
            state.echart = data.echart;
            state.tdata = {
                total_number:data.total_number,
                total_page:data.total_page,
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