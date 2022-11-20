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
          <el-button type="primary" plain>新增博客</el-button>
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
          <span v-if="row.state==0" style="color: red">草稿</span>
          <span v-else style="color: green">已发布</span>
        </template>
        <template #op="{index,row}">
          <a class="a-link" @click="showEdit('edit',row)">修改</a>
          <el-divider direction="vertical"/>
          <a class="a-link" @click="del(row)">删除</a>
          <el-divider direction="vertical"/>
          <a class="a-link" @click="del(row)">预览</a>
        </template>
      </Table>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import {Search} from '@element-plus/icons-vue'
import blogApi from "../../api/blogApi.js";

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
  width: 80,
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

</style>