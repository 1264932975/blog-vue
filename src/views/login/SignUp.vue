<template>
  <div class="login-panel">
    <div class="login-tatil">验证码登录</div>
    <el-form :model="formData" :rules="rules" ref="formDataRef">
      <el-form-item prop="username">
        <el-input :prefix-icon="User" validate-event v-model="formData.username" clearable placeholder="邮箱"/>
      </el-form-item>
      <el-form-item prop="checkCode">
        <div class="login-code">
          <el-input :prefix-icon="Message" maxlength="4" v-model="formData.checkCode" clearable placeholder="验证码"/>
          <el-button type="info" plain style="margin-left: 5px" @click="sendEmailCode" :disabled="isDisabled">
            {{ message }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <a @click="toLogin">密码登录</a>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="login" type="primary" :label="true" style="width: 100%">登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {User, Message} from '@element-plus/icons-vue'
import {reactive, ref} from "vue";
import loginApi from "../../api/loginApi.js";
import VueCookies from "vue-cookies";
import router from "../../router/index.js";


//发验证码
const isDisabled = ref(false);
const time = ref();
const message = ref('获取验证码')

const timeClick = () => {
  if (VueCookies.isKey("time")) {
    time.value = VueCookies.get("time")
  } else {
    time.value = 60;
  }
  if (time.value != 60) {
    isDisabled.value = true;
    let interval = setInterval(() => {
      if (time.value > 0) {
        time.value--
        message.value = time.value + 's'
        VueCookies.set("time", time.value, 0)
      } else {
        time.value = 60
        VueCookies.set("time", time.value, 0)
        message.value = '重新发送'
        isDisabled.value = false
        clearInterval(interval)
      }
    }, 1000)
  }
}
timeClick()

const sendEmailCode = () => {
  formDataRef.value.validateField("username", (valid) => {
    if (!valid) {
      return;
    }
    loginApi.sendEmailCode(formData).then((res) => {
      if (res) {
        isDisabled.value = true;
        let interval = setInterval(() => {
          if (time.value > 0) {
            time.value--
            message.value = time.value + 's'
            VueCookies.set("time", time.value, 0)
          } else {
            time.value = 60
            VueCookies.set("time", time.value, 0)
            message.value = '重新发送'
            isDisabled.value = false
            clearInterval(interval)
          }
        }, 1000)
      }
    })
  })
}


const emits = defineEmits(["changePage"])

function toLogin() {
  emits("changePage", "default")
}


//登录
const login = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    loginApi.emailLogin(formData).then((res) => {
      if (res) {
        VueCookies.set("user", res.data, "1D");
        VueCookies.set("token", res.data.token, "1D");
        VueCookies.set("time", time.value, 0)
        router.replace("/home")
      }
    })

  })
}
const formData = reactive({});
const formDataRef = ref();
const rules = {
  username: [
    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ], checkCode: {
    required: true,
    message: "请输入验证码"
  }
}
</script>

<style scoped>
@import "../../css/login.css";
</style>