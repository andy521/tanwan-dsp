import axios from "axios";
import qs from "qs";
import router from '../router/index';
import util from '@/utils/index';
import { Message } from 'iview';

let cancel, promiseArr = {};
const CancelToken = axios.CancelToken;
const Axios = axios.create({
	baseURL: "http://ads.tanwan.com",
	timeout: 10000,
	responseType: "json",
	//withCredentials: true, // 是否允许带cookie这些
	headers: {
		"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
	}
});
//axios不支持jsonp，所以你需要把服务端改为 header("Access-Control-Allow-Origin: *"); 

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
	config => {
		// 在发送请求之前做某件事
		if(config.method === "post" || config.method === "put" || config.method === "delete") {
			// 序列化
			config.data = qs.stringify(config.data);
		}
		// 若是有做鉴权token , 就给头部带上token
		if(localStorage.token) {
			config.headers.Authorization = localStorage.token;
		}
		return config;
	},
	error => {
		//Message.info(res.data.msg);
		console.log('拦截器' + error);
		return Promise.reject(error);
	}
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
	res => {
		//对响应数据做些事  
		if(res.data && res.data.ret != 1) {
			//如果为-2返回到登录页面
			if(res.data.ret == '-2') {
                util.removeItem('user')
                router.replace({
                    path: '/login',
                    query: {redirect: router.currentRoute.fullPath}
                });
			}
			Message.info(res.data.msg);
			return Promise.reject(res.data.msg);
        }
		return res.data;
	},
	error => {
		// 返回 response 里的错误信息
		Message.info(res.data.msg);
		console.log('拦截器' + error);
		return Promise.reject(error);
	}
);

export default {
	get(url, opt) {
		return new Promise((resolve, reject) => {
			let param = Object.assign({'sessionid': util.getItem('sessionid')}, opt);
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
	post(url, opt) {
		return new Promise((resolve, reject) => {
			let param = Object.assign({'sessionid': util.getItem('sessionid')}, opt);
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
};