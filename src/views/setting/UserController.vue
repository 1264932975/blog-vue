<template>
  <div>
    <el-button @click="showEdit" type="success">新增用户</el-button>
    <Table :columns="columns"
           :showPagination="false"
           :fetch="lodingData"
           :dataSource="tableData"
           :options="tableOptions"
    >
      <template #cover="{index,row}">
        <Cover :cover=" row.cover"></Cover>
      </template>
      <template #state="{index,row}">
        <el-switch v-model="row.state" inline-prompt active-text="正常" inactive-text="禁用" :loading="loading"
                   @click="change(row)"/>
        <!--        <span v-if="row.state==true" style="color: green">正常</span>-->
        <!--        <span v-else-if="row.state==false" style="color: red">禁用</span>-->
      </template>
      <template #roleId="{index,row}">
        <el-select v-model="row.roleId">
          <el-option v-for="item in roleList" :value="item.id" :label="item.name" @click="changeRole(row)"/>
        </el-select>
      </template>
      <template #op="{index,row}">
        <a class="a-link" @click="del(row)">删除</a>
      </template>

    </Table>
    <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons"
            @close="dialogConfig.show=false">
      <el-form>
        <el-form :model="formData" :rules="rules" ref="formDataRef">
          <el-form-item prop="email" label="新用户邮箱">
            <el-input v-model="formData.email" clearable/>
          </el-form-item>
        </el-form>
      </el-form>
    </Dialog>
  </div>

</template>

<script setup>
import Table from "../../components/Table.vue";
import {getCurrentInstance, nextTick, reactive, ref} from "vue";
import Dialog from "../../components/Dialog.vue";
import blogApi from "../../api/blogApi.js";
import Confirm from "../../util/Confirm.js";
import userApi from "../../api/userApi.js";

const {proxy} = getCurrentInstance();

//权限
const changeRole = (data) => {
  userApi.changeRole(data).then((res) => {
    if (res) {
      proxy.$message.success(res.msg)
    }
  })
}

const roleList = ref();
const loadingRoleList = () => {
  userApi.getRole().then((res) => {
    if (res) {
      roleList.value = res.data;
    }
  })
}
loadingRoleList();


//禁用
const loading = ref(false)
const change = (data) => {
  loading.value = true;
  userApi.changeState(data).then((res) => {
    if (res) {
      proxy.$message.success(res.msg)
      loading.value = false;
    }
  })
}

//删除
const del = (data) => {
  Confirm("确定删除" + data.name + "?", () => {
    // blogApi.deleteClassify({id: data.id}).then((result) => {
    //   if (result) {
    //     proxy.$message.success(result.msg)
    //     lodingData();
    //   }
    // })
  });
}
//弹窗
const dialogConfig = reactive({
  title: "新增用户",
  show: false,
  buttons: [{
    type: "danger",
    text: "确定",
    click: (e) => {
      submitFrom();
    }
  }]
})
const submitFrom = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    userApi.appUser(formData.value).then((res) => {
      if (res) {
        dialogConfig.show = false;
        proxy.$message.success(res.msg)
        lodingData();
      }
    })
  })
}
const formData = ref({});
const formDataRef = ref();
const rules = {
  email: [
    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ]
}
const showEdit = () => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {}
  })
}

// 列表
const lodingData = () => {
  userApi.showUserList().then((res) => {
    if (res) {
      tableData.list = res.data;
    }
  })
}
const tableData = reactive({});
const tableOptions = {
  extHeight: 70
}
const columns = [{
  label: "头像",
  prop: "cover",
  width: 200,
  scopedSlots: "cover"
}, {
  label: "用户名",
  prop: "username",
  width: 200
}, {
  label: "昵称",
  prop: "name",
  width: 150
}, {
  label: "权限",
  prop: "roleId",
  width: 200,
  scopedSlots: "roleId"
}, {
  label: "博客数量",
  prop: "count",
  width: 80
}, {
  label: "状态",
  prop: "state",
  width: 80,
  scopedSlots: "state"
}, {
  label: "操作",
  prop: "op",
  width: 80,
  scopedSlots: "op"
}
]
</script>

<style scoped>

</style>