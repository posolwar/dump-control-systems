<script setup lang="ts">
import { ref } from 'vue'
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
import AppElement from '@/components/AppElement.vue'

const logs = ref([
  {
    content: '[17.01.2009|16:01] Пользователь “Алексей Губаев” запросил отчет.',
  },
  {
    content:
      '[17.01.2009|16:00] Пользователь “Администратор” выполнил вручную бэкап базы данных “dbname”',
  },
])
const pagination = ref({
  totalItems: 10,
  itemsPerPage: 5,
})
</script>

<template>
  <PageLayout>
    <ContainerElement
      pagination
      :total-items="pagination.totalItems"
      :items-per-page="pagination.itemsPerPage"
    >
      <div class="container">
        <AppElement :content="logs" title="Последние логи действий" type="big" />
      </div>
    </ContainerElement>
  </PageLayout>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 70px;
}
</style>
