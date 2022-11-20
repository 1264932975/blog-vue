<template>
  <div class="login-body">
    <router-view :name="name" @changePage="changePage"/>
  </div>

</template>

<script setup>
import {ref} from "vue";

const name = ref("default");
const changePage = (value) => {
  name.value = value;
}

</script>

<style scoped>
.login-body {
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/login/background.jpg");
  background-size: cover;
  background-position: center;
}
</style>