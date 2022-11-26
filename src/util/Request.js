import axios from 'axios'
import {ElLoading, ElMessage} from "element-plus";
import router from "../router/index.js";
import VueCookies from "vue-cookies";

const options = {
    lock: true,
    text: '正在加载...',
    background: 'rgba(0,0,0,0.6)'
}
let loading = null;
//响应拦截器
axios.interceptors.response.use(
    function (response) {
        //....
        if (loading) {
            loading.close();
        }
        return response
    },
    function (error) {
        if (loading) {
            loading.close();
        }
        ElMessage({
            message: error,
            type: 'error',
        })
        return Promise.reject(error)
    }
)

//请求拦截器
axios.interceptors.request.use(
    function (config) {
        loading = ElLoading.service(options)
        //...
        return config
    },
    function (error) {
        if (loading) {
            loading.close();
        }
        return Promise.reject(error)
    }
)


/*
 * 封装请求方法
 */
const request = function (query) {
    return axios
        .request(query)
        .then((res) => {
            if (res.data.code === 50000) {
                ElMessage({
                    message: res.data.msg,
                })
                router.replace({path: '/login'})
            } else if (res.data.code === 6000) {
                ElMessage({
                    message: res.data.msg,
                    type: "warning"
                })
            } else if (res.data.code === 5000) {
                ElMessage({
                    message: res.data.msg,
                    type: "error"
                })
            } else if (res.data.code == 200) {
                return Promise.resolve(res.data)
            }
        })
        //对错误进行处理
        .catch((e) => {
            return Promise.reject(e.message)
        })
}

//post请求  ----> json格式的post请求
export const post = function (url, params) {
    const query = {
        url: url,
        method: 'post',
        withCredentials: true, //跨域允许携带cookie
        timeout: 30000,
        data: params,
        headers: {'Content-Type': 'application/json', 'request-ajax': true, 'token': VueCookies.get("token")},
    }
    return request(query)
}

//Get请求
export const get = function (url, params) {
    const query = {
        url: url,
        method: 'get',
        withCredentials: true,
        timeout: 30000,
        params: params,
        headers: {'request-ajax': true, 'token': VueCookies.get("token")},
    }
    return request(query)
}

//post请求
export const form = function (url, params) {
    const query = {
        url: url,
        method: 'post',
        withCredentials: true,
        timeout: 30000,
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data',
            'request-ajax': true,
            'token': VueCookies.get("token")
        },
    }
    return request(query)
}
