<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
import AppPagination from '@/components/AppPagination.vue'
import AppButton from '@/components/ui/AppButton.vue'

import { useUsersStore } from '@/stores/users'
import { useDateFormat } from '@/composables/useDateFormat'
import AppLoader from '@/components/AppLoader.vue'

const usersStore = useUsersStore()

const localData = ref(usersStore.users)
const itemsPerPage = ref(5)
const currentPage = ref(1)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return localData.value.slice(start, end)
})

const deleteRow = (index: number) => {
  const globalIndex = (currentPage.value - 1) * itemsPerPage.value + index
  localData.value.splice(globalIndex, 1)
  if (globalIndex >= localData.value.length && currentPage.value > 1) {
    currentPage.value--
  }
}

watch(
  () => usersStore.users,
  (newVal) => {
    localData.value = [...newVal]
    currentPage.value = 1
  },
)
onMounted(async () => {
  usersStore.loadUsersFromLocalStorage()
  await usersStore.fetchUsers()
})

const tableBackupHeaders = ref(['Имя', 'Роль', 'Дата ', ''])
</script>

<template>
  <PageLayout>
    <ContainerElement>
      <div class="table-container">
        <div class="app-table">
          <div class="app-table__header">
            <h2 class="app-table__title">Юзеры</h2>
            <AppButton color="green" class="app-table__btn">создать бэкап</AppButton>
          </div>
          <div class="loader" v-if="usersStore.usersLoading">
            <AppLoader />
          </div>
          <div class="error" v-else-if="usersStore.usersError">Что-то пошло не так...</div>
          <table class="table" v-else>
            <thead>
              <tr>
                <th v-for="header in tableBackupHeaders" :key="header">{{ header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
                <td>{{ row.username }}</td>
                <td>{{ row.role }}</td>
                <td>{{ useDateFormat(row.created_at).formattedDate }}</td>

                <td>
                  <div class="table-icons">
                    <svg
                      @click="deleteRow(rowIndex)"
                      class="table-icon"
                      width="8"
                      height="9"
                      viewBox="0 0 8 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.07812 0.546875L3.92969 3.625L5.80469 0.546875H7.5L4.73438 4.71875L7.58594 9H5.91406L3.96094 5.82812L2.00781 9H0.328125L3.17188 4.71875L0.414062 0.546875H2.07812Z"
                        fill="#BE2323"
                      />
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="app-table__pagination">
            <AppPagination
              :totalItems="usersStore.users.length"
              :itemsPerPage="itemsPerPage"
              v-model:modelValue="currentPage"
            >
            </AppPagination>
          </div>
        </div>
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
