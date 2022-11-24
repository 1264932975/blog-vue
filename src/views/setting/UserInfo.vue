<template>

  <el-form :model="formData" :rules="rules" ref="formDataRef">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item prop="cover" label="头像">
          <ImgUpload v-model="formData.cover"/>
        </el-form-item>
        <el-form-item prop="bolgAbstract" label="昵称:">
          <el-input v-model="formData.bolgAbstract" placeholder="请输入昵称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain>保存</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" plain>修改密码和邮箱点我！设置邮箱后可使用验证码登录</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="bolgText">
          <h3>个人介绍</h3>
          <EditMarkDown v-model="formData.bolgText" :save="save"></EditMarkDown>
        </el-form-item>
      </el-col>
    </el-row>


  </el-form>
</template>

<script setup>
import {ref} from "vue";
import {Message, Lock} from '@element-plus/icons-vue'

const formData = ref({})
const rules = {}

</script>

<style scoped>

</style>