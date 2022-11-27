import {form, get, post} from '../util/Request.js'

//默认导出的是一个对象
export default {
    getClassify: query => get(`/api/article/open/getClassify`, query),
    getProject: query => get(`/api/article/open/getProject`, query),
    saveClassify: query => post(`/api/article/saveClassify`, query),
    saveProject: query => post(`/api/article/saveProject`, query),
    deleteClassify: query => get(`/api/article/deleteClassify`, query),
    deleteProject: query => get(`/api/article/deleteProject`, query),
    indexPage: query => post(`/api/article/open/indexPage`, query),
    saveBlog: query => post(`/api/article/edit`, query),
    showBlog: query => get(`/api/article/open/show`, query),
    deleteBlog: query => get(`/api/article/delete`, query),
    goBack: query => get(`/api/article/goBack`, query),
    destroy: query => get(`/api/article/destroy`, query),
    addToProject: query => post(`/api/article/addToProject`, query),
    indexProjectPage: query => post(`/api/article/open/indexProjectPage`, query),
    removeBlogFromProject: query => form(`/api/article/removeBlogFromProject`, query),
    changeBlogState: query => get(`/api/article/changeBlogState`, query),
}