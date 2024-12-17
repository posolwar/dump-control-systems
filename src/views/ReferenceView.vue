<script setup lang="ts">
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
</script>

<template>
  <PageLayout>
    <ContainerElement>
      <div class="info">
        <h1 class="info-title">Справка</h1>
        <div class="info-content">
          <h2 class="info-content__title">
            Сервис предназначен для управления дампами базы данных.
          </h2>
          <div class="info-content__wrapper">
            <div>
              <p class="info-content__text">Описание разделов:</p>
              <p class="info-content__text">
                Главная - быстрый доступ к последним логам и выполненным бэкапам
              </p>
              <p class="info-content__text">Логи - просмотр логов действий</p>
              <p class="info-content__text">Бэкапы - Просмотр списка бэкапов</p>
              <p class="info-content__text">Юзеры - Просмотр списка юзеров</p>
              <p class="info-content__text">Справка - Краткая информация о ресурсе</p>
            </div>
            <p class="info-content__text">
              По всем вопросам можно обратиться по телеграмму @gorkostya
            </p>
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
    min-height: 304px;
    display: flex;
    flex-direction: column;
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
  }
}
</style>
