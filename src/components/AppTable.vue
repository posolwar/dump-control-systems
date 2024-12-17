
<script setup lang="ts">
import { ref,computed,watch } from 'vue';
import AppButton from '@/components/ui/AppButton.vue'
import AppPagination from '@/components/AppPagination.vue'

const {  data, headers, showActions,showActionEdit=true, showPagination = true,title,filters ,btn} = defineProps<{
  data: any[];
  headers: string[];
  showPagination?: boolean;
  showActions?: boolean;
  showActionEdit?: boolean;
  title:string;
  filters: boolean,
  btn:boolean
}>();

const localData = ref([...data]);
const itemsPerPage = ref(5);
const currentPage = ref(1);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return localData.value.slice(start, end);
});

const deleteRow = (index: number) => {
  const globalIndex = (currentPage.value - 1) * itemsPerPage.value + index;
  localData.value.splice(globalIndex, 1);
  if (globalIndex >= localData.value.length && currentPage.value > 1) {
    currentPage.value--;
  }
};

watch(() => data, (newVal) => {
  localData.value = [...newVal];
  currentPage.value = 1;
});
</script>

<template>
  <div class="app-table">
    <h2 class="app-table__title">{{title}}</h2>
    <div class="filters">
      <div class="filters__content" v-if="filters">
      <AppButton>Выбрать сервер</AppButton>
      <AppButton>Выбрать БД</AppButton>
      <AppButton>Выбрать период </AppButton>
      </div>
      <AppButton v-if="btn" color="green" class="app-table__btn">создать дамп</AppButton>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th v-for="header in headers" :key="header">{{ header }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
        <td v-for="(value, colIndex) in row" :key="colIndex">{{ value }}</td>
        <td v-if="showActions">
          <div class="table-icons">
            <svg v-if="showActionEdit" class="table-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M3.40096 0.877905C3.07448 0.483688 2.69733 0.176476 2.25828 0.0547329C1.79109 -0.0728078 1.34079 0.0314757 0.929879 0.274962C0.040519 0.808314 -0.263486 1.97938 0.24874 2.89536L4.56047 10.3566C4.56047 10.3624 4.56047 10.368 4.56047 10.3796C4.55484 10.4028 4.53798 10.4319 4.51546 10.4493C3.86814 10.9304 3.13637 11.6551 2.73109 12.2059C2.07251 13.087 1.89805 14.2754 2.27519 15.3131C2.48345 15.9045 3.09132 16.0958 3.55851 15.9567C3.86247 15.8697 4.2171 15.7363 4.55483 15.6146C4.74621 15.545 4.93202 15.4756 5.10088 15.4118C5.62437 15.2321 6.08589 15.1103 6.46303 15.1161C6.85705 15.1161 7.27361 15.1335 7.69015 15.1451C8.41064 15.1741 9.14235 15.1972 9.82907 15.1624C10.9661 15.1044 12.1144 14.8842 13.2458 14.2117C15.9589 12.5943 16.6344 9.01157 15.4186 6.28683C14.8613 5.04041 14.0789 3.89835 13.015 3.24325C11.9174 2.56497 10.589 2.44322 9.07483 3.09832L6.52493 4.19975L3.40096 0.877905ZM1.9712 1.17938C1.853 1.14459 1.70666 1.15614 1.49277 1.27788C1.14378 1.48659 1.02558 1.95039 1.22259 2.30982L5.52861 9.75941C5.86635 10.3449 5.63556 11.0405 5.17399 11.3883C4.60548 11.8116 3.95822 12.4609 3.62049 12.9073C3.22084 13.4523 3.09697 14.1828 3.29961 14.8263C3.55854 14.7509 3.82313 14.6523 4.1102 14.548C4.30721 14.4726 4.51548 14.3914 4.74626 14.316C5.28101 14.1305 5.88889 13.9509 6.46866 13.9567C6.94148 13.9567 7.38617 13.9739 7.81397 13.9913C8.4838 14.0145 9.11985 14.0377 9.7728 14.0087C10.7973 13.9508 11.7542 13.7537 12.6829 13.203C14.7938 11.9508 15.4185 9.06365 14.3941 6.77372C13.8818 5.62585 13.2233 4.72734 12.4352 4.23457C11.6753 3.76498 10.7297 3.63738 9.50826 4.16493L6.95837 5.27231C6.53057 5.45782 6.03526 5.34755 5.71441 5.00551L2.5679 1.65479L2.55663 1.64319C2.30333 1.33593 2.1063 1.21416 1.9712 1.17938Z" fill="#65B042"/>
            </svg>
            <svg @click="deleteRow(rowIndex)" class="table-icon" width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.07812 0.546875L3.92969 3.625L5.80469 0.546875H7.5L4.73438 4.71875L7.58594 9H5.91406L3.96094 5.82812L2.00781 9H0.328125L3.17188 4.71875L0.414062 0.546875H2.07812Z" fill="#BE2323"/>
            </svg>


          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class=" app-table__pagination">
      <AppPagination  v-if="showPagination"
                      :totalItems="data.length"
                      :itemsPerPage="itemsPerPage"
                      v-model:modelValue="currentPage">

      </AppPagination>
    </div>
  </div>
</template>



<style scoped lang="scss">
.app-table{
  &__title{
    font-size: 14px;
    line-height: 16px;
  }
  &__btn{
    margin-left: auto;
  }
  &__pagination{
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
.filters{
display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 13px;
  &__content{
    display: flex;
    align-items: center;
    gap: 15px;
  }
}
.table {
  width: 100%;
  border-collapse: collapse;
  border-bottom: 1px solid var(--dark-blue);
  &-icons{
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &-icon{
    cursor: pointer;
  }
}

th, td {

  padding: 8px;
}

th {
 border-top: 1px solid var(--dark-blue);
  border-bottom: 1px solid var(--dark-blue);
  text-align: left;

}

button {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
}
</style>
