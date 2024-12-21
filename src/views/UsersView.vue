<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
import AppPagination from '@/components/AppPagination.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/AppModal.vue'
import { required, minLength } from '@/utils/i18n-validators'

import { useUsersStore } from '@/stores/users'
import { useDateFormat } from '@/composables/useDateFormat'
import AppLoader from '@/components/AppLoader.vue'
import AppNotification from '@/components/AppNotification.vue'
import AppInput from '@/components/ui/AppInput.vue'

const usersStore = useUsersStore()

const localData = ref(usersStore.users)
const itemsPerPage = ref(5)
const currentPage = ref(1)
const modalsState = ref<Record<string, boolean>>({
  user: false,
})
const userName = ref('')
const password = ref('')

const rules = computed(() => {
  return {
    userName: { required },
    password: { required, minLength: minLength(6) },
  }
})

const v$ = useVuelidate(rules, { userName, password })

const openModal = (id: string) => {
  modalsState.value[id] = true
}

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return localData.value.slice(start, end)
})

const deleteRow = async (index: number) => {
  const globalIndex = (currentPage.value - 1) * itemsPerPage.value + index
  const username = localData.value[globalIndex].username
  console.log('jkjkjk', username)

  try {
    await usersStore.fetchUserDelete(username) // Передаем username вместо id
    localData.value.splice(globalIndex, 1)
    if (globalIndex >= localData.value.length && currentPage.value > 1) {
      currentPage.value--
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    // Handle the error as needed
  }
}

const createNewUser = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch()
    return
  }
  await usersStore.fetchUserCreate(userName.value, password.value)
  modalsState.value.user = false
  userName.value = ''
  password.value = ''
  v$.value.$reset()
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
            <AppButton color="green" class="app-table__btn" @click="openModal('user')"
              >создать юзера</AppButton
            >
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
    <AppModal v-model:modelValue="modalsState.user">
      <div class="modal-container">
        <h3 class="modal-container__title">Добавление юзера</h3>
        <!-- server -->
        <div class="loader" v-if="usersStore.usersLoading">
          <AppLoader />
        </div>
        <div class="error" v-else-if="usersStore.usersError">Что-то пошло не так...</div>
        <form v-else class="form" @submit.prevent="createNewUser">
          <div class="form-content">
            <div class="form-group">
              <div class="form-group__item">
                <AppInput v-model:model-value="userName" placeholder="Введите имя пользователя" />
                <div v-if="v$.userName.$error" class="error-message">
                  <small v-for="(error, i) in v$.userName.$errors" :key="i"
                    >{{ error.$message }}
                  </small>
                </div>
              </div>
              <div class="form-group__item">
                <AppInput
                  v-model:model-value="password"
                  placeholder="Введите пароль"
                  type="password"
                />
                <div v-if="v$.password.$error" class="error-message">
                  <small v-for="(error, i) in v$.password.$errors" :key="i"
                    >{{ error.$message }}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div class="form-footer">
            <AppButton color="green" type="submit">создать юзера</AppButton>
          </div>
        </form>
      </div>
    </AppModal>
    <AppNotification v-if="usersStore.sucssess" message="Пользователь создан!" />
  </PageLayout>
</template>

<style scoped lang="scss">
.table-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.error-message {
  color: red;
  padding: 5px;
}
</style>
