<!--
此页插件引用自：程序员老罗:
http://www.wuhancoder.com/special/QYdGDDRMGU.html
-->
<template>
  <div>
    <el-dialog :show-close="showClose"
               :draggable="true"
               v-model="props.show"
               :close-on-click-modal="false"
               :title="title"
               class="cust-dialog"
               :top="top"
               :width="width"
               :showCancel="showCancel"
               :before-close="close"
               :fullscreen="fullscreen">
      <div class="dialog-body">
        <slot></slot>
      </div>
      <template v-if="buttons&&buttons.length>0||showCancel">
        <div class="dialog-footer">
          <el-button link
                     @click="close">
            取消
          </el-button>
          <el-button v-for="btn in buttons"
                     :type="btn.type"
                     @click="btn.click">
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>

const props = defineProps({
  fullscreen:{
    type:Boolean,
    default:false
  },
  title: {
    type: String,
  },
  show: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  top: {
    type: String,
    default: "50px"
  },
  width: {
    type: String,
    default: "30%"
  },
  buttons: {
    type: Array
  }
})

const emit = defineEmits();
const close = () => {
  emit("close")
}

</script>

<style scoped>
.dialog-body {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 15px;
  min-height: 80px;
}

.dialog-footer {
  text-align: right;
  padding: 5px 20px;
}
</style>