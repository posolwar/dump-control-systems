<script setup lang="ts">
import AppPagination from '@/components/AppPagination.vue'
const{pagination=false, totalItems=10, itemsPerPage= 5, modelValue=1} = defineProps<{pagination?: boolean, totalItems?: number, itemsPerPage?: number, modelValue?: number}>()
</script>

<template>
  <div class="container-element">
    <div class=" container-element__content">
        <slot/>
      <div class="container-element__footer">
        <AppPagination :total-items="totalItems" :items-per-page="itemsPerPage" :model-value="modelValue" v-if="pagination"/>
      </div>
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
  &__footer{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 40px;
  }
}
</style>
