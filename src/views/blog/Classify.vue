<template>
<!--  <title>设置</title>-->
  <div>
    <el-button @click="showEdit('add',null)" type="success">新增分类</el-button>
    <Table :columns="columns"
           :showPagination="false"
           :fetch="lodingData"
           :dataSource="tableData"
           :options="tableOptions"
    >
      <template #cover="{index,row}">
        <Cover :cover=" row.cover"></Cover>
      </template>
      <template #op="{index,row}">
        <a class="a-link" @click="showEdit('edit',row)">修改</a>
        <el-divider direction="vertical"/>
        <a class="a-link" @click="del(row)">删除</a>
      </template>

    </Table>
    <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons"
            @close="dialogConfig.show=false">
      <el-form>
        <el-form :model="formData" :rules="rules" ref="formDataRef">
          <el-form-item prop="name" label="名称">
            <el-input v-model="formData.name" clearable/>
          </el-form-item>
          <el-form-item prop="cover" label="封面">
            <ImgUpload v-model="formData.cover"></ImgUpload>
          </el-form-item>
          <el-form-item prop="about" label="简介">
            <el-input type="textarea" v-model="formData.about" :row="3"/>
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
import ImgUpload from "../../components/ImgUpload.vue";
import blogApi from "../../api/blogApi.js";
import Confirm from "../../util/Confirm.js";

const {proxy} = getCurrentInstance();


//删除
const del = (data) => {
  Confirm("确定删除" + data.name + "?", () => {
    blogApi.deleteClassify({id: data.id}).then((result) => {
      if (result){
        proxy.$message.success(result.msg)
        lodingData();
      }
    })
  });
}
//弹窗
const dialogConfig = reactive({
  title: "",
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
    blogApi.saveClassify(formData.value).then((result) => {
      if (result) {
        dialogConfig.show = false;
        proxy.$message.success(result.msg)
        lodingData();
      }
    })
  })
}
const formData = ref({});
const formDataRef = ref();
const rules = {
  name: [
    {required: true, message: '请输入分类名称'},
  ], about: {
    required: true,
    message: "请输入简介"
  }, cover: {
    required: true,
    message: "请上传图片"
  }
}
const showEdit = (type, data) => {
  dialogConfig.show = true;
  nextTick(() => {
    if (type == 'add') {
      dialogConfig.title = "新增分类";
      formDataRef.value.resetFields();
      formData.value = {}
    } else if (type == 'edit') {
      dialogConfig.title = "修改分类";
      formData.value = JSON.parse(JSON.stringify(data))
    }
  })
}

// 列表
const lodingData = () => {
  blogApi.getClassify(null).then((result) => {
    if (result){
      tableData.list = result.data;
    }
  })
}
const tableData = reactive({});
const tableOptions = {
  extHeight: 70
}
const columns = [{
  label: "封面",
  prop: "cover",
  width: 200,
  scopedSlots: "cover"
}, {
  label: "名称",
  prop: "name",
  width: 150
}, {
  label: "简介",
  prop: "about",
}, {
  label: "博客数量",
  prop: "count",
  width: 80
}, {
  label: "操作",
  prop: "op",
  width: 100,
  scopedSlots: "op"

}
]
</script>

<style scoped>

</style>