<script setup lang="ts">
import { onMounted } from 'vue'
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
import AppDumpElement from '@/components/AppDumpElement.vue'
import AppLoader from '@/components/AppLoader.vue'

import { useDumpStore } from '@/stores/dump'
import { useLogsStore } from '@/stores/logs'
import AppLogElement from '@/components/AppLogElement.vue'

const dumpStore = useDumpStore()
const logsStore = useLogsStore()

onMounted( async() => {
   dumpStore.loadDumpsFromLocalStorage()
   await dumpStore.fetchDumps()

  logsStore.loadLogsFromLocalStorage()
  await logsStore.fetchLogs()
})
</script>

<template>
  <PageLayout>
    <ContainerElement>
      <div class="container">
        <div class="container__loader" v-if="dumpStore.dumpsLoading || logsStore.logsLoading">
          <AppLoader />
        </div>
        <div class="" v-if="dumpStore.dumpsError || logsStore.logsError">
          Что-то пошло не так....
        </div>
        <div class="container__content" v-else>
          <AppDumpElement :content="dumpStore.dumps" title="Последние бэкапы" />
          <AppLogElement :content="logsStore.logs" title="Последние логи действий"/>
        </div>
      </div>
    </ContainerElement>
  </PageLayout>
</template>

<style scoped lang="scss">
.container {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 70px;
  }
  &__loader {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
