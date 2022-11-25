<template>
  <div>
    <el-button @click="showEdit('add',null)" type="success">新增专题</el-button>
    <el-row gutter="10" class="el-row">
      <el-col :span="14">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>专题</span>
            </div>
          </template>
          <Table :columns="columns"
                 :fetch="lodingData"
                 :dataSource="tableData"
                 :options="tableOptions"
                 @rowClick="rowClick"
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
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>专题博客</span>
              <Table :columns="rightcColumns"
                     :dataSource="blogData"
                     :options="tableOptions"
                     :fetch="loadingRightData"
              >
                <template #op="{index,row}">
                  <a class="a-link" @click="delForProject(row)">移除</a>
                </template>

              </Table>
            </div>
          </template>
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
        </el-card>
      </el-col>
    </el-row>
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

//从专题中移除
const delForProject = (data) => {
  Confirm("确定删除" + data.bolgTitle + "?", () => {
    let parames = {
      blogid: data.id,
      projectId: rowid.value
    }
    blogApi.removeBlogFromProject(parames).then((result) => {
      proxy.$message.success(result.msg)
      loadingRightData();
    })
  });
}
//专题博客
const rowid = ref()
const blogData = ref({})
const rowClick = (row) => {
  rowid.value = row.id
  loadingRightData()
}
const loadingRightData = () => {
  let parames = {
    id: rowid.value,
    pageNum: blogData.value.pageNum,
    pageSize: blogData.value.pageSize,
  }
  blogApi.indexProjectPage(parames).then((res) => {
    blogData.value = JSON.parse(JSON.stringify(res.data))
  })
}
const rightcColumns = [{
  label: "标题",
  prop: "bolgTitle",
  width: 150
}, {
  label: "简介",
  prop: "bolgAbstract",
}, {
  label: "操作",
  prop: "op",
  width: 100,
  scopedSlots: "op"
}
]


//删除
const del = (data) => {
  Confirm("确定删除" + data.name + "?", () => {
    blogApi.deleteProject({id: data.id}).then((result) => {
      proxy.$message.success(result.msg)
      lodingData();
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
    blogApi.saveProject(formData.value).then((result) => {
      if (result.code == 200) {
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
      dialogConfig.title = "新增专题";
      formData.value = {}
    } else if (type == 'edit') {
      dialogConfig.title = "修改专题";
      formData.value = JSON.parse(JSON.stringify(data))
    }
  })
}

// 列表
const lodingData = () => {
  let params = {pageNum: tableData.pageNum, pageSize: tableData.pageSize}
  blogApi.getProject(params).then((result) => {
    Object.assign(tableData, result.data)
  })
}
const tableData = reactive({});
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
  label: "文章数量",
  prop: "count",
  width: 80
}, {
  label: "操作",
  prop: "op",
  width: 100,
  scopedSlots: "op"

}
]
const tableOptions = {
  extHeight: 228
}
</script>

<style scoped>
.el-row {
  margin-top: 10px;
}
</style>