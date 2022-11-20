<template>
<div class="cover" v-if="cover">
<img class="cover img" :src="proxy.globalUrl.imgUrl+cover">
</div>
</template>

<script setup>
import {getCurrentInstance} from "vue";
const props=defineProps({
  cover:{
    type:String,
  }
})
const {proxy}=getCurrentInstance();

</script>

<style scoped>
.cover{
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  overflow: hidden;
}
.img{
  width: 100%;
}

</style>