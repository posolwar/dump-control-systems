<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import PageLayout from '@/components/layouts/PageLayout.vue'
import ContainerElement from '@/components/ContainerElement.vue'
import AppPagination from '@/components/AppPagination.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useServersStore } from '@/stores/servers'
import { useDatabasesStore } from '@/stores/databases'
import { useDumpExtendStore } from '@/stores/extend'
import { useSchedulesStore } from '@/stores/schedules'
import { useSchedulesExtendStore } from '@/stores/schedules-extend'
import { useDateFormat } from '@/composables/useDateFormat'
import { useDumpStore } from '@/stores/dump'
import AppLoader from '@/components/AppLoader.vue'
import AppModal from '@/components/AppModal.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import type { ISelectOption } from '@/types/select'
import type { IDatabase } from '@/types/database'
import AppNotification from '@/components/AppNotification.vue'

const serversStore = useServersStore()
const databasesStore = useDatabasesStore()
const scheduleStore = useSchedulesStore()
const dumpExtendStore = useDumpExtendStore()
const schedulesStore = useSchedulesExtendStore()
const dumpStore = useDumpStore()

// modals
const modalsState = ref<Record<string, boolean>>({
  dump: false,
  autoDump: false,
})

const openModal = (id: string) => {
  modalsState.value[id] = true
}

const localData = ref(dumpExtendStore.dumpsExtend)
const itemsPerPage = ref(5)
const currentPage = ref(1)
const showNotificationCreateDump = ref(false)
const showNotificationCreateServer = ref(false)
const showNotificationCreateDatabase = ref(false)


// select data
const selectedServerValue = ref<string | null>(null)
const optionsServer = ref<ISelectOption[]>([])
const selectedDatabaseValue = ref<string | null>(null)
const optionsDatabase = ref<ISelectOption[]>([])
// schedules auto dump
const selectedServerValueSchedules = ref<string | null>(null)
const optionsServerSchedules = ref<ISelectOption[]>([])
const selectedDatabaseValueSchedules = ref<string | null>(null)
const optionsDatabaseSchedules = ref<ISelectOption[]>([])

const optionInterval = ref<ISelectOption[]>([
  {
    label: 'Ежедневно',
    value: '1d',
  },
  {
    label: 'Еженедельно',
    value: 'weekly',
  },
  {
    label: 'Eжемесячно',
    value: 'monthly',
  },
])

// schedules data
const localSchedulesData = ref(schedulesStore.schedulesExtend)
const itemsPerPageSchedules = ref(5)
const currentPageSchedules = ref(1)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return localData.value.slice(start, end)
})

// schedules pagination
const paginatedSchedulesData = computed(() => {
  const start = (currentPageSchedules.value - 1) * itemsPerPageSchedules.value
  const end = start + itemsPerPageSchedules.value
  return localSchedulesData.value.slice(start, end)
})

const deleteRow = async (index: number) => {
  const globalIndex = (currentPage.value - 1) * itemsPerPage.value + index
  const dumpId = localData.value[globalIndex].id

  try {
    await dumpStore.deleteDump(dumpId)
    localData.value.splice(globalIndex, 1)
    if (globalIndex >= localData.value.length && currentPage.value > 1) {
      currentPage.value--
    }
  } catch (error) {
    console.error('Error deleting dump:', error)
    // Handle the error as needed
  }
}

// schedules delete
const deleteScheduleRow = async (index: number) => {
  const globalIndex = (currentPage.value - 1) * itemsPerPage.value + index
  const scheduleId = localData.value[globalIndex].id

  try {
    await scheduleStore.deleteSchedule(scheduleId)
    localData.value.splice(globalIndex, 1)
    if (globalIndex >= localData.value.length && currentPage.value > 1) {
      currentPage.value--
    }
  } catch (error) {
    console.error('Error deleting dump:', error)
    // Handle the error as needed
  }
}

watch(
  () => dumpExtendStore.dumpsExtend,
  (newVal) => {
    localData.value = [...newVal]
    currentPage.value = 1
  },
)

// schedules
watch(
  () => schedulesStore.schedulesExtend,
  (newVal) => {
    localSchedulesData.value = [...newVal]
    currentPageSchedules.value = 1
  },
)

watch(
  () => selectedServerValue.value,
  async (newServerId) => {
    if (newServerId) {
      // поменять функцию databasesStore.fetchDatabaseIdServer создать ее в дальнейшем в store shedule
      const databases = await databasesStore.fetchDatabaseIdServer(Number(newServerId))
      optionsDatabase.value = databases.map((db: IDatabase) => ({
        value: db.id,
        label: db.name,
      }))

      // Устанавливаем первую базу данных по умолчанию
      if (databases.length > 0) {
        selectedDatabaseValue.value = databases[0].id.toString()
      } else {
        selectedDatabaseValue.value = null
      }
    } else {
      optionsDatabase.value = []
      selectedDatabaseValue.value = null
    }
  },
  { immediate: true }, // Загружаем базы данных сразу при инициализации
)

watch(
  () => selectedServerValueSchedules.value,
  async (newServerId) => {
    if (newServerId) {
      const databases = await databasesStore.fetchDatabaseIdServer(Number(newServerId))
      optionsDatabaseSchedules.value = databases.map((db: IDatabase) => ({
        value: db.id,
        label: db.name,
      }))

      // Устанавливаем первую базу данных по умолчанию
      if (databases.length > 0) {
        selectedDatabaseValueSchedules.value = databases[0].id.toString()
      } else {
        selectedDatabaseValueSchedules.value = null
      }
    } else {
      optionsDatabaseSchedules.value = []
      selectedDatabaseValueSchedules.value = null
    }
  },
  { immediate: true }, // Загружаем базы данных сразу при инициализации
)

onMounted(async () => {
  await serversStore.fetchServers()
  optionsServer.value = serversStore.servers.map((server) => ({
    value: server.id,
    label: server.name,
  }))

  // Выбираем первый сервер по умолчанию
  if (serversStore.servers.length > 0) {
    selectedServerValue.value = serversStore.servers[0].id.toString()
  }

  dumpExtendStore.loadDumpsExtendFromLocalStorage()
  await dumpExtendStore.fetchExtendDumps()

  schedulesStore.loadSchedulesExtendFromLocalStorage()
  await schedulesStore.fetchSchedulesExtend()
  optionsServerSchedules.value = serversStore.servers.map((server) => ({
    value: server.id,
    label: server.name,
  }))
  if (serversStore.servers.length > 0) {
    selectedServerValueSchedules.value = serversStore.servers[0].id.toString()
  }
})

const tableBackupHeaders = ref(['Сервер', 'БД', 'Дата создания', 'Размер', 'Статус', ''])

const tableAutoBackupHeaders = ref([
  'Сервер',
  'БД',
  'Выполнено',
  'Следующая дата',
  'Интервал',
  'Статус',
  '',
])

// create dump
const createDump = async () => {
  if (selectedServerValue.value && selectedDatabaseValue.value) {
    await dumpStore.fetchDumpCreate(Number(selectedDatabaseValue.value))
    showNotificationCreateDump.value = true
    modalsState.value.dump = false // Закрываем модальное окно
  }
}

const ipAddress = ref(' ');
const location = ref(' ');
const name = ref(' ');
const port = ref(' ');
const status = ref(' active'); // или любое значение по умолчанию

const createServer = async () => {
  await serversStore.fetchServerCreate(ipAddress.value, location.value, name.value, port.value, status.value);
  // Закройте модальное окно
  modalsState.value.newServer = false; 

  showNotificationCreateServer.value = true
  // Сбросьте поля формы после успешного создания
  ipAddress.value = '';
  location.value = '';
  name.value = '';
  port.value = '';
  status.value = 'active'; // или значение по умолчанию
  // Добавьте логику уведомления пользователя, если необходимо
}

const databaseName = ref('');
const serverId = ref(1); // или любое значение по умолчанию
const username = ref('');
const password = ref('');

const createDatabase = async () => {
  await databasesStore.fetchDatabaseCreate(databaseName.value, username.value, password.value, serverId.value);
  // Закройте модальное окно
  modalsState.value.newDatabase = false; 
  showNotificationCreateDatabase.value = true
  // Сбросьте поля формы после успешного создания
  databaseName.value = '';
  serverId.value = 1; // или значение по умолчанию
  username.value = '';
  password.value = '';
  // Добавьте логику уведомления пользователя, если необходимо
};

const createAutoDump = async () => {
  if (selectedServerValueSchedules.value && selectedDatabaseValueSchedules.value) {
    await scheduleStore.fetchScheduleCreate(Number(selectedDatabaseValueSchedules.value))
    showNotificationCreateDump.value = true
    modalsState.value.schedule = false // Закрываем модальное окно
  }
}
</script>

<template>
  <PageLayout>
    <ContainerElement>
      <div class="table-container">
        <div>
          <div class="loader" v-if="dumpExtendStore.dumpsExtendLoading">
            <AppLoader />
          </div>
          <div class="error" v-else-if="dumpExtendStore.dumpsExtendError">
            Что-то пошло не так...
          </div>
          <div class="app-table" v-else>
            <h2 class="app-table__title">Бэкапы</h2>
            <div class="filters">
              <div class="filters__content">
                <AppButton>Выбрать сервер</AppButton>
                <AppButton>Выбрать БД</AppButton>
                <AppButton>Выбрать период </AppButton>
              </div>
              <AppButton color="green" class="app-table__btn" @click="openModal('newServer')">
                создать сервер
              </AppButton>
              <AppButton color="green" class="app-table__btn" @click="openModal('newDatabase')">
                создать базу данных
              </AppButton>
              <AppButton color="green" class="app-table__btn" @click="openModal('dump')">
                создать бэкап
              </AppButton>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th v-for="header in tableBackupHeaders" :key="header">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
                  <td>{{ row.server_name }}</td>
                  <td>{{ row.database_name }}</td>
                  <td>{{ useDateFormat(row.created_at).formattedDate }}</td>
                  <td>{{ row.size }}</td>
                  <td>{{ row.status }}</td>
                  <td>
                    <div class="table-icons">
                      <svg
                        class="table-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.40096 0.877905C3.07448 0.483688 2.69733 0.176476 2.25828 0.0547329C1.79109 -0.0728078 1.34079 0.0314757 0.929879 0.274962C0.040519 0.808314 -0.263486 1.97938 0.24874 2.89536L4.56047 10.3566C4.56047 10.3624 4.56047 10.368 4.56047 10.3796C4.55484 10.4028 4.53798 10.4319 4.51546 10.4493C3.86814 10.9304 3.13637 11.6551 2.73109 12.2059C2.07251 13.087 1.89805 14.2754 2.27519 15.3131C2.48345 15.9045 3.09132 16.0958 3.55851 15.9567C3.86247 15.8697 4.2171 15.7363 4.55483 15.6146C4.74621 15.545 4.93202 15.4756 5.10088 15.4118C5.62437 15.2321 6.08589 15.1103 6.46303 15.1161C6.85705 15.1161 7.27361 15.1335 7.69015 15.1451C8.41064 15.1741 9.14235 15.1972 9.82907 15.1624C10.9661 15.1044 12.1144 14.8842 13.2458 14.2117C15.9589 12.5943 16.6344 9.01157 15.4186 6.28683C14.8613 5.04041 14.0789 3.89835 13.015 3.24325C11.9174 2.56497 10.589 2.44322 9.07483 3.09832L6.52493 4.19975L3.40096 0.877905ZM1.9712 1.17938C1.853 1.14459 1.70666 1.15614 1.49277 1.27788C1.14378 1.48659 1.02558 1.95039 1.22259 2.30982L5.52861 9.75941C5.86635 10.3449 5.63556 11.0405 5.17399 11.3883C4.60548 11.8116 3.95822 12.4609 3.62049 12.9073C3.22084 13.4523 3.09697 14.1828 3.29961 14.8263C3.55854 14.7509 3.82313 14.6523 4.1102 14.548C4.30721 14.4726 4.51548 14.3914 4.74626 14.316C5.28101 14.1305 5.88889 13.9509 6.46866 13.9567C6.94148 13.9567 7.38617 13.9739 7.81397 13.9913C8.4838 14.0145 9.11985 14.0377 9.7728 14.0087C10.7973 13.9508 11.7542 13.7537 12.6829 13.203C14.7938 11.9508 15.4185 9.06365 14.3941 6.77372C13.8818 5.62585 13.2233 4.72734 12.4352 4.23457C11.6753 3.76498 10.7297 3.63738 9.50826 4.16493L6.95837 5.27231C6.53057 5.45782 6.03526 5.34755 5.71441 5.00551L2.5679 1.65479L2.55663 1.64319C2.30333 1.33593 2.1063 1.21416 1.9712 1.17938Z"
                          fill="#65B042"
                        />
                      </svg>
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
                :totalItems="dumpExtendStore.dumpsExtend.length"
                :itemsPerPage="itemsPerPage"
                v-model:modelValue="currentPage"
              >
              </AppPagination>
            </div>
          </div>
        </div>
        <!-- авто бэкап -->
        <div>
          <div class="loader" v-if="schedulesStore.schedulesExtendLoading">
            <AppLoader />
          </div>
          <div class="error" v-else-if="schedulesStore.schedulesExtendError">
            Что-то пошло не так...
          </div>
          <div class="app-table" v-else>
            <h2 class="app-table__title">Управление автоматизацией бэкапов</h2>
            <div class="filters">
              <div class="filters__content">
                <AppButton>Выбрать сервер</AppButton>
                <AppButton>Выбрать БД</AppButton>
                <AppButton>Выбрать период </AppButton>
              </div>
              <AppButton color="green" class="app-table__btn" @click="openModal('autoDump')">
                создать авто бэкап
              </AppButton>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th v-for="header in tableAutoBackupHeaders" :key="header">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in paginatedSchedulesData" :key="rowIndex">
                  <td>{{ row.server_name }}</td>
                  <td>{{ row.database_name }}</td>
                  <td>{{ useDateFormat(row.schedule_time).formattedDate }}</td>
                  <td>{{ useDateFormat(row.last_run).formattedDate }}</td>
                  <td>{{ row.repeat_interval }}</td>
                  <td>{{ row.status }}</td>
                  <td>
                    <div class="table-icons">
                      <svg
                        class="table-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.40096 0.877905C3.07448 0.483688 2.69733 0.176476 2.25828 0.0547329C1.79109 -0.0728078 1.34079 0.0314757 0.929879 0.274962C0.040519 0.808314 -0.263486 1.97938 0.24874 2.89536L4.56047 10.3566C4.56047 10.3624 4.56047 10.368 4.56047 10.3796C4.55484 10.4028 4.53798 10.4319 4.51546 10.4493C3.86814 10.9304 3.13637 11.6551 2.73109 12.2059C2.07251 13.087 1.89805 14.2754 2.27519 15.3131C2.48345 15.9045 3.09132 16.0958 3.55851 15.9567C3.86247 15.8697 4.2171 15.7363 4.55483 15.6146C4.74621 15.545 4.93202 15.4756 5.10088 15.4118C5.62437 15.2321 6.08589 15.1103 6.46303 15.1161C6.85705 15.1161 7.27361 15.1335 7.69015 15.1451C8.41064 15.1741 9.14235 15.1972 9.82907 15.1624C10.9661 15.1044 12.1144 14.8842 13.2458 14.2117C15.9589 12.5943 16.6344 9.01157 15.4186 6.28683C14.8613 5.04041 14.0789 3.89835 13.015 3.24325C11.9174 2.56497 10.589 2.44322 9.07483 3.09832L6.52493 4.19975L3.40096 0.877905ZM1.9712 1.17938C1.853 1.14459 1.70666 1.15614 1.49277 1.27788C1.14378 1.48659 1.02558 1.95039 1.22259 2.30982L5.52861 9.75941C5.86635 10.3449 5.63556 11.0405 5.17399 11.3883C4.60548 11.8116 3.95822 12.4609 3.62049 12.9073C3.22084 13.4523 3.09697 14.1828 3.29961 14.8263C3.55854 14.7509 3.82313 14.6523 4.1102 14.548C4.30721 14.4726 4.51548 14.3914 4.74626 14.316C5.28101 14.1305 5.88889 13.9509 6.46866 13.9567C6.94148 13.9567 7.38617 13.9739 7.81397 13.9913C8.4838 14.0145 9.11985 14.0377 9.7728 14.0087C10.7973 13.9508 11.7542 13.7537 12.6829 13.203C14.7938 11.9508 15.4185 9.06365 14.3941 6.77372C13.8818 5.62585 13.2233 4.72734 12.4352 4.23457C11.6753 3.76498 10.7297 3.63738 9.50826 4.16493L6.95837 5.27231C6.53057 5.45782 6.03526 5.34755 5.71441 5.00551L2.5679 1.65479L2.55663 1.64319C2.30333 1.33593 2.1063 1.21416 1.9712 1.17938Z"
                          fill="#65B042"
                        />
                      </svg>
                      <svg
                        @click="deleteScheduleRow(rowIndex)"
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
                :totalItems="dumpExtendStore.dumpsExtend.length"
                :itemsPerPage="itemsPerPage"
                v-model:modelValue="currentPage"
              >
              </AppPagination>
            </div>
          </div>
        </div>
      </div>
    </ContainerElement>
    <!-- modal -->
<AppModal v-model:modelValue="modalsState.newServer">
  <div class="modal-container">
    <h3 class="modal-container__title">Создание нового сервера</h3>
    <div class="loader" v-if="serversStore.serversLoading">
      <AppLoader />
    </div>
    <div class="error" v-else-if="serversStore.serversError">Что-то пошло не так...</div>
    <form v-else class="form" @submit.prevent="createServer">
      <div class="form-content">
        <div class="form-group">
          <h3 class="form-group__title">Данные сервера</h3>
          <div class="form-group__item">
            <label>IP Адрес</label>
            <input v-model="ipAddress" placeholder="Введите IP адрес" />
          </div>
          <div class="form-group__item">
            <label>Локация</label>
            <input v-model="location" placeholder="Введите локацию" />
          </div>
          <div class="form-group__item">
            <label>Имя</label>
            <input v-model="name" placeholder="Введите имя сервера" />
          </div>
          <div class="form-group__item">
            <label>Порт</label>
            <input v-model="port" placeholder="Введите порт" />
          </div>
          <div class="form-group__item">
            <label>Статус</label>
            <input v-model="status" placeholder="Введите статус" />
          </div>
        </div>
      </div>
      <div class="form-footer">
        <AppButton color="green" type="submit">Создать сервер</AppButton>
      </div>
    </form>
  </div>
</AppModal>
<!-- modal -->
<!-- modal -->
<AppModal v-model:modelValue="modalsState.newDatabase">
  <div class="modal-container">
    <h3 class="modal-container__title">Создание новой базы данных</h3>
    <div class="loader" v-if="databasesStore.databasesLoading">
      <AppLoader />
    </div>
    <div class="error" v-else-if="databasesStore.databasesError">Что-то пошло не так...</div>
    <form v-else class="form" @submit.prevent="createDatabase">
      <div class="form-content">
        <div class="form-group">
          <h3 class="form-group__title">Данные базы данных</h3>
          <div class="form-group__item">
            <label>Имя базы данных</label>
            <input v-model="databaseName" placeholder="Введите имя базы данных" />
          </div>
          <div class="form-group__item">
            <label>ID сервера</label>
            <input type="number" v-model="serverId" placeholder="Введите ID сервера" />
          </div>
          <div class="form-group__item">
            <label>Имя пользователя</label>
            <input v-model="username" placeholder="Введите имя пользователя" />
          </div>
          <div class="form-group__item">
            <label>Пароль</label>
            <input type="password" v-model="password" placeholder="Введите пароль" />
          </div>
        </div>
      </div>
      <div class="form-footer">
        <AppButton color="green" type="submit">Создать базу данных</AppButton>
      </div>
    </form>
  </div>
</AppModal>
<!-- modal -->
    <!-- modal -->
    <AppModal v-model:modelValue="modalsState.dump">
      <div class="modal-container">
        <h3 class="modal-container__title">Создание бэкапа</h3>
        <!-- server -->
        <div class="loader" v-if="dumpStore.dumpsLoading">
          <AppLoader />
        </div>
        <div class="error" v-else-if="dumpStore.dumpsError">Что-то пошло не так...</div>
        <form v-else class="form" @submit.prevent="createDump">
          <div class="form-content">
            <div class="form-group">
              <h3 class="form-group__title">Сервер</h3>
              <div class="form-group__item">
                <AppSelect
                  :options="optionsServer"
                  v-model:model-value="selectedServerValue"
                  placeholder="Выберите сервер"
                />
              </div>
              <div class="form-group__item">
                <AppSelect
                  :options="optionsDatabase"
                  v-model:model-value="selectedDatabaseValue"
                  label="Выберите базу данных"
                />
              </div>
            </div>
          </div>
          <div class="form-footer">
            <AppButton color="green" type="submit">Создать бэкап</AppButton>
          </div>
        </form>
      </div>
    </AppModal>
    <AppNotification v-if="showNotificationCreateDump" message="Бэкап успешно создан!" />
    <AppNotification v-if="showNotificationCreateServer" message="Сервер успешно создан!" />
    <AppNotification v-if="showNotificationCreateDatabase" message="База данных успешно создана!" />
    <!-- modal -->
    <AppModal v-model:modelValue="modalsState.autoDump">
      <div class="modal-container">
        <h3 class="modal-container__title">Создание автоматического бэкапа</h3>
        <!-- server -->
        <div class="loader" v-if="scheduleStore.schedulesLoading">
          <AppLoader />
        </div>
        <div class="error" v-else-if="scheduleStore.schedulesError">Что-то пошло не так...</div>
        <form v-else class="form" @submit.prevent="createAutoDump">
          <div class="form-content">
            <div class="form-group">
              <h3 class="form-group__title">Сервер</h3>
              <div class="form-group__item">
                <AppSelect
                  :options="optionsServerSchedules"
                  v-model:model-value="selectedServerValueSchedules"
                  placeholder="Выберите сервер"
                />
              </div>
              <div class="form-group__item">
                <AppSelect
                  :options="optionsDatabaseSchedules"
                  v-model:model-value="selectedDatabaseValueSchedules"
                  label="Выберите базу данных"
                />
              </div>
              <div class="form-group__item">
                <AppSelect
                  :options="optionInterval"
                  v-model:model-value="scheduleStore.selectedInterval"
                  label="Выберите интервал"
                />
              </div>
            </div>
          </div>
          <div class="form-footer">
            <AppButton color="green" type="submit">Создать авто бэкап</AppButton>
          </div>
        </form>
      </div>
    </AppModal>

  </PageLayout>
</template>

<style scoped lang="scss">
.table-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

</style>
