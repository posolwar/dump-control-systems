<script setup lang="ts">

import AppHeader from "@/components/AppHeader.vue";
</script>

<template>
<div class="page-layout">
  <AppHeader/>
  <main class="main">
    <slot></slot>
  </main>
</div>
</template>

<style scoped lang="scss">
.page-layout{
  @media (max-width: 768px) {
    padding: 0 20px;
  }
}
.main{
  padding: 130px 0;
  @media (max-width: 768px) {
    padding: 100px 0;
  }
}
</style>
