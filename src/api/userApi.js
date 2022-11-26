import {get, post, form} from '../util/Request.js'

export default {
    showDetil: query => get(`/api/user/showDetil`, query),
    changeState: query => form(`/api/user/changeState`, query),
    changeRole: query => form(`/api/user/changeRole`, query),
    appUser: query => get(`/api/user/appUser`, query),
    showUserList: query => get(`/api/user/showUserList`, query),
    saveIntroduction: query => post(`/api/user/saveIntroduction`, query),
    updatePwd: query => post(`/api/user/updatePwd`, query),
    getRole: query => get(`/api/user/getRole`, query),
}