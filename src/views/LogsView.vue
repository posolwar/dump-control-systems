<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
import AppElement from '@/components/AppElement.vue'
import AppLoader from '@/components/AppLoader.vue';

import { useDumpStore } from '@/stores/dump'
import { useLogsStore } from '@/stores/logs'


const dumpStore = useDumpStore()
const logsStore = useLogsStore()


onMounted(() => {
  dumpStore.loadDumpsFromLocalStorage()
  dumpStore.fetchDumps()

  logsStore.loadLogsFromLocalStorage()
  logsStore.fetchLogs()
})

const pagination = ref({
  totalItems: 10,
  itemsPerPage: 5,
})
</script>

<template>
  <PageLayout>
    <div class="container__loader"  v-if="logsStore.logsLoading">
        <AppLoader/>
      </div>
    <ContainerElement
      v-else
      pagination
      :total-items="pagination.totalItems"
      :items-per-page="pagination.itemsPerPage"
    >
      <div class="container">
        <AppElement :content="logsStore.logs" title="Последние логи действий" type="big" />
      </div>
    </ContainerElement>
  </PageLayout>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 70px;
  &__loader{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
}
</style>
