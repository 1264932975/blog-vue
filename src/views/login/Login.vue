<template>
  <div class="login-panel">
    <div class="login-tatil">登录</div>
    <el-form :model="formData" :rules="rules" ref="formDataRef">
      <el-form-item prop="username">
        <el-input :prefix-icon="User" v-model="formData.username" clearable placeholder="账号"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" :prefix-icon="Lock" v-model="formData.password" show-password clearable
                  placeholder="密码"/>
      </el-form-item>
      <el-form-item>
        <a @click="toSign" style="text-align: right">邮箱登录/注册</a>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="login" type="primary" style="width: 100%">登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {User, Lock} from '@element-plus/icons-vue'
import {reactive, ref} from "vue";
import loginApi from "../../api/loginApi.js";
import router from "../../router/index.js";
import VueCookies from "vue-cookies";

const emits = defineEmits(["changePage"])
const toSign = () => {
  emits("changePage", "SignUp")
}

const login = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    loginApi.login(formData).then((result) => {
      if (result){
        VueCookies.set("user", result.data, "1D");
        VueCookies.set("token", result.data.token, "1D");
        router.replace("/home")
      }
    })
  })
}
const formDataRef = ref()
const formData = reactive({});
const rules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
  ], password: {
    required: true,
    message: "请输入密码"
  }
}
</script>

<style scoped>
@import "../../css/login.css";
</style>