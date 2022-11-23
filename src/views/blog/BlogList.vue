<template>
  <div>
    <el-form :model="searchbarData" ref="formDataRef" label-width="50">
      <el-row>
        <el-form-item prop="bolgTitle" label="标题">
          <el-input v-model="searchbarData.bolgTitle" clearable :prefix-icon="Search"/>
        </el-form-item>
        <el-form-item prop="bolgAbstract" label="摘要">
          <el-input v-model="searchbarData.bolgAbstract" clearable :prefix-icon="Search"/>
        </el-form-item>
        <el-form-item prop="state" label="状态">
          <el-select v-model="searchbarData.state" clearable>
            <el-option value="0" label="草稿"/>
            <el-option value="1" label="已发布"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="bolgClassifyId" label="分类">
          <el-select v-model="searchbarData.bolgClassifyId" clearable>
            <el-option v-for="item in classifyList" :value="item.id" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-button @click="loadingFormData" type="primary" style="margin-left: 15px">搜索</el-button>
      </el-row>
      <el-row>
        <el-button type="primary" @click="showEdit('add',null)" plain>新增博客</el-button>
      </el-row>
    </el-form>
    <Table :columns="columns"
           :showPagination="true"
           :fetch="loadingFormData"
           :dataSource="tableData"
    >
      <template #cover="{index,row}">
        <Cover :cover=" row.cover"></Cover>
      </template>
      <template #state="{index,row}">
        <div>
          发布状态：
          <span v-if="row.state==0" style="color: orange">草稿</span>
          <span v-else-if="row.state==1" style="color: green">已发布</span>
          <span v-else-if="row.state==2" style="color: green">已删除</span>
        </div>
        <div>
          评论状态：
          <span v-if="row.bolgCriticState==true" style="color: green">已开启</span>
          <span v-else style="color: red">未开启</span>
        </div>
      </template>
      <template #op="{index,row}">
        <a class="a-link" @click="showEdit('edit',row)">修改</a>
        <el-divider direction="vertical"/>
        <a class="a-link" @click="del(row)">删除</a>
        <el-divider direction="vertical"/>
        <a class="a-link" @click="del(row)">预览</a>
      </template>
    </Table>
    <Dialog :show="windowConfig.show" :title="windowConfig.title" :buttons="windowConfig.buttons"
            @close="windowConfig.show=false" :fullscreen="true">
      <el-form :model="editData" :rules="rules" ref="editDataRef">
        <el-row>
          <el-form-item prop="bolgTitle" label="标题：">
            <el-input v-model="editData.bolgTitle" placeholder="请输入文章标题" class="title-input"/>
          </el-form-item>
          <el-form-item prop="bolgClassifyId" label="文章分类" class="edit-classify-id">
            <el-select v-model="editData.bolgClassifyId" clearable>
              <el-option v-for="item in classifyList" :value="item.id" :label="item.name"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="bolgCriticState" label="开启评论：" class="edit-critic-state">
            <el-switch v-model="editData.bolgCriticState" inline-prompt :active-icon="Check" :inactive-icon="Close"/>
          </el-form-item>
          <el-form-item>
            <div class="edit-tag">
              <el-tag
                  v-for="tag in editData.bolgTag"
                  :key="tag"
                  class="mx-1"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                  v-if="inputVisible"
                  ref="InputRef"
                  v-model="inputValue"
                  class="ml-1 w-20"
                  size="small"
                  @keyup.enter="handleInputConfirm"
                  @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
                +添加标签
              </el-button>
            </div>

          </el-form-item>
        </el-row>
        <el-form-item prop="bolgText">
          <EditMarkDown v-model="editData.bolgText" :save="editBlog"></EditMarkDown>
        </el-form-item>
        <el-form-item prop="bolgAbstract" label="摘要:">
          <el-input type="textarea" v-model="editData.bolgAbstract" show-word-limit placeholder="请输入文章摘要"
                    maxlength="300"/>
        </el-form-item>
        <el-form-item prop="cover" label="上传封面">
          <ImgUpload v-model="editData.cover"></ImgUpload>
        </el-form-item>

      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import {getCurrentInstance, nextTick, reactive, ref} from "vue";
import {Search, Check, Close} from '@element-plus/icons-vue'
import blogApi from "../../api/blogApi.js";
import EditMarkDown from "../../components/EditMarkDown.vue";
import Confirm from "../../util/Confirm.js";


//标签
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref()

const handleClose = (tag) => {
  editData.bolgTag.splice(editData.bolgTag.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
}

const handleInputConfirm = () => {
  if (inputValue.value && editData.bolgTag.indexOf(inputValue.value) == -1) {
    editData.bolgTag.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}


//新增修改
const {proxy} = getCurrentInstance();
const editBlog = () => {
  editDataRef.value.validate((v) => {
    if (!v) {
      return;
    }
    editData.bolgTag = editData.bolgTag.join(",")
    blogApi.saveBlog(editData).then((res) => {
      if (res.code == 200) {
        proxy.$message.success(res.msg)
        closeWindow()
      }
    })
  })
}
const rules = {
  bolgTitle: [
    {required: true, message: '请输入标题'},
  ], bolgClassifyId: {
    required: true,
    message: "请选择文章分类"
  }, bolgText: {
    required: true,
    message: "请输入正文"
  }, bolgAbstract: {
    required: true,
    message: "请输入文章摘要"
  }, bolgCriticState: {
    required: true,
    message: "请选择评论是否开启"
  }
}
const editDataRef = ref();
const windowConfig = reactive({
  title: "",
  show: false,
  showCancel: false,
  buttons: [{
    type: "danger",
    text: "确定",
    click: (e) => {
      editBlog();
    }
  }]
})
const editData = reactive({bolgTag: [], bolgCriticState: false});
const closeWindow = () => {
  windowConfig.show = false;
  loadingFormData();
}
const del = (data) => {
  Confirm("确定删除" + data.bolgTitle + "?", () => {
    blogApi.deleteBlog({id: data.id}).then((res) => {
      if (res.code==200){
        proxy.$message.success(res.msg)
        loadingFormData();
      }
    })
  });

}

const showEdit = (type, data) => {
  nextTick(() => {
    if (type == 'add') {
      windowConfig.title = "新增博客";
      editDataRef.value.resetFields();
    } else if (type == 'edit') {
      blogApi.showBlog({id: data.id}).then((res) => {
        if (res.code = 200) {
          windowConfig.title = "修改博客";
          Object.assign(editData, res.data)
          editData.bolgTag = res.data.bolgTag.split(',')
        }
      })
    }
  })
  windowConfig.show = true;
}

//列表
const loadingFormData = () => {
  let params = {pageNum: tableData.pageNum, pageSize: tableData.pageSize}
  Object.assign(params, searchbarData)
  blogApi.indexPage(params).then((result) => {
    if (result.code == 200) {
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
  label: "标题",
  prop: "bolgTitle",
  width: 150
}, {
  label: "摘要",
  prop: "bolgAbstract",
}, {
  label: "状态",
  prop: "state",
  width: 150,
  scopedSlots: "state"
}, {
  label: "分类",
  prop: "bolgClassifyName",
  width: 80,
}, {
  label: "时间",
  prop: "updateTime",
  width: 150
}, {
  label: "作者",
  prop: "username",
  width: 80
}, {
  label: "操作",
  prop: "op",
  width: 150,
  scopedSlots: "op"
}
]

//搜索
const searchbarData = reactive({})
const classifyList = ref();
const loadingClassifyList = () => {
  blogApi.getClassify(null).then((result) => {
    classifyList.value = result.data;
  })
}
loadingClassifyList();


</script>

<style scoped>
@import "../../css/blogList.css";
</style>