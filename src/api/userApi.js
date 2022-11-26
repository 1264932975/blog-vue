import {get, post} from '../util/Request.js'

export default {
    showUserList: query => get(`/api/article/open/showUserList`, query),
    saveIntroduction: query => post(`/api/user/saveIntroduction`, query),
    updatePwd: query => post(`/api/user/updatePwd`, query),
}