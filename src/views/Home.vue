<template>
  <div>
    <el-container>
      <el-header class="header">
        <div class="logo">logo</div>
        <div>
          <span>欢迎回来：</span>
          <el-dropdown trigger="click">
            <span class="header-name">
              {{ VueCookies.get("user").name }}
              <el-icon style="font-size: 15px"><ArrowDown/></el-icon>
              <img class="header-avatar" :src="proxy.globalUrl.imgUrl+VueCookies.get('user').cover">
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
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
                    <Memo/>
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
          <el-footer class="footer">Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import {getCurrentInstance, ref} from "vue";
import {Memo, ArrowDown} from '@element-plus/icons-vue'
import VueCookies from "vue-cookies";

const {proxy} = getCurrentInstance()

const menuList = ref([{
  title: "博客",
  chield: [{
    title: "博客管理",
    path: "/home/blogList"
  }, {
    title: "分类管理",
    path: "/home/classify"
  }
  ]
}, {
  title: "专题",
  chield: [{
    title: "专题管理",
    path: "/home/project"
  }]
}
])

</script>

<style scoped>
@import "../css/home.css";
</style>