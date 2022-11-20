import {post} from '../util/Request.js'

//默认导出的是一个对象
export default {
    login: query => post(`/api/user/login`, query),
}