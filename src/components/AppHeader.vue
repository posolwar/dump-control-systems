<script setup lang="ts">

import AppNavbar from "@/components/AppNavbar.vue";
</script>

<template>
<header class="header">
  <div class="header-container">
    <AppNavbar/>
  </div>
</header>
</template>

<style scoped lang="scss">
.header{
  margin-top: 20px;
  &-container{
    max-width: 807px;
    width: 100%;
    margin: 0 auto;
  }
}
</style>
