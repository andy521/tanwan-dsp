import axios from "axios";
import qs from "qs";
import { Message } from 'iview';

let cancel ,promiseArr = {}
const CancelToken = axios.CancelToken;
const Axios = axios.create({
    baseURL: "http://ads.tanwan.com",
    timeout: 10000,
    responseType: "json",
    withCredentials: true, // 是否允许带cookie这些
    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}
});

//axios不支持jsonp，所以你需要把服务端改为 header("Access-Control-Allow-Origin: *"); 

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
    config => {
        // 在发送请求之前做某件事
        if ( config.method === "post" ||  config.method === "put" ||  config.method === "delete"){
            // 序列化
            config.data = qs.stringify(config.data);
        }
        // 若是有做鉴权token , 就给头部带上token
        if (localStorage.token) {
            config.headers.Authorization = localStorage.token;
        }    
        return config;
    },
    error => {
        Message.info(error);
        console.log(error);
        return Promise.reject(error.data.error.message);
    }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
    res => {
        //对响应数据做些事
        if (res.data && !res.data.success) {
            //console.log('提示加载');
            return Promise.reject(res.data.error.message);
        }
        return res;
    },
    error => {
        // 返回 response 里的错误信息
        Message.info('这里错误要提示222');
        let errorInfo =  error.data.error ? error.data.error.message : error.data;
        return Promise.reject(errorInfo);
    }
);


export default {
    //get请求
    get (url,param) {
        return new Promise((resolve,reject) => {
            Axios({
                method: 'get',
                url,
                params: param,
                cancelToken: new CancelToken(c => {
                    cancel = c
                })
            }).then(res => {
                resolve(res)
            })
        })
    },    
    //post请求
    post (url,param) {
        return new Promise((resolve,reject) => {
            Axios({
                method: 'post',
                url,
                data: param,
                cancelToken: new CancelToken(c => {
                    cancel = c
                })
            })
            .then(res => {
                resolve(res)
            })
        })
    }
}

 