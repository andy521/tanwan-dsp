import  Axios  from "@/api/index"
import util from '@/utils/index';

const user = {
    state: {
        username : '',
        isLogin : 0,
    },
    mutations: {        
        USER_LOGINOUT ( state ){
            state.username = ''
            state.isLogin = 0 
        },
        USER_LOGIN( state , user){
            state.username = user
            state.isLogin = 1 
            //console.log('用户登录 -----' + user)
        },
    },
    actions : {
        UserLogin({ commit }, u){           
            commit('USER_LOGIN', u.user)
        },
        LoginOut({ commit }){
            util.removeItem('user' );
            util.removeItem('access' );
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
            commit('USER_LOGINOUT')
        },
    }
};

export default user;
