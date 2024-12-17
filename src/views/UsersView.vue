<script setup lang="ts">
import { ref } from 'vue'
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
import AppTable from '@/components/AppTable.vue'

const tableUsersHeaders = ref(['Имя', 'Роль', 'Дата создания', ''])

const tableUsersData = ref([
  {
    name: 'Администратор',
    role: 'Администратор',
    created: '17.01.2017 15:01',
  },
  {
    name: 'Алексей',
    role: 'Юзер',
    created: '17.01.2017 15:01',
  },
  {
    name: 'Алексей',
    role: 'Юзер',
    created: '17.01.2017 15:01',
  },
  {
    name: 'Алексей',
    role: 'Юзер',
    created: '17.01.2017 15:01',
  },
  {
    name: 'Алексей',
    role: 'Юзер',
    created: '17.01.2017 15:01',
  },
  {
    name: 'Алексей',
    role: 'Юзер',
    created: '17.01.2017 15:01',
  },
  {
    name: 'Алексей',
    role: 'Юзер',
    created: '17.01.2017 15:01',
  },
  {
    name: 'Алексей',
    role: 'Юзер',
    created: '17.01.2017 15:01',
  },
])
</script>

<template>
  <PageLayout>
    <ContainerElement>
      <div class="table-container">
        <AppTable
          title="Юзеры"
          :data="tableUsersData"
          :headers="tableUsersHeaders"
          :showPagination="true"
          :showActions="true"
          :show-action-edit="false"
          :filters="false"
          btn
          label-btn="создать юзера"
        />
      </div>
    </ContainerElement>
  </PageLayout>
</template>

<style scoped lang="scss">
.table-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
