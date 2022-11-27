// 1. 定义路由组件.
// 也可以从其他文件导入
import {createRouter, createWebHistory} from "vue-router";
import LoginMain from "../views/login/LoginMain.vue";
import Login from "../views/login/Login.vue";
import NoteFund from "../views/NoteFund.vue";
import SignUp from "../views/login/SignUp.vue"
import Home from "../views/Home.vue"
import VueCookies from "vue-cookies";
import BlogList from "../views/blog/BlogList.vue"
import Classify from "../views/blog/Classify.vue"
import ProjectList from "../views/blog/ProjectList.vue";
import UserInfo from "../views/setting/UserInfo.vue";
import UserController from "../views/setting/UserController.vue";
import SystemInfo from "../views/setting/SystemInfo.vue";
// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    {path: '/:path(.*)', component: NoteFund},
    {
        path: '/', component: LoginMain,
        children: [{
            path: 'login',
            components: {
                default: Login,
                SignUp: SignUp
            }
        }]
    },
    {
        path: '/home', component: Home,
        children: [
            {
                path: 'blogList',
                component: BlogList
            }, {
                path: 'classify',
                component: Classify
            },
            {
                path: 'project',
                component: ProjectList
            },
            {
                path: 'userInfo',
                component: UserInfo
            }, {
                path: 'userController',
                component: UserController
            },
            {
                path: 'systemInfo',
                component: SystemInfo
            }
        ]
    }
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})

//权限拦截
router.beforeEach((to, from, next) => {
    if (!VueCookies.isKey("token") && to.path != "/login") {
        router.push("/login")
    }
    next();
})
export default router