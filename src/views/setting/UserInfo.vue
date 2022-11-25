<template>

  <el-form :model="formData" :rules="rules" ref="formDataRef">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item prop="cover" label="头像">
          <ImgUpload v-model="formData.cover"/>
        </el-form-item>
        <el-form-item prop="name" label="昵称:">
          <el-input v-model="formData.name" placeholder="请输入昵称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="save">保存</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" plain>修改密码和邮箱点我！设置邮箱后可使用验证码登录</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="introduction">
          <h3>个人介绍</h3>
          <EditMarkDown v-model="formData.introduction" :save="save"></EditMarkDown>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";
import userApi from "../../api/userApi.js";

const {proxy} = getCurrentInstance();


const rules = {}


const save = () => {
  userApi.saveIntroduction(formData.value).then((res) => {
    proxy.$message.success(res.msg)
    loadingData();
  })
}

//加载
const formData = ref({})
const loadingData = () => {
  userApi.showUserList().then((res) => {
    formData.value = res.data
  })
}
loadingData();
</script>

<style scoped>

</style>