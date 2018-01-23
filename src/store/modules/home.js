import  Axios  from "@/api/index"
const home = {
    state: {
        userNmae : '',
        total: {},
        echart:{},
        table : {
            page:0,
            page_size:0,
            list:'',
        },
    },
    mutations: {       
        GETOVERIEW ( state , data){
            console.log(data)  
            state.total = data.total;
            state.table = {
                page: data.page,
                page_size : data.page_size,
                total_number : data.total_number,
                total : data.total_page,
                list: data.list,            
            };
            state.echart = data.echart;
        }
    },
    actions : {
        getMenuList({ commit }){
            Axios.post('api.php') .then( res=>{ commit('GETOVERIEW',res.data) }).catch( err=>{console.log(err)});           
        },
        getNextPage({ commit },page){
            Axios.get('api.php',{'filed':'click','page': page ,'page_size':'50'}).then(
                res => {
                    console.log('下一页数据')
                    console.log(res)
                }
            ).catch(
                err =>{ console.log(err) }
            )
        }
    }
};

export default home;
