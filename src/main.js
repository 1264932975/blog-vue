import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.js";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Table from './components/Table.vue'
import Cover from './components/Cover.vue'
import Dialog from './components/Dialog.vue'
import ImgUpload from './components/ImgUpload.vue'
import EditMarkDown from './components/EditMarkDown.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import Confirm from './util/Confirm.js'
const app = createApp(App);
app.use(ElementPlus, {
    locale: zhCn,
});
app.use(router);
app.component("Table", Table)
app.component("Cover", Cover)
app.component("Dialog", Dialog)
app.component("EditMarkDown", EditMarkDown)
app.component("ImgUpload", ImgUpload)
app.config.globalProperties.globalUrl = {
    imgUrl: "/api/img/"
}
app.config.globalProperties.Confirm=Confirm;

app.mount('#app');
