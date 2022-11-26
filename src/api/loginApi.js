import {post, get} from '../util/Request.js'

//默认导出的是一个对象
export default {
    login: query => post(`/api/user/login`, query),
    logout: query => get(`/api/user/logout`, query),
    sendEmailCode: query => get(`/api/user/sendEmailCode`, query),
    emailLogin: query => post(`/api/user/emailLogin`, query),
}