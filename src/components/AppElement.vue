<script setup lang="ts">
const { title = 'Заголовок', content,type='small' } = defineProps<{title: string, content: any[],type?: 'small' | 'big'}>()
</script>

<template>
<div class="element">
  <h3 class="element__title">{{ title }}</h3>
  <div class=" element__content" :class=" type === 'big' ? 'element__content-big' : 'element__content-small'" >
    <div class=" element__items" >
      <div class=" element__item" v-for="(item, index) in content" :key="index" >
        {{ item.content }}
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.element{
  &__content{
    background-color: var(--ligty-gray);
    color: var(--dark-blue);
    border: 1px solid var(--dark-blue);
    padding: 7px;
    margin-top: 10px;
  }
  &__content-small{
    min-height: 216px;
  }
  &__content-big{
    min-height: 670px;
  }
  &__title{
    margin: 0;
    font-size: 16px;
    line-height: 18px;
    color: var(--dark-blue);
  }
  &__items{
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  &__item{
    font-size: 14px;
    line-height: 16px;
  }
}
</style>
