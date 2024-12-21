<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppLoader from '@/components/AppLoader.vue'
import AppPagination from '@/components/AppPagination.vue'
import { required } from '@/utils/i18n-validators'

import { useSettingsStore } from '@/stores/settings'
import AppNotification from '@/components/AppNotification.vue'

const settingsStore = useSettingsStore()

const localData = ref(settingsStore.settingsOptions)
const tgToken = ref('')
const itemsPerPage = ref(5)
const currentPage = ref(1)

const tableHeaders = ref(['Опция', 'Настройка', ''])

const rules = computed(() => {
  return {
    tgToken: { required },
  }
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return localData.value.slice(start, end)
})

const deleteRow = async (index: number) => {
  const globalIndex = (currentPage.value - 1) * itemsPerPage.value + index
  const settingName = localData.value[globalIndex].setting_name
  console.log('jkjkjk', settingName)

  try {
    await settingsStore.fetchDeleteSettings(settingName) // Передаем username вместо id
    localData.value.splice(globalIndex, 1)
    if (globalIndex >= localData.value.length && currentPage.value > 1) {
      currentPage.value--
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

const v$ = useVuelidate(rules, { tgToken })
const fetchTgToken = async () => {
  if (v$.value.$invalid) {
    v$.value.$touch()
    return
  }
  await settingsStore.fetchSettingsCreate(tgToken.value)
  tgToken.value = ''
  v$.value.$reset()
}
watch(
  () => settingsStore.settingsOptions,
  (newVal) => {
    localData.value = [...newVal]
    currentPage.value = 1
  },
)
onMounted(() => {
  settingsStore.loadSettingsOptionsFromLocalStorage()
  settingsStore.fetchSettingsOptions()
  // settingsStore.fetchSettings()
})
</script>

<template>
  <PageLayout>
    <ContainerElement>
      <div class="info">
        <h1 class="info-title">Настройки</h1>
        <div class="info-content">
          <div class="info-content__wrapper">
            <div class="error" v-if="settingsStore.settingsError">Что-то пошло не так...</div>
            <form v-else class="info-content__footer" @submit.prevent="fetchTgToken">
              <div class="">
                <AppInput
                  id="token"
                  type="text"
                  v-model:model-value="tgToken"
                  placeholder="Api-token телеграмма"
                />
                <div v-if="v$.tgToken.$error" class="error-message">
                  <small v-for="(error, i) in v$.tgToken.$errors" :key="i">{{
                    error.$message
                  }}</small>
                </div>
              </div>
              <AppButton> Сохранить </AppButton>
            </form>
          </div>
        </div>
        <div class="table-container">
          <div class="app-table">
            <div class="loader" v-if="settingsStore.settingsLoading">
              <AppLoader />
            </div>
            <div class="error" v-else-if="settingsStore.settingsError">Что-то пошло не так...</div>
            <table class="table" v-else>
              <thead>
                <tr>
                  <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
                  <td :title="row.description">{{ row.option_name }}</td>
                  <td>{{ row.setting_name }}</td>

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
                :totalItems="settingsStore.settingsOptions.length"
                :itemsPerPage="itemsPerPage"
                v-model:modelValue="currentPage"
              >
              </AppPagination>
            </div>
          </div>
        </div>
      </div>
    </ContainerElement>
    <AppNotification v-if="settingsStore.sucssess" message="Настройки сохранены!" />
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
      gap: 20px;
      padding: 10px 0;
      @media screen and (max-width: 580px) {
        flex-direction: column;
      }
    }
  }
}
.error-message {
  color: red;
  padding: 5px;
}
</style>
