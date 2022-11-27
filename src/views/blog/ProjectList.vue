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
              <el-button type="primary" circle plain :icon="Edit" @click="showEdit('edit',row)"/>
              <el-divider direction="vertical"/>
              <el-button type="danger" plain :icon="Delete" circle @click="del(row)"/>
              <el-divider/>
              <el-button type="success" plain size="small" @click="blogAdd(row)" round>添加博客到专题</el-button>
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
        </el-card>
      </el-col>
    </el-row>
  </div>
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
  <Dialog :show="addBlogDialog.show" :title="addBlogDialog.title" :buttons="addBlogDialog.buttons"
          @close="addBlogDialog.show=false">
    <el-form>
      <el-form :model="blogAddData"
               :rules="{projectId:{required: true,message: '专题编号不能为空'},articleId:{required: true,message: '博客编号不能为空'}}"
               ref="formDataRef">
        <el-form-item prop="projectId" label="专题编号">
          <el-input v-model="blogAddData.projectId" disabled/>
        </el-form-item>
        <el-form-item prop="articleId" label="博客编号">
          <el-input v-model="blogAddData.articleId" placeholder="在博客列表双击所选博客即可复制编号"/>
        </el-form-item>
      </el-form>
    </el-form>
  </Dialog>
</template>

<script setup>
import Table from "../../components/Table.vue";
import {getCurrentInstance, nextTick, reactive, ref} from "vue";
import Dialog from "../../components/Dialog.vue";
import ImgUpload from "../../components/ImgUpload.vue";
import blogApi from "../../api/blogApi.js";
import Confirm from "../../util/Confirm.js";
import {Delete, Edit} from "@element-plus/icons-vue"

const {proxy} = getCurrentInstance();

//添加文章
const blogAddData = ref({});
const blogAdd = (row) => {
  blogAddData.value = {}
  blogAddData.value.projectId = row.id
  addBlogDialog.show = true
}
const addBlogDialog = reactive({
  title: "添加文章到专题",
  show: false,
  buttons: [{
    type: "danger",
    text: "确定",
    click: async (e) => {
      blogApi.addToProject(blogAddData.value).then((res) => {
        if (res) {
          proxy.$message.success(res.msg)
          addBlogDialog.show = false
          rowClick({id:blogAddData.value.projectId});
        }
      })
    }
  }]
})


//从专题中移除
const delForProject = (data) => {
  Confirm("确定删除" + data.bolgTitle + "?", () => {
    let parames = {
      blogid: data.id,
      projectId: rowid.value
    }
    blogApi.removeBlogFromProject(parames).then((result) => {
      if (result) {
        proxy.$message.success(result.msg)
        loadingRightData();
      }
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
    if (res) {
      blogData.value = JSON.parse(JSON.stringify(res.data))
    }
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
      if (result) {
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
    blogApi.saveProject(formData.value).then((result) => {
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
    if (result) {
      Object.assign(tableData, result.data)
    }
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
  width: 150,
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