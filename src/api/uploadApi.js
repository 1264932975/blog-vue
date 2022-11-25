import {form    } from '../util/Request.js'

//默认导出的是一个对象
export default {
    uploadImg: query => form(`/api/file/uploadImg`, query),
    uploadInMarkDown: query => form(`/api/file/uploadInMarkDown`, query),
}