<script setup lang="ts">
</script>

<template>
  <div class="container-element">
    <div class=" container-element__content">
        <slot/>
    </div>
  </div>

</template>

<style scoped lang="scss">
.container-element{
  max-width: 807px;
  margin: 0 auto;
  background-color: var(--gray);
  padding: 39px 30px 79px 30px;
  border-radius: 58px;
}
</style>
