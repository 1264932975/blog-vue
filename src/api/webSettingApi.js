import {get, post} from '../util/Request.js'

export default {
    show: query => get(`/api/webSetting/show`, query),
    init: query => post(`/api/webSetting/init`, query),
}