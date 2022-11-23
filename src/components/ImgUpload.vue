<template>
  <el-upload name="file"
             :show-file-list="false"
             accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
             :multiple="false"
             :http-request="uploadImage">
    <div class="cover-upload-btn">
      <template v-if="modelValue">
        <img class="cover-upload-btn" :src="proxy.globalUrl.imgUrl+modelValue">
      </template>
      <span class="iconfont icon-add"
            v-else></span>
    </div>
  </el-upload>
</template>

<script setup>
import {getCurrentInstance} from "vue"
import uploadApi from "../api/uploadApi.js";

const {proxy} = getCurrentInstance();
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  }
})

const emit = defineEmits();
const uploadImage = (file) => {
  uploadApi.uploadImg({file: file.file}).then((result) => {
    if (result.code == 200) {
      emit("update:modelValue", result.data)
    }
  })
}
</script>

<style scoped>
.cover-upload-btn {
  width: 150px;
  height: 150px;
  background: url("../assets/upload.png") no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;

}
</style>