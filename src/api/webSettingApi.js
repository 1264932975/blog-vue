import {get, post} from '../util/Request.js'

export default {
    show: query => get(`/api/webSetting/show`, query),
    showWx: query => get(`/api/webSetting/showWx`, query),
    init: query => post(`/api/webSetting/init`, query),
    initWx: query => post(`/api/webSetting/initWx`, query),
}