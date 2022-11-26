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
          <el-button type="warning" plain @click="toUpdate">修改密码和邮箱点我！设置邮箱后可使用验证码登录</el-button>
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


  <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons"
          @close="dialogConfig.show=false">
    <el-form>
      <el-form :model="dialogData" :rules="rules" ref="formDataRef">
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="dialogData.email" clearable/>
        </el-form-item>
        <el-form-item prop="checkCode" label="验证码">
          <el-input :prefix-icon="Message" maxlength="4" v-model="dialogData.checkCode" clearable placeholder="验证码"
                    class="code"/>
          <el-button type="info" plain style="margin-left: 5px" @click="sendEmailCode" :disabled="isDisabled">
            {{ message }}
          </el-button>
        </el-form-item>
        <el-form-item label="修改密码">
          <el-input v-model="dialogData.password" type="password" show-password placeholder="为空则不修改"/>
        </el-form-item>
      </el-form>
    </el-form>
  </Dialog>


</template>

<script setup>
import {getCurrentInstance, reactive, ref} from "vue";
import userApi from "../../api/userApi.js";
import loginApi from "../../api/loginApi.js";
import VueCookies from "vue-cookies";

const {proxy} = getCurrentInstance();


//修改密码和邮箱
const submitFrom = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    userApi.updatePwd(dialogData.value).then((res) => {
      if (res) {
        proxy.$message.success(res.msg)
        dialogData.value = {}
        dialogConfig.show = false
        loadingData();
      }
    })

  })
}


//发验证码
const isDisabled = ref(false);
const time = ref();
const message = ref('获取验证码')
const sendEmailCode = () => {
  formDataRef.value.validateField("email", (valid) => {
    if (!valid) {
      return;
    }
    loginApi.sendEmailCode({email: dialogData.value.email}).then((res) => {
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


//弹窗
const dialogData = ref({})
const toUpdate = () => {
  dialogConfig.show = true
}
const dialogConfig = reactive({
  title: "密码和邮箱",
  show: false,
  buttons: [{
    type: "danger",
    text: "确定",
    click: (e) => {
      submitFrom();
    }
  }]
})


const rules = {
  name: {
    required: true,
    message: "昵称不能为空"
  },
  email: [
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

//保存
const formDataRef = ref();
const save = () => {
  formDataRef.value.validateField("name", (valid) => {
    if (!valid) {
      return;
    }
    userApi.saveIntroduction(formData.value).then((res) => {
      if (res) {
        proxy.$message.success(res.msg + "，重新登录后生效")
      }
    })
  })

}

//加载
const formData = ref({})
const loadingData = () => {
  userApi.showUserList().then((res) => {
    if (res) {
      formData.value = res.data
      dialogData.value.email = res.data.email
    }
  })
}
loadingData();
</script>

<style scoped>
.code {
  display: flex;
  flex: 1;
}
</style>