import  Axios  from "@/api/index"
import util from '@/utils/index';

const user = {
    state: {
        username : '',
        isLogin : 0,
        //用户自定义指标
        userindex:[],
        //account:'',
        report_account_id:""
    },
    mutations: {   
        REPORT_ACCOUNT_ID(state,id){
            state.report_account_id=id;
        },
        USER_LOGINOUT ( state ){
            state.username = ''
            state.isLogin = 0 
        },
        USER_LOGIN( state , user){
            state.username = user
            state.isLogin = 1 
            //console.log('用户登录 -----' + user)
        },
        USER_INDEX(state,data){
            let val = data ? data.split(',') : [];
            state.userindex = val
        },
        // SET_ACCOUNT(state,data){
        //     state.account = data
        // }
    },
    actions : {
        //用户登录
        UserLogin({ commit }, u){           
            commit('USER_LOGIN', u.user)
        },
        //退出登录
        LoginOut({ commit }){
            let parent = {
                'action' : 'sys',
                'opt' : 'logout',
                'sessionid' : util.getItem('sessionid')
            };  
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
            Axios.get('api.php', parent)
            .then(function(res){
                console.log('退出登录');
            })
            .catch(function(err){
                console.log('退出登录错误--' + err);
            });
            commit('USER_LOGINOUT');
            util.removeItem('user' );
            util.removeItem('sessionid');
            util.removeItem('access' );
        },
        //用户选择账号
        // setAccount({ commit }, data){
        //     commit('SET_ACCOUNT',data);
        // },
        //获取用户自定义指标
        DiyIndex({ commit },opt){
            let param = opt;
                param.action = 'sys';
                param.opt = 'get_user_memo';
            Axios.get('api.php',param)
            .then( 
                res=>{ commit('USER_INDEX', res.data) }
            ).catch( 
                err=>{ console.log(err) }
            );
        },
        //保存用户自定义指标
        SaveIndex({commit},opt){
            let param = opt;
                param.action = 'sys';
                param.opt = 'set_user_memo';            
            Axios.get('api.php',param)
            .then( 
                res=>{ console.log(res) }
            ).catch( 
                err=>{ console.log(err) }
            );
        }
    }
};

export default user;
