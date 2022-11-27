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
        <el-form-item prop="bolgClassifyId" label="分类">
          <el-select v-model="searchbarData.bolgClassifyId" clearable>
            <el-option v-for="item in classifyList" :value="item.id" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-button @click="loadingFormData" type="primary" style="margin-left: 15px">搜索</el-button>
      </el-row>
    </el-form>
    <Table :columns="columns"
           :fetch="loadingFormData"
           :dataSource="tableData"
           :options="tableOptions"
    >
      <template #cover="{index,row}">
        <Cover :cover=" row.cover"></Cover>
      </template>
      <template #op="{index,row}">
        <a class="a-link" @click="goBack(row)">还原到草稿</a>
        <el-divider direction="vertical"/>
        <a class="a-link" @click="destroy(row)">销毁</a>
      </template>
    </Table>
  </div>
</template>

<script setup>
import {getCurrentInstance, reactive, ref} from "vue";
import {Search} from '@element-plus/icons-vue'
import blogApi from "../../api/blogApi.js";
import Confirm from "../../util/Confirm.js";

//销毁
const destroy = (data) => {
  Confirm("确定销毁" + data.bolgTitle + "?销毁后无法被恢复", () => {
    blogApi.destroy({id: data.id}).then((res) => {
      if (res) {
        proxy.$message.success(res.msg)
        loadingFormData()
      }
    })
  });


}


//还原
const goBack = async (data) => {
  blogApi.goBack({id: data.id}).then((res) => {
    if (res) {
      proxy.$message.success(res.msg)
      loadingFormData()
    }

  })

}


//列表
const {proxy} = getCurrentInstance();
const loadingFormData = () => {
  let params = {pageNum: tableData.pageNum, pageSize: tableData.pageSize, state: 2}
  Object.assign(params, searchbarData)
  blogApi.indexPage(params).then((result) => {
    if (result) {
      Object.assign(tableData, result.data)
    }
  })
}
const tableOptions = {
  extHeight: 160
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
  width: 200
}, {
  label: "操作",
  prop: "op",
  width: 200,
  scopedSlots: "op"
}
]

//搜索
const searchbarData = reactive({})
const classifyList = ref();
const loadingClassifyList = () => {
  blogApi.getClassify(null).then((result) => {
    if (result) {
      classifyList.value = result.data;
    }
  })
}
loadingClassifyList();


</script>

<style scoped>
@import "../../css/blogList.css";
</style>