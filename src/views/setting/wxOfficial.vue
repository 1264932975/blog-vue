<template>
  <div>
    <p style="color: red">
      温馨提示：1.文章仅在新增或修改时同步到微信公众号,发布和回收站还原并不会发生同步操作  2.不会同步编辑器内图片 3.仅编辑器内发生编辑操作才会同步
    </p>
    <el-form
        :style="{width:'50%'}"
        :label-width="'200px'"
        :model="formData"
        :rules="rules">
      <el-form-item label="开发者ID(AppID)" prop="appid">
        <el-input v-model="formData.appid"/>
      </el-form-item>
      <el-form-item label="开发者密码(AppSecret)" prop="appsecret">
        <el-input v-if="formData.hasId" v-model="formData.appsecret"/>
        <el-button type="danger" @click="change" v-else>重置</el-button>
      </el-form-item>
      <el-form-item v-if="formData.hasId">
        <el-button @click="submit">提交</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup>
import {getCurrentInstance, reactive} from "vue";
import webSettingApi from "../../api/webSettingApi.js";

const {proxy} = getCurrentInstance();
const formData = reactive({});

const rules = {
  appid: [{required: true, message: "appid不能为空"}],
  appsecret: [{required: true, message: "appSecret不能为空"}],
}
const loadingData = () => {
  webSettingApi.showWx().then((res) => {
    Object.assign(formData, res.data)
    if (formData.appid) {
      formData.hasId = false
    } else {
      formData.hasId = true
    }
  })
}
const change = () => {
  formData.hasId = true
}
const submit = () => {
  webSettingApi.initWx(formData).then((res) => {
    if (res) {
      proxy.$message.success(res.msg)
      formData.hasId = false
    }
  })
}
loadingData();
</script>

<style scoped>

</style>