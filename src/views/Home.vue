<template>
  <div>
    <el-container>
      <el-header class="header">
        <div class="logo">{{ footData.webName }}</div>
        <div>
          <span>欢迎回来：</span>
          <el-dropdown trigger="hover">
            <span class="header-name">
              {{ VueCookies.get("user").name }}
              <el-icon style="font-size: 15px"><ArrowDown/></el-icon>
              <el-avatar :size="25" :src="proxy.globalUrl.imgUrl+VueCookies.get('user').cover"/>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="toUserInfo">个人信息</el-dropdown-item>
                <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </div>
      </el-header>
      <el-container class="container">
        <el-aside class="aside">
          <div>
            <el-button type="success" class="post-button">发布</el-button>
            <el-menu router>
              <el-sub-menu v-for="menu in menuList" :index="menu.title">
                <template #title>
                  <el-icon>
                    <Memo v-if="menu.title=='博客'"/>
                    <Setting v-if="menu.title=='设置'"/>
                    <Odometer v-if="menu.title=='系统设置'"/>
                    <Delete v-if="menu.title=='回收站'"/>
                  </el-icon>
                  <span>{{ menu.title }}</span>
                </template>
                <el-menu-item v-for="item in menu.chield" :index="item.path">
                  {{ item.title }}
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </div>
        </el-aside>
        <el-container>
          <el-main class="main">
            <router-view/>
          </el-main>
          <el-footer class="footer">
            <template v-if="footData.recordState" class="footer">
              <el-col>
                <a href="https://beian.miit.gov.cn/" target="_blank">{{ footData.icpNo }}</a>
              </el-col>
              <el-col>
                <a target="_blank"
                   href="http://www.beian.gov.cn/portal/registerSystemInfo"
                   style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img
                    src="https://www.beian.gov.cn/img/new/gongan.png" style="float:left;"/>
                  <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">
                    {{ footData.policeNo }}</p></a>
              </el-col>
            </template>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import {getCurrentInstance, reactive, ref} from "vue";
import {Memo, ArrowDown, Setting, Delete, Odometer} from '@element-plus/icons-vue'
import VueCookies from "vue-cookies";
import router from "../router/index.js";
import loginApi from "../api/loginApi.js";
import webSettingApi from "../api/webSettingApi.js";

const {proxy} = getCurrentInstance()

//底部信息
const footData = reactive({})
const loadingFoot = async () => {
  webSettingApi.show().then((res) => {
    Object.assign(footData, res.data)
    document.title = footData.webName
  })
}
loadingFoot();


const toUserInfo = () => {
  router.push("/home/userInfo")
}
const loginOut = () => {
  loginApi.logout(null).then((res) => {
    let keys = VueCookies.keys();
    for (let item in keys) {
      VueCookies.remove(keys[item])
    }
    router.replace('/login')
  })
}


const menuList = ref([{
  title: "博客",
  chield: [{
    title: "博客管理",
    path: "/home/blogList"
  }, {
    title: "分类管理",
    path: "/home/classify"
  }, {
    title: "专题管理",
    path: "/home/project"
  }
  ]
}, {
  title: "设置",
  chield: [{
    title: "个人信息",
    path: "/home/userInfo"
  }, {
    title: "成员管理",
    path: "/home/userController"
  }
  ]
}, {
  title: "系统设置",
  chield: [{
    title: "系统设置",
    path: "/home/systemInfo"
  }
  ]
}, {
  title: "回收站",
  chield: [{
    title: "回收站",
    path: "/home/recycle"
  }
  ]
}
])

</script>

<style scoped>
@import "../css/home.css";
</style>