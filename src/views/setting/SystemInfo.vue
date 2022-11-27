<template>
  <div>
    <el-form ref="editFormRef"
             :style="{width:'50%'}"
             :model="formData"
             :rules="rules"
             :label-width="'200px'">
      <el-form-item label="是否开启评论/留言板"
                    prop="criticState">
        <div>
          <el-switch
              v-model="formData.criticState"
              inline-prompt
              active-text="是"
              inactive-text="否"
          />
        </div>
      </el-form-item>

      <el-form-item label="开启公安备案和ICP备案信息"
                    prop="recordState">
        <el-switch
            v-model="formData.recordState"
            inline-prompt
            active-text="是"
            inactive-text="否"
        />
      </el-form-item>
      <template v-if="formData.recordState==true">
        <el-form-item label="ICP备案号"
                      prop="icpNo">
          <el-input :maxLength="100"
                    v-model="formData.icpNo"/>
        </el-form-item>
        <el-form-item label="公安备案号"
                      prop="policeNo">
          <el-input :maxLength="100"
                    v-model="formData.policeNo"/>
        </el-form-item>
      </template>
      <el-form-item label="网站名称"
                    prop="webName">
        <el-input :maxLength="100"
                  v-model="formData.webName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="danger"
                   @click="submitForm">保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import {getCurrentInstance, reactive, ref} from "vue"
import webSettingApi from "../../api/webSettingApi.js";

const {proxy} = getCurrentInstance();

const formData = reactive({});

const rules = {
  criticState: [{required: true, message: "是否开启评论不能为空"}],
  recordState: [{required: true, message: "是否开启公安备案和ICP备案信息不能为空"}],
  icpNo: [{required: true, message: "ICP备案号不能为空"}],
  policeNo: [{required: true, message: "公安备案号不能为空"}],
  webName: [{required: true, message: "网站名称不能为空"}],
}

const loadingData = async () => {
  webSettingApi.show().then((res) => {
    if (res) {
      Object.assign(formData, res.data)
    }
  })
};
loadingData();

const editFormRef = ref();
const submitForm = () => {
  editFormRef.value.validate(async (valid) => {
    if (!valid) {
      return false;
    }
    webSettingApi.init(formData).then((res) => {
      if (res) {
        proxy.$message.success(res.msg)
      }
    })
  });
};

</script>