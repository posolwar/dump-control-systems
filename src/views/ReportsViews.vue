<script setup lang="ts">
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
import AppButton from '@/components/ui/AppButton.vue'
</script>

<template>
  <PageLayout>
    <ContainerElement>
      <div class="info">
        <h1 class="info-title">Отчеты</h1>
        <div class="info-content">
          <div class="info-content__wrapper">
            <div class="info-content__footer">
              <AppButton> Выбрать период </AppButton>
              <AppButton color="green"> Скачать отчет </AppButton>
            </div>
          </div>
        </div>
      </div>
    </ContainerElement>
  </PageLayout>
</template>

<style scoped lang="scss">
.info {
  color: var(--dark-blue);
  &-title {
    font-size: 16px;
    line-height: 18px;
    border-bottom: 1px solid var(--dark-blue);
    padding-bottom: 10px;
    color: var(--dark-blue);
  }
  &-content {
    //min-height: 304px;
    //display: flex;
    //flex-direction: column;
    &__title {
      font-size: 16px;
      line-height: 18px;
      margin-top: 20px;
      margin-bottom: 40px;
    }
    &__wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
    }
    &__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
    }
  }
}
</style>
