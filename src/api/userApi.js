import {get} from '../util/Request.js'

export default {
    showUserList: query => get(`/api/article/open/showUserList`, query),
}