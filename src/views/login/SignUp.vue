<template>
  <div class="login-panel">
    <div class="login-tatil">验证码登录</div>
    <el-form :model="formData" :rules="rules" ref="formDataRef">
      <el-form-item prop="username">
        <el-input :prefix-icon="User" validate-event v-model="formData.username" clearable placeholder="账号"/>
      </el-form-item>
      <el-form-item prop="checkCode">
        <div class="login-code">
          <el-input  :prefix-icon="Message" maxlength="4" v-model="formData.checkCode" clearable placeholder="验证码"/>
          <el-button type="info" plain style="margin-left: 5px">获取验证</el-button>
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

const emits = defineEmits(["changePage"])

function toLogin() {
  emits("changePage", "default")
}

const login = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
  })
}
const formData = reactive({});
const formDataRef = ref();
const rules = {
  username: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
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