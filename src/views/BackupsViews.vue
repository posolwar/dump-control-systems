<script setup lang="ts">
import {ref} from 'vue'
import PageLayout from "@/components/layouts/PageLayout.vue";
import ContainerElement from "@/components/ContainerElement.vue";
import AppTable from '@/components/AppTable.vue'


// interface TableItem {
//   server: string;
//   db: string;
//   date: string;
//   size: number;
//   status: string;
// }

const tableBackupHeaders = ref([
  'Сервер',
  'БД',
  'Дата создания',
  'Размер',
  'Статус',
  ''
]);

const tableData = ref([
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
  { server: 'aap1-chel2.ru', db: 'app', date: '17.01.2017 17:06', size: 126, status: 'Ok' },
]);

const tableAutoBackupHeaders = ref([
  'Сервер',
  'БД',
  'Выполнено',
  'Следующая дата',
  'Интервал',
  'Статус',
  ''
]);
const tableAutoBackupsData = ref([
  {
    server: 'aap1-chel2.ru',
    db: 'app',
    executed: '17.01.2017 17:06',
    last_date: '18.01.2017 17:06',
    interval: '1d',
    status: 'Не выполняется'
  },
  {
    server: 'aap1-chel2.ru',
    db: 'app1',
    executed: '17.01.2017 17:06',
    last_date: '18.01.2017 17:06',
    interval: '1d',
    status: 'Не выполняется'
  },
  {
    server: 'aap1-chel2.ru',
    db: 'app2',
    executed: '17.01.2017 17:06',
    last_date: '18.01.2017 17:06',
    interval: '1d',
    status: 'Не выполняется'
  },
  {
    server: 'aap1-chel2.ru',
    db: 'app3',
    executed: '17.01.2017 17:06',
    last_date: '18.01.2017 17:06',
    interval: '1d',
    status: 'Не выполняется'
  },
  {
    server: 'aap1-chel2.ru',
    db: 'app4',
    executed: '17.01.2017 17:06',
    last_date: '18.01.2017 17:06',
    interval: '1d',
    status: 'Не выполняется'
  },
  {
    server: 'aap1-chel2.ru',
    db: 'app5',
    executed: '17.01.2017 17:06',
    last_date: '18.01.2017 17:06',
    interval: '1d',
    status: 'Не выполняется'
  },
  {
    server: 'aap1-chel2.ru',
    db: 'app6',
    executed: '17.01.2017 17:06',
    last_date: '18.01.2017 17:06',
    interval: '1d',
    status: 'Не выполняется'
  }
]);
</script>


<template>
  <PageLayout>
    <ContainerElement >
      <div class="table-container">
<AppTable title="Бэкапы" :data="tableData"
          :headers="tableBackupHeaders"
          :showPagination="true"
          :showActions="true" filters btn/>

      <AppTable title="Бэкапы" :data="tableAutoBackupsData"
                :headers="tableAutoBackupHeaders"
                :showPagination="true"
                :showActions="true" filters btn :show-action-edit="false"/>

      </div>
    </ContainerElement>
  </PageLayout>
</template>

<style scoped lang="scss">
.table-container{
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
