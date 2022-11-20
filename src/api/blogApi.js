import {get, post} from '../util/Request.js'

//默认导出的是一个对象
export default {
    getClassify: query => get(`/api/article/open/getClassify`, query),
    saveClassify: query => post(`/api/article/saveClassify`, query),
    deleteClassify: query => get(`/api/article/deleteClassify`, query),
    indexPage: query => post(`/api/article/open/indexPage`, query),
}