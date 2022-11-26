import {get, post} from '../util/Request.js'

export default {
    showDetil: query => get(`/api/user/showDetil`, query),
    appUser: query => get(`/api/user/appUser`, query),
    showUserList: query => get(`/api/user/showUserList`, query),
    saveIntroduction: query => post(`/api/user/saveIntroduction`, query),
    updatePwd: query => post(`/api/user/updatePwd`, query),
}